import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StreamList from './components/StreamList';
import Movies from './components/Movies';
import Cart from './components/Cart';
import About from './components/About';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/">StreamList</Link> |{" "}
          <Link to="/movies">Movies</Link> |{" "}
          <Link to="/cart">Cart</Link> |{" "}
          <Link to="/about">About</Link>
        </nav>

        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
