@isTest
private class AccountControllerTest {

   @testSetup
   private static void setupData() {
      List<Account> accounts = new List<Account>();
      for (Integer i = 0; i < 20; i++) {
         accounts.add(new Account(Name = 'TestAccount' + i));
      }
      insert accounts;
   }

   @isTest
   private static void getAccounts_wireAccounts_accountsReceived() {
      String accountName = 'TestAccount';
      List<Account> receivedAccounts = [SELECT Id, Name FROM Account WHERE Name LIKE :accountName];
         Test.startTest();
         List<Account> accounts = AccountController.getAccounts(accountName);
         Test.stopTest();

         System.assertEquals(receivedAccounts, accounts, 'Account wasn`t received');
   }

   @isTest
   private static void getAccounts_wireAccounts_errorThrown() {
      String accountName = 'TestAccount';
      List<Account> allAccounts = [SELECT Id FROM Account WHERE Name LIKE :accountName];
      delete allAccounts;
      
      Test.startTest();
      Boolean isException = false;
      try {
         AccountController.getAccounts(accountName);
      } catch (Exception e) {
         if (e.getMessage().contains('Accounts are empty')) {
            isException = true;
         }
      }
      Test.stopTest();

      System.assert(isException, 'Account should have thrown an exception');
   }
}