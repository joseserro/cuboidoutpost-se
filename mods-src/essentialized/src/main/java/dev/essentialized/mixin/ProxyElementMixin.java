package dev.essentialized.mixin;

import dev.essentialized.util.EssentialReflection;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Coerce;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * Hides Essential's title/pause-menu elements (buttons, notice flags, player preview) whose
 * proxy id is switched off in the config.
 *
 * Essential 1.16.5 checks in ScreenWithProxiesHandler.initGui that every proxy id was mounted
 * and bound ("Proxy element for X was never bound"), so hidden elements must still be mounted.
 * They are hidden after binding instead:
 *  - Essential-drawn: acceptNewEssentialContainer hands the proxy a "mountingControl" state that
 *    decides whether Essential's own component is shown; it is pinned to a constant false.
 *  - Proxy-drawn (e.g. with FancyMenu): the vanilla button is drawn inside handleRender, which is
 *    cancelled here (base class) and in MenuProxyMixin (subclasses that override it); clicks are
 *    cancelled in MenuProxyMixin.
 */
@Pseudo
@Mixin(
   targets = {"gg.essential.gui.proxies.EssentialProxyElement"},
   remap = false
)
public class ProxyElementMixin {
   @Inject(
      method = {"initAfterInitialLayout", "updateProxyState", "updateProxyStateWhileNotInControl", "handleRender"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$skipHidden(CallbackInfo ci) {
      if (EssentialReflection.isHiddenProxy(this)) {
         ci.cancel();
      }
   }

   /** Widget.mouseClicked (SRG name, as used at runtime on Forge 1.16.5): hidden proxies never take clicks. */
   @Inject(
      method = {"func_231044_a_(DDI)Z"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$ignoreClicksWhenHidden(double mouseX, double mouseY, int button, CallbackInfoReturnable<Boolean> cir) {
      if (EssentialReflection.isHiddenProxy(this)) {
         cir.setReturnValue(false);
      }
   }

   @Inject(
      method = {"acceptNewEssentialContainer"},
      at = {@At("RETURN")},
      require = 0
   )
   private void essentialized$unmountHidden(@Coerce Object container, @Coerce Object mountingControl, CallbackInfo ci) {
      if (EssentialReflection.isHiddenProxy(this)) {
         EssentialReflection.setToFalseState(mountingControl, this);
      }
   }
}
