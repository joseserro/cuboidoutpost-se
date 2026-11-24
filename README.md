# Cuboid Outpost: Splendor Edition

A Minecraft **1.16.5 / Forge 36.2.26** modpack, forked from [Cuboid Outpost (Luxury Edition)](https://github.com/CuboidDroid/cuboidoutpost-le) by [CuboidDroid](https://github.com/CuboidDroid).

You're stranded on a barren planet and have to rebuild civilisation from a tiny outpost, guided by a quest line of more than 1,500 quests. Splendor Edition keeps the original quests, storyline and mod list. It reworks the progression balance so the quest line can't be skipped, and it fixes long-standing pack bugs.

## What's different from Luxury Edition

- **Sieving follows the quest line.** The Emerald Mesh now needs osmium from the intended Smeltery quest, so you can no longer go straight from your first iron to Mekanism. Upper-mesh drop rates are lower, while the early game plays the same. Details: [docs/balance/sieve-progression.md](docs/balance/sieve-progression.md).
- **Spice of Life:** 1 extra heart per milestone, up to 20 extra hearts, with more new foods needed for each heart as you go (4, then 6, 8 and 12 foods per heart).
- **Essential** is included, together with **Essentialized** (ported to 1.16.5 for this pack), which removes Essential's shop, purchases, cosmetics and emotes. Both are client-side only.
- **Fixes:**
  - Platinum and Storage Drawers tags now apply.
  - The missing quantum singularity configs are added.
  - A fresh install no longer fails on two mods that were deleted from CurseForge (TwerkItMeal removed, Configured updated).
  - Importing into the CurseForge app no longer reports "blocked mods". The MIT-licensed Spawner Bug Fix and More Overlays Updated are bundled in the pack, and Corail Tombstone, which can't be bundled, is replaced by **Corpse**: your items wait in a corpse where you died.

Release notes for every version are in [changelogs/](changelogs/).

## Installing

1. Get the pack zip, `CuboidOutpostSE-<version>.zip`, from this repository's [Releases](https://github.com/joseserro/cuboidoutpost-se/releases), or build it yourself (see below).
2. In the CurseForge app, choose **Create Custom Profile → Import** and select the zip. CurseForge downloads all the mods.
3. Give the game at least 6 GB of RAM.

**Servers:** use `CuboidOutpostSE-<version>-server.zip` and follow the setup guide in [`src/server files/README.md`](src/server%20files/README.md). `level-type` must be set to `skyblockbuilder:custom_skyblock`.

**Upgrading a world from Luxury Edition or 2.0.0:** first empty every Tombstone grave. Tombstone is replaced by Corpse in 2.0.1, so its graves and the items in them disappear when you update.

**Upgrading an existing world:** the new Spice of Life settings only apply to newly created worlds. For an existing world, copy `defaultconfigs/solcarrot-server.toml` over `<world>/serverconfig/solcarrot-server.toml` while the game or server is stopped.

## Reporting issues

Please report problems with Splendor Edition in this repository's [Issues](https://github.com/joseserro/cuboidoutpost-se/issues), not to the original Luxury Edition project, because its author isn't responsible for the changes made here.

## Building the pack

You need **Node.js 22.2+** (no npm packages are required) and a **JDK 9+** (`javac` on `PATH` or `JAVA_HOME`). The JDK compiles the pack's own mods in `mods-src/` for Java 8.

```sh
npm run fetch    # download all mods from CurseForge into .cache/ (no API key needed)
npm run build    # validate, then write dist/CuboidOutpostSE-<version>.zip and -server.zip
```

| Command | What it does |
|---|---|
| `npm run fetch` | Downloads every mod in `src/manifest.json` from CurseForge into `.cache/mods/`. |
| `npm run check` | Validates JSON, KubeJS script syntax and quest translation keys. |
| `npm run build` | Validates the pack, regenerates `src/modlist.html`, builds the mods in `mods-src/`, and writes the client zip (CurseForge import) and the server zip (with server-side mods). |
| `npm run add-mod -- <projectID> [--file <fileID>] [--client-only]` | Adds or updates a CurseForge mod in the manifest. Without `--file` it picks the newest Forge 1.16.5 file. `--client-only` keeps the mod out of the server pack (recorded in `tools/pack.json`). |
| `npm run test-server -- [--accept-eula] [--fresh] [--load-client-mods] [--cmd "<command>"]` | Boots the pack on a local headless Forge server in `run/server` (Java 8 and Forge are downloaded automatically) and reports KubeJS errors and crashes. You must accept the [Minecraft EULA](https://aka.ms/MinecraftEULA) once. |

### Repository layout

| Path | Contents |
|---|---|
| `src/manifest.json` | CurseForge mod list (project and file IDs) |
| `src/overrides/` | Configs, KubeJS scripts, quests (`config/ftbquests`) and quest text (`kubejs/assets/cuboidquests/lang`) |
| `src/server files/` | Server start scripts and setup guide |
| `mods-src/` | Mods that aren't on CurseForge, built from source and shipped in `overrides/mods`. Currently only [`essentialized`](mods-src/essentialized/README.md). |
| `tools/` | The build, fetch, add-mod and test-server scripts |
| `tools/pack.json` | Pack settings outside the CurseForge manifest. `clientOnly` mods are left out of the server pack. `bundled` mods are ones CurseForge won't distribute ("blocked mods") but whose licence allows bundling; the build ships them in `overrides/mods`, together with their licence from `third-party-licenses/`. Check a mod's licence before adding it here. |
| `third-party-licenses/` | Licence texts for the bundled third-party mods |
| `docs/` | Balance notes |
| `changelogs/` | Release notes |

### Testing tips

- Scripts in `tools/test-scripts/` are added to the test server only and never ship. `zz_test_recipe_probe.js` logs the live recipes that match its pattern to `run/server/logs/kubejs/server.txt`.
- `/kubejs export` lists recipes as they were *before* KubeJS scripts changed them. Use the recipe probe to see the final result.

## Credits and license

- **Cuboid Outpost and Cuboid Outpost (Luxury Edition)**, including the quests, storyline and pack design, are by **CuboidDroid** and licensed under the [GNU GPL v3](LICENSE). This fork is GPL v3 too. You can support the original author on [Patreon](https://www.patreon.com/cuboiddroid).
- **Essentialized** is by the Essentialized contributors ([MIT](mods-src/essentialized/LICENSE)). The 1.16.5 port is in `mods-src/essentialized`.
- Every included mod belongs to its own author; see [src/modlist.html](src/modlist.html).

---

## Original Luxury Edition README (by CuboidDroid)

> This is the original project's README, kept for reference. The Discord, Patreon and PayPal links below belong to CuboidDroid and the original Cuboid Outpost project. Report Splendor Edition issues [here](https://github.com/joseserro/cuboidoutpost-se/issues) instead.

[Cuboid Outpost](https://www.curseforge.com/minecraft/modpacks/cuboid-outpost) was my first attempt at creating a ModPack for Minecraft. It's been amazingly well received - way beyond my hopes and expectations. This version of the pack is for players / communities with higher-spec machines to play on. 

The original pack was made with a view to making it accessible to as many people as possible, and therefore was aimed at being fairly light, and I've resisted adding more mods so as to still let people with Potato PC's play. I want to stick to that as much as possible for the original pack, but due to the number of people asking (repeatedly) for a few extra building blocks to choose from and some quality of life mods too, I've decided to release the same pack with some nice-to-have mods included. That's this pack!

The quest and storyline remains unchanged compared to Cuboid Outpost, as does the progression - but there are now a few more things available to build with, a few more gadgets available to make, and some quality of life additions. If you haven't got a Potato PC, and enjoy having a bigger palette of blocks to build from, then you might want to try this version of the pack. If you try this version and your PC is struggling, I suggest you try playing the original Cuboid Outpost instead, which has approximately 30 fewer mods in it overall.

---

The basic premise is this... you're stranded on a barren planet, civilization as you knew it has come to an abrupt end, and need to recreate life as you knew it. There are a few twists and turns along the way of course!

Watch the official trailer for Cuboid Outpost on YouTube by clicking on this image:

[![Cuboid Outpost Trailer](https://img.youtube.com/vi/97BzxR_aAHc/0.jpg)](https://www.youtube.com/watch?v=97BzxR_aAHc "Cuboid Outpost Trailer")

I designed this to be more of an intermediate tech pack for those just getting into Modded Minecraft, or who are looking for something not too hard / expert. As a result, while there are quite a few mods in the pack, I've intentionally kept the number of alternatives for things low (e.g. for digital storage there's only AE2 initially, but channels are disabled to make it easier to work with - RS is available later on).

Some great content mods have been added too to keep things interesting and a bit different. And then there are a few unique mods that you won't have seen in any other pack before too - so hopefully there's something for everyone.

I've spent a lot of time working on Quests (possibly the hardest thing to get right in creating a ModPack!), as well as on the storyline, so hopefully it will be enjoyable for you.

I would really appreciate any issues you encounter while playing being reported in the Issues for the Cuboid Outpost (Luxury Edition) ModPack in GitHub - I do only work on this in my (very limited) spare time, so I can't promise I'll resolve things immediately, but I do plan on trying to get around to fixing issues when I can. I would also appreciate a little bit of patience, and a civil tone when reporting issues - this is just something I'm doing for fun, for free, and in my own time, so if you could avoid sucking the life out of this experience for me by being rude or overly critical, I'd really appreciate that too!

If you'd like to chat about Cuboid Outpost or Cuboid Outpost LE with other players, you can join my [Discord server](https://discord.gg/j9zWKFuBtU). Please keep it clean, and make sure you read the rules before posting anything on there! Thanks.

If you want to support me financially (totally not required!), I have set up a [Patreon page](https://www.patreon.com/cuboiddroid). I'll try and post updates on progress regularly on there for my supporters to stay up to date with my efforts. Alternatively, you can donate via [PayPal](https://www.paypal.com/donate?hosted_button_id=3NREHL7EUD5JG)

And if you enjoy playing Cuboid Outpost and/or Cuboid Outpost (Luxury Edition), then tell you friends, family and favourite steamers to give it a go too!

Thanks for reading this, and hopefully you enjoy playing Cuboid Outpost even more than I have enjoyed making it!

Additional mods in this Luxury Edition, over and above what is included in Cuboid Outpost, are essentially:

**Blocks and Decoration**
- Bamboo Blocks
- Chipped
- Chisel
- Decorative Blocks
- Framed Blocks
- Masonry
- Macaw's Lights
- Macaw's Paintings
- Supplementaries

**Building Tools**
- Building Gadgets
- Corail Woodcutter
- Portable Stonecutter
- RFTools Builder

**Quality of Life**
- Dank Storage
- Double Doors
- Simple Magnets
- TOP Addons

**Advanced Technology**
- AE2 Extras
- AE2 Wireless Terminals
- Extra Storage
- Refined Storage Add-ons
- RS Infinity Booster