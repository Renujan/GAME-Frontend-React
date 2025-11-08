import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { profileService, ProfileData } from "@/services/profileService";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍌</div>
          <p className="text-xl text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const maxScore = 1000;
  const progressPercentage = profile.score ? (profile.score / maxScore) * 100 : 0;

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Profile Header */}
        <Card className="shadow-playful animate-bounce-in">
          <CardHeader className="text-center">
            <div className="text-7xl mb-4 animate-float">🍌</div>
            <CardTitle className="text-4xl bg-gradient-primary bg-clip-text text-transparent">
              {profile.username || "Unknown User"}
            </CardTitle>
            <p className="text-muted-foreground">{profile.email || "No Email"}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Total Points</span>
                  <span className="text-primary font-bold">{profile.score ?? 0} 🍌</span>
                </div>
                <Progress value={progressPercentage} className="h-3 bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Games Played", value: profile.games_played ?? 0, emoji: "🎮" },
            {
              label: "Accuracy",
              value: `${profile.accuracy?.toFixed(1) ?? "0.0"}%`,
              emoji: "🎯",
            },
            { label: "Score", value: profile.score ?? 0, emoji: "🍌" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-playful hover:scale-105 transition-transform">
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game History */}
        <Card className="shadow-playful">
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.recent_games?.length > 0 ? (
              <div className="space-y-3">
                {profile.recent_games.map((game, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:scale-102 transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      {game.difficulty && (
                        <Badge
                          variant={
                            game.difficulty === "easy"
                              ? "secondary"
                              : game.difficulty === "medium"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {game.difficulty}
                        </Badge>
                      )}
                      <span className="text-2xl">{game.correct ? "✅" : "❌"}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">+{game.points ?? 0} points</div>
                      <div className="text-sm text-muted-foreground">
                        {game.time_taken ?? 0}s
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No games played yet. Start playing to see your history!
              </p>
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
