import React, { forwardRef } from 'react';
import { ListItemText as MuiListItemText, ListItemTextProps as MuiListItemTextProps } from '@material-ui/core';

export const ListItemText = forwardRef<HTMLDivElement, MuiListItemTextProps>(({ className, ...rest }, ref) => {
    return (
        <MuiListItemText
            ref={ref}
            className={`jr-mListbox-option-label ${className}  mui`}
            {...rest}
        />
    )
})
