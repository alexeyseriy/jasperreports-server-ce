import React, { forwardRef } from 'react';
import { Badge as MuiBadge, BadgeProps } from '@material-ui/core';

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ className, ...rest }, ref) => {
    return (
        <MuiBadge
            ref={ref}
            className={`${className}`}
            {...rest}
        />
    )
})
