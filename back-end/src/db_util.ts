const mysql = require("mysql");
import { Log } from "./log";

class DB {
  private static _instance: DB;
  public static get(): DB {
    if (!DB._instance) {
      DB._instance = new DB();
    }

    return DB._instance;
  }

  private getSetup() {
    var fs = require("fs");
    var setup_file = "./setup.json";
    if (fs.existsSync(setup_file)) {
      var setup_json = fs.readFileSync(setup_file).toString();
      var setup = JSON.parse(setup_json);
      return setup;
    } else
      return {
        host: "envi-konsulting.kylos.pl",
        port: "3306",
        user: "envikons_taryfy",
        password: "sUt6!ARpdvuq",
        database: "envikons_taryfy",
        multipleStatements: true,
      };
      // return {
      //   host: "localhost",
      //   user: "root",
      //   password: "",
      //   database: "envi_taryfy",
      //   port: "3306",
      //   multipleStatements: true,
      // };
  }
  private _counter: number;
  constructor() {
    Log(0, "DB.constructor ");
    this._counter = 0;
  }

  public escape = (text: any): string => {
    return mysql.escape(text);
  };

  async crateDB(callback?: (error: any, results: any) => void) {
    Log(0, "crateDB");
    let db_setup = this.getSetup();
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

  public executeGetResult(query: string) {
    let counter = ++this._counter;
    Log(0, "DB.executeGetResult " + counter + " query: " + query);
    return new Promise((resolve, reject) => {
      let connection = mysql.createConnection(this.getSetup());
      connection.connect((connection_error) => {
        if (connection_error) {
          Log(
            0,
            "DB.executeGetResult " + counter + " connection_error: ",
            connection_error
          );
          reject(connection_error);
        } else {
          Log(0, "DB.executeGetResult " + counter + " connection ok");
          connection.query(query, (error, result) => {
            Log(0, "DB.executeGetResult " + counter + " error: ", error);
            Log(0, "DB.executeGetResult " + counter + " results: ", result);
            connection.end();
            if (error) reject(error);
            else resolve(result);
          });
        }
      });
    });
  }

  public async executeSync(
    query: string,
    res?: any,
    callback?: (error, result) => any
  ) {
    let counter = ++this._counter;
    Log(0, "DB.executeAsync " + counter + " query: " + query);
    let connection = mysql.createConnection(this.getSetup());
    connection.connect((connection_error) => {
      if (connection_error) {
        Log(
          0,
          "DB.executeAsync " + counter + " connection_error: ",
          connection_error
        );
        res &&
          res.status(500).json({
            message: "Databasa error: " + connection_error,
          });
        if (callback) return callback(connection_error, null);
      } else {
        connection.query(query, (error, result) => {
          //connection.query("START TRANSACTION;" + query + "; COMMIT;", (error, result) => {
          Log(0, "DB.executeAsync " + counter + " error: ", error);
          Log(0, "DB.executeAsync " + counter + " results: ", result);
          connection.end();
          //Log(0, "DB.execute fields: ", fields);
          if (error) {
            res &&
              res.status(500).json({
                message: "Databasa error: " + error,
              });
            if (callback) return callback(error, null);
          } else {
            res && res.send(result);
            if (callback) return callback(null, result);
          }
        });
      }
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
      let connection = mysql.createConnection(this.getSetup());
      try {
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
                Log(0, "DB.executeAsync in" + counter + " error: ", error);
                rejectionFunc(error);
              } else {
                Log(0, "DB.executeAsync in " + counter + " results: ", result);
                resolutionFunc(result);
              }
            });
          }
        });
      } catch (error) {
        rejectionFunc(error);
      }
    });

    Log(0, "DB.executeAsync " + counter + " before await promise: ", promise);
    await promise
      .then((result) => {
        Log(0, "DB.executeAsync " + counter + " promise then");
        res && res.send(result);
        if (callback) return callback(null, result);
        Log(0, "DB.executeAsync " + counter + " promise then after callback");
      })
      .catch((error) => {
        if (error) {
          Log(
            0,
            "DB.executeAsync " + counter + " promise catch, error:",
            error
          );
          res &&
            res.status(500).json({
              message: "Databasa error: " + error,
            });
          if (callback) return callback(error, null);
        }
      });
    Log(0, "DB.executeAsync " + counter + " after  await promise: ", promise);
    return promise;
  }

  public executeInternal(query: string) {
    let counter = ++this._counter;
    Log(0, "DB.executeInternal " + counter + " query: " + query);
    return new Promise((resolve, reject) => {
      let connection = mysql.createConnection(this.getSetup());
      connection.connect((connection_error) => {
        if (connection_error) {
          Log(
            0,
            "DB.executeInternal " + counter + " connection_error: ",
            connection_error
          );
          reject(connection_error);
        } else {
          connection.query(query, (error, result) => {
            Log(0, "DB.executeInternal " + counter + " error: ", error);
            Log(0, "DB.executeInternal " + counter + " results: ", result);
            connection.end();
            if (result) resolve(result);
            reject(error);
          });
        }
      });
    });
  }
}
let _DB: DB = DB.get();
export { _DB as DB };
