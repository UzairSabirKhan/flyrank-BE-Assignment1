const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./openapi.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

let tasks = [
  { id: 1, title: "Review FlyRank lecture", done: true },
  { id: 2, title: "Build Project", done: false },
  { id: 3, title: "Push to GitHub", done: false },
];

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"],
  });
});

// GET /tasks - List all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - Retrieve single task
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  res.status(200).json(task);
});

// POST /tasks - Create task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validation: ensure title exists and is not an empty/whitespace string
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: "Field 'title' is required and cannot be empty" });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Replace task fields
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  const { title, done } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: "Field 'title' cannot be empty" });
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: "Field 'done' must be a boolean" });
  }

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "Provide at least 'title' or 'done' to update" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...(title !== undefined && { title: title.trim() }),
    ...(done !== undefined && { done })
  };

  res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id - Remove a task
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
