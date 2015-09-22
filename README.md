# fstream-ignore

A fstream DirReader that filters out files that match globs in `.ignore`
files throughout the tree, like how git ignores files based on a
`.gitignore` file.

Here's an example:

```javascript
var Ignore = require("fstream-ignore")
Ignore({ path: __dirname
       , ignoreFiles: [".ignore", ".gitignore"]
       })
  .on("child", function (c) {
    console.error(c.path.substr(c.root.path.length + 1))
  })
  .pipe(tar.Pack())
  .pipe(fs.createWriteStream("foo.tar"))
```

This will tar up the files in __dirname into `foo.tar`, ignoring
anything matched by the globs in any .iginore or .gitignore file.

## Global ignore

It's also possible to specify a "global" ignore file that doesn't have
to be in the traversed tree, akin to the global gitignore file:

```javascript
Ignore({ path: __dirname
       , ignoreFiles: [".ignore", ".gitignore"]
       , globalIgnoreFile: "/home/user/.gitignore"
       })
```

The rules from that file (if it's present) will be added before any
other rules.
