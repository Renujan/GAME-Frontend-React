import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "@/config/api";

export interface GameHistory {
  puzzle_id: string;
  player_answer: string;
  is_correct: boolean;
  points_earned: number;
  time_taken: number;
  created_at: string; // Maps from attempted_at in serializer
}

export interface ProfileData {
  id: number;
  username: string;
  email: string;
  role: string;
  score: number;
  coins: number;
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
