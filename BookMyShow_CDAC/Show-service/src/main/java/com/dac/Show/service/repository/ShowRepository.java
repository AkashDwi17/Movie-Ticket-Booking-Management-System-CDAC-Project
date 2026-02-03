package com.dac.Show.service.repository;

import com.dac.Show.service.model.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByMovieId(String movieId);

    List<Show> findByTheatreId(Long theatreId);
}
