package com.dac.Show.service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ShowDto {

    private Long id;
    private String movieId;
    private Long theatreId;
    private String showDate;
    private String showTime;
    private Double price;
    private String city;
    private String theatreName;

}
