import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
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
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [guilds, setGuilds] = useState<Guild[]>(mockGuilds);
  const [pendingPlankReward, setPendingPlankReward] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Mock wallet connection
  const connectWallet = useCallback(async () => {
    // Simulate wallet connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockAddress = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
    const fullAddress = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    
    setWalletAddress(fullAddress);
    setIsConnected(true);
    setUser({
      ...defaultUser,
      walletAddress: fullAddress,
      username: "Warrior_" + Math.floor(Math.random() * 9999),
      plankBalance: Math.floor(Math.random() * 100), // Start with some mock balance
    });
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setWalletAddress("");
    setUser(defaultUser);
    setPendingPlankReward(0);
  }, []);

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
        isConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
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
