import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { gsap } from "gsap";
import { gameService } from "@/services/gameService";
import ProtectedRoute from "@/components/ProtectedRoute";

// 🔹 TypeScript interface for Question
export interface Question {
  puzzle_id: string; // ✅ string
  image_url: string;
  difficulty: "easy" | "medium" | "hard";
  points_value: number;
  time_limit: number;
  created_at: string;
}

const GamePageContent = () => {
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const difficultyTime: Record<string, number> = {
    easy: 60,
    medium: 45,
    hard: 30,
  };

  // Load first question
  useEffect(() => {
    loadQuestion();
  }, []);

  // Timer
  useEffect(() => {
    if (time > 0 && question) {
      const timer = setInterval(() => setTime((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (time === 0 && question) {
      toast.error("Time's up! 🕐");
      handleTimeout();
    }
  }, [time, question]);

  // Load question from backend
  const loadQuestion = async () => {
    try {
      setLoading(true);
      const data = await gameService.getQuestion();
      setQuestion(data);
      setTime(difficultyTime[data.difficulty] || 60);
      setAnswer("");
    } catch (error: any) {
      toast.error("Failed to load question");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Timeout handler
  const handleTimeout = async () => {
    setStats((s) => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
    await loadQuestion();
  };

  // Submit answer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question || !answer.trim()) return;

    setLoading(true);

    try {
      const result = await gameService.submitAnswer({
        puzzle_id: question.puzzle_id, // ✅ string
        answer: answer.trim(),
      });

      if (result.correct) {
        setScore(result.new_score);
        setStats((s) => ({
          ...s,
          correct: s.correct + 1,
          streak: s.streak + 1,
        }));
        toast.success(`Correct! +${result.points_awarded} points 🎉`);

        if (cardRef.current) {
          gsap.to(cardRef.current, {
            rotationY: 360,
            duration: 0.6,
            ease: "back.out",
          });
        }

        await loadQuestion();
      } else {
        setStats((s) => ({ ...s, wrong: s.wrong + 1, streak: 0 }));
        setShake(true);
        toast.error("Wrong answer! Try again 😅");

        if (inputRef.current) {
          gsap.timeline()
            .to(inputRef.current, { x: -10, duration: 0.1 })
            .to(inputRef.current, { x: 10, duration: 0.1 })
            .to(inputRef.current, { x: -10, duration: 0.1 })
            .to(inputRef.current, { x: 10, duration: 0.1 })
            .to(inputRef.current, { x: 0, duration: 0.1 });
        }

        setTimeout(() => setShake(false), 500);
      }
    } catch (error: any) {
      toast.error("Failed to submit answer");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍌</div>
          <p className="text-xl text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  const maxTime = difficultyTime[question.difficulty] || 60;
  const progressPercentage = (time / maxTime) * 100;
  const progressColor =
    progressPercentage > 50
      ? "bg-accent"
      : progressPercentage > 20
      ? "bg-secondary"
      : "bg-destructive";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl space-y-6">
        {/* Score & Timer */}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">Score: {score} 🍌</div>
          <div className="text-2xl font-bold">⏱️ {time}s</div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progressPercentage} className={`h-3 ${progressColor}`} />
        </div>

        {/* Difficulty Badge */}
        <div className="flex justify-center">
          <span className="px-4 py-2 bg-gradient-primary rounded-full text-sm font-bold capitalize">
            {question.difficulty}
          </span>
        </div>

        {/* Game Card */}
        <Card ref={cardRef} className="shadow-playful animate-bounce-in">
          <CardContent className="p-0 relative">
            {/* Puzzle Image */}
            <div className="aspect-square w-full h-full overflow-hidden rounded-xl">
              {question.image_url ? (
                <img
                  src={question.image_url}
                  alt="Puzzle"
                  className="w-full h-full object-contain" // ✅ full image inside div without cutting corners
                />
              ) : (
                <div className="text-9xl flex items-center justify-center h-full">🍌</div>
              )}
            </div>

            {/* Question / Answer Form */}
            <div className="p-6 space-y-4 text-center">
              <h3 className="text-2xl font-bold mb-2">What is this?</h3>
              <p className="text-muted-foreground">Type your answer below</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className={`text-lg ${shake ? "animate-shake" : ""}`}
                  disabled={time === 0 || loading}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary shadow-glow hover:scale-105 transition-transform"
                  disabled={time === 0 || !answer.trim() || loading}
                >
                  {loading ? "Submitting..." : "Submit Answer 🚀"}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Correct", value: stats.correct, emoji: "✅" },
            { label: "Wrong", value: stats.wrong, emoji: "❌" },
            { label: "Streak", value: stats.streak, emoji: "🔥" },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-playful">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const GamePage = () => (
  <ProtectedRoute>
    <GamePageContent />
  </ProtectedRoute>
);

export default GamePage;
