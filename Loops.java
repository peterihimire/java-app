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

      // // Nexted while  loop with an inner loop
      // int x = 1;

      // while(x <= 7) // If this condition is true, this block will execute, else it will exit the below block
      // {
      // System.err.println("Day :" + x);
      // int j = 1;

      // while(j<=24)
      // {
      //     System.err.println("Time :" + j);
      //     j++;
      // }
      // x++;
      // }
      // System.out.println("Beginning of week " + x);

      // // Do-while loop - executes the block at least ones.
      // int i = 5; // If this condition is false it will execute the block ones.

      // do
      // {
      //     System.out.println("Count " + i);
      //     i++;
      // } while (i <= 4);

      // // For loop 
      // // Initialization, condition and increment

      // for (int i = 1; i <= 4; i++)
      // {
      //     System.out.println("Count " + i);
      // }

      // // Another way to write the for loop
      // int i = 1;
      //     for (; i <= 4;)
      //     {
      //         System.out.println("Count " + i);
      //         i++;
      //     }

      // Nexted For loop
      // Initialization, condition and increment

    for (int i = 1; i <= 7; i++)
    {
        System.out.println("Day " + i);

        for (int j = 1; j <= 9; j++)
        {
            System.out.println("Time " + (j+8) + "-" + (j+9));
        }
    }
  }
}
