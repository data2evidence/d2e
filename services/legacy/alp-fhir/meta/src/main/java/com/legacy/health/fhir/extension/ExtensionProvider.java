package com.legacy.health.fhir.extension;

import com.legacy.health.fhir.extension.extensionpoints.ExtensionPoint;

import com.legacy.health.fhir.extension.extensionpoints.annotations.ActiveByDefault;
import org.reflections.Reflections;
import org.reflections.util.FilterBuilder;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.URL;
import java.util.*;

public class ExtensionProvider {

    private static final Logger log = LoggerFactory.getLogger(ExtensionProvider.class);

    private static Map<Class, List<Class>> extensionCache = new HashMap<>();

    private static Set<String> coreExtensions = new HashSet<>(
            Arrays.asList("com.legacy.health.fhir.extension.extensionpoints.annotations.FeatureSwitchManager"));

    private static FeatureSwitchManagerExtension switchManager = null;

    public static void clearCache() {
        reflectionCache = null;
        extensionCache.clear();

    }

    private static FeatureSwitchManagerExtension getSwitchmanager() {
        if (switchManager == null) {
            switchManager = getExtensionsForExtensionPoint(FeatureSwitchManagerExtension.FeatureSwitchManager()).get(0);
        }
        return switchManager;
    }

    public static boolean isFeatureActive(String featureName, boolean defaultValue) {
        FeatureSwitchManagerExtension switchManager = getSwitchmanager();
        return switchManager.isActive(featureName, defaultValue);
    }

    private static Reflections reflectionCache = null;

    public static <S, T> List<T> getExtensionsForExtensionPoint(ExtensionPoint<S, T> p) {

        List<Class> extensions = extensionCache.computeIfAbsent(p.getExtClass(), cl -> {
            List<Class> extensionClasses = new LinkedList<>();
            List<URL> paths = new LinkedList<>(ClasspathHelper.forJavaClassPath());
            paths.addAll(ClasspathHelper.forClassLoader(ExtensionProvider.class.getClassLoader()));
            if (reflectionCache == null) {
                reflectionCache = new Reflections(new ConfigurationBuilder()
                        .setUrls(paths)
                        .filterInputsBy(
                                new FilterBuilder()
                                        .include(FilterBuilder.prefix("com.legacy.health.fhir"))
                                        .add((s) -> {
                                            return s.contains(".class");
                                        })));
            }
            Set<Class<?>> typesAnnotatedWith = reflectionCache.getTypesAnnotatedWith(cl);

            // Set<Class<?>> typesAnnotatedWith = new
            // Reflections("com.legacy.health.fhir").getTypesAnnotatedWith(cl);
            for (Class<?> c : typesAnnotatedWith) {
                if (p.isClassSatisfying(c)) {
                    extensionClasses.add(c);
                }
            }
            // extensionCache.put(cl,extensionClasses);
            return extensionClasses;
        });

        List<T> ret = new LinkedList<>();
        for (Class<?> c : extensions) {
            try {
                if (coreExtensions.contains(p.getExtClass().getCanonicalName())) {
                    ret.add((T) c.newInstance());
                } else {
                    if (getSwitchmanager().isActive(c.getCanonicalName(),
                            c.isAnnotationPresent(ActiveByDefault.class))) {
                        ret.add((T) c.newInstance());
                    }
                }
            } catch (InstantiationException e) {
                log.error("Error loading plugin", e);
            } catch (IllegalAccessException e) {
                log.error("Error loading plugin", e);
            }
        }

        return ret;
    }

}
