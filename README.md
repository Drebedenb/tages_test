This project contains two main files.

## linuxSolution.js

NodeJS is using linux `sort` command to create many files possible for handling and sorting by machine RAM. 
After that files will be merged and sorted in one big file. 

## index.js

Solution of problem on pure Node. For the best results in time you need to adjust `RAM_SIZE` inside 
of `index.js` file. Solution uses `workers`.

---
## Other solutions witn npm modules

There are solutions with modules in node js. But i don't use them because they are similar to linux solution (and also slower). Modules i tried are 
[external-sorting](https://www.npmjs.com/package/external-sorting) and
[large-sort](https://www.npmjs.com/package/large-sort)
