# Essentialized: Forge 1.16.5 port

This is a port of Essentialized 1.0.0 (MIT, see `LICENSE`; upstream: https://github.com/guygun1/essentialized) to Minecraft 1.16.5 / Forge 36 / Java 8, for Cuboid Outpost: Splendor Edition. It's built by `npm run build` (see `tools/lib/local-mods.mjs`) into `overrides/mods/essentialized-1.16.5-1.0.0.jar`.

The mixins target only Essential's own classes (`@Pseudo`, `remap = false`, `require = 0`). None touch Minecraft classes, so no refmap or Minecraft mappings are needed. If a target is missing, its hook silently does nothing instead of crashing.

## Changes from the original jar

- Recompiled for Java 8. `Set.of`, switch expressions, `Path.of` and `Files.readString` were replaced with Java 8 equivalents.
- Packaged for Forge 1.16.5: `javafml` `mods.toml`, an empty `@Mod` class, and the mixin config registered through the `MixinConfigs` manifest attribute.
- Added `ProxiesHandlerKtMixin`. In Essential for 1.16.5, menu buttons are mounted by the static `gg.essential.gui.proxies.ProxiesHandlerKt.mountWithProxy(...)`, not by `ScreenWithProxiesHandler$Companion.mountWithProxy` as in newer versions. The original `ProxyHandlerMixin` is kept for parity but doesn't apply on 1.16.5.

## Targets checked against Essential 1.5.2 (forge_1-16-5)

| Feature (config key) | Target | 1.16.5 |
|---|---|---|
| blockCoins | `CoinsManager.purchaseBundle`, `tryClaimingWelcomeCoins` | present |
| blockCoinDialog | `CoinsPurchaseModal$Companion.open` | present |
| dropPackets | `ConnectionManager.send(Packet, Consumer, TimeUnit, Long)` | present |
| hideNotices | `CosmeticNotices.getHasAnyNewCosmetics`, `getNewState`; `NoticeBannerManager.getNoticeBanners`; `SaleNoticeManager.getSaleState` | present |
| hideCosmetics | `CosmeticsRenderState$Live.wearablesManager` | present |
| disableEmotes | `EmoteWheel$Companion.open`, `equipEmote` | present |
| blockPurchases | `PurchaseKt.purchaseCosmeticOrEmote*`, `purchaseAndCreateOutfitForBundle`, `purchaseSelectedBundle`, `purchaseEquippedCosmetics`, `purchaseSelectedEmote`, `giftCosmeticOrEmote`, `openPurchaseItemModal` | present |
| hideWardrobeWarning | `Wardrobe.displayCartWarningModal`, `hasUnownedItems` | present |
| hide*Button / hidePlayerPreview / hide*Flag | `ProxiesHandlerKt.mountWithProxy` (new), `MenuButtonProxy`/`NoticeFlagProxy.handleRender`, `click*`, `EssentialProxyElement.updateProxyState*` | present (`UIPlayerProxy.handleRender` and `EssentialProxyElement.initAfterInitialLayout` don't exist on 1.16.5; those hooks are skipped) |

The proxy ids (`wardrobe`, `pictures`, `account`, `player`, `social`, `message`, `settings`, `invite_host`, `beta`, `update`) match the ones Essential 1.16.5 uses.

## Not verified

The hooks were checked against Essential's class files, and loading was tested on a dedicated server: Forge accepts the mod and Mixin prepares all 14 mixins. Whether each hook takes effect in the game client still needs checking in-game, because Essential downloads and updates its real jar at runtime, and its internals could change in a later Essential update.
