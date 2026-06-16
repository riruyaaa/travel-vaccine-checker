import { ReactNode } from "react";

export default function BottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 left-0 right-0 border-t border-gray-100 bg-white/95 backdrop-blur px-4 py-3 flex gap-3">
      {children}
    </div>
  );
}
