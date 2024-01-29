import React, { forwardRef } from 'react';
import {
    Tabs as MuiTabs, TabsProps as MuiTabsProps
} from '@material-ui/core';
import { TabSize, SizeToTabs } from '../types/TabsTypes';

type TabsProps = MuiTabsProps & {
    size?: TabSize
}

export const Tabs = forwardRef<HTMLButtonElement, TabsProps>(({
    className = '', size = 'medium', indicatorColor = 'primary', children, ...rest
}, ref) => {

    return (
        <MuiTabs
            ref={ref}
            className={`jr-mTabs ${className} ${SizeToTabs[size]} mui`}
            indicatorColor={indicatorColor}
            {...rest}
        >
            {children}
        </MuiTabs>
    )
})
