// 

public class Operators {
  public static void main (String args[])
  {
    int num = 2;
    int numb = 2;
    int num1 = 7;
    int num2 = 5;


    int addOperator = num1 + num2;
    int subOperator = num1 - num2;
    int mulOperator = num1 * num2;
    int divOperator = num1 / num2; // 1 ; Here we are getting the quotient not a remainder
    int modOperator = num1 % num2; // 2 ; This will give us the remainder

    num1 = num1 + 2; // when adding a variable by itself, we can use a shortcut.

    num1 += 2; // this is the shortcut . We can also use that with other operators;
    num1 *= 2; // same as num1 = num1 * 2;
    num1 -= 2; // same as num1 = num1 - 2;
    num1 /= 2; // same as num1 = num1 / 2;

    num1++; // This is called Post Increment.
    num1--; // This is called Post Decrement. 
    ++num1; // Pre Increment
    --num1; // Pre Decrement

 

    System.out.println(addOperator);
    System.out.println(subOperator);
    System.out.println(mulOperator);
    System.out.println(divOperator);
    System.out.println(modOperator);
    System.out.println(num1); // 11


    // num++ and ++num behave differently when value is assigned to them. When you try to get the value from them when performing operation they behave differently. 
    int result = num++; // This will fetch the value of num and then increment hence 2  
    int resultt = ++numb; // This will increment before fetching the value hence 3
    
    System.out.println(result); // num++ retains 2
    System.out.println(resultt); // ++num increments to 3
    
  }
}
