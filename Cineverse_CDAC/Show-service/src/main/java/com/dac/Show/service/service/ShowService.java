package com.dac.Show.service.service;

import com.dac.Show.service.dto.ShowDto;
import com.dac.Show.service.dto.TheatreResponse;
import com.dac.Show.service.exception.ServiceUnavailableException;
import com.dac.Show.service.exception.ShowNotFoundException;
import com.dac.Show.service.model.Show;
import com.dac.Show.service.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository repo;
    private final WebClient.Builder webClient;


    // CREATE
    public ShowDto create(ShowDto dto, String authHeader) {

        validateMovie(dto.getMovieId(), authHeader);
        validateTheatre(dto.getTheatreId());

        Show s = new Show();
        s.setMovieId(dto.getMovieId());
        s.setTheatreId(dto.getTheatreId());
        s.setShowDate(dto.getShowDate());
        s.setShowTime(dto.getShowTime());
        s.setPrice(dto.getPrice());

        repo.save(s);

        return toDto(s);
    }

    // UPDATE
    public ShowDto update(Long id, ShowDto dto, String authHeader) {

        Show s = repo.findById(id)
                .orElseThrow(() -> new ShowNotFoundException("Show not found"));

        validateMovie(dto.getMovieId(), authHeader);
        validateTheatre(dto.getTheatreId());

        s.setMovieId(dto.getMovieId());
        s.setTheatreId(dto.getTheatreId());
        s.setShowDate(dto.getShowDate());
        s.setShowTime(dto.getShowTime());
        s.setPrice(dto.getPrice());

        repo.save(s);

        return toDto(s);
    }

    // DELETE
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ShowNotFoundException("Show not found");
        }
        repo.deleteById(id);
    }

    // GET ALL SHOWS (USED BY DASHBOARD)
    public List<ShowDto> getAllShows() {
        return repo.findAll()
                .stream()
                .map(s -> ShowDto.builder()
                        .id(s.getId())
                        .movieId(s.getMovieId())
                        .theatreId(s.getTheatreId())
                        .showDate(s.getShowDate())
                        .showTime(s.getShowTime())
                        .price(s.getPrice())
                        .build()
                )
                .toList();
    }


    // GET BY MOVIE
    public List<ShowDto> getByMovie(String movieId) {
        return repo.findByMovieId(movieId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // GET BY THEATRE
    public List<ShowDto> getByTheatre(Long theatreId) {
        return repo.findByTheatreId(theatreId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    // REQUIRED BY BOOKING SERVICE
    public ShowDto getShowById(Long id) {
        Show show = repo.findById(id)
                .orElseThrow(() -> new ShowNotFoundException("Show ID " + id + " not found"));

        return toDto(show);
    }

    // FILTER BY MOVIE + CITY
    public List<ShowDto> getShowsByMovieAndCity(String movieId, String city) {
        return repo.findByMovieId(movieId)
                .stream()
                .map(this::toDto)
                .filter(dto -> dto.getCity() != null &&
                        dto.getCity().equalsIgnoreCase(city))
                .toList();
    }

    // MAP SHOW + THEATRE NAME + CITY
    private ShowDto toDto(Show s) {

        TheatreResponse theatre = null;

        try {
            theatre = webClient.build()
                    .get()
                    .uri("lb://theatre-service/api/theatres/view/" + s.getTheatreId())
                    .retrieve()
                    .bodyToMono(TheatreResponse.class)
                    .block();
        } catch (Exception ignored) {}

        return ShowDto.builder()
                .id(s.getId())
                .movieId(s.getMovieId())
                .theatreId(s.getTheatreId())
                .showDate(s.getShowDate())
                .showTime(s.getShowTime())
                .price(s.getPrice())
                .city(theatre != null ? theatre.getCity() : null)
                .theatreName(theatre != null ? theatre.getName() : null)
                .build();
    }

    // VALIDATE MOVIE
    private void validateMovie(String movieId, String authHeader) {
        try {
            webClient.build()
                    .get()
                    .uri("lb://movie-service/api/movies/" + movieId)
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();
        } catch (Exception e) {
            throw new ServiceUnavailableException("Movie service unavailable");
        }
    }

    // VALIDATE THEATRE
    private void validateTheatre(Long theatreId) {
        try {
            webClient.build()
                    .get()
                    .uri("lb://theatre-service/api/theatres/view/" + theatreId)
                    .retrieve()
                    .bodyToMono(Object.class)
                    .block();
        } catch (Exception e) {
            throw new ServiceUnavailableException("Theatre service unavailable");
        }
    }
}
