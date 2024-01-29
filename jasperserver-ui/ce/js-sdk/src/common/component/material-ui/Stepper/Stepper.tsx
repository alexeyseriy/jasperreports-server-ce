import React, { forwardRef, PropsWithChildren } from 'react';
import {
    Stepper as MuiStepper,
    StepperProps as MuiStepperProps
} from '@material-ui/core';

export const Stepper = forwardRef<HTMLDivElement, PropsWithChildren<MuiStepperProps>>(({
    className, children, ...rest
}, ref) => {

    return (
        <MuiStepper
            ref={ref}
            className={`jr-mStepper ${className} mui`}
            {...rest}
        >
            {children}
        </MuiStepper>
    )

})
