import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "@/config/api";

export interface Player {
  id: number;
  username: string;
  email: string;
  score: number;
}

export interface AdminStats {
  total_players: number;
  total_games: number;
  total_correct_answers: number;
  overall_accuracy: number;
  daily_stats: {
    date: string;
    games: number;
    correct: number;
    accuracy: number;
  }[];
}


export interface PuzzleData {
  image_url: string;
  solution: string;
  difficulty: string;
}

export interface Puzzle {
  id: number;
  image_url: string;
  difficulty: string;
  solution: string;
}

export const adminService = {
  getPlayers: async (): Promise<Player[]> => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN_PLAYERS);
    return response.data;
  },

  deletePlayer: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.ENDPOINTS.ADMIN_DELETE_PLAYER(id));
  },

  getStats: async (): Promise<AdminStats> => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.ADMIN_STATS);
    return response.data;
  },

  createPuzzle: async (data: PuzzleData): Promise<Puzzle> => {
    const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.ADMIN_PUZZLES, data);
    return response.data;
  },

  deletePuzzle: async (id: number): Promise<void> => {
    await axiosInstance.delete(API_CONFIG.ENDPOINTS.ADMIN_DELETE_PUZZLE(id));
  },
};
