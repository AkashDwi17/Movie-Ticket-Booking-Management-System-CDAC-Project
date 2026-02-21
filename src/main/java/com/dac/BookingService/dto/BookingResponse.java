package com.dac.BookingService.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BookingResponse {

    private Long bookingId;
    private Long userId;
    private Long showId;

    private Long theatreId;
    private String movieId;
    private String movieName;
    private String showTime;
    private List<String> seatNumbers;
    private Double amount;
    private String status;
    private LocalDateTime bookingTime;
}
