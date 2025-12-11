import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { leaderboardService, LeaderboardEntry } from "@/services/leaderboardService";
import { gsap } from "gsap";
import { Trophy, Crown, Zap, Star, Medal } from "lucide-react";

const FALLING_COUNT = 40;

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const topPlayerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (topPlayerRef.current) {
      gsap.to(topPlayerRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
    
    if (headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: -50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }
  }, [leaderboard]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to load leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="text-9xl animate-bounce filter drop-shadow-2xl">🍌</div>
            <div className="absolute inset-0 text-9xl animate-ping opacity-20">🍌</div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-white drop-shadow-lg">Loading Champions...</p>
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const getMedalColor = (index: number) => {
    return index === 0 
      ? "from-yellow-300 via-yellow-400 to-yellow-600" 
      : index === 1 
      ? "from-gray-300 via-gray-400 to-gray-500"
      : "from-orange-400 via-orange-500 to-orange-600";
  };

  const fallingEmojis = Array.from({ length: FALLING_COUNT }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 6;
    const emojis = ["🍌", "🎉", "⭐", "🏆", "👑", "💎"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const size = 1 + Math.random() * 1.5;
    
    return (
      <div
        key={i}
        className="absolute pointer-events-none"
        style={{
          left: `${left}%`,
          fontSize: `${size}rem`,
          animation: `fall ${duration}s linear ${delay}s infinite`,
          filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
        }}
      >
        {emoji}
      </div>
    );
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-orange-500/20 animate-pulse"></div>
      
      {/* Falling emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {fallingEmojis}
      </div>

      {/* Radial glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative container mx-auto max-w-7xl px-4 pt-24 pb-12 space-y-12">
        {/* Header */}
        <div ref={headerRef} className="text-center space-y-6">
          <div className="flex justify-center items-center gap-4">
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
            <h1 className="text-7xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
              HALL OF FAME
            </h1>
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-2xl font-bold text-yellow-200 drop-shadow-lg flex items-center justify-center gap-2">
            <Star className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
            Elite Banana Monkey Champions
            <Star className="w-6 h-6 animate-spin" style={{ animationDuration: '3s', animationDelay: '1.5s' }} />
          </p>
        </div>

        {/* Top 3 Podium - Special Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end px-4">
          {/* 2nd Place */}
          {topThree[1] && (
            <div className="order-1 md:order-1 transform md:translate-y-8">
              <Card className="relative overflow-hidden shadow-2xl rounded-3xl hover:scale-105 transition-transform duration-300" style={{ background: "linear-gradient(to bottom right, #D1D5DB, #9CA3AF, #6B7280)", border: "4px solid #9CA3AF" }}>
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                <CardContent className="p-8 text-center space-y-4" style={{ color: "#1F2937" }}>
                  <div className="relative">
                    <Medal className="w-20 h-20 mx-auto" style={{ color: "#6B7280" }} />
                    <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🥈</div>
                  </div>
                  <div className="text-3xl font-black">{topThree[1].username}</div>
                  <div className="text-5xl font-black" style={{ color: "#374151" }}>
                    {topThree[1].score}
                  </div>
                  <div className="text-4xl">🍌</div>
                  {topThree[1].games && topThree[1].accuracy && (
                    <div className="text-sm font-semibold bg-white/50 rounded-full px-4 py-2">
                      {topThree[1].games} games • {topThree[1].accuracy.toFixed(1)}%
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 1st Place - Center & Elevated */}
          {topThree[0] && (
            <div ref={topPlayerRef} className="order-2 md:order-2 relative">
              <div className="absolute -inset-4 rounded-3xl blur-xl animate-pulse opacity-75" style={{ boxShadow: "0 0 10px rgba(255, 204, 0, 0.5)" }}></div>
              <Card className="relative overflow-hidden shadow-glow rounded-3xl transform scale-110 hover:scale-105 transition-all" style={{ background: "linear-gradient(to bottom right, #FACC15, #F97316, #FFA500)", border: "4px solid #F59E0B" }}>
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <Crown className="w-16 h-16" style={{ color: '#FFD700' }} className="drop-shadow-2xl animate-bounce" />
                </div>
                <CardContent className="p-10 text-center space-y-4 pt-12" style={{ color: "#1F2937" }}>
                  <div className="relative">
                    <Trophy className="w-24 h-24 mx-auto" style={{ color: "#F59E0B" }} />
                    <div className="absolute -top-2 -right-2 text-5xl animate-bounce">🥇</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-bold uppercase tracking-widest">Champion</div>
                    <div className="text-4xl font-black">{topThree[0].username}</div>
                  </div>
                  <div className="text-6xl font-black" style={{ color: "#F59E0B" }}>
                    {topThree[0].score}
                  </div>
                  <div className="text-5xl animate-pulse">🍌</div>
                  {topThree[0].games && topThree[0].accuracy && (
                    <div className="text-sm font-bold bg-white/50 rounded-full px-4 py-2">
                      {topThree[0].games} games • {topThree[0].accuracy.toFixed(1)}%
                    </div>
                  )}
                  <div className="flex justify-center gap-1 pt-2">
                    <Star className="w-5 h-5 animate-pulse" style={{ color: "#F59E0B" }} />
                    <Star className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.2s', color: "#F59E0B" }} />
                    <Star className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.4s', color: "#F59E0B" }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3rd Place */}
          {topThree[2] && (
            <div className="order-3 md:order-3 transform md:translate-y-8">
              <Card className="relative overflow-hidden shadow-2xl rounded-3xl hover:scale-105 transition-transform duration-300" style={{ background: "linear-gradient(to bottom right, #FBBF24, #F97316, #F87171)", border: "4px solid #F59E0B" }}>
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                <CardContent className="p-8 text-center space-y-4" style={{ color: "#1F2937" }}>
                  <div className="relative">
                    <Zap className="w-20 h-20 mx-auto" style={{ color: "#DC2626" }} />
                    <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🥉</div>
                  </div>
                  <div className="text-3xl font-black">{topThree[2].username}</div>
                  <div className="text-5xl font-black" style={{ color: "#DC2626" }}>
                    {topThree[2].score}
                  </div>
                  <div className="text-4xl">🍌</div>
                  {topThree[2].games && topThree[2].accuracy && (
                    <div className="text-sm font-semibold bg-white/50 rounded-full px-4 py-2">
                      {topThree[2].games} games • {topThree[2].accuracy.toFixed(1)}%
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Remaining Players */}
        {remaining.length > 0 && (
          <div className="space-y-4 px-4">
            <h2 className="text-3xl font-black text-center text-yellow-300 mb-6">
              Top Contenders
            </h2>
            {leaderboard.map((player, i) => {
              if (i < 3) return null;
              
              return (
                <Card
                  key={player.rank}
                  className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(to right, rgba(124,58,237,0.8), rgba(79,70,229,0.8))",
                    border: "2px solid #9333EA",
                    animation: `slideIn 0.5s ease-out ${i * 0.05}s backwards`
                  }}
                >
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" style={{ background: "linear-gradient(to right, rgba(255,204,0,0) 50%, rgba(255,204,0,0.1) 50%)" }}></div>

                  <CardContent className="relative flex items-center justify-between p-6" style={{ color: "#FFFFFF" }}>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg" style={{ background: "linear-gradient(to right, rgba(124,58,237,0.8), rgba(79,70,229,0.8))" }}>
                        <span className="text-2xl font-black">{i + 1}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold group-hover:text-accent transition-colors">
                          {player.username}
                        </div>
                        {player.games && player.accuracy && (
                          <div className="text-sm font-medium" style={{ color: "#C084FC" }}>
                            {player.games} games • {player.accuracy.toFixed(1)}% accuracy
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-black" style={{ color: "#FFD700" }}>
                        {player.score}
                      </div>
                      <div className="text-4xl animate-bounce" style={{ animationDuration: '2s', animationDelay: `${i * 0.1}s` }}>
                        🍌
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fall {
          0% { 
            transform: translateY(-100px) rotate(0deg); 
            opacity: 0; 
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% { 
            transform: translateY(calc(100vh + 100px)) rotate(720deg); 
            opacity: 0; 
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;
