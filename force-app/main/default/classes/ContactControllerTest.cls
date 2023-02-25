@isTest
private class ContactControllerTest {
   @testSetup
   private static void setupData() {
      List<Contact> contacts = new List<Contact>();
      for (Integer i = 0; i < 20; i++) {
         contacts.add(new Contact(LastName = 'TestContact' + i));
      }
      insert contacts;
   }

   @isTest
   private static void getContacts_wireContacts_contactsReceived() {
      List<Contact> receivedContacts = [SELECT Id, LastName, CreatedDate, AccountId, Account.Name FROM Contact];

         Test.startTest();
         List<Contact> contacts = ContactController.getContacts();
         Test.stopTest();

         System.assertEquals(receivedContacts, contacts, 'Contacts wasn`t received');
   }

   @isTest
   private static void getContacts_wireContacts_errorThrown() {
      List<Contact> allContacts = [SELECT Id FROM Contact];
      delete allContacts;
      
      Test.startTest();
      Boolean isException = false;
      try {
         ContactController.getContacts();
      } catch (Exception e) {
         if (e.getMessage().contains('Contacts are empty')) {
            isException = true;
         }
      }
      Test.stopTest();

      System.assert(isException, 'Contact should have thrown an exception');
   }

   @isTest
   private static void deleteContacts_wireContacts_contactsReceived() {
      Contact contactToDelete = new Contact();
        
         Test.startTest();
         ContactController.deleteContacts(contactToDelete.Id);
         Test.stopTest();

   }

   @isTest
   private static void deleteContacts_wireContacts_errorThrown() {
      Contact contactToDelete = new Contact();
      List<Contact> allContacts = [SELECT Id FROM Contact];
      delete allContacts;
        
         Test.startTest();
         Boolean isException = false;
         try {
            ContactController.deleteContacts(contactToDelete.Id);
         } catch (Exception e) {
            if (e.getMessage().contains('Contacts are empty')) {
               isException = true;
            }
         }
         Test.stopTest();

   }
}