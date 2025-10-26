import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
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

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const debouncedSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 1000);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search),
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
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
    console.log("delete requested id:", id);
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
      {isError && (
        <ErrorMessage message={error?.message || "Something went wrong"} />
      )}

      {isSuccess && data && (
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
