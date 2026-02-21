package com.dac.BookingService.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long showId;

    @NotEmpty
    private List<String> seatNumbers;

    @NotNull
    @Min(0)
    private Double amount;

    private String userPhone;
    private String userName;
    private String movieName;
    private String showTime;

    private String authHeader;
}
