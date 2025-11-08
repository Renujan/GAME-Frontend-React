import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "@/config/api";

export interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  games?: number;
  accuracy?: number;
}

export const leaderboardService = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.LEADERBOARD);
    return response.data;
  },
};
