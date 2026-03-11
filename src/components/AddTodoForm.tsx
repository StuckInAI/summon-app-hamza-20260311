'use client';

import { useState, FormEvent } from 'react';

interface AddTodoFormProps {
  onAdd: (title: string, description: string) => Promise<void>;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await onAdd(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setShowDesc(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add New Todo</h2>
      <div className="form-row">
        <input
          className="input"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || !title.trim()}
        >
          {loading ? 'Adding…' : '+ Add'}
        </button>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setShowDesc((v) => !v)}
        >
          {showDesc ? '− Hide description' : '+ Add description'}
        </button>
      </div>
      {showDesc && (
        <textarea
          className="input"
          placeholder="Optional description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          rows={2}
        />
      )}
    </form>
  );
}
