import $ from 'jquery';
import sinon from 'sinon';
import navigateBackUtils from 'src/navigateBack/utils/navigateBackUtils';

describe('Exit dialog', function () {
    const content = {
        bodyText:{
            firstText: 'text1',
            secondText: 'text2'
        },
        previousState:true,
        closeLabel: 'Close Report',
        title: 'Report Export in Progress'
    };

    afterEach(function () {
        sinon.restore();
        $('.exit-confirmation-dialog')?.remove()
    });

    it('should create exit confirmation box and register events', function () {
        navigateBackUtils.exitDialogBox(content, true, () => {} )
        expect($('.exit-confirmation-dialog').hasClass('hidden')).toBeFalse()
    });
    it('should trigger exit/back is previous state is false', () => {
        const backFnStub = sinon.stub();
        let option = {...content , previousState:false};
        navigateBackUtils.exitDialogBox(option, true, backFnStub )
        expect(backFnStub).toHaveBeenCalled();
    });

    it('should trigger cancel btn on dialog cancel click',  () => {
        const closeBtnSpy = sinon.spy(navigateBackUtils, 'closeExitDialog'),
            hideExitDialogSpy = sinon.spy(navigateBackUtils, 'hideExitDialog');
        navigateBackUtils.exitDialogBox(content, true, () => {} )
        navigateBackUtils.exitDialog.trigger('button:cancel');
        $('.exit-confirmation-dialog ').trigger('click');
        expect($(".exit-confirmation-dialog").length).toEqual(0);
        expect(closeBtnSpy).toHaveBeenCalled()
        expect(hideExitDialogSpy).toHaveBeenCalled()
        closeBtnSpy.restore()
        hideExitDialogSpy.restore()
    });

    it('should trigger close without save btn on dialog',  ()  => {
        const closeWithSaveBtnSpy = sinon.spy(navigateBackUtils, 'onCloseWithoutSaveButtonClick'),
            hideExitDialogSpy = sinon.spy(navigateBackUtils, 'hideExitDialog'),
            navigateStub = sinon.stub(navigateBackUtils, 'navigateBack');
        navigateBackUtils.exitDialogBox(content, true, () => {} )
        navigateBackUtils.exitDialog.trigger('button:close');
        $('.exit-confirmation-dialog ').trigger('click');
        expect($(".exit-confirmation-dialog").length).toEqual(0);
        expect(closeWithSaveBtnSpy).toHaveBeenCalled()
        expect(hideExitDialogSpy).toHaveBeenCalled()
        expect(navigateStub).toHaveBeenCalled()
        closeWithSaveBtnSpy.restore()
        hideExitDialogSpy.restore()
        navigateStub.restore()
    });
    it('should check if report is in progress or rendering , show confirmation box',function(){
        window.viewer={
            hasReport:function(){
                return true;
            },
            isExportRunning:function(){
                return true
            }
        };

        navigateBackUtils.exitDialogBox(content, true, () => {} );
        expect($(".exit-confirmation-dialog").length).toEqual(1);
    })
});