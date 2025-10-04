// This is used when we want to do some things repeatedly, when we meet certain conditions. We have [while loop, do while loop and for loop]
public class Loops {
  public static void main(String[] a)
  {
    // // Simple While Loop
    // int i = 1;
    // while(i <= 4)
    // {
    //     System.out.println("Count " + i); // will print from 1 to 4
    //     i++;
    // }
    // System.out.println("End " + i); // 5

    // Simple while loop with an inner loop
    int x = 1;

      while(x <= 7)
      {
        System.err.println("Day :" + x);
        int j = 1;

        while(j<=24)
        {
            System.err.println("Time :" + j);
            j++;
        }
        x++;
      }
    System.out.println("Beginning of week " + x);

  }
}
