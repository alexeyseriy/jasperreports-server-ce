import React, { forwardRef } from 'react';
import { ListItem as MuiListItem, ListItemProps as MuiListItemProps } from '@material-ui/core';

// @ts-ignore is used to fix refType because it is not supported in material ui v4
// https://mui.com/guides/migration-v4/ (Ref type specificity)
export const ListItem = forwardRef<HTMLLIElement, MuiListItemProps>(({ className, ...rest }, ref) => {
    return (
        <>
            {/*
             // @ts-ignore */}
            <MuiListItem ref={ref} className={`jr-mListbox-option ${className}  mui`} {...rest} />
        </>
    )
})
