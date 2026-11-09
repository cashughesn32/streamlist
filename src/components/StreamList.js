import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
 
function StreamList() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem("streamListItems");
      const parsed = savedItems ? JSON.parse(savedItems) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (item) =>
            item && typeof item.title === "string" && typeof item.completed === "boolean"
        )
        .map((item) => ({
          ...item,
          id:
            typeof item.id === "string" || typeof item.id === "number"
              ? item.id
              : window.crypto?.randomUUID?.() ??
                `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        }));
    } catch {
      return [];
    }
  });
 
  useEffect(() => {
    try {
      localStorage.setItem("streamListItems", JSON.stringify(items));
    } catch {
      // Storage unavailable or quota exceeded; keep in-memory list usable.
    }
  }, [items]);
 
  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() === "") return;
    setItems((prev) => [
      ...prev,
      {
        id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: title.trim(),
        completed: false,
      },
    ]);
    setTitle("");
  };
 
  const handleComplete = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };
 
  const handleEdit = (id) => {
    const current = items.find((item) => item.id === id);
    if (!current) return;
    const newTitle = window.prompt("Edit your movie or TV show:", current.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, title: newTitle.trim() } : item))
      );
    }
  };
 
  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };
 
  return (
    <div className="page">
      <h1>My StreamList</h1>
      <p>Add a movie or TV show you want to watch.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a movie or TV show"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button type="submit">Add to StreamList</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span style={{ textDecoration: item.completed ? "line-through" : "none" }}>
              {item.title}
            </span>
            <button type="button" onClick={() => handleComplete(item.id)}
              title={item.completed ? "Undo" : "Complete"}>
              <FontAwesomeIcon icon={faCheck} /> {item.completed ? "Undo" : "Complete"}
            </button>
            <button type="button" onClick={() => handleEdit(item.id)} title="Edit">
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
            <button type="button" onClick={() => handleDelete(item.id)} title="Delete">
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
 
export default StreamList;
