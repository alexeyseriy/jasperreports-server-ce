package com.jaspersoft.jasperserver.api.common.error.handling;

import org.springframework.security.authentication.BadCredentialsException;

/**
 * A specific exception we will throw in the case that a username is not provided or appears to be null.
 * While the message will remain the same, we can discern the difference in our logic.
 *
 * @see org.springframework.security.authentication.BadCredentialsException
 */
public class JSEmptyCredentialsException extends BadCredentialsException {
    public JSEmptyCredentialsException(String msg) {
        super(msg);
    }

    public JSEmptyCredentialsException(String msg, Throwable t) {
        super(msg, t);
    }
}