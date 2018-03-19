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
/topologicalSort/path
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