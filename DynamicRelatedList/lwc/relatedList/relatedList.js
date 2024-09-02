import { api, LightningElement, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getrecords from "@salesforce/apex/LWC_RelatedListController.getrecords";
import getFieldLableAndFieldAPI from "@salesforce/apex/LWC_RelatedListController.getFieldLableAndFieldAPI";
export default class RelatedList extends NavigationMixin(LightningElement) {
  @api recordId;
  @api iconName;
  @api objectName;
  @api fieldsSet;
  @api whereClause;
  @api title;
  recordCountLabel;
  lastUpdated = Date.now();
  checkFieldSet = false;
  columns = [];
  data = [];
  @track dataIsPresent = false;
  connectedCallback() {}

  @wire(getrecords, {
    recordId: "$recordId",
    whereClause: "$whereClause",
    objectName: "$objectName",
    fieldsSet: "$fieldsSet",
    recordLimit: "5"
  })
  recordData({ data, error }) {
    if (data && data.length !== 0) {
      this.data = data.map((element) => ({ firstColumnURL: `/lightning/r/${element.Id}/view`, ...element }));
      this.recordCountLabel =
        data.length + " " + (data.length === 1 ? "item • Sorted by Name" : "items • Sorted by Name");
      console.log("Data: " + data);
      this.dataIsPresent = true;
    } else if (error) {
      this.showError(error);
    }
  }

  @wire(getFieldLableAndFieldAPI, {
    objectName: "$objectName",
    fieldsSet: "$fieldsSet"
  })
  fieldrecord({ data, error }) {
    if (data) {
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
      this.checkFieldSet = true;
    } else if (error) {
      this.showError(error);
    }
  }

  showError(error) {
    console.log("Error : " + JSON.stringify(error));
  }

  handleViewAll() {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "RelatedListTab"
      },
      state: {
        c__recordId: this.recordId,
        c__iconName: this.iconName,
        c__whereClause: this.whereClause,
        c__objectName: this.objectName,
        c__fieldsSet: this.fieldsSet,
        c__title: this.title
      }
    });
  }
}
