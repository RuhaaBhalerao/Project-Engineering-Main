import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      title: input,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add task"
      />
      <button onClick={addTask}>Add</button>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            onClick={() => toggleTask(task.id)}
            style={{
              cursor: "pointer",
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
