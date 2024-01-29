import sinon from 'sinon';
import ReportRuntimeViewer from 'src/reportViewer/report.view.runtime';
import Report from 'src/reportViewer/report.view.base';

describe('Report view runtime', function () {

    beforeEach(function () {
        window.viewer={
            _reportInstance:{
                destroy:sinon.stub()
            }
        }
    });

    afterEach(function () {
        sinon.restore();
    });
    it('should destroy main report when navigated away from report viewer page',function(){
        Report.exportForm={
            _eventId:{
                value:'close'
            }
        };

        Report.isDrillDownExecution = false;
        let goBackExecutionSpy = sinon.spy(ReportRuntimeViewer , 'getGoBackExecutionId');
        ReportRuntimeViewer.deleteReportExecution();
        expect(goBackExecutionSpy).toHaveBeenCalled();
        expect(window.viewer._reportInstance.destroy).toHaveBeenCalled();
        goBackExecutionSpy.restore();

    });
    it('should destroy main report and drill down report when navigated away from report viewer page',function(){
        let goBackExecutionStub = sinon.stub(ReportRuntimeViewer , 'getGoBackExecutionId').callsFake(function(){
            return 'test';
        });
        Report.exportForm._eventId.value = 'back';
        ReportRuntimeViewer.deleteReportExecution();
        expect(goBackExecutionStub).toHaveBeenCalled();
        expect(window.viewer._reportInstance.destroy).toHaveBeenCalled();
        expect(Report.mainExecutionId).toBe(undefined);
        goBackExecutionStub.restore();

    })
});