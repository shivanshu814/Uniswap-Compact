export interface Toast {
    id: number;
    type: "success" | "error" | "info" | "loading";
    message: string;
    txHash?: string;
}

export interface ToastContextType {
    toasts: Toast[];
    showToast: (type: Toast["type"], message: string, txHash?: string) => number;
    dismissToast: (id: number) => void;
    updateToast: (id: number, type: Toast["type"], message: string, txHash?: string) => void;
}

export interface LockEntry {
    id: string;
    txHash: string;
    amount: string;
    timestamp: number;
    type: "deposit" | "withdrawal";
}

export interface LockHistoryContextType {
    locks: LockEntry[];
    addLock: (lock: Omit<LockEntry, "timestamp">) => void;
    clearHistory: () => void;
}

export interface DropdownOption {
    value: string | number;
    label: string;
}

export interface DropdownProps {
    options: DropdownOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ResetPeriodOption {
    label: string;
    seconds: number;
}

export type Address = `0x${string}`;
export type Bytes12 = `0x${string}`;
