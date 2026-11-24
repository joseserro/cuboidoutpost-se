package dev.essentialized;

import net.minecraftforge.fml.common.Mod;

/**
 * Forge 1.16.5 entry point. All behaviour lives in the mixins (registered through the
 * MixinConfigs manifest attribute); Forge only needs a @Mod class for the mods.toml entry.
 */
@Mod(Essentialized.MOD_ID)
public final class Essentialized {
   public static final String MOD_ID = "essentialized";
}
