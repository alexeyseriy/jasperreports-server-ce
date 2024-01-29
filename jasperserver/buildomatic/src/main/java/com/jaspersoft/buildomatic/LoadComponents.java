/*
 * Copyright (C) 2005 - 2022 TIBCO Software Inc. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft,
 * the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package com.jaspersoft.buildomatic;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.jar.Attributes;
import java.util.jar.Manifest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.PropertyHelper;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.filters.util.ChainReaderHelper;
import org.apache.tools.ant.taskdefs.Get;
import org.apache.tools.ant.taskdefs.optional.PropertyFile;
import org.apache.tools.ant.types.FilterChain;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;
import org.apache.tools.ant.types.Resource;
import org.apache.tools.ant.types.ResourceCollection;
import org.apache.tools.ant.types.resources.FileResource;
import org.apache.tools.ant.types.resources.JavaResource;
import org.apache.tools.ant.util.FileUtils;

import static com.jaspersoft.buildomatic.LoadComponents.ComponentProp.ARTIFACTS;
import static com.jaspersoft.buildomatic.LoadComponents.ComponentProp.ENABLED;
import static com.jaspersoft.buildomatic.LoadComponents.ComponentProp.URL;
import static java.lang.System.lineSeparator;
import static java.nio.file.Files.copy;
import static java.nio.file.Paths.*;
import static java.text.MessageFormat.format;
import static org.apache.commons.lang3.StringUtils.isNoneBlank;

/**
 * Load a file's contents as Ant properties.
 *
 * @ant.task category="utility"
 * @since Ant 1.5
 */
public class LoadComponents extends Task {

    public static final String COMPONENTS_CATEGORIES = "Components-Categories";
    public static final String COMPONENTS_ENABLED = "components.enabled";
    public static final String MANIFEST_MF = "MANIFEST.MF";
    public static final Pattern CATEGORY_PATTERN = Pattern.compile("components\\.(.*)\\.enabled");
    public static final String COMPONENTS = "components";
    /**
     * Source resource.
     */
    private Resource src = null;

    /**
     * Holds filterchains
     */
    private final Vector<FilterChain> filterChains = new Vector<FilterChain>();

    /**
     * Encoding to use for input; defaults to the platform's default encoding.
     */
    private String encoding = null;

    private String enableIndex = null;
    private String disableIndex = null;
    private String target = null;

    private String destManifest = null;

    private String filePath = null;
    private String prefix = null;

    private String property = null;

    public String getEnableIndex() {
        return enableIndex;
    }

    public void setEnableIndex(String enableIndex) {
        this.enableIndex = enableIndex;
    }

    public String getDisableIndex() {
        return disableIndex;
    }

    public void setDisableIndex(String disableIndex) {
        this.disableIndex = disableIndex;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getDestManifest() {
        return destManifest;
    }

    public void setDestManifest(String destManifest) {
        this.destManifest = destManifest;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getProperty() {
        return property;
    }

    public void setProperty(String property) {
        this.property = property;
    }

    /**
     * Set the file to load.
     *
     * @param srcFile The new SrcFile value
     */
    public final void setSrcFile(final File srcFile) {
        addConfigured(new FileResource(srcFile));
    }

    /**
     * Set the resource name of a property file to load.
     *
     * @param resource resource on classpath
     */
    public void setResource(String resource) {
        getRequiredJavaResource().setName(resource);
    }

    /**
     * Encoding to use for input, defaults to the platform's default
     * encoding. <p>
     * <p>
     * For a list of possible values see
     * <a href="http://java.sun.com/j2se/1.5.0/docs/guide/intl/encoding.doc.html">
     * http://java.sun.com/j2se/1.5.0/docs/guide/intl/encoding.doc.html
     * </a>.</p>
     *
     * @param encoding The new Encoding value
     */
    public final void setEncoding(final String encoding) {
        this.encoding = encoding;
    }

    /**
     * Set the classpath to use when looking up a resource.
     *
     * @param classpath to add to any existing classpath
     */
    public void setClasspath(Path classpath) {
        getRequiredJavaResource().setClasspath(classpath);
    }

    /**
     * Add a classpath to use when looking up a resource.
     *
     * @return The classpath to be configured
     */
    public Path createClasspath() {
        return getRequiredJavaResource().createClasspath();
    }

    /**
     * Set the classpath to use when looking up a resource,
     * given as reference to a &lt;path&gt; defined elsewhere
     *
     * @param r The reference value
     */
    public void setClasspathRef(Reference r) {
        getRequiredJavaResource().setClasspathRef(r);
    }

    /**
     * get the classpath used by this <code>LoadProperties</code>.
     *
     * @return The classpath
     */
    public Path getClasspath() {
        return getRequiredJavaResource().getClasspath();
    }

    /**
     * load Ant properties from the source file or resource
     *
     * @throws BuildException if something goes wrong with the build
     */
    public final void execute() throws BuildException {
        //validation
        if (src == null) {
            throw new BuildException("A source resource is required.");
        }
        if (!src.isExists()) {
            if (src instanceof JavaResource) {
                // dreaded backwards compatibility
                log("Unable to find resource " + src, Project.MSG_WARN);
                return;
            }
            throw new BuildException("Source resource does not exist: " + src);
        }
        BufferedInputStream bis = null;
        Reader instream = null;
        ByteArrayInputStream tis = null;

        try {
            bis = new BufferedInputStream(src.getInputStream());
            if (encoding == null) {
                instream = new InputStreamReader(bis);
            } else {
                instream = new InputStreamReader(bis, encoding);
            }
            ChainReaderHelper crh = new ChainReaderHelper();
            crh.setPrimaryReader(instream);
            crh.setFilterChains(filterChains);
            crh.setProject(getProject());
            instream = crh.getAssembledReader();

            String text = crh.readFully(instream);

            if (text != null && text.length() != 0) {
                if (!text.endsWith("\n")) {
                    text = text + "\n";
                }

                // these are shared between all targets and tasks during the run
                PropertyHelper globalProps = PropertyHelper.getPropertyHelper(getProject());

                // old version of the connectors, used for an upgrade of a lib
                Set<Component> deprecated = new HashSet<>();

                // This is critical to reproduce correct MANIFEST.MF
                // Assuming we call this task after every other source of component information has been loaded
                // We also expect it to be called the lastest
                // We expect the source would be the MANIFEST.MF from the target deployment/package
                // Otherwise use `destManifest` to specify correct one but properties are not going be taken into the account
                final Manifest sourceManifest;

                if (src.getName().endsWith(".MF")) {
                    sourceManifest = new Manifest(new ByteArrayInputStream(text.getBytes()));

                    getComponentStream(sourceManifest)
                            .forEach(component -> {
                                if (globalProps.getProperty(component.getArtifactsProperty()) != null) {
                                    deprecated.add(component);
                                }
                                // Storing to ant's shared prop map so that we don't have to worry about the resolution
                                // exploiting the fact that property can't be overridden
                                globalProps.setNewProperty(component.getEnabledProperty(), component.enabled);
                                globalProps.setNewProperty(component.getArtifactsProperty(), component.getArtifactsPropertyValue());
                            });
                } else {
                    if (getDestManifest() != null) {
                        sourceManifest = new Manifest(Files.newInputStream(get(getDestManifest())));
                        getComponentStream(sourceManifest)
                                .filter(component -> globalProps.getProperty(component.getArtifactsProperty()) != null)
                                .forEach(deprecated::add);
                    } else sourceManifest = null;

                    Properties properties = new Properties();

                    tis = new ByteArrayInputStream(text.getBytes(StandardCharsets.ISO_8859_1));
                    properties.load(tis);
                    properties.forEach((k, v) -> {
                        String propertyName = String.valueOf(k);
                        // TODO add support for prefixes (sometime in the future)
                        // if (prefix != null) {
                        //     propertyName = prefix + propertyName;
                        // }`
                        globalProps.setNewProperty(propertyName, v);
                    });
                }

                boolean componentsEnabled = Optional.ofNullable(globalProps.getProperty(COMPONENTS_ENABLED))
                        .map(String::valueOf)
                        .map(Boolean::parseBoolean)
                        .orElse(true); // default to true, assuming if there's a zip or folder  with components

                final Map<String, Category> categories = new HashMap<>();
                final Map<String, String> categoryManifestNames = new HashMap<>();
                globalProps.getProperties().forEach((key, value) -> {
                    Matcher matcher = CATEGORY_PATTERN.matcher(key);
                    if (matcher.matches()) {
                        Category category = new Category(matcher.group(1), Boolean.parseBoolean(value.toString()));
                        category.folderExtension = Optional.ofNullable(
                                        globalProps.getProperty(format("components.{0}.{1}", category.name, Category.FOLDER_EXTENSION)))
                                .map(Object::toString)
                                .orElseGet(() -> category.name.endsWith("s") ? category.name.substring(0, category.name.length() - 1) : category.name);


                        categories.put(category.name, category);
                        categoryManifestNames.put(category.name, category.getManifestName());
                    }
                });

                Map<String, Component> components = new LinkedHashMap<>();
                globalProps.getProperties().forEach((property, value) -> {
                    categories.forEach((cName, category) -> {
                        Matcher matcher = category.componentPattern.matcher(property);
                        if (matcher.matches()) {
                            Component newComponent = Component.fromProperty(category, property, value);
                            components
                                    .merge(newComponent.toString(), newComponent, (prev, cur) -> prev.update(property, cur));
                        }
                    });
                });

                Map<Boolean, List<Component>> finalComponents = components.values().stream()
                        .map(component ->
                                // this if where we decide if this component should be enabled
                                        isEnabledSet(componentsEnabled,component)
                                )
                        // sorting to be able to help with testing
                        .sorted(Comparator.comparing(
                                        Component::getCategory, Comparator.comparing(c -> c.name))
                                .thenComparing(Component::toString))
                        .collect(Collectors.partitioningBy(Component::isEnabled));

                globalProps.setNewProperty(getProperty(), components.keySet()); // this is to share info about components between targets, if need it later

                Manifest manifest = new Manifest();
                if (sourceManifest != null) {
                    // copy all main/top attributes
                    manifest.getMainAttributes().putAll(sourceManifest.getMainAttributes());
                    // add all sections that are not categories we care about
                    sourceManifest.getEntries().entrySet()
                            .stream()
                            .filter(o -> !categoryManifestNames.containsValue(o.getKey()))
                            .forEach(section -> manifest.getEntries().put(section.getKey(), section.getValue()));
                }

                // clear all enabled components, kep the old versions to mark for removal from the war
                deprecated.removeAll(finalComponents.get(true));
                finalComponents.get(false).addAll(deprecated);

                // modifying our helper attribute to identify the sections in the manifest we use in this feature
                manifest.getMainAttributes().putValue(COMPONENTS_CATEGORIES, categories.values().stream()
                        .map(Category::getManifestName)
                        .collect(Collectors.joining(", ")));

                try (FileWriter disabledIdx =
                             new FileWriter(get(getTarget(), getDisableIndex()).toFile(), false)) {

                    List<Component> disabledComponents = finalComponents.get(false);
                    try {
                        disabledIdx.write(disabledComponents.stream()
                                .distinct()
                                .flatMap(component -> Arrays.stream(component.artifacts))
                                .map(artifact -> format("WEB-INF/lib/{0}{1}", artifact, lineSeparator()))
                                .collect(Collectors.joining()));

                        categories.values().forEach(c -> {
                            manifest.getEntries().remove(c.getManifestName());
                        });
                    } catch (IOException e) {
                        throw new BuildException("Unable to write disabled index file: " + e.getMessage(), e, getLocation());
                    }
                }
                for (Component component : finalComponents.get(true)) {
                    if (component.url.length() > 0) {
                        URL uri = new URL(component.url);
                        try {
                            File compPtah = get(getTarget(), COMPONENTS).toFile();
                            if (!compPtah.exists()) {
                                compPtah.mkdir();
                                get(compPtah.toString(), "META-INF").toFile().mkdir();

                            }
                            String jarDirFolder = String.join("-", component.name, component.category.folderExtension);
                            File dest = get(compPtah.toString(), jarDirFolder).toFile();
                            dest.mkdir();
                            get(dest.toString(), "META-INF").toFile().mkdir();

                            Get taskGet = new Get();
                            taskGet.setSrc(uri);
                            taskGet.setDest(get(dest.toString(), component.artifacts[0]).toFile());
                            taskGet.bindToOwner(this);
                            taskGet.execute();
                            prepareComponent(component, compPtah, "components");
                            prepareComponent(component, dest, "connectors");


                        } catch (Exception e) {
                            log("Unable to download JAR" + e.getMessage());
                        }
                    }
                }
                try (FileWriter enabledIdx = new FileWriter(get(getTarget(), getEnableIndex()).toFile(), false);
                     OutputStream manifestFile = Files.newOutputStream(get(getTarget(), MANIFEST_MF))) {

                    for (Component component : finalComponents.get(true)) {
                        for (String artifact : component.artifacts) {
                            try {
                                enabledIdx.write(format("{0}-{1}/{2}{3}"
                                        , component.name, component.category.folderExtension, artifact, lineSeparator()));

                                manifest.getEntries()
                                        .computeIfAbsent(component.category.getManifestName(), (k) -> new Attributes())
                                        .putValue(component.getArtifactsAttribute(), component.getArtifactsAttributeValue());

                            } catch (IOException e) {
                                throw new BuildException("Unable to write enabled index file: " + e.getMessage(), e, getLocation());
                            }
                        }
                    }
                    manifest.write(manifestFile);
                    manifestFile.flush();
                }

            }
        } catch (final IOException ioe) {
            throw new BuildException("Unable to load file: " + ioe, ioe, getLocation());
        } finally {
            FileUtils.close(bis);
            FileUtils.close(tis);
        }
    }

    private static Component isEnabledSet(boolean componentsEnabled, Component component) {
        if (!component.enableIsDefined) {
            if (isNoneBlank(component.url) || Arrays.stream(component.artifacts).allMatch(StringUtils::isNoneBlank))
                component.setEnabled(true);
        }
        if (Arrays.stream(component.artifacts).allMatch(String::isEmpty) && isNoneBlank(component.url) ) {
            URL uri = null;
            try {
                uri = new URL(component.url);
                if(component.artifacts.length == 0){
                    component.artifacts = new String[1];
                }
                component.artifacts[0] = FilenameUtils.getName(uri.getPath());
            } catch (MalformedURLException e) {
                throw new RuntimeException(e);
            }
        }
        component.setEnabled(componentsEnabled && component.category.enabled && component.enabled);
        return component;
    }
    private  void prepareComponent(Component component,File ptah,String prop) {
        PropertyFile pf = new PropertyFile();
        pf.setFile(get(ptah.toString(), "META-INF", String.join(".", prop, "properties")).toFile());
        pf.setProject(getProject());
        pf.setComment("Custom URL Enabled Components");

        PropertyFile.Entry flag = pf.createEntry();
        flag.setKey(format("{0}.{1}.{2}", component.category.name, component.name, "enabled"));
        flag.setValue("true");

        PropertyFile.Entry artifact = pf.createEntry();
        artifact.setKey(format("{0}.{1}.{2}", component.category.name, component.name, "artifacts"));
        artifact.setValue(component.artifacts[0]);

        PropertyFile.Entry url = pf.createEntry();
        url.setKey(format("{0}.{1}.{2}", component.category.name, component.name, "url"));
        url.setValue(component.url);

        pf.execute();
    }
    private static Stream<Component> getComponentStream(Manifest sourceManifest) {
        Attributes mainAttributes = sourceManifest.getMainAttributes();

        return Optional.ofNullable(mainAttributes.getValue(COMPONENTS_CATEGORIES))
                .map(categories -> Pattern.compile(",")
                        .splitAsStream(categories))
                .orElseGet(Stream::empty)
                .map(String::trim)
                .flatMap(section -> Optional.ofNullable(sourceManifest.getAttributes(section))
                        .orElseGet(Attributes::new)
                        .entrySet()
                        .stream()
                        .map(attribute -> Pair.of(section, attribute)))
                .map(entry -> Component
                        .fromManifestAttribute(new Category(entry.getLeft()), entry.getRight()));
    }

    /**
     * Adds a FilterChain.
     *
     * @param filter the filter to add
     */
    public final void addFilterChain(FilterChain filter) {
        filterChains.addElement(filter);
    }

    /**
     * Set the source resource.
     *
     * @param a the resource to load as a single element Resource collection.
     * @since Ant 1.7
     */
    public synchronized void addConfigured(ResourceCollection a) {
        if (src != null) {
            throw new BuildException("only a single source is supported");
        }
        if (a.size() != 1) {
            throw new BuildException(
                    "only single-element resource collections are supported");
        }
        src = a.iterator().next();
    }

    private synchronized JavaResource getRequiredJavaResource() {
        if (src == null) {
            src = new JavaResource();
            src.setProject(getProject());
        } else if (!(src instanceof JavaResource)) {
            throw new BuildException("expected a java resource as source");
        }
        return (JavaResource) src;
    }

    enum ComponentProp {
        ENABLED, ARTIFACTS,URL,
    }

    enum PropSource {
        PACKAGE, CUSTOM_DIR, MANIFEST
    }

    static class Component {
        PropSource source;
        Category category;
        String name;
        boolean enabled;
        String[] artifacts;
        String url;
        boolean enableIsDefined = true;
        boolean artifactsIsDefined;
        final static Component UNKNOWN = new Component(new Category("unknown"), "unknown");

        private static String enabledPropPrefix = "." + ENABLED.name().toLowerCase();
        private static String artifactsPropPrefix = "." + ARTIFACTS.name().toLowerCase();
        private static String urlPropPrefix = "."+ URL.name().toLowerCase();
        private static String enabledAttrPrefix = "-" + StringUtils.capitalize(ENABLED.name().toLowerCase());
        private static String artifactsAttrPrefix = "-" + StringUtils.capitalize(ARTIFACTS.name().toLowerCase());
        private static String urlAttrPrefix = "-" + StringUtils.capitalize(URL.name().toLowerCase());
        public Component(Category category, String name) {
            this.category = category;
            this.name = name;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Component component = (Component) o;
            return Objects.equals(category, component.category) && Objects.equals(name, component.name) && Arrays.equals(artifacts, component.artifacts);
        }

        @Override
        public int hashCode() {
            int result = Objects.hash(category, name);
            result = 31 * result + Arrays.hashCode(artifacts);
            return result;
        }

        @Override
        public String toString() {
            return category.name + "." + name;
        }

        static Component fromProperty(Category category, String key, Object value) {
            String property = Objects.requireNonNull(key);
            String propertyValue = Optional.ofNullable(value).map(Object::toString).orElse("");

            Component component = UNKNOWN;

            if (property.endsWith(enabledPropPrefix)) {
                String[] name = property
                        .substring(0, property.length() - enabledPropPrefix.length())
                        .toLowerCase()
                        .split("\\.");

                component = new Component(category, name[1]);
                component.enabled = Boolean.parseBoolean(propertyValue);
                component.artifacts = new String[0];
                component.enableIsDefined =  !propertyValue.equals("");
                component.url = "";
            } else if (property.endsWith(artifactsPropPrefix)) {
                String[] name = property
                        .substring(0, property.length() - artifactsAttrPrefix.length())
                        .toLowerCase()
                        .split("\\.");

                component = new Component(category, name[1]);
                component.artifacts = Arrays
                        .stream(propertyValue.split(" "))
                        .map(String::trim)
                        .toArray(String[]::new);
                component.enabled = component.artifacts.length > 0;
                component.url = "";
            }
            else if(property.endsWith(urlPropPrefix)){
                String[] name = property
                        .substring(0, property.length() - urlAttrPrefix.length())
                        .toLowerCase()
                        .split("\\.");

                component = new Component(category, name[1]);
                component.artifacts = new String[0];
                component.url = propertyValue;
            }
            return component;
        }

        static Component fromManifestAttribute(Category category, Map.Entry<Object, Object> attr) {
            return fromManifestAttribute(category, attr.getKey(), attr.getValue());
        }

        static Component fromManifestAttribute(Category category, Object name, Object value) {
            String attr = Objects.requireNonNull(name).toString();
            String attrValue = Optional.ofNullable(value).map(Object::toString).orElse("");

            Component component = UNKNOWN;

            if (attr.endsWith(enabledAttrPrefix)) {
                component = new Component(category, attr.substring(0, attr.length() - enabledPropPrefix.length()).toLowerCase());
                component.enabled = Boolean.parseBoolean(attrValue);
                component.artifacts = new String[0];

            } else if (attr.endsWith(artifactsAttrPrefix)) {
                component = new Component(category, attr.substring(0, attr.length() - artifactsPropPrefix.length()).toLowerCase());
                component.artifacts = Arrays
                        .stream(attrValue.split(" "))
                        .map(String::trim)
                        .toArray(String[]::new);
                component.enabled = component.artifacts.length > 0;
            }

            return component;
        }

        public Category getCategory() {
            return category;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public Component setEnabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public String getEnabledProperty() {
            return this.toString() + enabledPropPrefix;

        }

        public String getArtifactsProperty() {
            return this.toString() + artifactsPropPrefix;
        }

        public String getArtifactsPropertyValue() {
            return String.join(" ", artifacts);
        }

        public String getArtifactsAttribute() {
            return Arrays.stream(name.split("-")).map(StringUtils::capitalize).collect(Collectors.joining("-")) + artifactsAttrPrefix;
        }

        public String getArtifactsAttributeValue() {
            return String.join(" ", artifacts);
        }

        public Component update(String propertyKey, Component component) {
            String property = Objects.requireNonNull(propertyKey);

            if (property.endsWith(enabledPropPrefix)) {
                enabled = component.enabled;
                enableIsDefined = component.enableIsDefined;

            } else if (property.endsWith(artifactsPropPrefix)) {
                artifacts = component.artifacts;
            }
            else if (property.endsWith(urlPropPrefix)) {
                url = component.url;
            }

            return this;
        }

    }

    static class Category {
        public static final String FOLDER_EXTENSION = "folder-extension";
        private String name;
        private String manifestName;
        boolean enabled;
        Pattern componentPattern;
        String folderExtension;

        public Category(String name) {
            this.name = name.replaceAll("\\s", "-").toLowerCase();
            this.componentPattern = Pattern.compile(name + "\\.(.*)\\.(?:enabled|artifacts|url)");
        }

        public Category(String name, boolean enabled) {
            this(name);
            this.enabled = enabled;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public String getManifestName() {
            if (manifestName == null)
                this.manifestName = Arrays.stream(name.split("\\s")).map(StringUtils::capitalize).collect(Collectors.joining(" "));
            return manifestName;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Category category = (Category) o;
            return Objects.equals(name, category.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(name);
        }
    }

}