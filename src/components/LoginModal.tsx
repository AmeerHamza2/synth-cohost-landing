'use client';

import React, { useState } from "react";
import { FaApple, FaYahoo, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  apiLogin,
  persistSession,
  redirectToDashboard,
} from "../lib/auth";

interface Props {
  onClose?: () => void;
}

const LoginModal: React.FC<Props> = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiLogin(email.trim(), password);
      if (result && "mfa_required" in result && result.mfa_required) {
        setMfaToken(result.mfa_token);
        setMfaCode("");
        setPassword("");
      } else if (result && "access_token" in result) {
        await persistSession(result.access_token, result.refresh_token);
        redirectToDashboard();
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mfaCode.trim()) {
      setError("Please enter your authentication code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://api.synthcohost.com"}/auth/mfa/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mfa_token: mfaToken, code: mfaCode.trim() }),
        }
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || `MFA verification failed (${res.status})`);
      }

      const data = JSON.parse(text) as {
        access_token: string;
        refresh_token: string;
      };
      await persistSession(data.access_token, data.refresh_token);
      redirectToDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "MFA verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 sm:p-4" onClick={onClose}>
      <div className="relative w-full max-w-[500px] rounded-2xl border border-purple-500/40 bg-[#050016] p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 sm:right-4 top-3 sm:top-4 text-purple-400 hover:text-purple-300 text-lg sm:text-base"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="/cohost_synth_logo_extracted.png"
            alt="cohost synth"
            className="h-14 sm:h-20 object-contain"
          />
        </div>

        {mfaToken ? (
          <form onSubmit={handleMfaVerify}>
            <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-white">
              Two-factor authentication
            </h3>
            <p className="mt-2 text-sm text-[rgba(255,255,255,0.65)]">
              Enter the code from your authenticator app.
            </p>

            <div className="relative mt-3 sm:mt-4">
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="6-digit code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="h-11 sm:h-[58px] w-full rounded-xl border-2 border-purple-500 bg-[#0F0E19] px-4 text-sm sm:text-base text-white placeholder:text-[rgba(255,255,255,0.55)] outline-none focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-shadow"
              />
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-[58px] mt-4 sm:mt-5 rounded-xl text-white text-base sm:text-xl font-bold transition-all hover:brightness-110 disabled:opacity-60"
              style={{ background: 'linear-gradient(90deg, #C26CFF, #8F3DFF)' }}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            {/* Section Heading */}
            <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-white">
              Log in with your credentials
            </h3>

            {/* Input Fields */}
            <div className="mt-3 sm:mt-4 space-y-3">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.55)]">
                  <FaUser className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-11 sm:h-[58px] w-full rounded-xl border-2 border-purple-500 bg-[#0F0E19] pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base text-white placeholder:text-[rgba(255,255,255,0.55)] outline-none focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-shadow"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.55)]">
                  <FaLock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 sm:h-[58px] w-full rounded-xl border-2 border-purple-500 bg-[#0F0E19] pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base text-white placeholder:text-[rgba(255,255,255,0.55)] outline-none focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.55)] hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Row */}
            <div className="flex items-center justify-between mt-3 sm:mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-purple-500 bg-transparent accent-purple-500"
                />
                <span className="text-xs sm:text-[15px] text-[rgba(255,255,255,0.75)]">Remember me</span>
              </label>
              <button type="button" className="text-xs sm:text-[15px] text-purple-400 hover:text-purple-300 transition-colors bg-transparent border-0 cursor-pointer">
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-[58px] mt-4 sm:mt-5 rounded-xl text-white text-base sm:text-xl font-bold transition-all hover:brightness-110 disabled:opacity-60"
              style={{
                background: 'linear-gradient(90deg, #C26CFF, #8F3DFF)',
              }}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 sm:gap-4 my-4 sm:my-5">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
          <span className="text-[rgba(255,255,255,0.5)] text-xs sm:text-sm">OR</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          Log in with your provider
        </h3>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <ProviderButton
            icon={
              <svg viewBox="0 0 48 48" width="24" height="24">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
            }
            label="Google"
            color=""
          />

          <ProviderButton
            icon={
              <svg viewBox="0 0 23 23" width="24" height="24">
                <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
                <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
                <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
                <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
              </svg>
            }
            label="Microsoft"
            color=""
          />

          <ProviderButton
            icon={<FaApple />}
            label="Apple"
            color="#FFFFFF"
          />

          <ProviderButton
            icon={<FaYahoo />}
            label="Yahoo"
            color="#410093"
          />
        </div>

        <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400 leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-purple-400">
            Terms of Service
          </span>
          <br />
          and{" "}
          <span className="text-purple-400">
            Privacy Policy
          </span>
          .
        </p>
      </div>
    </div>
  );
};

interface ProviderButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
}

function ProviderButton({
  icon,
  label,
  color,
}: ProviderButtonProps) {
  return (
    <button
      className="
        flex
        items-center
        gap-2
        sm:gap-3
        h-11
        sm:h-14
        rounded-[10px]
        border
        border-white/10
        bg-[#12111D]
        px-3
        sm:px-4
        text-white
        transition
        hover:border-purple-500
      "
    >
      <span className="text-xl sm:text-2xl" style={color ? { color } : undefined}>{icon}</span>
      <span className="text-sm sm:text-base font-medium">
        {label}
      </span>
    </button>
  );
}

export default LoginModal;
