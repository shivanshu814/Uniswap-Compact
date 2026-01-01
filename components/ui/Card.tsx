"use client";

import { memo, ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

export const Card = memo(function Card({ children, className = "", title }: CardProps) {
    return (
        <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 ${className}`}>
            {title && (
                <h2 className="text-xl font-semibold mb-6">{title}</h2>
            )}
            {children}
        </div>
    );
});
