import { LightningElement, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import getContact from '@salesforce/apex/ContactController.getContact';
import {refreshApex} from '@salesforce/apex';
const COLUMNS = [
   { label: 'First Name', fieldName:'FirstName', type: 'text'},
   { label: 'Last Name', fieldName: 'LastName', type: 'text'},
   { label: 'Email', fieldName: 'Email', type: 'email'},
   { label: "Account Name", fieldName: "recordLink", type: "url",
      typeAttributes: { label: { fieldName: 'Account_Name' }}},
   { label: 'Mobile Phone', fieldName: 'Phone', type: 'phone', sortable: true },
   { label: 'Created Date', fieldName:  'CreatedDate', type: 'date', typeAttributes:{
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"}},
   { label:'Delete Contact', type: 'button', typeAttributes: {label: 'Delete', name:'Delete', title:'Delete'}}
];
export default class SearchFilter extends LightningElement {
   @track contacts;
   @track columns = COLUMNS;
   @track error;
   @track contacts;
   @track isShowDeleteScreen = false;
   searchKey;
   recordRow;
   recordId;
   refreshData;
   @wire(getContactList)
   wiredContacts(value) {
      this.refreshData = value;
      const {error, data} = value;
      if (data) {
         var ObjData = JSON.parse(JSON.stringify(data));
         ObjData.forEach(item =>{
            item.recordLink = item.Account!=undefined ? '/lightning/r/Account/' +item.AccountId +'/view' : ''
      });
         this.contacts = ObjData;
      } else if (error) {
         this.error = error;
      }
   }
   handelSearchKey(event){
      this.contacts = event.target.value;
   }
   filterHandler(){
      getContact({textkey: this.contacts})
         .then(result => {
            this.contacts = result;
         })
         .catch( error=>{
            this.contacts = null;
         });
   }
   newHandler(){
      const modal = this.template.querySelector("c-add-new-contact");
         modal.show();
   }
   handleRowAction(event){
      let actionName = event.detail.action.name;
      if(actionName === 'Delete') {
         const modal = this.template.querySelector("c-delete-screen");
         modal.show();
         this.isShowDeleteScreen = true;
         this.recordRow = event.detail.row;
         this.recordId = event.detail.row.Id; 
      }
   }
   fetchVisible(event) {
      this.isShowDeleteScreen = event.detail;
      refreshApex(this.refreshData);
   }  
}

