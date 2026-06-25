globalThis.process ??= {}; globalThis.process.env ??= {};
import { h as hasSupabaseEnv, a as supabase } from './supabase_C3sp2Zx_.mjs';

const fallbackGames = /* #__PURE__ */ JSON.parse("[{\"id\":\"1v1lol\",\"title\":\"1v1lol\",\"slug\":\"1v1lol\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/1v1lol.jpg\",\"iframeUrl\":\"https://zapgames.io/1v1lol.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play 1v1lol online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"99-nights-bloxd-io\",\"title\":\"99 nights bloxd io\",\"slug\":\"99-nights-bloxd-io\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/99-nights-bloxd-io.jpg\",\"iframeUrl\":\"https://zapgames.io/99-nights-bloxd-io.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play 99 nights bloxd io online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"agent-hunt-pro-shooter\",\"title\":\"Agent hunt pro shooter\",\"slug\":\"agent-hunt-pro-shooter\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/agent-hunt-pro-shooter.jpg\",\"iframeUrl\":\"https://zapgames.io/agent-hunt-pro-shooter.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Agent hunt pro shooter online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"blocky-rider\",\"title\":\"Blocky rider\",\"slug\":\"blocky-rider\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/blocky-rider.jpg\",\"iframeUrl\":\"https://zapgames.io/blocky-rider.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Blocky rider online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"brawl-stars\",\"title\":\"Brawl stars\",\"slug\":\"brawl-stars\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/brawl-stars.jpg\",\"iframeUrl\":\"https://zapgames.io/brawl-stars.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Brawl stars online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"brawl-stars-brave-adventure\",\"title\":\"Brawl stars brave adventure\",\"slug\":\"brawl-stars-brave-adventure\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/brawl-stars-brave-adventure.jpg\",\"iframeUrl\":\"https://zapgames.io/brawl-stars-brave-adventure.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Brawl stars brave adventure online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"buildnow-gg\",\"title\":\"Buildnow gg\",\"slug\":\"buildnow-gg\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/buildnow-gg.jpg\",\"iframeUrl\":\"https://zapgames.io/buildnow-gg.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Buildnow gg online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"call-of-duty\",\"title\":\"Call of duty\",\"slug\":\"call-of-duty\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/call-of-duty.jpg\",\"iframeUrl\":\"https://zapgames.io/call-of-duty.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Call of duty online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"castaway\",\"title\":\"Castaway\",\"slug\":\"castaway\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/castaway.jpg\",\"iframeUrl\":\"https://zapgames.io/castaway.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Castaway online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"city-brawl\",\"title\":\"City brawl\",\"slug\":\"city-brawl\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/city-brawl.jpg\",\"iframeUrl\":\"https://zapgames.io/city-brawl.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play City brawl online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"color-rush\",\"title\":\"Color rush\",\"slug\":\"color-rush\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/color-rush.jpg\",\"iframeUrl\":\"https://zapgames.io/color-rush.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Color rush online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"crazy-chase-car-chase-simulator\",\"title\":\"Crazy chase car chase simulator\",\"slug\":\"crazy-chase-car-chase-simulator\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/crazy-chase-car-chase-simulator.jpg\",\"iframeUrl\":\"https://zapgames.io/crazy-chase-car-chase-simulator.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Crazy chase car chase simulator online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"dan-the-man\",\"title\":\"Dan the man\",\"slug\":\"dan-the-man\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/dan-the-man.jpg\",\"iframeUrl\":\"https://zapgames.io/dan-the-man.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Dan the man online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"deadshot-io\",\"title\":\"Deadshot io\",\"slug\":\"deadshot-io\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/deadshot-io.jpg\",\"iframeUrl\":\"https://zapgames.io/deadshot-io.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Deadshot io online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"drakkar-strike\",\"title\":\"Drakkar strike\",\"slug\":\"drakkar-strike\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/drakkar-strike.jpg\",\"iframeUrl\":\"https://zapgames.io/drakkar-strike.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Drakkar strike online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"dude-theft-auto\",\"title\":\"Dude theft auto\",\"slug\":\"dude-theft-auto\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/dude-theft-auto.jpg\",\"iframeUrl\":\"https://zapgames.io/dude-theft-auto.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Dude theft auto online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"dungeon-raid\",\"title\":\"Dungeon raid\",\"slug\":\"dungeon-raid\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/dungeon-raid.jpg\",\"iframeUrl\":\"https://zapgames.io/dungeon-raid.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Dungeon raid online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"egg-adventure-mirror-world\",\"title\":\"Egg adventure mirror world\",\"slug\":\"egg-adventure-mirror-world\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/egg-adventure-mirror-world.jpg\",\"iframeUrl\":\"https://zapgames.io/egg-adventure-mirror-world.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Egg adventure mirror world online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"elytra-flight\",\"title\":\"Elytra flight\",\"slug\":\"elytra-flight\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/elytra-flight.jpg\",\"iframeUrl\":\"https://zapgames.io/elytra-flight.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Elytra flight online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"escape-raid\",\"title\":\"Escape raid\",\"slug\":\"escape-raid\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/escape-raid.jpg\",\"iframeUrl\":\"https://zapgames.io/escape-raid.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Escape raid online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"escape-road\",\"title\":\"Escape road\",\"slug\":\"escape-road\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/escape-road.jpg\",\"iframeUrl\":\"https://zapgames.io/escape-road.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Escape road online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"escape-road-2\",\"title\":\"Escape road 2\",\"slug\":\"escape-road-2\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/escape-road-2.jpg\",\"iframeUrl\":\"https://zapgames.io/escape-road-2.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Escape road 2 online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"escape-road-city\",\"title\":\"Escape road city\",\"slug\":\"escape-road-city\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/escape-road-city.jpg\",\"iframeUrl\":\"https://zapgames.io/escape-road-city.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Escape road city online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"escape-road-city-2\",\"title\":\"Escape road city 2\",\"slug\":\"escape-road-city-2\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/escape-road-city-2.jpg\",\"iframeUrl\":\"https://zapgames.io/escape-road-city-2.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Escape road city 2 online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"evowarsio\",\"title\":\"Evowarsio\",\"slug\":\"evowarsio\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/evowarsio.jpg\",\"iframeUrl\":\"https://zapgames.io/evowarsio.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Evowarsio online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"fgb-operators-survival\",\"title\":\"Fgb operators survival\",\"slug\":\"fgb-operators-survival\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/fgb-operators-survival.jpg\",\"iframeUrl\":\"https://zapgames.io/fgb-operators-survival.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Fgb operators survival online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"fortnite-battle-royale\",\"title\":\"Fortnite battle royale\",\"slug\":\"fortnite-battle-royale\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/fortnite-battle-royale.jpg\",\"iframeUrl\":\"https://zapgames.io/fortnite-battle-royale.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Fortnite battle royale online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"fortnite-game\",\"title\":\"Fortnite game\",\"slug\":\"fortnite-game\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/fortnite-game.jpg\",\"iframeUrl\":\"https://zapgames.io/fortnite-game.embed\",\"isNew\":false,\"isTrending\":true,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Fortnite game online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"fossil-quest\",\"title\":\"Fossil quest\",\"slug\":\"fossil-quest\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/fossil-quest.jpg\",\"iframeUrl\":\"https://zapgames.io/fossil-quest.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Fossil quest online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"funny-city-gopniks\",\"title\":\"Funny city gopniks\",\"slug\":\"funny-city-gopniks\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/funny-city-gopniks.jpg\",\"iframeUrl\":\"https://zapgames.io/funny-city-gopniks.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Funny city gopniks online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"gate-survivor\",\"title\":\"Gate survivor\",\"slug\":\"gate-survivor\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/gate-survivor.jpg\",\"iframeUrl\":\"https://zapgames.io/gate-survivor.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Gate survivor online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"geometry-subzero\",\"title\":\"Geometry subzero\",\"slug\":\"geometry-subzero\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/geometry-subzero.jpg\",\"iframeUrl\":\"https://zapgames.io/geometry-subzero.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Geometry subzero online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"getting-over-it\",\"title\":\"Getting over it\",\"slug\":\"getting-over-it\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/getting-over-it.jpg\",\"iframeUrl\":\"https://zapgames.io/getting-over-it.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Getting over it online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"gladihoppers\",\"title\":\"Gladihoppers\",\"slug\":\"gladihoppers\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/gladihoppers.jpg\",\"iframeUrl\":\"https://zapgames.io/gladihoppers.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Gladihoppers online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"grand-theft-auto\",\"title\":\"Grand theft auto\",\"slug\":\"grand-theft-auto\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/grand-theft-auto.jpg\",\"iframeUrl\":\"https://zapgames.io/grand-theft-auto.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Grand theft auto online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"gta-vice-city\",\"title\":\"Gta vice city\",\"slug\":\"gta-vice-city\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/gta-vice-city.jpg\",\"iframeUrl\":\"https://zapgames.io/gta-vice-city.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Gta vice city online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"gun-master-3d\",\"title\":\"Gun master 3d\",\"slug\":\"gun-master-3d\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/gun-master-3d.jpg\",\"iframeUrl\":\"https://zapgames.io/gun-master-3d.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Gun master 3d online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"happy-wheels\",\"title\":\"Happy wheels\",\"slug\":\"happy-wheels\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/happy-wheels.jpg\",\"iframeUrl\":\"https://zapgames.io/happy-wheels.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Happy wheels online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"hill-travel-3d\",\"title\":\"Hill travel 3d\",\"slug\":\"hill-travel-3d\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/hill-travel-3d.jpg\",\"iframeUrl\":\"https://zapgames.io/hill-travel-3d.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Hill travel 3d online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"hollow-knight\",\"title\":\"Hollow knight\",\"slug\":\"hollow-knight\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/hollow-knight.jpg\",\"iframeUrl\":\"https://zapgames.io/hollow-knight.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Hollow knight online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"hotgear\",\"title\":\"Hotgear\",\"slug\":\"hotgear\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/hotgear.jpg\",\"iframeUrl\":\"https://zapgames.io/hotgear.embed\",\"isNew\":true,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Hotgear online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"hunty-zombie\",\"title\":\"Hunty zombie\",\"slug\":\"hunty-zombie\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/hunty-zombie.jpg\",\"iframeUrl\":\"https://zapgames.io/hunty-zombie.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Hunty zombie online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"iron-legion\",\"title\":\"Iron legion\",\"slug\":\"iron-legion\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/iron-legion.jpg\",\"iframeUrl\":\"https://zapgames.io/iron-legion.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Iron legion online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"katana\",\"title\":\"Katana\",\"slug\":\"katana\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/katana.jpg\",\"iframeUrl\":\"https://zapgames.io/katana.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Katana online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"killover\",\"title\":\"Killover\",\"slug\":\"killover\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/killover.jpg\",\"iframeUrl\":\"https://zapgames.io/killover.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Killover online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"kong-adventure\",\"title\":\"Kong adventure\",\"slug\":\"kong-adventure\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/kong-adventure.jpg\",\"iframeUrl\":\"https://zapgames.io/kong-adventure.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Kong adventure online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"kour\",\"title\":\"Kour\",\"slug\":\"kour\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/kour.jpg\",\"iframeUrl\":\"https://zapgames.io/kour.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Kour online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"krunker\",\"title\":\"Krunker\",\"slug\":\"krunker\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/krunker.jpg\",\"iframeUrl\":\"https://zapgames.io/krunker.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Krunker online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"legend-of-fireball\",\"title\":\"Legend of fireball\",\"slug\":\"legend-of-fireball\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/legend-of-fireball.jpg\",\"iframeUrl\":\"https://zapgames.io/legend-of-fireball.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Legend of fireball online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"level-devil\",\"title\":\"Level devil\",\"slug\":\"level-devil\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/level-devil.jpg\",\"iframeUrl\":\"https://zapgames.io/level-devil.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Level devil online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"mad-pursuit\",\"title\":\"Mad pursuit\",\"slug\":\"mad-pursuit\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/mad-pursuit.jpg\",\"iframeUrl\":\"https://zapgames.io/mad-pursuit.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Mad pursuit online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"mad-racers\",\"title\":\"Mad racers\",\"slug\":\"mad-racers\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/mad-racers.jpg\",\"iframeUrl\":\"https://zapgames.io/mad-racers.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Mad racers online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"mad-trails\",\"title\":\"Mad trails\",\"slug\":\"mad-trails\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/mad-trails.jpg\",\"iframeUrl\":\"https://zapgames.io/mad-trails.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Mad trails online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"mine-shooter\",\"title\":\"Mine shooter\",\"slug\":\"mine-shooter\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/mine-shooter.jpg\",\"iframeUrl\":\"https://zapgames.io/mine-shooter.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Mine shooter online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"mine-shooter-3d\",\"title\":\"Mine shooter 3d\",\"slug\":\"mine-shooter-3d\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/mine-shooter-3d.jpg\",\"iframeUrl\":\"https://zapgames.io/mine-shooter-3d.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Mine shooter 3d online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"monkey-mart\",\"title\":\"Monkey mart\",\"slug\":\"monkey-mart\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/monkey-mart.jpg\",\"iframeUrl\":\"https://zapgames.io/monkey-mart.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Monkey mart online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"monster-dash\",\"title\":\"Monster dash\",\"slug\":\"monster-dash\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/monster-dash.jpg\",\"iframeUrl\":\"https://zapgames.io/monster-dash.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Monster dash online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"narrow-one\",\"title\":\"Narrow one\",\"slug\":\"narrow-one\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/narrow-one.jpg\",\"iframeUrl\":\"https://zapgames.io/narrow-one.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Narrow one online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"noobs-are-coming\",\"title\":\"Noobs are coming\",\"slug\":\"noobs-are-coming\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/noobs-are-coming.jpg\",\"iframeUrl\":\"https://zapgames.io/noobs-are-coming.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Noobs are coming online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"obby-paintball-online-with-friends\",\"title\":\"Obby paintball online with friends\",\"slug\":\"obby-paintball-online-with-friends\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/obby-paintball-online-with-friends.jpg\",\"iframeUrl\":\"https://zapgames.io/obby-paintball-online-with-friends.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Obby paintball online with friends online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"only-up\",\"title\":\"Only up\",\"slug\":\"only-up\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/only-up.jpg\",\"iframeUrl\":\"https://zapgames.io/only-up.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Only up online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"openfrontio\",\"title\":\"Openfrontio\",\"slug\":\"openfrontio\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/openfrontio.jpg\",\"iframeUrl\":\"https://zapgames.io/openfrontio.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Openfrontio online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"ovo\",\"title\":\"Ovo\",\"slug\":\"ovo\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/ovo.jpg\",\"iframeUrl\":\"https://zapgames.io/ovo.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Ovo online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"plane-wars\",\"title\":\"Plane wars\",\"slug\":\"plane-wars\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/plane-wars.jpg\",\"iframeUrl\":\"https://zapgames.io/plane-wars.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Plane wars online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"poxel-io\",\"title\":\"Poxel io\",\"slug\":\"poxel-io\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/poxel-io.jpg\",\"iframeUrl\":\"https://zapgames.io/poxel-io.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Poxel io online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"prison-escapeio\",\"title\":\"Prison escapeio\",\"slug\":\"prison-escapeio\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/prison-escapeio.jpg\",\"iframeUrl\":\"https://zapgames.io/prison-escapeio.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Prison escapeio online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"pubg-battlegrounds\",\"title\":\"Pubg battlegrounds\",\"slug\":\"pubg-battlegrounds\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/pubg-battlegrounds.jpg\",\"iframeUrl\":\"https://zapgames.io/pubg-battlegrounds.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Pubg battlegrounds online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"punchy-race\",\"title\":\"Punchy race\",\"slug\":\"punchy-race\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/punchy-race.jpg\",\"iframeUrl\":\"https://zapgames.io/punchy-race.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Punchy race online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"ragdoll-archers\",\"title\":\"Ragdoll archers\",\"slug\":\"ragdoll-archers\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/ragdoll-archers.jpg\",\"iframeUrl\":\"https://zapgames.io/ragdoll-archers.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Ragdoll archers online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"ragdoll-hit\",\"title\":\"Ragdoll hit\",\"slug\":\"ragdoll-hit\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/ragdoll-hit.jpg\",\"iframeUrl\":\"https://zapgames.io/ragdoll-hit.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Ragdoll hit online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"ragdoll-hit-stickman\",\"title\":\"Ragdoll hit stickman\",\"slug\":\"ragdoll-hit-stickman\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/ragdoll-hit-stickman.jpg\",\"iframeUrl\":\"https://zapgames.io/ragdoll-hit-stickman.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Ragdoll hit stickman online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"ramp-xtreme\",\"title\":\"Ramp xtreme\",\"slug\":\"ramp-xtreme\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/ramp-xtreme.jpg\",\"iframeUrl\":\"https://zapgames.io/ramp-xtreme.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Ramp xtreme online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"rodha\",\"title\":\"Rodha\",\"slug\":\"rodha\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/rodha.jpg\",\"iframeUrl\":\"https://zapgames.io/rodha.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Rodha online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"run-3\",\"title\":\"Run 3\",\"slug\":\"run-3\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/run-3.jpg\",\"iframeUrl\":\"https://zapgames.io/run-3.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Run 3 online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"rust\",\"title\":\"Rust\",\"slug\":\"rust\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/rust.jpg\",\"iframeUrl\":\"https://zapgames.io/rust.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Rust online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"scarlet-shift\",\"title\":\"Scarlet shift\",\"slug\":\"scarlet-shift\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/scarlet-shift.jpg\",\"iframeUrl\":\"https://zapgames.io/scarlet-shift.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Scarlet shift online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"schoolboy-escape-2\",\"title\":\"Schoolboy escape 2\",\"slug\":\"schoolboy-escape-2\",\"categorySlug\":\"kids\",\"thumbnail\":\"https://gampeo.com/images/schoolboy-escape-2.jpg\",\"iframeUrl\":\"https://zapgames.io/schoolboy-escape-2.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Schoolboy escape 2 online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"seasons-fleeting\",\"title\":\"Seasons fleeting\",\"slug\":\"seasons-fleeting\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/seasons-fleeting.jpg\",\"iframeUrl\":\"https://zapgames.io/seasons-fleeting.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Seasons fleeting online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"sheep-vs-wolf\",\"title\":\"Sheep vs wolf\",\"slug\":\"sheep-vs-wolf\",\"categorySlug\":\"2-player\",\"thumbnail\":\"https://gampeo.com/images/sheep-vs-wolf.jpg\",\"iframeUrl\":\"https://zapgames.io/sheep-vs-wolf.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Sheep vs wolf online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"shell-shockers\",\"title\":\"Shell shockers\",\"slug\":\"shell-shockers\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/shell-shockers.jpg\",\"iframeUrl\":\"https://zapgames.io/shell-shockers.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Shell shockers online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"short-life\",\"title\":\"Short life\",\"slug\":\"short-life\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/short-life.jpg\",\"iframeUrl\":\"https://zapgames.io/short-life.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Short life online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"smash-the-car-to-pieces\",\"title\":\"Smash the car to pieces\",\"slug\":\"smash-the-car-to-pieces\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/smash-the-car-to-pieces.jpg\",\"iframeUrl\":\"https://zapgames.io/smash-the-car-to-pieces.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Smash the car to pieces online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"steal-a-brainrot\",\"title\":\"Steal a brainrot\",\"slug\":\"steal-a-brainrot\",\"categorySlug\":\"puzzle\",\"thumbnail\":\"https://gampeo.com/images/steal-a-brainrot.jpg\",\"iframeUrl\":\"https://zapgames.io/steal-a-brainrot.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Steal a brainrot online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"steal-brainrot-duel\",\"title\":\"Steal brainrot duel\",\"slug\":\"steal-brainrot-duel\",\"categorySlug\":\"puzzle\",\"thumbnail\":\"https://gampeo.com/images/steal-brainrot-duel.jpg\",\"iframeUrl\":\"https://zapgames.io/steal-brainrot-duel.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Steal brainrot duel online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"steel-legion\",\"title\":\"Steel legion\",\"slug\":\"steel-legion\",\"categorySlug\":\"io\",\"thumbnail\":\"https://gampeo.com/images/steel-legion.jpg\",\"iframeUrl\":\"https://zapgames.io/steel-legion.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Steel legion online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"stick-it-to-the-stickman\",\"title\":\"Stick it to the stickman\",\"slug\":\"stick-it-to-the-stickman\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/stick-it-to-the-stickman.jpg\",\"iframeUrl\":\"https://zapgames.io/stick-it-to-the-stickman.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Stick it to the stickman online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"stickman-hook\",\"title\":\"Stickman hook\",\"slug\":\"stickman-hook\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/stickman-hook.jpg\",\"iframeUrl\":\"https://zapgames.io/stickman-hook.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Stickman hook online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"stickman-kombat-2d\",\"title\":\"Stickman kombat 2d\",\"slug\":\"stickman-kombat-2d\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/stickman-kombat-2d.jpg\",\"iframeUrl\":\"https://zapgames.io/stickman-kombat-2d.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Stickman kombat 2d online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"stickman-war\",\"title\":\"Stickman war\",\"slug\":\"stickman-war\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/stickman-war.jpg\",\"iframeUrl\":\"https://zapgames.io/stickman-war.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Stickman war online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"stickman-weapon-master\",\"title\":\"Stickman weapon master\",\"slug\":\"stickman-weapon-master\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/stickman-weapon-master.jpg\",\"iframeUrl\":\"https://zapgames.io/stickman-weapon-master.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Stickman weapon master online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"subway-surfers\",\"title\":\"Subway surfers\",\"slug\":\"subway-surfers\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/subway-surfers.jpg\",\"iframeUrl\":\"https://zapgames.io/subway-surfers.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Subway surfers online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"super-bear-adventure\",\"title\":\"Super bear adventure\",\"slug\":\"super-bear-adventure\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/super-bear-adventure.jpg\",\"iframeUrl\":\"https://zapgames.io/super-bear-adventure.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Super bear adventure online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"survival-island-evo\",\"title\":\"Survival island evo\",\"slug\":\"survival-island-evo\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/survival-island-evo.jpg\",\"iframeUrl\":\"https://zapgames.io/survival-island-evo.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Survival island evo online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"tank-stars\",\"title\":\"Tank stars\",\"slug\":\"tank-stars\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/tank-stars.jpg\",\"iframeUrl\":\"https://zapgames.io/tank-stars.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Tank stars online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"tap-road\",\"title\":\"Tap road\",\"slug\":\"tap-road\",\"categorySlug\":\"car\",\"thumbnail\":\"https://gampeo.com/images/tap-road.jpg\",\"iframeUrl\":\"https://zapgames.io/tap-road.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Tap road online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"they-are-coming\",\"title\":\"They are coming\",\"slug\":\"they-are-coming\",\"categorySlug\":\"casual\",\"thumbnail\":\"https://gampeo.com/images/they-are-coming.jpg\",\"iframeUrl\":\"https://zapgames.io/they-are-coming.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play They are coming online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"time-shooter\",\"title\":\"Time shooter\",\"slug\":\"time-shooter\",\"categorySlug\":\"shooting\",\"thumbnail\":\"https://gampeo.com/images/time-shooter.jpg\",\"iframeUrl\":\"https://zapgames.io/time-shooter.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Time shooter online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"time-survivor\",\"title\":\"Time survivor\",\"slug\":\"time-survivor\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/time-survivor.jpg\",\"iframeUrl\":\"https://zapgames.io/time-survivor.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Time survivor online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]},{\"id\":\"tube-fall\",\"title\":\"Tube fall\",\"slug\":\"tube-fall\",\"categorySlug\":\"adventure\",\"thumbnail\":\"https://gampeo.com/images/tube-fall.jpg\",\"iframeUrl\":\"https://zapgames.io/tube-fall.embed\",\"isNew\":false,\"isTrending\":false,\"isUpdated\":false,\"rating\":4.5,\"plays\":\"1000\",\"description\":\"Play Tube fall online for free. Enjoy this browser game directly on our website.\",\"instructions\":\"Click Play Now to start the game. Use keyboard, mouse, or touch controls depending on the game.\",\"tags\":[\"browser games\",\"online games\",\"free games\"]}]");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 40;
const HOME_LIMIT = 18;
const RANDOM_POOL_LIMIT = 200;
const getPagination = ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) => {
  const safePage = Math.max(1, Math.trunc(page));
  const safeLimit = Math.max(1, Math.trunc(limit));
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  return { from, to, limit: safeLimit };
};
const parseNumber = (value, fallback = 0) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }
  if (!value) {
    return fallback;
  }
  const normalized = value.trim().toUpperCase();
  const amount = Number.parseFloat(normalized);
  if (Number.isNaN(amount)) {
    return fallback;
  }
  if (normalized.endsWith("M")) {
    return amount * 1e6;
  }
  if (normalized.endsWith("K")) {
    return amount * 1e3;
  }
  return amount;
};
const mapSupabaseGame = (game) => ({
  id: game.id,
  title: game.title,
  slug: game.slug,
  categorySlug: game.category_slug ?? "",
  thumbnail: game.thumbnail,
  iframeUrl: game.iframe_url,
  shortDescription: game.short_description,
  description: game.description,
  instructions: game.instructions,
  rating: parseNumber(game.rating, 4.5),
  plays: parseNumber(game.plays),
  isNew: Boolean(game.is_new),
  isTrending: Boolean(game.is_trending),
  isHot: Boolean(game.is_hot),
  isPopular: Boolean(game.is_popular),
  isFeatured: Boolean(game.is_featured),
  isActive: game.is_active !== false,
  seoTitle: game.seo_title,
  seoDescription: game.seo_description,
  publishedAt: game.published_at,
  createdAt: game.created_at,
  updatedAt: game.updated_at
});
const mapFallbackGame = (game) => ({
  id: String(game.id ?? game.slug),
  title: game.title,
  slug: game.slug,
  categorySlug: game.categorySlug ?? "",
  thumbnail: game.thumbnail ?? null,
  iframeUrl: game.iframeUrl ?? "",
  shortDescription: game.description ?? null,
  description: game.description ?? null,
  instructions: game.instructions ?? null,
  rating: parseNumber(game.rating, 4.5),
  plays: parseNumber(game.plays),
  isNew: Boolean(game.isNew),
  isTrending: Boolean(game.isTrending),
  isHot: Boolean(game.isHot),
  isPopular: Boolean(game.isPopular),
  isFeatured: Boolean(game.isFeatured),
  isActive: game.isActive !== false,
  seoTitle: null,
  seoDescription: null,
  publishedAt: null,
  createdAt: null,
  updatedAt: null
});
const fallbackGameList = fallbackGames.map(mapFallbackGame).filter((game) => game.isActive);
const getCategorySlugAliases = (categorySlug) => {
  const normalizedSlug = categorySlug.replace(/\/$/, "");
  const compactSlug = normalizedSlug.replace(/-games$/, "");
  return Array.from(/* @__PURE__ */ new Set([normalizedSlug, compactSlug, `${compactSlug}-games`]));
};
const sortByPublished = (games) => [...games].reverse();
const sortByRating = (games) => [...games].sort((first, second) => second.rating - first.rating);
const sortByPlays = (games) => [...games].sort((first, second) => second.plays - first.plays);
const queryGames = () => {
  if (!supabase) {
    return null;
  }
  return supabase.from("games").select("*").eq("is_active", true);
};
const fallbackPage = (games, options) => {
  const { from, limit } = getPagination(options);
  return games.slice(from, from + limit);
};
const shuffleGames = (games) => {
  const shuffled = [...games];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};
async function getHomePageGames() {
  if (hasSupabaseEnv && supabase) {
    const [newGames, trendingGames, hotGames, popularGames, featuredGames] = await Promise.all([
      queryGames()?.eq("is_new", true).order("published_at", { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq("is_trending", true).order("plays", { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq("is_hot", true).order("rating", { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq("is_popular", true).order("plays", { ascending: false }).limit(HOME_LIMIT),
      queryGames()?.eq("is_featured", true).order("published_at", { ascending: false }).limit(HOME_LIMIT)
    ]);
    if (newGames && trendingGames && hotGames && popularGames && featuredGames && !newGames.error && !trendingGames.error && !hotGames.error && !popularGames.error && !featuredGames.error) {
      return {
        newGames: (newGames.data ?? []).map(mapSupabaseGame),
        trendingGames: (trendingGames.data ?? []).map(mapSupabaseGame),
        hotGames: (hotGames.data ?? []).map(mapSupabaseGame),
        popularGames: (popularGames.data ?? []).map(mapSupabaseGame),
        featuredGames: (featuredGames.data ?? []).map(mapSupabaseGame)
      };
    }
  }
  return {
    newGames: sortByPublished(fallbackGameList.filter((game) => game.isNew)).slice(0, HOME_LIMIT),
    trendingGames: sortByPlays(fallbackGameList.filter((game) => game.isTrending)).slice(0, HOME_LIMIT),
    hotGames: sortByRating(fallbackGameList.filter((game) => game.isHot || game.rating >= 4.5)).slice(
      0,
      HOME_LIMIT
    ),
    popularGames: sortByPlays(
      fallbackGameList.filter((game) => game.isPopular || game.plays > 0)
    ).slice(0, HOME_LIMIT),
    featuredGames: sortByPublished(fallbackGameList.filter((game) => game.isFeatured)).slice(
      0,
      HOME_LIMIT
    )
  };
}
async function getAllGames(options = {}) {
  const { from, to } = getPagination(options);
  if (hasSupabaseEnv) {
    const { data, error } = await queryGames()?.order("published_at", { ascending: false }).range(from, to) ?? {};
    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }
  return fallbackPage(sortByPublished(fallbackGameList), options);
}
async function getGameBySlug(slug) {
  if (hasSupabaseEnv) {
    const { data, error } = await queryGames()?.eq("slug", slug).maybeSingle() ?? {};
    if (!error && data) {
      return mapSupabaseGame(data);
    }
  }
  return fallbackGameList.find((game) => game.slug === slug) ?? null;
}
async function getGamesByCategory(categorySlug, options = {}) {
  const { from, to } = getPagination(options);
  const categorySlugAliases = getCategorySlugAliases(categorySlug);
  if (hasSupabaseEnv) {
    const { data, error } = await queryGames()?.in("category_slug", categorySlugAliases).order("published_at", { ascending: false }).range(from, to) ?? {};
    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }
  return fallbackPage(
    sortByPublished(
      fallbackGameList.filter((game) => categorySlugAliases.includes(game.categorySlug))
    ),
    options
  );
}
async function getGamesByFlag(flag, options = {}) {
  const { from, to } = getPagination(options);
  const supabaseFlagMap = {
    isNew: "is_new",
    isTrending: "is_trending",
    isHot: "is_hot",
    isPopular: "is_popular",
    isFeatured: "is_featured"
  };
  if (hasSupabaseEnv && supabase) {
    const gamesQuery = queryGames();
    if (!gamesQuery) {
      return [];
    }
    const orderColumn = flag === "isPopular" ? "plays" : flag === "isHot" ? "rating" : "published_at";
    const { data, error } = await gamesQuery.eq(supabaseFlagMap[flag], true).order(orderColumn, { ascending: false }).range(from, to);
    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }
  const filteredGames = fallbackGameList.filter((game) => {
    if (flag === "isHot") {
      return game.isHot || game.rating >= 4.5;
    }
    if (flag === "isPopular") {
      return game.isPopular || game.plays > 0;
    }
    return game[flag];
  });
  const sortedGames = flag === "isPopular" ? sortByPlays(filteredGames) : flag === "isHot" ? sortByRating(filteredGames) : sortByPublished(filteredGames);
  return fallbackPage(sortedGames, options);
}
async function getRandomGames(limit = 12) {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const poolLimit = Math.min(RANDOM_POOL_LIMIT, Math.max(safeLimit * 12, safeLimit));
  if (hasSupabaseEnv && supabase) {
    const gamesQuery = queryGames();
    if (!gamesQuery) {
      return [];
    }
    const { data, error } = await gamesQuery.order("published_at", { ascending: false }).limit(poolLimit);
    if (!error && data) {
      return shuffleGames(data.map(mapSupabaseGame)).slice(0, safeLimit);
    }
  }
  return shuffleGames(fallbackGameList).slice(0, safeLimit);
}
async function getTrendingNowGames(limit = 4) {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const selectedGames = /* @__PURE__ */ new Map();
  const addUniqueGames = (games) => {
    for (const game of games) {
      if (selectedGames.size >= safeLimit) {
        break;
      }
      if (!selectedGames.has(game.slug)) {
        selectedGames.set(game.slug, game);
      }
    }
  };
  if (hasSupabaseEnv && supabase) {
    const fetchFlaggedGames = async (flag, orderColumn) => {
      if (selectedGames.size >= safeLimit) {
        return;
      }
      const gamesQuery = queryGames();
      if (!gamesQuery) {
        return;
      }
      const { data, error } = await gamesQuery.eq(flag, true).order(orderColumn, { ascending: false }).limit(safeLimit);
      if (!error && data) {
        addUniqueGames(data.map(mapSupabaseGame));
      }
    };
    await fetchFlaggedGames("is_trending", "plays");
    await fetchFlaggedGames("is_popular", "plays");
    await fetchFlaggedGames("is_hot", "rating");
    if (selectedGames.size < safeLimit) {
      const gamesQuery = queryGames();
      if (gamesQuery) {
        const { data, error } = await gamesQuery.order("plays", { ascending: false }).limit(safeLimit * 4);
        if (!error && data) {
          addUniqueGames(data.map(mapSupabaseGame));
        }
      }
    }
    return Array.from(selectedGames.values()).slice(0, safeLimit);
  }
  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isTrending)));
  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isPopular || game.plays > 0)));
  addUniqueGames(sortByRating(fallbackGameList.filter((game) => game.isHot || game.rating >= 4.5)));
  addUniqueGames(sortByPublished(fallbackGameList));
  return Array.from(selectedGames.values()).slice(0, safeLimit);
}
async function getTopGames(limit = 12) {
  const safeLimit = Math.max(1, Math.trunc(limit));
  const selectedGames = /* @__PURE__ */ new Map();
  const addUniqueGames = (games) => {
    for (const game of games) {
      if (selectedGames.size >= safeLimit) {
        break;
      }
      if (!selectedGames.has(game.slug)) {
        selectedGames.set(game.slug, game);
      }
    }
  };
  if (hasSupabaseEnv && supabase) {
    const fetchFlaggedGames = async (flag, orderColumn) => {
      if (selectedGames.size >= safeLimit) {
        return;
      }
      const gamesQuery = queryGames();
      if (!gamesQuery) {
        return;
      }
      const { data, error } = await gamesQuery.eq(flag, true).order(orderColumn, { ascending: false }).limit(safeLimit);
      if (!error && data) {
        addUniqueGames(data.map(mapSupabaseGame));
      }
    };
    await fetchFlaggedGames("is_popular", "plays");
    await fetchFlaggedGames("is_hot", "rating");
    await fetchFlaggedGames("is_trending", "plays");
    if (selectedGames.size < safeLimit) {
      const gamesQuery = queryGames();
      if (gamesQuery) {
        const { data, error } = await gamesQuery.order("plays", { ascending: false }).limit(safeLimit * 3);
        if (!error && data) {
          addUniqueGames(data.map(mapSupabaseGame));
        }
      }
    }
    return Array.from(selectedGames.values()).slice(0, safeLimit);
  }
  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isPopular || game.plays > 0)));
  addUniqueGames(sortByRating(fallbackGameList.filter((game) => game.isHot || game.rating >= 4.5)));
  addUniqueGames(sortByPlays(fallbackGameList.filter((game) => game.isTrending)));
  addUniqueGames(sortByPlays(fallbackGameList));
  return Array.from(selectedGames.values()).slice(0, safeLimit);
}
async function getRelatedGames(game, limit = 12) {
  const safeLimit = Math.min(12, Math.max(1, Math.trunc(limit)));
  if (hasSupabaseEnv) {
    const { data, error } = await queryGames()?.eq("category_slug", game.categorySlug).neq("slug", game.slug).order("plays", { ascending: false }).limit(safeLimit) ?? {};
    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }
  return sortByPlays(
    fallbackGameList.filter(
      (relatedGame) => relatedGame.categorySlug === game.categorySlug && relatedGame.slug !== game.slug
    )
  ).slice(0, safeLimit);
}
async function searchGames(query, options = {}) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return [];
  }
  const { from, to } = getPagination(options);
  if (hasSupabaseEnv) {
    const { data, error } = await queryGames()?.ilike("title", `%${normalizedQuery}%`).order("plays", { ascending: false }).range(from, to) ?? {};
    if (!error && data) {
      return data.map(mapSupabaseGame);
    }
  }
  return fallbackPage(
    fallbackGameList.filter(
      (game) => game.title.toLowerCase().includes(normalizedQuery.toLowerCase())
    ),
    options
  );
}
async function getGamesBySlugs(slugs, limit = 40) {
  const safeSlugs = Array.from(
    new Set(slugs.map((slug) => slug.trim()).filter((slug) => slug.length > 0))
  ).slice(0, Math.max(1, Math.trunc(limit)));
  if (safeSlugs.length === 0) {
    return [];
  }
  if (hasSupabaseEnv && supabase) {
    const gamesQuery = queryGames();
    if (!gamesQuery) {
      return [];
    }
    const { data, error } = await gamesQuery.in("slug", safeSlugs).limit(safeSlugs.length);
    if (!error && data) {
      const gamesBySlug2 = new Map(data.map((game) => [game.slug, mapSupabaseGame(game)]));
      return safeSlugs.flatMap((slug) => {
        const game = gamesBySlug2.get(slug);
        return game ? [game] : [];
      });
    }
  }
  const gamesBySlug = new Map(fallbackGameList.map((game) => [game.slug, game]));
  return safeSlugs.flatMap((slug) => {
    const game = gamesBySlug.get(slug);
    return game ? [game] : [];
  });
}

export { getGamesBySlugs as a, getGamesByCategory as b, getGameBySlug as c, getHomePageGames as d, getRelatedGames as e, getRandomGames as f, getTopGames as g, getGamesByFlag as h, getAllGames as i, getTrendingNowGames as j, searchGames as s };
