// ARRAY
// Array helps us to store multiple data into one

public class Array {
  public static void main(String[] args) {

  int num[] = { 5, 6, 7 }; // This is an already created array that contain 3 values
  int data[] = new int[4]; // This is used to create array dynamically. This is a defined array that can contain 4 values. This data contained in this array cannot go more than 4 values.

  data[0] = 2;
  data[1] = 4;
  data[2] = 6;
  data[3] = 8;
  System.err.println(data[0] + "Prints individual");

  for (int i = 0; i <= data.length - 1; i++) 
  {
    System.err.println(data[i] + "Prints list of data");
  }



    int arr[] = { 5, 6, 7, 8 };
    arr[3] = 4; // Re-assigning index [3] from value of (8) to value of (4)
    System.out.println(arr[0] + arr[3]); // Array starts from index [0] for the first value, to index [3], here for the last value
  }
}



/**
 * BILLING
 * A table called Billing Features - Where features are listed
 * Another table called Billing Pricing - Pricing I guess for each feature
 * Another table Billing Feature Pricing - which contains the monthly, annually, quaterly and biannually pricing, and the particular feature they are referencing.
 * Billings table that contains the Billing details of each user, like the number of features, the frequency, like is it monthly or annually,status, is it active or inactive, and number of users.
 * 
 * 
 * BLOCKING A USER FROM ACCESSING A FEATURE THEY DID NOT PAY FOR
 * A middleware called [subscribeForFeature] - when a user pays, he is saving the feature the user paid for. The middleware is on every route to check if the user has access to the so called subscribed feature. Which can either allow the user to pass or return an error .
 * 
 * POST SUBSCRIPTION HANDLING
 * The feature to calculate the post subscription is there too. 
 */
