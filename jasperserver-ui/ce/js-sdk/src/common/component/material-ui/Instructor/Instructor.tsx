import React from 'react';
import { Icon } from '../Icon/Icon';
import { Typography } from '../Typography/Typography';

enum SizeToClass {
    large = 'jr-mInstructorLarge',
    small = 'jr-mInstructorSmall',
    medium = ''
}

export interface InstructorProps {
    size?: 'small' | 'large' | 'medium',
    label?: boolean,
    messageTitle?: string,
    messageDescription?: string,
    icon?: string,
    wrapperProps?: {
        className?: string
    }
}

export const Instructor = ({
    messageTitle, icon = 'message', size = 'medium', messageDescription, wrapperProps = {}
} : InstructorProps) => {
    const { className: wrapperClassName = '', ...restWrapperProps } = wrapperProps;
    return (
        <div className={`jr-mInstructor ${wrapperClassName} ${SizeToClass[size]} ${messageTitle ? '' : 'jr-mInstructorSimple'} mui`} {...restWrapperProps}>
            <div className="jr-mInstructor-wrapper mui">
                <Icon className="jr-mInstructor-icon" icon={icon} />
                { messageTitle && (
                    <Typography className="jr-mInstructor-title mui">
                        {messageTitle}
                    </Typography>
                )}

                <Typography className="jr-mInstructor-text mui">
                    {messageDescription}
                </Typography>

            </div>
        </div>
    )
}
