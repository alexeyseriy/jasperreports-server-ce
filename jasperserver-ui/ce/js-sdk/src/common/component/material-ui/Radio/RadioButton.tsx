import React, { forwardRef } from 'react';
import {
    FormControlLabel, FormControlLabelProps, Radio as MuiRadio, RadioProps as MuiRadioProps
} from '@material-ui/core';

export interface RadioProps extends Omit<FormControlLabelProps, 'control'> {
    control?: React.ReactElement<any, any>,
    RadioProps?: MuiRadioProps
}

export const RadioButton = forwardRef<HTMLDivElement, RadioProps>(({
    className = '', classes = {}, control, RadioProps = {}, ...rest
}, ref) => {

    const { classes: radioClasses = {}, ...restRadioProps } = RadioProps;

    return (
        <FormControlLabel
            ref={ref}
            control={control ?? <MuiRadio color="primary" classes={{ root: `jr-mInput-radio-button mui ${radioClasses.root ?? ''}` }} {...restRadioProps} />}
            className={`jr-mInput-radio ${className} mui`}
            classes={{ label: `jr-mInput-radio-label mui ${classes?.root ?? ''}`, ...classes }}
            {...rest}
        />
    )
})
