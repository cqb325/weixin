/**
 * Created by cqb32_000 on 2015-12-12.
 */
var fs = require("fs");

module.exports = {

    readFile: function(uri){
        return fs.readFileSync(uri, "utf8");
    },

    writeFile: function(uri, content){
        fs.writeFileSync(uri, content, "utf8");
    }
};