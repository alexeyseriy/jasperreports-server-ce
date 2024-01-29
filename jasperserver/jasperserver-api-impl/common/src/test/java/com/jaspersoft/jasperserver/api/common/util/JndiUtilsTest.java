package com.jaspersoft.jasperserver.api.common.util;

import com.jaspersoft.jasperserver.api.common.util.rd.DateRangeFactory;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.mockito.junit.MockitoJUnitRunner;

import javax.naming.InvalidNameException;

import static org.junit.Assert.assertEquals;
public class JndiUtilsTest {

    @Test(expected = InvalidNameException.class)
    public void ensureServiceNameRestricted() throws InvalidNameException {
        JndiUtils.validateName("ldap://123.123.56.122:1389/users");
    }

    @Test
    public void ensureServiceNameIsOK() throws InvalidNameException {
        assertEquals("jdbc/foodmart", JndiUtils.validateName("jdbc/foodmart"));
    }

    @Test
    public void ensureServiceNameCanHaveJavaContext() throws InvalidNameException {
        assertEquals("java:comp/env/jdbc/foodmart", JndiUtils.validateName("java:comp/env/jdbc/foodmart"));
    }

}