import React, { forwardRef } from 'react';
import MuiTableBody, { TableBodyProps as MuiTableBodyProps } from '@material-ui/core/TableBody';

export const TableBody = forwardRef<HTMLTableSectionElement, MuiTableBodyProps>(({
    ...rest
}, ref) => {
    return (
        <MuiTableBody
            ref={ref}
            {...rest}
        />
    )
})
