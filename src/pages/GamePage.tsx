import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { gsap } from "gsap";
import { gameService } from "@/services/gameService";
import ProtectedRoute from "@/components/ProtectedRoute";
import DifficultySelector from "@/components/DifficultySelector";
import { useAuth } from "@/contexts/AuthContext";
import { Zap, Trophy, Target, Flame, Coins, Snowflake } from "lucide-react";

// 🔹 TypeScript interface for Question
export interface Question {
  puzzle_id: string;
  image_url: string;
  difficulty: "easy" | "medium" | "hard";
  points_value: number;
  time_limit: number;
  created_at: string;
}

const GamePageContent = () => {
  const { user, setUser } = useAuth();
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, streak: 0 });
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  // Power-up states
  const [timerFrozen, setTimerFrozen] = useState(false);
  const [freezeEndTime, setFreezeEndTime] = useState<Date | null>(null);
  const [doublePointsActive, setDoublePointsActive] = useState(false);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [doublePointsLoading, setDoublePointsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bananaRefs = useRef<(HTMLDivElement | null)[]>([]);

  const difficultyTime: Record<string, number> = {
    easy: 60,
    medium: 45,
    hard: 30,
  };

  // Fixed timer with proper freeze support
  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    let freezeTimer: NodeJS.Timeout;

    if (time > 0 && question) {
      if (!timerFrozen) {
        // Normal countdown - start/restart when not frozen
        countdownTimer = setInterval(() => {
          setTime(currentTime => {
            if (currentTime <= 1) {
              toast.error("Time's up! 🕐");
              handleTimeout();
              return 0;
            }
            return currentTime - 1;
          });
        }, 1000);
      } else if (freezeEndTime) {
        // Check freeze expiration frequently
        freezeTimer = setInterval(() => {
          if (new Date() >= freezeEndTime) {
            setTimerFrozen(false);
            setFreezeEndTime(null);
            toast.success("Timer freeze ended! 🕒");
          }
        }, 250); // Check every 250ms instead of 100ms and 1000ms mixed
      }
    }

    return () => {
      if (countdownTimer) clearInterval(countdownTimer);
      if (freezeTimer) clearInterval(freezeTimer);
    };
  }, [question, timerFrozen]); // Fixed dependencies - removed time dependency to avoid re-triggering

  // Animate floating bananas
  useEffect(() => {
    bananaRefs.current.forEach((ref, i) => {
      if (ref) {
        gsap.to(ref, {
          y: -20,
          rotation: 10,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      }
    });
  }, []);

  // Start game with selected difficulty
  const startGame = async (difficulty: string) => {
    try {
      setLoading(true);
      const data = await gameService.getQuestion(difficulty);
      setQuestion(data);
      setTime(difficultyTime[data.difficulty] || 45);
      setAnswer("");
      toast.success(`Starting ${difficulty} mode! 🍌`);
    } catch (error: any) {
      toast.error("Failed to load question");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load question from backend
  const loadQuestion = async () => {
    try {
      setLoading(true);
      const data = await gameService.getQuestion(selectedDifficulty);
      setQuestion(data);
      setTime(difficultyTime[data.difficulty] || 45);
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
  const handleSubmit = async () => {
    if (!question || !answer.trim()) return;

    setLoading(true);

    try {
      // Calculate elapsed time: total difficulty time - remaining time
      const totalTime = difficultyTime[question.difficulty] || 45;
      const elapsedTime = totalTime - time;

      const result = await gameService.submitAnswer({
        puzzle_id: question.puzzle_id,
        answer: answer.trim(),
        time_taken: elapsedTime,  // ✅ Calculate and send actual elapsed time
      });

      if (result.correct) {
        setScore(result.total_score);
        setUser(prev => prev ? {...prev, coins: result.total_coins} : null); // Update coins in real-time
        setStats((s) => ({
          ...s,
          correct: s.correct + 1,
          streak: s.streak + 1,
        }));

        const pointsMsg = result.points_earned > 0 ? `+${result.points_earned} points` : '';
        const coinsMsg = result.coins_earned > 0 ? `+${result.coins_earned} coins` : '';
        const rewardMsg = [pointsMsg, coinsMsg].filter(Boolean).join(' & ');

        toast.success(`Correct! ${rewardMsg} 🎉`);

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Power-up: Freeze Timer
  const freezeTimer = async (seconds: number) => {
    if (!question || freezeLoading) return;

    try {
      setFreezeLoading(true);
      const cost = seconds === 5 ? 20 : 35;

      const response = await gameService.freezeTimer({
        puzzle_id: question.puzzle_id,
        freeze_seconds: seconds
      });

      if (response.success) {
        // Update coin balance in context
        setUser(prev => prev ? {...prev, coins: response.coins_left} : null);

        // Freeze timer
        setTimerFrozen(true);
        setFreezeEndTime(new Date(response.active_until));

        toast.success(`⏰ Timer frozen for ${seconds} seconds! (Spent ${cost} coins)`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to freeze timer");
    } finally {
      setFreezeLoading(false);
    }
  };

  // Power-up: Double Points
  const activateDoublePoints = async () => {
    if (!question || doublePointsLoading) return;

    try {
      setDoublePointsLoading(true);

      const response = await gameService.doublePoints({
        puzzle_id: question.puzzle_id
      });

      if (response.success) {
        // Update coin balance in context
        setUser(prev => prev ? {...prev, coins: response.coins_left} : null);

        // Activate double points for next puzzle
        setDoublePointsActive(true);

        toast.success(`💰 2x Points activated for next puzzle! (Spent 50 coins)`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to activate double points");
    } finally {
      setDoublePointsLoading(false);
    }
  };

  // Handler for difficulty selection
  const handleDifficultySelect = (difficulty: string) => {
    startGame(difficulty);
    setSelectedDifficulty(difficulty);
  };

  // Difficulty selection screen
  if (!question) {
    return (
      <DifficultySelector
        onDifficultySelect={handleDifficultySelect}
        loading={loading}
      />
    );
  }

  const maxTime = difficultyTime[question.difficulty] || 60;
  const progressPercentage = (time / maxTime) * 100;

  const difficultyConfig = {
    easy: { color: "from-green-500 to-emerald-500", emoji: "🟢", label: "Easy Peasy" },
    medium: { color: "from-yellow-500 to-orange-500", emoji: "🟡", label: "Monkey Challenge" },
    hard: { color: "from-red-500 to-pink-500", emoji: "🔴", label: "Banana Expert" },
  };

  const currentDifficulty = difficultyConfig[question.difficulty];

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-orange-400/5 animate-pulse"></div>

      {/* Floating bananas in background */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          ref={(el) => (bananaRefs.current[i] = el)}
          className="absolute text-6xl opacity-20 pointer-events-none"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
        >
          🍌
        </div>
      ))}

      {/* Floating monkeys */}
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={`monkey-${i}`}
          className="absolute text-5xl opacity-15 pointer-events-none animate-pulse"
          style={{
            right: `${10 + i * 20}%`,
            top: `${15 + (i % 2) * 40}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: '3s'
          }}
        >
          🐵
        </div>
      ))}

      <div className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 min-h-screen">
        <div className="w-full max-w-3xl space-y-6">
          {/* Header with Score, Timer & Coins */}
          <div className="grid grid-cols-3 gap-4">
            {/* Score */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded-3xl shadow-2xl border-2 border-slate-600 text-center">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-300 uppercase">Score</div>
              <div className="text-2xl font-black text-white">{score} 🍌</div>
            </div>

            {/* Timer */}
            <div className={`p-4 rounded-3xl shadow-2xl border-2 border-slate-600 text-center ${timerFrozen ? 'bg-blue-800' : 'bg-gradient-to-r from-slate-700 to-slate-800'}`}>
              {timerFrozen ? (
                <Snowflake className="w-8 h-8 text-blue-300 mx-auto mb-2 animate-pulse" />
              ) : (
                <Zap className={`w-8 h-8 mx-auto mb-2 ${time <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
              )}
              <div className="text-xs font-bold text-slate-300 uppercase">
                {timerFrozen ? 'Frozen' : 'Time Left'}
              </div>
              <div className={`text-2xl font-black ${timerFrozen ? 'text-blue-200' : time <= 10 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                {timerFrozen ? '⏰' : `${time}s`}
              </div>
            </div>

            {/* Coins */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-4 rounded-3xl shadow-2xl border-2 border-slate-600 text-center">
              <Coins className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-300 uppercase">Coins</div>
              <div className="text-2xl font-black text-white">{user?.coins ?? 0} 💰</div>
            </div>
          </div>

          {/* Enhanced Animated Progress Bar */}
          <div className="relative">
            <div className={`h-8 bg-white/30 rounded-full overflow-hidden backdrop-blur-md border-3 shadow-xl transition-all duration-500 ${
              timerFrozen
                ? 'border-blue-400 animate-pulse'
                : time <= 5
                ? 'border-red-500 animate-pulse'
                : time <= 15
                ? 'border-orange-500'
                : 'border-yellow-400'
            }`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>

              <div
                className={`h-full transition-all duration-200 ease-out relative ${
                  progressPercentage > 70
                    ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500'
                    : progressPercentage > 40
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500'
                    : progressPercentage > 10
                    ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'
                    : 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-inner animate-pulse'
                }`}
                style={{ width: timerFrozen ? 0 : `${progressPercentage}%` }}
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"
                     style={{ animationDuration: time <= 10 ? '300ms' : '2s' }}></div>

                {/* Timer text overlay for low time */}
                {time <= 10 && !timerFrozen && (
                  <div className="absolute inset-0 flex items-center justify-center text-white font-black text-sm animate-bounce">
                    {time}s
                  </div>
                )}
              </div>

              {/* Freeze overlay */}
              {timerFrozen && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                  <div className="text-blue-800 font-black text-sm animate-pulse px-2 py-1 bg-white/90 rounded-full border-2 border-blue-600">
                    ⏰ FROZEN
                  </div>
                </div>
              )}
            </div>

            {/* Progress indicators */}
            <div className="flex justify-between mt-2 text-xs font-bold text-slate-300">
              <span className={`transition-all duration-300 ${timerFrozen ? 'animate-bounce text-blue-400' : ''}`}>
                {timerFrozen ? '⏰ Timer Paused' : time <= 5 ? '⚠️ RUSH!' : '🕒 Time Left'}
              </span>
              <span className={`transition-all duration-300 ${time <= 15 ? 'animate-pulse text-amber-400' : ''}`}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="flex justify-center">
            <div className={`px-8 py-3 bg-gradient-to-r ${currentDifficulty.color} rounded-full shadow-2xl border-4 border-white transform hover:scale-110 transition-transform`}>
              <span className="text-xl font-black text-white flex items-center gap-2">
                {currentDifficulty.emoji} {currentDifficulty.label}
              </span>
            </div>
          </div>

          {/* Power-Up Buttons */}
          <div className="grid grid-cols-3 gap-4">
            {/* Freeze 5s */}
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => freezeTimer(5)}
                  disabled={freezeLoading || timerFrozen || (user?.coins ?? 0) < 20}
                  style={{
                    backgroundColor: freezeLoading || timerFrozen || (user?.coins ?? 0) < 20 ? '#D97706' : '#FACC15',
                    color: '#1F2937',
                    border: '4px solid #F59E0B'
                  }}
                  className="h-16 font-bold rounded-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {freezeLoading ? (
                    <div className="text-center">
                      <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                      <div className="text-xs">Loading</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg">⏰ 5s</div>
                      <div className="text-xs">20 coins</div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>❄️ Freeze the timer for 5 seconds! (Cost: 20 coins)<br/>
                Perfect when you need more time to think! 🧊</p>
              </TooltipContent>
            </Tooltip>

            {/* Freeze 10s */}
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => freezeTimer(10)}
                  disabled={freezeLoading || timerFrozen || (user?.coins ?? 0) < 35}
                  style={{
                    backgroundColor: freezeLoading || timerFrozen || (user?.coins ?? 0) < 35 ? '#D97706' : '#FACC15',
                    color: '#1F2937',
                    border: '4px solid #F59E0B'
                  }}
                  className="h-16 font-bold rounded-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {freezeLoading ? (
                    <div className="text-center">
                      <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                      <div className="text-xs">Loading</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg">⏰ 10s</div>
                      <div className="text-xs">35 coins</div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>🧊 Freeze the timer for 10 seconds! (Cost: 35 coins)<br/>
                Get extra time when you need to analyze the puzzle! ❄️</p>
              </TooltipContent>
            </Tooltip>

            {/* Double Points */}
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={activateDoublePoints}
                  disabled={doublePointsLoading || doublePointsActive || (user?.coins ?? 0) < 50}
                  style={{
                    backgroundColor: doublePointsLoading || doublePointsActive || (user?.coins ?? 0) < 50 ? '#D97706' : '#FACC15',
                    color: '#1F2937',
                    border: '4px solid #F59E0B'
                  }}
                  className="h-16 font-bold rounded-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {doublePointsLoading ? (
                    <div className="text-center">
                      <div className="w-6 h-6 border-4 border-current border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
                      <div className="text-xs">Loading</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg">💰 2x</div>
                      <div className="text-xs">50 coins</div>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>💰 Double points for your next correct answer! (Cost: 50 coins)<br/>
                Invest in bigger rewards when you feel confident! ✨</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Game Card - MAIN PUZZLE AREA */}
          <Card
            ref={cardRef}
            className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-white via-purple-50 to-indigo-50 border-4 border-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 transform hover:scale-[1.02] transition-all duration-500"
          >
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-yellow-400 via-pink-500 via-purple-500 to-blue-500 animate-pulse rounded-t-2xl"></div>

            {/* Double Points Active Indicator */}
            {doublePointsActive && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-lg font-black shadow-xl animate-bounce border-2 border-white/50">
                ✨ 2x POINTS! ✨
              </div>
            )}

            <CardContent className="p-0 relative">
              {/* Puzzle Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100">
                {question.image_url ? (
                  <img
                    src={question.image_url}
                    alt="Puzzle"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-9xl animate-bounce">🍌</div>
                  </div>
                )}

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 text-4xl animate-spin" style={{ animationDuration: '10s' }}>🐵</div>
                <div className="absolute top-4 right-4 text-4xl animate-spin" style={{ animationDuration: '12s' }}>🍌</div>
              </div>

              {/* Question / Answer Form */}
              <div className="p-8 space-y-6 bg-gradient-to-b from-purple-50 via-pink-50 to-indigo-50 border-t-4 border-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
                <div className="text-center space-y-3">
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-5xl animate-bounce">🤔</span>
                    <h3 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
                      MONKEY BUSINESS! 🐵
                    </h3>
                    <span className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍌</span>
                  </div>
                  <p className="text-xl text-purple-700 font-bold animate-pulse">Race against time to identify this winner!</p>
                  <div className="flex justify-center gap-1 text-2xl">
                    <span className="animate-bounce">⭐</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>💎</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🏆</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎉</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🚀</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="🎯 Type your answer and hit Enter! 🎯"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`relative text-xl py-8 px-8 border-4 border-yellow-400 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl focus:border-pink-500 focus:shadow-pink-300/50 focus:outline-none transition-all duration-300 hover:shadow-lg ${shake ? "animate-shake" : ""} font-bold`}
                      disabled={time === 0 || loading}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      <Target className="w-7 h-7 text-pink-500 animate-pulse" />
                      <span className="text-orange-600 font-bold text-lg animate-bounce">🎯</span>
                    </div>
                  </div>

                  <div className="relative">
                    <Button
                      onClick={handleSubmit}
                      className="w-full h-18 text-2xl font-black rounded-3xl shadow-2xl hover:scale-[1.05] hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                      style={{
                        backgroundColor: time === 0 || !answer.trim() || loading ? '#D97706' : '#FF6B6B',
                        color: '#FFFFFF',
                        border: '4px solid #FFD93D'
                      }}
                      disabled={time === 0 || !answer.trim() || loading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span className="animate-pulse">Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <span className="animate-bounce">🚀</span>
                            <span>SUBMIT ANSWER!</span>
                            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎯</span>
                          </>
                        )}
                      </div>
                    </Button>

                    {/* Decorative sparkles around button */}
                    <div className="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
                    <div className="absolute -bottom-2 -left-2 text-2xl animate-spin" style={{ animationDelay: '0.5s' }}>⭐</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Correct", value: stats.correct, icon: Trophy, gradient: "from-green-500 to-emerald-500", emoji: "✅" },
              { label: "Wrong", value: stats.wrong, icon: Target, gradient: "from-red-500 to-pink-500", emoji: "❌" },
              { label: "Streak", value: stats.streak, icon: Flame, gradient: "from-orange-500 to-yellow-500", emoji: "🔥" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="relative overflow-hidden border-4 border-yellow-300 bg-white shadow-2xl hover:scale-105 transition-transform"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>
                  <CardContent className="p-6 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className={`w-8 h-8 ${stat.gradient.includes('green') ? 'text-green-600' : stat.gradient.includes('red') ? 'text-red-600' : 'text-orange-600'}`} />
                      <span className="text-4xl">{stat.emoji}</span>
                    </div>
                    <div className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-bold text-gray-600 uppercase">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
    </TooltipProvider>
  );
};

const GamePage = () => (
  <ProtectedRoute>
    <GamePageContent />
  </ProtectedRoute>
);

export default GamePage;
