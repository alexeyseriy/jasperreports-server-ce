import React, { forwardRef, HTMLAttributes } from 'react';
import {
    FormControlLabel, FormControlLabelProps, Switch as MuiSwitch, SwitchProps as MuiSwitchProps
} from '@material-ui/core';
import {
    INLINE_CLASS, NO_LABEL_CLASS, InputSize, SizeToClass
} from '../types/InputTypes';

export interface SwitchProps extends Omit<FormControlLabelProps, 'control'> {
    size?: Exclude<InputSize, 'large'>,
    noLabel?: boolean,
    inline?: boolean,
    control?: React.ReactElement<any, any>,
    SwitchProps?: Partial<MuiSwitchProps>,
    WrapperProps?: HTMLAttributes<HTMLDivElement> & {[key: string]: any}
}

export const Switch = forwardRef<HTMLDivElement, SwitchProps>(({
    classes = {}, noLabel = false, inline = true, size = 'medium', control, SwitchProps = {}, WrapperProps, ...rest
}, ref) => {

    const { className: switchPropsClassName = '', ...restSwitchProps } = SwitchProps;
    const inlineClass = inline ? INLINE_CLASS : '';
    const noLabelClass = noLabel ? NO_LABEL_CLASS : '';
    return (
        <div ref={ref} className={`jr-mInput jr-mInputSwitch ${inlineClass} ${noLabelClass} ${SizeToClass[size]} mui`} {...WrapperProps}>
            <FormControlLabel
                classes={{ label: `jr-mInput-label mui ${classes?.root ?? ''}`, ...classes }}
                control={control ?? <MuiSwitch size={size} color="primary" className={`jr-mInput-switch mui ${switchPropsClassName}`} {...restSwitchProps} />}
                labelPlacement="start"
                {...rest}
            />
        </div>
    )
})
