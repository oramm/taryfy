import React, { Component } from "react";
import update from "immutability-helper";
import {
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBInputGroup,
  MDBInput,
} from "mdbreact";
import { post, cancel } from "./post";

import { ModalDialogs, OkresyControl } from "./modal_dialogs";

import {
  WspolczynnikAlokacji,
  GrupaWspolczynnik,
  WspolczynnikAlokacjiSelected,
  GrupyOdbiorcow,
  ElementPrzychodu,
  KosztyOgolem,
} from "../../../common/model";

type Props = {
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type State = {
  okres_id: number;
  elementy_przychodow: ElementPrzychodu[];
  wspolczynnik_alokacji: WspolczynnikAlokacji[];
  wspolczynnik_alokacji_selected: WspolczynnikAlokacjiSelected[];
  grupy_odbiorcow: GrupyOdbiorcow[];
  grupa_wspolczynnik: GrupaWspolczynnik[];
  //  koszty_ogolem: KosztyOgolem[];
};

export default class Screen extends Component<Props, State> {
  state: State = {
    okres_id: 0,
    elementy_przychodow: [],
    wspolczynnik_alokacji: [],
    wspolczynnik_alokacji_selected: [],
    grupy_odbiorcow: [],
    grupa_wspolczynnik: [],
    //    koszty_ogolem: [],
  };

  constructor(props: Props) {
    super(props);
  }

  // componentDidUpdate(prevProps: Props) {
  //   console.log("Screen060 componentDidUpdate");
  // }

  componentDidMount() {
    console.log("Screen060 componentDidMount");
    this.loadData();
  }

  componentWillUnmount() {
    console.log("Screen060 componentWillUnmount");
    cancel();
  }

  componentDidUpdate(prevProps: Props) {
    console.log("componentDidUpdate this.props:", this.props);
    console.log("componentDidUpdate prevProps:", prevProps);
    if (
      prevProps.typ_id !== this.props.typ_id ||
      prevProps.wniosek_id !== this.props.wniosek_id
    ) {
      this.loadData();
    }
  }

  loadElementPrzychodu = () => {
    post(
      "/alokacja_przychodow/select_elementy_przychodow",
      {
        typ_id: this.props.typ_id,
      },
      (response) => {
        console.log("Screen060 loadElementPrzychodu response:", response);
        this.setState({ elementy_przychodow: response.data }, () =>
          console.log("Screen060 loadElementPrzychodu state:", this.state)
        );
      }
    );
  };

  loadWspolczynnikAlokacji = () => {
    post(
      "/alokacja_przychodow/select_wspolczynnik_alokacji",
      {
        wniosek_id: this.props.wniosek_id,
        typ_id: this.props.typ_id,
      },
      (response) => {
        console.log("Screen060 loadWspolczynnikAlokacji response:", response);
        this.setState({ wspolczynnik_alokacji: response.data }, () =>
          console.log("Screen060 loadWspolczynnikAlokacji state:", this.state)
        );
      }
    );
  };

  loadWspolczynnikAlokacjiSelested = () => {
    post(
      "/alokacja_przychodow/select_wspolczynnik_alokacji_selected",
      {
        wniosek_id: this.props.wniosek_id,
        okres_id: this.state.okres_id,
        typ_id: this.props.typ_id,
      },
      (response) => {
        console.log(
          "Screen060 loadWspolczynnikAlokacjiSelested response:",
          response
        );
        this.setState({ wspolczynnik_alokacji_selected: response.data }, () =>
          console.log(
            "Screen060 loadWspolczynnikAlokacjiSelested state:",
            this.state
          )
        );
      }
    );
  };

  loadGrupyOdbiorcow = () => {
    post(
      "/grupy_odbiorcow/select",
      {
        wniosek_id: this.props.wniosek_id,
        typ_id: this.props.typ_id,
      },
      (response) => {
        console.log("Screen060 loadGrupyOdbiorcow response:", response);
        this.setState({ grupy_odbiorcow: response.data }, () =>
          console.log("Screen060 loadGrupyOdbiorcow state:", this.state)
        );
      }
    );
  };

  loadGrupyWspolczynnik = () => {
    post(
      "/alokacja_przychodow/select_grupy_wspolczynnik",
      {
        wniosek_id: this.props.wniosek_id,
        typ_id: this.props.typ_id,
        okres_id: this.state.okres_id,
      },
      (response) => {
        console.log("Screen060 loadGrupyWspolczynnik response:", response);
        this.setState({ grupa_wspolczynnik: response.data }, () =>
          console.log("Screen060 loadGrupyWspolczynnik state:", this.state)
        );
      }
    );
  };

  // loadKosztyOgolem = () => {
  //   post(
  //     "/alokacja_przychodow/select_koszty",
  //     {
  //       wniosek_id: this.props.wniosek_id,
  //       typ_id: this.props.typ_id,
  //     },
  //     (response) => {
  //       console.log("Screen060 loadKosztyOgolem response:", response);
  //       this.setState({ koszty_ogolem: response.data }, () =>
  //         console.log("Screen060 loadKosztyOgolem state:", this.state)
  //       );
  //     }
  //   );
  // };

  loadData = () => {
    console.log("Screen060 loadData");
    this.setState(
      {
        elementy_przychodow: [],
        wspolczynnik_alokacji: [],
        wspolczynnik_alokacji_selected: [],
        grupy_odbiorcow: [],
        grupa_wspolczynnik: [],
        //          koszty_ogolem: [],
      },
      () => {
        this.loadElementPrzychodu();
        this.loadWspolczynnikAlokacji();
        this.loadWspolczynnikAlokacjiSelested();
        this.loadGrupyOdbiorcow();
        this.loadGrupyWspolczynnik();
      }
    );
  };

  saveData = (powiel: boolean) => {
    console.log("Screen060 saveData powiel:", powiel);
    if (this.state.okres_id > 0) {
      post(
        "/alokacja_przychodow/update",
        {
          wniosek_id: this.props.wniosek_id,
          typ_id: this.props.typ_id,
          okres_id: this.state.okres_id,
          wspolczynnik_alokacji_selected: this.state
            .wspolczynnik_alokacji_selected,
          powiel: powiel,
        },
        (response) => {
          console.log("Screen060 saveData response:", response);
        }
      );
    } else {
      let przychody = this.state.grupy_odbiorcow.map((item, index) => {
        return {
          id: item.id,
          przychody_woda: item.przychody_woda,
          przychody_scieki: item.przychody_scieki,
        };
      });
      post(
        "/grupy_odbiorcow/update_przychody",
        {
          data: przychody,
        },
        (response) => {
          console.log("Screen060: saveData response:", response);
        }
      );
    }
  };

  onWspolczynnikChange(w: any, element_przychodow: ElementPrzychodu) {
    console.log("onWspolczynnikChange w:", w);
    let wspolczynnik: WspolczynnikAlokacjiSelected[] = [
      {
        id: 0,
        elementy_przychodow_id: element_przychodow.id,
        popyt_element_sprzedazy_id: w.popyt_element_sprzedazy_id,
        popyt_warianty_id: w.popyt_warianty_id,
        abonament: w.abonament,
      },
    ];
    let index = 0;
    for (let ws of this.state.wspolczynnik_alokacji_selected) {
      if (ws.elementy_przychodow_id === element_przychodow.id) {
        this.setState((prevState) =>
          update(prevState, {
            wspolczynnik_alokacji_selected: {
              [index]: {
                popyt_element_sprzedazy_id: {
                  $set: w.popyt_element_sprzedazy_id,
                },
                popyt_warianty_id: {
                  $set: w.popyt_warianty_id,
                },
                abonament: {
                  $set: w.abonament,
                },
              },
            },
          })
        );
        return;
      }
      index++;
    }
    this.setState((prevState) =>
      update(prevState, {
        wspolczynnik_alokacji_selected: { $push: wspolczynnik },
      })
    );
  }

  getWspolczynnik(element_przychodow: ElementPrzychodu, index: number) {
    if (
      index < this.state.elementy_przychodow.length - 1 &&
      element_przychodow.poziom <
        this.state.elementy_przychodow[index + 1].poziom
    )
      return;

    let selected: WspolczynnikAlokacjiSelected = {
      id: 0,
      elementy_przychodow_id: 0,
      popyt_element_sprzedazy_id: 0,
      popyt_warianty_id: 0,
      abonament: false,
    };
    let not_selected = true;
    console.log(
      "getWspolczynnik start ####### element_przychodow.id",
      element_przychodow.id
    );
    console.log(
      "getWspolczynnik start ####### this.state.wspolczynnik_alokacji_selected",
      this.state.wspolczynnik_alokacji_selected
    );
    this.state.wspolczynnik_alokacji_selected.forEach(
      (item: WspolczynnikAlokacjiSelected, index: number) => {
        console.log("getWspolczynnik item: ", item);
        if (item.elementy_przychodow_id === element_przychodow.id) {
          console.log("getWspolczynnik selected!");
          selected.elementy_przychodow_id = item.elementy_przychodow_id;
          selected.popyt_warianty_id = item.popyt_warianty_id;
          selected.popyt_element_sprzedazy_id = item.popyt_element_sprzedazy_id;
          selected.abonament = item.abonament;
          not_selected = false;
        }
      }
    );
    console.log("getWspolczynnik not_selected: ", not_selected);
    console.log("getWspolczynnik selected: ", selected);

    return (
      <MDBInputGroup
        containerClassName="mb-3"
        inputs={
          <select
            className="browser-default custom-select"
            onChange={(event) => {
              const { value } = event.currentTarget;
              console.log("onWspolczynnikChange: ", value);
              this.onWspolczynnikChange(JSON.parse(value), element_przychodow);
            }}
          >
            <option value={0} selected={not_selected}></option>
            {this.state.wspolczynnik_alokacji.map(
              (item: WspolczynnikAlokacji, index: number) => {
                console.log(
                  "getWspolczynnik WspolczynnikAlokacji item: ",
                  item
                );
                console.log(
                  "getWspolczynnik WspolczynnikAlokacji selected: ",
                  JSON.stringify(selected)
                );
                let selected_value =
                  selected.popyt_warianty_id == item.popyt_warianty_id &&
                  selected.popyt_element_sprzedazy_id ==
                    item.popyt_element_sprzedazy_id &&
                  selected.abonament == false;
                let value = {
                  popyt_warianty_id: item.popyt_warianty_id,
                  popyt_element_sprzedazy_id: item.popyt_element_sprzedazy_id,
                  abonament: false,
                };
                let selected_value_abonament =
                  selected.popyt_warianty_id == item.popyt_warianty_id &&
                  selected.popyt_element_sprzedazy_id ==
                    item.popyt_element_sprzedazy_id &&
                  selected.abonament == true;
                let value_abonament = {
                  popyt_warianty_id: item.popyt_warianty_id,
                  popyt_element_sprzedazy_id: item.popyt_element_sprzedazy_id,
                  abonament: true,
                };

                console.log(
                  "getWspolczynnik WspolczynnikAlokacji selected_value: ",
                  selected_value
                );
                console.log(
                  "getWspolczynnik WspolczynnikAlokacji value: ",
                  value
                );
                console.log(
                  "getWspolczynnik WspolczynnikAlokacji selected_value_abonament: ",
                  selected_value_abonament
                );
                console.log(
                  "getWspolczynnik WspolczynnikAlokacji value_abonament:",
                  value_abonament
                );

                return (
                  <>
                    <option
                      // value={JSON.stringify(item)}
                      value={JSON.stringify(value)}
                      selected={selected_value}
                    >
                      {item.popyt_element_sprzedazy_kod_wspolczynnika +
                        " " +
                        item.popyt_warianty_nazwa}
                    </option>
                    {item.popyt_element_sprzedazy_abonament_kod_wspolczynnika ? (
                      <option
                        value={JSON.stringify(value_abonament)}
                        selected={selected_value_abonament}
                      >
                        {item.popyt_element_sprzedazy_abonament_kod_wspolczynnika +
                          " " +
                          item.popyt_warianty_nazwa}
                      </option>
                    ) : (
                      <></>
                    )}
                  </>
                );
              }
            )}
          </select>
        }
      />
    );
  }

  calculate() {
    let ret: number[][] = [];
    for (let g = 0; g < this.state.grupy_odbiorcow.length; g++) {
      let line: number[] = [];
      for (let e = 0; e < this.state.elementy_przychodow.length; e++) {
        line.push(0);
      }
      ret.push(line);
    }

    for (let g = 0; g < this.state.grupy_odbiorcow.length; g++) {
      let level = [0, 0, 0];
      let last_level = 0;
      for (
        let index = this.state.elementy_przychodow.length - 1;
        index >= 0;
        index--
      ) {
        let e: ElementPrzychodu = this.state.elementy_przychodow[index];
        console.log("screen060_alokacja_przychodow calculate e:", e);
        if (e.poziom >= last_level) {
          ret[g][index] = this.getGrupaWspolczynnik(
            this.state.grupy_odbiorcow[g].id,
            e
          );
          level[e.poziom] += ret[g][index];
        } else {
          ret[g][index] = level[e.poziom + 1];
          level[e.poziom + 1] = 0;
          level[e.poziom] += ret[g][index];
        }
        last_level = e.poziom;
        // switch (e.poziom) {
        //   case 0:
        //   case 1:
        //     ret[g][index] = level[e.poziom + 1];
        //     level[e.poziom + 1] = 0;
        //     level[e.poziom] += ret[g][index];
        //     break;
        //   case 2:
        //     ret[g][index] = this.getGrupaWspolczynnik(this.state.grupy_odbiorcow[g].id, e);
        //     // ret[g][index] =
        //     //   this.getOgolem(e) *
        //     //   this.getGrupaWspolczynnik(this.state.grupy_odbiorcow[g].id, e) *
        //     //   0.01;
        //     level[e.poziom] += ret[g][index];
        //     break;
        // }
      }
    }

    console.log("screen060_alokacja_przychodow calculate ret:", ret);
    return ret;
  }

  getGrupaWspolczynnik(
    grupy_odbiorcow_id: number,
    element_przychodu: ElementPrzychodu
  ) {
    if (this.state.wspolczynnik_alokacji.length) {
      let wa = this.state.wspolczynnik_alokacji[0];

      console.log(
        "screen060_alokacja_przychodow calculate getGrupaWspolczynnik this.state.wspolczynnik_alokacji_selected:",
        this.state.wspolczynnik_alokacji_selected
      );
      for (const item of this.state.wspolczynnik_alokacji_selected) {
        if (item.elementy_przychodow_id === element_przychodu.id) {
          console.log(
            "screen060_alokacja_przychodow calculate getGrupaWspolczynnik item:",
            item
          );
          console.log(
            "screen060_alokacja_przychodow calculate getGrupaWspolczynnik this.state.grupa_wspolczynnik",
            this.state.grupa_wspolczynnik
          );
          for (const g of this.state.grupa_wspolczynnik) {
            if (
              g.grupy_odbiorcow_id === grupy_odbiorcow_id &&
              g.popyt_element_sprzedazy_id ===
                item.popyt_element_sprzedazy_id &&
              g.popyt_warianty_id === item.popyt_warianty_id
            ) {
              if (item.abonament) {
                console.log(
                  "screen060_alokacja_przychodow calculate getGrupaWspolczynnik g.wspolczynnik_abonament:",
                  g.wspolczynnik_abonament
                );
                return g.wspolczynnik_abonament;
              } else {
                console.log(
                  "screen060_alokacja_przychodow calculate getGrupaWspolczynnik g.wspolczynnik:",
                  g.wspolczynnik
                );
                return g.wspolczynnik;
              }
            }
          }
          break;
        }
      }
    }
    return 0;
  }

  // getGrupaWspolczynnik(
  //   grupy_odbiorcow_id: number,
  //   element_przychodu: ElementPrzychodu
  // ) {
  //   if (this.state.wspolczynnik_alokacji.length) {
  //     let wa = this.state.wspolczynnik_alokacji[0];

  //     let wspolczynnik_alokacji_selected = {
  //       id: 0,
  //       elementy_przychodow_id: element_przychodu.id,
  //       popyt_element_sprzedazy_id: wa.popyt_element_sprzedazy_id,
  //       popyt_warianty_id: wa.popyt_warianty_id,
  //       abonament: wa.popyt_element_sprzedazy_abonament,
  //     } as WspolczynnikAlokacjiSelected;

  //     console.log("screen060_alokacja_przychodow calculate getGrupaWspolczynnik this.state.wspolczynnik_alokacji_selected:", this.state.wspolczynnik_alokacji_selected);
  //     for (const item of this.state.wspolczynnik_alokacji_selected) {
  //       if (item.elementy_przychodow_id === element_przychodu.id) {
  //         wspolczynnik_alokacji_selected = item;
  //       }
  //     }
  //     console.log("screen060_alokacja_przychodow calculate getGrupaWspolczynnik wspolczynnik_alokacji_selected:", wspolczynnik_alokacji_selected);
  //     console.log("screen060_alokacja_przychodow calculate getGrupaWspolczynnik this.state.grupa_wspolczynnik", this.state.grupa_wspolczynnik);
  //     for (const g of this.state.grupa_wspolczynnik) {
  //       if (
  //         g.grupy_odbiorcow_id === grupy_odbiorcow_id
  //         && g.popyt_element_sprzedazy_id === wspolczynnik_alokacji_selected.popyt_element_sprzedazy_id
  //         && g.popyt_warianty_id === wspolczynnik_alokacji_selected.popyt_warianty_id
  //         //&& wspolczynnik_alokacji_selected.abonament === g.popyt_element_sprzedazy_abonament
  //       ) {
  //         if (g.popyt_element_sprzedazy_abonament === true) {
  //           console.log("screen060_alokacja_przychodow calculate getGrupaWspolczynnik g.wspolczynnik_abonament:", g.wspolczynnik_abonament);
  //           return g.wspolczynnik_abonament;
  //         } else {
  //           console.log("screen060_alokacja_przychodow calculate getGrupaWspolczynnik g.wspolczynnik:", g.wspolczynnik);
  //           return g.wspolczynnik;
  //         }
  //       }
  //     }
  //   }
  //   return 0;
  // }

  // getOgolem(elementy_przychodow: ElementPrzychodu) {
  //   console.log("screen060_alokacja_przychodow getOgolem this.state.koszty_ogolem:", this.state.koszty_ogolem);
  //   console.log("screen060_alokacja_przychodow getOgolem elementy_przychodow.id:", elementy_przychodow.id);
  //   let koszt = this.state.koszty_ogolem.find(
  //     (item: KosztyOgolem, index: number) => {
  //       return item.elementy_przychodow_id === elementy_przychodow.id;
  //     }
  //   );
  //   console.log("screen060_alokacja_przychodow getOgolem koszt:", koszt);
  //   let value = 0;
  //   if (typeof koszt != "undefined")
  //     switch (this.state.okres_id) {
  //       case 1:
  //         value = koszt.rok_nowych_taryf_1;
  //         break;
  //       case 2:
  //         value = koszt.rok_nowych_taryf_2;
  //         break;
  //       case 3:
  //         value = koszt.rok_nowych_taryf_3;
  //         break;
  //     }
  //   console.log("screen060_alokacja_przychodow getOgolem value:", value);
  //   return value;

  //   // let koszt = {} as KosztyOgolem;
  //   // let koszt_set: boolean = false;
  //   // this.state.koszty_ogolem.forEach((item: KosztyOgolem, index: number) => {
  //   //   if (item.elementy_przychodow_id === elementy_przychodow.id) {
  //   //     koszt = item;
  //   //     koszt_set = true;
  //   //   }
  //   // });
  //   // let value = 0;
  //   // if (koszt_set)
  //   //   switch (this.state.okres_id) {
  //   //     case 1:
  //   //       value = koszt.rok_nowych_taryf_1;
  //   //       break;
  //   //     case 2:
  //   //       value = koszt.rok_nowych_taryf_2;
  //   //       break;
  //   //     case 3:
  //   //       value = koszt.rok_nowych_taryf_3;
  //   //       break;
  //   //   }
  //   // return value;
  // }

  zestawienie() {
    // if (
    //   this.state.elementy_przychodow.length &&
    //   this.state.wspolczynnik_alokacji.length &&
    //   this.state.wspolczynnik_alokacji_selected.length &&
    //   this.state.grupy_odbiorcow.length &&
    //   this.state.grupa_wspolczynnik.length &&
    //   this.state.koszty.length
    // )
    let wartosc = this.calculate();
    console.log(`zestawienie wartosc:`, wartosc);
    let ogolem = 0;
    let rzedy_do_sumowania = [0, 13, 14, 15, 16, 17];
    let wartosc_przychodow: number[] = [];
    wartosc_przychodow.length = this.state.grupy_odbiorcow.length;
    wartosc_przychodow.fill(0);

    console.log(
      `zestawienie this.state.grupy_odbiorcow`,
      this.state.grupy_odbiorcow
    );
    return (
      <MDBTable className="bs-2 _lines text-right _zestawienie">
        <MDBTableHead>
          <tr>
            <th>Elementy Przychodów</th>
            <th>Współczynnik alokacji</th>
            {this.state.grupy_odbiorcow.map(
              (grupa_odbiorcow: GrupyOdbiorcow, index: number) => {
                return <th>{grupa_odbiorcow.nazwa}</th>;
              }
            )}
            <th>Ogółem</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody style={{ width: "100%" }}>
          {console.log("zestawienie dupa")}
          {this.state.elementy_przychodow.map(
            (
              element_przychodu: ElementPrzychodu,
              element_przychodu_index: number
            ) => {
              console.log(
                `zestawienie element_przychodu: ${element_przychodu}, element_przychodu_index:`,
                element_przychodu_index
              );
              return (
                <tr>
                  <td className="text-left">{element_przychodu.nazwa}</td>
                  <td>
                    {element_przychodu_index !== 18
                      ? this.getWspolczynnik(
                          element_przychodu,
                          element_przychodu_index
                        )
                      : ""}
                  </td>
                  {(ogolem = 0) === 0 &&
                    this.state.grupy_odbiorcow.map(
                      (
                        grupa_odbiorcow: GrupyOdbiorcow,
                        grupa_odbiorcow_index: number
                      ) => {
                        let temp_wartosc = 0;
                        if (element_przychodu_index === 18)
                          temp_wartosc =
                            wartosc_przychodow[grupa_odbiorcow_index];
                        else
                          temp_wartosc =
                            wartosc[grupa_odbiorcow_index][
                              element_przychodu_index
                            ];

                        ogolem += temp_wartosc;
                        console.log(
                          `zestawienie wartosc[${grupa_odbiorcow_index}][${element_przychodu_index}]`,
                          wartosc[grupa_odbiorcow_index][
                            element_przychodu_index
                          ]
                        );
                        if (
                          rzedy_do_sumowania.includes(element_przychodu_index)
                        ) {
                          wartosc_przychodow[
                            grupa_odbiorcow_index
                          ] += temp_wartosc;
                        }

                        return (
                          <td>
                            {Math.round(temp_wartosc * 100 + Number.EPSILON) /
                              100}
                          </td>
                        );
                      }
                    )}
                  <td>{Math.round(ogolem * 100 + Number.EPSILON) / 100}</td>
                </tr>
              );
            }
          )}
        </MDBTableBody>
      </MDBTable>
    );
    //else return <></>;
  }

  przychodyInput() {
    let sum = 0;
    return (
      <MDBTable>
        <MDBTableHead>
          <tr>
            <th colSpan={2} className="text-center">
              Przychody w roku poprzedzającym
            </th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {this.state.grupy_odbiorcow.map(
            (grupa_odbiorcow: GrupyOdbiorcow, index: number) => {
              sum += Number(
                this.props.typ_id === 1
                  ? grupa_odbiorcow.przychody_woda
                  : grupa_odbiorcow.przychody_scieki
              );
              return (
                <tr>
                  <td>{grupa_odbiorcow.nazwa}</td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      required
                      value={
                        this.props.typ_id === 1
                          ? grupa_odbiorcow.przychody_woda
                          : grupa_odbiorcow.przychody_scieki
                      }
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) =>
                            this.props.typ_id === 1
                              ? update(prevState, {
                                  grupy_odbiorcow: {
                                    [index]: {
                                      przychody_woda: { $set: Number(value) },
                                    },
                                  },
                                })
                              : update(prevState, {
                                  grupy_odbiorcow: {
                                    [index]: {
                                      przychody_scieki: { $set: Number(value) },
                                    },
                                  },
                                })
                          );
                      }}
                    />
                  </td>
                </tr>
              );
            }
          )}
          <tr>
            <td>Suma</td>
            <td>{sum}</td>
          </tr>
        </MDBTableBody>
      </MDBTable>
    );
  }

  render() {
    return (
      <>
        {OkresyControl(
          (index, value) => {
            this.setState({ okres_id: index }, () => this.loadData());
          },
          this.state.okres_id,
          true
        )}
        {this.state.okres_id === 0 ? this.przychodyInput() : this.zestawienie()}
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          color="mdb-color"
          outline
          onClick={() => this.saveData(false)}
        >
          Zapisz
        </MDBBtn>
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          color="mdb-color"
          outline
          onClick={() => this.saveData(true)}
        >
          Zapisz i kopiuj na pozostałe okresy
        </MDBBtn>
      </>
    );
  }
}

export { Screen as Screen060_alokacja_przychodow };
