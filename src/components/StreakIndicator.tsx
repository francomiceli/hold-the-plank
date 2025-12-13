import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakIndicatorProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  currentStreak,
  longestStreak,
  className,
}) => {
  const isActive = currentStreak > 0;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full border",
        isActive
          ? "border-primary/40 bg-primary/10"
          : "border-border bg-muted/50",
        className
      )}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={cn(
          "flex items-center justify-center",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Flame className="w-5 h-5" />
      </motion.div>
      <div className="flex flex-col">
        <span
          className={cn(
            "text-sm font-semibold leading-none",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </span>
        {longestStreak > currentStreak && (
          <span className="text-[10px] text-muted-foreground leading-tight">
            Best: {longestStreak}
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakIndicator;
