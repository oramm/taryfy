export type GrupyOdbiorcow = {
  id: number;
  wniosek_id: number;
  typ_id: number;
  nazwa: string;
  opis: string;
};

export let GrupyOdbiorcowEmpty: GrupyOdbiorcow = {
  id: 0,
  wniosek_id: 0,
  typ_id: 0,
  nazwa: "",
  opis: "",
};

export type Klienci =
{
  id: number;
  nazwa: string;
  opis: string;
  adres:string;
  nip:string;
}

export type uzytkownicy =
{
  id: number;
  klient_id: number;
  nazwa: string;
  haslo: string;
  wniosek_id: number;
}

export type wnioski =
{
  id: number;
  klient_id: number;
  nazwa: string;
}
/*
export type zalozenia
{
  id: number;
  wniosek_id: number;

  inflacja_1 DECIMAL(6,2) NOT NULL,
  wskaznik_cen_1 DECIMAL(6,2) NOT NULL,
  marza_zysku_1 DECIMAL(6,2) NOT NULL,
  inflacja_2 DECIMAL(6,2) NOT NULL,
  wskaznik_cen_2 DECIMAL(6,2) NOT NULL,
  marza_zysku_2 DECIMAL(6,2) NOT NULL,
  inflacja_3 DECIMAL(6,2) NOT NULL,
  wskaznik_cen_3 DECIMAL(6,2) NOT NULL,
  marza_zysku_3 DECIMAL(6,2) NOT NULL
}
*/

/*
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
*/

export type  koszty_rodzaje =
{
  id: number;
  wniosek_id: number;
  typ_id: string;
  nazwa: string;
  opis: string;
  wspolczynnik: string;
}

export type koszty_wskazniki =
{
  id: number;
  wniosek_id: number;
  typ_id: string;
  wskaznik_1: number;
  wskaznik_2: number;
  wskaznik_3: number;
}

export type koszty =
{
  id: number;
  wniosek_id: number;
  typ_id: string;
  rodzaj_nazwa: string;
  rok_obrachunkowy_1: number;
  rok_obrachunkowy_2: number;
  rok_obrachunkowy_3: number;
  rok_nowych_taryf_1: number;
  rok_nowych_taryf_2: number;
  rok_nowych_taryf_3: number;
}

// CREATE TABLE popyt_typ_dict
// (
//   id int NOT NULL primary KEY,
//   typ ENUM("woda","scieki")
// )
// ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// INSERT INTO popyt_typ_dict(id,typ) values (1,"woda");
// INSERT INTO popyt_typ_dict(id,typ) values (2,"scieki");

export type popyt_element_sprzedazy =
{
  id: number;
  wniosek_id: number;
  typ_id: string;
  nazwa: string;
  opis: string;
  wspolczynnik: string;
  jednostka: string;
  abonament: boolean;
  abonament_nazwa: string;
  abonament_wspolczynnik: string;
  wariant_id: number;
}


// CREATE TABLE okresy_dict
// (
//   id int NOT NULL primary KEY,
//   typ ENUM("1-12","13-24","25-36")
// )
// ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// INSERT INTO okresy_dict(id,typ) values (1,"1-12");
// INSERT INTO okresy_dict(id,typ) values (2,"13-24");
// INSERT INTO okresy_dict(id,typ) values (3,"25-36");

export type popyt_warianty =
{
  id: number;
  element_sprzedazy_id: number;
  nazwa: string;
  opis: string;
}

export type grupy_odbiorcow =
{
  id: number;
  wniosek_id: number;
  typ_id: string;
  nazwa: string;
  opis: string;
}


export type popyt_wariant_odbiorcy =
{
  id: number;
  wariant_id: number;
  grupy_odbiorcow_id: number;
  okres_id: number;
  sprzedaz: number;
  wspolczynnik: number;
  oplaty_abonament: number;
  wspolczynnik_abonament: number;
  typ: string;
  liczba_odbiorcow: number;
}

export type popyt_zestawienie =
{
  element_sprzedazy_id: number;
  element_sprzedazy_nazwa: string;
  element_sprzedazy_jednostka: string;
  element_sprzedazy_wspolczynnik: string;
  element_sprzedazy_abonament: boolean;
  element_sprzedazy_abonament_nazwa: string;
  element_sprzedazy_abonament_wspolczynnik: string;
  wariant_nazwa: string;
  grupy_odbiorcow_nazwa: string;
}
