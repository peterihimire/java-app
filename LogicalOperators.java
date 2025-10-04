// Logical Operators are the way of combining two or more relational operators, using  [ && => [AND operator] or || => [OR operator] or ! => [NOT operator]]
// For AND operator [&&], both sides has to be true to return true, If any side returns false, then it will be false. [T T = T; T F = F; F T = F; F F = F]. If we have a requirement that only when both side is true, that we want to return true, then AND operator can work in this case

// For OR operator [||] if any side has true, it will return true, if both sides has false then it will return false. [T T = T; T F = T; F T = T; F F = F]. Now if we have a requirement that if any side is true then we return true, the OR operator can work in that case.

// For the NOT operator[!] , it us used to negate or reverse. For example if you want the reverse of true to be false, one can use the not operator. T -> F, F -> T. [s = !r]. Assume s = TRUE, because of [!r] the value will change to FALSE.

// SHORT CIRCUIT : Let say we have these two expressions [result = x > y && a < b], now we want both  expressions to be TRUE. If both are TRUE it will return true. Now what if we replace the expression with OR Operator [result = x > y || a < b], now what this means is that if any of the expression is TRUE or even if we have one TRUE or if the First expression is TRUE, it will not bother to check the second one, then the result will be TRUE. This is called a SHORT CIRCUIT, time is being saved. Now lets go back to the first expression, if [result = x > y && a < b], now what if we want the result to be TRUE, now if any of the expression is FALSE, of course we know the result will be false, hence no need to check the second expression. This also explains the SHORT CIRCUIT  idea. 
public class LogicalOperators {
  public static void main (String arg[]){
    int x = 7;
    int y = 5;
    int a = 5;
    int b = 9;

    boolean result = x > y && a > b;
    System.out.println(result); //FALSE

     boolean result2 = x > y && a < b;
    System.out.println(result2); //TRUE

     boolean result3 = x > y || a < b;
     System.out.println(result3); //TRUE

      boolean result4 = a > b;
    System.out.println(!result4); //TRUE
  }
}
