import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useGame } from "@/contexts/GameContext";
import GuildCard from "@/components/GuildCard";
import { GreekButton } from "@/components/ui/greek-button";
import { useNavigate } from "react-router-dom";
import { Trophy, TrendingUp } from "lucide-react";

const Rankings: React.FC = () => {
  const navigate = useNavigate();
  const { guilds, userGuild, joinGuild, isConnected } = useGame();

  // Sort guilds by total time conquered
  const rankedGuilds = [...guilds].sort(
    (a, b) => b.totalTimeConquered - a.totalTimeConquered
  );

  // Calculate total time across all guilds
  const totalTime = guilds.reduce((sum, g) => sum + g.totalTimeConquered, 0);

  const handleJoinGuild = (guildId: string) => {
    if (!isConnected) return;
    joinGuild(guildId);
    navigate("/guild");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Guild Rankings
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Time conquered this season
          </p>
        </motion.div>

        {/* Season stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-6 p-4 rounded-lg bg-card border border-border"
        >
          <div className="text-center">
            <p className="text-2xl font-serif font-bold text-primary">
              {Math.floor(totalTime / 3600)}h
            </p>
            <p className="text-xs text-muted-foreground">Total Conquered</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-serif font-bold text-foreground">
              {guilds.length}
            </p>
            <p className="text-xs text-muted-foreground">Active Guilds</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-serif font-bold text-accent">
              {guilds.reduce((sum, g) => sum + g.memberCount, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Warriors</p>
          </div>
        </motion.div>

        {/* Guild list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {rankedGuilds.map((guild, index) => (
            <motion.div
              key={guild.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <GuildCard
                guild={guild}
                rank={index + 1}
                isUserGuild={userGuild?.id === guild.id}
                onClick={
                  userGuild?.id === guild.id
                    ? () => navigate("/guild")
                    : undefined
                }
              />
              {/* Join button if not in a guild */}
              {isConnected && !userGuild && (
                <div className="mt-2 pl-16">
                  <GreekButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleJoinGuild(guild.id)}
                  >
                    Join Guild
                  </GreekButton>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Create guild CTA */}
        {isConnected && !userGuild && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-6"
          >
            <p className="text-sm text-muted-foreground mb-3">
              Don't see your guild? Create one.
            </p>
            <GreekButton
              variant="primary"
              size="md"
              onClick={() => navigate("/profile")}
            >
              Create Guild
            </GreekButton>
          </motion.div>
        )}

        {/* Footer quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground italic py-4"
        >
          "Together you hold the line against Kronos."
        </motion.p>
      </div>
    </AppLayout>
  );
};

export default Rankings;
