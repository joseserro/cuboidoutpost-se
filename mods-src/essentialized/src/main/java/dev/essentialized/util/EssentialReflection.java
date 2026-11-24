package dev.essentialized.util;

import dev.essentialized.config.EssentializedConfig;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public final class EssentialReflection {
   private static final Logger LOGGER = LogManager.getLogger("essentialized");
   private static final String STATE = "gg.essential.gui.elementa.state.v2.";

   private EssentialReflection() {
   }

   public static Object falseState(Object owner) {
      try {
         Class<?> kt = Class.forName("gg.essential.gui.elementa.state.v2.StateKt", true, owner.getClass().getClassLoader());
         return kt.getMethod("stateOf", Object.class).invoke(null, Boolean.FALSE);
      } catch (ReflectiveOperationException var2) {
         LOGGER.warn("Could not create a false state", var2);
         return null;
      }
   }

   public static Object emptyListState(Object owner) {
      try {
         Class<?> kt = Class.forName("gg.essential.gui.elementa.state.v2.ListKt", true, owner.getClass().getClassLoader());
         return kt.getMethod("listStateOf", Object[].class).invoke(null, (Object)new Object[0]);
      } catch (ReflectiveOperationException var2) {
         LOGGER.warn("Could not create an empty list state", var2);
         return null;
      }
   }

   public static boolean isHiddenProxy(Object proxy) {
      try {
         Object id = proxy.getClass().getMethod("getEssentialId").invoke(proxy);
         return EssentializedConfig.get().hidesProxy((String)id);
      } catch (ReflectiveOperationException var2) {
         LOGGER.warn("Could not read proxy id", var2);
         return false;
      }
   }
}
