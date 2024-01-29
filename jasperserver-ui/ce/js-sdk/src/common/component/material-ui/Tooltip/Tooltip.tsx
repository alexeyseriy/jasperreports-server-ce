import React, { forwardRef } from 'react';
import { Tooltip as MuiTooltip, TooltipProps as MuiTooltipProps } from '@material-ui/core';

export const Tooltip = forwardRef<HTMLDivElement, MuiTooltipProps>(({
    ...rest
}, ref) => {
    return (
        <MuiTooltip
            ref={ref}
            {...rest}
        />
    )
})
