import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { api } from "@/lib/api";
import {
  UserProfile,
  Guild,
  defaultUser,
  mockGuilds,
  calculateAuraPoints,
  calculatePlankReward,
  calculateLifeTimeGained,
  SessionResult,
} from "@/lib/gameData";

interface GameContextType {
  // Wallet state
  isConnected: boolean;
  walletAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;

  // User state
  user: UserProfile;
  updateUsername: (name: string) => void;
  
  // Guild state
  guilds: Guild[];
  userGuild: Guild | null;
  joinGuild: (guildId: string) => void;
  leaveGuild: () => void;
  createGuild: (name: string, emblem: string, description: string) => void;

  // Session state
  completeSession: (validSeconds: number) => SessionResult;
  claimPlank: () => Promise<boolean>;
  pendingPlankReward: number;

  // NFT state
  mintNFT: () => Promise<boolean>;
  
  // Onboarding
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { login, logout, authenticated, ready, getAccessToken, user: privyUser } = usePrivy();
  
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [guilds, setGuilds] = useState<Guild[]>(mockGuilds);
  const [pendingPlankReward, setPendingPlankReward] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Sync with backend when Privy auth changes
  useEffect(() => {
    const syncUser = async () => {
      if (authenticated && ready) {
        setIsLoading(true);
        try {
          const accessToken = await getAccessToken();
          if (accessToken) {
            const { user: backendUser } = await api.verifyAuth(accessToken);
            
            setWalletAddress(backendUser.walletAddress || "");
            setUser({
              ...defaultUser,
              walletAddress: backendUser.walletAddress || "",
              username: backendUser.username || `Warrior_${backendUser.id}`,
              guildId: backendUser.guildId,
              plankBalance: Number(backendUser.balancePlank) || 0,
              auraPoints: backendUser.auraPoints || 0,
            });
          }
        } catch (error) {
          console.error("Failed to sync user:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    syncUser();
  }, [authenticated, ready, getAccessToken]);

  // Connect wallet (opens Privy login)
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await login();
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    await logout();
    setWalletAddress("");
    setUser(defaultUser);
    setPendingPlankReward(0);
  }, [logout]);

  const updateUsername = useCallback((name: string) => {
    setUser((prev) => ({ ...prev, username: name }));
  }, []);

  // Get user's guild
  const userGuild = user.guildId ? guilds.find((g) => g.id === user.guildId) || null : null;

  const joinGuild = useCallback((guildId: string) => {
    setUser((prev) => ({ ...prev, guildId }));
    setGuilds((prev) =>
      prev.map((g) =>
        g.id === guildId
          ? {
              ...g,
              memberCount: g.memberCount + 1,
              members: [
                ...g.members,
                { username: user.username, walletAddress: user.walletAddress, timeContributed: 0 },
              ],
            }
          : g
      )
    );
  }, [user.username, user.walletAddress]);

  const leaveGuild = useCallback(() => {
    if (user.guildId) {
      setGuilds((prev) =>
        prev.map((g) =>
          g.id === user.guildId
            ? {
                ...g,
                memberCount: g.memberCount - 1,
                members: g.members.filter((m) => m.walletAddress !== user.walletAddress),
              }
            : g
        )
      );
      setUser((prev) => ({ ...prev, guildId: null }));
    }
  }, [user.guildId, user.walletAddress]);

  const createGuild = useCallback((name: string, emblem: string, description: string) => {
    const newGuild: Guild = {
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      emblem,
      description,
      totalTimeConquered: 0,
      memberCount: 1,
      members: [{ username: user.username, walletAddress: user.walletAddress, timeContributed: 0 }],
    };
    setGuilds((prev) => [...prev, newGuild]);
    setUser((prev) => ({ ...prev, guildId: newGuild.id }));
  }, [user.username, user.walletAddress]);

  // Complete a plank session
  const completeSession = useCallback((validSeconds: number): SessionResult => {
    const auraPointsGained = calculateAuraPoints(validSeconds);
    const plankReward = calculatePlankReward(validSeconds);
    const lifeTimeGained = calculateLifeTimeGained(validSeconds);
    const today = new Date().toDateString();

    // Update user stats
    setUser((prev) => {
      const isNewDay = prev.lastSessionDate !== today;
      const newStreak = isNewDay ? prev.currentStreakDays + 1 : prev.currentStreakDays;
      
      return {
        ...prev,
        bestPlankTime: Math.max(prev.bestPlankTime, validSeconds),
        totalTimeConquered: prev.totalTimeConquered + validSeconds,
        auraPoints: prev.auraPoints + auraPointsGained,
        currentStreakDays: validSeconds >= 30 ? newStreak : prev.currentStreakDays,
        longestStreakDays: Math.max(prev.longestStreakDays, newStreak),
        lastSessionDate: today,
      };
    });

    // Update guild stats
    if (user.guildId) {
      setGuilds((prev) =>
        prev.map((g) =>
          g.id === user.guildId
            ? {
                ...g,
                totalTimeConquered: g.totalTimeConquered + validSeconds,
                members: g.members.map((m) =>
                  m.walletAddress === user.walletAddress
                    ? { ...m, timeContributed: m.timeContributed + validSeconds }
                    : m
                ),
              }
            : g
        )
      );
    }

    setPendingPlankReward(plankReward);

    return {
      validTimeSeconds: validSeconds,
      auraPointsGained,
      plankReward,
      lifeTimeGained,
    };
  }, [user.guildId, user.walletAddress]);

  // Claim $PLANK reward (mock transaction)
  const claimPlank = useCallback(async (): Promise<boolean> => {
    if (pendingPlankReward <= 0) return false;
    
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setUser((prev) => ({
      ...prev,
      plankBalance: prev.plankBalance + pendingPlankReward,
    }));
    setPendingPlankReward(0);
    
    return true;
  }, [pendingPlankReward]);

  // Mint NFT (mock)
  const mintNFT = useCallback(async (): Promise<boolean> => {
    if (user.hasNFT) return false;
    if (user.totalTimeConquered < 60) return false; // Need at least 1 minute
    
    // Simulate NFT minting
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setUser((prev) => ({ ...prev, hasNFT: true }));
    return true;
  }, [user.hasNFT, user.totalTimeConquered]);

  return (
    <GameContext.Provider
      value={{
        isConnected: authenticated,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isLoading,
        user,
        updateUsername,
        guilds,
        userGuild,
        joinGuild,
        leaveGuild,
        createGuild,
        completeSession,
        claimPlank,
        pendingPlankReward,
        mintNFT,
        hasSeenOnboarding,
        setHasSeenOnboarding,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};