import { useState } from "react";
import API from "../api/axios";

export default function TaskList({ tasks, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    refresh();
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await API.put(`/tasks/${task.id}`, { status: newStatus });
    refresh();
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    await API.put(`/tasks/${id}`, { title: editTitle });
    setEditingId(null);
    refresh();
  };

  if (tasks.length === 0) {
    return <p className="task-empty">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className={`task-item ${task.status === "completed" ? "completed" : ""}`}>

          {/* TITLE or EDIT INPUT */}
          {editingId === task.id ? (
            <input
              className="task-edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
              autoFocus
            />
          ) : (
            <span className="task-title">{task.title}</span>
          )}

          <div className="task-actions">

            {editingId === task.id ? (
              /* SAVE button — edit mode এ */
              <button className="task-btn save" onClick={() => saveEdit(task.id)} title="Save">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            ) : (
              <>
                {/* EDIT button */}
                <button className="task-btn edit" onClick={() => startEdit(task)} title="Edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>

                {/* COMPLETE toggle button */}
                <button
                  className={`task-btn ${task.status === "completed" ? "complete" : "mark"}`}
                  onClick={() => toggleStatus(task)}
                  title={task.status === "completed" ? "Mark as pending" : "Mark as complete"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </>
            )}

            {/* DELETE button */}
            <button className="task-btn delete" onClick={() => deleteTask(task.id)} title="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}