import React, { forwardRef, PropsWithChildren } from 'react';
import {
    FormGroup, FormGroupProps as MuiFormGroupProps, FormControl as MuiFormControl, FormLabel as MuiFormLabel,
    FormControlProps as MuiFormControlProps, FormLabelProps as MuiFormLabelProps
} from '@material-ui/core';
import {
    InputSize, SizeToClass
} from '../types/InputTypes';
import { FormHelper, FormHelperTextProps as JRSFormHelperTextProps } from '../FormHelperTextGroup/FormHelperText'
import { FormError } from '../FormHelperTextGroup/FormErrorText';

export type CheckboxGroupProps = {
    size?: InputSize,
    title?: string,
    helperText?: string,
    errorMessage?: string,
    FormGroupProps?: MuiFormGroupProps,
    FormHelperTextProps?: JRSFormHelperTextProps,
    FormLabelProps?: Omit<MuiFormLabelProps, 'component'> & {
        component?: React.ElementType<any>
    },
    FormControlProps?: Omit<MuiFormControlProps, 'component'> & {
        component?: React.ElementType<any>
    }
}

export const CheckboxGroup = forwardRef<HTMLDivElement, PropsWithChildren<CheckboxGroupProps>>(({
    helperText, errorMessage, children, size = 'medium', title = '', FormLabelProps = {}, FormGroupProps = {}, FormControlProps = {}
}, ref) => {
    const { component: formControlComponent = 'fieldset', className: formControlClassName = '', ...restFormControlProps } = FormControlProps
    const { className: formLabelPropsClassName = '', component: formLabelComponent = 'legend', ...restFormLabelProps } = FormLabelProps;

    return (
        <MuiFormControl ref={ref} component={formControlComponent} className={`jr-mInput ${SizeToClass[size]} ${formControlClassName} jr-mInputCheckbox mui`} {...restFormControlProps}>
            { title && <MuiFormLabel component={formLabelComponent} className={`jr-mInput-label ${formLabelPropsClassName} mui`} {...restFormLabelProps}>{title}</MuiFormLabel>}
            <FormGroup {...FormGroupProps}>
                {children}
            </FormGroup>
            <FormHelper text={helperText} />
            <FormError text={errorMessage} />
        </MuiFormControl>
    )
})
