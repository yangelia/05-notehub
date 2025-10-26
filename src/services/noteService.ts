import axios from "axios";
import type { Note } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

console.log("NOTEHUB token present:", !!token);

const headers = {
  Authorization: token ? `Bearer ${token}` : "",
  "Content-Type": "application/json",
};

interface NoteApiResponse {
  _id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt: string;
  updatedAt: string;
}

interface NotesApiResponse {
  notes: NoteApiResponse[];
  totalPages: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page = 1,
  query = ""
): Promise<FetchNotesResponse> => {
  const url = `${API_URL}?page=${page}&perPage=12${
    query ? `&search=${encodeURIComponent(query)}` : ""
  }`;
  try {
    const { data } = await axios.get<NotesApiResponse>(url, { headers });
    return {
      notes: data.notes.map((note) => ({
        id: note._id,
        title: note.title,
        content: note.content,
        tag: note.tag,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })),
      totalPages: data.totalPages,
    };
  } catch (err) {
    console.error("fetchNotes error:", err);
    throw err;
  }
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  try {
    const { data } = await axios.post<NoteApiResponse>(API_URL, note, {
      headers,
    });
    return {
      id: data._id,
      title: data.title,
      content: data.content,
      tag: data.tag,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (err) {
    console.error("createNote error:", err);
    throw err;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, { headers });
  } catch (err) {
    console.error("deleteNote error:", err);
    throw err;
  }
};
