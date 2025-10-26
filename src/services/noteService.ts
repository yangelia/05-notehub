import axios from "axios";
import type { Note, CreateNoteRequest } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_URL = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

export const fetchNotes = async (
  page: number = 1,
  search: string = "",
  perPage: number = 12
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("perPage", perPage.toString());
  if (search) {
    params.append("search", search);
  }

  const res = await axios.get<FetchNotesResponse>(
    `${API_URL}?${params.toString()}`,
    { headers }
  );
  return res.data;
};

export const createNote = async (note: CreateNoteRequest): Promise<Note> => {
  const res = await axios.post<Note>(API_URL, note, { headers });
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await axios.delete<Note>(`${API_URL}/${id}`, { headers });
  return res.data;
};
