package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

@Pseudo
@Mixin(
   targets = {"gg.essential.gui.wardrobe.Wardrobe"},
   remap = false
)
public class WardrobeMixin {
   @Inject(
      method = {"displayCartWarningModal"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$displayCartWarning(CallbackInfo ci) {
      if (EssentializedConfig.get().hideWardrobeWarning) {
         ci.cancel();
      }
   }

   @Inject(
      method = {"hasUnownedItems"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$hasUnownedItems(CallbackInfoReturnable<Boolean> cir) {
      if (EssentializedConfig.get().hideWardrobeWarning) {
         cir.setReturnValue(false);
      }
   }
}
