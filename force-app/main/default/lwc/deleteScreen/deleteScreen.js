import { LightningElement, api, wire } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import delSelectedCons from '@salesforce/apex/ContactController.deleteContacts';

export default class DeleteScreen extends LightningElement {
   @api recordRow;
   @api wireResult;
   isShowDeleteScreen = false;
   @api show() {
      this.isShowDeleteScreen = true;
   }
   @wire(getContactList)
   wiredCallback(result) {
      this.wireResult = result;
   }

   closeDeleteScreen() { 
      this.isShowDeleteScreen = false;
   } 
   deleteContact(){
      this.deleteCons(this.recordRow);
   } 
   deleteCons(currentRow) {
      let currentRecord = [];
      currentRecord.push(currentRow.Id);
      delSelectedCons({lstConIds: currentRecord}).then(()=> {
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