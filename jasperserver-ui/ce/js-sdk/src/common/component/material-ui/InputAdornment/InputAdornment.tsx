import React, { forwardRef } from 'react';
import { InputAdornment as MuiInputAdornment, InputAdornmentProps as MuiInputAdornmentProps } from '@material-ui/core';

export const InputAdornment = forwardRef<HTMLDivElement, MuiInputAdornmentProps>(({
    className = '', ...rest
}, ref) => {
    return (
        <MuiInputAdornment
            ref={ref}
            className={`${className} mui`}
            {...rest}
        />
    )
})
