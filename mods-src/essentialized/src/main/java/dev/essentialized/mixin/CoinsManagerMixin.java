package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.network.connectionmanager.coins.CoinsManager"},
   remap = false
)
public class CoinsManagerMixin {
   @Inject(
      method = {"purchaseBundle"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$purchaseBundle(CallbackInfo ci) {
      if (EssentializedConfig.get().blockCoins) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"tryClaimingWelcomeCoins"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$claimWelcomeCoins(CallbackInfo ci) {
      if (EssentializedConfig.get().blockCoins) {
         ci.cancel();
      }
   }
}
