import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export default function Button({
    children,
    type = "button",
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type as "button" | "submit" | "reset"}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}