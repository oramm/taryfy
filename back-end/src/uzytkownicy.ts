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

// this functionality is only available via script admin_add_user
// router.post("/insert", (req, res) => {
//   Uzytkownicy.insert(res, req);
// });

class Uzytkownicy {
  static updateWniosek(res, req) {
    let query =
      "INSERT INTO uzytkownicy (wniosek_id) " +
      req.body.wniosek_id +
      "WHERE id=" +
      req.body.id;
    DB.execute(query);
  }

  static login(res, req) {
    Log(0, "Uzytkownicy.login received req.body=", req.body);
    let query =
      "SELECT * from uzytkownicy where nazwa =" + DB.escape(req.body.nazwa);

    DB.execute(query, null, (error, result) => {
      if (error) {
        return res.status(401).json({
          message: "Login failed, error:" + error,
        });
      } else if (!result.length || result.length < 1) {
        Log(0, "Uzytkownicy login failed");
        return res.status(401).json({
          message: "Login failed",
        });
      }
      Log(0, "Uzytkownicy login query result[0]=", result[0]);
      bcrypt.compare(
        req.body.haslo,
        result[0].haslo,
        (compare_err, compare_result) => {
          Log(0, "Uzytkownicy login compare_result=", compare_result);
          Log(0, "Uzytkownicy login compare_err=", compare_err);
          if (compare_err || !compare_result) {
            Log(0, "login bcrypt compare faied");
            return res.status(401).json({
              message: "Login failed",
            });
          } else {
            const token = jwt.sign(
              {
                klient_id: result[0].klient_id,
                id: result[0].id,
                nazwa: result[0].nazwa,
                uprawnienia: result[0].uprawnienia,
              },
              //todo: it is used in indes.ts, move it to one place
              "g6asdfbw4yhdfvqwe4yfg2365burthff6ui47irtfdgwgh45wv4hsdf0zq1x08lqz34r54brwer4ddwv54t67uhe5rtv",
              {
                expiresIn: "12h",
              }
            );
            return res.status(200).json({
              message: "Login successful",
              token: token,
            });
          }
        }
      );
    });
  }

  static async insert(user: {
    nazwa: string;
    haslo: string;
    uprawnienia: string;
    klient_nazwa: string;
  }) {
    Log(0, "Uzytkownicy insert received user=", user);
    let query_klient =
      "SELECT * from klienci where nazwa =" + DB.escape(user.klient_nazwa);
    return await DB.executeAsync(
      query_klient,
      null,
      async (error_klient, result_klient) => {
        if (error_klient) {
          Log(0, "Nie udało się dodać użytkownika:", user.nazwa);
        } else if (result_klient.length !== 1) {
          Log(
            0,
            "Nie udało się dodać użytkownika - klient o podanej nazwie nie istnieje: ",
            user.klient_nazwa
          );
        } else {
          let query_u =
            "SELECT * from uzytkownicy where nazwa =" + DB.escape(user.nazwa);
          await DB.executeAsync(query_u, null, (error_u, result_u) => {
            let size: string = result_u.length;
            if (Number(size) > 0) {
              Log(
                0,
                "Błąd - uzytkownik o podanej nazwie już istnieje: ",
                user.nazwa
              );
            } else {
              bcrypt.hash(user.haslo, 10, (err, hash) => {
                if (err) {
                  Log(0, "Uzytkownicy.insert hash err=", err);
                } else {
                  let query =
                    "INSERT INTO uzytkownicy (klient_id, nazwa, haslo, uprawnienia) SELECT  \
                    (SELECT id FROM klienci WHERE nazwa LIKE " +
                    DB.escape(user.klient_nazwa) +
                    ")," +
                    DB.escape(user.nazwa) +
                    "," +
                    DB.escape(hash) +
                    "," +
                    DB.escape(user.uprawnienia) +
                    " FROM dual WHERE NOT EXISTS (SELECT * FROM uzytkownicy WHERE nazwa=" +
                    DB.escape(user.nazwa) +
                    ") AND EXISTS (SELECT * FROM klienci WHERE nazwa LIKE " +
                    DB.escape(user.klient_nazwa) +
                    ");";
                  DB.executeAsync(query, null, (error, result) => {
                    if (error)
                      Log(
                        0,
                        "Nie udało się dodać użytkownika o nazwie: ",
                        user.nazwa
                      );
                    else if (result) Log(0, "Użytkownik dodany: ", user.nazwa);
                  });
                }
              });
            }
          });
        }
      }
    );
  }
}

let uzytkownicyInsert = Uzytkownicy.insert;

export { router as uzytkownicyRouter, uzytkownicyInsert };
