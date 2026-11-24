package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

@Pseudo
@Mixin(
   targets = {"gg.essential.cosmetics.CosmeticsRenderState$Live"},
   remap = false
)
public class CosmeticsRenderStateLiveMixin {
   @Inject(
      method = {"wearablesManager"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$wearablesManager(CallbackInfoReturnable<Object> cir) {
      if (EssentializedConfig.get().hideCosmetics) {
         cir.setReturnValue(null);
      }
   }
}
