import React, { forwardRef } from 'react';
import { Toolbar as MuiToolbar, ToolbarProps as MuiToolbarProps } from '@material-ui/core';

export const Toolbar = forwardRef<HTMLDivElement, MuiToolbarProps>(({
    className = '', ...rest
}, ref) => {
    return (
        <MuiToolbar
            className={`jr-mToolbar ${className} mui`}
            ref={ref}
            {...rest}
        />
    )
})
