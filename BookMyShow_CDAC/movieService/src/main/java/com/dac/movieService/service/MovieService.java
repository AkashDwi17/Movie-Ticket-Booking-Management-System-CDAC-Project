package com.dac.movieService.service;

import com.dac.movieService.dto.MovieRequest;
import com.dac.movieService.dto.MovieResponse;
import com.dac.movieService.model.Movie;
import com.dac.movieService.exception.MovieNotFoundException;
import com.dac.movieService.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository repo;
    private final ImageUploadService imageUploadService;

    // CREATE MOVIE + POSTER
    public MovieResponse create(MovieRequest req, MultipartFile poster) {
        String posterUrl = null;

        if (poster != null && !poster.isEmpty()) {
            posterUrl = imageUploadService.uploadImage(poster);
        }

        Movie movie = Movie.builder()
                .title(req.getTitle())
                .genre(req.getGenre())
                .language(req.getLanguage())
                .durationMinutes(req.getDurationMinutes())
                .rating(req.getRating())
                .releaseDate(req.getReleaseDate())
                .posterUrl(posterUrl)
                .cast(req.getCast())     // ⭐ NEW
                .build();

        repo.save(movie);
        return toResponse(movie);
    }

    // UPDATE MOVIE + OPTIONAL POSTER
    public MovieResponse update(String id, MovieRequest req, MultipartFile poster) {
        Movie movie = repo.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found: " + id));

        movie.setTitle(req.getTitle());
        movie.setGenre(req.getGenre());
        movie.setLanguage(req.getLanguage());
        movie.setDurationMinutes(req.getDurationMinutes());
        movie.setRating(req.getRating());
        movie.setReleaseDate(req.getReleaseDate());
        movie.setCast(req.getCast());

        if (poster != null && !poster.isEmpty()) {
            String posterUrl = imageUploadService.uploadImage(poster);
            movie.setPosterUrl(posterUrl);
        }

        repo.save(movie);
        return toResponse(movie);
    }

    public MovieResponse get(String id) {
        Movie movie = repo.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found: " + id));
        return toResponse(movie);
    }

    public List<MovieResponse> list() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public void delete(String id) {
        if (!repo.existsById(id)) {
            throw new MovieNotFoundException("Movie not found: " + id);
        }
        repo.deleteById(id);
    }

    public List<MovieResponse> searchMovies(String query) {
        return repo
                .findByTitleContainingIgnoreCase(query)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    private MovieResponse toResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .durationMinutes(movie.getDurationMinutes())
                .rating(movie.getRating())
                .releaseDate(movie.getReleaseDate())
                .posterUrl(movie.getPosterUrl())
                .cast(movie.getCast())
                .build();
    }
}
