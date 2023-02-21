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
    private static void getContactList_wireContacts_contactsReceived() {
        List<Contact> receivedContacts = [SELECT Id, LastName, CreatedDate, AccountId, Account.Name FROM Contact];

        Test.startTest();
        List<Contact> contacts = ContactController.getContactList();
        Test.stopTest();

        System.assertEquals(receivedContacts, contacts, 'Contacts wasnt received');
    }

    @isTest
    private static void getContactList_wireContacts_errorThrown() {
      List<Contact> allContacts = [SELECT Id FROM Contact];
      delete allContacts;
      
      Test.startTest();
      Boolean isException = false;
      try {
          ContactController.getContactList();
      } catch (Exception e) {
          if (e.getMessage().contains('Contacts are empty')) {
              isException = true;
          }
      }
      Test.stopTest();

      System.assert(isException, 'Contact should have thrown an exception');
  }
  @isTest
  private static void getContact_wireContacts_contactsReceived() {
      List<Contact> receivedContacts = [SELECT Id, LastName, CreatedDate, AccountId, Account.Name FROM Contact];

      Test.startTest();
      List<Contact> contacts = ContactController.getContact('Test');
      Test.stopTest();

      System.assertEquals(receivedContacts, contacts, 'Contacts wasnt received');
  }
  @isTest
  private static void getContact_wireContacts_errorThrown() {
    List<Contact> allContacts = [SELECT Id FROM Contact];
    delete allContacts;
    
    Test.startTest();
    Boolean isException = false;
    try {
        ContactController.getContact('Test');
    } catch (Exception e) {
        if (e.getMessage().contains('Contacts are empty')) {
            isException = true;
        }
    }
    Test.stopTest();

    System.assert(isException, 'Contact should have thrown an exception');
}
}