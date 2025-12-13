import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "gold" | "bronze";
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  subValue,
  variant = "default",
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-4 rounded-lg border overflow-hidden",
        variant === "gold" && "border-primary/40 bg-primary/5",
        variant === "bronze" && "border-accent/40 bg-accent/5",
        variant === "default" && "border-border bg-card",
        className
      )}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
        <div
          className={cn(
            "absolute -top-4 -right-4 w-8 h-8 rotate-45",
            variant === "gold" && "bg-primary/20",
            variant === "bronze" && "bg-accent/20",
            variant === "default" && "bg-border/50"
          )}
        />
      </div>

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
            variant === "gold" && "bg-primary/20 text-primary",
            variant === "bronze" && "bg-accent/20 text-accent",
            variant === "default" && "bg-muted text-muted-foreground"
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <p
            className={cn(
              "text-xl font-serif font-semibold truncate",
              variant === "gold" && "text-primary",
              variant === "bronze" && "text-accent",
              variant === "default" && "text-foreground"
            )}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
