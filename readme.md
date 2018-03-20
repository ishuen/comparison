readme
====

Compare the ranking results coming from different methods.

## usage

for develop environment

```
npm run start
```

for production

```
npm run prod
```

## genetic sort

```
/geneticSort/data
/geneticSort/path
```

## topological sort

```
/topologicalSort/data
/topologicalSort/path/random/:number/:threLower/:threUpper
```

## notice

* impement MVC structure
* no database connection, only use csv as data input
* apply es6 standard: If the code doesn't follow it, git commit will be blocked. When you finish correcting the code, you have to use the command **git add .** and then commit again.
* when developing new pages or functions, please create a new branch and then merge after developing
* when finish editing apidoc, run **npm run apidoc**
* the completed API can be checked on apidoc **\<hostname\>:\<port\>/apidoc**

## for other contributors - topological sort

What you have to do in this phase is separate your original html page into 3 parts:

1. topologicalSort.pug: Show the graph of the candidate items and the edges between them
2. table.pug: Show the original data and the rank corresponding to the items in the graph
3. controllers/topologicalSort: Modify the showPath function and send the necessary data to the page by render. The const data is an array of objects which contains the original food data.

* You can modify the css file as you want.
###How to decide thresholds
```
threLower: The path will not include the point(health_value, taste_value) if a*health_value + b*teaste_value < threLower 
threUpper: The path will connect the point(health_value, taste_value) on both sides(connect it twice) if a*health_value + b*teaste_value > threUpper
For now, a = 0.5, b = 0.5, they represent the importance of taste and health.
Usually, threLower can be 1 to 1.5, and threUpper can be 6 to 7. It depends on the distribution of input data.
```
