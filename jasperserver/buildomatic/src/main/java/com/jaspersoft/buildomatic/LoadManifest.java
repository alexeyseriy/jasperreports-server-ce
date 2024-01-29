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


import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.Properties;
import java.util.Vector;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.PropertyHelper;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.filters.util.ChainReaderHelper;
import org.apache.tools.ant.taskdefs.Property;
import org.apache.tools.ant.types.FilterChain;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;
import org.apache.tools.ant.types.Resource;
import org.apache.tools.ant.types.ResourceCollection;
import org.apache.tools.ant.types.resources.FileResource;
import org.apache.tools.ant.types.resources.JavaResource;
import org.apache.tools.ant.util.FileUtils;
import org.apache.tools.ant.util.ResourceUtils;

/**
 * Load a file's contents as Manifest properties.
 *
 * @ant.task category="utility"
 * @since Ant 1.9
 */
public class LoadManifest extends Task {

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

    /**
     * Prefix for loaded properties.
     */
    private String prefix = null;
    private boolean prefixValues = true;

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
     * Set the prefix to load these properties under.
     *
     * @param prefix to set
     */
    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    /**
     * Whether to apply the prefix when expanding properties on the
     * right hand side of a properties file as well.
     *
     * @param b boolean
     * @since Ant 1.8.2
     */
    public void setPrefixValues(boolean b) {
        prefixValues = b;
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
        Manifest mf = null;
        if (src.getName().endsWith(".jar")) {
            try {
                mf = new JarFile(((FileResource) src).getFile()).getManifest();
            } catch (IOException e) {
                throw new BuildException("Unable to load file: " + src.getName(), e, getLocation());
            }
        } else {
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
                    mf = new Manifest(new ByteArrayInputStream(text.getBytes()));
                }
            } catch (final IOException ioe) {
                throw new BuildException("Unable to load file: " + ioe, ioe, getLocation());
            } finally {
                FileUtils.close(bis);
                FileUtils.close(tis);
            }
        }
        if (mf != null) {
            PropertyHelper ph = PropertyHelper.getPropertyHelper(getProject());
            mf.getMainAttributes().forEach((k, value) -> {
                String propertyName;
                if (prefix != null) {
                    propertyName = prefix + k.toString();
                } else {
                    propertyName = k.toString();
                }
                ph.setNewProperty(propertyName.toLowerCase(), value);
            });
            mf.getEntries().forEach((name, section) -> {
                String sectionName = name.replaceAll("\\s", "-");

                section.forEach((k, value) -> {
                    String propertyName = MessageFormat.format("{0}{1}-{2}", prefix == null ? "" : prefix, sectionName, k.toString());
                    ph.setNewProperty(propertyName.toLowerCase(), value);
                });
            });
        }
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
}
