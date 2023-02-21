import { LightningElement, api, wire, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import ACCOUNT_ID from '@salesforce/schema/Contact.AccountId';
import PHONE from '@salesforce/schema/Contact.Phone';

export default class AddNewContact extends LightningElement {
   @track selectedAccountId;
   @track contactId;
   isShowCreateContactScreen = false;
   firstName = '';
   lastName = '';
   email = '';
   phone = '';
   @api show() {
      this.isShowCreateContactScreen = true;
   }
   closeCreateContactScreen() {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.phone = '';
      this.isShowCreateContactScreen = false;
   }

   handleFirstNameChange(event) {
      this.firstName = event.target.value;
   }
   handleLastNameChange(event) {
      this.lastName = event.target.value;
   }
   handleEmailChange(event) {
      this.email = event.target.value;
   }
   handlePhoneChange(event) {
      this.phone = event.target.value;
   }
   saveContact() {
      const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
      .reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            this.dispatchEvent(new ShowToastEvent({
                  title: 'Сontact creation error',
                  message: 'Please, enter correct data',
                  variant: 'error',
               }),
            );
            return validSoFar && inputField.checkValidity();
          
      }, true);
      if (isInputsCorrect) {
            const fields = {};
            fields[FIRSTNAME_FIELD.fieldApiName] = this.firstName;
            fields[LASTNAME_FIELD.fieldApiName] = this.lastName;
            fields[EMAIL.fieldApiName] = this.email;
            fields[PHONE.fieldApiName] = this.phone;
            fields[ACCOUNT_ID.fieldApiName] = this.selectedAccountId;
            const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };
            createRecord(recordInput)
               .then(contactobj => {
                  this.contactId = contactobj.id;
                  this.dispatchEvent(
                     new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact' + ' ' + this.firstName + ' ' + this.lastName + ' ' + 'created',
                        variant: 'success',
                     }),
                  );
                  this.firstName = '';
                  this.lastName = '';
                  this.email = '';
                  this.phone = '';
                  this.isShowCreateContactScreen = false;
                  const custEvent = new CustomEvent(
                     'callpasstoparent', {
                     detail: this.visible
                  });
                  this.dispatchEvent(custEvent);
               })
         }
      
   }
   handleAccountNameChange(event) {
      this.selectedAccountId = event.detail;
   }
}