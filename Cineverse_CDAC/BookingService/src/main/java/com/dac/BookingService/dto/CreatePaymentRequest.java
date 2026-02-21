package com.dac.BookingService.dto;

import lombok.Data;

import java.util.List;
@Data
public class CreatePaymentRequest {
    private Long userId;
    private Long showId;
    private Long bookingId;
    private Integer amount;

    private List<String> seats;

    private String userName;
    private String userPhone;
    private String movieName;
    private String showTime;
}

