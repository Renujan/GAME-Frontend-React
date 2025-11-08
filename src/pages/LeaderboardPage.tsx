import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gsap } from "gsap";
import { leaderboardService, LeaderboardEntry } from "@/services/leaderboardService";
import { toast } from "sonner";

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const topPlayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    if (topPlayerRef.current) {
      // Confetti animation for top player
      gsap.to(topPlayerRef.current, {
        scale: 1.05,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, [leaderboard]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      toast.error("Failed to load leaderboard");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-3xl">🥇</span>;
      case 2:
        return <span className="text-3xl">🥈</span>;
      case 3:
        return <span className="text-3xl">🥉</span>;
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍌</div>
          <p className="text-xl text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-bounce-in">
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🏆 Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground">Top banana champions of the game!</p>
        </div>

        {/* Top 3 Podium */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((player) => (
              <Card
                key={player.rank}
                ref={player.rank === 1 ? topPlayerRef : null}
                className={`shadow-playful ${
                  player.rank === 1
                    ? "md:order-2 bg-gradient-primary"
                    : player.rank === 2
                    ? "md:order-1"
                    : "md:order-3"
                }`}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-5xl mb-2">{getRankBadge(player.rank)}</div>
                  <div className="text-2xl font-bold">{player.username}</div>
                  <div className="text-3xl font-bold text-primary">{player.score} 🍌</div>
                  {player.games && player.accuracy && (
                    <div className="text-sm text-muted-foreground">
                      {player.games} games • {player.accuracy}% accuracy
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="shadow-playful">
          <CardHeader>
            <CardTitle>All Players</CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((player, i) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:scale-102 hover:bg-muted/80 transition-all"
                    style={{
                      animation: `fade-in 0.3s ease-out ${i * 0.05}s both`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 text-center">{getRankBadge(player.rank)}</div>
                      <div>
                        <div className="font-bold text-lg">{player.username}</div>
                        {player.games && player.accuracy && (
                          <div className="text-sm text-muted-foreground">
                            {player.games} games • {player.accuracy}% accuracy
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{player.score}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No players yet. Be the first to play!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;
