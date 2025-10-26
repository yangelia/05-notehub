import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import type { Note } from "../../types/note";
import type { AxiosError } from "axios";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Pagination from "../Pagination/Pagination";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";

function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: keepPreviousData,
  });

  const createNoteMutation = useMutation<
    Note,
    AxiosError,
    { title: string; content: string; tag: string }
  >({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error("Error creating note:", err.message);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      alert(err.response?.data?.message ?? err.message);
    },
  });

  const handleCreateNote = (noteData: {
    title: string;
    content: string;
    tag: string;
  }) => {
    console.log("createNote payload:", noteData);
    createNoteMutation.mutate(noteData);
  };

  const handleDeleteNote = (id: string) => {
    console.log("Delete requested id:", id);
    if (confirm("Delete this note?")) {
      deleteNoteMutation.mutate(id, {
        onSuccess: () => {
          console.log("Delete success for id:", id);
        },
        onError: (err) => {
          console.error("Delete failed for id:", id, err);
        },
      });
    }
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          + Create Note
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && (
        <ErrorMessage message={error?.message || "Something went wrong"} />
      )}

      {isSuccess && data && (
        <NoteList notes={data.notes} onDelete={handleDeleteNote} />
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
