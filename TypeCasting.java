// Type Conversion and Casting and Type promotion => Casting is whenever we do explicit convertion, however implicit happens when we did not do it on our own. Unfurtunately we can't change the type of a variable, however we can assing a value to the type.

public class TypeCasting {
    public static void main(String[] args)
  {
    byte b = 127; // max it can take 
    int a = 12;

    // b = a; // casting int a into byte will cause a problem, because  int range is higher than byte, therefore it cannot accomodate the range.
    b = (byte) a; // Explicit Casting, we did it on our own. If we still need to force it, this will work
    System.out.println(b);
     
    a = b; // Implicit Casting, does it internally. However casting byte into int will work because int range is higher than byte
    System.out.println(a); // 12

    int v = 257;
    byte c = (byte) v; // The value we are trying to convert to byte is higher than its supported range, therefore it will print its modulus [%] which is 1. What is happening here is that it will divide 257 by 256 which is the byte range, then it will return the modulus which is one.
    System.out.println(c); // 1
    
    float f = 5.6f;
    // int x = f; // This will not work we have to use type casting.
    int x = (int) f; // Now because of the conversion, you will loose the [.6], x will become 5
    System.out.println(x);

    byte p = 10;
    byte g = 30;

    int s = p * g; // Here the range is now greater than byte range of 256, so the result is promoted to int value
    System.out.println(s);
    
  }
}
