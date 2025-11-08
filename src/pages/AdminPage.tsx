import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw } from "lucide-react";
import { adminService, Player, AdminStats } from "@/services/adminService";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

const AdminPageContent = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, statsData] = await Promise.all([
        adminService.getPlayers(),
        adminService.getStats(),
      ]);
      setPlayers(playersData);
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to load admin data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (id: number, username: string) => {
    if (!confirm(`Are you sure you want to delete player "${username}"?`)) {
      return;
    }

    try {
      await adminService.deletePlayer(id);
      toast.success("Player deleted successfully");
      await loadData();
    } catch (error) {
      toast.error("Failed to delete player");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍌</div>
          <p className="text-xl text-muted-foreground">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-bounce-in">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🛠️ Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage players and game statistics</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Players", value: stats.total_players ?? 0, emoji: "👥" },
              { label: "Total Games", value: stats.games_played ?? 0, emoji: "🎮" },
              { label: "Avg Score", value: (stats.avg_score ?? 0).toFixed(1), emoji: "🍌" },
            ].map((stat, i) => (
              <Card key={i} className="shadow-playful hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Player Management */}
        <Card className="shadow-playful">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Player Management</CardTitle>
              <Button variant="outline" size="sm" className="gap-2" onClick={loadData}>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {players.length > 0 ? (
              <div className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold text-lg">{player.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.email} • {player.score} points
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">Active</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDeletePlayer(player.id, player.username)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No players found</p>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-playful">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div>Export Data</div>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <div className="text-2xl mb-1">🔄</div>
                  <div>Reset Scores</div>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <div className="text-2xl mb-1">⚙️</div>
                  <div>Settings</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AdminPage = () => (
  <ProtectedRoute requireAdmin>
    <AdminPageContent />
  </ProtectedRoute>
);

export default AdminPage;
