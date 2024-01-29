import React, { forwardRef } from 'react';
import MuiTable, { TableProps as MuiTableProps } from '@material-ui/core/Table';

export const Table = forwardRef<HTMLTableElement, MuiTableProps>(({
    className = '', ...rest
}, ref) => {
    return (
        <MuiTable
            ref={ref}
            className={`jr-mTable ${className} mui`}
            {...rest}
        />
    )
})
