import { useState } from "react";
import API from "../api/axios";

export default function TaskForm({ refresh }) {
  const [title, setTitle] = useState("");

  const addTask = async () => {
    await API.post("/tasks", { title });
    setTitle("");
    refresh();
  };

  return (
    <div>
      <input
        value={title}
        placeholder="New task"
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={addTask}>Add</button>
    </div>
  );
}