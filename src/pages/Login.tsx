import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import OtpVerify from "@/components/OtpVerify";

type LoginStep = 'LOGIN' | 'OTP';

const Login = () => {
  const [step, setStep] = useState<LoginStep>('LOGIN');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginStep1, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/game");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await loginStep1(username, password);
      if (response.otp_sent) {
        setEmail(response.email);
        setStep('OTP');
        toast.success("OTP sent to your email! 📧");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('LOGIN');
    setEmail('');
    setPassword('');
  };

  if (step === 'OTP') {
    return <OtpVerify email={email} onBack={handleBackToLogin} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md animate-bounce-in shadow-playful">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-float">🍌</div>
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
            Welcome Back!
          </CardTitle>
          <CardDescription>Login to continue your banana journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary shadow-glow hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP 🍌"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
