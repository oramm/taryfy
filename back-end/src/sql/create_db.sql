DROP TABLE IF EXISTS koszty;
DROP TABLE IF EXISTS koszty_typ_dict;
DROP TABLE IF EXISTS koszty_rodzaje;
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
  opis TEXT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE koszty
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  typ ENUM("woda","scieki","posrednie","ogolne","inne"),
  nazwa varchar(255) NOT NULL,
  opis TEXT
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
