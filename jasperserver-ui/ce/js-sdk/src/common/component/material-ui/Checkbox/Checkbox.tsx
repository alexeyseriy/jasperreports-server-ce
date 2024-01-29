import React, { forwardRef } from 'react';
import {
    FormControlLabel, FormControlLabelProps, Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps
} from '@material-ui/core';

export interface CheckboxProps extends Omit<FormControlLabelProps, 'control'> {
    control?: React.ReactElement<any, any>,
    CheckboxProps?: MuiCheckboxProps
}

export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(({
    className = '', classes = {}, control, CheckboxProps = {}, ...rest
}, ref) => {

    const { classes: checkBoxClasses = {}, ...restCheckboxProps } = CheckboxProps;

    return (
        <FormControlLabel
            ref={ref}
            control={control ?? <MuiCheckbox color="primary" classes={{ root: `jr-mInput-checkbox-check mui ${checkBoxClasses.root ?? ''}` }} {...restCheckboxProps} />}
            className={`jr-mInput-checkbox ${className} mui`}
            classes={{ label: `jr-mInput-checkbox-label mui ${classes?.root ?? ''}`, ...classes }}
            {...rest}
        />
    )
})
