package dev.essentialized.mixin;

import dev.essentialized.util.EssentialReflection;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.gui.proxies.EssentialProxyElement"},
   remap = false
)
public class ProxyElementMixin {
   @Inject(
      method = {"initAfterInitialLayout", "updateProxyState", "updateProxyStateWhileNotInControl"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$skipUnbound(CallbackInfo ci) {
      if (EssentialReflection.isHiddenProxy(this)) {
         ci.cancel();
      }
   }
}
