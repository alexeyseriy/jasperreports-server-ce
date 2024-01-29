import React, { forwardRef } from 'react';
import MuiTableRow, { TableRowProps as MuiTableRowProps } from '@material-ui/core/TableRow';

export type TableRowProps = MuiTableRowProps & {
    border?: boolean,
    headRow?: boolean
};
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({
    className = '', border = true, headRow = false, ...rest
}, ref) => {
    const borderClass = !border ? 'jr-mTable-rowNoborder' : '';
    const headRowClass = headRow ? 'jr-mTable-rowHeader' : '';
    return (
        <MuiTableRow
            ref={ref}
            className={`jr-mTable-row ${borderClass} ${headRowClass} ${className} mui`}
            {...rest}
        />
    )
})
