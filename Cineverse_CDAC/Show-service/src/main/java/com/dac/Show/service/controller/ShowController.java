package com.dac.Show.service.controller;

import com.dac.Show.service.dto.ShowDto;
import com.dac.Show.service.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService service;

    // Required by Booking
    @GetMapping("/{id}")
    public ResponseEntity<ShowDto> getShowById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getShowById(id));
    }

    //  ONE CLEAN ENDPOINT FOR MOVIE + OPTIONAL CITY
    @GetMapping("/by-movie/{movieId}")
    public List<ShowDto> getShows(
            @PathVariable String movieId,
            @RequestParam(required = false) String city
    ) {
        if (city == null || city.isBlank()) {
            return service.getByMovie(movieId);
        }
        return service.getShowsByMovieAndCity(movieId, city);
    }

    @GetMapping("/by-theatre/{theatreId}")
    public List<ShowDto> getByTheatre(@PathVariable Long theatreId) {
        return service.getByTheatre(theatreId);
    }

    @PostMapping
    public ShowDto create(
            @RequestBody ShowDto dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        return service.create(dto, authHeader);
    }

    @PutMapping("/{id}")
    public ShowDto update(
            @PathVariable Long id,
            @RequestBody ShowDto dto,
            @RequestHeader("Authorization") String authHeader
    ) {
        return service.update(id, dto, authHeader);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Show deleted successfully");
    }
    //  GET ALL SHOWS (ADMIN)
    @GetMapping
    public List<ShowDto> getAllShows() {
        return service.getAllShows();
    }

}
