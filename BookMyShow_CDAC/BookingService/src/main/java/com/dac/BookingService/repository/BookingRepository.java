package com.dac.BookingService.repository;

import com.dac.BookingService.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    Optional<Booking> findByUserIdAndShowIdAndSeats(Long userId, Long showId, String seats);

    boolean existsByShowIdAndSeatsContaining(Long showId, String seatNumber);
}
