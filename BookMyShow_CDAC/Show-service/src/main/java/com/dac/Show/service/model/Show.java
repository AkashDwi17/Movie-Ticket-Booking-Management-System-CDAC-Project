package com.dac.Show.service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "shows")
@Data
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "movie_id")
    private String movieId;

    @Column(name = "theatre_id")
    private Long theatreId;

    @Column(name = "show_date")
    private String showDate;

    @Column(name = "show_time")
    private String showTime;

    private Double price;
}
