package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.gui.wardrobe.modals.CoinsPurchaseModal$Companion"},
   remap = false
)
public class CoinsPurchaseModalMixin {
   @Inject(
      method = {"open"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$open(CallbackInfo ci) {
      if (EssentializedConfig.get().blockCoinDialog) {
         ci.cancel();
      }
   }
}
