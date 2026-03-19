import React, { useState, JSX } from "react";

// 1. Define the interface for the component props
interface TodoFormProps {
  onAdd: (title: string) => Promise<void> | void;
  isLoading: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAdd, isLoading }): JSX.Element => {
  const [title, setTitle] = useState<string>("");

  // 2. Type the form submission event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    // Prevent empty submissions
    if (!title.trim()) return;

    onAdd(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        className="border p-2 flex-grow rounded-l focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
        value={title}
        // 3. Type the input change event
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        disabled={isLoading || !title.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded-r disabled:bg-blue-300 transition-colors font-semibold"
      >
        {isLoading ? "..." : "Add"}
      </button>
    </form>
  );
};

export default TodoForm;
