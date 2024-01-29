import React, { forwardRef } from 'react';
import { Popover as MuiPopover, PopoverProps as MuiPopoverProps } from '@material-ui/core';

export type PopoverProps = MuiPopoverProps;
export const Popover = forwardRef<unknown, PopoverProps>(({ ...rest }, ref) => {
    return (
        <MuiPopover
            ref={ref}
            {...rest}
        />
    )
})
