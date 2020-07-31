import React, { Component } from "react";
import update from "immutability-helper";
import {
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBInputGroup,
} from "mdbreact";
import { post, cancel } from "./post";

import {
  ModalDialogs,
  OkresyControl,
} from "./modal_dialogs";

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
  koszty_ogolem: KosztyOgolem[];
};

export default class Screen extends Component<Props, State> {
  state: State = {
    okres_id: 1,
    elementy_przychodow: [],
    wspolczynnik_alokacji: [],
    wspolczynnik_alokacji_selected: [],
    grupy_odbiorcow: [],
    grupa_wspolczynnik: [],
    koszty_ogolem: [],
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
    if (prevProps.typ_id !== this.props.typ_id) {
      this.setState({
        elementy_przychodow: [],
        wspolczynnik_alokacji: [],
        wspolczynnik_alokacji_selected: [],
        grupy_odbiorcow: [],
        grupa_wspolczynnik: [],
        koszty_ogolem: [],
      },this.loadData);
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

  loadKosztyOgolem = () => {
    post(
      "/alokacja_przychodow/select_koszty",
      {
        wniosek_id: this.props.wniosek_id,
        typ_id: this.props.typ_id,
      },
      (response) => {
        console.log("Screen060 loadKosztyOgolem response:", response);
        this.setState({ koszty_ogolem: response.data }, () =>
          console.log("Screen060 loadKosztyOgolem state:", this.state)
        );
      }
    );
  };

  loadData = () => {
    console.log("Screen060 loadData");
    this.loadElementPrzychodu();
    this.loadWspolczynnikAlokacji();
    this.loadWspolczynnikAlokacjiSelested();
    this.loadGrupyOdbiorcow();
    this.loadGrupyWspolczynnik();
    this.loadKosztyOgolem();
  };

  saveData = () => {
    post(
      "/alokacja_przychodow/update",
      {
        wniosek_id: this.props.wniosek_id,
        typ_id: this.props.typ_id,
        okres_id: this.state.okres_id,
        wspolczynnik_alokacji_selected: this.state
          .wspolczynnik_alokacji_selected,
      },
      (response) => {
        console.log("Screen060 saveData response:", response);
      }
    );
  }

  onWspolczynnikChange(
    w: WspolczynnikAlokacji,
    elementy_przychodow: ElementPrzychodu
  ) {
    let wspolczynnik: WspolczynnikAlokacjiSelected[] = [
      {
        id: 0,
        elementy_przychodow_id: elementy_przychodow.id,
        popyt_element_sprzedazy_id: w.popyt_element_sprzedazy_id,
        popyt_warianty_id: w.popyt_warianty_id,
        abonament: w.popyt_element_sprzedazy_abonament,
      },
    ];
    let index = 0;
    for (let ws of this.state.wspolczynnik_alokacji_selected) {
      if (ws.elementy_przychodow_id === elementy_przychodow.id) {
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
                  $set: w.popyt_element_sprzedazy_abonament,
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
  
  getWspolczynnik(elementy_przychodow: ElementPrzychodu) {
    if (elementy_przychodow.poziom !== 2) return;

    let selected = {} as WspolczynnikAlokacjiSelected;
    this.state.wspolczynnik_alokacji_selected.map(
      (item: WspolczynnikAlokacjiSelected, index: number) => {
        if (item.elementy_przychodow_id === elementy_przychodow.id)
          selected = item;
      }
    );
    return (
      <MDBInputGroup
        containerClassName="mb-3"
        inputs={
          <select
            className="browser-default custom-select"
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.onWspolczynnikChange(JSON.parse(value), elementy_przychodow);
            }}
          >
            {this.state.wspolczynnik_alokacji.map(
              (item: WspolczynnikAlokacji, index: number) => {
                return (
                  <>
                    <option
                      value={JSON.stringify(item)}
                      selected={
                        selected.popyt_warianty_id === item.popyt_warianty_id &&
                        selected.popyt_element_sprzedazy_id ===
                          item.popyt_element_sprzedazy_id &&
                        selected.abonament ===
                          item.popyt_element_sprzedazy_abonament
                      }
                    >
                      {item.popyt_warianty_nazwa +
                        " " +
                        item.popyt_element_sprzedazy_nazwa}
                    </option>
                    {item.popyt_element_sprzedazy_abonament_nazwa ? (
                      <option
                        value={
                          item.popyt_warianty_nazwa +
                          " " +
                          item.popyt_element_sprzedazy_abonament_nazwa
                        }
                        selected={
                          selected.popyt_warianty_id ===
                            item.popyt_warianty_id &&
                          selected.popyt_element_sprzedazy_id ===
                            item.popyt_element_sprzedazy_id &&
                          selected.abonament ===
                            item.popyt_element_sprzedazy_abonament
                        }
                      >
                        {item.popyt_warianty_nazwa +
                          " " +
                          item.popyt_element_sprzedazy_abonament_nazwa}
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
      for (
        let index = this.state.elementy_przychodow.length - 1;
        index >= 0;
        index--
      ) {
        let e: ElementPrzychodu = this.state.elementy_przychodow[index];
        console.log("screen060_alokacja_przychodow calculate e:", e);
        switch (e.poziom) {
          case 0:
          case 1:
            ret[g][index] = level[e.poziom + 1];
            level[e.poziom + 1] = 0;
            level[e.poziom] += ret[g][index];
            break;
          case 2:
            ret[g][index] =
              this.getOgolem(e) *
              this.getGrupaWspolczynnik(this.state.grupy_odbiorcow[g].id, e);
            level[e.poziom] += ret[g][index];
            break;
        }
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

      let wspolczynnik_alokacji_selected = {
        id: 0,
        elementy_przychodow_id: element_przychodu.id,
        popyt_element_sprzedazy_id: wa.popyt_element_sprzedazy_id,
        popyt_warianty_id: wa.popyt_warianty_id,
        abonament: wa.popyt_element_sprzedazy_abonament,
      } as WspolczynnikAlokacjiSelected;

      for (const item of this.state.wspolczynnik_alokacji_selected) {
        if (item.elementy_przychodow_id === element_przychodu.id) {
          wspolczynnik_alokacji_selected = item;
        }
      }
      for (const g of this.state.grupa_wspolczynnik) {
        if (
          g.grupy_odbiorcow_id === grupy_odbiorcow_id &&
          g.popyt_element_sprzedazy_id ===
            wspolczynnik_alokacji_selected.popyt_element_sprzedazy_id &&
          g.popyt_warianty_id ===
            wspolczynnik_alokacji_selected.popyt_warianty_id &&
          wspolczynnik_alokacji_selected.abonament ===
            g.popyt_element_sprzedazy_abonament
        ) {
          if (g.popyt_element_sprzedazy_abonament === true) {
            return g.wspolczynnik_abonament;
          } else {
            return g.wspolczynnik;
          }
        }
      }
    }
    return 0;
  }

  getOgolem(elementy_przychodow: ElementPrzychodu) {
    let koszt = {} as KosztyOgolem;
    let koszt_set: boolean = false;
    this.state.koszty_ogolem.map((item: KosztyOgolem, index: number) => {
      if (item.elementy_przychodow_id === elementy_przychodow.id) {
        koszt = item;
        koszt_set = true;
      }
    });
    let value = 0;
    if (koszt_set)
      switch (this.state.okres_id) {
        case 1:
          value = koszt.rok_nowych_taryf_1;
          break;
        case 2:
          value = koszt.rok_nowych_taryf_2;
          break;
        case 3:
          value = koszt.rok_nowych_taryf_3;
          break;
      }
    return value;
  }

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
          {this.state.elementy_przychodow.map(
            (
              element_przychodu: ElementPrzychodu,
              element_przychodu_index: number
            ) => {
              return (
                <tr>
                  <td>{element_przychodu.nazwa}</td>
                  <td>{this.getWspolczynnik(element_przychodu)}</td>
                  {this.state.grupy_odbiorcow.map(
                    (
                      grupa_odbiorcow: GrupyOdbiorcow,
                      grupa_odbiorcow_index: number
                    ) => {
                      return (
                        <td>
                          {
                            wartosc[grupa_odbiorcow_index][
                              element_przychodu_index
                            ]
                          }
                        </td>
                      );
                    }
                  )}
                  <td>{this.getOgolem(element_przychodu)}</td>
                </tr>
              );
            }
          )}
        </MDBTableBody>
      </MDBTable>
    );
    //else return <></>;
  }

  render() {
    return (
      <>
        {OkresyControl((index, value) => {
          this.setState({ okres_id: index + 1 }, () => this.loadData());
        }, this.state.okres_id)}
        {this.zestawienie()}
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          color="mdb-color"
          outline
          onClick={this.saveData}
        >
          Zapisz
        </MDBBtn>
      </>
    );
  }
}

export { Screen as Screen060_alokacja_przychodow };
