public with sharing class ContactController {
   
   @AuraEnabled(cacheable=true)
   public static List<Contact> getContacts(){
      return [
            SELECT Id, FirstName, LastName, AccountId, Account.Name, Email, Phone, CreatedDate
            FROM Contact
            ORDER BY FirstName
      ];
   }

   @AuraEnabled
   public static void deleteContacts(List<Id> lstConIds){
      try {
         List<Contact> lstConsToDelete = new List<Contact>();
         for(Id idCon : lstConIds) {
            lstConsToDelete.add(new Contact(Id = idCon));
         }
         if(!lstConsToDelete.isEmpty()) {
            delete lstConsToDelete;
         }   
      } catch(Exception ex) {
            throw new AuraHandledException(ex.getMessage());
      }
   }
}
