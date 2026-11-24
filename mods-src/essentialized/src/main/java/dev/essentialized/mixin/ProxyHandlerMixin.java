package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Coerce;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.gui.proxies.ScreenWithProxiesHandler$Companion"},
   remap = false
)
public class ProxyHandlerMixin {
   @Inject(
      method = {"mountWithProxy"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$skip(@Coerce Object scope, @Coerce Object handler, String id, @Coerce Object modifier, @Coerce Object content, CallbackInfo ci) {
      if (EssentializedConfig.get().hidesProxy(id)) {
         ci.cancel();
      }
   }
}
