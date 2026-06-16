import { HTMLAttributes } from "react";

export default function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl bg-gray-50 border border-gray-100 p-4 ${className}`}
      {...props}
    />
  );
}
