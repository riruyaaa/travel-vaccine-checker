import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "w-full rounded-xl px-5 py-3 text-base font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
