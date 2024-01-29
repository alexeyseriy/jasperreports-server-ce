import React, { FC } from 'react'
import { ClickAwayListener as MuiClickAwayListener, ClickAwayListenerProps } from '@material-ui/core';

export const ClickAwayListener: FC<ClickAwayListenerProps> = (props) => {
    const { onClickAway, ...rest } = props
    return (
        <MuiClickAwayListener
            onClickAway={onClickAway}
            {...rest}
        />
    )
}
