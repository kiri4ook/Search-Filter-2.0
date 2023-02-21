public with sharing class AccountController {
   public AccountController() {}
   
   @AuraEnabled(cacheable=true)
   public static List<Account> getAccounts(String actName){
      List<Account> accountList = new List<Account>();
      if(actName!=''){
         String accountName = '%' + actName + '%';
         accountList = [SELECT Id, Name
                        FROM Account
                        WHERE Name LIKE :accountName];
         return accountList;  
      }
      return accountList;          
   }
}