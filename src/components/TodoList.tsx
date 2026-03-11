'use client';

import { TodoData } from '@/app/page';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: TodoData[];
  loading: boolean;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, title: string, description: string | null) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoList({
  todos,
  loading,
  onToggle,
  onUpdate,
  onDelete,
}: TodoListProps) {
  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        <span className="loading-text">Loading todos…</span>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>No todos found</p>
        <small>Add a new todo above to get started!</small>
      </div>
    );
  }

  return (
    <ul className="todo-list" style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
