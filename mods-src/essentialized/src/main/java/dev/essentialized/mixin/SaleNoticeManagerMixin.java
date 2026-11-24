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
   targets = {"gg.essential.network.connectionmanager.notices.SaleNoticeManager"},
   remap = false
)
public class SaleNoticeManagerMixin {
   @Inject(
      method = {"getSaleState"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$getSaleState(CallbackInfoReturnable<Object> cir) {
      if (EssentializedConfig.get().hideNotices) {
         Object state = EssentialReflection.emptyListState(this);
         if (state != null) {
            cir.setReturnValue(state);
         }
      }
   }
}
