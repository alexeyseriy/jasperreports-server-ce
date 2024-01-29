import React, { forwardRef } from 'react';
import MuiCollapse, { CollapseProps as MuiCollapseProps } from '@material-ui/core/Collapse/Collapse';

export const Collapse = forwardRef<HTMLElement, MuiCollapseProps>(({
    ...rest
}, ref) => {
    return (
        <MuiCollapse
            ref={ref}
            {...rest}
        />
    )
})
