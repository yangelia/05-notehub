import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import { keepPreviousData } from "@tanstack/react-query";
import "./App.css";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes(page, search, 12),
    placeholderData: keepPreviousData,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>NoteHub</h1>
        <button onClick={() => setIsModalOpen(true)}>Create Note</button>
      </header>

      <SearchBox
        value={search}
        onChange={debouncedSearch}
        onClear={() => {
          setSearch("");
          setPage(1);
        }}
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}

      <NoteList notes={data?.notes || []} />

      {data && data.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default App;
