import React, { Component } from "react";
import update from "immutability-helper";
import { post, cancel } from "./post";

import {
  GrupyOdbiorcow,
  ElementSprzedazy,
  WariantSymulacji,
} from "../../../common/model";

import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBTable,
  MDBTableBody,
  MDBInput,
  MDBModalFooter,
  MDBBtn,
} from "mdbreact";
import { OkresyControl } from "./modal_dialogs";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

enum CalcChangeSource {
  sprzedaz_wartosc,
  sprzedaz_suma_docelowa,
  sprzedaz_procent,
  abonament_wartosc,
  abonament_wartosc_docelowa,
  abonament_procent,
  abonament_wspolczynnik,
}

export enum LiczenieAbonamentu {
  wskaznik,
  dopelnienie,
  procent,
}

export type WariantSymulacjiGrupy = {
  grupy_odbiorcow_id_valid: number;
  nazwa: string;
  okresy_dict_id: number;
  id: number;
  wariant_id: number;
  grupy_odbiorcow_id: number;
  okres_id: number;
  sprzedaz: number;
  sprzedaz_wspolczynnik_alokacji: number;
  oplaty_abonament: number;
  oplaty_abonament_wspolczynnik_a: number;
  suma: number;
  typ_alokacji_abonament: LiczenieAbonamentu;
  liczba_odbiorcow: number;
};

type WariantSymulacjiSumy = {
  okres_id: number;
  sprzedaz: number;
  sprzedaz_docelowa: number;
  sprzedaz_roznica: number;
  wspolczynnik_alokacji: number;
  oplaty_abonament: number;
  oplaty_abonament_docelowa: number;
  oplaty_abonament_roznica: number;
  wspolczynnik_alokacji_abonament: number;
  wskaznik: number;
};

type Props = {
  callback: (update: boolean) => void;
  wniosek_id: number;
  element_sprzedazy: ElementSprzedazy;
  wariant_symulacji_id: number;
};

type State = {
  typ_id: number;
  //grupy_odbiorcow: GrupyOdbiorcow[];
  grupy: WariantSymulacjiGrupy[];
  grupy_wybrane: number[];
  sumy: WariantSymulacjiSumy[];
  suma_wybrana: number;
  okres_id: number;
  wariant: WariantSymulacji;
  wariant_okres_id: number;
};

export default class ModalWariantSymulacji extends Component<Props, State> {
  state: State = {
    typ_id: 1,
    //grupy_odbiorcow: [],
    grupy: [],
    grupy_wybrane: [],
    sumy: [],
    suma_wybrana: -1,
    okres_id: 0,
    wariant: {
      id: 0,
      nazwa: "",
      opis: "",
    },
    wariant_okres_id: 1,
  };

  constructor(props: Props) {
    super(props);
    console.log("ModalWariantSymulacji constructor, props: ", props);
  }

  componentDidMount() {
    console.log("ModalWariantSymulacji componentDidMount");
    if (this.props.wariant_symulacji_id === -1) {
      this.setState({
        wariant: {
          id: 0,
          nazwa: "",
          opis: "",
        },
      });
      this.loadDataGrupyOdbiorcow();
      this.loadDataSumy();
    } else {
      this.loadDataWariantSymulacji(() => {
        this.loadDataGrupyOdbiorcow();
        this.loadDataSumy();
      });
    }
  }

  dodaj = () => {
    console.log("ModalWariantSymulacji onWariantSymulacjiDodaj");
    console.log(this.state);
    post(
      "/popyt_warianty_symulacji/insert",
      {
        element_sprzedazy_id: this.props.element_sprzedazy.id,
        wariant: this.state.wariant,
        okres: this.state.wariant_okres_id,
        odbiorcy: this.state.grupy,
        sumy: this.state.sumy,
      },
      (response) => {
        this.props.callback(true);
      }
    );
  };

  edytuj = () => {
    console.log(
      "ModalWariantSymulacji onWariantSymulacjiEdytuj state:",
      this.state
    );
    post(
      "/popyt_warianty_symulacji/update",
      {
        element_sprzedazy_id: this.props.element_sprzedazy.id,
        wariant: this.state.wariant,
        okres: this.state.wariant_okres_id,
        odbiorcy: this.state.grupy,
        sumy: this.state.sumy,
      },
      (response) => {
        console.log(
          "ModalWariantSymulacji onWariantSymulacjiEdytuj response:",
          response
        );
        this.props.callback(true);
      }
    );
  };

  selectGrupaOdbiorcow = (okres_id: number) => {
    console.log(
      "ModalWariantSymulacji selectGrupaOdbiorcow okres_id:",
      okres_id
    );
    this.setState(
      (prevState) =>
        update(prevState, {
          grupy_wybrane: {
            $apply: (): number[] => {
              let group: number[] = [];
              prevState.grupy.map((item, index) => {
                if (okres_id === Number(item.okresy_dict_id)) {
                  console.log(
                    "ModalWariantSymulacji selectGrupaOdbiorcow item pushed"
                  );
                  group.push(index);
                }
              });
              return group;
            },
          },
          wariant_okres_id: { $set: okres_id },
        }),
      () => {
        console.log(
          "ModalWariantSymulacji selectGrupaOdbiorcow state:",
          this.state
        );
      }
    );
  };

  selectSuma = (okres_id: number) => {
    console.log("ModalWariantSymulacji selectSuma okres_id:", okres_id);
    this.setState(
      (prevState) =>
        update(prevState, {
          suma_wybrana: {
            $apply: () => {
              let suma_index = 0;
              prevState.sumy.map((item, index) => {
                if (okres_id === Number(item.okres_id)) {
                  suma_index = index;
                }
              });
              return suma_index;
            },
          },
          wariant_okres_id: { $set: okres_id },
        }),
      () => {
        console.log("ModalWariantSymulacji selectSuma state:", this.state);
      }
    );
  };

  loadDataWariantSymulacji = (next?: any) => {
    post(
      "/popyt_warianty_symulacji/select_one",
      {
        wariant_symulacji_id: this.props.wariant_symulacji_id,
      },
      (response) => {
        console.log(
          "ModalWariantSymulacji loadDataWariantSymulacji response:",
          response
        );

        this.setState(
          {
            wariant: response.data[0],
          },
          () => {
            console.log(
              "ModalWariantSymulacji loadDataWariantSymulacji state:",
              this.state
            );
            next && next();
          }
        );
      }
    );
  };

  loadDataGrupyOdbiorcow = () => {
    console.log("Screen040 loadDataGrupyOdbiorcow before state:", this.state);
    post(
      "/popyt_warianty_symulacji/select_odbiorcy",
      {
        wniosek_id: this.props.wniosek_id,
        typ_id: this.state.typ_id,
        okres_id: this.state.wariant_okres_id,
        wariant_id: this.state.wariant.id,
      },
      (response) => {
        console.log("Screen040 loadDataGrupyOdbiorcow response:", response);
        this.setState(
          {
            grupy: response.data,
          },
          () => {
            console.log("Screen040 loadDataGrupyOdbiorcow state:", this.state);
            this.selectGrupaOdbiorcow(this.state.wariant_okres_id);
          }
        );
      }
    );
  };

  loadDataSumy = () => {
    post(
      "/popyt_warianty_symulacji/select_sumy",
      {
        wariant_id: this.state.wariant.id,
        okres_id: this.state.wariant_okres_id,
      },
      (response) => {
        let sumy: WariantSymulacjiSumy[] = [];
        console.log("Screen040 loadDataSumy response:", response);
        response.data.map((item: any, index: number) => {
          sumy.push({
            okres_id: item.okres_id,
            sprzedaz: 0,
            sprzedaz_docelowa: item.sprzedaz,
            sprzedaz_roznica: 0,
            wspolczynnik_alokacji: 0,
            oplaty_abonament: 0,
            oplaty_abonament_docelowa: item.oplaty_abonament,
            oplaty_abonament_roznica: 0,
            wspolczynnik_alokacji_abonament: 0,
            wskaznik: 1,
          });
        });
        this.setState(
          {
            sumy: sumy,
            suma_wybrana: this.state.wariant_okres_id - 1,
          },
          () => {
            console.log("Screen040 loadDataSumy state:", this.state);
            this.selectSuma(this.state.wariant_okres_id);
          }
        );
      }
    );
  };

  onLiczenieAbonementu = (index: number, typ_liczenia: LiczenieAbonamentu) => {
    this.setState(
      (previousState) =>
        update(previousState, {
          grupy: {
            [index]: {
              typ_alokacji_abonament: { $set: typ_liczenia },
            },
          },
        }),
      () => {
        console.log("modalWariant OnLiczenieAbonementu state:", this.state);
        this.Calculate(CalcChangeSource.abonament_procent);
      }
    );
  };

  mapWariantSymulacjiGrupy = (
    func: (item: WariantSymulacjiGrupy, index: number) => any
  ) => {
    let ret: any;
    this.state.grupy_wybrane.map((item: any, index: number) => {
      ret = func(this.state.grupy[item], item);
    });
    return ret;
  };

  Calculate = (change_source: CalcChangeSource) => {
    console.log("Calculate was called change_source:", change_source);
    if (!this.state.sumy) {
      console.log(
        "Calculate error, this.state.wariant_symulacji_sumy not defined"
      );
      return;
    }

    let sprzedaz_sum = 0;
    this.mapWariantSymulacjiGrupy(
      (grupa: WariantSymulacjiGrupy, index: number) => {
        sprzedaz_sum += grupa.sprzedaz;
      }
    );
    let oplaty_abonament_sum = 0;
    this.mapWariantSymulacjiGrupy(
      (grupa: WariantSymulacjiGrupy, index: number) => {
        oplaty_abonament_sum += grupa.oplaty_abonament;
      }
    );
    this.mapWariantSymulacjiGrupy(
      (grupa: WariantSymulacjiGrupy, index: number) => {
        if (change_source === CalcChangeSource.sprzedaz_wartosc) {
          if (sprzedaz_sum > 0) {
            grupa.sprzedaz_wspolczynnik_alokacji =
              (100 * grupa.sprzedaz) / sprzedaz_sum;
          } else grupa.sprzedaz_wspolczynnik_alokacji = 0;
        } else if (
          change_source === CalcChangeSource.sprzedaz_suma_docelowa ||
          change_source === CalcChangeSource.sprzedaz_procent
        ) {
          if (this.state.sumy)
            grupa.sprzedaz =
              (grupa.sprzedaz_wspolczynnik_alokacji *
                this.state.sumy[this.state.suma_wybrana].sprzedaz_docelowa) /
              100;
        } else if (change_source === CalcChangeSource.abonament_wartosc) {
          if (oplaty_abonament_sum > 0) {
            grupa.oplaty_abonament_wspolczynnik_a =
              (100 * grupa.oplaty_abonament) / oplaty_abonament_sum;
          } else grupa.oplaty_abonament_wspolczynnik_a = 0;
        } else if (
          change_source === CalcChangeSource.abonament_wspolczynnik ||
          change_source === CalcChangeSource.abonament_wartosc_docelowa ||
          change_source === CalcChangeSource.abonament_procent
        ) {
          if (grupa.typ_alokacji_abonament === LiczenieAbonamentu.procent) {
            if (this.state.sumy)
              grupa.oplaty_abonament =
                (grupa.oplaty_abonament_wspolczynnik_a *
                  this.state.sumy[this.state.suma_wybrana]
                    .oplaty_abonament_docelowa) /
                100;
          } else if (
            grupa.typ_alokacji_abonament === LiczenieAbonamentu.wskaznik
          ) {
            if (this.state.sumy)
              grupa.oplaty_abonament_wspolczynnik_a =
                grupa.sprzedaz_wspolczynnik_alokacji *
                this.state.sumy[this.state.suma_wybrana].wskaznik;
          } else if (
            grupa.typ_alokacji_abonament === LiczenieAbonamentu.dopelnienie
          ) {
            let sum1 = 0;
            let sum2 = 0;
            this.mapWariantSymulacjiGrupy(
              (grupa2: WariantSymulacjiGrupy, index2: number) => {
                if (index2 <= index)
                  sum1 += grupa2.sprzedaz_wspolczynnik_alokacji;
                else sum2 += grupa2.sprzedaz_wspolczynnik_alokacji;
              }
            );
            grupa.oplaty_abonament_wspolczynnik_a =
              (grupa.sprzedaz_wspolczynnik_alokacji / sum1) * (1 - sum2);
          }
        }
        //todo: move it out of loop, here only collect data
        this.setState(
          (prevState) => {
            return update(prevState, { grupy: { [index]: { $set: grupa } } });
          },
          () => {
            let sprzedaz_sum = 0;
            this.mapWariantSymulacjiGrupy(
              (grupa: WariantSymulacjiGrupy, index: number) => {
                sprzedaz_sum += grupa.sprzedaz;
              }
            );
            let sprzedaz_wspolczynnik_alokacji_sum = 0;
            this.mapWariantSymulacjiGrupy(
              (grupa: WariantSymulacjiGrupy, index: number) => {
                sprzedaz_wspolczynnik_alokacji_sum +=
                  grupa.sprzedaz_wspolczynnik_alokacji;
              }
            );
            let oplaty_abonament_sum = 0;
            this.mapWariantSymulacjiGrupy(
              (grupa: WariantSymulacjiGrupy, index: number) => {
                oplaty_abonament_sum += grupa.oplaty_abonament;
              }
            );
            let abonament_wspolczynnik_alokacji_sum = 0;
            this.mapWariantSymulacjiGrupy(
              (grupa: WariantSymulacjiGrupy, index: number) => {
                abonament_wspolczynnik_alokacji_sum +=
                  grupa.oplaty_abonament_wspolczynnik_a;
              }
            );
            this.setState(
              (prevState) => {
                return update(prevState, {
                  sumy: {
                    [prevState.suma_wybrana]: {
                      sprzedaz: { $set: sprzedaz_sum },
                      sprzedaz_roznica: {
                        $set:
                          sprzedaz_sum -
                          prevState.sumy[prevState.suma_wybrana]
                            .sprzedaz_docelowa,
                      },
                      wspolczynnik_alokacji: {
                        $set: sprzedaz_wspolczynnik_alokacji_sum,
                      },
                      oplaty_abonament: { $set: oplaty_abonament_sum },
                      oplaty_abonament_roznica: {
                        $set:
                          oplaty_abonament_sum -
                          prevState.sumy[prevState.suma_wybrana]
                            .oplaty_abonament_docelowa,
                      },
                      wspolczynnik_alokacji_abonament: {
                        $set: abonament_wspolczynnik_alokacji_sum,
                      },
                    },
                  },
                });
              },
              () =>
                console.log(
                  "Screen040 ModalWariantSymulacji calculate state:",
                  this.state
                )
            );
          }
        );
      }
    );
  };

  render() {
    console.log("Screen040 ModalWariantSymulacji render state:", this.state);
    if (!this.state.sumy || this.state.sumy.length === 0) return <></>;
    else
      return (
        <MDBModal isOpen={true} className="modal-fluid">
          <MDBModalHeader>
            {this.props.wariant_symulacji_id === -1
              ? "Dodaj nowy wariant symulacji"
              : "Edytuj typ kosztów"}
          </MDBModalHeader>
          <MDBModalBody>
            <MDBTable borderless>
              <MDBTableBody>
                <tr>
                  <td>
                    <MDBInput
                      type="text"
                      label="Nazwa:"
                      value={this.state.wariant.nazwa}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        this.setState((prevState) =>
                          update(prevState, {
                            wariant: { nazwa: { $set: value } },
                          })
                        );
                      }}
                    ></MDBInput>
                    <MDBInput
                      type="text"
                      label="Opis:"
                      value={this.state.wariant.opis}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        this.setState((prevState) =>
                          update(prevState, {
                            wariant: { opis: { $set: value } },
                          })
                        );
                      }}
                    ></MDBInput>
                  </td>
                </tr>
                <tr>
                  <td>
                    {OkresyControl((index, value) => {
                      console.log("OkresyControl value:", value);
                      this.selectGrupaOdbiorcow(index + 1);
                      this.selectSuma(index + 1);
                    }, this.state.wariant_okres_id)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <MDBTable bordered>
                      <MDBTableBody>
                        <tr>
                          <th></th>
                          <th>
                            sprzedaż, m<sup>3</sup>
                          </th>
                          <th>A, %</th>
                          <th>opłaty ab., zł</th>
                          <th>B, %</th>
                          <th>suma, zł</th>
                          <th>
                            wg wskaźnika
                            <MDBInput
                              noTag
                              className="text-right"
                              style={{ width: "100px" }}
                              type="text"
                              value={
                                this.state.sumy[this.state.suma_wybrana]
                                  .wskaznik
                              }
                              onChange={(event) => {
                                const { value } = event.currentTarget;
                                console.log("wg wskaźnika value:", value);
                                this.setState(
                                  (prevState) => {
                                    console.log(
                                      "wg wskaźnika before state:",
                                      this.state
                                    );
                                    return update(prevState, {
                                      sumy: {
                                        [prevState.suma_wybrana]: {
                                          wskaznik: { $set: Number(value) },
                                        },
                                      },
                                    });
                                  },
                                  () => {
                                    console.log(
                                      "wg wskaźnika after state:",
                                      this.state
                                    );
                                    this.Calculate(
                                      CalcChangeSource.abonament_wspolczynnik
                                    );
                                  }
                                );
                              }}
                            />
                          </th>
                          <th>jako dopełnienie</th>
                          <th>jako % z całości</th>
                          <th>liczba odbiorców</th>
                        </tr>
                        {this.state.grupy_wybrane.map((item, index) => (
                          <tr key={index}>
                            <th>{this.state.grupy[item].nazwa}</th>
                            <td>
                              <MDBInput
                                noTag
                                className="text-right"
                                style={{ width: "100px" }}
                                type="text"
                                value={this.state.grupy[item].sprzedaz}
                                onChange={(event) => {
                                  const { value } = event.currentTarget;
                                  this.setState(
                                    (prevState) =>
                                      update(prevState, {
                                        grupy: {
                                          [item]: {
                                            sprzedaz: { $set: Number(value) },
                                          },
                                        },
                                      }),
                                    () =>
                                      this.Calculate(
                                        CalcChangeSource.sprzedaz_wartosc
                                      )
                                  );
                                }}
                              />
                            </td>
                            <td>
                              <MDBInput
                                noTag
                                className="text-right"
                                style={{ width: "100px" }}
                                type="text"
                                value={
                                  this.state.grupy[item]
                                    .sprzedaz_wspolczynnik_alokacji
                                }
                                onChange={(event) => {
                                  const { value } = event.currentTarget;
                                  this.setState(
                                    (prevState) =>
                                      update(prevState, {
                                        grupy: {
                                          [item]: {
                                            sprzedaz_wspolczynnik_alokacji: {
                                              $set: Number(value),
                                            },
                                          },
                                        },
                                      }),
                                    () =>
                                      this.Calculate(
                                        CalcChangeSource.sprzedaz_procent
                                      )
                                  );
                                }}
                              />
                            </td>
                            {this.props.element_sprzedazy.abonament ? (
                              <>
                                <td>
                                  <MDBInput
                                    noTag
                                    className="text-right"
                                    style={{ width: "100px" }}
                                    type="text"
                                    value={
                                      this.state.grupy[item].oplaty_abonament
                                    }
                                    onChange={(event) => {
                                      const { value } = event.currentTarget;
                                      this.setState(
                                        (prevState) =>
                                          update(prevState, {
                                            grupy: {
                                              [item]: {
                                                oplaty_abonament: {
                                                  $set: Number(value),
                                                },
                                              },
                                            },
                                          }),
                                        () =>
                                          this.Calculate(
                                            CalcChangeSource.abonament_wartosc
                                          )
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  <MDBInput
                                    noTag
                                    className="text-right"
                                    style={{ width: "100px" }}
                                    type="text"
                                    value={
                                      this.state.grupy[item]
                                        .oplaty_abonament_wspolczynnik_a
                                    }
                                    onChange={(event) => {
                                      const { value } = event.currentTarget;
                                      this.setState(
                                        (prevState) =>
                                          update(prevState, {
                                            grupy: {
                                              [item]: {
                                                oplaty_abonament_wspolczynnik_a: {
                                                  $set: Number(value),
                                                },
                                              },
                                            },
                                          }),
                                        () => {
                                          console.log(
                                            "onChange abonament_wspolczynnik state:",
                                            this.state
                                          );
                                          this.Calculate(
                                            CalcChangeSource.abonament_procent
                                          );
                                        }
                                      );
                                    }}
                                  />
                                </td>
                                <td>{this.state.grupy[item].suma}</td>
                                <td
                                  onClick={() =>
                                    this.onLiczenieAbonementu(
                                      item,
                                      LiczenieAbonamentu.wskaznik
                                    )
                                  }
                                >
                                  <MDBInput
                                    checked={
                                      Number(
                                        this.state.grupy[item]
                                          .typ_alokacji_abonament
                                      ) === LiczenieAbonamentu.wskaznik
                                        ? true
                                        : false
                                    }
                                    type="radio"
                                    id={"liczenie_abonamentu_" + index}
                                  />
                                </td>
                                <td
                                  onClick={() =>
                                    this.onLiczenieAbonementu(
                                      item,
                                      LiczenieAbonamentu.dopelnienie
                                    )
                                  }
                                >
                                  <MDBInput
                                    checked={
                                      Number(
                                        this.state.grupy[item]
                                          .typ_alokacji_abonament
                                      ) === LiczenieAbonamentu.dopelnienie
                                        ? true
                                        : false
                                    }
                                    type="radio"
                                    id={"liczenie_abonamentu_" + index}
                                  />
                                </td>
                                <td
                                  onClick={() =>
                                    this.onLiczenieAbonementu(
                                      item,
                                      LiczenieAbonamentu.procent
                                    )
                                  }
                                >
                                  <MDBInput
                                    checked={
                                      Number(
                                        this.state.grupy[item]
                                          .typ_alokacji_abonament
                                      ) === LiczenieAbonamentu.procent
                                        ? true
                                        : false
                                    }
                                    type="radio"
                                    id={"liczenie_abonamentu_" + index}
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td colSpan={6}></td>
                              </>
                            )}
                            <td>
                              <MDBInput
                                noTag
                                className="text-right"
                                style={{ width: "100px" }}
                                type="text"
                                value={this.state.grupy[item].liczba_odbiorcow}
                                onChange={(event) => {
                                  const { value } = event.currentTarget;
                                  this.setState((prevState) =>
                                    update(prevState, {
                                      grupy: {
                                        [item]: {
                                          liczba_odbiorcow: {
                                            $set: Number(value),
                                          },
                                        },
                                      },
                                    })
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <th>Suma</th>
                          <td>
                            {this.state.sumy[this.state.suma_wybrana].sprzedaz}
                          </td>
                          <td>
                            {
                              this.state.sumy[this.state.suma_wybrana]
                                .wspolczynnik_alokacji
                            }
                          </td>
                          <td>
                            {
                              this.state.sumy[this.state.suma_wybrana]
                                .oplaty_abonament
                            }
                          </td>
                          <td>
                            {
                              this.state.sumy[this.state.suma_wybrana]
                                .wspolczynnik_alokacji_abonament
                            }
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Suma docelowa</th>
                          <td>
                            <MDBInput
                              noTag
                              className="text-right"
                              style={{ width: "100px" }}
                              type="text"
                              value={
                                this.state.sumy[this.state.suma_wybrana]
                                  .sprzedaz_docelowa
                              }
                              onChange={(event) => {
                                const { value } = event.currentTarget;
                                this.setState(
                                  (prevState) =>
                                    update(prevState, {
                                      sumy: {
                                        [prevState.suma_wybrana]: {
                                          sprzedaz_docelowa: {
                                            $set: Number(value),
                                          },
                                        },
                                      },
                                    }),
                                  () =>
                                    this.Calculate(
                                      CalcChangeSource.sprzedaz_suma_docelowa
                                    )
                                );
                              }}
                            />
                          </td>
                          <td></td>
                          <td>
                            <MDBInput
                              noTag
                              className="text-right"
                              style={{ width: "100px" }}
                              type="text"
                              value={
                                this.state.sumy[this.state.suma_wybrana]
                                  .oplaty_abonament_docelowa
                              }
                              onChange={(event) => {
                                const { value } = event.currentTarget;
                                this.setState(
                                  (prevState) =>
                                    update(prevState, {
                                      sumy: {
                                        [prevState.suma_wybrana]: {
                                          oplaty_abonament_docelowa: {
                                            $set: Number(value),
                                          },
                                        },
                                      },
                                    }),
                                  () =>
                                    this.Calculate(
                                      CalcChangeSource.abonament_wartosc_docelowa
                                    )
                                );
                              }}
                            />
                          </td>

                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <th>Różnica</th>
                          <td>
                            {
                              this.state.sumy[this.state.suma_wybrana]
                                .sprzedaz_roznica
                            }
                          </td>
                          <td></td>
                          <td>
                            {
                              this.state.sumy[this.state.suma_wybrana]
                                .oplaty_abonament_roznica
                            }
                          </td>

                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </MDBTableBody>
                    </MDBTable>
                  </td>
                </tr>
                <tr>
                  <td>
                    <MDBTable bordered>
                      <MDBTableBody>
                        <tr>
                          <td>Grupa Taryfowa</td>
                          <td>cena 1 m3 wody w zł/m3</td>
                          <td>Zmiana %</td>
                          <td>cena 1 m3 ścieków w zł/m3</td>
                          <td>Zmiana %</td>
                        </tr>
                        <tr>
                          <td>grupa 1</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </MDBTableBody>
                    </MDBTable>
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              onClick={() => this.props.callback(false)}
            >
              Anuluj
            </MDBBtn>
            <MDBBtn
              color="primary"
              onClick={() => {
                this.props.wariant_symulacji_id === -1
                  ? this.dodaj()
                  : this.edytuj();
                this.props.callback(true);
              }}
            >
              Akceptuj
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      );
  }
}
