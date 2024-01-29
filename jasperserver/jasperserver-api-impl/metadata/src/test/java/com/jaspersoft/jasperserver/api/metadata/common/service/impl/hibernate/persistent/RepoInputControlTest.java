package com.jaspersoft.jasperserver.api.metadata.common.service.impl.hibernate.persistent;


import com.jaspersoft.jasperserver.api.metadata.common.domain.InputControl;
import com.jaspersoft.jasperserver.api.metadata.common.domain.ResourceReference;
import com.jaspersoft.jasperserver.api.metadata.common.domain.client.InputControlImpl;
import com.jaspersoft.jasperserver.api.metadata.common.domain.client.QueryImpl;
import org.junit.Assert;
import org.junit.Test;

import static org.mockito.Mockito.*;

public class RepoInputControlTest {

    @Test
    public void copyFrom() {
        RepoInputControl repoInputControl = new RepoInputControl();
        InputControlImpl inputControl = new InputControlImpl();
        // test case should pass even though data source is empty
        inputControl.setInputControlType(InputControl.TYPE_SINGLE_SELECT_QUERY);
        repoInputControl.copyFrom(inputControl, null);
        Assert.assertEquals(inputControl.getInputControlType(), repoInputControl.getType());
    }
    @Test
    public void copyFrom2() {
        RepoInputControl repoInputControl = new RepoInputControl();
        InputControlImpl inputControl = mock(InputControlImpl.class);
        ResourceReference resourceReference = mock(ResourceReference.class);
        when(resourceReference.isLocal()).thenReturn(true);
        when(inputControl.getQuery()).thenReturn(resourceReference);
        QueryImpl queryImpl = mock(QueryImpl.class);
        when(resourceReference.getLocalResource()).thenReturn(queryImpl);
        ResourceReference dataSource = mock(ResourceReference.class);
        when(queryImpl.getDataSource()).thenReturn(dataSource);
        when(dataSource.isLocal()).thenReturn(false);
        when(dataSource.getReferenceURI()).thenReturn(null);
        // test case should pass even though data source is empty
        inputControl.setInputControlType(InputControl.TYPE_SINGLE_SELECT_QUERY);
        repoInputControl.copyFrom(inputControl, null);
        Assert.assertEquals(inputControl.getInputControlType(), repoInputControl.getType());
    }
}
