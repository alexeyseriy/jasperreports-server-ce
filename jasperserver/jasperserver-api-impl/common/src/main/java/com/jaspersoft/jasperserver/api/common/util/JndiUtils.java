package com.jaspersoft.jasperserver.api.common.util;

import javax.naming.CompositeName;
import javax.naming.InvalidNameException;
import java.util.List;
import java.util.Objects;
import java.util.stream.IntStream;

public class JndiUtils {
    public static String validateName(String value) throws InvalidNameException {
        CompositeName name = new CompositeName(Objects.requireNonNull(value));

        if (IntStream.range(0, name.size())
                .mapToObj(name::get)
                .anyMatch(part -> part.endsWith(":") && !part.equalsIgnoreCase("java:"))) {
            throw new InvalidNameException();
        }
        return value;
    }

}
