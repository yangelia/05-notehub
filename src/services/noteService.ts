import { api } from "../api/axiosInstance";
import type { Note, CreateNoteRequest } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  query?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (query) params.query = query;

  const { data } = await api.get("/notes", { params });
  return data;
};

export const createNote = async (newNote: CreateNoteRequest): Promise<Note> => {
  const { data } = await api.post("/notes", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};
