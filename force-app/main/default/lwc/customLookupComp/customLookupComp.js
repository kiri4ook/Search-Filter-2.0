import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class CustomLookupComp extends LightningElement {

   accountName = '';
   accountList = [];     
   accountId; 
   messageResult = false;
   isShowResult = false;   
   showSearchedValues = false; 

   @wire(getAccounts, {actName:'$accountName'})

   retrieveAccounts ({error, data}) {
      if (data) {
         if(data.length > 0 && this.isShowResult){
            this.accountList = data;                
            this.showSearchedValues = true; 
         }else if(data.length == 0){
            this.accountList = [];                
            this.showSearchedValues = false;
            if(this.accountName != '')
               this.messageResult = true;               
         }  
      }else if (error) {
         this.accountId = '';
         this.accountName = '';
         this.accountList = [];           
         this.showSearchedValues = false;
         this.messageResult = true;   
      }
   }

   handleClick (){
      this.isShowResult = true;       
   }

   handleKeyChange (event){       
      this.accountName = event.target.value;
   }

   handleParentSelection (event){        
      this.showSearchedValues = false;
      this.isShowResult = false;
      this.accountId = event.target.dataset.value;
      this.accountName = event.target.dataset.label;        
      const selectedEvent = new CustomEvent('selected', { detail: this.accountId });
      this.dispatchEvent(selectedEvent);    
   }
}