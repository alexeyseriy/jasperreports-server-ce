import React, { forwardRef } from 'react';
import {
    Card as MuiCard, CardProps as MuiCardProps
} from '@material-ui/core';

type CardProps = MuiCardProps

export const Cards = forwardRef<HTMLDivElement, CardProps>(({
    variant = 'elevation', className: cardClassname = '', elevation = 2, ...rest
}, ref) => {

    return (
        <MuiCard ref={ref} className={`jr-mCard  ${cardClassname} mui`} variant={variant} elevation={elevation} {...rest} />
    )
})
