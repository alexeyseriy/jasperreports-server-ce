import React, { forwardRef } from 'react';
import MuiTableCell, { TableCellProps as MuiTableCellProps } from '@material-ui/core/TableCell';

export type TableCellProps = MuiTableCellProps & {
    isActionCell?: boolean,
    isCellAttribute?: boolean,
    isCellValue?: boolean
}
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({
    className = '', isActionCell = false, isCellAttribute = false, isCellValue = false, ...rest
}, ref) => {
    const actionClass = isActionCell ? 'jr-mTable-cellAction' : '';
    const attributeClass = isCellAttribute ? 'jr-mTable-cellAttribute' : '';
    const valueclass = isCellValue ? 'jr-mTable-cellValue' : '';

    return (
        <MuiTableCell
            ref={ref}
            className={`jr-mTable-cell ${actionClass} ${attributeClass} ${valueclass} ${className} mui`}
            {...rest}
        />
    )
})
