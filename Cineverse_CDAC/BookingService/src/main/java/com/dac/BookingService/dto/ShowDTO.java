package com.dac.BookingService.dto;

import lombok.Data;

@Data
public class ShowDTO {
    private Long id;
    private String movieId;
    private Long theatreId;
    private String showDate;
    private String showTime;
    private Double price;
}
