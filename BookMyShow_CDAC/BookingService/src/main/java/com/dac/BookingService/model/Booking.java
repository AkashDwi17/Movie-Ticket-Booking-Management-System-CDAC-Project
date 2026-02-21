package com.dac.BookingService.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long showId;

    private Long theatreId;

    private String movieId;

    // Example: "A1,A2,A3"
    private String seats;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    private LocalDateTime bookingTime;

    public enum BookingStatus {
        CONFIRMED,
        CANCELLED
    }
}
