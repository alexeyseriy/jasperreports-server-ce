import React, { forwardRef, PropsWithChildren } from 'react';
import {
    RadioGroupProps as MuiRadioGroupProps, FormControl as MuiFormControl, FormLabel as MuiFormLabel, RadioGroup as MuiRadioGroup,
    FormControlProps as MuiFormControlProps, FormLabelProps as MuiFormLabelProps
} from '@material-ui/core';
import {
    InputSize, SizeToClass
} from '../types/InputTypes';
import { FormHelper, FormHelperTextProps as JRSFormHelperTextProps } from '../FormHelperTextGroup/FormHelperText'

export type RadioButtonGroupProps = {
    size?: InputSize,
    title?: string,
    helperText?: string,
    RadioGroupProps?: MuiRadioGroupProps,
    FormHelperTextProps?: JRSFormHelperTextProps,
    FormLabelProps?: Omit<MuiFormLabelProps, 'component'> & {
        component?: React.ElementType<any>
    },
    FormControlProps?: Omit<MuiFormControlProps, 'component'> & {
        component?: React.ElementType<any>
    }
}

export const RadioGroup = forwardRef<HTMLDivElement, PropsWithChildren<RadioButtonGroupProps>>(({
    helperText, children, size = 'medium', title = '', FormLabelProps = {}, RadioGroupProps = {}, FormControlProps = {}
}, ref) => {
    const { component: formControlComponent = 'fieldset', className: formControlClassName = '', ...restFormControlProps } = FormControlProps
    const { className: formLabelPropsClassName = '', component: formLabelComponent = 'legend', ...restFormLabelProps } = FormLabelProps;

    return (
        <MuiFormControl ref={ref} component={formControlComponent} className={`jr-mInput ${SizeToClass[size]} ${formControlClassName} jr-mInputRadio mui`} {...restFormControlProps}>
            { title && <MuiFormLabel component={formLabelComponent} className={`jr-mInput-label ${formLabelPropsClassName} mui`} {...restFormLabelProps}>{title}</MuiFormLabel>}
            <MuiRadioGroup {...RadioGroupProps}>
                {children}
            </MuiRadioGroup>
            { helperText && <FormHelper text={helperText} />}
        </MuiFormControl>
    )
})
