import { api } from "../api/axiosInstance";
import type { Note, CreateNoteRequest } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface ApiNoteResponse {
  note: Note;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  query?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (query && query.trim()) {
    params.search = query;
  }

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const createNote = async (newNote: CreateNoteRequest): Promise<Note> => {
  const { data } = await api.post<ApiNoteResponse>("/notes", newNote);
  return data.note;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<ApiNoteResponse>(`/notes/${id}`);
  return data.note;
};
