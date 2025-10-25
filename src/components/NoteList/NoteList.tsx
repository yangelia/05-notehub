import css from "./NoteList.module.css";
import type { Note } from "../../types/note";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

const NoteList = ({ notes, onDelete }: NoteListProps) => {
  if (notes.length === 0) {
    return <p className={css.empty}>No notes found</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.header}>
            <h3 className={css.title}>{note.title}</h3>
            <button className={css.deleteBtn} onClick={() => onDelete(note.id)}>
              ✕
            </button>
          </div>
          <p className={css.content}>{note.content}</p>
          <span className={css.tag}>{note.tag}</span>
          <time className={css.date}>
            {new Date(note.createdAt).toLocaleDateString()}
          </time>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
