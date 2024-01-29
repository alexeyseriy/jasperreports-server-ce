import React, { forwardRef } from 'react';
import { List as MuiList, ListProps as MuiListProps } from '@material-ui/core';

export type ListProps = MuiListProps & {
    component?: React.ElementType<any>
};
export const List = forwardRef<HTMLUListElement, ListProps>(({ className, component = 'ul', ...rest }, ref) => {
    return (
        <MuiList
            ref={ref}
            component={component}
            className={`jr-mListbox ${className}  mui`}
            {...rest}
        />
    )
})
