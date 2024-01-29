package com.jaspersoft.jasperserver.inputcontrols.cascade.cache;

import org.junit.Assert;
import org.junit.Test;

public class ControlLogicCacheManagerImplTest {

    ControlLogicCacheManagerImpl controlLogicCacheManager = new ControlLogicCacheManagerImpl();

    @Test
    public void getSessionKey() {
        Assert.assertNotNull(controlLogicCacheManager.getSessionCacheKey());
    }

}
