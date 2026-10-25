import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

function StreamList() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      return;
    }

    console.log("StreamList entry:", title);

    setItems([
      ...items,
      {
        title: title,
        completed: false,
      },
    ]);

    setTitle("");
  };

  const handleComplete = (index) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  const handleEdit = (index) => {
    const newTitle = window.prompt(
      "Edit your movie or TV show:",
      items[index].title
    );

    if (newTitle !== null && newTitle.trim() !== "") {
      const updatedItems = [...items];
      updatedItems[index].title = newTitle;
      setItems(updatedItems);
    }
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((item, itemIndex) => {
      return itemIndex !== index;
    });

    setItems(updatedItems);
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
            <span
              style={{
                textDecoration: item.completed ? "line-through" : "none",
              }}
            >
              {item.title}
            </span>

            <button
  type="button"
  onClick={() => handleComplete(index)}
  title={item.completed ? "Undo" : "Complete"}
>
  <FontAwesomeIcon icon={faCheck} /> {item.completed ? "Undo" : "Complete"}
</button>
 
<button
  type="button"
  onClick={() => handleEdit(index)}
  title="Edit"
>
  <FontAwesomeIcon icon={faPen} /> Edit
</button>
 
<button
  type="button"
  onClick={() => handleDelete(index)}
  title="Delete"
>
  <FontAwesomeIcon icon={faTrash} /> Delete
</button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;
