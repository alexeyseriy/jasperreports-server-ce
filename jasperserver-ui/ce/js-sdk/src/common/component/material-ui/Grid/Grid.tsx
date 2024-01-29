import React, { forwardRef } from 'react';
import {
    Grid as MuiGrid, GridProps as MuiGridProps
} from '@material-ui/core';

export const Grid = forwardRef<HTMLDivElement, MuiGridProps>(({
    children, ...rest
}, ref) => {
    return (
        <MuiGrid
            ref={ref}
            {...rest}
        >
            {children}
        </MuiGrid>
    )
})
