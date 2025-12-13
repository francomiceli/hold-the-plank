import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import { useGame } from "@/contexts/GameContext";
import { useNavigate } from "react-router-dom";
import TimeTower from "@/components/TimeTower";
import { GreekButton } from "@/components/ui/greek-button";
import { formatTimeReadable } from "@/lib/gameData";
import {
  Users,
  Clock,
  TrendingUp,
  ArrowLeft,
  LogOut,
  Crown,
} from "lucide-react";

const GuildDetail: React.FC = () => {
  const navigate = useNavigate();
  const { userGuild, guilds, leaveGuild, user } = useGame();

  // Redirect if no guild
  if (!userGuild) {
    navigate("/rankings");
    return null;
  }

  // Calculate dominion percentage
  const totalTime = guilds.reduce((sum, g) => sum + g.totalTimeConquered, 0);
  const dominion =
    totalTime > 0
      ? ((userGuild.totalTimeConquered / totalTime) * 100).toFixed(1)
      : "0";

  // Sort members by contribution
  const sortedMembers = [...userGuild.members].sort(
    (a, b) => b.timeContributed - a.timeContributed
  );

  const handleLeave = () => {
    leaveGuild();
    navigate("/rankings");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Guild header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-5xl mb-3">{userGuild.emblem}</span>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {userGuild.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {userGuild.description}
          </p>
        </motion.div>

        {/* Time Tower visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center py-8"
        >
          <TimeTower
            totalSeconds={userGuild.totalTimeConquered}
            size="lg"
            showLabel
            animate
            maxSeconds={86400}
          />
          <p className="text-sm text-muted-foreground mt-4">Guild Time Tower</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-lg font-serif font-bold text-foreground">
              {formatTimeReadable(userGuild.totalTimeConquered)}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Total Conquered
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="text-lg font-serif font-bold text-accent">
              {dominion}%
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Dominion
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border text-center">
            <Users className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <p className="text-lg font-serif font-bold text-foreground">
              {userGuild.memberCount}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Warriors
            </p>
          </div>
        </motion.div>

        {/* Members list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="font-serif font-semibold text-foreground flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            Guild Members
          </h2>
          <div className="space-y-2">
            {sortedMembers.map((member, index) => {
              const isCurrentUser = member.walletAddress === user.walletAddress;
              const contribution =
                userGuild.totalTimeConquered > 0
                  ? (member.timeContributed / userGuild.totalTimeConquered) * 100
                  : 0;

              return (
                <motion.div
                  key={member.walletAddress}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`p-3 rounded-lg border ${
                    isCurrentUser
                      ? "border-primary/40 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-primary text-primary-foreground"
                          : index === 1
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium truncate ${
                            isCurrentUser ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {member.username}
                        </p>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${contribution}%` }}
                            transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {formatTimeReadable(member.timeContributed)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Leave guild button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-4"
        >
          <GreekButton
            variant="ghost"
            size="sm"
            onClick={handleLeave}
            className="w-full text-destructive hover:text-destructive gap-2"
          >
            <LogOut className="w-4 h-4" />
            Leave Guild
          </GreekButton>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground italic py-4"
        >
          "Together you hold the line against Kronos."
        </motion.p>
      </div>
    </AppLayout>
  );
};

export default GuildDetail;
