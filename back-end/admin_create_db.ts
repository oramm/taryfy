import { DB } from "./src/db_util";
import { Log } from "./src/log";

(() => {
  DB.crateDB((result: any) => {
    var fs = require("fs");
    var sql = fs.readFileSync("./src/sql/create_db.sql").toString();
    Log(0, "file len: " + fs.readFileSync("./src/sql/create_db.sql").length);
    // Log(0, "sql: " + sql);
    DB.executeSQL(sql, (result) => {});
  });
})();
