DROP TABLE IF EXISTS grupy_odbiorcow;
DROP TABLE IF EXISTS popyt_warianty;
DROP TABLE IF EXISTS popyt_elementy_sprzedazy;
DROP TABLE IF EXISTS popyt;
DROP TABLE IF EXISTS popyt_typ_dict;
DROP TABLE IF EXISTS koszty;
DROP TABLE IF EXISTS koszty_rodzaje;
DROP TABLE IF EXISTS koszty_wskazniki;
DROP TABLE IF EXISTS koszty_typ_dict;
DROP TABLE IF EXISTS zalozenia;
DROP TABLE IF EXISTS wnioski;
DROP TABLE IF EXISTS uzytkownicy;
DROP TABLE IF EXISTS klienci;

CREATE TABLE klienci
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  nazwa varchar(255) NOT NULL,
  UNIQUE KEY unique_nazwa (nazwa),
  opis TEXT,
  adres varchar(255),
  nip varchar(255)
)

ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE uzytkownicy
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  klient_id int,
  FOREIGN KEY (klient_id)
        REFERENCES klienci(id)
        ON DELETE CASCADE,
  nazwa varchar(255) NOT NULL,
  haslo varchar(255),
  wniosek_id int
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wnioski
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  klient_id int,
  FOREIGN KEY (klient_id)
        REFERENCES klienci(id)
        ON DELETE CASCADE,  
  nazwa varchar(255) NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zalozenia
(
  -- przedzial_czasowy ENUM('1-12', '13-24', '25-36')
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  inflacja_1 DECIMAL(6,2) NOT NULL,
  wskaznik_cen_1 DECIMAL(6,2) NOT NULL,
  marza_zysku_1 DECIMAL(6,2) NOT NULL,
  inflacja_2 DECIMAL(6,2) NOT NULL,
  wskaznik_cen_2 DECIMAL(6,2) NOT NULL,
  marza_zysku_2 DECIMAL(6,2) NOT NULL,
  inflacja_3 DECIMAL(6,2) NOT NULL,
  wskaznik_cen_3 DECIMAL(6,2) NOT NULL,
  marza_zysku_3 DECIMAL(6,2) NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE koszty_typ_dict
(
  id int NOT NULL primary KEY,
  typ ENUM("woda","scieki","posrednie","ogolne","inne")
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO koszty_typ_dict(id,typ) values (1,"woda");
INSERT INTO koszty_typ_dict(id,typ) values (2,"scieki");
INSERT INTO koszty_typ_dict(id,typ) values (3,"posrednie");
INSERT INTO koszty_typ_dict(id,typ) values (4,"ogolne");
INSERT INTO koszty_typ_dict(id,typ) values (5,"inne");

CREATE TABLE koszty_rodzaje
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES koszty_typ_dict(id),
  nazwa varchar(255) NOT NULL,
  opis TEXT,
  wspolczynnik ENUM("A","B","C","D","E") 
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE koszty_wskazniki
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES koszty_typ_dict(id),
  wskaznik_1 numeric,
  wskaznik_2 numeric,
  wskaznik_3 numeric
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE koszty
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES koszty_typ_dict(id),
  rodzaj_nazwa varchar(255) NOT NULL,
  rok_obrachunkowy_1 numeric,
  rok_obrachunkowy_2 numeric,
  rok_obrachunkowy_3 numeric,
  rok_nowych_taryf_1 numeric,
  rok_nowych_taryf_2 numeric,
  rok_nowych_taryf_3 numeric
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE popyt_typ_dict
(
  id int NOT NULL primary KEY,
  typ ENUM("woda","scieki")
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO popyt_typ_dict(id,typ) values (1,"woda");
INSERT INTO popyt_typ_dict(id,typ) values (2,"scieki");

CREATE TABLE popyt
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES popyt_typ_dict(id)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE popyt_element_sprzedazy
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES popyt_typ_dict(id),
  nazwa varchar(255) NOT NULL,
  opis TEXT,
  wspolczynnik ENUM("A","B","C","D","E"),
  jednostka varchar(255) NOT NULL,
  abonament BOOLEAN,
  abonament_nazwa varchar(255) NOT NULL,
  abonament_wspolczynnik ENUM("A","B","C","D","E") 
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE popyt_warianty
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  element_sprzedazy_id int,
  FOREIGN KEY (element_sprzedazy_id)
        REFERENCES popyt_element_sprzedazy(id)
        ON DELETE CASCADE,
  okres ENUM("1-12","13-24","25-36"),
  nazwa varchar(255) NOT NULL,
  opis TEXT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE grupy_odbiorcow
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES popyt_typ_dict(id),     
  nazwa varchar(255) NOT NULL,
  opis TEXT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
