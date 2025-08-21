import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  BoltIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { resendOtpService, verifyOtpService } from "../service/AuthService";
import { useLocation } from "react-router-dom";


interface LocationState {
  email: string;
}

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state as LocationState;

  useEffect(() => {
    inputRefs.current[0]?.focus();
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase();
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    [inputRefs]
  );

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData
      .getData("text")
      .trim()
      .split("")
      .slice(0, 6);
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      pasteData.forEach((char, i) => {
        newOtp[i] = char.toUpperCase();
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasteData.length - 1, 5)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await verifyOtpService({
        email,
        otp: otpCode,
      });
      console.log("OTP verification response:", res.data);

      if (res.data.success) {
        setSuccess("✅ OTP Verified Successfully!");
        localStorage.removeItem('otpAccess');
        navigate("/login");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendCountdown(60);
    setError("");
    setSuccess("");

    try {
      const res = await resendOtpService({ email }); 
      if (res.data.success) {
        setSuccess("✅ OTP resent successfully!");
      } else {
        setError("Failed to resend OTP. Please try again.");
        setCanResend(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
      setCanResend(true); 
    }

    // Countdown timer
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-teal-100/50 to-cyan-100/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-80 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-100/45 to-teal-100/35 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 opacity-80 animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-teal-50/40 via-transparent to-cyan-50/40 rounded-full blur-3xl opacity-70 animate-rotate-slow"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-teal-500/15 rounded-xl rotate-45 animate-float-up"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-cyan-500/15 rounded-xl rotate-12 animate-float-down"></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-14 bg-teal-400/15 rounded-xl -rotate-12 animate-float-up animation-delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-10 h-10 bg-cyan-400/15 rounded-xl rotate-45 animate-float-down animation-delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-2xl bg-white/70 border border-white/50 rounded-3xl shadow-2xl shadow-teal-500/20 p-10 transform transition-all duration-1000 ease-out animate-fade-in-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <BoltIcon className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4 animate-fade-in animation-delay-200">
            Verify Your Brototype Account
          </h2>
          <p className="text-center text-gray-600 mb-8 leading-relaxed animate-fade-in animation-delay-300">
            Enter the 6-digit code sent to your email to join Brocamp. It may
            take a minute to arrive.
          </p>

          {/* OTP Input */}
          <form onSubmit={handleSubmit} onPaste={handlePaste}>
            <div className="flex justify-center space-x-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={setInputRef(index)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-2xl font-bold text-gray-900 bg-white/80 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 shadow-sm hover:shadow-md ${
                    digit ? "border-teal-500" : "border-gray-200"
                  } ${
                    error ? "animate-shake border-red-500" : ""
                  } animate-pop-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              ))}
            </div>

            {error && (
              <p className="text-center text-red-500 mb-6 animate-fade-in">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed animate-fade-in animation-delay-500"
            >
              {isSubmitting ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Verify OTP
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200 ${
                !canResend ? "opacity-50 cursor-not-allowed" : ""
              } animate-fade-in animation-delay-600`}
            >
              Resend OTP {resendCountdown > 0 && `in ${resendCountdown}s`}
            </button>
          </div>

          {/* Email Hint */}
          <div className="mt-8 flex justify-center items-center space-x-2 text-gray-500 animate-fade-in animation-delay-700">
            <EnvelopeIcon className="h-4 w-4" />
            <p className="text-sm">Check your spam folder if not received</p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite ease-in-out;
        }

        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-rotate-slow {
          animation: rotate-slow 60s linear infinite;
        }

        @keyframes float-up {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.5; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        }
        .animate-float-up {
          animation: float-up 6s infinite ease-in-out;
        }

        @keyframes float-down {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(20px) rotate(-10deg); opacity: 0.5; }
          100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        }
        .animate-float-down {
          animation: float-down 6s infinite ease-in-out;
        }

        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-600 { animation-delay: 600ms; }
        .animation-delay-700 { animation-delay: 700ms; }
        .animation-delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  );
};

export default OtpVerification;
