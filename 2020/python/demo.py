# str = 'Hello World'
# print(str)
def fib(n):
	a,b = 0,1
	while(b < n):
		print(b, end = ' ')
		a,b = b, a + b
	print()
fib(100)
from math import pi
print(pi)

for x in range(2,100):
	for n in range(2, x):
		if(x % n == 0):
			break
	else:
		print(x, end=',');
print([str(round(pi, i)) for i in range(1,5)])
