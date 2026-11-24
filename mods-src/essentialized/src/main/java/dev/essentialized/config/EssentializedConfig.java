package dev.essentialized.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Feature toggles, read from config/essentialized.json (created with defaults on first use).
 * Java 8 port of the original Essentialized config; same file name and keys.
 */
public final class EssentializedConfig {
   private static final Logger LOGGER = LogManager.getLogger("essentialized");
   private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
   private static EssentializedConfig instance;

   public boolean blockPurchases = true;
   public boolean blockCoins = true;
   public boolean blockCoinDialog = true;
   public boolean dropPackets = true;
   public boolean hideCosmetics = true;
   public boolean disableEmotes = true;
   public boolean hideNotices = true;
   public boolean hideWardrobeWarning = true;
   public boolean hideWardrobeButton = true;
   public boolean hidePicturesButton = true;
   public boolean hideAccountButton = true;
   public boolean hidePlayerPreview = true;
   public boolean hideSocialButton = false;
   public boolean hideMessageFlag = false;
   public boolean hideSettingsButton = false;
   public boolean hideHostButton = false;
   public boolean hideBetaFlag = false;
   public boolean hideUpdateFlag = false;

   public static synchronized EssentializedConfig get() {
      if (instance == null) {
         instance = load(Paths.get("config", "essentialized.json"));
      }
      return instance;
   }

   /** Whether the Essential menu element with this proxy id (e.g. "wardrobe", "pictures_2") is hidden. */
   public boolean hidesProxy(String id) {
      if (id == null) {
         return false;
      }
      switch (id.replaceAll("_\\d+$", "")) {
         case "wardrobe": return this.hideWardrobeButton;
         case "pictures": return this.hidePicturesButton;
         case "account": return this.hideAccountButton;
         case "player": return this.hidePlayerPreview;
         case "social": return this.hideSocialButton;
         case "message": return this.hideMessageFlag;
         case "settings": return this.hideSettingsButton;
         case "invite_host": return this.hideHostButton;
         case "beta": return this.hideBetaFlag;
         case "update": return this.hideUpdateFlag;
         default: return false;
      }
   }

   public static EssentializedConfig load(Path file) {
      try {
         if (Files.exists(file)) {
            String json = new String(Files.readAllBytes(file), StandardCharsets.UTF_8);
            EssentializedConfig config = GSON.fromJson(json, EssentializedConfig.class);
            return config != null ? config : new EssentializedConfig();
         }
         EssentializedConfig defaults = new EssentializedConfig();
         if (file.getParent() != null) {
            Files.createDirectories(file.getParent());
         }
         Files.write(file, GSON.toJson(defaults).getBytes(StandardCharsets.UTF_8));
         return defaults;
      } catch (Exception e) {
         LOGGER.error("Could not read {}, using defaults", file, e);
         return new EssentializedConfig();
      }
   }
}
