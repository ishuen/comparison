 readme
====

Compare the ranking results coming from different methods.

## usage

for develop environment

```
# win system
npm run start

# linux/ unix
npm run start-u
```

for production

```
# win system
npm run prod

# linux/ unix
npm run prod-u
```
For ubicomp web server: local branch reverseProxy, dev environment

## web

Each experiment has 2 environment, one for MTurk worker and the other for IVLE students.

* se: exp 1 for IVLE
* sf: exp 2 for IVLE
* int: exp 1 for MTurk
* ins: exp 2 for MTurk
* inu: newer exp 2 for MTurk (not yet released)
* inw: newer exp 1 for MTurk


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

## How to decide thresholds of topological sort

* threLower: The path will not include the point(health_value, taste_value) if a*health_value + b*teaste_value < threLower 
* threUpper: The path will connect the point(health_value, taste_value) on both sides(connect it twice) if a*health_value + b*teaste_value > threUpper
* For now, a = 0.5, b = 0.5, they represent the importance of taste and health.
* Usually, threLower can be 1 to 1.5, and threUpper can be 6 to 7. It depends on the distribution of input data.