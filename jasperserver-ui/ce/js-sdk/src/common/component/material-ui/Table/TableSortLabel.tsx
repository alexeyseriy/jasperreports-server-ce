import MuiTableSortLabel, { TableSortLabelProps as MuiTableSortLabelProps } from '@material-ui/core/TableSortLabel';
import React, { forwardRef } from 'react';

export const TableSortLabel = forwardRef<HTMLElement, MuiTableSortLabelProps>(({
    ...rest
}, ref) => {
    return (
        <MuiTableSortLabel
            ref={ref}
            {...rest}
        />
    )
})
