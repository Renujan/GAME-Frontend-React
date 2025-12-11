import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Users, Gamepad2, TrendingUp, Download, RotateCcw, Settings, Shield, Crown, Zap } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="text-8xl animate-bounce">🐵</div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-5xl animate-pulse">
              🍌
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-black text-white drop-shadow-lg">Loading Monkey Command Center...</p>
            <div className="flex justify-center gap-2">
              <div className="text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🍌</div>
              <div className="text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🍌</div>
              <div className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍌</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating bananas and monkeys */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => {
          const emojis = ['🍌', '🐵', '🐒'];
          const emoji = emojis[i % 3];
          return (
            <div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 5}s ease-in-out ${Math.random() * 5}s infinite`,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>
      
      <div className="relative container mx-auto max-w-7xl px-4 pt-24 pb-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="text-7xl animate-bounce">🐵</div>
              <Crown className="w-10 h-10 text-yellow-400 absolute -top-4 -right-4 animate-pulse drop-shadow-2xl" />
            </div>
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl">
                MONKEY CONTROL CENTER
              </h1>
              <p className="text-xl text-blue-200 font-semibold flex items-center gap-2 mt-2">
                <span className="text-2xl">🍌</span>
                Master of the Banana Monkey Kingdom
                <span className="text-2xl">🍌</span>
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: "Total Players", 
                value: stats.total_players ?? 0, 
                icon: Users,
                gradient: "from-blue-500 to-cyan-500",
                bg: "from-blue-500/20 to-cyan-500/20"
              },
              { 
                label: "Total Games", 
                value: stats.total_games ?? 0, 
                icon: Gamepad2,
                gradient: "from-purple-500 to-pink-500",
                bg: "from-purple-500/20 to-pink-500/20"
              },
              { 
                label: "Avg Accuracy", 
                value: (stats.overall_accuracy ?? 0).toFixed(1) + "%", 
                icon: TrendingUp,
                gradient: "from-orange-500 to-yellow-500",
                bg: "from-orange-500/20 to-yellow-500/20"
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={i}
                  className="relative overflow-hidden border border-blue-500/30 bg-blue-950/50 backdrop-blur-xl shadow-2xl hover:scale-105 hover:bg-blue-950/60 transition-all duration-500 hover:border-blue-400/50 group"
                  style={{
                    animation: `slideIn 0.5s ease-out ${i * 0.1}s backwards`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  <CardContent className="relative p-8 text-center space-y-3">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                      {stat.label}
                    </div>
                    <div className="text-2xl">{i === 0 ? '🐵' : i === 1 ? '🎮' : '🍌'}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Player Management */}
        <Card className="relative overflow-hidden border border-blue-400/30 bg-slate-900/40 backdrop-blur-xl shadow-2xl hover:bg-slate-900/50 transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-50"></div>
          <CardHeader className="border-b border-blue-500/20">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-extrabold text-white/90 flex items-center gap-3 tracking-tight">
                <span className="text-3xl">🐵</span>
                <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Monkey Players</span>
              </CardTitle>
              <Button
                onClick={loadData}
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm bg-opacity-80"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {players.length > 0 ? (
              <div className="space-y-3">
                {players.map((player, i) => (
                  <div
                    key={player.id}
                    className="group relative overflow-hidden flex items-center justify-between p-5 bg-slate-800/30 backdrop-blur-md border border-slate-600/30 rounded-xl hover:bg-slate-800/40 hover:border-slate-500/50 transition-all duration-300"
                    style={{
                      animation: `slideIn 0.3s ease-out ${i * 0.05}s backwards`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/3 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <div className="relative flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 shadow-lg">
                        <span className="text-2xl">🐵</span>
                      </div>
                      <div>
                        <div className="font-bold text-xl text-white group-hover:text-slate-200 transition-colors">
                          {player.username}
                        </div>
                        <div className="text-sm text-slate-300 font-medium">
                          {player.email} • <span className="text-amber-300 font-bold">{player.score} 🍌</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-1 font-bold shadow-lg">
                        Active
                      </Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 border-0 shadow-lg hover:shadow-xl transition-all"
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
              <div className="text-center py-12">
                <div className="text-8xl mb-4">🐵</div>
                <p className="text-slate-200 text-lg">No monkeys in the jungle yet!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="relative overflow-hidden border border-purple-400/30 bg-slate-900/40 backdrop-blur-xl shadow-2xl hover:bg-slate-900/50 transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50"></div>
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className="text-2xl font-extrabold text-white/90 flex items-center gap-3 tracking-tight">
              <span className="text-3xl">🎮</span>
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">Monkey Business Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Download, label: "Export Banana Data", gradient: "from-blue-600 to-cyan-600", emoji: "📊" },
                { icon: RotateCcw, label: "Reset Banana Scores", gradient: "from-orange-600 to-yellow-600", emoji: "🔄" },
                { icon: Settings, label: "Jungle Settings", gradient: "from-green-600 to-emerald-600", emoji: "🌴" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <Button 
                    key={i}
                    className={`h-32 relative overflow-hidden bg-gradient-to-br ${action.gradient} hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl group`}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
                    <div className="relative text-center space-y-2">
                      <div className="text-4xl mb-1">{action.emoji}</div>
                      <div className="text-lg font-bold text-white">{action.label}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
      `}</style>
    </div>
  );
};

const AdminPage = () => (
  <ProtectedRoute requireAdmin>
    <AdminPageContent />
  </ProtectedRoute>
);

export default AdminPage;
