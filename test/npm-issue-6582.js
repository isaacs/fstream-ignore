var IgnoreFile = require("../")

var c = require("./common.js")
c.ignores({ ".ignore": ["*", "!a/b/c/.abc", "c/b/a/bbb", "!def"] })

var expected =
  [ "/a/b/c/.abc"
  , "/a"
  , "/a/b"
  , "/a/b/c"
  , "/c"
  , "/c/b"
  , "/c/b/a"
  , "/c/b/a/bbb" ]

require("tap").test("npm issue #6582 regression test", function (t) {
  t.pass("start")

  IgnoreFile({ path: __dirname + "/fixtures"
             , ignoreFiles: [".ignore"] })
    .on("ignoreFile", function (e) {
      console.error("ignore file!", e)
    })
    .on("child", function (e) {
      var p = e.path.substr(e.root.path.length)
      var i = expected.indexOf(p)
      if (i === -1) {
        t.fail("unexpected file found", {file: p})
      } else {
        t.pass(p)
        expected.splice(i, 1)
      }
    })
    .on("close", function () {
      t.notOk(expected.length, "all expected files should be seen")
      t.end()
    })
})
