package com.dac.BookingService.dto;

import lombok.Data;
import java.util.List;

@Data
public class SeatLockRequest {

    private Long userId;
    private Long showId;
    private List<String> seatNumbers;

    private String authHeader;
}
