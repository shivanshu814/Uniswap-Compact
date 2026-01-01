"use client";

import { ButtonHTMLAttributes, memo, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
}

export const Button = memo(function Button({
    children,
    variant = "primary",
    size = "md",
    className = "",
    loading = false,
    icon,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-600/20",
        secondary: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
        outline: "bg-transparent border-2 border-pink-600 text-pink-500 hover:bg-pink-600/10",
        ghost: "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white",
        danger: "bg-red-600 hover:bg-red-500 text-white",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`
                flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <Spinner size="sm" /> : icon}
            {children}
        </button>
    );
});
