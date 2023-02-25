public with sharing class AccountController {
   
   @AuraEnabled(cacheable=true)
   public static List<Account> getAccounts(String actName){
      List<Account> accountList = new List<Account>();
         String accountName = '%' + actName + '%';
         accountList = [SELECT Id, Name
                        FROM Account
                        WHERE Name LIKE :accountName];
        
      return accountList;          
   }
}