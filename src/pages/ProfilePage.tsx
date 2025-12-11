import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { profileService, ProfileData } from "@/services/profileService";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Trophy, Target, Gamepad2, TrendingUp, Clock, Award, Calendar } from "lucide-react";

const ProfilePageContent = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If admin, redirect to admin dashboard
    if (user?.role === "admin") {
      toast.error("Admins cannot access this page");
      navigate("/admin");
      return;
    }

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(to bottom right, #4F46E5, #7C3AED, #EC4899)" }}>
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="text-9xl animate-bounce" style={{ color: "#FFD700" }}>🐵</div>
            <div className="absolute inset-0 text-9xl animate-ping opacity-20">🐵</div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black" style={{ color: "#FFFFFF" }}>Loading your profile...</p>
            <div className="flex justify-center gap-2">
              <div className="text-3xl animate-bounce" style={{ animationDelay: '0s', color: "#FACC15" }}>🍌</div>
              <div className="text-3xl animate-bounce" style={{ animationDelay: '0.1s', color: "#FACC15" }}>🍌</div>
              <div className="text-3xl animate-bounce" style={{ animationDelay: '0.2s', color: "#FACC15" }}>🍌</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const maxScore = 1000;
  const progressPercentage = profile.score ? (profile.score / maxScore) * 100 : 0;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(to bottom right, #4F46E5, #7C3AED, #EC4899)" }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: i % 2 === 0 ? '#FACC15' : '#FFD700',
              animationDelay: `${i * 0.2}s`
            }}
          >
            {i % 2 === 0 ? '🍌' : '🐵'}
          </div>
        ))}
      </div>

      <div className="relative container mx-auto max-w-5xl px-4 pt-24 pb-12 space-y-8">
        {/* Profile Header */}
        <Card className="relative overflow-hidden shadow-glow rounded-3xl animate-glow" style={{ background: "linear-gradient(to bottom right, #FACC15, #F97316, #FFA500)", border: "4px solid #F59E0B" }}>
          <div className="absolute top-0 left-0 right-0 h-3 animate-pulse" style={{ background: "0 0 10px rgba(255, 204, 0, 0.5)" }}></div>

          <CardHeader className="text-center pt-10 pb-6">
            <div className="relative inline-block mb-4">
              <div className="text-8xl animate-float" style={{ color: "#FFD700" }}>🐵</div>
              <div className="absolute -bottom-2 -right-2 text-5xl animate-bounce">🍌</div>
            </div>
            <CardTitle className="text-5xl font-black mb-2" style={{ color: "#1F2937" }}>
              {profile.username || "Unknown Monkey"}
            </CardTitle>
            <p className="text-lg font-medium" style={{ color: "#1F2937" }}>{profile.email || "No Email"}</p>
          </CardHeader>

          <CardContent className="pb-8">
            <div className="space-y-4 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Trophy style={{ color: "#F59E0B" }} className="w-6 h-6" />
                <span className="text-lg font-bold" style={{ color: "#1F2937" }}>Banana Collection Progress</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg" style={{ color: "#1F2937" }}>Total Bananas</span>
                  <span className="text-3xl font-black" style={{ color: "#F59E0B" }}>
                    {profile.score ?? 0} 🍌
                  </span>
                </div>
                <div className="relative">
                  <div className="h-6 rounded-full overflow-hidden shadow-inner" style={{ backgroundColor: "#FACC15", border: "2px solid #F59E0B" }}>
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%`, background: "linear-gradient(to right, #F97316, #F59E0B)" }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold drop-shadow" style={{ color: "#1F2937" }}>
                      {progressPercentage.toFixed(0)}% to {maxScore} 🎯
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Games Played",
              value: profile.games_played ?? 0,
              icon: Gamepad2,
              bgColor: "#7C3AED",
              borderColor: "#9333EA",
              textColor: "#FFFFFF",
              emoji: "🎮"
            },
            {
              label: "Accuracy",
              value: `${profile.accuracy?.toFixed(1) ?? "0.0"}%`,
              icon: Target,
              bgColor: "#FACC15",
              borderColor: "#F59E0B",
              textColor: "#1F2937",
              emoji: "🎯"
            },
            {
              label: "Total Score",
              value: profile.score ?? 0,
              icon: Trophy,
              bgColor: "#F97316",
              borderColor: "#F59E0B",
              textColor: "#FFFFFF",
              emoji: "🍌"
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card
                key={i}
                className="relative overflow-hidden shadow-xl hover:scale-105 transition-all"
                style={{ backgroundColor: stat.bgColor, border: `4px solid ${stat.borderColor}` }}
              >
                <CardContent className="p-6 text-center" style={{ color: stat.textColor }}>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Icon style={{ color: stat.textColor === "#FFFFFF" ? "#FFD700" : "#F59E0B" }} className="w-10 h-10" />
                    <div className="text-5xl">{stat.emoji}</div>
                  </div>
                  <div className="text-4xl font-black mb-2" style={{ color: stat.textColor === "#FFFFFF" ? "#FFD700" : "#1F2937" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wide">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Game History */}
        <Card className="shadow-2xl border-4 border-amber-300 bg-gradient-to-br from-white to-yellow-50">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
          
          <CardHeader className="border-b-2 border-amber-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-amber-600" />
              <CardTitle className="text-3xl font-black text-amber-900">Recent Adventures</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {profile.recent_games?.length > 0 ? (
              <div className="space-y-3">
                {profile.recent_games.map((game, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl hover:border-amber-400 hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-200/0 via-amber-200/20 to-amber-200/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl">{game.is_correct ? "✅" : "❌"}</span>
                        <span className="font-bold text-amber-900">
                          {game.is_correct ? "Correct!" : "Wrong"}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-amber-200 rounded-full border-2 border-amber-400">
                        <span className="text-xs font-bold text-amber-900">
                          Puzzle: {game.puzzle_id}
                        </span>
                      </div>
                      <div className="px-3 py-1 bg-blue-100 rounded-full border-2 border-blue-300">
                        <span className="text-xs font-bold text-blue-900">
                          Answer: {game.player_answer}
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center gap-4 md:gap-6 flex-wrap md:flex-nowrap">
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-amber-600" />
                          <span className="text-2xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            +{game.points_earned ?? 0}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-amber-700">points earned</div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span className="text-xl font-bold text-amber-900">
                            {game.time_taken ?? 0}s
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-amber-700">time taken</div>
                      </div>
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-900">
                            {formatDate(game.created_at)}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-amber-700">attempted</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="text-8xl mb-4">🐵</div>
                <p className="text-xl font-bold text-amber-800">No adventures yet!</p>
                <p className="text-amber-700">Start playing to build your monkey history 🍌</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ProfilePage = () => (
  <ProtectedRoute>
    <ProfilePageContent />
  </ProtectedRoute>
);

export default ProfilePage;
