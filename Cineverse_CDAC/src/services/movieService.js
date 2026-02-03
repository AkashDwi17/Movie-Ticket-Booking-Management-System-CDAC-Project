import api from "../apiClient";

export const getAllMovies = async () => {
  const res = await api.get("/api/movies");
  return res.data;
};
