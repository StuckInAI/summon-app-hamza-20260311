'use client';

import { useState } from 'react';
import { TodoData } from '@/app/page';

interface TodoItemProps {
  todo: TodoData;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onUpdate: (id: number, title: string, description: string | null) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TodoItem({
  todo,
  onToggle,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description ?? '');
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(todo.id, !todo.completed);
    } finally {
      setToggling(false);
    }
  };

  const handleEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description ?? '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await onUpdate(todo.id, editTitle.trim(), editDesc.trim() || null);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description ?? '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${todo.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`todo-item${todo.completed ? ' completed-item' : ''}`}>
      {/* Checkbox */}
      <div className="checkbox-wrap">
        <button
          className={`checkbox${todo.completed ? ' checked' : ''}`}
          onClick={handleToggle}
          disabled={toggling}
          aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {todo.completed && <span className="checkmark">✓</span>}
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="edit-form">
          <input
            className="input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Todo title"
            disabled={saving}
            autoFocus
          />
          <textarea
            className="input"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optional)"
            disabled={saving}
            rows={2}
          />
          <div className="edit-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving || !editTitle.trim()}
            >
              {saving ? 'Saving…' : '✓ Save'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="todo-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className={`todo-title${todo.completed ? ' completed-text' : ''}`}>
              {todo.title}
            </span>
            <span className={`badge ${todo.completed ? 'badge-completed' : 'badge-active'}`}>
              {todo.completed ? 'Done' : 'Active'}
            </span>
          </div>
          {todo.description && (
            <p className="todo-desc">{todo.description}</p>
          )}
          <p className="todo-date">Created {formatDate(todo.createdAt)}</p>
        </div>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="todo-actions">
          <button
            className="btn-icon"
            onClick={handleEdit}
            aria-label="Edit todo"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="btn-icon danger"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete todo"
            title="Delete"
          >
            {deleting ? '…' : '🗑️'}
          </button>
        </div>
      )}
    </div>
  );
}
