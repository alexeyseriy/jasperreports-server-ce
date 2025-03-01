<%@ page contentType="text/html; charset=utf-8" %>
<%--
  ~ Copyright (C) 2005-2023. Cloud Software Group, Inc. All Rights Reserved.
  ~ http://www.jaspersoft.com.
  ~
  ~ Unless you have purchased a commercial license agreement from Jaspersoft,
  ~ the following license terms apply:
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU Affero General Public License as
  ~ published by the Free Software Foundation, either version 3 of the
  ~ License, or (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  ~ GNU Affero General Public License for more details.
  ~
  ~ You should have received a copy of the GNU Affero General Public License
  ~ along with this program. If not, see <http://www.gnu.org/licenses/>.
  --%>
<%@ taglib prefix="js" uri="/WEB-INF/jasperserver.tld" %>
<%@ page import="com.jaspersoft.jasperserver.api.security.SecurityConfiguration" %>

<c:if test="${!pageContext.request.requestedSessionIdValid and pageContext.request.method == 'GET'}">
<script type="text/javascript">
    <%--[18280] HTTP redirect can't be applied here because it adds jsessionid parameter --%>
    window.location.reload();
</script>
</c:if>


<script type="text/javascript">
    if (typeof Report === "undefined") {
        Report = {};
    }

    if (typeof Report._messages === "undefined") {
        Report._messages = {};
    }

    if (typeof ControlsBase === "undefined") {
        ControlsBase = {};
    }

    if (typeof ControlsBase._messages === "undefined") {
        ControlsBase._messages = {};
    }

    Report._messages["jasper.report.view.page.of"]  = '<spring:message code="jasper.report.view.page.of" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.save.missing.name"]  = '<spring:message code="jasper.report.view.save.missing.name" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.save.missing.folder"]  = '<spring:message code="jasper.report.view.save.missing.folder" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.saved"]  = '<spring:message code="jasper.report.view.report.saved" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.save.access.denied"]  = '<spring:message code="jasper.report.view.report.save.access.denied" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.save.unchanged"]  = '<spring:message code="jasper.report.view.report.save.unchanged" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.save.failed"]  = '<spring:message code="jasper.report.view.report.save.failed" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.canceled"]  = '<spring:message code="jasper.report.view.report.canceled" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.save.confirm.overwrite"]  = '<spring:message code="jasper.report.view.report.save.confirm.overwrite" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.confirmLeave"]  = '<spring:message code="jasper.report.view.confirmLeave" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.in.progress.confirm.leave"]  = '<spring:message code="jasper.report.view.in.progress.confirm.leave" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.export.in.progress.confirm.leave"]  = '<spring:message code="jasper.report.view.export.in.progress.confirm.leave" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.export.in.progress.confirm.continue"]  = '<spring:message code="jasper.report.view.export.in.progress.confirm.continue" javaScriptEscape="true"/>';
    Report._messages["jasper.report.view.report.save.destination.not.report"]  = '<spring:message code="jasper.report.view.report.save.destination.not.report" javaScriptEscape="true"/>';
	ControlsBase._messages["report.options.option.saved"] = '<spring:message code="report.options.option.saved" javaScriptEscape="true"/>';
	ControlsBase._messages["report.options.option.removed"] = '<spring:message code="report.options.option.removed" javaScriptEscape="true"/>';
	ControlsBase._messages["report.options.option.confirm.remove"] = '<spring:message code="report.options.option.confirm.remove" javaScriptEscape="true"/>';

    Report.chartTypeChangeErrorMessages = [
        '<spring:message code="ADH_1214_ICHARTS_NO_TIME_SERIES_DATA" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_COLUMN_LINE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_COLUMN_SPLINE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_STACKED_COLUMN_LINE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_STACKED_COLUMN_SPLINE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_LINE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_SPLINE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_MULTI_AXIS_COLUMN" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_SCATTER" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_BUBBLE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_DUAL_LEVEL_PIE" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_NON_OLAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_HEAT_MAP_OLAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TILE_MAP_NON_OLAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TILE_MAP_OLAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TIME_SERIES_HEAT_MAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_DUAL_MEASURE_TREE_MAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TREE_MAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_ONE_PARENT_TREE_MAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TILE_MAP_NON_OLAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_TILE_MAP_OLAP" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_SPEEDOMETER" javaScriptEscape="true"/>',
        '<spring:message code="ADH_1214_ICHARTS_NO_DATA_GAUGE" javaScriptEscape="true"/>'
    ];

    <js:out javaScriptEscape="true">
    Report.flowExecutionKey = '${flowExecutionKey}';
    Report.reportUnitURI = '${requestScope.reportUnit}'.replace(/^repo:/, "");
    Report.reportOptionsURI = '${requestScope.reportOptionsURI}'.replace(/^repo:/, "");;
    Report.reportLabel = '${reportUnitObject.label}';
    Report.reportDescription = '${reportUnitObject.description}';
    Report.reportForceControls = ${reportForceControls};
    Report.hasInputControls = ${hasInputControls};
    Report.isReportReadOnly = ${isReportReadOnly};
    Report.reportControlsLayout = ${reportControlsLayout};
    Report.icReorderEnabled = ${isIcReorderingEnabled};
    Report.organizationId = '${organizationId}';
    Report.publicFolderUri = '${publicFolderUri}';
    Report.reportParameterValues = JSON.parse('${reportParameterValues}');
    Report.inputControlValuesFromRequest = JSON.parse('${inputControlValuesFromRequest}');
    Report.allRequestParameters = JSON.parse('${allRequestParameters}');
    Report.parametersWithoutDefaultValues = JSON.parse('${parametersWithoutDefaultValues}');
    Report.tempFolderUri = '${tempFolderUri}';
    Report.hasInvisibleICValidationErrors = ${hasInvisibleICValidationErrors};
    Report.reportExecutionId = '${reportExecutionId}';
    Report.reportViewerTabsMaxCount = ${reportViewerTabsMaxCount};
    Report.reportViewerTabsLabelsMaxLength = ${reportViewerTabsLabelsMaxLength};
    </js:out>

    if (typeof __jrsConfigs__.reportViewer === "undefined") {
        __jrsConfigs__.reportViewer  = {};
    }

    // hack to prevent variables to be overwritten by other modules
    __jrsConfigs__.reportViewer.ReportSettings = Report;
    __jrsConfigs__.inputControlConstants = ControlsBase;

    <c:if test="${isPro}">
    __jrsConfigs__.isProVersion = true;
    </c:if>

    __jrsConfigs__.xssNonce = '${sessionScope.XSS_NONCE}';
    <%-- <%= SecurityConfiguration.getProperty("xss.soft.html.escape.tag.whitelist") %> does not work in Websphere --%>
    __jrsConfigs__.xssHtmlTagWhiteList='<% out.write(SecurityConfiguration.getProperty("xss.soft.html.escape.tag.whitelist")); %>';
    <%
    String xssAttribMap = SecurityConfiguration.getProperty("xss.soft.html.escape.attrib.map");
    if (xssAttribMap != null && xssAttribMap.trim().length() > 0)
        out.write("__jrsConfigs__.xssAttribSoftHtmlEscapeMap=" + xssAttribMap + ";");
    %>
</script>
