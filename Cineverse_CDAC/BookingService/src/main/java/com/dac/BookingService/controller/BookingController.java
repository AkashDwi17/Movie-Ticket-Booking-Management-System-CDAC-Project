package com.dac.BookingService.controller;

import com.dac.BookingService.dto.BookingRequest;
import com.dac.BookingService.dto.BookingResponse;
import com.dac.BookingService.dto.SeatLockRequest;
import com.dac.BookingService.model.Booking;
import com.dac.BookingService.model.SeatLock;
import com.dac.BookingService.repository.BookingRepository;
import com.dac.BookingService.repository.SeatLockRepository;
import com.dac.BookingService.service.BookingService;
import com.dac.BookingService.service.SeatLockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final SeatLockService seatLockService;

    private final BookingRepository bookingRepository;
    private final SeatLockRepository seatLockRepository;

    // 1) LOCK SEATS  (used by frontend)
    @PostMapping("/lock")
    public ResponseEntity<List<SeatLock>> lockSeats(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody SeatLockRequest request) {

        // pass token to service (if needed)
        request.setAuthHeader(authHeader);
        return ResponseEntity.ok(seatLockService.lockSeats(request));
    }

    // 2) CONFIRM BOOKING  (used by frontend)
    @PostMapping("/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody BookingRequest request) {

        request.setAuthHeader(authHeader);
        return ResponseEntity.ok(bookingService.createBooking(request));
    }


// 8) GET ALL BOOKINGS (ADMIN PANEL)

    @GetMapping("/all")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        List<BookingResponse> responses = bookings.stream()
                .map(bookingService::mapToResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    // 3) GET BOOKING BY ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // 4) GET ALL BOOKINGS FOR USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    // 5) SOLD SEATS FOR A SHOW
    @GetMapping("/sold-seats/{showId}")
    public ResponseEntity<List<String>> getSoldSeats(@PathVariable Long showId) {

        List<Booking> bookings = bookingRepository.findAll()
                .stream()
                .filter(b -> Objects.equals(b.getShowId(), showId))
                .collect(Collectors.toList());

        List<String> soldSeats = bookings.stream()
                .flatMap(b -> Arrays.stream(b.getSeats().split(",")))
                .distinct()
                .toList();

        return ResponseEntity.ok(soldSeats);
    }

    // 6) LOCKED SEATS FOR A SHOW
    @GetMapping("/locked-seats/{showId}")
    public ResponseEntity<List<String>> getLockedSeats(@PathVariable Long showId) {

        List<SeatLock> locks = seatLockRepository.findAll()
                .stream()
                .filter(l -> Objects.equals(l.getShowId(), showId))
                .filter(l -> !l.isExpired())
                .toList();

        List<String> locked = locks.stream()
                .map(SeatLock::getSeatNumber)
                .distinct()
                .toList();

        return ResponseEntity.ok(locked);
    }

    // 7) UNIFIED SEAT STATUS (sold + locked)
    @GetMapping("/seat-status/{showId}")
    public ResponseEntity<List<Map<String, String>>> getSeatStatus(@PathVariable Long showId) {

        // SOLD
        List<String> soldSeats = bookingRepository.findAll()
                .stream()
                .filter(b -> Objects.equals(b.getShowId(), showId))
                .flatMap(b -> Arrays.stream(b.getSeats().split(",")))
                .distinct()
                .toList();

        // LOCKED (not yet confirmed)
        List<String> lockedSeats = seatLockRepository.findAll()
                .stream()
                .filter(l -> Objects.equals(l.getShowId(), showId))
                .filter(l -> !l.isExpired())
                .map(SeatLock::getSeatNumber)
                .distinct()
                .toList();

        // build combined list
        Set<String> allKnownSeats = new HashSet<>();
        allKnownSeats.addAll(soldSeats);
        allKnownSeats.addAll(lockedSeats);

        List<Map<String, String>> response = new ArrayList<>();

        for (String seat : allKnownSeats) {
            Map<String, String> entry = new HashMap<>();
            entry.put("seat", seat);

            if (soldSeats.contains(seat)) {
                entry.put("status", "sold");
            } else if (lockedSeats.contains(seat)) {
                entry.put("status", "locked");
            } else {
                entry.put("status", "available");
            }

            response.add(entry);
        }

        return ResponseEntity.ok(response);
    }
}
