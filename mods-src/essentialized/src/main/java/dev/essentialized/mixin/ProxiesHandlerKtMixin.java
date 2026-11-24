package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Coerce;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * 1.16.5 port addition. In Essential for Minecraft 1.16.5 the menu buttons are mounted by the
 * static top-level function ProxiesHandlerKt.mountWithProxy(scope, handler, id, modifier, content),
 * not ScreenWithProxiesHandler.Companion.mountWithProxy as in newer versions (ProxyHandlerMixin).
 * Skipping the mount keeps hidden buttons off the title and pause menus entirely.
 */
@Pseudo
@Mixin(targets = {"gg.essential.gui.proxies.ProxiesHandlerKt"}, remap = false)
public class ProxiesHandlerKtMixin {
   @Inject(
      method = {"mountWithProxy(Lgg/essential/gui/layoutdsl/LayoutScope;Lgg/essential/gui/proxies/ProxiesHandler;Ljava/lang/String;Lgg/essential/gui/layoutdsl/Modifier;Lkotlin/jvm/functions/Function1;)V"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private static void essentialized$skip(@Coerce Object scope, @Coerce Object handler, String id, @Coerce Object modifier, @Coerce Object content, CallbackInfo ci) {
      if (EssentializedConfig.get().hidesProxy(id)) {
         ci.cancel();
      }
   }
}
