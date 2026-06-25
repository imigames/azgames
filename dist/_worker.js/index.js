globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DTpqPfDW.mjs';
import { manifest } from './manifest_DpyjStZS.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about-us.astro.mjs');
const _page3 = () => import('./pages/admin/ai-models/bulk.astro.mjs');
const _page4 = () => import('./pages/admin/ai-models/logs.astro.mjs');
const _page5 = () => import('./pages/admin/ai-models/test.astro.mjs');
const _page6 = () => import('./pages/admin/ai-models.astro.mjs');
const _page7 = () => import('./pages/admin/categories/new.astro.mjs');
const _page8 = () => import('./pages/admin/categories/_id_/edit.astro.mjs');
const _page9 = () => import('./pages/admin/categories.astro.mjs');
const _page10 = () => import('./pages/admin/comments.astro.mjs');
const _page11 = () => import('./pages/admin/contact-messages.astro.mjs');
const _page12 = () => import('./pages/admin/contact-us/_id_.astro.mjs');
const _page13 = () => import('./pages/admin/contact-us.astro.mjs');
const _page14 = () => import('./pages/admin/cron-publish.astro.mjs');
const _page15 = () => import('./pages/admin/games/new.astro.mjs');
const _page16 = () => import('./pages/admin/games/_id_/edit.astro.mjs');
const _page17 = () => import('./pages/admin/games.astro.mjs');
const _page18 = () => import('./pages/admin/import.astro.mjs');
const _page19 = () => import('./pages/admin/login.astro.mjs');
const _page20 = () => import('./pages/admin/prompt-templates/new.astro.mjs');
const _page21 = () => import('./pages/admin/prompt-templates/_id_/edit.astro.mjs');
const _page22 = () => import('./pages/admin/prompt-templates.astro.mjs');
const _page23 = () => import('./pages/admin/reports.astro.mjs');
const _page24 = () => import('./pages/admin/settings.astro.mjs');
const _page25 = () => import('./pages/admin/site-customization.astro.mjs');
const _page26 = () => import('./pages/admin.astro.mjs');
const _page27 = () => import('./pages/api/admin/cron-publish-run.astro.mjs');
const _page28 = () => import('./pages/api/admin/generate-game-content.astro.mjs');
const _page29 = () => import('./pages/api/comment-game.astro.mjs');
const _page30 = () => import('./pages/api/contact-message.astro.mjs');
const _page31 = () => import('./pages/api/cron/publish.astro.mjs');
const _page32 = () => import('./pages/api/game-event.astro.mjs');
const _page33 = () => import('./pages/api/report-game.astro.mjs');
const _page34 = () => import('./pages/api/search.json.astro.mjs');
const _page35 = () => import('./pages/category/_slug_.astro.mjs');
const _page36 = () => import('./pages/contact-us.astro.mjs');
const _page37 = () => import('./pages/copyright-infringement-notice-procedure.astro.mjs');
const _page38 = () => import('./pages/favorites.astro.mjs');
const _page39 = () => import('./pages/game/_slug_.astro.mjs');
const _page40 = () => import('./pages/hot-games.astro.mjs');
const _page41 = () => import('./pages/io-games.astro.mjs');
const _page42 = () => import('./pages/new-games.astro.mjs');
const _page43 = () => import('./pages/popular-games.astro.mjs');
const _page44 = () => import('./pages/privacy-policy.astro.mjs');
const _page45 = () => import('./pages/robots.txt.astro.mjs');
const _page46 = () => import('./pages/search.astro.mjs');
const _page47 = () => import('./pages/sitemap.xml.astro.mjs');
const _page48 = () => import('./pages/term-of-use.astro.mjs');
const _page49 = () => import('./pages/trending-games.astro.mjs');
const _page50 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["../node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about-us.astro", _page2],
    ["src/pages/admin/ai-models/bulk.astro", _page3],
    ["src/pages/admin/ai-models/logs.astro", _page4],
    ["src/pages/admin/ai-models/test.astro", _page5],
    ["src/pages/admin/ai-models.astro", _page6],
    ["src/pages/admin/categories/new.astro", _page7],
    ["src/pages/admin/categories/[id]/edit.astro", _page8],
    ["src/pages/admin/categories.astro", _page9],
    ["src/pages/admin/comments.astro", _page10],
    ["src/pages/admin/contact-messages.astro", _page11],
    ["src/pages/admin/contact-us/[id].astro", _page12],
    ["src/pages/admin/contact-us.astro", _page13],
    ["src/pages/admin/cron-publish.astro", _page14],
    ["src/pages/admin/games/new.astro", _page15],
    ["src/pages/admin/games/[id]/edit.astro", _page16],
    ["src/pages/admin/games.astro", _page17],
    ["src/pages/admin/import.astro", _page18],
    ["src/pages/admin/login.astro", _page19],
    ["src/pages/admin/prompt-templates/new.astro", _page20],
    ["src/pages/admin/prompt-templates/[id]/edit.astro", _page21],
    ["src/pages/admin/prompt-templates.astro", _page22],
    ["src/pages/admin/reports.astro", _page23],
    ["src/pages/admin/settings.astro", _page24],
    ["src/pages/admin/site-customization.astro", _page25],
    ["src/pages/admin/index.astro", _page26],
    ["src/pages/api/admin/cron-publish-run.ts", _page27],
    ["src/pages/api/admin/generate-game-content.ts", _page28],
    ["src/pages/api/comment-game.ts", _page29],
    ["src/pages/api/contact-message.ts", _page30],
    ["src/pages/api/cron/publish.ts", _page31],
    ["src/pages/api/game-event.ts", _page32],
    ["src/pages/api/report-game.ts", _page33],
    ["src/pages/api/search.json.ts", _page34],
    ["src/pages/category/[slug].astro", _page35],
    ["src/pages/contact-us.astro", _page36],
    ["src/pages/copyright-infringement-notice-procedure.astro", _page37],
    ["src/pages/favorites.astro", _page38],
    ["src/pages/game/[slug].astro", _page39],
    ["src/pages/hot-games.astro", _page40],
    ["src/pages/io-games.astro", _page41],
    ["src/pages/new-games.astro", _page42],
    ["src/pages/popular-games.astro", _page43],
    ["src/pages/privacy-policy.astro", _page44],
    ["src/pages/robots.txt.ts", _page45],
    ["src/pages/search.astro", _page46],
    ["src/pages/sitemap.xml.ts", _page47],
    ["src/pages/term-of-use.astro", _page48],
    ["src/pages/trending-games.astro", _page49],
    ["src/pages/index.astro", _page50]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
