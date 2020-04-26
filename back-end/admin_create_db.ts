import { DB } from "./src/db_util";
import { Log } from "./src/log";

(async () => {
  await DB.crateDB(async (error, result) => {
    if (error) {
      Log(0, "Błąd - nie udało się założyć bazy: ", error);
    } else {
      var fs = require("fs");
      var sql = fs.readFileSync("./src/sql/create_db.sql").toString();
      Log(0, "file len: " + fs.readFileSync("./src/sql/create_db.sql").length);
      // Log(0, "sql: " + sql);
      await DB.execute(sql);
    }
  });
})();
