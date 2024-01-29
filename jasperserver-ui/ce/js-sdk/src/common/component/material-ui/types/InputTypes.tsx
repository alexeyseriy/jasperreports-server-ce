export const INLINE_CLASS = 'jr-mInputInline';

export const NO_LABEL_CLASS = 'jr-mInputNolabel';

export const LABEL_CONTAINED = 'jr-mInputContained';

export enum SizeToClass {
    large = 'jr-mInputLarge',
    small = 'jr-mInputSmall',
    medium = ''
}

export enum WidthToClass {
    narrow = 'jr-mInputNarrow',
    normal = ''
}

export type InputSize = keyof typeof SizeToClass;
export type InputWidth = keyof typeof WidthToClass;
