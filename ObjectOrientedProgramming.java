// OBJECT ORIENTED PROGRAMMING
// CLASS, OBJECT, METHOD OVERLOADING,

// The class is the blueprint
class Calculator
{
  public int add(int n1, int n2) // this should return and int value
  {
    int response = n1 + n2;
    return response;
  }
  
  /**
  *  METHOD OVERLOADING: 
  *  Same method name, but different parameters can be passed. In this way we don't have to change the methods name. For example addTwo(n1,n2) or addThree(n1,n2,n3). However if we must pass the same amount of parameter, it must be of a different return type
  */ 
  public int add(int n1, int n2, int n3, int n4) 
  {
  return n1 + n2 + n3 + n4;
  }
  
  public int add(int n1, int n2, int n3) // same number of parameter for below, but different return type. return type here is int.
  {
  return n1 + n2 + n3;
  }
  
  public double add( double  n1, int n2, int n3) // same number of parameter for above, but different return type. return type here is double.
  {
   return n1 + n2;
  }

}




public class ObjectOrientedProgramming {
  public static void main(String[] args) // main is the start of execution.
  {
    int num1 = 2;
    int num2 = 4;
    int num3 = 5;

    Calculator calc = new Calculator(); // This is the object created based on the calculator class which is the blueprint and it is assigned to the variable calc.
    int result = calc.add(num1,num2, num3);
    System.out.println(result);
  }
}
