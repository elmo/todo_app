import React, { JSX } from "react";

// 1. Define the Todo interface (ideally, this would be imported from App.tsx)
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// 2. Define Props for the individual item
interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }): JSX.Element => (
  <li className="flex items-center mb-2 p-2 hover:bg-gray-50 rounded transition-colors group">
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo)}
      className="mr-3 h-5 w-5 accent-blue-600 cursor-pointer rounded border-gray-300 focus:ring-blue-500"
    />
    <span 
      className={`transition-all duration-200 ${
        todo.completed ? "line-through text-gray-400" : "text-gray-700 font-medium"
      }`}
    >
      {todo.title}
    </span>
  </li>
);

// 3. Define Props for the list
interface TodoListProps {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle }): JSX.Element => (
  <ul className="divide-y divide-gray-100 bg-white rounded-lg">
    {todos.length === 0 ? (
      <li className="p-4 text-center text-gray-400 italic">No tasks yet. Add one above!</li>
    ) : (
      todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))
    )}
  </ul>
);

export default TodoList;
