# Essentialized: Forge 1.16.5 port

This is a port of Essentialized 1.0.0 (MIT, see `LICENSE`; upstream: https://github.com/guygun1/essentialized) to Minecraft 1.16.5 / Forge 36 / Java 8, for Cuboid Outpost: Splendor Edition. It's built by `npm run build` (see `tools/lib/local-mods.mjs`) into `overrides/mods/essentialized-1.16.5-1.0.0.jar`.

The mixins target only Essential's own classes (`@Pseudo`, `remap = false`, `require = 0`). None touch Minecraft classes, so no refmap or Minecraft mappings are needed. If a target is missing, its hook silently does nothing instead of crashing.

## Changes from the original jar

- Recompiled for Java 8. `Set.of`, switch expressions, `Path.of` and `Files.readString` were replaced with Java 8 equivalents.
- Packaged for Forge 1.16.5: `javafml` `mods.toml`, an empty `@Mod` class, and the mixin config registered through the `MixinConfigs` manifest attribute.
- **Hiding menu elements works differently on 1.16.5.** Upstream skips mounting hidden elements (`ScreenWithProxiesHandler$Companion.mountWithProxy`). Essential for 1.16.5 checks in `ScreenWithProxiesHandler.initGui` that every element was mounted, and crashes on the title screen otherwise ("Proxy element for wardrobe was never bound"; fixed in 1.0.1). So hidden elements are still mounted, then hidden once bound:
  - `ProxyElementMixin` sets the `mountingControl` state in `EssentialProxyElement.acceptNewEssentialContainer` to a constant `false`, so Essential never shows its own component.
  - It also cancels the base `handleRender` (where proxy-drawn mode draws the vanilla button) and makes `mouseClicked` (`func_231044_a_`) return `false`.
  - The upstream `ProxyHandlerMixin` is removed.

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
| hide*Button / hidePlayerPreview / hide*Flag | `EssentialProxyElement.acceptNewEssentialContainer` (RETURN), `handleRender`, `func_231044_a_`, `updateProxyState*`; `MenuButtonProxy`/`NoticeFlagProxy`.`handleRender`, `click*` | present (`initAfterInitialLayout` doesn't exist on 1.16.5; that hook is skipped) |

The proxy ids (`wardrobe`, `pictures`, `account`, `player`, `social`, `message`, `settings`, `invite_host`, `beta`, `update`) match the ones Essential 1.16.5 uses.

## Not verified

The hooks were checked against Essential's class files. A real client run with 1.0.0 confirmed that Forge loads the mod, `config/essentialized.json` is created, and Mixin applies the hooks into Essential's connection manager, notice, coins, wardrobe and proxy classes. Whether each hook visibly takes effect in the game still needs checking in-game. Essential downloads and updates its real jar at runtime, so its internals could change in a later Essential update.
