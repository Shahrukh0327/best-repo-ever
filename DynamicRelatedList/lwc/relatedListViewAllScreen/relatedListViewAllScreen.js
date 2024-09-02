import { LightningElement, wire, track } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import getrecords from "@salesforce/apex/LWC_RelatedListController.getrecords";
import getFieldLableAndFieldAPI from "@salesforce/apex/LWC_RelatedListController.getFieldLableAndFieldAPI";
import { refreshApex } from "@salesforce/apex";
export default class RelatedListViewAllScreen extends LightningElement {
  isLoading = true;
  recordId;
  iconName;
  objectName;
  whereClause;
  fieldsSet;
  title;
  checkFieldSet = false;
  @track columns = [];
  @track data = [];
  @track dataIsPresent = false;

  recordCountLabel = "+ items • Sorted by Name";
  lastUpdated = Date.now();
  connectedCallback() {
    refreshApex(this.recordData);
    refreshApex(this.fieldrecord);
  }
  @wire(CurrentPageReference)
  wiredPageReference(pageRef) {
    this.recordId = pageRef.state.c__recordId;
    this.iconName = pageRef.state.c__iconName;
    this.whereClause = pageRef.state.c__whereClause;
    this.objectName = pageRef.state.c__objectName;
    this.fieldsSet = pageRef.state.c__fieldsSet;
    this.title = pageRef.state.c__title;
    if (!this.recordId || !this.fieldsSet || !this.objectName) {
      this.isLoading = false;
    }
  }

  @wire(getrecords, {
    recordId: "$recordId",
    whereClause: "$whereClause",
    objectName: "$objectName",
    fieldsSet: "$fieldsSet",
    recordLimit: "100"
  })
  recordData({ data, error }) {
    if (data && data.length !== 0) {
      this.data = data.map((element) => ({ firstColumnURL: `/lightning/r/${element.Id}/view`, ...element }));

      console.log("Data: " + data);
      this.dataIsPresent = true;
    } else if (error) {
      console.log(error);
    }
  }

  @wire(getFieldLableAndFieldAPI, {
    objectName: "$objectName",
    fieldsSet: "$fieldsSet"
  })
  fieldrecord({ data, error }) {
    if (data) {
      this.columns = [];
      let fieldSet = JSON.parse(data);
      for (let index = 0; index < fieldSet.length; index++) {
        if (Object.values(fieldSet[index])[0] === "Name") {
          this.columns.push({
            label: Object.keys(fieldSet[index])[0],
            fieldName: "firstColumnURL",
            type: "url",
            typeAttributes: { label: { fieldName: Object.values(fieldSet[index])[0] }, target: "_blank" },
            sortable: true
          });
        } else {
          this.columns.push({ label: Object.keys(fieldSet[index])[0], fieldName: Object.values(fieldSet[index])[0] });
        }
      }
      console.log(this.columns);
      this.checkFieldSet = true;
    } else if (error) {
      console.log(error);
    }
  }
}
