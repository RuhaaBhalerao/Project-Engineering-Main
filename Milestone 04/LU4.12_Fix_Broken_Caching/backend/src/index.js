const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const cacheService = require('./services/cacheService');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /tasks
app.get('/tasks', async (req, res) => {
  try {
    const cacheKey = cacheService.tasksListKey();
    const cachedTasks = cacheService.get(cacheKey);

    if (cachedTasks !== undefined) {
      return res.status(200).json(cachedTasks);
    }

    const tasks = await prisma.task.findMany();
    cacheService.set(cacheKey, tasks);

    return res.status(200).json(tasks);
  } catch (err) {
    console.log('Error fetching tasks', err);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// GET /tasks/:id
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const taskId = Number.parseInt(id, 10);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  const cacheKey = cacheService.taskKey(taskId);

  try {
    const cachedTask = cacheService.get(cacheKey);

    if (cachedTask !== undefined) {
      return res.status(200).json(cachedTask);
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    cacheService.set(cacheKey, task);

    return res.status(200).json(task);
  } catch (err) {
    console.log('Error fetching task', err);
    return res.status(500).json({ message: 'Error fetching task' });
  }
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: { title, description, price: parseFloat(price) }
    });

    cacheService.set(cacheService.taskKey(newTask.id), newTask);
    cacheService.delete(cacheService.tasksListKey());

    return res.status(201).json(newTask);
  } catch (err) {
    console.log('Error creating task', err);
    return res.status(500).json({ message: 'Error creating task' });
  }
});

// PUT /tasks/:id
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const taskId = Number.parseInt(id, 10);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  const { title, description, price } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, price: parseFloat(price) }
    });

    cacheService.set(cacheService.taskKey(taskId), updatedTask);
    cacheService.delete(cacheService.tasksListKey());

    return res.status(200).json(updatedTask);
  } catch (err) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Error updating task', err);
    return res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const taskId = Number.parseInt(id, 10);

  if (Number.isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  try {
    await prisma.task.delete({
      where: { id: taskId }
    });

    cacheService.delete(cacheService.taskKey(taskId));
    cacheService.delete(cacheService.tasksListKey());

    return res.status(204).send();
  } catch (err) {
    if (err?.code === 'P2025') {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Error deleting task', err);
    return res.status(500).json({ message: 'Error deleting task' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Broken Server running on http://localhost:${PORT}`);
});
