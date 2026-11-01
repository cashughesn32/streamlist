import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
 
function StreamList() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem("streamListItems");
      return savedItems ? JSON.parse(savedItems) : [];
    } catch {
      return [];
    }
  });
 
  useEffect(() => {
    localStorage.setItem("streamListItems", JSON.stringify(items));
  }, [items]);
 
  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() === "") return;
    setItems([...items, { title: title.trim(), completed: false }]);
    setTitle("");
  };
 
  const handleComplete = (index) => {
    setItems(items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, completed: !item.completed } : item
    ));
  };
 
  const handleEdit = (index) => {
    const newTitle = window.prompt("Edit your movie or TV show:", items[index].title);
    if (newTitle !== null && newTitle.trim() !== "") {
      setItems(items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, title: newTitle.trim() } : item
      ));
    }
  };
 
  const handleDelete = (index) => {
    setItems(items.filter((item, itemIndex) => itemIndex !== index));
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
        {items.map((item, index) => (
          <li key={index}>
            <span style={{ textDecoration: item.completed ? "line-through" : "none" }}>
              {item.title}
            </span>
            <button type="button" onClick={() => handleComplete(index)}
              title={item.completed ? "Undo" : "Complete"}>
              <FontAwesomeIcon icon={faCheck} /> {item.completed ? "Undo" : "Complete"}
            </button>
            <button type="button" onClick={() => handleEdit(index)} title="Edit">
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
            <button type="button" onClick={() => handleDelete(index)} title="Delete">
              <FontAwesomeIcon icon={faTrash} /> Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
 
export default StreamList;
