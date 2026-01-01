"use client";

import { InputHTMLAttributes, memo, ReactNode } from "react";
import { Input } from "./Input";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
    rightElement?: ReactNode;
}

export const FormInput = memo(function FormInput({ label, error, helperText, rightElement, className = "", ...props }: FormInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-label font-medium text-text-secondary">
                {label}
            </label>
            <div className="relative">
                <Input
                    {...props}
                    className={`${error ? "border-status-error focus:border-status-error" : ""} ${className}`}
                />
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
            {error ? (
                <p className="text-helper text-status-error-text animate-fade-in">{error}</p>
            ) : helperText ? (
                <p className="text-helper text-text-hint">{helperText}</p>
            ) : null}
        </div>
    );
});
