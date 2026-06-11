import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function Input({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    ...props
}: InputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                {...props}
            />
        </div>
    );
}