globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createAstro, f as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './astro/server_jqlxmikg.mjs';

const fallbackGradientClasses = [
  "fallback-gradient--ember",
  "fallback-gradient--arcade",
  "fallback-gradient--neon",
  "fallback-gradient--turbo",
  "fallback-gradient--mint",
  "fallback-gradient--violet",
  "fallback-gradient--pixel",
  "fallback-gradient--sun"
];
const fallbackIcons = ["PLAY", "GO", "XP", "VS", "IO", "8", "+", "#"];
const hashGameId = (gameId) => {
  const value = String(gameId || "game");
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = hash * 31 + value.charCodeAt(index) >>> 0;
  }
  return hash;
};
const getFallbackGradientClass = (gameId) => {
  const index = hashGameId(gameId) % fallbackGradientClasses.length;
  return fallbackGradientClasses[index];
};
const getFallbackIcon = (gameId) => {
  const index = hashGameId(gameId) % fallbackIcons.length;
  return fallbackIcons[index];
};

const $$Astro = createAstro("https://freegamezone.io");
const $$GameCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GameCard;
  const { game, size = "medium" } = Astro2.props;
  const fallbackGradientClass = getFallbackGradientClass(game.id);
  const fallbackIcon = getFallbackIcon(game.id);
  const badge = game.isNew ? { label: "New", tone: "new" } : game.isTrending ? { label: "Trending", tone: "trending" } : game.isFeatured ? { label: "Updated", tone: "updated" } : null;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(["game-card", `game-card--${size}`], "class:list")}> <a class="game-card-link"${addAttribute(`/game/${game.slug}/`, "href")}${addAttribute(`Play ${game.title}`, "aria-label")}> <div class="game-card-media"> <div${addAttribute(["game-card-placeholder", fallbackGradientClass], "class:list")} aria-hidden="true"> <span class="game-card-fallback-icon">${fallbackIcon}</span> <span class="game-card-fallback-title">${game.title}</span> </div> ${game.thumbnail && renderTemplate`<img${addAttribute(game.thumbnail, "src")}${addAttribute(`${game.title} game thumbnail`, "alt")} loading="lazy" decoding="async" onerror="this.hidden = true">`} ${badge && renderTemplate`<span${addAttribute(["game-card-badge", `game-card-badge--${badge.tone}`], "class:list")}>${badge.label}</span>`} <span class="game-card-title">${game.title}</span> </div> </a> </article>`;
}, "C:/Users/ULTRAPC/OneDrive/Desktop/codex-project/azgames-theme/poki-theme/src/components/GameCard.astro", void 0);

export { $$GameCard as $ };
