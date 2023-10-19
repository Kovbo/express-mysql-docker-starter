const express = require("express");
const pool = require("../db/connection");
const tasksRouter = express.Router();

tasksRouter.get("/api/v1/tasks", async (req, res) => {
  const [tasks] = await pool.query(`SELECT * FROM tasks`);

  res.json({ tasks: tasks });
});

tasksRouter.get("/api/v1/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  if (!taskId || isNaN(taskId)) {
    return res.status(400).json({ message: "Wrong input!" });
  }

  const [tasks] = await pool.query(`SELECT * FROM tasks WHERE id = ?`, [
    taskId,
  ]);

  if (tasks.length === 0) {
    return res.status(404).json({ message: "Not found!" });
  }

  res.json({ task: tasks[0] });
});

tasksRouter.post("/api/v1/tasks", async (req, res) => {
  const taskName = req.body.name;

  await pool.query(`INSERT INTO tasks (name) VALUES (?)`, [taskName]);

  res.status(201).json({ message: "Created!" });
});

tasksRouter.patch("/api/v1/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { name, completed } = req.body;

  const [tasks] = await pool.query(`SELECT * FROM tasks WHERE id = ?`, [
    taskId,
  ]);

  const updateData = {
    name: name,
    completed: completed,
  };

  if (tasks.length === 0) {
    return res.status(404).json({ message: "Not found!" });
  }

  await pool.query(`UPDATE tasks SET ? WHERE id = ?`, [updateData, taskId]);

  res
    .status(200)
    .json({ message: "Updated!", task: { ...tasks[0], ...updateData } });
});

tasksRouter.delete("/api/v1/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  await pool.query(`DELETE FROM tasks WHERE id = ?`, [taskId]);

  res.status(200).json({ mesage: "Deleted!" });
});

module.exports = tasksRouter;
