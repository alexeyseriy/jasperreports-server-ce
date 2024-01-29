import React, { forwardRef } from 'react';
import {
    Button as MuiButton, ButtonProps as MuiButtonProps
} from '@material-ui/core';
import { ColorToClass, SizeToClass } from '../types/ButtonTypes';

export type ButtonProps = MuiButtonProps;
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    classes = {}, className = '', size = 'medium', color = 'secondary', ...rest
}, ref) => {

    const { label: labelClasses = '', ...restClasses } = classes;

    return (
        <MuiButton
            ref={ref}
            classes={{ label: `jr-mButton-label mui ${labelClasses}`, ...restClasses }}
            className={`jr-mButton ${SizeToClass[size]} ${ColorToClass[color]} mui ${className}`}
            disableElevation
            size={size}
            {...rest}
        />
    )
})
