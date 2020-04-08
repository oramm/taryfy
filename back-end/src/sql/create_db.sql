DROP TABLE IF EXISTS rodzaje_kosztow;
DROP TABLE IF EXISTS zalozenia;
DROP TABLE IF EXISTS wnioski;
DROP TABLE IF EXISTS uzytkownicy;

CREATE TABLE uzytkownicy
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  nazwa varchar(255) NOT NULL,
  haslo varchar(255),
  wniosek_id int
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wnioski
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
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

CREATE TABLE rodzaje_kosztow
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  nazwa varchar(255) NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
