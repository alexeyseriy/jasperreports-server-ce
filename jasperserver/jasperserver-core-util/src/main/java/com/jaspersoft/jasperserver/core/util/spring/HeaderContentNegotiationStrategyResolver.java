package com.jaspersoft.jasperserver.core.util.spring;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.InvalidMediaTypeException;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.context.request.NativeWebRequest;

/**
 * This class checks the 'Content-Type' request header
 *
 * @author jsreemeg
 * @version $Id$
 */
public class HeaderContentNegotiationStrategyResolver implements ContentNegotiationStrategy {

    private String headerName;

    public HeaderContentNegotiationStrategyResolver(String headerContentType) {
        this.headerName = headerContentType;
    }

    @Override
    public List<MediaType> resolveMediaTypes(NativeWebRequest nativeWebRequest) throws HttpMediaTypeNotAcceptableException {
        String[] headerValueArray = nativeWebRequest.getHeaderValues(headerName);

        if (headerValueArray == null) {
            return MEDIA_TYPE_ALL_LIST;
        } else {
            List<String> headerValues = Arrays.asList(headerValueArray);

            try {
                List<MediaType> mediaTypes = MediaType.parseMediaTypes(headerValues);
                MediaType.sortBySpecificityAndQuality(mediaTypes);
                return !CollectionUtils.isEmpty(mediaTypes) ? mediaTypes : MEDIA_TYPE_ALL_LIST;
            } catch (InvalidMediaTypeException var5) {
                throw new HttpMediaTypeNotAcceptableException("Could not parse 'Content-type' header " + headerValues + ": " + var5.getMessage());
            }
        }
    }

}