var mysql = require("mysql");
import { Log } from "./log";

//todo: consider moving it to seperate file
let db_setup = {
  host: "localhost",
  user: "root",
  password: "",
  database: "envi_taryfy",
  port: "3306",
  multipleStatements: true,
};

//todo: refactor this class, too much code duplication

class AccessDB {
  private static _instance: AccessDB;
  private static _counter: number = 0;
  public static get(): AccessDB {
    if (!AccessDB._instance) {
      AccessDB._instance = new AccessDB();
    }

    return AccessDB._instance;
  }

  async crateDB(callback?: (results: any) => void) {
    Log(0, "crateDB _counter:", ++AccessDB._counter);
    let setup = {
      host: db_setup.host,
      user: db_setup.user,
      password: db_setup.password,
      port: db_setup.port,
      multipleStatements: db_setup.multipleStatements,
    };
    var connection = mysql.createConnection(setup);

    connection.connect((err) => {
      if (err) {
        Log(0, "db connection error: " + err.stack);
        return;
      }
      Log(0, "connected as id " + connection.threadId);
    });
    let query = "DROP DATABASE IF EXISTS " + db_setup.database + ";\
    CREATE DATABASE " + db_setup.database + ";"
    Log(0, "executing query: " + query);
    await connection.query(query, (error, results, fields) => {
      if (error) {
        Log(0, "query error", error, results);
        return;
      }
      Log(0, "query results: ", results);
      callback && callback(results);
    });

    await connection.end();    
  }

  async executeLocalSQL(query: string, callback?: (results: any) => void) {
    Log(0, "executeLocalSQL _counter:", ++AccessDB._counter);
    var connection = mysql.createConnection(db_setup);

    connection.connect(function (err) {
      if (err) {
        Log(0, "db connection error: " + err.stack);
        return;
      }
      Log(0, "connected as id " + connection.threadId);
    });

    Log(0, "executing query: " + query);

    await connection.query(query, function (error, results, fields) {
      if (error) {
        Log(0, "query error", error, results);
        return;
      }
      Log(0, "query results: ", results);
      callback && callback(results);
    });

    await connection.end();
  }

  executeSQL(query: string, callback?: (results: any) => void) {
    Log(0, "ececuteSQL _counter:", ++AccessDB._counter);
    var connection = mysql.createConnection(db_setup);

    connection.connect(function (err) {
      if (err) {
        Log(0, "db connection error: " + err.stack);
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
      callback && callback(results);
    });

    connection.end();
  }

  //todo: add error return and use in in code
  executeSQLSanitize(
    query: (connection: any) => string,
    res: any,
    callback: (results: any) => void
  ) {
    Log(0, "ececuteSQLSanitize _counter:", ++AccessDB._counter);
    var connection = mysql.createConnection(db_setup);
    connection.connect(function (err) {
      if (err) {
        Log(0, "databasa connection error: " + err.stack);
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
