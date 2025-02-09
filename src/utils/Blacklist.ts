const blacklistedTokens = new Set();

export const addToBlacklist = (token: string) => {
    blacklistedTokens.add(token);
};

export const isBlacklisted = (token: string) => {
    return blacklistedTokens.has(token);
};
