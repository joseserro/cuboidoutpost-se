# Sieve progression rebalance

Players reported that sieving was too strong and let them skip quest branches. The clearest case was getting osmium far too early. This document maps how sieve-sourced resources were obtainable and where the quests introduce them. It then describes what was changed and what still needs in-game testing.

All numbers in this document are **expected drops per sieved block**. Ex Nihilo Sequentia runs with `flattenSieveRecipes = true` (`config/exnihilosequentia-common.toml`), so a mesh rolls its own entries **and every lower-tier entry**. The totals below already include that. Mesh order is String < Flint < Iron < Diamond < Emerald < Netherite (S/F/I/D/E/N).

4 ore pieces make 1 chunk. Chunks are tagged `forge:ores/<metal>`, so the Smoosher, pulverizers and Mekanism double (or more) them. One piece is therefore worth about 0.5 ingot once any ore doubling is available.

## 1. How sieve resources were obtainable (before)

### Sieve recipes after the pack's KubeJS changes

The full effective table was built by loading every recipe from all 160 mod jars and then replaying every KubeJS server script. 113 `exnihilosequentia:sieve` recipes are live, and only ENS and its Mekanism, Thermal, AE2 and Tinkers addons plus Ex Compressum add any. The resource-relevant rows (flattened totals S/F/I/D/E/N):

| input → drop | recipe id (pack file) | before |
|---|---|---|
| crushed andesite → tin, zinc | `sieve/piece_tin.js`, `piece_zinc.js` | -/0.25/0.425/0.65/0.65/0.65 |
| crushed diorite → silver, aluminum | `sieve/piece_silver.js`, `piece_aluminum.js` | -/0.25/0.425/0.65/0.65/0.65 |
| crushed granite → copper, nickel | `sieve/piece_copper.js`, `piece_nickel.js` | -/0.25/0.425/0.65/0.65/0.65 |
| gravel → lead | `sieve/piece_lead.js` | -/-/0.175/0.4/0.4/0.4 |
| gravel → uranium | `sieve/piece_uranium.js` | -/-/0.125/0.3/0.3/0.3 |
| gravel → iron | `sieve/piece_iron.js` | -/-/-/0.25/0.25/0.25 |
| gravel → **osmium** | `sieve/piece_osmium.js` | -/-/-/-/**0.1/0.3** |
| gravel → gold | `sieve/piece_gold.js` | N only 0.15 |
| gravel → platinum | `sieve/piece_platinum.js` | N only 0.15 |
| crushed netherrack → gold | `sieve/piece_gold_netherrack.js` | -/-/0.25/0.6/1.05/1.05 |
| crushed netherrack → cobalt | `exnihilotinkers:sieve/ens_piece_cobalt` (mod) | -/-/0.05/0.15/0.15/0.15 |
| crushed netherrack → netherite scrap | `exnihilosequentia:sieve/ens_netherite_scrap` (mod) | -/-/0.004/0.012/… |
| gravel → diamond | `sieve/diamond.js` | -/-/0.025/0.075/0.15/0.275 |
| crushed diorite → diamond | `sieve/diamond.js` | -/-/0.075/0.175/0.3/0.45 |
| gravel → emerald | `sieve/emerald.js` | -/-/-/0.05/0.125/0.25 |
| crushed granite → emerald | `sieve/emerald.js` | -/-/-/0.075/0.2/0.35 |
| gravel → raw / poor / dense uraninite | `sieve/uraninite_raw*.js` | E 0.025/0.05/-, N 0.1/0.15/0.05 |
| gravel → fluorite | `exnihilomekanism:sieve/ens_piece_osmium_2` (mod, misnamed) | -/-/0.025/0.075/… |
| soul sand → quartz | `sieve/nether_quartz.js` | -/-/0.66/1.16/1.91/2.91 |
| gravel → coal, lapis, thermal gems | mod defaults + `sieve/lapis.js` | flint mesh and up |

The mod defaults that the pack replaces are removed by id in each `sieve/*.js` (for example `exnihilomekanism:sieve/ens_piece_osmium_1`, which was iron 0.05 / diamond 0.1, and `exnihilomekanism:sieve/ens_piece_osmium_3`, Mekanism salt, in `salt.js`). All 151 removals in the pack were checked against the jars. Only 4 miss: the `minecraft:*_nugget_from_*` ids in `gating.js`, which do not exist in 1.16.5. That is harmless.

### Mesh recipes (before)

| mesh | recipe (`exnihilosequentia:ens_mesh_*`) | earliest realistic point |
|---|---|---|
| String | 9 string | start of Getting Going |
| Flint | 6 flint + String Mesh | Getting Going ("Flinty Meshy Upgrade") |
| Iron | 6 iron ingots + Flint Mesh | Getting Creative ("Iron Brew"): iron is gated to Create washing + QTC (`gating.js` removes the Tinkers iron melting; the Molecular Recycler blacklists iron outputs) |
| Diamond | 6 diamonds + Iron Mesh | right after the Iron Mesh (diamonds from Iron Mesh on crushed diorite/gravel) |
| Emerald | 6 emeralds + Diamond Mesh | right after the Diamond Mesh (emeralds from Diamond Mesh on gravel/crushed granite) |
| Netherite | smithing: Emerald Mesh + netherite ingot | Getting Tinks Done (scrap + gold from crushed netherrack) |

### Other machines and paths

- **Ex Compressum heavy sieve** (`excompressum:heavy_sieve/*`, all `excompressum:heavy_sieve_generated`). For 13 compressed blocks it calls ENS `getDrops(source, mesh)` and rolls each entry `heavySieveDefaultRolls = 7` times (`config/excompressum-common.toml`). It therefore always mirrors the normal sieve tables, including flattening and every KubeJS change. Only Iron, Diamond, Emerald and Netherite meshes fit a heavy sieve (decompiled `ExNihiloSequentiaAddon`: only those are `setHeavy(true)`). The oak heavy sieve is cheap (logs + sticks), so from the Iron Mesh onward it is a ×7 throughput tool at a 9:7 material loss. It multiplies whatever the mesh already allows but bypasses no gate.
- **Auto Sieve** (`auto_sieves_and_hammers.js`). It is intentionally early (Getting Going "A little helper": Thatldu + Wikidium + a Pulverizer), accepts any mesh and uses the same tables. **Auto Heavy Sieve** needs steel (after Mekanism). Auto hammers and compressed hammers only produce gravel, sand, dust and crushed stone.
- **Mesh enchantments.** Meshes take Efficiency and **Fortune** (enchanting table or books). In the ENS `SieveTile` each roll succeeds with `chance × (1 + fortune/3)`, so Fortune III doubles every drop. The Auto Sieve applies mesh fortune too.
- **Ore doubling.** Chunks are `forge:ores/*`, so Smoosher, Thermal and IE crushing (2×) and later Mekanism (3–5×) all apply.
- **Non-sieve sources checked:**
  - Create splashing of gravel gives iron nuggets (the intended iron route). Soul sand gives quartz and 2% gold nuggets.
  - The Tinkers alloy Iron + Thatldu + Fullerene → osmium (`tinkers.js`) is the intended osmium route.
  - Singularity Resource Generators need 160 ingots or 256 gems per singularity, so they are late.
  - The Industrial Foregoing laser drill can produce osmium, uranium and platinum ores, but its ore base needs an advanced machine frame and plastic (group 3/4).
  - The Cuboid Overworld (dimension stage `cuboid_overworld_access`) is in group 5.
  - No quest reward or reward table gives meshes, osmium, uranium or platinum.

### Bypasses found

1. **Osmium via the Emerald Mesh (the reported issue).** As soon as the player had 6 iron ingots from Getting Creative:
   - Iron Mesh: about 80 crushed diorite at 7.5% gives 6 diamonds.
   - Diamond Mesh: about 80 crushed granite at 7.5% gives 6 emeralds.
   - The Emerald Mesh then gave 0.1 osmium pieces per gravel, about 0.05 ingots per gravel with Smoosher doubling. A heavy sieve made that about 0.35 ingots per compressed gravel, and the Netherite Mesh tripled it (0.3 per gravel).

   This made osmium available *before* the intended Smeltery alloy ("Osmium Osmosis", the last step of Getting Tinks Done). That alloy is also what unlocks Getting Mekanised and Allo? Allo? Alloy!. Players could skip the Tinkers smeltery chapter and Getting Immersed and go straight to Mekanism. The cause is the Emerald Mesh recipe (`exnihilosequentia:ens_mesh_emerald`) combined with `sieve/piece_osmium.js`.
2. **The same chain unlocked uranium and uraninite early.** Uranium was already at the Iron Mesh (0.125, then 0.3 per gravel). Powah uraninite came from the Emerald Mesh, and raw platinum and gold from the Netherite Mesh, all reachable at the Getting Creative / Tinkers tier.
3. **Overly generous flattened upper tiers.** Diamond and Emerald meshes stacked large bonuses on every lower entry:
   - Gold from crushed netherrack reached 1.05 pieces per block.
   - Diamonds from crushed diorite reached 0.45 per block.
   - Quartz reached 2.9 per soul sand.
   - Each early metal reached 0.65 per block.

   With Fortune III (×2) and heavy sieves (×7) on top, sieving replaced the later ore-processing tech rather than leading into it.
4. Not sieve-related, but worth noting (outside the files this change may touch):
   - The roof Mekanism Wind and Advanced Solar Generators can be recycled in the Molecular Recycler (the quests suggest it). `config/cuboidmod/recycler/result_item_tag_blacklist.json` blacklists iron and the cuboid metals but **not osmium**, so a few osmium ingots may leak out early. The amount is finite and unverified.

## 2. Intended progression (from the quests)

| tier | chapter / quest | what it unlocks | gate |
|---|---|---|---|
| T0 | Getting Started | cuboid metals, QTC, recycler | – |
| T1a | Getting Going: "Meshed Together" | String Mesh: dirt (pebbles), sand, dust (gunpowder, bone meal), silica blocks (salt), cellulose (tree seeds) | string |
| T1b | Getting Going: "Flinty Meshy Upgrade", "Zinc and Tin", "Copper and Nickel", "Silver and Aluminium", "Close the coal mines", "Lovely Lapis" | Flint Mesh: the six base metals from crushed andesite/diorite/granite, coal, lapis, Thermal gems | flint |
| T2 | Getting Creative: "Iron Brew" | iron (Create washing + QTC) → Iron Mesh possible | Andesite Alloy (zinc) |
| T3 | Getting Tinks Done: "Crushed Netherrack", "Gold! (Gold)", "It's blue-tiful", "Beware of the oysters", "More like St John's Wort", "Powdered Blaze", "Olde Fungus" | Iron Mesh: gold, cobalt, netherite scrap, ender pearl, nether wart, blaze powder, diamonds ("Diamonds can be obtained by sieving Gravel or Crushed Diorite with an Iron Mesh"). Diamond Mesh: ancient spores | copper (chapter), iron (mesh) |
| T3 end | Getting Tinks Done: "Osmium Osmosis" | **osmium** (Smeltery alloy) → unlocks Getting Mekanised and Allo? Allo? Alloy! | Smeltery, iron, Thatldu, Fullerene |
| T4 | Getting Immersed, Getting Digital (gold, diamond block, certus/fluix via Diamond Mesh) | – | iron, aluminum, gold |
| T5 | Getting Mekanised, Allo? Allo? Alloy! (Enderium needs **lead**), Ther-malcontents (lead gear augments) | steel, ore multiplication | osmium |
| T6 | Powah to the Person / All Powah-ful (uraninite reactors), furnaces/jetpacks (emeralds) | – | nether access, steel |
| T7 | Quantum Singularities appendix (lead, uranium, platinum, osmium singularities), Cuboid Overworld | – | late |

Lead's first main-line uses are IE capacitors, Thermal augments (`thermal.js` lead gear) and Enderium. Uranium has no main-line use before Mekanism fission and waste handling or the IE uranium block used as a crucible heat source. Platinum is only used for its singularity.

## 3. Changes

### Mesh gate (`recipes/exnihilo.js`)

The Emerald Mesh recipe `exnihilosequentia:ens_mesh_emerald` is removed and replaced by:

```
E O E      E = #forge:gems/emerald (6)
E M E      O = #forge:ingots/osmium (2)   (tag contains only mekanism:ingot_osmium)
E O E      M = Diamond Mesh
```

The Emerald Mesh, and the Netherite Mesh smithed from it, can now only be made after osmium has been obtained the intended way. Nothing needed for Osmium Osmosis comes from Emerald-tier drops, so there is no circular dependency.

### Drop table changes (`recipes/sieve/*.js`)

Flattened expected drops per block, S/F/I/D/E/N:

| input → drop | before | after | rationale |
|---|---|---|---|
| crushed andesite → tin, zinc | -/0.25/0.425/0.65/0.65/0.65 | -/0.25/0.35/0.4/0.4/0.4 | T1 rate kept so the skyblock start is unchanged. Upper-tier bonus trimmed |
| crushed diorite → silver, aluminum | same as above | same as above | " |
| crushed granite → copper, nickel | same as above | same as above | " |
| gravel → lead | -/-/0.175/0.4/0.4/0.4 | -/-/0.1/0.15/0.2/0.2 | stays at Iron Mesh (IE/Thermal tier), less generous |
| gravel → uranium | -/-/0.125/0.3/0.3/0.3 | -/-/-/-/0.06/0.12 | moved to Emerald/Netherite (post-osmium) |
| gravel → iron | -/-/-/0.25/0.25/0.25 | -/-/-/0.12/0.16/0.2 | top-up only. Create + QTC remains the iron route |
| gravel → **osmium** | -/-/-/-/0.1/0.3 | -/-/-/-/**0.04/0.1** | Emerald Mesh is now post-osmium. Rate cut 60–67% |
| gravel → gold | N 0.15 | N 0.1 | late bonus |
| gravel → platinum | N 0.15 | N 0.1 | completionist |
| crushed netherrack → gold | -/-/0.25/0.6/1.05/1.05 | -/-/0.2/0.3/0.35/0.35 | T3 source kept, stacking bonus removed |
| gravel → diamond | -/-/0.025/0.075/0.15/0.275 | -/-/0.02/0.035/0.05/0.07 | Iron Mesh source kept (quest text) |
| crushed diorite → diamond | -/-/0.075/0.175/0.3/0.45 | -/-/0.06/0.09/0.11/0.13 | main diamond source; about 100 blocks for a Diamond Mesh |
| gravel → emerald | -/-/-/0.05/0.125/0.25 | -/-/-/0.03/0.05/0.07 | Diamond Mesh source kept |
| crushed granite → emerald | -/-/-/0.075/0.2/0.35 | -/-/-/0.05/0.08/0.1 | " |
| gravel → raw uraninite | -/-/-/-/0.025/0.1 | -/-/-/-/0.02/0.06 | Powah tier (Emerald Mesh, now post-osmium) |
| gravel → poor uraninite | -/-/-/-/0.05/0.15 | -/-/-/-/0.04/0.1 | " |
| gravel → dense uraninite | N 0.05 | N 0.03 | " |
| soul sand → quartz | -/-/0.66/1.16/1.91/2.91 | -/-/0.66/0.91/1.16/1.51 | Iron Mesh rate kept, upper tiers trimmed |

Not changed: coal, lapis, Thermal gems, cobalt, netherite scrap, ender pearl, redstone, glowstone, blaze powder, nether wart, ghast tear, AE2 drops (certus, sky dust, fluix), fluorite (mod default Iron 0.025 / Diamond 0.05), salt, all seeds and saplings, pebbles.

### Text (`kubejs/assets/cuboidquests/lang`)

- `cuboiddroid.quests.g.00.c.28.q.34.d.04` (Osmium Osmosis) now says that Osmium Ingots are needed to upgrade a Diamond Mesh into an Emerald Mesh. Updated in `en_us.json` and `it_it.json`.
- `cuboiddroid.quests.g.00.c.22.q.03.d.12` (Getting Digital, fluix fast method) now notes that the Emerald Mesh needs Osmium Ingots. Updated in `en_us.json` and `it_it.json`, which also fixes the Italian "Emerald Mash" typo.

The quest text about Iron and Diamond Mesh drops (gold, diamonds, nether wart, blaze powder, ancient spores, ghast tears, charged certus, fluix dust) is still accurate.

### Not changed, and why

- `heavySieveDefaultRolls = 7` is kept. Compression already loses 2 of 9, and the heavy sieve adds no tier.
- Auto sieve and hammer recipes are kept. The auto sieve is a deliberate Getting Going milestone and uses the same tables.

## 4. Open risks and in-game checks

1. **Quest appendix structure (needs an SNBT edit; outside this change's file scope).** In "This is Meshed Up" (`getting_meshed_up.snbt`), the uranium piece node `6737BDC6700D2137` still hangs under "Iron Mesh + Gravel" (`62714B005AA7C33E`). It should be re-parented to "Emerald Mesh + Gravel" (`0B70DF277F4F1902`). It is still completable, just later. Osmium has no appendix node; consider adding one under "Emerald Mesh + Gravel".
2. **Verify in JEI** that the Emerald Mesh shows only the new recipe and that heavy-sieve JEI pages for compressed gravel show the new rates. The generated heavy-sieve recipes are built from ENS `getDrops` at runtime and should pick up the KubeJS tables, but this was read from bytecode, not observed.
3. **Fortune meshes** still double every drop and cannot be disabled from recipe scripts. The new rates assume some players will use Fortune III.
4. **Recycler osmium leak** (roof Wind and Advanced Solar Generators; osmium is not in `result_item_tag_blacklist.json`). Recycling one in-game would show how many osmium ingots come back. If it is enough for 2 ingots, it opens the Emerald Mesh early. Fixing it means adding `forge:ingots/osmium` to that blacklist, which is outside the files this change may touch.
5. **Beetroot seeds** come only from the Emerald Mesh (organically enriched sand). No quest requires beetroot, but any food recipe that needs it now comes after osmium. Moving `sieve/beetroot_seeds.js` to the Diamond Mesh would avoid that if it matters.
6. **Grind check.** Players should measure in a test world:
   - The early game should be unchanged (T1 flint-mesh rates are identical).
   - Getting 6 diamonds now takes about 100 crushed diorite with an Iron Mesh (before: about 80).
   - Getting 6 emeralds takes about 120 crushed granite with a Diamond Mesh (before: about 80).
   - The emeralds also feed furnaces and jetpacks; an emerald quest reward exists later (Up, up and away).
7. **Industrial Foregoing laser drill** (osmium, uranium, platinum ores) and the **Cuboid Overworld** natural ores were not checked in-game. Both are later than the main line, but the exact laser drill unlock point was not verified.
