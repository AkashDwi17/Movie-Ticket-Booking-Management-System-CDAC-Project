package com.dac.theatre.controller;

import com.dac.theatre.dto.TheatreRequest;
import com.dac.theatre.dto.TheatreResponse;
import com.dac.theatre.service.TheatreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/theatres")
@RequiredArgsConstructor
public class TheatreController {

    private final TheatreService theatreService;

    // ---------- ADMIN ONLY ----------
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TheatreResponse createTheatre(@Valid @RequestBody TheatreRequest request) {
        return theatreService.createTheatre(request);
    }

    @PutMapping("/{id}")
    public TheatreResponse updateTheatre(@PathVariable Long id,
                                         @Valid @RequestBody TheatreRequest request) {
        return theatreService.updateTheatre(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTheatre(@PathVariable Long id) {
        theatreService.deleteTheatre(id);
    }

    // ---------- USER + ADMIN ----------
    @GetMapping("/list")
    public List<TheatreResponse> getTheatres(@RequestParam(required = false) String city) {
        return theatreService.getTheatres(city);
    }

    @GetMapping("/view/{id}")
    public TheatreResponse getTheatreById(@PathVariable Long id) {
        return theatreService.getTheatreById(id);
    }

    @GetMapping("/movie/{movieId}")
    public List<TheatreResponse> getTheatresByMovieAndCity(
            @PathVariable Long movieId,
            @RequestParam String city
    ) {
        return theatreService.getTheatresByMovieAndCity(movieId, city);
    }
}
