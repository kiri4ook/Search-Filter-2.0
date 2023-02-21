import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
export default class CustomLookupComp extends LightningElement {
   @track accountName = '';
   @track accountList = [];     
   @track accountId; 
   @track isshow=false;
   @track messageResult=false;
   @track isShowResult = true;   
   @track showSearchedValues = false;   
   @wire(getAccounts, {actName:'$accountName'})
   retrieveAccounts ({error, data}) {
      this.messageResult=false;
      if (data) {
         if(data.length>0 && this.isShowResult){
            this.accountList = data;                
            this.showSearchedValues = true; 
            this.messageResult=false;
         }else if(data.length==0){
            this.accountList = [];                
            this.showSearchedValues = false;
            if(this.accountName!='')
               this.messageResult=true;               
         }  
      }else if (error) {
         this.accountId =  '';
         this.accountName =  '';
         this.accountList=[];           
         this.showSearchedValues = false;
         this.messageResult=true;   
      }
   }
   handleClick(event){
      this.isShowResult = true;   
      this.messageResult=false;        
   }
   handleKeyChange(event){       
      this.messageResult=false;  
      this.accountName = event.target.value;
   }
   handleParentSelection(event){        
      this.showSearchedValues = false;
      this.isShowResult = false;
      this.messageResult=false;
      this.accountId =  event.target.dataset.value;
      this.accountName =  event.target.dataset.label;        
      const selectedEvent = new CustomEvent('selected', { detail: this.accountId });
      this.dispatchEvent(selectedEvent);    
   }
}