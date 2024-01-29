package com.jaspersoft.jasperserver.inputcontrols.cascade.handlers.converters;

import com.jaspersoft.jasperserver.api.engine.jasperreports.util.CalendarFormatProvider;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.text.DateFormat;
import java.util.regex.Pattern;

abstract public class BaseChronoDataConverter {
    private static final Pattern timePattern = Pattern.compile("\\d{2}:\\d{2}:\\d{2}");
    private static final Pattern datePattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
    private static final Pattern datetimePattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}");

    public boolean onlyUseISOFormat;

    @Autowired(required = false)
    @Qualifier("configurableCalendarFormatProvider")
    private CalendarFormatProvider configurableCalendarFormatProvider;

    @Autowired
    @Qualifier("isoCalendarFormatProvider")
    private CalendarFormatProvider calendarFormatProvider;

    public DateFormat getTimeFormat(String rawData) {
        return getProviderForRawData(rawData, timePattern).getTimeFormat();
    }

    public DateFormat getTimeFormat() {
        return getTimeFormat(null);
    }

    public DateFormat getDateFormat(String rawData) {
        return getProviderForRawData(rawData, datePattern).getDateFormat();
    }

    public DateFormat getDateFormat() {
        return getDateFormat(null);
    }

    public DateFormat getDatetimeFormat(String rawData) {
        return getProviderForRawData(rawData, datetimePattern).getDatetimeFormat();
    }

    public DateFormat getDatetimeFormat() {
        return getDatetimeFormat(null);
    }

    private CalendarFormatProvider getProviderForRawData(String rawData, Pattern pattern) {
        // Return ISO Calendar Provider if:
        // - other calendar provider is null
        // - specifically set to only use ISO format (required for report's hyperlink service)
        // - raw data is in ISO compliant format
        if (configurableCalendarFormatProvider == null
                || onlyUseISOFormat
                || !StringUtils.isEmpty(rawData) && pattern.matcher(rawData).find()) {
            return calendarFormatProvider;
        } else {
            return configurableCalendarFormatProvider;
        }
    }

    public void setOnlyUseISOFormat(boolean onlyUseISOFormat) {
        this.onlyUseISOFormat = onlyUseISOFormat;
    }

    public void setConfigurableCalendarFormatProvider(CalendarFormatProvider configurableCalendarFormatProvider) {
        this.configurableCalendarFormatProvider = configurableCalendarFormatProvider;
    }

    public void setCalendarFormatProvider(CalendarFormatProvider calendarFormatProvider) {
        this.calendarFormatProvider = calendarFormatProvider;
    }
}
