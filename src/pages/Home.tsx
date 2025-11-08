import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const bananasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bananasRef.current) {
      const bananas = bananasRef.current.children;
      
      gsap.fromTo(
        bananas,
        {
          y: -100,
          opacity: 0,
          rotation: 0,
        },
        {
          y: 0,
          opacity: 1,
          rotation: 360,
          duration: 1,
          stagger: 0.1,
          ease: "bounce.out",
        }
      );

      Array.from(bananas).forEach((banana, index) => {
        gsap.to(banana, {
          y: -20,
          rotation: index % 2 === 0 ? 10 : -10,
          duration: 2 + index * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Bananas Background */}
      <div
        ref={bananasRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            🍌
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center space-y-8 animate-bounce-in">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-bold animate-float">🍌</h1>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Banana Game
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Test your banana knowledge! Solve puzzles, earn points, and climb
            the leaderboard 🏆
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <Link to="/game">
              <Button
                size="lg"
                className="text-xl px-8 py-6 bg-gradient-primary shadow-glow hover:scale-110 transition-transform"
              >
                🎮 Play Now
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-xl px-8 py-6 bg-gradient-primary shadow-glow hover:scale-110 transition-transform"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-8 py-6 hover:scale-110 transition-transform"
                >
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { emoji: "🧩", title: "Puzzle Challenges", desc: "Solve banana puzzles" },
            { emoji: "⏱️", title: "Beat the Clock", desc: "Race against time" },
            { emoji: "🏆", title: "Leaderboard", desc: "Compete globally" },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-2xl shadow-playful hover:scale-105 transition-transform"
            >
              <div className="text-5xl mb-3">{feature.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
