package com.jaspersoft.jasperserver.api.common.configuration;

import org.springframework.util.StringUtils;

public class LoginLockoutConfig {

    private String allowedNumberOfLoginAttempts;
    private static String allowedNumberOfFailedLoginAttempts;
    private static final String ALLOWED_NUMBER_OF_LOGIN_ATTEMPTS_VALUE = "10";

    public String getAllowedNumberOfLoginAttempts() {
        return allowedNumberOfLoginAttempts;
    }

    public void setAllowedNumberOfLoginAttempts(String allowedNumberOfLoginAttempts) {
        this.allowedNumberOfLoginAttempts = allowedNumberOfLoginAttempts;
        LoginLockoutConfig.allowedNumberOfFailedLoginAttempts =
                StringUtils.isEmpty(allowedNumberOfLoginAttempts) ? LoginLockoutConfig.ALLOWED_NUMBER_OF_LOGIN_ATTEMPTS_VALUE : getAllowedNumberOfLoginAttempts();
    }

    public static String getNumberOfFailedLoginAttempts(){
        return StringUtils.isEmpty(LoginLockoutConfig.allowedNumberOfFailedLoginAttempts) ? LoginLockoutConfig.ALLOWED_NUMBER_OF_LOGIN_ATTEMPTS_VALUE
                : LoginLockoutConfig.allowedNumberOfFailedLoginAttempts;
    }
}
