import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./App.module.css";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
    placeholderData: (prev) => prev,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = (noteData: {
    title: string;
    content: string;
    tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  }) => {
    createNoteMutation.mutate(noteData);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("Delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  return (
    <div className={css.container}>
      <header className={css.header}>
        <h1 className={css.title}>NoteHub</h1>
        <SearchBox value={search} onChange={debouncedSearchChange} />
        <button className={css.addBtn} onClick={() => setIsModalOpen(true)}>
          + Add Note
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={(error as Error).message} />}

      {data && (
        <>
          <NoteList notes={data.notes} onDelete={handleDeleteNote} />
          {data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
