import React, { useState } from "react";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";
import { googleAuthService, loginService } from "../service/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../redux/authSlice";
import type { RootState, AppDispatch } from "../redux/store";
import styles from "./Login.module.css";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { loginSchema } from "../schema/loginSchema";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  // ✅ Validate form data
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    toast.error(firstIssue.message);
    return;
  }

  try {
    setLoading(true);
    const res = await loginService(validation.data); // use validated data
    console.log("Login response:", res);

    // ✅ Save to redux + localStorage
    dispatch(setUser({ user: res.data.user, token: res.data.token }));
    localStorage.setItem("token", res.data.token);

    setSuccess("✅ Login successful!");
    toast.success("Login successful!");
    setEmail("");
    setPassword("");

    // ✅ Role-based redirect
    if (res.data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");
    }

  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Something went wrong.");
    setError(err.response?.data?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  const handleLoginSuccess = async (response: any) => {
    try {
      const idToken = response.credential;
      const res = await googleAuthService(idToken);
      console.log("Google login response:", res);
      dispatch(setUser({ user: res.data.user, token: res.data.token }));
      localStorage.setItem("token", res.data.token);
      setSuccess("✅ Google Login successful!");
      navigate("/home");
    } catch (err: any) {
      setError("Google login failed. Try again.");
    }
  };

  const handleLoginError = () => {
    console.error("Google Login Failed");
    setError("Google login failed. Try again.");
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative flex items-center justify-center">
      {/* Background geometric elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-300/20 rounded-full blur-3xl ${styles.animatePulseSlow}`}
        ></div>
        <div
          className={`absolute top-1/3 -right-20 w-80 h-80 bg-gradient-to-bl from-teal-300/20 to-cyan-200/30 rounded-full blur-2xl ${styles.animatePulseSlow} ${styles.animationDelay1000}`}
        ></div>
        <div
          className={`absolute bottom-0 left-1/4 w-64 h-64 bg-gradient-to-t from-teal-100/40 to-transparent rounded-full blur-xl ${styles.animatePulseSlow} ${styles.animationDelay500}`}
        ></div>
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left decorative panel */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 relative items-center justify-center p-12">
          <div className="relative">
            {/* Floating geometric shapes */}
            <div
              className={`absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl rotate-12 opacity-80 ${styles.animateFloatUp}`}
            ></div>
            <div
              className={`absolute -bottom-12 -right-6 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl -rotate-12 opacity-70 ${styles.animateFloatDown}`}
            ></div>
            <div
              className={`absolute top-1/2 -left-16 w-8 h-8 bg-gradient-to-br from-teal-300 to-teal-500 rounded-lg rotate-45 opacity-60 ${styles.animateFloatUp} ${styles.animationDelay500}`}
            ></div>

            {/* Main content */}
            <div className={`text-center space-y-8 ${styles.animateFadeInUp}`}>
              <div className="space-y-4">
                <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Welcome to Brototype
                </h1>
                <p className="text-xl text-gray-600 max-w-md">
                  Unlock your tech career with Brocamp’s innovative training
                  platform
                </p>
              </div>

              {/* Decorative lines */}
              <div className="space-y-3">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto"></div>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div
              className={`lg:hidden text-center mb-12 ${styles.animateFadeIn}`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                  <BoltIcon className="h-7 w-7 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Brototype
              </h1>
            </div>

            {/* Glassmorphism login form */}
            <form
              onSubmit={handleSubmit}
              className={`backdrop-blur-lg bg-white/80 border border-white/20 rounded-3xl shadow-2xl shadow-teal-500/10 p-8 lg:p-10 ${styles.animateFadeInUp} ${styles.animationDelay200}`}
            >
              {/* Desktop logo */}
              <div className="hidden lg:block text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    <BoltIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Brototype
                </h2>
              </div>

              <div className="space-y-6">
                <div
                  className={`${styles.animateFadeIn} ${styles.animationDelay300}`}
                >
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Sign In to Brocamp
                  </h3>
                  <p className="text-gray-600">
                    Welcome back! Sign in to continue your tech journey
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Email field */}
                  <div
                    className={`space-y-2 ${styles.animatePopIn} ${styles.animationDelay400}`}
                  >
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 backdrop-blur-sm ${
                          error ? styles.animateShake : ""
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  {/* Password field */}
                  <div
                    className={`space-y-2 ${styles.animatePopIn} ${styles.animationDelay500}`}
                  >
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 bg-white/50 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 backdrop-blur-sm ${
                          error ? styles.animateShake : ""
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* Forgot password link */}
                  <div
                    className={`text-right ${styles.animateFadeIn} ${styles.animationDelay600}`}
                  >
                    <Link to="/forgot-password">
                      <button
                        type="button"
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200"
                      >
                        Forgot password?
                      </button>
                    </Link>
                  </div>
                  {/* Error + Success messages */}
                  {(error || success) && (
                    <div
                      className={`text-center ${styles.animateFadeIn} ${styles.animationDelay700}`}
                    >
                      {error && (
                        <p className="text-red-500 text-sm font-medium">
                          {error}
                        </p>
                      )}
                      {success && (
                        <p className="text-green-600 text-sm font-medium">
                          {success}
                        </p>
                      )}
                    </div>
                  )}
                  {/* Login button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/25 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 disabled:opacity-50 ${styles.animatePopIn} ${styles.animationDelay700}`}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </div>
                <div
                  className={`mt-4 ${styles.animateFadeIn} ${styles.animationDelay800}`}
                >
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginError}
                    theme="filled_blue"
                    shape="rectangular"
                    width="100%"
                  />
                </div>

                {/* Divider */}
                <div
                  className={`relative my-8 ${styles.animateFadeIn} ${styles.animationDelay600}`}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-gray-500 backdrop-blur-sm rounded-full">
                      New to Brocamp?
                    </span>
                  </div>
                </div>

                {/* Sign up link */}
                <div
                  className={`text-center ${styles.animateFadeIn} ${styles.animationDelay700}`}
                >
                 <button
                    type="button"
                    className="text-gray-600 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => navigate("/register")} // ✅ navigate to /register
                  >
                    Create an account
                  </button>
                </div>
              </div>
            </form>

            {/* Footer text */}
            <p
              className={`text-center text-sm text-gray-500 mt-8 ${styles.animateFadeIn} ${styles.animationDelay700}`}
            >
              © 2025 Brototype Pvt Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
