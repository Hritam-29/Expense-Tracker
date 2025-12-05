arr = [1,0,5,0,0,3] 

p = 0   

for i in range(len(arr)): 

    if arr[i] != 0: 

        arr[p] = arr[i] 

        p += 1 

while p < len(arr): 

    arr[p] = 0 

    p += 1 

print(arr) 