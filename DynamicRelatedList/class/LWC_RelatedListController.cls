/**
 * @description       : LWC_RelatedListController Apex Class
 * @author            : shahrukh.ahmed@merkle.com
 * @group
 *
 * @last modified on  : 12-01-2023
 * @last modified by  : shahrukh.ahmed@merkle.com
 **/
public with sharing class LWC_RelatedListController {
	@AuraEnabled(Cacheable=true)
	//Creating a queryString where we add fields name as per FieldSet and fetch sObject as per queryString.
	public static List<SObject> getrecords(
		Id recordId,
		string whereClause,
		string objectName,
		string fieldsSet,
		string recordLimit
	) {
		try {
			String queryString = 'SELECT Id';

			Schema.DescribeSObjectResult SObjectResult = Schema.describeSObjects(new List<String>{ objectName }).get(0);
			Map<String, Schema.FieldSet> fieldSetMap = SObjectResult.fieldSets.getMap();
			Schema.FieldSet fields = fieldSetMap.get(fieldsSet);

			for (Schema.FieldSetMember f : fields.getFields()) {
				queryString += ',' + f.getFieldPath();
			}
			queryString += ' FROM ' + objectName + ' WHERE ' + whereClause;
			queryString += ' WITH SECURITY_ENFORCED';
			queryString += ' LIMIT ' + recordLimit;

			return Database.query(queryString);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
	@AuraEnabled(Cacheable=true)
	// Create Map of Label and fieldName to use this map in columns of datatable
	public static string getFieldLableAndFieldAPI(string objectName, string fieldsSet) {
		List<Map<String, String>> listOfFieldSet = new List<Map<String, String>>();
		try {
			Schema.DescribeSObjectResult SObjectResult = Schema.describeSObjects(new List<String>{ objectName }).get(0);
			Map<String, Schema.FieldSet> fieldSetMap = SObjectResult.fieldSets.getMap();
			Schema.FieldSet fields = fieldSetMap.get(fieldsSet);
			for (Schema.FieldSetMember f : fields.getFields()) {
				Map<String, String> lableAPIMap = new Map<String, String>();
				lableAPIMap.put(f.getLabel(), f.getFieldPath());
				listOfFieldSet.add(lableAPIMap);
			}
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
		return JSON.serialize(listOfFieldSet);
	}
}
