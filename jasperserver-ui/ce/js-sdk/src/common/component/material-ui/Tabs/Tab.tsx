import React, { forwardRef } from 'react';
import {
    Tab as MuiTab, TabProps as MuiTabProps
} from '@material-ui/core';

export const Tab = forwardRef<HTMLDivElement, MuiTabProps>(({
    classes = {}, className = '', ...rest
}, ref) => {
    const { wrapper = '', ...restClasses } = classes;
    return (
        <MuiTab
            ref={ref}
            classes={{ wrapper: `jr-mTab-label ${wrapper} mui`, ...restClasses }}
            className={`jr-mTab ${className} mui`}
            {...rest}
        />
    )
})
