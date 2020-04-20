const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var router = express.Router();

import { Log } from "./log";
import { DB } from "./db_util";

router.post("/login", (req, res) => {
  Uzytkownicy.login(res, req);
});

router.post("/updateWniosek", (req, res) => {
  Uzytkownicy.updateWniosek(res, req);
});

router.post("/insert", (req, res) => {
  Uzytkownicy.insert(res, req);
});

class Uzytkownicy {
  static updateWniosek(res, req) {
    let query =
      "INSERT INTO uzytkownicy (wniosek_id) " +
      req.body.wniosek_id +
      "WHERE id=" +
      req.body.id;
    DB.executeSQL(query, result => {});
  }

  static login(res, req) {
    Log(0, "Uzytkownicy login received req.body=", req.body);
    let query = (connection: any) =>
      "SELECT * from uzytkownicy where nazwa =" +
      connection.escape(req.body.nazwa);

    DB.executeSQLSanitize(query, res, result => {
      let size: string = result.length;
      if (result.length < 1){
        Log(0, "Uzytkownicy login failed");
        return res.status(401).json({
          message: "Login failed"
        });
      }
      Log(0, "Uzytkownicy login query result[0]=", result[0]);
      bcrypt.compare(req.body.haslo, result[0].haslo, (compare_err, compare_result) => {
        Log(0, "Uzytkownicy login compare_result=", compare_result);
        Log(0, "Uzytkownicy login compare_err=", compare_err);
        if (compare_err || !compare_result) {
          Log(0, "login bcrypt compare faied");
          return res.status(401).json({
            message: "Login failed"
          });
        } else {
          const token = jwt.sign(
            {
              klient_id: result[0].klient_id,
              id: result[0].id,
              nazwa: result[0].nazwa
            },
            //todo: it is used in indes.ts, move it to one place
            "g6asdfbw4yhdfvqwe4yfg2365burthff6ui47irtfdgwgh45wv4hsdf0zq1x08lqz34r54brwer4ddwv54t67uhe5rtv",
            {
              expiresIn: "12h"
            }
          );
          return res.status(200).json({
            message: "Login successful",
            token: token
          });
        }
      });
    });
  }
  static insert(res, req) {
    Log(0, "Uzytkownicy insert received req.body=", req.body);
    let query = (connection: any) =>
      "SELECT * from uzytkownicy where nazwa =" +
      connection.escape(req.body.nazwa);

    DB.executeSQLSanitize(query, res, result => {
      let size: string = result.length;
      if (Number(size) > 0) {
        //error, user already exists
        res.json({
          message: "User already exists"
        });
      } else {
        bcrypt.hash(req.body.haslo, 10, (err, hash) => {
          if (err) {
            Log(0, "Uzytkownicy insert hash err=", err);
            return res.status(500).json({
              error: err
            });
          } else {
            let query = (connection: any) =>
              "INSERT INTO uzytkownicy (klient_id, nazwa, haslo) SELECT  \
              (SELECT id FROM klienci WHERE nazwa LIKE " +
              connection.escape(req.body.klient_id) +
              ")," +
              connection.escape(req.body.nazwa) +
              "," +
              connection.escape(hash) +
              " WHERE NOT EXISTS (SELECT * FROM uzytkownicy WHERE nazwa=" +
              connection.escape(req.body.nazwa) +
              ");";
            req.body.wniosek_id;
            DB.executeSQLSanitize(query, res, result => {
              Log(0,result);
              res.status(201).json({
                message: "User created"
              });
            });
          }
        });
      }
    });
  }

  static login_(req, res) {
    Log(0, "Uzytkownicy insert received req.body=", req.body);
  }
}

let uzytkownicyInsert = Uzytkownicy.insert;

export { router as uzytkownicyRouter, uzytkownicyInsert };
