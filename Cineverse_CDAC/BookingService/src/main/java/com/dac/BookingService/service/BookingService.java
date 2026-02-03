package com.dac.BookingService.service;

import com.dac.BookingService.dto.BookingRequest;
import com.dac.BookingService.dto.BookingResponse;
import com.dac.BookingService.dto.ShowDTO;
import com.dac.BookingService.exception.ResourceNotFoundException;
import com.dac.BookingService.exception.SeatAlreadyBookedException;
import com.dac.BookingService.model.Booking;
import com.dac.BookingService.repository.BookingRepository;
import com.dac.BookingService.repository.SeatLockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatLockRepository seatLockRepository;
    private final SeatLockService seatLockService;
    private final WhatsappService whatsappService;
    private final TicketPdfService ticketPdfService;

    @Qualifier("internalWebClient")
    private final WebClient.Builder webClient;

    private String cleanNumber(String number) {
        if (number == null) return null;
        return number.replace("+", "").replace(" ", "").trim();
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        // Check if seat already booked
        for (String seat : request.getSeatNumbers()) {
            boolean booked = bookingRepository
                    .existsByShowIdAndSeatsContaining(request.getShowId(), seat);

            if (booked) {
                throw new SeatAlreadyBookedException("Seat already booked: " + seat);
            }
        }

        //  Fetch Show details from show-service
        ShowDTO show = webClient.build()
                .get()
                .uri("lb://show-service/api/shows/" + request.getShowId())
                .header("Authorization", request.getAuthHeader())
                .retrieve()
                .bodyToMono(ShowDTO.class)
                .onErrorResume(e -> {
                    throw new ResourceNotFoundException(
                            "Show ID " + request.getShowId() + " not found");
                })
                .block();

        if (show == null || show.getId() == null) {
            throw new ResourceNotFoundException("Show ID " + request.getShowId() + " not found");
        }

        // Save Booking
        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .showId(request.getShowId())
                .theatreId(show.getTheatreId())
                .movieId(show.getMovieId())
                .seats(String.join(",", request.getSeatNumbers()))
                .amount(request.getAmount())
                .status(Booking.BookingStatus.CONFIRMED)
                .bookingTime(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        //  Release locks for this user/show
        seatLockService.releaseLocksForUser(request.getUserId(), request.getShowId());

        // Generate PDF + Send WhatsApp (template + PDF)
        try {
            String phone = cleanNumber(request.getUserPhone());

            if (phone == null || phone.isBlank()) {
                System.out.println("⚠ WARNING: WhatsApp NOT SENT — phone number missing in request");
            } else {
                byte[] pdfBytes = null;
                try {
                    pdfBytes = ticketPdfService.generateTicketPdf(saved, request, show);
                } catch (Exception e) {
                    System.out.println("⚠ WARNING: Failed to generate ticket PDF: " + e.getMessage());
                }

                Mono<String> templateMono = whatsappService.sendBookingTicket(
                        phone,
                        request.getUserName() != null ? request.getUserName() : "",
                        request.getMovieName() != null ? request.getMovieName() : "",
                        request.getShowTime() != null ? request.getShowTime() : "",
                        String.join(", ", request.getSeatNumbers()),
                        saved.getId().toString()
                );

                Mono<String> pdfMono = (pdfBytes != null)
                        ? whatsappService.sendTicketPdf(
                        phone,
                        pdfBytes,
                        "ticket-" + saved.getId() + ".pdf"
                )
                        : Mono.empty();

                templateMono
                        .then(pdfMono)
                        .subscribe(
                                success -> System.out.println("WhatsApp SENT (template + pdf)"),
                                error -> System.out.println("WhatsApp ERROR: " + error.getMessage())
                        );
            }

        } catch (Exception e) {
            System.out.println("WhatsApp FAILED: " + e.getMessage());
        }

        //  Build response and override movieName & showTime
        BookingResponse response = mapToResponse(saved);
        response.setMovieName(request.getMovieName());
        response.setShowTime(request.getShowTime());

        return response;
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found: " + id));

        return mapToResponse(booking);
    }

    public List<BookingResponse> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //  made public so we *can* reuse if needed, but not required now
    public BookingResponse mapToResponse(Booking booking) {
        List<String> seats = Arrays.asList(booking.getSeats().split(","));

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .showId(booking.getShowId())
                .theatreId(booking.getTheatreId())
                .movieId(booking.getMovieId())
                .movieName(null)
                .showTime(null)
                .seatNumbers(seats)
                .amount(booking.getAmount())
                .status(booking.getStatus().name())
                .bookingTime(booking.getBookingTime())
                .build();
    }
}
