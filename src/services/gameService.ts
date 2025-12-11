import axiosInstance from "./axiosInstance";
import { API_CONFIG } from "@/config/api";

// Match backend JSON
export interface Question {
  puzzle_id: string;    // ✅ use string, not id
  image_url: string;
  difficulty: "easy" | "medium" | "hard";
  points_value: number;
  time_limit: number;
  created_at: string;
}

export interface AnswerData {
  puzzle_id: string;    // ✅ use string, not id
  answer: string;
  time_taken?: number;  // ✅ Add time_taken parameter
}

export interface AnswerResponse {
  correct: boolean;
  points_earned: number;
  coins_earned: number;
  total_score: number;
  total_coins: number;
  time_taken: number;
  multiplier: number;
  speed_bonus: number;
}

export interface FreezeTimerData {
  puzzle_id: string;
  freeze_seconds: number;
}

export interface FreezeTimerResponse {
  success: boolean;
  freeze_seconds: number;
  coins_spent: number;
  coins_left: number;
  active_until: string;
}

export interface DoublePointsData {
  puzzle_id: string;
}

export interface DoublePointsResponse {
  success: boolean;
  multiplier: number;
  coins_spent: number;
  coins_left: number;
  active_for_next: boolean;
}

export const gameService = {
  getQuestion: async (difficulty: string = 'medium'): Promise<Question> => {
    const response = await axiosInstance.get(`${API_CONFIG.ENDPOINTS.GET_QUESTION}?difficulty=${difficulty}`);
    return response.data as Question;
  },

  submitAnswer: async (data: AnswerData): Promise<AnswerResponse> => {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.SUBMIT_ANSWER,
      data
    );
    return response.data as AnswerResponse;
  },

  freezeTimer: async (data: FreezeTimerData): Promise<FreezeTimerResponse> => {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.FREEZE_TIMER,
      data
    );
    return response.data as FreezeTimerResponse;
  },

  doublePoints: async (data: DoublePointsData): Promise<DoublePointsResponse> => {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.DOUBLE_POINTS,
      data
    );
    return response.data as DoublePointsResponse;
  },
};
