"use client";

import { useState, useEffect } from "react";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  showStrength?: boolean;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  id,
  label,
  placeholder = "••••••••",
  value,
  onChange,
  showStrength = false,
  required = false,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(value || "");
  const [strength, setStrength] = useState({
    score: 0,
    label: "Weak",
    color: "text-red-500",
    bgColor: "bg-red-500",
    message: "Add more characters to make it stronger.",
  });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let message = "";
    let label = "Weak";
    let color = "text-red-500";
    let bgColor = "bg-red-500";

    if (password.length === 0) {
      return { score: 0, label: "Weak", color, bgColor, message: "Enter a password." };
    }

    // Length check
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 12.5; // lowercase
    if (/[A-Z]/.test(password)) score += 12.5; // uppercase
    if (/[0-9]/.test(password)) score += 12.5; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 12.5; // special characters

    // Determine strength level
    if (score <= 25) {
      label = "Weak";
      color = "text-red-500";
      bgColor = "bg-red-500";
      message = "Add more characters to make it stronger.";
    } else if (score <= 50) {
      label = "Fair";
      color = "text-orange-500";
      bgColor = "bg-orange-500";
      message = "Consider adding uppercase letters and numbers.";
    } else if (score <= 75) {
      label = "Good";
      color = "text-yellow-500";
      bgColor = "bg-yellow-500";
      message = "Add a special character to make it stronger.";
    } else {
      label = "Strong";
      color = "text-green-500";
      bgColor = "bg-green-500";
      message = "Excellent password strength!";
    }

    return { score, label, color, bgColor, message };
  };

  useEffect(() => {
    if (showStrength) {
      setStrength(calculatePasswordStrength(password));
    }
  }, [password, showStrength]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPassword(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-white text-sm font-semibold block ml-1" htmlFor={id}>
        {label}
      </label>
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
          lock
        </span>
        <input
          className="w-full pl-12 pr-12 h-14 bg-surface-dark border border-border-dark text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#bab09c]"
          id={id}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          required={required}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          <span className="material-symbols-outlined">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>

      {showStrength && (
        <div className="bg-surface-dark border border-border-dark p-4 rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-gray-200">
                Strength: <span className={strength.color}>{strength.label}</span>
              </p>
              <p className={`text-xs font-bold ${strength.color}`}>
                {Math.round(strength.score)}%
              </p>
            </div>
            <div className="h-1.5 w-full bg-border-dark rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.bgColor} transition-all duration-500`}
                style={{ width: `${strength.score}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              {strength.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
