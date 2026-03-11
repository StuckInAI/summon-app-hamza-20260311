'use client';

import { useState } from 'react';

interface TodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
    } catch {
      setError('Failed to add todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todo-form-card">
      <h2>✨ Add New Todo</h2>
      {error && (
        <div className="error-banner">
          <span>⚠️</span> {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            className="form-input"
            placeholder="Add more details (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={2}
            maxLength={1000}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !title.trim()}
        >
          {loading ? '⏳ Adding...' : '+ Add Todo'}
        </button>
      </form>
    </div>
  );
}
