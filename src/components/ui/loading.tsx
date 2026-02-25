import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Loading({ size = "md", className }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-white/20 border-t-[#FF3B5C]",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

export function PulseLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-2 w-2 rounded-full bg-gradient-to-r from-[#FF3B5C] to-[#FF5E9C] animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export function FullScreenLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0F14]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#FF3B5C] via-[#FF5E9C] to-[#FF5E9C] animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-[#0E0F14]" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-[#FF3B5C] via-[#FF5E9C] to-[#FF5E9C] animate-ping opacity-20" />
      </div>
      <p className="mt-4 text-sm text-white/50 animate-pulse">PULSE</p>
    </div>
  );
}
