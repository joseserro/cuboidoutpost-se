package dev.essentialized.mixin;

import dev.essentialized.config.EssentializedConfig;
import dev.essentialized.util.MonetizationPackets;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Coerce;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Pseudo
@Mixin(
   targets = {"gg.essential.network.connectionmanager.ConnectionManager"},
   remap = false
)
public class ConnectionManagerMixin {
   @Inject(
      method = {"send(Lgg/essential/connectionmanager/common/packet/Packet;Ljava/util/function/Consumer;Ljava/util/concurrent/TimeUnit;Ljava/lang/Long;)V"},
      at = {@At("HEAD")},
      cancellable = true,
      require = 0
   )
   private void essentialized$send(@Coerce Object packet, Consumer<Optional<?>> callback, TimeUnit unit, Long timeout, CallbackInfo ci) {
      if (EssentializedConfig.get().dropPackets && MonetizationPackets.isMonetization(packet.getClass().getName())) {
         if (callback != null) {
            callback.accept(Optional.empty());
         }

         ci.cancel();
      }
   }
}
