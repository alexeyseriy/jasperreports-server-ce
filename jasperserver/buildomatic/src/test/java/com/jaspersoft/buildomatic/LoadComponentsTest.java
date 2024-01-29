package com.jaspersoft.buildomatic;

import static java.lang.System.lineSeparator;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.nio.file.Files.newInputStream;
import static org.apache.tools.ant.util.FileUtils.readFully;
import static org.apache.tools.ant.util.FileUtils.safeReadFully;
import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assume.assumeNoException;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.BuildFileRule;
import org.apache.tools.ant.MagicNames;
import org.apache.tools.ant.util.FileUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.MessageFormat;
import java.util.jar.Manifest;

/**
 * To run in the IDE set next vm options (path)
 * -Dbasedir=.
 */
public class LoadComponentsTest {
    public static final String ENABLED_IDX = "enabled.idx";
    public static final String DISABLED_IDX = "disabled.idx";
    public static final String TEST_RESOURCES = "src/test/resources/com/jaspersoft/build/load-components";
    @Rule
    public BuildFileRule buildRule = new BuildFileRule();

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    String tempDir;

    @Before
    public void setUp() {
        buildRule.configureProject("src/test/resources/com/jaspersoft/build/load-components.xml");
        buildRule.executeTarget("setUp");
        tempDir = buildRule.getProject().getProperty("temp.dir");
    }

    @After
    public void tearDown() {
        buildRule.executeTarget("cleanUp");
    }

    @Test
    public void shouldEnableAllComponents() throws IOException {
        // should get no output at all
        buildRule.executeTarget("enableAllComponents");

        assertIdxFiles("case1", ENABLED_IDX);
        assertIdxFiles("case1", DISABLED_IDX);
    }

    @Test
    public void shouldDisableAllComponents() throws IOException {
        // should get no output at all
        buildRule.executeTarget("disableAllComponents");

        assertIdxFiles("case2", ENABLED_IDX);
        assertIdxFiles("case2", DISABLED_IDX);

    }

    @Test
    public void shouldDisableAllConnectors() throws IOException {
        // should get no output at all
        buildRule.executeTarget("disableAllConnectors");

        assertIdxFiles("case3", ENABLED_IDX);
        assertIdxFiles("case3", DISABLED_IDX);
    }

    @Test
    public void shouldDisableAllObservability() throws IOException {
        // should get no output at all
        buildRule.executeTarget("disableAllObservability");

        assertIdxFiles("case4", ENABLED_IDX);
        assertIdxFiles("case4", DISABLED_IDX);

    }

    @Test
    public void shouldDisableSingleConnector() throws IOException {
        // should get no output at all
        buildRule.executeTarget("disableSingleConnector");

        assertIdxFiles("case5", ENABLED_IDX);
        assertIdxFiles("case5", DISABLED_IDX);

    }

    @Test
    public void shouldOverrideZipFromCustomPackage() throws IOException {
        // should get no output at all
        buildRule.executeTarget("overrideZipFromCustomPackage");

        assertIdxFiles("case6", ENABLED_IDX);
        assertIdxFiles("case6", DISABLED_IDX);
        assertManifestFiles("case6", "MANIFEST.MF");
    }

    @Test
    public void shouldLoadEnabledComponentPropsFromManifest() throws IOException {
        // should get no output at all
        buildRule.executeTarget("loadEnabledComponentPropsFromManifest");

        assertIdxFiles("case7", ENABLED_IDX);
        assertIdxFiles("case7", DISABLED_IDX);
        assertManifestFiles("case7", "MANIFEST.MF");
    }
    @Test
    public void shouldDisableComponentsFromManifest() throws IOException {
        // should get no output at all
        buildRule.executeTarget("disableComponentsFromManifest");

        assertIdxFiles("case8", ENABLED_IDX);
        assertIdxFiles("case8", DISABLED_IDX);
        assertManifestFiles("case8", "MANIFEST.MF");

    }

    @Test
    public void shouldDisableConnectorsFromManifest() throws IOException {
        // should get no output at all
        buildRule.executeTarget("disableConnectorsFromManifest");

        assertIdxFiles("case9", ENABLED_IDX);
        assertIdxFiles("case9", DISABLED_IDX);
        assertManifestFiles("case9", "MANIFEST.MF");
    }

    @Test
    public void shouldEnableObservabilityFromManifest() throws IOException {
        // should get no output at all
        buildRule.executeTarget("enableObservabilityFromManifest");

        assertIdxFiles("case10", ENABLED_IDX);
        assertIdxFiles("case10", DISABLED_IDX);
        assertManifestFiles("case10", "MANIFEST.MF");

    }

    @Test
    public void shouldTestSourceManifest() throws IOException {
        // should get no output at all
        buildRule.executeTarget("correctManifestForPropSource");

        assertIdxFiles("case12", ENABLED_IDX);
        assertIdxFiles("case12", DISABLED_IDX);
        assertManifestFiles("case12", "MANIFEST.MF");

    }
    @Test
    public void shouldUpgradeLib() throws IOException {
        // should get no output at all
        buildRule.executeTarget("upgradeLib");

        assertIdxFiles("case13", ENABLED_IDX);
        assertIdxFiles("case13", DISABLED_IDX);
        assertManifestFiles("case13", "MANIFEST.MF");

    }
    @Test
    public void shouldEnableSingleConnectorURL() throws IOException {

        buildRule.executeTarget("enableSingleConnectorURL");

        assertIdxFiles("case14", ENABLED_IDX);
        assertIdxFiles("case14", DISABLED_IDX);

    }
    @Test
    public void shouldRenameDownloadedJAR() throws IOException {

        buildRule.executeTarget("ShouldRenameDownladedJAR");

        assertIdxFiles("case15", ENABLED_IDX);
        assertIdxFiles("case15", DISABLED_IDX);

    }
    private void assertIdxFiles(String location, String idx) throws IOException {
        Path expectedIdx = Paths.get(TEST_RESOURCES, location, idx);
        Path generatedIdx = Paths.get(tempDir, idx);

        String actual = safeReadFully(new InputStreamReader(newInputStream(generatedIdx), UTF_8));
        assertEquals(safeReadFully(new InputStreamReader(newInputStream(expectedIdx), UTF_8))
                , actual);
    }

    private void assertManifestFiles(String location, String idx) throws IOException {
        Path expectedIdx = Paths.get(TEST_RESOURCES, location, idx);
        Path generatedIdx = Paths.get(tempDir, idx);
        Manifest smActual = null;
        Manifest smExpected = null;
        try {
            smActual = new Manifest(new FileInputStream(expectedIdx.toString()));
            smExpected = new Manifest(new FileInputStream(generatedIdx.toString()));
        } catch (IOException e) {
            e.printStackTrace();
        }
        assertEquals(smActual,smExpected);
    }

}
