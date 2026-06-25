const fallbackGradientClasses = [
  'fallback-gradient--ember',
  'fallback-gradient--arcade',
  'fallback-gradient--neon',
  'fallback-gradient--turbo',
  'fallback-gradient--mint',
  'fallback-gradient--violet',
  'fallback-gradient--pixel',
  'fallback-gradient--sun',
] as const;

const fallbackIcons = ['PLAY', 'GO', 'XP', 'VS', 'IO', '8', '+', '#'] as const;

const hashGameId = (gameId: string | number) => {
  const value = String(gameId || 'game');
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

export const getFallbackGradientClass = (gameId: string | number) => {
  const index = hashGameId(gameId) % fallbackGradientClasses.length;
  return fallbackGradientClasses[index];
};

export const getFallbackIcon = (gameId: string | number) => {
  const index = hashGameId(gameId) % fallbackIcons.length;
  return fallbackIcons[index];
};
