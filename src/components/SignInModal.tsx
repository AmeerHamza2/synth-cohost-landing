'use client';

import React from "react";
import {
  FaGoogle,
  FaApple,
  FaYahoo,
} from "react-icons/fa";

import { BsMicrosoft } from "react-icons/bs";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const SignInModal: React.FC<Props> = ({ isOpen = false, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-3 sm:p-4" onClick={onClose}>
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

   

        <div className="mt-4 sm:mt-6">
          <label className="mb-2 sm:mb-3 block text-base sm:text-lg font-semibold text-white">
            What shall we call you?
          </label>

          <input
            placeholder=""
            className="
              h-11
              sm:h-12
              w-full
              rounded-xl
              border
              border-purple-500
              bg-transparent
              px-3
              sm:px-4
              text-sm
              sm:text-base
              text-white
              outline-none
              focus:ring-2
              focus:ring-purple-500
            "
          />

          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-purple-400">
            Nicknames are welcome.
          </p>
        </div>

        <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-white">
          Continue with your email provider
        </h3>

        <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
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
        rounded-xl
        border
        border-white/10
        bg-[#0b0822]
        px-3
        sm:px-4
        py-2.5
        sm:py-3
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

export default SignInModal;
