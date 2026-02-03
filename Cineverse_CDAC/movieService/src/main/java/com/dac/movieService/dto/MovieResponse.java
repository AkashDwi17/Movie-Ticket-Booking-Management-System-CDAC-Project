package com.dac.movieService.dto;


import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MovieResponse {

    private String id;
    private String title;
    private String genre;
    private String language;
    private Integer durationMinutes;
    private Double rating;
    private String releaseDate;
    private String posterUrl;
    private List<String> cast;

}
