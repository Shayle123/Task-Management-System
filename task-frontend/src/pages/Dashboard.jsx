import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "../index.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data || []);
    } catch (error) {
      console.log("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Task Dashboard</h1>
            <p>Manage and track your team's tasks</p>
          </div>
          <span className="header-badge">
            <span className="badge-dot" />
            {pending} due today
          </span>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">All tasks</div>
            <div className="progress-bar">
              <div className="progress-fill neutral" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value green">{completed}</div>
            <div className="stat-sub">{completionRate}% completion rate</div>
            <div className="progress-bar">
              <div className="progress-fill green" style={{ width: `${completionRate}%` }} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value amber">{pending}</div>
            <div className="stat-sub">{total - completionRate > 0 ? "In progress" : "All done"}</div>
            <div className="progress-bar">
              <div className="progress-fill amber" style={{ width: `${100 - completionRate}%` }} />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">

          {/* CREATE TASK */}
          <div className="card">
            <div className="card-title">
              <span className="card-title-icon">＋</span>
              Create Task
            </div>
            <TaskForm refresh={fetchTasks} />
          </div>

          {/* TASK LIST */}
          <div className="card task-section">
            <div className="card-title">
              <span className="card-title-icon">☑</span>
              Your Tasks
            </div>

            {/* FILTER BAR */}
            <div className="filter-bar">
              {["all", "pending", "completed"].map((f) => (
                <button
                  key={f}
                  className={`filter-btn${filter === f ? " active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <TaskList
              tasks={tasks.filter((t) => {
                if (filter === "completed") return t.status === "completed";
                if (filter === "pending") return t.status !== "completed";
                return true;
              })}
              refresh={fetchTasks}
            />
          </div>

        </div>
      </div>
    </div>
  );
}