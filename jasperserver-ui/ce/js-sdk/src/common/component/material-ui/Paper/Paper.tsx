import React, { forwardRef } from 'react';
import MuiPaper, { PaperProps as MuiPaperProps } from '@material-ui/core/Paper';

export type PaperProps = MuiPaperProps;

export const Paper = forwardRef<HTMLElement, PaperProps>(({
    ...rest
}, ref) => {
    return (
        <MuiPaper
            ref={ref}
            {...rest}
        />
    )
})
