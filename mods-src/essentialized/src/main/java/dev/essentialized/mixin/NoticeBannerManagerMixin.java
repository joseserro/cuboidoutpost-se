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
   targets = {"gg.essential.network.connectionmanager.notices.NoticeBannerManager"},
   remap = false
)
public class NoticeBannerManagerMixin {
   @Inject(
      method = {"getNoticeBanners"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$getNoticeBanners(CallbackInfoReturnable<Object> cir) {
      if (EssentializedConfig.get().hideNotices) {
         Object state = EssentialReflection.emptyListState(this);
         if (state != null) {
            cir.setReturnValue(state);
         }
      }
   }
}
