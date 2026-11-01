import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
function Movies() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const controller = new AbortController();
    const key = process.env.REACT_APP_TMDB_API_KEY;
 
    async function getMovies() {
      setLoading(true);
      setError("");
      if (!key) {
        setError("TMDB key missing. Check .env.local and restart npm start.");
        setLoading(false);
        return;
      }
 
      const path = searchTerm.trim()
        ? "/search/movie"
        : "/movie/popular";
      const params = new URLSearchParams({
        api_key: key,
        language: "en-US",
        page: "1"
      });
      if (searchTerm.trim()) params.set("query", searchTerm.trim());
 
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3${path}?${params}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Could not load movies.");
        const data = await response.json();
        setMovies(data.results || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
 
    getMovies();
    return () => controller.abort();
  }, [searchTerm]);
 
  function handleSearch(event) {
    event.preventDefault();
    setSearchTerm(query);
  }
 
  return (
    <main style={{ padding: "20px" }}>
      <h1>Movies</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          aria-label="Movie title"
          placeholder="Search for a movie..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ padding: "10px", marginRight: "8px" }}
        />
        <button type="submit">Search</button>
        <button
          type="button"
          onClick={() => { setQuery(""); setSearchTerm(""); }}
          style={{ marginLeft: "8px" }}
        >
          Popular Movies
        </button>
      </form>
      {loading && <p>Loading movies...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p>No movies found. Try another title.</p>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "20px"
      }}>
        {movies.map((movie) => (
          <article key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={`${movie.title} poster`}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              ) : <p>No poster available</p>}
              <h3>{movie.title}</h3>
            </Link>
            <p>Rating: {movie.vote_average?.toFixed(1) ?? "N/A"}/10</p>
          </article>
        ))}
      </div>
      <p style={{ fontSize: "12px", marginTop: "25px" }}>
        This product uses the TMDB API but is not endorsed or
        certified by TMDB.
      </p>
    </main>
  );
}
 
export default Movies;

