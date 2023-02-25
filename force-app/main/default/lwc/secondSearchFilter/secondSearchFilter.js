import { LightningElement, wire} from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import {refreshApex} from '@salesforce/apex';

const actions = [{ label: 'Delete', name: 'delete'}];

export default class SearchFilter extends LightningElement {

   columns = [
      { label: 'First Name', fieldName:'FirstName', type: 'text'},
      { label: 'Last Name', fieldName: 'LastName', type: 'text'},
      { label: 'Email', fieldName: 'Email', type: 'email'},
      { label: "Account Name", fieldName: "recordLink", type: "url",
         typeAttributes: { label: { fieldName: 'AccountName' }}},
      { label: 'Mobile Phone', fieldName: 'Phone', type: 'phone'},
      { label: 'Created Date', fieldName:  'CreatedDate', type: 'date', typeAttributes:{
         year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"}},
      {  type: 'action', typeAttributes: {rowActions: actions, menuAlignment: 'right'}}
   ];
   
   contacts;
   error;
   contacts;
   isShowDeleteScreen = false;
   searchKey;
   initialRecords;
   recordRow;
   recordId;
   refreshData;
   
   @wire(getContacts)

   wiredContacts (value) {
      this.refreshData = value;
      const {error, data} = value;
      if (data) {
         let contactData = JSON.parse(JSON.stringify(data));
         contactData.forEach(record =>{
            if (record.AccountId) {
               record.recordLink = "/" + record.AccountId;
               record.AccountName = record.Account.Name; 
            }
         });
         this.contacts = contactData;
         this.initialRecords = contactData;
      } else if (error) {
         this.error = error;
      }
   }

   handelSearchKey (event){
      this.searchKey = event.target.value.toLowerCase(); 
   }

   searchContactHandler(){
      if (this.searchKey) {
         this.contacts = this.initialRecords;
         if (this.contacts) {
            let recs = [];             
            for (let rec of this.contacts) {
               let valuesArray = Object.values(rec);
               for (let val of valuesArray) {
                  let strVal = String(val);                     
                  if (strVal) {
                     if (strVal.toLowerCase().includes(this.searchKey)) {
                        recs.push(rec);
                        break;                     
                     }
                  }
               }                 
            }
            this.contacts = recs;
         }
      } else {
         this.contacts = this.initialRecords;
      }
   }

   newHandler (){
      const modal = this.template.querySelector("c-add-new-contact");
      modal.show();
   }

   handleRowAction (event){
      const actionName = event.detail.action.name;
      switch(actionName) {
         case 'delete':
            const modal = this.template.querySelector("c-delete-screen");
            modal.show();
            this.isShowDeleteScreen = true;
            this.recordRow = event.detail.row;
            this.recordId = event.detail.row.Id; 
         break;
      }
   }
   
   fetchVisible (event) {
      this.isShowDeleteScreen = event.detail;
      refreshApex(this.refreshData);
   }  
}

