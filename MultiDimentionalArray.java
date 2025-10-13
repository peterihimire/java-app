/**
 * This returns a two dimentional array also known as array of array. 3 rows, 4 columns.
 * */
public class MultiDimentionalArray {
  public static void main(String[] arg)
  {
    int arr[][] = new int[3][4]; // Two dimentional array
    int arrr[][][] = new int[3][4][9]; // Three dimentional array

    //    JAGGED ARRAY -
    int nums[][] = new int[3][]; // This is called a Jagged Array - Below for each of the column we are specifying the size.
    nums[0] = new int[3]; // First row is 3 columns
    nums[1] = new int[4]; // Second row is 4 columns
    nums[2] = new int[2]; // Third row is 2 columns

    //    For loop
    for(int i = 0; i < 3; i++)
    {
      for(int j = 0; j < 4; j++)
      {
    //      System.out.print(arr[i][j] + " "); // This prints the shape of the objects row and column and assings 0 to them.
        arr[i][j] = (int)(Math.random() * 10); // This returns a float, had to type cast it to integer
        System.out.print(arr[i][j] + " ");
      }
      System.out.println();
    }

    //    Enhanced for loop - just another way of working with for loops
    for(int n[] : arr)
    {
      for(int m: n)
      {
        System.out.print(m + " ");
      }
      System.out.println();
    }

    // To print out the Jagged array
    for(int i = 0; i < nums.length; i++)
    {
      for(int j = 0; j < nums[i].length; j++)
      {
        System.out.print(arr[i][j] + " ");
      }
      System.out.println();
    }

    //    Using Enhanced for loop to print out a jagged array
    for(int n[] : nums)
    {
      for(int m: n)
      {
        System.out.print(m + " ");
      }
      System.out.println();
    }

    //    Another for loop - Listing all the numbers in a straight line
    for(int i = 0; i < 3; i++)
    {
      for(int j = 0; j < 4; j++)
      {
        System.out.print(arr[i][j] + " ");
      }
    }


  }
}
