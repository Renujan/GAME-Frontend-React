import React from "react";
import { Button } from "@/components/ui/button";

// Types for the difficulty selector
export interface DifficultyOption {
  level: string;
  emoji: string;
  label: string;
  desc: string;
  color: string;
  hover: string;
}

interface DifficultySelectorProps {
  onDifficultySelect: (difficulty: string) => void;
  loading: boolean;
}

// Difficulty options data
const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    level: 'easy',
    emoji: '🟢',
    label: 'Easy Peasy',
    desc: '60 seconds, 10 points',
    color: 'from-green-500 to-emerald-500',
    hover: 'hover:from-green-600 hover:to-emerald-600'
  },
  {
    level: 'medium',
    emoji: '🟡',
    label: 'Monkey Challenge',
    desc: '45 seconds, 20 points',
    color: 'from-yellow-500 to-orange-500',
    hover: 'hover:from-yellow-600 hover:to-orange-600'
  },
  {
    level: 'hard',
    emoji: '🔴',
    label: 'Banana Expert',
    desc: '30 seconds, 30 points',
    color: 'from-red-500 to-pink-500',
    hover: 'hover:from-red-600 hover:to-pink-600'
  }
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  onDifficultySelect,
  loading
}) => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-500">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="text-9xl filter drop-shadow-2xl gentle-float">🐵</div>
          </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black text-white drop-shadow-lg">Choose Your Challenge! 🍌</h1>
          <p className="text-xl font-semibold text-yellow-100 drop-shadow-md">Select difficulty level to start the banana puzzle adventure!</p>
        </div>

        <div className="space-y-4">
          {/* Difficulty Selection Buttons */}
          {DIFFICULTY_OPTIONS.map((diff) => (
            <Button
              key={diff.level}
              onClick={() => onDifficultySelect(diff.level)}
              disabled={loading}
              className={`w-80 h-20 text-2xl font-black bg-gradient-to-r ${diff.color} ${diff.hover} text-white border-4 border-white rounded-2xl shadow-2xl hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-4xl">{diff.emoji}</span>
                  <div className="text-left">
                    <div>{diff.label}</div>
                    <div className="text-sm opacity-90">{diff.desc}</div>
                  </div>
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-center gap-2">
            <div className="text-3xl animate-bounce" style={{ animationDelay: '0s' }}>🍌</div>
            <div className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🍌</div>
            <div className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍌</div>
          </div>
          <p className="text-lg font-semibold text-yellow-100 drop-shadow-md">Ready to test your banana knowledge?</p>
        </div>
      </div>
    </div>

    <style>{`
      .gentle-float {
        animation: gentleFloat 3s ease-in-out infinite;
      }

      @keyframes gentleFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
    `}</style>
    </>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(DifficultySelector);
