package com.dac.theatre.dto;

import com.dac.theatre.entity.ScreenType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private ScreenType screenType;
    private Integer totalSeats;
}
