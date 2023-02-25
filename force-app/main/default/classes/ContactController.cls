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
   public static void deleteContacts(Id contactId){
      Contact contactToDelete = new Contact(Id = contactId);
      delete contactToDelete;   
   }
}
