/**
 * @description       : Test class for LWC_VisitActionsController
 * @author            :
 * @group             :
 * @last modified on  : 06-07-2023
 * @last modified by  : shahrukh.ahmed@merkle.com
 **/
@isTest
public class LWC_RelatedListControllerTest {
	@isTest
	static void getrecordsTest() {
		string whereClause = 'visit__c=:recordId';
		string objectName = 'AssessmentTaskResult__c';
		string fieldsSet = 'PlanogramCheck';
		string recordLimit = '5';
		Id recordId = TestUtility.getFakeId(Visit.SObjectType);

		Test.startTest();
		try {
			LWC_RelatedListController.getrecords(recordId, whereClause, objectName, fieldsSet, recordLimit);
		} catch (Exception e) {
			Assert.areEqual(
				'System.QueryException',
				e.getTypeName(),
				'getting DML exception because of using fake record'
			);
		}
		Test.stopTest();
	}
	@isTest
	static void getFieldLableAndFieldAPITest() {
		string objectName = 'AssessmentTaskResult__c';
		string fieldsSet = 'PlanogramCheck';

		Test.startTest();
		try {
			LWC_RelatedListController.getFieldLableAndFieldAPI(objectName, fieldsSet);
		} catch (Exception e) {
			Assert.areEqual(
				'System.QueryException',
				e.getTypeName(),
				'getting DML exception because of using fake record'
			);
		}
		Test.stopTest();
	}
}
