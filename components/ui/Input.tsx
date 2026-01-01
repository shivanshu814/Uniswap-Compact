"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm text-gray-400 mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full bg-gray-800 border rounded-xl px-4 py-3 
                        text-white placeholder-gray-500 
                        focus:outline-none transition-colors
                        ${error ? "border-red-500 focus:border-red-500" : "border-gray-700 focus:border-pink-500"}
                        ${className}
                    `}
                    {...props}
                />
                {(error || helperText) && (
                    <p className={`text-xs mt-1 ${error ? "text-red-400" : "text-gray-500"}`}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
