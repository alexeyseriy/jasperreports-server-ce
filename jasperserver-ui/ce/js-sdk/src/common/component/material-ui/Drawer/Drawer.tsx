import React, { forwardRef } from 'react';
import { Drawer as MuiDrawer, DrawerProps as MuiDrawerProps } from '@material-ui/core';

export const Drawer = forwardRef<HTMLDivElement, MuiDrawerProps>(({
    elevation = 6, open = false, className = '', ...rest
}, ref) => {
    return (
        <MuiDrawer
            ref={ref}
            className={`jr-mDrawer ${className} mui`}
            open={open}
            elevation={elevation}
            {...rest}
        />
    )
});
