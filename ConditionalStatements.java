// 

public class ConditionalStatements {

  public static void main(String arg[])
  {
    int x = 8;
    int y = 7;
    int z = 9;
    int result = 0;

    // FIRST
    if (x > 10 && x <=20) // If this condition is true, "Hello" is printed, else "Bye" is printed. Now if we have only one statement, no need to put it in curly bracket, but if more than one statement, definitely we have to put it in a bracket.
      System.out.println("Hello");
    else
      System.out.println("Bye");
    
    // SECOND
    if ( x > y)
    {
      System.out.println(x);
       System.out.println("Thank you");
    }
    else
      System.out.println("Bye");
    

    // THIRD
    if ( x > y && x > z)
    {
      System.out.println(x);
      System.out.println("Thank you");
    }
    else if(y>x && y>z)
    {
      System.out.println("Bye");
    }
    else
    {
      System.out.println("cool");
    }


    // TERNARY OPERATOR : This helps to write if-else on one line, i.e one line code
//    if(x%2 == 0)
//      result = 10;
//    else
//      result = 20;

    result = y%2==0 ? 10 : 20;
    System.out.println(result);
  }
  
}
