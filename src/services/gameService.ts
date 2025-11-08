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
  puzzle_id: string;    // ✅ must be string
  answer: string;
}

export interface AnswerResponse {
  correct: boolean;
  points_awarded: number;
  new_score: number;
}

export const gameService = {
  getQuestion: async (): Promise<Question> => {
    const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.GET_QUESTION);
    return response.data as Question;
  },

  submitAnswer: async (data: AnswerData): Promise<AnswerResponse> => {
    const response = await axiosInstance.post(
      API_CONFIG.ENDPOINTS.SUBMIT_ANSWER,
      data
    );
    return response.data as AnswerResponse;
  },
};
