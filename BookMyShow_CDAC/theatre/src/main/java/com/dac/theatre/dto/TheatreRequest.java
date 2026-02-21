package com.dac.theatre.dto;

import com.dac.theatre.entity.ScreenType;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreRequest {

    @NotBlank(message = "Name cannot be empty")
    private String name;

    @NotBlank(message = "Address cannot be empty")
    private String address;

    @NotBlank(message = "City cannot be empty")
    private String city;

    @NotNull(message = "Screen type must be provided")
    private ScreenType screenType;

    @NotNull(message = "Total seats must be provided")
    @Positive(message = "Seats must be greater than zero")
    private Integer totalSeats;
}
