import { LightningElement, api, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import deleteSelectedContact from '@salesforce/apex/ContactController.deleteContacts';

export default class DeleteScreen extends LightningElement {

   @api recordRow;
   @api wireResult;
   isShowDeleteScreen = false;

   @api show() {
      this.isShowDeleteScreen = true;
   }

   @wire(getContacts)

   wiredCallback(result) {
      this.wireResult = result;
   }

   closeDeleteScreen() { 
      this.isShowDeleteScreen = false;
   } 

   onDelete(){
      this.deleteContact(this.recordRow);
   } 

   deleteContact (currentRow) {
      deleteSelectedContact ({contactId: currentRow.Id}).then(()=> {
         this.dispatchEvent(new ShowToastEvent({
            title: 'Success!!',
            message: 'Contact ' + currentRow.FirstName + ' '+ currentRow.LastName +' deleted.',
            variant: 'success'
         }));
         this.isShowDeleteScreen = false;
         const custEvent = new CustomEvent(
            'callpasstoparent', {
                detail: this.visible 
            });
         this.dispatchEvent(custEvent);
      })
   }
}