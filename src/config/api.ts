export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000",
  ENDPOINTS: {
    // Auth endpoints
    REGISTER: "/api/register/",
    LOGIN: "/api/login/",
    VERIFY_OTP: "/api/verify-otp/",
    LOGOUT: "/api/logout/",

    // Game endpoints
    GET_QUESTION: "/api/game/question/",
    SUBMIT_ANSWER: "/api/game/answer/",
    FREEZE_TIMER: "/api/game/freeze-timer/",
    DOUBLE_POINTS: "/api/game/double-points/",

    // Profile endpoints
    PROFILE: "/api/profile/",
    HISTORY: "/api/history/",

    // Leaderboard
    LEADERBOARD: "/api/leaderboard/",

    // Admin endpoints
    ADMIN_PLAYERS: "/api/admin/players/",
    ADMIN_DELETE_PLAYER: (id: number) => `/api/admin/players/${id}/delete/`,
    ADMIN_STATS: "/api/admin/stats/",
    ADMIN_PUZZLES: "/api/admin/puzzles/",
    ADMIN_DELETE_PUZZLE: (id: number) => `/api/admin/puzzles/${id}/delete/`,
  },
};
