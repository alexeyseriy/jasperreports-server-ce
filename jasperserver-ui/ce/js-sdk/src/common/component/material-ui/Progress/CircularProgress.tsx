import React, { forwardRef } from 'react';
import { CircularProgress as MuiCircularProgress, CircularProgressProps } from '@material-ui/core';

export const CircularProgress = forwardRef<HTMLElement, CircularProgressProps>(({ variant = 'indeterminate', ...rest }, ref) => {
    return (
        <MuiCircularProgress
            ref={ref}
            variant={variant}
            {...rest}
        />
    )
})
