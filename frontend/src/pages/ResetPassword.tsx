import React, { useState } from 'react';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckIcon, BoltIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import { resetPasswordService } from '../service/AuthService';
// import { resetPasswordService } from '../service/AuthService';

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const navigate = useNavigate();
  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  if (!token) {
    setError('Invalid or missing reset token');
    return;
  }

  if (!passwordsMatch) {
    setError('Passwords do not match');
    return;
  }

  try {
    setLoading(true);
    // Call reset password service
    await resetPasswordService({ token, password: formData.password });
    setSuccess('✅ Password reset successfully!');
    setFormData({ password: '', confirmPassword: '' });
    navigate('/login'); // Redirect to login page after reset
  } catch (err: any) {
    console.error('Reset password error:', err.response?.data || err.message);
    setError(err.response?.data?.message || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white overflow-hidden relative flex items-center justify-center">
      {/* Background geometric elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-bl from-teal-200/25 to-cyan-300/15 rounded-full blur-3xl transform rotate-12 ${styles.animatePulseSlow}`}></div>
        <div className={`absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-teal-300/20 to-cyan-200/25 rounded-full blur-2xl transform -rotate-12 ${styles.animatePulseSlow} ${styles.animationDelay1000}`}></div>
        <div className={`absolute bottom-1/4 right-1/3 w-64 h-64 bg-gradient-to-tl from-teal-100/30 to-transparent rounded-full blur-xl ${styles.animatePulseSlow} ${styles.animationDelay500}`}></div>
        {/* Diagonal accent lines */}
        <div className="absolute top-0 right-0 w-1 h-96 bg-gradient-to-b from-teal-400/30 to-transparent transform rotate-12 origin-top"></div>
        <div className="absolute bottom-0 left-1/4 w-1 h-64 bg-gradient-to-t from-cyan-400/20 to-transparent transform -rotate-12 origin-bottom"></div>
      </div>

      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center">
        {/* Left content panel */}
        <div className={`hidden lg:flex lg:w-1/2 xl:w-2/5 relative items-center justify-center p-8 xl:p-10 ${styles.animateFadeInUp}`}>
          <div className="relative max-w-md w-full">
            {/* Floating geometric shapes */}
            <div className={`absolute -top-12 -left-12 w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl rotate-45 opacity-80 transform hover:rotate-90 transition-transform duration-700 ${styles.animateFloatUp}`}></div>
            <div className={`absolute -bottom-16 -right-8 w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl -rotate-12 opacity-70 transform hover:rotate-12 transition-transform duration-500 ${styles.animateFloatDown}`}></div>
            <div className={`absolute top-1/3 -left-20 w-10 h-10 bg-gradient-to-br from-teal-300 to-teal-500 rounded-xl rotate-12 opacity-60 transform hover:scale-110 transition-transform duration-300 ${styles.animateFloatUp} ${styles.animationDelay500}`}></div>
            <div className={`absolute top-2/3 right-0 w-6 h-6 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-lg -rotate-45 opacity-50 ${styles.animateFloatDown} ${styles.animationDelay1000}`}></div>
            
            {/* Main content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
                  Reset Your Password
                </h1>
                <div className="space-y-3">
                  <p className="text-lg xl:text-xl text-gray-700 font-medium">
                    Secure your Brocamp account
                  </p>
                  <p className="text-base text-gray-600 max-w-md leading-relaxed mx-auto lg:mx-0">
                    Create a new password to continue your tech journey with Brototype
                  </p>
                </div>
              </div>
              
              {/* Feature highlights */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-600">Secure password reset process</span>
                </div>
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-600">Instant access after reset</span>
                </div>
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span className="text-gray-600">24/7 support for account issues</span>
                </div>
              </div>
              
              {/* Decorative lines */}
              <div className="space-y-3 pt-3 flex flex-col items-center lg:items-start">
                <div className="h-px w-40 bg-gradient-to-r from-teal-400 via-cyan-400 to-transparent"></div>
                <div className="h-px w-28 bg-gradient-to-r from-cyan-400 via-teal-400 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right reset password panel */}
        <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className={`lg:hidden text-center mb-8 ${styles.animateFadeIn}`}>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                  <BoltIcon className="h-7 w-7 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                Brototype
              </h1>
              <p className="text-gray-600">Reset your Brocamp password</p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className={`backdrop-blur-xl bg-white/85 border border-white/30 rounded-3xl shadow-2xl shadow-teal-500/10 p-6 lg:p-8 transform hover:shadow-teal-500/15 transition-all duration-300 ${styles.animateFadeInUp} ${styles.animationDelay200}`}
            >
              {/* Desktop logo */}
              <div className="hidden lg:block text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    <BoltIcon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Brototype
                </h2>
              </div>

              <div className="space-y-5">
                <div className={`text-center lg:text-left ${styles.animateFadeIn} ${styles.animationDelay300}`}>
                  {/* <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                    Reset Your Password
                  </h3> */}
                  <p className="text-gray-600">Create a new password for your account</p>
                </div>

                <div className="space-y-4">
                  {/* Password */}
                  <div className={`space-y-2 ${styles.animatePopIn} ${styles.animationDelay400}`}>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white/60 border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200 backdrop-blur-sm placeholder-gray-400 ${error ? styles.animateShake : ''}`}
                        placeholder="Create a new password"
                        required
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

                  {/* Confirm Password */}
                  <div className={`space-y-2 ${styles.animatePopIn} ${styles.animationDelay500}`}>
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white/60 border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 backdrop-blur-sm placeholder-gray-400 ${formData.confirmPassword && passwordsMatch
                          ? 'border-green-300 focus:ring-green-500/50 focus:border-green-500/50'
                          : formData.confirmPassword && !passwordsMatch
                          ? `border-red-300 focus:ring-red-500/50 focus:border-red-500/50 ${styles.animateShake}`
                          : 'border-gray-200/60 focus:ring-teal-500/50 focus:border-teal-500/50'
                        }`}
                        placeholder="Confirm your new password"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
                        {formData.confirmPassword && passwordsMatch && (
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                          )}
                        </button>
                      </div>
                    </div>
                    {formData.confirmPassword && !passwordsMatch && (
                      <p className={`text-sm text-red-500 mt-1 ${styles.animateFadeIn}`}>Passwords do not match</p>
                    )}
                  </div>

                  {/* Error/Success */}
                  {(error || success) && (
                    <div className={`text-center ${styles.animateFadeIn} ${styles.animationDelay600}`}>
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      {success && <p className="text-green-600 text-sm">{success}</p>}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3.5 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-500/25 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 mt-5 ${styles.animatePopIn} ${styles.animationDelay600}`}
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>

                  {/* Back to Login */}
                  <div className={`text-center ${styles.animateFadeIn} ${styles.animationDelay700}`}>
                    <Link
                      to="/login"
                      className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <p className={`text-center text-sm text-gray-500 mt-6 ${styles.animateFadeIn} ${styles.animationDelay800}`}>
              © 2025 Brototype Pvt Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;