package com.dac.movieService.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class MovieRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;

    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 10")
    @DecimalMax(value = "10.0", message = "Rating must be between 0 and 10")
    private Double rating;

    @NotBlank(message = "Release date is required")
    private String releaseDate;

    private List<String> cast;
}
