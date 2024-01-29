export enum DialogSizeToClass {
    general = 'jr-mDialogConfirm',
    warning = 'jr-mDialogWarning',
    delete = 'jr-mDialogDelete',
    error = 'jr-mDialogError'
}

export type DialogSize = keyof typeof DialogSizeToClass;
