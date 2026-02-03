package com.dac.theatre.service;

import com.dac.theatre.dto.TheatreRequest;
import com.dac.theatre.dto.TheatreResponse;
import com.dac.theatre.entity.Theatre;
import com.dac.theatre.exception.TheatreNotFoundException;
import com.dac.theatre.repository.TheatreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TheatreService {

    private final TheatreRepository theatreRepository;

    // CREATE
    public TheatreResponse createTheatre(TheatreRequest req) {
        Theatre t = Theatre.builder()
                .name(req.getName())
                .address(req.getAddress())
                .city(req.getCity())
                .screenType(req.getScreenType())
                .totalSeats(req.getTotalSeats())
                .build();

        return mapToResponse(theatreRepository.save(t));
    }

    // LIST
    public List<TheatreResponse> getTheatres(String city) {
        List<Theatre> list = (city == null || city.isBlank())
                ? theatreRepository.findAll()
                : theatreRepository.findByCityIgnoreCase(city);

        return list.stream().map(this::mapToResponse).toList();
    }

    // GET BY ID
    public TheatreResponse getTheatreById(Long id) {
        Theatre t = theatreRepository.findById(id)
                .orElseThrow(() -> new TheatreNotFoundException("Theatre not found with id: " + id));
        return mapToResponse(t);
    }

    // UPDATE
    public TheatreResponse updateTheatre(Long id, TheatreRequest req) {
        Theatre t = theatreRepository.findById(id)
                .orElseThrow(() -> new TheatreNotFoundException("Theatre not found with id: " + id));

        t.setName(req.getName());
        t.setAddress(req.getAddress());
        t.setCity(req.getCity());
        t.setScreenType(req.getScreenType());
        t.setTotalSeats(req.getTotalSeats());

        return mapToResponse(theatreRepository.save(t));
    }

    // DELETE
    public void deleteTheatre(Long id) {
        if (!theatreRepository.existsById(id)) {
            throw new TheatreNotFoundException("Theatre not found with id: " + id);
        }
        theatreRepository.deleteById(id);
    }

    // get theatres for a movie in a city
    public List<TheatreResponse> getTheatresByMovieAndCity(Long movieId, String city) {
        List<Theatre> list = theatreRepository.findByCityIgnoreCase(city);
        return list.stream().map(this::mapToResponse).toList();
    }

    // MAPPER
    private TheatreResponse mapToResponse(Theatre t) {
        return TheatreResponse.builder()
                .id(t.getId())
                .name(t.getName())
                .address(t.getAddress())
                .city(t.getCity())
                .screenType(t.getScreenType())
                .totalSeats(t.getTotalSeats())
                .build();
    }
}
