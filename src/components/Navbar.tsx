import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Trophy, Home, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-text-primary backdrop-blur-md shadow-glow" style={{ backgroundColor: '#FACC15', borderBottom: '4px solid #F97316' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <span className="text-5xl transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 inline-block">
                🐵
              </span>
              <span className="absolute -bottom-1 -right-2 text-3xl animate-bounce">
                🍌
              </span>
            </div>
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Banana King
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/">
                  <Button
                    size="sm"
                    className="gap-2 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: '#FACC15', color: '#1F2937', border: '2px solid #F59E0B' }}
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/game">
                  <Button
                    size="sm"
                    className="gap-2 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 border-0 hover:scale-105"
                    style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
                  >
                    🎮 Play
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button
                    size="sm"
                    className="gap-2 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                    style={{ backgroundColor: '#FACC15', color: '#1F2937', border: '2px solid #F59E0B' }}
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </Link>
                {user.role !== "admin" && (
                  <Link to="/profile">
                    <Button
                      size="sm"
                      className="gap-2 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                      style={{ backgroundColor: '#FACC15', color: '#1F2937', border: '2px solid #F59E0B' }}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin">
                    <Button
                      size="sm"
                      className="gap-2 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 border-0"
                      style={{ backgroundColor: '#7C3AED', color: '#FFFFFF' }}
                    >
                      👑 Admin
                    </Button>
                  </Link>
                )}
                <div className="h-6 w-px" style={{ backgroundColor: '#F97R16' }}></div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
                     style={{ backgroundColor: '#7C3AED', border: '2px solid #9333EA', color: 'white' }}>
                  <span className="text-sm font-bold">{user.username}</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  style={{ backgroundColor: '#FACC15', color: '#1F2937', border: '2px solid #F59E0B' }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    size="sm"
                    className="bg-white border-2 border-amber-400 text-amber-800 hover:bg-amber-200 hover:border-amber-500 font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 border-0"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-white border-2 border-amber-300 hover:bg-amber-200 rounded-lg transition-all shadow-md"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-amber-800" />
            ) : (
              <Menu className="w-6 h-6 text-amber-800" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t-2 border-amber-300 space-y-2">
            {user ? (
              <>
                <div className="px-4 py-3 bg-amber-200 rounded-lg border-2 border-amber-400 mb-3 shadow-sm">
                  <span className="text-sm font-bold text-amber-900">Welcome, {user.username}! 🐵</span>
                </div>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full justify-start gap-2 bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-200 font-bold shadow-sm"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Button>
                </Link>
                <Link to="/game" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full justify-start gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md border-0"
                  >
                    🎮 Play Game
                  </Button>
                </Link>
                <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full justify-start gap-2 bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-200 font-bold shadow-sm"
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </Link>
                {user.role !== "admin" && (
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      className="w-full justify-start gap-2 bg-white border-2 border-amber-300 text-amber-800 hover:bg-amber-200 font-bold shadow-sm"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md border-0"
                    >
                      👑 Admin Panel
                    </Button>
                  </Link>
                )}
                <div className="pt-2 mt-2 border-t-2 border-amber-300">
                  <Button
                    onClick={handleLogout}
                    className="w-full justify-start gap-2 bg-white border-2 border-amber-400 text-amber-800 hover:bg-amber-200 font-bold shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-white border-2 border-amber-400 text-amber-800 hover:bg-amber-200 font-bold shadow-sm"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-md border-0"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
