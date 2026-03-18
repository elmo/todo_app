import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";

console.log(axios.defaults.baseURL);

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get the auth header
  const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. Fetch Todos (GET)
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("/api/v1/todos", {
          headers: authHeader()
        });
        // Axios puts the data directly in .data
        setTodos(response.data);
      } catch (err) {
        setError("Could not load todos.");
      }
    };
    fetchTodos();
  }, []);

  // 2. Add Todo (POST)
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add a todo.There is no token");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Axios handles JSON.stringify(body) automatically
      const response = await axios.post(
        "/api/v1/todos",
        { title: newTodo, completed: false },
        { headers: authHeader() }
      );

      setTodos([response.data, ...todos]);
      setNewTodo("");
    } catch (err) {
      // Axios puts server error messages in err.response.data
      const msg = err.response?.data?.error || "Failed to save todo.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Toggle Todo (PATCH)
  const toggleTodo = async (todo) => {
    try {
      await axios.patch(
        `/api/v1/todos/${todo.id}`,
        { completed: !todo.completed },
        { headers: authHeader() }
      );
      
      setTodos(todos.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)));
    } catch (err) {
      setError("Could not update todo.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Rails 8 + React Todos</h1>
      
      <form onSubmit={addTodo} className="flex flex-col mb-4">
        <div className="flex">
          <input
            type="text"
            className="border p-2 flex-grow rounded-l"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-r disabled:bg-blue-300"
          >
            {isLoading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 flex justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="mr-2"
            />
            <span className={todo.completed ? "line-through text-gray-400" : ""}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
