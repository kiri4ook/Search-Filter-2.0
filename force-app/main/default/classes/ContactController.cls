public with sharing class ContactController {
   @AuraEnabled(cacheable=true)
   public static List<Contact> getContactList(){
      return[ SELECT Id, FirstName, LastName, AccountId, Account.Name, Email, Phone, CreatedDate
      FROM Contact
      WITH SECURITY_ENFORCED
      ORDER BY FirstName
      ];
   }
   @AuraEnabled(cacheable=true)
   public static List<Contact> getContact(String textkey) {
      textkey = '%' + textkey + '%';
       List<Contact> contList = [ SELECT Id, FirstName, LastName, AccountId, Account.Name, Email, Phone, CreatedDate
       FROM Contact
       WHERE FirstName LIKE :textkey
       ORDER BY FirstName
      ];
      if(contList.isEmpty()) {
         throw new AuraHandledException('No Record Found..');
      }
      return contList;
   }
   @AuraEnabled
   public static void deleteContacts(list<Id> lstConIds){
      try {
         list<Contact> lstConsToDelete = new list<Contact>();
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
