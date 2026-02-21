package com.dac.BookingService.repository;


import com.dac.BookingService.model.SeatLock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface SeatLockRepository extends JpaRepository<SeatLock, Long> {

    List<SeatLock> findByShowIdAndSeatNumberInAndExpiresAtAfter(
            Long showId, List<String> seatNumbers, LocalDateTime now);

    void deleteByExpiresAtBefore(LocalDateTime time);

    List<SeatLock> findByUserIdAndShowId(Long userId, Long showId);
}
