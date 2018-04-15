---
title: Fun with lists (in R)
date: '2018-04-15'
slug: fun-with-lists
categories:
  - programming
tags: [R]
authors: ["muniftanjim"]
toc: true
---

I came across [this](http://matthiaseisen.com/fwl/py/) post by _Matthias Eisen_ which contains some useful snippets to work with lists in Python. Inspired by the same, I decided to document some R functions for a similar set of operations. Though some of them are simple, one liners, I learned a trick or two while creating this list. 

A list in python resembles closely with a vector in R which is a homogenous(members of same type) 1 dimensional data structure. A list in R is a hetrogenous(can have members of different types) data structure or can be thought of as a structure that may contain object of any other types. Most functions below are written for vectors, though can be extended easily for lists as well. 

## 1 Removing Elements

### 1.1 All values equal to x
```r
x <- 4
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(a[a != x])
```

> [1] 1 2 3 5 6 1

### 1.2 Duplicates
```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(unique(a))
```

> [1] 1 2 3 4 5 6

```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
row.names(table(a))
```

> [1] "1" "2" "3" "4" "5" "6"

### 1.3 First element
```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(a[2:length(a)])
```
> [1] 2 3 4 4 5 6 1 4

```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(a[-1])
```
> [1] 2 3 4 4 5 6 1 4

### 1.4 Last element

```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(a[1:(length(a) - 1)])
```
> [1] 1 2 3 4 4 5 6 1

```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(a[-length(a)])
```
> [1] 1 2 3 4 4 5 6 1

### 1.5 nth element
```r
n <- 3
a  <-  c(1L, 2L, 3L, 4L, 5L, 6L)
print(a[c(1:(n - 1), (n + 1):length(a))])

n <- 3
a  <-  c(1L, 2L, 3L, 4L, 5L, 6L)
r <- c()
for (i in seq_along(a)) {
  if (i != n)
    r <- c(r, a[[i]])
}
print(r)
```
> [1] 1 2 4 5 6

## 2 Replacing Elements

### 2.1 All values equal to x
```r
x <-  4
a <- c(1L, 2L, 3L, 44L, 4L, 5L, 6L, 1L, 4L)
a[a==x] <- 0
print(a)
```
> [1]  1  2  3 44  0  5  6  1  0

```r
x <-  4
a <- c(1L, 2L, 3L, 44L, 4L, 5L, 6L, 1L, 4L)
print(as.numeric(gsub(x,0,a)))
# print(as.numeric(sub(x,0,a))) - Do you know the difference ?
```
> [1] 1 2 3 0 0 5 6 1 0

### 2.2 First element
```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
a[1] <- 0
print(a)
```
> [1] 0 2 3 4 4 5 6 1 4

```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(c(0,a[2:length(a)]))
```
> [1] 0 2 3 4 4 5 6 1 4

### 2.3 Last element
```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
a[length(a)] <- 0
print(a)
```
> [1] 1 2 3 4 4 5 6 1 0

```r
a <- c(1L, 2L, 3L, 4L, 4L, 5L, 6L, 1L, 4L)
print(c(a[1:(length(a)-1)],0))
```
> [1] 1 2 3 4 4 5 6 1 0

### 2.4 nth element
```r
n  <-  3
a  <-  c(1L, 2L, 3L, 4L)
a[n] <- 0
print(a)
```
> [1] 1 2 0 4

```r
n  <-  3
a  <-  c(1L, 2L, 3L, 4L)
for(i in seq_along(a)){
  if(i == n){
    a[i] <- 0
  }
}
print(a)
```
> [1] 1 2 0 4

## 3 Sorting

### 3.1 Alphabetically
```r
a  <- c("d", "C", "B", "a")
print(sort(a))
```
> [1] "a" "B" "C" "d"

```r
a  <- c("d", "C", "B", "a")
print(a[order(a)])
```
> [1] "a" "B" "C" "d"

### 3.2 Alphabetically (case-sensitive) - Work out

### 3.3 Strings by length
```r
a <- c("aaaa", "B", "CCC", "dd")
names(sort(vapply(a,nchar,1)))
```
> [1] "B"    "dd"   "CCC"  "aaaa"

## 4 Other

### 4.1 Add up all values in a vector of numbers
```r
a <-  c(1, 2.5, 7, 13221, 4.6545)
b <-  sum(a)
print(b)
```
> [1] 13236.15

### 4.2 Append to a list
```r
a <- c(1L, 2L, 3L)
a <- c(a,4L)
print(a)
```
> [1] 1 2 3 4

### 4.3 Apply a function to every vector element

```r
## Declaring functions
echo_fun <- function(x){return(x)}
sq_fun <- function(x){return(x^2)}  
```

```r
a <- c(1L, 2L, 3L)
vapply(a,sq_fun,1)
```
> [1] 1 4 9

```r
unlist(purrr::map(a,sq_fun))
```
> [1] 1 4 9

### 4.4 Cartesian product of n lists
```r
a <- c(1L, 2L, 3L)
b <- c(4L, 5L, 6L)
c <- c(7L, 8L, 9L)
expand.grid(a,b,c)
```

### 4.5 Check if 2 lists have at least 1 common element
```r
a <- c(1L, 2L, 0L)
b <- c(3L, 1L, 4L)

ifelse(length(intersect(a,b)) > 0,TRUE,FALSE)
```
> [1] TRUE

### 4.6 Check if a list contains the value x
```r
a <- c(1, 2.5, 7, 13221, 4.6545)
if(7  %in%  a) print('yes') else print('no')
```
> [1] "yes"

### 4.7 Count the number of times x appears in a list
```r
a <- c(1, 2.5, 7, 13221, 4.6545, 7)
as.vector(table(a[a==7]))
```
> [1] 2

### 4.8 Difference of 2 lists
```r
a <- c(1L, 2L, 3L, 4L)
b <- c(3L, 4L, 5L, 6L)
setdiff(a,b)
```
> [1] 1 2

### 4.9 Difference of n lists
```r
a  <- c(1L, 2L, 3L, 4L)
b <-  list(c(3L, 5L, 6L, 7L), c(1L, 8L, 9L, 10L))

# To solve - a - b[[1]] - b[[2]]
for(i in seq_along(b)){
  if(i == 1){
    diff_list <- setdiff(a,b[[i]])  
  } else {
    diff_list <- setdiff(diff_list,b[[i]])  
  }
}
print(diff_list)
```
> [1] 2 4

### 4.10 First n elements of a list
```r
n <- 2
a <- c(1L, 2L, 3L, 4L, 5L, 6L)
print(a[1:n])
```
> [1] 1 2

### 4.11 First n non-x elements of a list
```r
n <- 3
x <-  2
a <- c(1L, 2L, 2L, 3L, 2L, 2L, 2L, 4L, 5L, 6L)
b <- a[a != x]
print(b[1:n])
```
> [1] 1 3 4

### 4.12 Flatten a list of lists
```r
a  <-  list(c(1L, 2L, 3L), c(4L, 5L, 6L), c(7L, 8L, 9L))
print(unlist(a))
```
> [1] 1 2 3 4 5 6 7 8 9

### 4.13 Insert x after the first occurence of y
```r
x <-  4
y <-  6
a <- c(1L, 2L, 3L, 5L, 3L, 6L, 2L)
b <- tryCatch({
  pos <- which(a == y)[[1]]
  a <- c(a[1:pos], x, a[(pos + 1):length(a)])
},
error = function(e) {
  c(a,x)
})
print(b)
```
> [1] 1 2 3 5 3 6 4 2

### 4.14 Iterate over every other element of a list
```r
a <- c(1L, 2L, 3L, 4L, 5L, 6L)
print(a[seq(1,length(a),2)])
```
> [1] 1 3 5

### 4.15 Iterate over index/value pairs of a list  
```r
a <- c(1, 2.5, 7, 13221, 4.6545)
for(i in seq_along(a)){
  print(glue::glue("{i}: {a[[i]]}"))
}
```
> 1: 1

> 2: 2.5

> 3: 7

> 4: 13221

> 5: 4.6545

### 4.16 Iterate over the elements of a list
```r
a <- c(1L, 2L, 3L, 4L)
for(x in a){
  print(x)
} 
```
> 1

> 2

> 3

> 4

### 4.17 Permutations of list elements
```r
x <- c('a','b','c')

all_combinations <- function(vector_to_permute){
  label_list <- seq(1,length(vector_to_permute))
  y <- data.frame(permute::allPerms(label_list))
  for(i in 1:nrow(y)){
    for(j in 1:ncol(y)){
      y[i,j] <- vector_to_permute[label_list == y[i,j]]
    }
  }
  z <- c(paste0(vector_to_permute,collapse = ''),apply(y, 1, paste0, collapse = ''))
  return(z)
}

print(all_combinations(x))
```
> [1] "abc" "acb" "bac" "bca" "cab" "cba"

### 4.18 Reverse the order of a list
```r
a <- c(1L, 2L, 3L, 4L)
print(a[length(a):1])
```
> [1] 4 3 2 1

### 4.19 Symmetric difference of 2 lists
```r
a <- c(1L, 2L, 3L, 4L)
b <- c(3L, 4L, 5L, 6L)

print(c(setdiff(a,b),setdiff(b,a)))
```
> [1] 1 2 5 6

### 4.20 Symmetric difference of n lists
```r
a  <-  list(c(1L, 2L, 3L, 4L), c(3L, 4L, 5L, 6L), c(1L, 5L, 7L, 8L))
b <- unlist(a)
c <- table(b)
print(as.numeric(names(c)[c == 1]))
```
> [1] 2 6 7 8

```r
library(magrittr)
a  <-  list(c(1L, 2L, 3L, 4L), c(3L, 4L, 5L, 6L), c(1L, 5L, 7L, 8L))
x <- unlist(a) %>% table %>% data.frame %>% dplyr::filter(`Freq` == 1)
print(as.numeric(as.character(x[,1])))
```
> [1] 2 6 7 8

### 4.21 Union of 2 lists
```r
a <- c(1L, 2L, 3L, 4L)
b <- c(3L, 4L, 5L, 6L)

union(a, b)
```
> [1] 1 2 3 4 5 6

### 4.22 Union of n lists
```r
a  <-  list(c(1L, 2L, 3L, 4L), c(3L, 4L, 5L, 6L), c(1L, 5L, 7L, 8L))
for(i in length(a)){
  if(i == 1 && length(a) > 1) {
    union_list <- union(a[[i]], a[[i + 1]])
  } else {
    union_list <- union(union_list,a[[i]])
  }
}
print(union_list)
```
> [1] 1 2 3 4 5 6 7 8

### 4.23 Zero-pad a list from the left
```r
max_length = 10
a  <-  c(1L, 2L, 3L, 4L)
print(c(rep(0, (max_length - length(a))), a))
```
> [1] 0 0 0 0 0 0 1 2 3 4

### 4.24 Zero-pad a list from the right
```r
max_length = 10
a  <-  c(1L, 2L, 3L, 4L)
print(c(a,rep(0, (max_length - length(a)))))
```
> [1] 1 2 3 4 0 0 0 0 0 0