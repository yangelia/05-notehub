import axios from "axios";

const BASE_URL = "https://notehub-public.goit.study/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});
