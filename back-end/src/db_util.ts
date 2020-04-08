var mysql = require("mysql");
import { Log } from "./log";

class AccessDB {
  private static instance: AccessDB;
  public static get(): AccessDB {
    if (!AccessDB.instance) {
      AccessDB.instance = new AccessDB();
    }

    return AccessDB.instance;
  }

  ececuteSQL(query: string, callback: (results: any) => void) {
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "envi_taryfy",
      multipleStatements: true,
    });

    connection.connect(function (err) {
      if (err) {
        console.error("db connection error: " + err.stack);
        return;
      }
      Log(0, "connected as id " + connection.threadId);
    });

    Log(0, "executing query: " + query);

    connection.query(query, function (error, results, fields) {
      if (error) {
        Log(0, "query error", error, results);
        return;
      }
      Log(0, "query results: ", results);
      callback(results);
    });

    connection.end();
  }
  //todo: add error return and use in in code
  ececuteSQLSanitize(
    query: (connection: any) => string,
    res: any,
    callback: (results: any) => void
  ) {
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "envi_taryfy",
      multipleStatements: true,
    });

    connection.connect(function (err) {
      if (err) {
        Log(0,"databasa connection error: " + err.stack);
        return res.status(500).json({
          message: "Databasa connection error.",
        });
      }
      Log(0, "connected as id " + connection.threadId);
      Log(0, "executing query: " + query(connection));
      connection.query(query(connection), function (error, results, fields) {
        if (error) {
          Log(0, "query error: ", error);
          return res.status(400).json({
            message: "Invalid query.",
          });
        }
        Log(0, "query results: ", results);
        Log(0, "results.insertId: ", results.insertId);
        callback(results);
      });
      connection.end();
    });
  }
}

let DB: AccessDB = AccessDB.get();

export { DB };
