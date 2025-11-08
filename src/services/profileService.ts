import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "@/config/api";

export interface GameHistory {
  puzzle_id: number;
  correct: boolean;
  points: number;
  time_taken: number;
  difficulty?: string;
}

export interface ProfileData {
  username: string;
  email: string;
  score: number;
  games_played: number;
  accuracy: number;
  recent_games: GameHistory[];
}

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.PROFILE);
    return response.data;
  },

  getHistory: async (): Promise<GameHistory[]> => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.HISTORY);
    return response.data;
  },
};
