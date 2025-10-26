// components/NoteForm/NoteForm.tsx
import { useState } from "react";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (note: { title: string; content: string; tag: string }) => void;
  onClose: () => void;
}

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const NoteForm = ({ onSubmit, onClose }: NoteFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, content, tag });

    setTitle("");
    setContent("");
    setTag("Todo");
    // onClose();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <h2 className={css.heading}>Create new note</h2>

      <label className={css.label}>
        Title
        <input
          className={css.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label className={css.label}>
        Content
        <textarea
          className={css.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>

      <label className={css.label}>
        Tag
        <select
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {tags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button type="submit" className={css.button}>
          Save
        </button>
        <button type="button" onClick={onClose} className={css.cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
