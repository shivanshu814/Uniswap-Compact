import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Custom colors for The Compact
            colors: {
                brand: {
                    primary: "#db2777",      // pink-600
                    "primary-hover": "#ec4899", // pink-500
                    secondary: "#1f2937",    // gray-800
                    "secondary-hover": "#374151", // gray-700
                },
                surface: {
                    DEFAULT: "#000000",
                    card: "#111827",         // gray-900
                    input: "#1f2937",        // gray-800
                    border: "#374151",       // gray-700
                    "border-focus": "#db2777",
                },
                status: {
                    success: "#166534",      // green-900
                    "success-border": "#15803d",
                    "success-text": "#86efac",
                    error: "#7f1d1d",        // red-900
                    "error-border": "#b91c1c",
                    "error-text": "#fca5a5",
                    info: "#1e3a8a",
                    "info-border": "#1d4ed8",
                    "info-text": "#93c5fd",
                },
                text: {
                    primary: "#ffffff",
                    secondary: "#9ca3af",    // gray-400
                    muted: "#6b7280",        // gray-500
                    hint: "#4b5563",         // gray-600
                },
            },
            // Custom border radius
            borderRadius: {
                "btn": "0.75rem",          // 12px rounded-xl
                "card": "1rem",            // 16px rounded-2xl
                "input": "0.75rem",
            },
            // Custom font sizes
            fontSize: {
                "btn-sm": ["0.875rem", { lineHeight: "1.25rem" }],
                "btn-md": ["1rem", { lineHeight: "1.5rem" }],
                "btn-lg": ["1.125rem", { lineHeight: "1.75rem" }],
                "input": ["1rem", { lineHeight: "1.5rem" }],
                "label": ["0.875rem", { lineHeight: "1.25rem" }],
                "helper": ["0.75rem", { lineHeight: "1rem" }],
            },
            // Custom spacing
            spacing: {
                "btn-sm": "0.5rem 0.75rem",
                "btn-md": "0.75rem 1rem",
                "btn-lg": "1rem 1.5rem",
            },
            // Animations
            animation: {
                "slide-in": "slide-in 0.3s ease-out",
                "fade-in": "fade-in 0.2s ease-out",
            },
            keyframes: {
                "slide-in": {
                    from: { transform: "translateX(100%)", opacity: "0" },
                    to: { transform: "translateX(0)", opacity: "1" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(-8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
