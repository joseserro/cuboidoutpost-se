package dev.essentialized.mixin;

import dev.essentialized.util.EssentialReflection;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.gui.proxies.MenuButtonProxy", "gg.essential.gui.proxies.UIPlayerProxy", "gg.essential.gui.proxies.NoticeFlagProxy"},
   remap = false
)
public class MenuProxyMixin {
   @Inject(
      method = {"handleRender", "click*"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$silence(CallbackInfo ci) {
      if (EssentialReflection.isHiddenProxy(this)) {
         ci.cancel();
      }
   }
}
