import React, { forwardRef } from 'react';
import {
    Card as MuiCard, CardContent as MuiCardContent, CardHeader as MuiCardHeader, CardProps as MuiCardProps, CardContentProps as MuiCardContentProps, CardHeaderProps as MuiCardHeaderProps
} from '@material-ui/core';

type CardProps = MuiCardProps & {
    cardOverflow?: boolean
    isLastOrSingleCard?: boolean
    isCardHeader?: boolean
    cardHeaderProps?: MuiCardHeaderProps,
    cardContentProps?: MuiCardContentProps,
    paddedCardBodyContent?: React.ReactNode
}

export const CustomizableCard = forwardRef<HTMLElement, CardProps>(({
    isCardHeader = false, isLastOrSingleCard = false, cardOverflow = false, paddedCardBodyContent, variant = 'elevation', className: cardClassname = '', elevation = 2, children, cardHeaderProps = {}, cardContentProps = {}, ...rest
}, ref) => {

    const {
        title = '', className: cardHeaderClassName = '', classes: cardHeaderClasses = '', ...restCardHeaderProps
    } = cardHeaderProps;

    const overflowClass = cardOverflow ? 'jr-uOverflow-show' : '';
    const marginClass = isLastOrSingleCard ? '' : 'jr-uMargin-b-08';
    return (
        <MuiCard ref={ref} className={`jr-mCard ${marginClass} ${overflowClass} ${cardClassname} mui`} variant={variant} elevation={elevation} {...rest}>
            <MuiCardContent {...cardContentProps}>
                { isCardHeader && (
                    <MuiCardHeader
                        className={`jr-mCard-header jr-mCard-headerLarge  ${cardHeaderClassName} mui`}
                        classes={{ title: `jr-mCard-header-title ${cardHeaderClasses} mui` }}
                        title={title}
                        {...restCardHeaderProps}
                    />
                )}
                { paddedCardBodyContent && (
                    <div className="jr-mCard-bodyPadded jr-mCard-body mui"> {paddedCardBodyContent} </div>
                )}
                { children && (
                    <div className="jr-mCard-body mui">
                        {children}
                    </div>
                ) }
            </MuiCardContent>
        </MuiCard>
    )
})
