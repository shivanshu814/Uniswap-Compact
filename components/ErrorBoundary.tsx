"use client";

import { AlertTriangle } from "lucide-react";
import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-gray-900 border border-red-900/50 rounded-2xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 text-red-500 mb-6">
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-8">
                            An unexpected error occurred. Please try refreshing the page.
                            {this.state.error && (
                                <code className="block mt-4 text-xs bg-black p-2 rounded text-red-400 font-mono">
                                    {this.state.error.message}
                                </code>
                            )}
                        </p>
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={() => window.location.reload()}
                        >
                            Refresh Page
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
