const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { readData, writeData } = require("../utils/fileHandler");

const TASKS_FILE = "./data/tasks.json";

/* =========================
   CREATE TASK
========================= */
router.post("/", auth, (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  let tasks = readData(TASKS_FILE);

  const newTask = {
    id: Date.now().toString(), // FIX: consistent string id
    title,
    status: "pending",
    userId: req.user.id,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeData(TASKS_FILE, tasks);

  res.status(201).json({
    message: "Task created",
    task: newTask,
  });
});

/* =========================
   GET USER TASKS
========================= */
router.get("/", auth, (req, res) => {
  const tasks = readData(TASKS_FILE);

  const myTasks = tasks.filter(
    (task) => task.userId === req.user.id
  );

  res.json(myTasks);
});

/* =========================
   UPDATE TASK
========================= */
router.put("/:id", auth, (req, res) => {
  const taskId = req.params.id;

  let tasks = readData(TASKS_FILE);

  const task = tasks.find(
    (t) => t.id === taskId && t.userId === req.user.id
  );

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, status } = req.body;

  if (title !== undefined) task.title = title;
  if (status !== undefined) task.status = status;

  writeData(TASKS_FILE, tasks);

  res.json({
    message: "Task updated",
    task,
  });
});

/* =========================
   DELETE TASK
========================= */
router.delete("/:id", auth, (req, res) => {
  const taskId = req.params.id;

  let tasks = readData(TASKS_FILE);

  const taskExists = tasks.find(
    (t) => t.id === taskId && t.userId === req.user.id
  );

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const updatedTasks = tasks.filter(
    (t) => t.id !== taskId
  );

  writeData(TASKS_FILE, updatedTasks);

  res.json({
    message: "Task deleted",
  });
});

/* =========================
   ADMIN ONLY - ALL TASKS
========================= */
router.get("/admin/all", auth, admin, (req, res) => {
  const tasks = readData(TASKS_FILE);

  res.json({
    total: tasks.length,
    tasks,
  });
});

module.exports = router;