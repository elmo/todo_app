import React, { useState, useEffect, JSX } from "react";
import api from "../utils/api";
import Login from "./Login";
import Register from "./Register";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

// 1. Define the Todo interface to match your Rails schema
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
}

// 2. Define the Auth types
type AuthMode = "login" | "register";

const App: React.FC = (): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Consolidated Gatekeeper
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {authMode === "login" ? (
          <Login 
            onLoginSuccess={() => setIsAuthenticated(true)} 
            onSwitchToRegister={() => setAuthMode("register")} 
          />
        ) : (
          <Register 
            onRegisterSuccess={() => setIsAuthenticated(true)} 
            onSwitchToLogin={() => setAuthMode("login")} 
          />
        )}
      </div>
    );
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const fetchTodos = async (): Promise<void> => {
    try {
      const { data } = await api.get<Todo[]>("/api/v1/todos");
      setTodos(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError("Could not load todos.");
      }
    }
  };

  const handleAddTodo = async (title: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post<Todo>("/api/v1/todos", { title, completed: false });
      setTodos((prev) => [data, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save todo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTodo = async (todo: Todo): Promise<void> => {
    try {
      await api.patch(`/api/v1/todos/${todo.id}`, { completed: !todo.completed });
      setTodos((prev) =>
        prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
      );
    } catch (err: any) {
      setError("Update failed.");
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTodos([]);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Tasks</h1>
        <button 
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          Logout
        </button>
      </div>

      <TodoForm onAdd={handleAddTodo} isLoading={isLoading} />

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xl">&times;</button>
        </div>
      )}

      <TodoList todos={todos} onToggle={handleToggleTodo} />
    </div>
  );
};

export default App;
