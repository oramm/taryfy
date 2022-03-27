DROP TABLE IF EXISTS wspolczynnik_alokacji;
DROP TABLE IF EXISTS popyt_wariant_sumy;
DROP TABLE IF EXISTS popyt_wariant_odbiorcy;
DROP TABLE IF EXISTS grupy_odbiorcow;
DROP TABLE IF EXISTS popyt_warianty;
DROP TABLE IF EXISTS popyt_element_sprzedazy;
DROP TABLE IF EXISTS elementy_przychodow_dict;
DROP TABLE IF EXISTS popyt_typ_dict;
DROP TABLE IF EXISTS koszty;
DROP TABLE IF EXISTS koszty_rodzaje;
DROP TABLE IF EXISTS koszty_wskazniki;
DROP TABLE IF EXISTS koszty_typ_dict;
DROP TABLE IF EXISTS zalozenia;
DROP TABLE IF EXISTS okresy_dict;
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
  uprawnienia int,
  -- 0 - read only
  -- 1 - read and write
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
  nazwa varchar(255) NOT NULL,
  spreadsheet_koszty_id varchar(255),
  spreadsheet_wyniki_id varchar(255)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE okresy_dict
(
  id int NOT NULL primary KEY,
  typ ENUM("1-12","13-24","25-36")
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO okresy_dict(id,typ) values (1,"1-12");
INSERT INTO okresy_dict(id,typ) values (2,"13-24");
INSERT INTO okresy_dict(id,typ) values (3,"25-36");

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


CREATE TABLE popyt_typ_dict
(
  id int NOT NULL primary KEY,
  typ ENUM("woda","scieki")
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO popyt_typ_dict(id,typ) values (1,"woda");
INSERT INTO popyt_typ_dict(id,typ) values (2,"scieki");

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
  id int NOT NULL,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES koszty_typ_dict(id),
  PRIMARY KEY (id,typ_id),
  nazwa varchar(255) NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 1,1,"1) koszty eksploatacji i utrzymania, w tym:");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 2,1,"a) koszty bezpośrednie:");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 3,1,"– amortyzacja lub odpisy umorzeniowe");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 4,1,"– wynagrodzenie z narzutami");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 5,1,"– materiały");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 6,1,"– energia");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 7,1,"– opłaty za korzystanie ze środowiska");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 8,1,"– opłaty za usługi wodne");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 9,1,"– usługi obce");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (10,1,"– pozostałe koszty");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (11,1,"2) podatki i opłaty niezależne od przedsiębiorstwa");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (12,1,"3) koszty zakupionej wody");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (13,1,"b) koszty pośrednie:");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (14,1,"– rozliczenie kosztów wydziałowych i działalności pomocniczej");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (15,1,"– alokowane koszty ogólne");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (16,1,"2) odsetki od zaciągniętych kredytów i pożyczek lub wyemitowanych obligacji");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (17,1,"3) należności nieregularne");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (18,1,"4) raty kapitałowe ponad wartość amortyzacji lub umorzenia oraz koszty nabycia własnych akcji lub udziałów w celu umorzenia lub koszty spłaty kredytów i pożyczek zaciągniętych w celu sfinansowania takiego umorzenia");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (19,1,"5) marża zysku");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (20,1,"6) niepodzielony zysk z lat ubiegłych2)");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (21,1,"7) wartość niezbędnych przychodów");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (22,1,"Średnia zmiana wartości przychodów – zaopatrzenie w wodę w %");

INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 1,2,"1) koszty eksploatacji i utrzymania, w tym:");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 2,2,"a) koszty bezpośrednie:");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 3,2,"– amortyzacja lub odpisy umorzeniowe");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 4,2,"– wynagrodzenie z narzutami");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 5,2,"– materiały");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 6,2,"– energia");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 7,2,"– opłaty za korzystanie ze środowiska");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 8,2,"– opłaty za usługi wodne");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values ( 9,2,"– usługi obce");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (10,2,"– pozostałe koszty");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (11,2,"2) podatki i opłaty niezależne od przedsiębiorstwa");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (12,2,"3) koszty zakupionej wody");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (13,2,"b) koszty pośrednie:");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (14,2,"– rozliczenie kosztów wydziałowych i działalności pomocniczej");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (15,2,"– alokowane koszty ogólne");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (16,2,"2) odsetki od zaciągniętych kredytów i pożyczek lub wyemitowanych obligacji");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (17,2,"3) należności nieregularne");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (18,2,"4) raty kapitałowe ponad wartość amortyzacji lub umorzenia oraz koszty nabycia własnych akcji lub udziałów w celu umorzenia lub koszty spłaty kredytów i pożyczek zaciągniętych w celu sfinansowania takiego umorzenia");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (19,2,"5) marża zysku");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (20,2,"6) niepodzielony zysk z lat ubiegłych2)");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (21,2,"7) wartość niezbędnych przychodów");
INSERT INTO koszty_rodzaje(id,typ_id,nazwa) values (22,2,"Średnia zmiana wartości przychodów –odprowadzanie ścieków w %");

CREATE TABLE elementy_przychodow_dict
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  typ_id int NOT NULL,
  FOREIGN KEY (typ_id)
        REFERENCES popyt_typ_dict(id),
  poziom int,
  koszty_rodzaje_id int NOT NULL,
  nazwa varchar(255) NOT NULL
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0, 1,"1) koszty eksploatacji i utrzymania, w  tym:");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,1, 2,"a) koszty bezpośrednie");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 3,"– amortyzacja lub odpisy umorzeniowe");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 4,"– wynagrodzenie z narzutami");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 5,"– materiały");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 6,"– energia");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 7,"– opłaty za korzystanie ze środowiska");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 8,"– opłaty za usługi wodne");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2, 9,"– usługi obce");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2,10,"– pozostałe koszty");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,1,13,"b) koszty pośrednie");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2,14,"– rozliczenie kosztów wydziałowych i działalności pomocniczej");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,2,15,"– alokowane koszty ogólne");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0,16,"2) odsetki od zaciągniętych kredytów i pożyczek lub wyemitowanych obligacji");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0,17,"3) należności nieregularne");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0,18,"4) raty kapitałowe ponad wartość amortyzacji lub umorzenia oraz koszty nabycia własnych akcji lub udziałów w celu umorzenia lub koszty spłaty kredytów i pożyczek zaciągniętych w celu sfinansowania takiego umorzenia");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0,19,"5) marża zysku");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0,20,"6) niepodzielony zysk z lat ubiegłych2)");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (1,0,21,"7) wartość niezbędnych przychodów");

INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0, 1,"1) koszty eksploatacji i utrzymania, w  tym:");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,1, 2,"a) koszty bezpośrednie");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 3,"– amortyzacja lub odpisy umorzeniowe");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 4,"– wynagrodzenie z narzutami");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 5,"– materiały");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 6,"– energia");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 7,"– opłaty za korzystanie ze środowiska");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 8,"– opłaty za usługi wodne");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2, 9,"– usługi obce");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2,10,"– pozostałe koszty");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,1,13,"b) koszty pośrednie");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2,14,"– rozliczenie kosztów wydziałowych i działalności pomocniczej");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,2,15,"– alokowane koszty ogólne");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0,16,"2) odsetki od zaciągniętych kredytów i pożyczek lub wyemitowanych obligacji");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0,17,"3) należności nieregularne");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0,18,"4) raty kapitałowe ponad wartość amortyzacji lub umorzenia oraz koszty nabycia własnych akcji lub udziałów w celu umorzenia lub koszty spłaty kredytów i pożyczek zaciągniętych w celu sfinansowania takiego umorzenia");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0,19,"5) marża zysku");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0,20,"6) niepodzielony zysk z lat ubiegłych2)");
INSERT INTO elementy_przychodow_dict(typ_id,poziom,koszty_rodzaje_id,nazwa) values (2,0,21,"7) wartość niezbędnych przychodów");

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
  wskaznik_1 DECIMAL(16,3),
  wskaznik_2 DECIMAL(16,3),
  wskaznik_3 DECIMAL(16,3)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE koszty
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wniosek_id int,
  FOREIGN KEY (wniosek_id)
        REFERENCES wnioski(id)
        ON DELETE CASCADE,
  koszty_rodzaje_id int NOT NULL, -- koszty_rodzaje.id
  typ_id int NOT NULL, -- koszty_rodzaje.typ_id)
  rok_obrachunkowy_1 DECIMAL(16,3),
  rok_obrachunkowy_2 DECIMAL(16,3),
  rok_obrachunkowy_3 DECIMAL(16,3),
  rok_nowych_taryf_1 DECIMAL(16,3),
  rok_nowych_taryf_2 DECIMAL(16,3),
  rok_nowych_taryf_3 DECIMAL(16,3)
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
  kod_wspolczynnika TEXT,
  jednostka varchar(255) NOT NULL,
  abonament BOOLEAN,
  abonament_nazwa varchar(255) NOT NULL,
  abonament_kod_wspolczynnika TEXT,
  wariant_id int
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE popyt_warianty
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  element_sprzedazy_id int,
  FOREIGN KEY (element_sprzedazy_id)
        REFERENCES popyt_element_sprzedazy(id)
        ON DELETE CASCADE,
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
  nazwa varchar(255) NOT NULL,
  opis TEXT,
  przychody_woda DECIMAL(16,3),
  przychody_scieki DECIMAL(16,3),
  liczba_odbiorcow_1 int,
  liczba_odbiorcow_2 int,
  liczba_odbiorcow_3 int,
  liczba_odbiorcow_scieki_1 int,
  liczba_odbiorcow_scieki_2 int,
  liczba_odbiorcow_scieki_3 int
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE popyt_wariant_odbiorcy
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wariant_id int,
  FOREIGN KEY (wariant_id)
        REFERENCES popyt_warianty(id)
        ON DELETE CASCADE,
  grupy_odbiorcow_id int,
  FOREIGN KEY (grupy_odbiorcow_id)
        REFERENCES grupy_odbiorcow(id)
        ON DELETE CASCADE,
  okres_id int NOT NULL,
  FOREIGN KEY (okres_id)
        REFERENCES okresy_dict(id),
  sprzedaz DECIMAL(16,3),
  wspolczynnik_alokacji DECIMAL(16,3),
  oplaty_abonament DECIMAL(16,3),
  wspolczynnik_alokacji_abonament DECIMAL(16,3),
  liczba_odbiorcow int
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE popyt_wariant_sumy
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  wariant_id int,
  FOREIGN KEY (wariant_id)
        REFERENCES popyt_warianty(id)
        ON DELETE CASCADE,
  okres_id int NOT NULL,
  FOREIGN KEY (okres_id)
        REFERENCES okresy_dict(id),
  sprzedaz DECIMAL(16,3),
  oplaty_abonament DECIMAL(16,3),
  typ_alokacji_abonament int,
  dopelnienie_grupa int,
  wskaznik DECIMAL(16,3)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wspolczynnik_alokacji
(
  id int NOT NULL AUTO_INCREMENT primary KEY,
  typ_id int NOT NULL,
    FOREIGN KEY (typ_id)
      REFERENCES popyt_typ_dict(id),
  okres_id int NOT NULL,
    FOREIGN KEY (okres_id)
      REFERENCES okresy_dict(id),        
  elementy_przychodow_id int,
    FOREIGN KEY (elementy_przychodow_id)
      REFERENCES elementy_przychodow_dict(id),
  popyt_element_sprzedazy_id int,
    FOREIGN KEY (popyt_element_sprzedazy_id)
      REFERENCES popyt_element_sprzedazy(id)
      ON DELETE CASCADE,
  popyt_warianty_id int,
    FOREIGN KEY (popyt_warianty_id)
      REFERENCES popyt_warianty(id)
      ON DELETE CASCADE,
  abonament BOOLEAN     
)
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
