package com.dac.BookingService.service;

import com.dac.BookingService.dto.SeatLockRequest;
import com.dac.BookingService.dto.ShowDTO;
import com.dac.BookingService.exception.ResourceNotFoundException;
import com.dac.BookingService.exception.SeatAlreadyBookedException;
import com.dac.BookingService.model.SeatLock;
import com.dac.BookingService.repository.BookingRepository;
import com.dac.BookingService.repository.SeatLockRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatLockService {

    private final SeatLockRepository seatLockRepository;
    private final BookingRepository bookingRepository;

    // MUST use LoadBalanced internal client
    @Qualifier("internalWebClient")
    private final WebClient.Builder webClient;

    private static final int LOCK_DURATION_MINUTES = 10;

    @Transactional
    public List<SeatLock> lockSeats(SeatLockRequest request) {

        System.out.println("Seat lock request: " + request);

        //  Validate Show via show-service
        ShowDTO show = webClient.build()
                .get()
                .uri("lb://show-service/api/shows/" + request.getShowId())
                .header("Authorization", request.getAuthHeader())
                .retrieve()
                .bodyToMono(ShowDTO.class)
                .onErrorResume(e -> {
                    System.out.println("Show-service ERROR = " + e.getMessage());
                    throw new ResourceNotFoundException(
                            "Could not validate show. Upstream error → " + e.getMessage()
                    );
                })
                .block();

        if (show == null || show.getId() == null) {
            throw new ResourceNotFoundException("Show ID " + request.getShowId() + " does not exist");
        }

        // Remove expired locks
        seatLockRepository.deleteByExpiresAtBefore(LocalDateTime.now());

        // Check for booked/locked conflicts
        List<String> conflict = new ArrayList<>();

        for (String seat : request.getSeatNumbers()) {

            boolean booked = bookingRepository.existsByShowIdAndSeatsContaining(
                    request.getShowId(), seat
            );
            if (booked) conflict.add(seat);

            boolean locked = !seatLockRepository
                    .findByShowIdAndSeatNumberInAndExpiresAtAfter(
                            request.getShowId(),
                            List.of(seat),
                            LocalDateTime.now()
                    ).isEmpty();
            if (locked) conflict.add(seat);
        }

        if (!conflict.isEmpty()) {
            throw new SeatAlreadyBookedException("Seats already taken: " + conflict);
        }

        //  Create new locks
        List<SeatLock> saved = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiry = now.plusMinutes(LOCK_DURATION_MINUTES);

        for (String seat : request.getSeatNumbers()) {
            SeatLock lock = SeatLock.builder()
                    .showId(request.getShowId())
                    .seatNumber(seat)
                    .userId(request.getUserId())
                    .createdAt(now)
                    .expiresAt(expiry)
                    .build();

            saved.add(seatLockRepository.save(lock));
        }

        return saved;
    }

    @Transactional
    public void releaseLocksForUser(Long userId, Long showId) {
        List<SeatLock> locks = seatLockRepository.findByUserIdAndShowId(userId, showId);
        seatLockRepository.deleteAll(locks);
    }
}
