import React, { forwardRef, PropsWithChildren } from 'react';
import {
    Step as MuiStep,
    StepLabel as MuiStepLabel,
    StepProps as MuiStepProps,
    StepLabelProps as MuiStepLabelProps,
    Typography as MuiTypography,
    TypographyProps as MuiTypographyProps
} from '@material-ui/core';

export interface StepComponentProps extends MuiStepProps {
    StepLabelProps?: MuiStepLabelProps;
    TypographyProps: MuiTypographyProps & {
        title: string
    }
}

export const Step = forwardRef<HTMLDivElement, PropsWithChildren<StepComponentProps>>(({
    StepLabelProps = {}, TypographyProps = {}, children, ...rest
}, ref) => {

    const { className: typographyClassName, title, ...restTypographyProps } = TypographyProps;
    const { className: stepClassName = '', ...restStepProps } = rest;

    return (
        <MuiStep ref={ref} className={`jr-mStepper-step ${stepClassName} mui`} {...restStepProps}>
            <MuiStepLabel {...StepLabelProps}>
                <MuiTypography className={`jr-mText jr-mTextTitle jr-mTextSmall ${typographyClassName} mui`} {...restTypographyProps}>{title}</MuiTypography>
                {children}
            </MuiStepLabel>
        </MuiStep>
    )

})
