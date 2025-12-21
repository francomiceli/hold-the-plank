const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = {
  async verifyAuth(accessToken: string) {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Auth verification failed");
    }

    return response.json();
  },
};