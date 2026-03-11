'use client';

import { useState } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, title: string, description: string) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setLoading(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDescription.trim());
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      {isEditing ? (
        <div className="todo-edit-form">
          <input
            type="text"
            className="edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={200}
            autoFocus
            placeholder="Todo title"
          />
          <textarea
            className="edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={1000}
            placeholder="Description (optional)"
            rows={2}
          />
          <div className="edit-actions">
            <button
              className="btn btn-success"
              onClick={handleSave}
              disabled={loading || !editTitle.trim()}
            >
              {loading ? '⏳' : '✓'} Save
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleCancel}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="todo-item-view">
          <div className="todo-checkbox-wrapper">
            <button
              className={`todo-checkbox${todo.completed ? ' checked' : ''}`}
              onClick={handleToggle}
              disabled={loading}
              title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            />
          </div>
          <div className="todo-content">
            <div className="todo-title">{todo.title}</div>
            {todo.description && (
              <div className="todo-description">{todo.description}</div>
            )}
            <div className="todo-meta">🕒 {formatDate(todo.createdAt)}</div>
          </div>
          <div className="todo-actions">
            <button
              className="btn btn-ghost"
              onClick={handleEdit}
              disabled={loading}
              title="Edit todo"
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
              title="Delete todo"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
