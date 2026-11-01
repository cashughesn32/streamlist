import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
 
function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const controller = new AbortController();
 
    async function loadMovie() {
      setLoading(true);
      setError("");
      setMovie(null);
      const apiKey = process.env.REACT_APP_TMDB_API_KEY;
 
      if (!apiKey) {
        setError("TMDB API key is missing. Check .env.local.");
        setLoading(false);
        return;
      }
      if (!id) {
        setError("Movie ID is missing.");
        setLoading(false);
        return;
      }
 
      try {
        const params = new URLSearchParams({
          api_key: apiKey,
          language: "en-US",
        });
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(
            `Could not load movie details. Status: ${response.status}`
          );
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    loadMovie();
    return () => controller.abort();
  }, [id]);
 
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <Link to="/movies">Back to Movies</Link>
      <h1>Movie Details</h1>
      {loading && <p>Loading movie details...</p>}
      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}
      {!loading && !error && movie && (
        <div style={{ maxWidth: "700px", margin: "auto" }}>
          <h2>{movie.title}</h2>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={`${movie.title} poster`}
              style={{
                width: "250px",
                maxWidth: "100%",
                borderRadius: "8px",
              }}
            />
          )}
          <p>
            <strong>Release Date: </strong>
            {movie.release_date || "Unknown"}
          </p>
          <p>
            <strong>Rating: </strong>
            {typeof movie.vote_average === "number"
              ? movie.vote_average.toFixed(1)
              : "N/A"} / 10
          </p>
          <h3>Overview</h3>
          <p>{movie.overview || "No description available."}</p>
        </div>
      )}
      <p style={{ fontSize: "12px", marginTop: "30px" }}>
        This product uses the TMDB API but is not endorsed
        or certified by TMDB.
      </p>
    </main>
  );
}
 
export default MovieDetails;
