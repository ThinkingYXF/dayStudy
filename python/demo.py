str = 'Hello World'
print(str)
def fib(n):
	a,b = 0,1
	while(b < n):
		print(b, end = ' ')
		a,b = b, a + b
	print()
fib(100)
from math import pi
print(pi)
