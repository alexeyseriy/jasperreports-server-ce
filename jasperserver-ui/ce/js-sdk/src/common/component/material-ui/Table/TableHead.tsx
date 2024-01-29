import React, { forwardRef } from 'react';
import MuiTableHead, { TableHeadProps as MuiTableHeadProps } from '@material-ui/core/TableHead';

export const TableHead = forwardRef<HTMLTableSectionElement, MuiTableHeadProps>(({
    ...rest
}, ref) => {
    return (
        <MuiTableHead
            ref={ref}
            {...rest}
        />
    )
})
