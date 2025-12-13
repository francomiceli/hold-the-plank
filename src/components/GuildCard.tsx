import { Guild } from "@/lib/gameData";
import { formatTimeReadable } from "@/lib/gameData";
import TimeTower from "./TimeTower";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuildCardProps {
  guild: Guild;
  rank?: number;
  isUserGuild?: boolean;
  onClick?: () => void;
  className?: string;
}

const GuildCard: React.FC<GuildCardProps> = ({
  guild,
  rank,
  isUserGuild,
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-lg border bg-card transition-all duration-300",
        onClick && "cursor-pointer hover:border-primary/50 hover:bg-card/80",
        isUserGuild && "border-primary/40 ring-1 ring-primary/20",
        !isUserGuild && "border-border",
        className
      )}
    >
      {/* Rank badge */}
      {rank && (
        <div
          className={cn(
            "absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-serif font-bold",
            rank === 1 && "bg-primary text-primary-foreground",
            rank === 2 && "bg-accent text-accent-foreground",
            rank === 3 && "bg-bronze text-foreground",
            rank > 3 && "bg-muted text-muted-foreground"
          )}
        >
          {rank}
        </div>
      )}

      {/* User's guild indicator */}
      {isUserGuild && (
        <div className="absolute -top-2 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider font-semibold rounded-sm">
          Your Guild
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Guild emblem & tower */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">{guild.emblem}</span>
          <TimeTower
            totalSeconds={guild.totalTimeConquered}
            size="sm"
            maxSeconds={86400}
          />
        </div>

        {/* Guild info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-foreground truncate">
            {guild.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {guild.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="font-semibold">
                {formatTimeReadable(guild.totalTimeConquered)}
              </span>
              <span className="text-xs text-muted-foreground">conquered</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{guild.memberCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuildCard;
