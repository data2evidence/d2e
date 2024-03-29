package com.legacy.health.fhir.extension;

import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;
import com.legacy.health.fhir.extension.extensionpoints.annotations.FeatureSwitchManager;

@com.legacy.health.fhir.extension.extensionpoints.annotations.FeatureSwitchManager
public interface FeatureSwitchManagerExtension extends Extension {

   boolean isActive(String feature, boolean defaulValue);

   void enableFeature(String feature);

   void disableFeature(String feature);

   void reloadFeaturesStates();

   public static ExtensionPoint<FeatureSwitchManager, FeatureSwitchManagerExtension> FeatureSwitchManager() {
      return new ExtensionPoint<>(FeatureSwitchManager.class, FeatureSwitchManagerExtension.class);
   }
}
