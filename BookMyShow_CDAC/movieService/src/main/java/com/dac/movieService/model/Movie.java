package com.dac.movieService.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "movies")
public class Movie {

    @Id
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
