import Dialog from "./Dialog";
import _ from "underscore";
import i18n from '../../../i18n/CommonBundle.properties';
import exitDialogTemplate from './template/exitDialogTemplate.htm';

export default Dialog.extend({
    constructor: function (options) {
        this.exitDialogTemplate =_.template(exitDialogTemplate);
        Dialog.prototype.constructor.call(this, {
            resizable: false,
            modal: true,
            content: this.exitDialogTemplate({ content: options?.bodyText }),
            buttons: [
                {
                    label: options?.closeLabel || i18n["dialog.exit.close.button"],
                    action: 'close',
                    primary: true,
                    dataName: 'buttonClose'
                },
                {
                    label: i18n["dialog.exit.cancel.button"],
                    action: 'cancel',
                    primary: false,
                    dataName: 'buttonCancel'
                }
            ]
        });
        this.addCssClasses('exit-confirmation-dialog');
        const title = options?.title || i18n["dialog.exit.title"];
        this.setTitle(title);
        this.$el.css({ minHeight: this.$el.outerHeight() });
        this.width = this.$el.outerWidth();
    }
});