const mysql = require("mysql");
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

class DB {
  private static _instance: DB;
  public static get(): DB {
    if (!DB._instance) {
      DB._instance = new DB();
    }

    return DB._instance;
  }

  private _counter: number;
  constructor() {
    Log(0, "DB.constructor ");
    this._counter = 0;
  }

  public escape = (text: string): string => {
    return mysql.escape(text);
  };

  async crateDB(callback?: (error: any, results: any) => void) {
    Log(0, "crateDB");
    let setup = {
      host: db_setup.host,
      user: db_setup.user,
      password: db_setup.password,
      port: db_setup.port,
      multipleStatements: db_setup.multipleStatements,
    };
    let query =
      "DROP DATABASE IF EXISTS " +
      db_setup.database +
      ";\
    CREATE DATABASE " +
      db_setup.database +
      ";";
    return await this.execute(query, null, (error, results) => {
      callback && callback(error, results);
    });
  }

  public async execute(
    query: string,
    res?: any,
    callback?: (error, result) => any
  ) {
    return this.executeAsync(query, res, callback);
  }

  public async executeAsync(
    query: string,
    res?: any,
    callback?: (error, result) => any
  ) {
    let counter = ++this._counter;
    Log(0, "DB.executeAsync " + counter + " query: " + query);
    let promise = new Promise((resolutionFunc, rejectionFunc) => {
      let connection = mysql.createConnection(db_setup);
      connection.connect((connection_error) => {
        if (connection_error) {
          Log(
            0,
            "DB.executeAsync " + counter + " connection_error: ",
            connection_error
          );
          rejectionFunc(connection_error);
        } else {
          connection.query(query, (error, result) => {
            //connection.query("START TRANSACTION;" + query + "; COMMIT;", (error, result) => {
            Log(0, "DB.executeAsync " + counter + " error: ", error);
            Log(0, "DB.executeAsync " + counter + " results: ", result);
            connection.end();
            //Log(0, "DB.execute fields: ", fields);
            if (error) {
              rejectionFunc(error);
            } else {
              resolutionFunc(result);
            }
          });
        }
      });
    })
      .then((result) => {
        Log(0, "DB.executeAsync " + counter + " promise then");
        res && res.send(result);
        if (callback) return callback(null, result);
        Log(0, "DB.executeAsync " + counter + " promise then after callback");
      })
      .catch((error) => {
        Log(0, "DB.executeAsync " + counter + " promise catch");
        res &&
          res.status(500).json({
            message: "Databasa error: " + error,
          });
        if (callback) return callback(error, null);
      })
      .finally(() => {
        Log(0, "DB.executeAsync " + counter + " promise finally");
      });

    Log(0, "DB.executeAsync " + counter + " before await promise: ", promise);
    await promise;
    Log(0, "DB.executeAsync " + counter + " after  await promise: ", promise);
    return promise;
  }
}
let _DB: DB = DB.get();
export { _DB as DB };
