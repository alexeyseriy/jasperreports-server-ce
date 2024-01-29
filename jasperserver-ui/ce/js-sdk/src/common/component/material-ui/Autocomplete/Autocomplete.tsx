import React, { ReactElement, Ref } from 'react';
import MuiAutocomplete, { AutocompleteProps as MuiAutocompleteProps } from '@material-ui/lab/Autocomplete';
import { Paper, PaperProps } from '@material-ui/core';

export type AutocompleteProps<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
    > = MuiAutocompleteProps< T, Multiple, DisableClearable, FreeSolo> & { paperComponentProps?: PaperProps }

function AutoCompleteFunc<
    T,
    Multiple extends boolean | undefined = undefined,
    DisableClearable extends boolean | undefined = undefined,
    FreeSolo extends boolean | undefined = undefined
    >({ paperComponentProps = {}, ...rest }: AutocompleteProps< T, Multiple, DisableClearable, FreeSolo>, ref: Ref<HTMLDivElement>) {
    const { elevation = 8, ...restPaperProps } = paperComponentProps
    return (
        <MuiAutocomplete
            ref={ref}
            PaperComponent={({ children }) => (
                <Paper elevation={elevation} {...restPaperProps}>{children}</Paper>
            )}
            {...rest}
        />
    )
}
export const Autocomplete = React.forwardRef(AutoCompleteFunc) as
    <
        T,
        Multiple extends boolean | undefined = undefined,
        DisableClearable extends boolean | undefined = undefined,
        FreeSolo extends boolean | undefined = undefined
        >(props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> & React.RefAttributes<HTMLDivElement>) => ReactElement;
