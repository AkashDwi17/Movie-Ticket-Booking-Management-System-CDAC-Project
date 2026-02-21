package com.dac.movieService.controller;

import com.dac.movieService.dto.MovieRequest;
import com.dac.movieService.dto.MovieResponse;
import com.dac.movieService.service.MovieService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService service;
    private final ObjectMapper mapper = new ObjectMapper();

    // CREATE
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MovieResponse> create(
            @RequestPart("movie") String movieJson,
            @RequestPart(value = "poster", required = false) MultipartFile poster
    ) throws Exception {

        MovieRequest req = mapper.readValue(movieJson, MovieRequest.class);
        return ResponseEntity.ok(service.create(req, poster));
    }


    // SEARCH MOVIES
    @GetMapping("/search")
    public ResponseEntity<List<MovieResponse>> searchMovies(@RequestParam String query) {
        return ResponseEntity.ok(service.searchMovies(query));
    }


    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(service.get(id));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<MovieResponse>> list() {
        return ResponseEntity.ok(service.list());
    }

    // UPDATE
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MovieResponse> update(
            @PathVariable String id,
            @RequestPart("movie") String movieJson,
            @RequestPart(value = "poster", required = false) MultipartFile poster
    ) throws Exception {

        MovieRequest req = mapper.readValue(movieJson, MovieRequest.class);
        return ResponseEntity.ok(service.update(id, req, poster));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
