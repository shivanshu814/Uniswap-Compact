"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Step {
    label: string;
    status: "upcoming" | "loading" | "success" | "error";
}

interface TransactionProgressProps {
    steps: Step[];
    className?: string;
}

export function TransactionProgress({ steps, className = "" }: TransactionProgressProps) {
    return (
        <div className={`space-y-6 ${className}`}>
            {steps.map((step, index) => (
                <div key={index} className="relative flex items-start gap-4">
                    {index < steps.length - 1 && (
                        <div
                            className={`absolute left-[10px] top-[24px] w-0.5 h-[calc(100%+8px)] transition-colors duration-500 ${step.status === "success" ? "bg-status-success-border" : "bg-surface-border"
                                }`}
                        />
                    )}

                    <div className="relative flex-shrink-0 z-10 bg-surface-card rounded-full p-0.5">
                        {step.status === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-status-success-text" />
                        ) : step.status === "loading" ? (
                            <div className="w-5 h-5 flex items-center justify-center relative">
                                <span className="absolute w-3 h-3 bg-brand-primary/20 rounded-full animate-ping" />
                                <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                            </div>
                        ) : step.status === "error" ? (
                            <Circle className="w-5 h-5 text-status-error-text fill-status-error/20" />
                        ) : (
                            <Circle className="w-5 h-5 text-text-hint fill-surface-input" />
                        )}
                    </div>
                    <div className="flex-1 pt-0.5">
                        <p className={`text-sm font-semibold transition-colors duration-300 ${step.status === "upcoming" ? "text-text-hint" :
                            step.status === "loading" ? "text-brand-primary" : "text-text-primary"
                            }`}>
                            {step.label}
                        </p>
                        {step.status === "loading" && (
                            <span className="text-[10px] text-brand-primary/80 font-medium uppercase tracking-wider">
                                Current Step
                            </span>
                        )}
                        {step.status === "success" && (
                            <span className="text-[10px] text-status-success-text font-medium uppercase tracking-wider">
                                Completed
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
