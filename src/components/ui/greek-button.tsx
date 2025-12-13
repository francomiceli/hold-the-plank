import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const greekButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-serif font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95 shadow-[0_4px_20px_hsl(var(--gold)/0.25)] hover:shadow-[0_6px_30px_hsl(var(--gold)/0.4)]",
        secondary:
          "bg-muted text-foreground border border-border hover:bg-muted/80 hover:border-primary/50",
        ghost:
          "text-primary hover:bg-primary/10 hover:text-primary",
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        conquest:
          "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] text-primary-foreground animate-[shimmer_2s_linear_infinite] shadow-[0_4px_30px_hsl(var(--gold)/0.35)] hover:shadow-[0_8px_40px_hsl(var(--gold)/0.5)]",
      },
      size: {
        sm: "h-9 px-4 text-xs rounded-md",
        md: "h-11 px-6 text-sm rounded-lg",
        lg: "h-14 px-8 text-base rounded-lg",
        xl: "h-16 px-10 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface GreekButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof greekButtonVariants> {
  asChild?: boolean;
}

const GreekButton = React.forwardRef<HTMLButtonElement, GreekButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(greekButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GreekButton.displayName = "GreekButton";

export { GreekButton, greekButtonVariants };
