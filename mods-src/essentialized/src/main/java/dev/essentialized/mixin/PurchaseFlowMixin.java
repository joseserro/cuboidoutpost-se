package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.gui.wardrobe.PurchaseKt"},
   remap = false
)
public class PurchaseFlowMixin {
   @Inject(
      method = {"purchaseCosmeticOrEmote*"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$purchaseCosmetic(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"purchaseAndCreateOutfitForBundle"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$purchaseBundle(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"purchaseSelectedBundle"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$purchaseSelectedBundle(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"purchaseEquippedCosmetics"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$purchaseEquipped(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"purchaseSelectedEmote"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$purchaseEmote(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"giftCosmeticOrEmote"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$gift(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"openPurchaseItemModal"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$purchaseModal(CallbackInfo ci) {
      if (EssentializedConfig.get().blockPurchases) {
         ci.cancel();
      }
   }
}
