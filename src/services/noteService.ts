import axios from "axios";
import type { Note, CreateNoteRequest } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  query?: string
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
    sortBy: "createdAt",
  });

  if (query && query.trim()) {
    params.append("search", query);
  }

  const response = await axios.get<FetchNotesResponse>(
    `${API_URL}?${params.toString()}`,
    { headers }
  );
  return response.data;
};

export const createNote = async (newNote: CreateNoteRequest): Promise<Note> => {
  const response = await axios.post<Note>(API_URL, newNote, { headers });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${API_URL}/${id}`, { headers });
  return response.data;
};
