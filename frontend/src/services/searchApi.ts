import api from "./api";
import { SearchResult } from "../types/search";

export async function searchApi(query: string): Promise<SearchResult[]> {
  const res = await api.get(`/search`, { params: { q: query } });
  return res.data.results;
}
