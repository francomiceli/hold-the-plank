import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimeTowerProps {
  totalSeconds: number;
  maxSeconds?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
  className?: string;
}

const TimeTower: React.FC<TimeTowerProps> = ({
  totalSeconds,
  maxSeconds = 86400, // 24 hours default max
  size = "md",
  showLabel = false,
  animate = false,
  className,
}) => {
  // Calculate fill percentage (capped at 100%)
  const fillPercentage = Math.min((totalSeconds / maxSeconds) * 100, 100);
  
  // Calculate number of segments (each segment = 15 minutes = 900 seconds)
  const segments = Math.floor(totalSeconds / 900);
  const maxSegments = size === "sm" ? 8 : size === "md" ? 12 : 16;
  const displaySegments = Math.min(segments, maxSegments);

  const sizeClasses = {
    sm: "w-6 h-20",
    md: "w-10 h-40",
    lg: "w-16 h-64",
  };

  const segmentHeight = {
    sm: "h-2",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Column capital */}
      <div
        className={cn(
          "relative",
          size === "sm" ? "w-8 h-3" : size === "md" ? "w-14 h-4" : "w-20 h-6"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary rounded-t-sm" />
        <div className="absolute -bottom-0.5 left-0 right-0 h-1 bg-primary/60" />
      </div>

      {/* Column shaft */}
      <div
        className={cn(
          "relative overflow-hidden rounded-sm",
          sizeClasses[size],
          "bg-gradient-to-b from-muted/50 to-muted/30 border border-border/50"
        )}
      >
        {/* Background segments */}
        <div className="absolute inset-0 flex flex-col-reverse gap-0.5 p-0.5">
          {Array.from({ length: maxSegments }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-full rounded-[1px] bg-border/30",
                segmentHeight[size]
              )}
            />
          ))}
        </div>

        {/* Filled segments */}
        <div className="absolute inset-0 flex flex-col-reverse gap-0.5 p-0.5">
          {Array.from({ length: displaySegments }).map((_, i) => (
            <motion.div
              key={i}
              initial={animate ? { scaleY: 0, opacity: 0 } : false}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: animate ? i * 0.1 : 0, duration: 0.3 }}
              className={cn(
                "w-full rounded-[1px] origin-bottom",
                segmentHeight[size],
                "bg-gradient-to-r from-primary via-accent to-primary"
              )}
            />
          ))}
        </div>

        {/* Glow effect */}
        {displaySegments > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, hsl(var(--gold) / 0.2), transparent ${fillPercentage}%)`,
            }}
          />
        )}

        {/* Fluting lines (column ridges) */}
        <div className="absolute inset-0 flex justify-between px-0.5 opacity-20">
          {Array.from({ length: size === "sm" ? 3 : size === "md" ? 5 : 7 }).map((_, i) => (
            <div key={i} className="w-px h-full bg-foreground/30" />
          ))}
        </div>
      </div>

      {/* Column base */}
      <div
        className={cn(
          "relative",
          size === "sm" ? "w-8 h-2" : size === "md" ? "w-14 h-3" : "w-20 h-4"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-muted/80 to-muted/40 rounded-b-sm" />
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-border/40" />
      </div>

      {/* Label */}
      {showLabel && (
        <p className="mt-2 text-xs text-muted-foreground font-medium">
          {Math.floor(totalSeconds / 3600)}h {Math.floor((totalSeconds % 3600) / 60)}m
        </p>
      )}
    </div>
  );
};

export default TimeTower;
