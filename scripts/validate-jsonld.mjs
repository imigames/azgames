import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const rootDir = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const tempDir = await mkdtemp(path.join(tmpdir(), 'fgz-jsonld-'));

const transpile = (source, fileName) =>
  ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
    },
  }).outputText;

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) {
    fail(message);
  }
};

const flattenSchemas = (schemas) => (Array.isArray(schemas) ? schemas : [schemas]).filter(Boolean);

const assertJsonRoundTrip = (label, schemas) => {
  for (const [index, schema] of flattenSchemas(schemas).entries()) {
    const json = JSON.stringify(schema);
    const parsed = JSON.parse(json);
    assert(parsed && typeof parsed === 'object', `${label}[${index}] did not parse to an object.`);
    assert(
      parsed['@context'] || parsed['@graph'],
      `${label}[${index}] is missing @context or @graph.`,
    );
    assert(parsed['@type'] || parsed['@graph'], `${label}[${index}] is missing @type.`);
  }
};

const findSchema = (schemas, type) =>
  flattenSchemas(schemas).find((schema) => schema?.['@type'] === type);

try {
  const configSource = await readFile(path.join(rootDir, 'src/config/site.ts'), 'utf8');
  const configOut = path.join(tempDir, 'site.mjs');
  await writeFile(configOut, transpile(configSource, 'site.ts'));

  const schemaSource = await readFile(path.join(rootDir, 'src/lib/schema.ts'), 'utf8');
  const schemaOut = path.join(tempDir, 'schema.mjs');
  const patchedSchemaSource = schemaSource.replace(
    /from\s+['"]\.\.\/config\/site['"]/g,
    `from '${pathToFileURL(configOut).href}'`,
  );
  await writeFile(schemaOut, transpile(patchedSchemaSource, 'schema.ts'));

  const {
    getHomePageSchemas,
    getCategoryPageSchemas,
    getGamePageSchemas,
  } = await import(pathToFileURL(schemaOut).href);

  const settings = {
    siteName: 'Free Game Zone',
    siteUrl: 'https://freegamezone.io',
    defaultMetaTitle: 'Free Game Zone - Play Free Online Games',
    defaultMetaDescription:
      'Play free online browser games instantly on Free Game Zone. Discover action, car, shooting, puzzle, io, casual, and adventure games.',
    defaultOgImage: '/og-image.jpg',
    contactEmail: '',
    footerCopyright: 'Copyright 2026 Free Game Zone. All rights reserved.',
  };

  const category = {
    id: 'category-1',
    name: 'Io Games',
    slug: 'io-games',
    description: 'Play competitive io games online in your browser.',
    icon: '.IO',
    image: '/images/categories/io-games.jpg',
    seoTitle: 'Io Games - Play Free Online Games',
    seoDescription: 'Play free io games online with fast browser gameplay.',
    sortOrder: 1,
    isActive: true,
  };

  const game = {
    id: 'game-1',
    title: 'Poxel io',
    slug: 'poxel-io',
    categorySlug: 'io-games',
    thumbnail: 'https://freegamezone.io/images/games/poxel-io.jpg',
    iframeUrl: 'https://example.com/poxel-io',
    shortDescription: 'Play Poxel io online for free.',
    description: 'Play Poxel io online for free in your web browser.',
    instructions: 'Use keyboard and mouse to play.',
    rating: 4.5,
    plays: 1000,
    isNew: false,
    isTrending: true,
    isHot: true,
    isPopular: true,
    isFeatured: false,
    isActive: true,
    seoTitle: 'Poxel io - Play Online',
    seoDescription: 'Play Poxel io online for free in your browser.',
    publishedAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    tags: ['io', 'browser game', 'shooting'],
  };

  const games = [
    game,
    {
      ...game,
      id: 'game-2',
      title: 'Sky Dart',
      slug: 'sky-dart',
      thumbnail: '/images/games/sky-dart.jpg',
    },
  ];

  const homeSchemas = getHomePageSchemas({ settings, topGames: games });
  const categorySchemas = getCategoryPageSchemas({
    settings,
    category,
    games,
    pageUrl: `/category/${category.slug}`,
  });
  const gameSchemas = getGamePageSchemas({ settings, game, category, relatedGames: games });

  assertJsonRoundTrip('homepage schemas', homeSchemas);
  assertJsonRoundTrip('category schemas', categorySchemas);
  assertJsonRoundTrip('game schemas', gameSchemas);

  const website = findSchema(homeSchemas, 'WebSite');
  assert(website?.potentialAction, 'WebSite schema is missing potentialAction.');

  const homeItemList = findSchema(homeSchemas, 'ItemList');
  assert(homeItemList?.itemListElement?.length, 'Homepage ItemList is missing itemListElement.');

  const breadcrumb = findSchema(gameSchemas, 'BreadcrumbList');
  assert(breadcrumb?.itemListElement?.length, 'BreadcrumbList is missing itemListElement.');

  const videoGame = findSchema(gameSchemas, 'VideoGame');
  assert(videoGame?.name, 'VideoGame schema is missing name.');
  assert(videoGame?.url, 'VideoGame schema is missing url.');

  const collectionPage = findSchema(categorySchemas, 'CollectionPage');
  assert(collectionPage?.name, 'CollectionPage schema is missing name.');
  assert(collectionPage?.url, 'CollectionPage schema is missing url.');

  console.log('JSON-LD schemas validated successfully.');
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
