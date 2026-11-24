package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import dev.essentialized.util.EssentialReflection;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

@Pseudo
@Mixin(
   targets = {"gg.essential.network.connectionmanager.notices.CosmeticNotices"},
   remap = false
)
public class CosmeticNoticesMixin {
   @Inject(
      method = {"getHasAnyNewCosmetics"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$getHasAnyNewCosmetics(CallbackInfoReturnable<Object> cir) {
      if (EssentializedConfig.get().hideNotices) {
         Object state = EssentialReflection.falseState(this);
         if (state != null) {
            cir.setReturnValue(state);
         }
      }
   }

   @Inject(
      method = {"getNewState"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$getNewState(CallbackInfoReturnable<Object> cir) {
      if (EssentializedConfig.get().hideNotices) {
         Object state = EssentialReflection.falseState(this);
         if (state != null) {
            cir.setReturnValue(state);
         }
      }
   }
}
