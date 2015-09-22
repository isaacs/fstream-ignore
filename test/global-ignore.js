var IgnoreFile = require("../")
, path = require('path')

// set the ignores just for this test
var c = require("./common.js")
c.ignores({ ".ignore": ["c"] })
c.ignores({ "c/b/a/.ignore": ["*", "a", "b", "!a/b/a/.abc", "!a/b/c/.abc"
                             , "!/c/a/b/.abc"] })

// the only files we expect to see
var expected =
  [ "/a/b/a/.abc"
  , "/a"
  , "/a/b"
  , "/a/b/a"
  ].map(path.normalize)
// "!a/b/c/.abc" will be shadowed by "c" from the ".ignore" file
// likewise "c/a/b/.abc" will also be ignored

require("tap").test("basic ignore rules", function (t) {
  t.pass("start")

  IgnoreFile({ path: __dirname + "/fixtures"
             , globalIgnoreFile: "c/b/a/.ignore" })
    .on("child", function (e) {
      var p = e.path.substr(e.root.path.length)
      var i = expected.indexOf(p)
      if (i === -1) {
        t.fail("unexpected file found", {f: p})
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
