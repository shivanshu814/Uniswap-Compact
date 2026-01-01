"use client";

import { ChevronDown, } from "lucide-react";
import { useEffect, useRef, useState, memo } from "react";

interface DropdownOption {
    value: string | number;
    label: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
}

export const Dropdown = memo(function Dropdown({ options, value, onChange, placeholder, className = "" }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-left flex items-center justify-between hover:border-gray-600 focus:border-pink-500 transition-colors"
            >
                <span className={selectedOption ? "text-white" : "text-gray-500"}>
                    {selectedOption?.label || placeholder || "Select..."}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden animate-fade-in">
                    <div className="max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${option.value === value
                                    ? "bg-pink-600/20 text-pink-400"
                                    : "text-white"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
});
