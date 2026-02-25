import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#E10600] via-[#FF3B5C] to-[#FF5E9C] text-white shadow-lg shadow-[#FF3B5C]/25 hover:shadow-xl hover:shadow-[#FF3B5C]/30 hover:brightness-110",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        outline:
          "border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white",
        secondary:
          "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20",
        ghost:
          "text-white/70 hover:text-white hover:bg-white/10",
        link:
          "text-rose-400 underline-offset-4 hover:underline hover:text-rose-300",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
