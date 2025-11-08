import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Trophy, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-playful">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              🍌
            </span>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Banana Game
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/game">
                  <Button variant="ghost" size="sm" className="gap-2">
                    🎮 Play
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </Link>
                {/* Only show profile for non-admins */}
                {user.role !== "admin" && (
                  <Link to="/profile">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin">
                    <Button variant="secondary" size="sm">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-primary">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
