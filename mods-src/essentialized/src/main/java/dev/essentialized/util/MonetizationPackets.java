package dev.essentialized.util;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/** Outgoing Essential packets that start a purchase or checkout; dropped when dropPackets is on. */
public final class MonetizationPackets {
   private static final String BASE = "gg.essential.connectionmanager.common.packet.";
   private static final Set<String> BLOCKED = Collections.unmodifiableSet(new HashSet<>(Arrays.asList(
      BASE + "checkout.ClientCheckoutCoinBundlePacket",
      BASE + "checkout.ClientCheckoutCosmeticsPacket",
      BASE + "checkout.ClientCheckoutDynamicCoinBundlePacket",
      BASE + "checkout.ClientCheckoutPartnerCodeRequestDataPacket",
      BASE + "checkout.ClientCheckoutStoreBundlePacket",
      BASE + "cosmetic.ClientCosmeticCheckoutPacket",
      BASE + "store.ClientRedeemStoreClaimPacket"
   )));

   private MonetizationPackets() {
   }

   public static boolean isMonetization(String className) {
      return BLOCKED.contains(className);
   }
}
