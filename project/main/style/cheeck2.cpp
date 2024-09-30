#include <iostream>
#include <string> 
using namespace std;
int main(){
string name;
cout <<"Enter your name: "; 
cin >> name;
int age;
cout <<"Enter your age: "; 
cin >> age;
string city;
cout << "Enter your city: "; 
cin >> city;

cout << "Hi," << name<<", welcome to programming!" << endl;
cout << "I am " << age << " years old." << endl;
cout << "I am from"  << city << "." << endl;
return 0;
}