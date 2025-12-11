import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, Timer, Trophy, Brain, Target, Zap, Award, TrendingUp } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const bananasRef = useRef<HTMLDivElement>(null);
  const monkeysRef = useRef<HTMLDivElement>(null);

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

    if (monkeysRef.current) {
      const monkeys = monkeysRef.current.children;
      Array.from(monkeys).forEach((monkey, index) => {
        gsap.to(monkey, {
          x: index % 2 === 0 ? 15 : -15,
          rotation: index % 2 === 0 ? 5 : -5,
          duration: 3 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.4,
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
      {/* Main background gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom right, #4F46E5, #7C3AED, #EC4899)" }}></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

      {/* Floating Bananas Background */}
      <div
        ref={bananasRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: "#FACC15",
              opacity: 0.3
            }}
          >
            🍌
          </div>
        ))}
      </div>

      {/* Floating Monkeys Background */}
      <div
        ref={monkeysRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              color: "#FFD700",
              opacity: 0.2
            }}
          >
            🐵
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center space-y-12 max-w-6xl">
        <div className="space-y-4">
          {/* Main Icons */}
          <div className="flex justify-center items-center gap-6 mb-6">
            <h1 className="text-7xl md:text-9xl font-bold animate-float">🐵</h1>
            <h1 className="text-7xl md:text-9xl font-bold animate-float" style={{ animationDelay: '0.2s' }}>🍌</h1>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold" style={{ background: "linear-gradient(to right, #FACC15, #FFD700, #F97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Banana Monkey Game
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto font-medium" style={{ color: "#FFFFFF" }}>
            Test your banana knowledge! Solve puzzles, earn points, and climb the leaderboard 🏆
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <Link to="/game">
              <Button
                size="lg"
                className="text-xl px-8 py-6 shadow-glow hover:scale-110 transition-transform font-bold"
                style={{
                  backgroundColor: "#F97316",
                  color: "#FFFFFF",
                  border: "4px solid #FFD700"
                }}
              >
                🎮 Play Now
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button
                  size="lg"
                  className="text-xl px-8 py-6 shadow-glow hover:scale-110 transition-transform font-bold"
                  style={{
                    backgroundColor: "#F97316",
                    color: "#FFFFFF",
                    border: "4px solid #FFD700"
                  }}
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-8 py-6 hover:scale-110 transition-transform font-bold"
                  style={{
                    backgroundColor: "transparent",
                    color: "#FACC15",
                    border: "4px solid #FACC15"
                  }}
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
            { 
              icon: Sparkles, 
              emoji: "🧩", 
              title: "Puzzle Challenges", 
              desc: "Solve banana puzzles",
              gradient: "from-purple-100 to-pink-100",
              border: "border-purple-200"
            },
            { 
              icon: Timer, 
              emoji: "⏱️", 
              title: "Beat the Clock", 
              desc: "Race against time",
              gradient: "from-blue-100 to-cyan-100",
              border: "border-blue-200"
            },
            { 
              icon: Trophy, 
              emoji: "🏆", 
              title: "Leaderboard", 
              desc: "Compete globally",
              gradient: "from-amber-100 to-yellow-100",
              border: "border-amber-200"
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className={`bg-gradient-to-br ${feature.gradient} p-8 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 ${feature.border}`}
              >
                <div className="flex justify-center items-center gap-3 mb-4">
                  <Icon className="w-8 h-8 text-amber-700" />
                  <div className="text-5xl">{feature.emoji}</div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-amber-900">{feature.title}</h3>
                <p className="text-amber-700 text-base leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* How to Play Section */}
        <div className="mt-20 pt-12 border-t-2 border-amber-200">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Brain className="w-10 h-10" style={{ color: "#FFD700" }} />
                <h3 className="text-4xl md:text-5xl font-black" style={{ background: "linear-gradient(to right, #FACC15, #FFD700, #F97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  How to Play
                </h3>
                <Brain className="w-10 h-10" style={{ color: "#FFD700" }} />
              </div>
              <p className="text-lg max-w-2xl mx-auto font-semibold" style={{ color: "#FFFFFF" }}>
                Master the Banana Monkey Game in 4 simple steps!
              </p>
            </div>

            {/* Game Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  step: "1",
                  icon: Target,
                  title: "View the Puzzle",
                  desc: "Look at the image puzzle presented to you",
                  gradient: "from-blue-500 to-cyan-500",
                  bg: "from-blue-50 to-cyan-50"
                },
                {
                  step: "2",
                  icon: Brain,
                  title: "Identify & Type",
                  desc: "Figure out what it is and type your answer quickly",
                  gradient: "from-purple-500 to-pink-500",
                  bg: "from-purple-50 to-pink-50"
                },
                {
                  step: "3",
                  icon: Zap,
                  title: "Beat the Timer",
                  desc: "Submit before time runs out for points",
                  gradient: "from-orange-500 to-red-500",
                  bg: "from-orange-50 to-red-50"
                },
                {
                  step: "4",
                  icon: Award,
                  title: "Earn Bananas",
                  desc: "Collect points and climb the leaderboard!",
                  gradient: "from-yellow-500 to-amber-500",
                  bg: "from-yellow-50 to-amber-50"
                }
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className={`relative bg-gradient-to-br ${step.bg} p-6 rounded-2xl shadow-lg border-2 border-amber-200 hover:shadow-xl hover:scale-105 transition-all`}>
                    <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl font-black text-white">{step.step}</span>
                    </div>
                    <div className="mt-4 space-y-3 text-center">
                      <Icon className="w-12 h-12 mx-auto text-amber-700" />
                      <h4 className="text-xl font-bold text-amber-900">{step.title}</h4>
                      <p className="text-sm text-amber-700 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Game Features */}
            <div className="mt-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 border-2 border-amber-300 shadow-xl max-w-4xl mx-auto">
              <h4 className="text-2xl font-black text-center text-amber-900 mb-6 flex items-center justify-center gap-2">
                <TrendingUp className="w-7 h-7" />
                Game Features & Scoring
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    emoji: "🟢",
                    title: "Easy Mode",
                    desc: "60 seconds to solve",
                    detail: "Perfect for beginners"
                  },
                  {
                    emoji: "🟡",
                    title: "Medium Mode",
                    desc: "45 seconds challenge",
                    detail: "More points, less time"
                  },
                  {
                    emoji: "🔴",
                    title: "Hard Mode",
                    desc: "30 seconds expert level",
                    detail: "Maximum points!"
                  },
                  {
                    emoji: "🔥",
                    title: "Streak System",
                    desc: "Keep answering correctly",
                    detail: "Build your winning streak"
                  }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/60 p-4 rounded-xl">
                    <div className="text-4xl">{feature.emoji}</div>
                    <div>
                      <h5 className="font-bold text-amber-900 text-lg">{feature.title}</h5>
                      <p className="text-amber-700 text-sm">{feature.desc}</p>
                      <p className="text-amber-600 text-xs mt-1 italic">{feature.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 max-w-3xl mx-auto">
              <h4 className="text-xl font-black text-green-900 mb-4 text-center">💡 Pro Tips</h4>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span><strong>Think fast:</strong> Every second counts for your score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span><strong>Build streaks:</strong> Consecutive correct answers boost your rank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span><strong>Track stats:</strong> Monitor your accuracy and improve over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">✅</span>
                  <span><strong>Compete globally:</strong> Check the leaderboard to see top players</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-12 pt-8 border-t-2" style={{ borderTopColor: "#FFD700" }}>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { label: "Active Players", value: "10K+", emoji: "🐵" },
              { label: "Puzzles Solved", value: "50K+", emoji: "✅" },
              { label: "Bananas Earned", value: "1M+", emoji: "🍌" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-4xl">{stat.emoji}</div>
                <div className="text-3xl font-black" style={{ color: "#FFD700" }}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
