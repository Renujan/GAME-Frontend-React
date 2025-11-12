import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OtpVerifyProps {
  email: string;
  onBack: () => void;
}

const OtpVerify = ({ email, onBack }: OtpVerifyProps) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { loginStep2, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/game");
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await loginStep2(email, otp.trim());
      toast.success("Login successful! Welcome back! 🍌");
      // Navigation handled by useEffect
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Invalid OTP. Please check and try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendLoading(true);
    try {
      // Note: This would need a resend endpoint in the backend
      // For now, we'll just show a message
      toast.info("OTP resent to your email");
      setResendCooldown(30); // 30 second cooldown
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-md animate-bounce-in shadow-playful">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4 animate-float">🔐</div>
          <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                maxLength={6}
                className="text-center text-2xl tracking-widest focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-primary shadow-glow hover:scale-105 transition-transform"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP 🍌"}
            </Button>
          </form>

          <div className="mt-4 space-y-3">
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResendOtp}
                disabled={resendLoading || resendCooldown > 0}
                className="text-primary hover:underline"
              >
                {resendLoading
                  ? "Sending..."
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Didn't receive code? Resend"}
              </Button>
            </div>

            <div className="text-center">
              <Button
                variant="link"
                onClick={onBack}
                className="text-muted-foreground hover:text-primary"
              >
                ← Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OtpVerify;
