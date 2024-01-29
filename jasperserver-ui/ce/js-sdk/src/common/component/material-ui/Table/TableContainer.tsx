import React, { forwardRef } from 'react';
import MuiTableContainer, { TableContainerProps as MuiTableContainerProps } from '@material-ui/core/TableContainer';

export const TableContainer = forwardRef<HTMLTableElement, MuiTableContainerProps>(({
    ...rest
}, ref) => {
    return (
        <MuiTableContainer
            ref={ref}
            {...rest}
        />
    )
})
