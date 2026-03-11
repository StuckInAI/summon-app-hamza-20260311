'use client';

import { useState, useEffect, useCallback } from 'react';
import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoData {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<TodoData[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (currentFilter: FilterType) => {
    try {
      setError(null);
      const url =
        currentFilter === 'all'
          ? '/api/todos'
          : `/api/todos?status=${currentFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data: TodoData[] = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTodos(filter);
  }, [filter, fetchTodos]);

  const handleAdd = async (title: string, description: string) => {
    try {
      setError(null);
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: description || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create todo');
      }
      await fetchTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      setError(null);
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error('Failed to update todo');
      await fetchTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleUpdate = async (
    id: number,
    title: string,
    description: string | null
  ) => {
    try {
      setError(null);
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update todo');
      }
      await fetchTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete todo');
      await fetchTodos(filter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <main className="container">
      <div className="app-header">
        <h1>✅ Todo App</h1>
        <p>Stay organized, get things done.</p>
      </div>

      <div className="card">
        <AddTodoForm onAdd={handleAdd} />
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="card">
        <div className="list-header">
          <div className="filter-group">
            {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
              <button
                key={f}
                className={`filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="active-count">
            <span>{activeCount}</span> item{activeCount !== 1 ? 's' : ''} left
          </div>
        </div>

        <TodoList
          todos={todos}
          loading={loading}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
