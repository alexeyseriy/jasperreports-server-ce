package com.jaspersoft.jasperserver.inputcontrols.cascade.handlers.converters;

import com.jaspersoft.jasperserver.api.engine.jasperreports.util.CalendarFormatProvider;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.doReturn;

@RunWith(MockitoJUnitRunner.class)
public class BaseChronoDataConverterTest {
    @InjectMocks
    private BaseChronoDataConverter baseChronoDataConverter = new BaseChronoDataConverter() {
    };

    @Mock
    private CalendarFormatProvider configurableCalendarFormatProvider;
    @Mock
    private CalendarFormatProvider isoCalendarFormatProvider;

    private static final DateFormat dateFormat = format("MM-dd-yyyy");
    private static final DateFormat timeFormat = format("HH:mm");
    private static final DateFormat datetimeFormat = format("yyyy-MM-dd HH:mm:ss");

    private static final DateFormat isoDateFormat = format("yyyy-MM-dd");
    private static final DateFormat isoTimeFormat = format("HH:mm:ss");
    private static final DateFormat isoDatetimeFormat = format("yyyy-MM-dd'T'HH:mm:ss");

    @Before
    public void setUp() {
        doReturn(timeFormat).when(configurableCalendarFormatProvider).getTimeFormat();
        doReturn(dateFormat).when(configurableCalendarFormatProvider).getDateFormat();
        doReturn(datetimeFormat).when(configurableCalendarFormatProvider).getDatetimeFormat();

        doReturn(isoTimeFormat).when(isoCalendarFormatProvider).getTimeFormat();
        doReturn(isoDateFormat).when(isoCalendarFormatProvider).getDateFormat();
        doReturn(isoDatetimeFormat).when(isoCalendarFormatProvider).getDatetimeFormat();
    }

    @Test
    public void getDateFormat_emptyData_dateFormat() {
        DateFormat result = baseChronoDataConverter.getDateFormat();
        assertEquals(dateFormat, result);
    }

    @Test
    public void getDateFormat_nonISOData_dateFormat() {
        DateFormat result = baseChronoDataConverter.getDateFormat("05-13-2022");
        assertEquals(dateFormat, result);
    }

    @Test
    public void getDateFormat_isoData_isoDateFormat() {
        DateFormat result = baseChronoDataConverter.getDateFormat("2022-05-13");
        assertEquals(isoDateFormat, result);
    }

    @Test
    public void getDateFormat_isoOnlyNonISOData_isoDateFormat() {
        baseChronoDataConverter.setOnlyUseISOFormat(true);
        DateFormat result = baseChronoDataConverter.getDateFormat("05-13-2022");
        assertEquals(isoDateFormat, result);
    }

    @Test
    public void getDateFormat_noConfigurableProviderNonISOData_isoDateFormat() {
        baseChronoDataConverter.setConfigurableCalendarFormatProvider(null);
        DateFormat result = baseChronoDataConverter.getDateFormat("05-13-2022");
        assertEquals(isoDateFormat, result);
    }

    @Test
    public void getTimeFormat_emptyData_timeFormat() {
        DateFormat result = baseChronoDataConverter.getTimeFormat();
        assertEquals(timeFormat, result);
    }

    @Test
    public void getTimeFormat_nonISOData_timeFormat() {
        DateFormat result = baseChronoDataConverter.getTimeFormat("11:11");
        assertEquals(timeFormat, result);
    }

    @Test
    public void getTimeFormat_isoData_timeFormat() {
        DateFormat result = baseChronoDataConverter.getTimeFormat("11:11:11");
        assertEquals(isoTimeFormat, result);
    }

    @Test
    public void getTimeFormat_isoOnlyNonISOData_isoTimeFormat() {
        baseChronoDataConverter.setOnlyUseISOFormat(true);
        DateFormat result = baseChronoDataConverter.getTimeFormat("11:11");
        assertEquals(isoTimeFormat, result);
    }

    @Test
    public void getTimeFormat_noConfigurableProviderNonISOData_isoTimeFormat() {
        baseChronoDataConverter.setConfigurableCalendarFormatProvider(null);
        DateFormat result = baseChronoDataConverter.getTimeFormat("11:11");
        assertEquals(isoTimeFormat, result);
    }

    @Test
    public void getDatetimeFormat_emptyData_datetimeFormat() {
        DateFormat result = baseChronoDataConverter.getDatetimeFormat();
        assertEquals(datetimeFormat, result);
    }

    @Test
    public void getDatetimeFormat_nonISOData_datetimeFormat() {
        DateFormat result = baseChronoDataConverter.getDatetimeFormat("2022-05-13 11:11:11");
        assertEquals(datetimeFormat, result);
    }

    @Test
    public void getDatetimeFormat_isoData_datetimeFormat() {
        DateFormat result = baseChronoDataConverter.getDatetimeFormat("2022-05-13T11:11:11");
        assertEquals(isoDatetimeFormat, result);
    }

    @Test
    public void getDatetimeFormat_isoOnlyNonISOData_isoDatetimeFormat() {
        baseChronoDataConverter.setOnlyUseISOFormat(true);
        DateFormat result = baseChronoDataConverter.getDatetimeFormat("2022-05-13__11:11:11");
        assertEquals(isoDatetimeFormat, result);
    }

    @Test
    public void getDatetimeFormat_noConfigurableProviderNonISOData_isoDatetimeFormat() {
        baseChronoDataConverter.setConfigurableCalendarFormatProvider(null);
        DateFormat result = baseChronoDataConverter.getDatetimeFormat("2022-05-13__11:11:11");
        assertEquals(isoDatetimeFormat, result);
    }

    private static DateFormat format(String format) {
        return new SimpleDateFormat(format);
    }

}