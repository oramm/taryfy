import React, { Component } from "react";
import {
  MDBBtn,
  MDBBox,
  MDBTable,
  MDBTableBody,
  MDBInput,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBInputGroup,
  MDBContainer,
  MDBTableHead,
} from "mdbreact";
import { post, cancel } from "./post";

import {
  ModalDialogs,
  ModalDialogsGetFake,
  GrupyAllokacjiControl,
  OkresyControl,
} from "./modal_dialogs";

import { GrupyOdbiorcow, GrupyOdbiorcowEmpty } from "../../../common/model";

type Props = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type ElementSprzedazy = {
  id: number;
  wniosek_id: number;
  typ_id: number;
  nazwa: string;
  opis: string;
  wspolczynnik: string;
  jednostka: string;
  abonament: boolean;
  abonament_nazwa: string;
  abonament_wspolczynnik: string;
  wariant_id: number;
};
let ElementSprzedazyEmpty = {
  id: 0,
  wniosek_id: 0,
  typ_id: 0,
  nazwa: "",
  opis: "",
  wspolczynnik: "",
  jednostka: "",
  abonament: false,
  abonament_nazwa: "",
  abonament_wspolczynnik: "",
  wariant_id: 0,
};

type WariantSymulacji = {
  id: number;
  nazwa: string;
  opis: string;
};

// let WariantSymulacjiEmpty: WariantSymulacji = {
//   id: 0,
//   nazwa: "",
//   opis: "",
// };

type WariantSymulacjiGrupy = {
  grupy_odbiorcow_id_valid: number;
  nazwa: string;
  okresy_dict_id: number;
  id: number;
  wariant_id: number;
  grupy_odbiorcow_id: number;
  okres_id: number;
  sprzedaz: number;
  wspolczynnik_alokacji: number;
  oplaty_abonament: number;
  wspolczynnik_alokacji_abonament: number;
  typ: string;
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
};

let WariantSymulacjiSumyEmpty: WariantSymulacjiSumy = {
  okres_id: 1,
  sprzedaz: 0,
  sprzedaz_docelowa: 0,
  sprzedaz_roznica: 0,
  wspolczynnik_alokacji: 0,
  oplaty_abonament: 0,
  oplaty_abonament_docelowa: 0,
  oplaty_abonament_roznica: 0,
  wspolczynnik_alokacji_abonament: 0,
};

type State = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  elementy_sprzedazy: ElementSprzedazy[];
  elementy_sprzedazy_selected: number;
  //grupy_odbiorcow: GrupyOdbiorcow[];
  wariant_symulacji_grupy: WariantSymulacjiGrupy[];
  wariant_symulacji_grupy_wybrana: WariantSymulacjiGrupy[];
  wariant_symulacji_sumy: WariantSymulacjiSumy[];
  wariant_symulacji_sumy_wybrana: WariantSymulacjiSumy;
  warianty_symulacji: WariantSymulacji[];
  wskaznik_1: string;
  wskaznik_2: string;
  wskaznik_3: string;
  okres_id: number;
  zestawienie: any[];
  modal_dialogs: ModalDialogs;
  modal_sprzedaz_label: string;
  modal_sprzedaz: ElementSprzedazy;
  modal_sprzedaz_on: boolean;
  modal_wariant_label: string;
  modal_wariant: WariantSymulacji;
  modal_wariant_okres_id: number;
  modal_wariant_on: boolean;
  modal_sprzedaz_callback: (element_sprzedazy: ElementSprzedazy) => void;
  modal_wariant_callback: () => void;
};

export default class Screen extends Component<Props, State> {
  state: State = {
    callback: (index: number) => {},
    wniosek_id: 0,
    typ_id: 1,
    modal_dialogs: ModalDialogsGetFake(),
    elementy_sprzedazy: [],
    elementy_sprzedazy_selected: -1,
    //grupy_odbiorcow: [],
    wariant_symulacji_grupy: [],
    wariant_symulacji_grupy_wybrana: [],
    wariant_symulacji_sumy: [],
    wariant_symulacji_sumy_wybrana: {
      okres_id: 0,
      sprzedaz: 0,
      sprzedaz_docelowa: 0,
      sprzedaz_roznica: 0,
      wspolczynnik_alokacji: 0,
      oplaty_abonament: 0,
      oplaty_abonament_docelowa: 0,
      oplaty_abonament_roznica: 0,
      wspolczynnik_alokacji_abonament: 0,
    },
    warianty_symulacji: [],
    wskaznik_1: "1.0",
    wskaznik_2: "1.0",
    wskaznik_3: "1.0",
    okres_id: 1,
    zestawienie: [],
    modal_sprzedaz_label: "",
    modal_sprzedaz: {
      id: 0,
      wniosek_id: 0,
      typ_id: 0,
      nazwa: "",
      opis: "",
      wspolczynnik: "",
      jednostka: "",
      abonament: false,
      abonament_nazwa: "",
      abonament_wspolczynnik: "",
      wariant_id: 0,
    },
    modal_sprzedaz_on: false,
    modal_wariant_label: "",
    modal_wariant: {
      id: 0,
      nazwa: "",
      opis: "",
    },
    modal_wariant_okres_id: 1,
    modal_wariant_on: false,
    modal_sprzedaz_callback: (element_sprzedazy: ElementSprzedazy) => {},
    modal_wariant_callback: () => {},
  };

  koszt_last_edited_id: number = 0;

  constructor(props: Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.wniosek_id = props.wniosek_id;
    this.state.modal_dialogs = props.modal_dialogs;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState(
      { wniosek_id: props.wniosek_id, typ_id: props.typ_id },
      () => {
        cancel();
        this.loadData();
      }
    );
  }

  onElementSprzedazyDodaj = () => {
    console.log("Screen040 onElementSprzedazyDodaj");
    console.log(this.state);
    post(
      "/popyt_element_sprzedazy/insert",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
        sprzedaz: this.state.modal_sprzedaz,
      },
      (response) => {
        console.log("Screen040 onElementSprzedazyDodaj response:", response);
        this.loadDataElementySprzedazy();
      }
    );
  };

  onElementSprzedazyEdytuj = (element_sprzedazy: ElementSprzedazy) => {
    console.log("Screen040 onElementSprzedazyEdytuj state:", this.state);
    console.log(
      "Screen040 onElementSprzedazyEdytuj element_sprzedazy:",
      element_sprzedazy
    );
    post(
      "/popyt_element_sprzedazy/update",
      {
        sprzedaz: element_sprzedazy,
      },
      (response) => {
        console.log("Screen040 onElementSprzedazyEdytuj response:", response);
        this.loadDataElementySprzedazy();
      }
    );
  };

  onElementSprzedazyWariantUpdate = () => {
    console.log("Screen040 onElementSprzedazyWariantUpdate state:", this.state);
    post(
      "/popyt_element_sprzedazy/update",
      {
        sprzedaz: this.state.elementy_sprzedazy[
          this.state.elementy_sprzedazy_selected
        ],
      },
      (response) => {
        console.log(
          "Screen040 onElementSprzedazyWariantUpdate response:",
          response
        );
      }
    );
  };

  onElementSprzedazyUsun = (id: number) => {
    console.log("Screen040 onElementSprzedazyUsun id:", id);
    post(
      "/popyt_element_sprzedazy/delete",
      {
        id: id,
      },
      (response) => {
        console.log("Screen040 onElementSprzedazyUsun response", response);
        this.loadData();
      }
    );
  };

  onWariantSymulacjiDodaj = () => {
    console.log("Screen040 onWariantSymulacjiDodaj");
    console.log(this.state);
    post(
      "/popyt_warianty_symulacji/insert",
      {
        element_sprzedazy_id: this.state.elementy_sprzedazy[
          this.state.elementy_sprzedazy_selected
        ].id,
        wariant: this.state.modal_wariant,
        okres: this.state.modal_wariant_okres_id,
        odbiorcy: this.state.wariant_symulacji_grupy,
        sumy: this.state.wariant_symulacji_sumy,
      },
      (response) => {
        console.log("Screen040 onWariantSymulacjiDodaj response:", response);
        this.loadDataWariantySymulacji();
      }
    );
  };

  onWariantSymulacjiEdytuj = () => {
    console.log("Screen040 onWariantSymulacjiEdytuj state:", this.state);
    post(
      "/popyt_warianty_symulacji/update",
      {
        element_sprzedazy_id: this.state.elementy_sprzedazy[
          this.state.elementy_sprzedazy_selected
        ].id,
        wariant: this.state.modal_wariant,
        okres: this.state.modal_wariant_okres_id,
        odbiorcy: this.state.wariant_symulacji_grupy,
        sumy: this.state.wariant_symulacji_sumy,
      },
      (response) => {
        console.log("Screen040 onWariantSymulacjiEdytuj response:", response);
        this.loadDataWariantySymulacji();
      }
    );
  };

  onWariantSymulacjiUsun = (id: number) => {
    console.log("Screen040 onWariantSymulacjiUsun id:", id);
    post(
      "/popyt_warianty_symulacji/delete",
      {
        id: id,
      },
      (response) => {
        console.log("Screen040 onWariantSymulacjiUsun response", response);
        this.loadDataWariantySymulacji();
      }
    );
  };

  onPrognozuj = (event: any) => {};
  onZapisz = (event: any) => {};

  loadDataElementySprzedazy = () => {
    post(
      "/popyt_element_sprzedazy/select",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("loadDataElementySprzedazy response:", response);
        this.setState(
          {
            elementy_sprzedazy: response.data,
            elementy_sprzedazy_selected: -1,
          },
          () => console.log("loadDataElementySprzedazy state:", this.state)
        );
      }
    );
  };

  loadDataWariantySymulacji = () => {
    post(
      "/popyt_warianty_symulacji/select",
      {
        element_sprzedazy_id: this.state.elementy_sprzedazy[
          this.state.elementy_sprzedazy_selected
        ].id,
      },
      (response) => {
        console.log("loadDataWariantySymulacji response:", response);
        this.setState({ warianty_symulacji: response.data }, () => {
          console.log("loadDataWariantySymulacji state:", this.state);
        });
      }
    );
  };

  loadDataZestawienie = () => {
    post(
      "/popyt_zestawienie/select",
      {
        wniosek_id: this.state.wniosek_id,
        okres_id: this.state.okres_id,
      },
      (response) => {
        console.log("loadDataZestawienie response:", response);
        this.setState({ zestawienie: response.data }, () => {
          console.log("loadDataZestawienie state:", this.state);
        });
      }
    );
  };

  selectGrupaOdbiorcow = (okres_id: number) => {
    console.log("Screen040 selectGrupaOdbiorcow okres_id:", okres_id);
    this.setState(
      (prevState) => {
        let wybrana: WariantSymulacjiGrupy[] = [];
        prevState.wariant_symulacji_grupy.map((item, index) => {
          console.log("Screen040 selectGrupaOdbiorcow item:", item);
          if (okres_id === Number(item.okresy_dict_id)) {
            console.log("Screen040 selectGrupaOdbiorcow item pushed");
            wybrana.push(item);
          }
        });
        return {
          wariant_symulacji_grupy_wybrana: wybrana,
          modal_wariant_okres_id: okres_id,
        };
      },
      () => {
        console.log("Screen040 selectGrupaOdbiorcow state:", this.state);
      }
    );
  };

  loadDataGrupyOdbiorcow = () => {
    post(
      "/popyt_warianty_symulacji/select_odbiorcy",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
        okres_id: this.state.modal_wariant_okres_id,
        wariant_id: this.state.modal_wariant.id,
      },
      (response) => {
        console.log("Screen040 loadDataGrupyOdbiorcow response:", response);
        this.setState(
          {
            wariant_symulacji_grupy: response.data,
          },
          () => {
            console.log("Screen040 loadDataGrupyOdbiorcow state:", this.state);
            this.selectGrupaOdbiorcow(this.state.modal_wariant_okres_id);
          }
        );
      }
    );
  };

  loadDataSumy = () => {
    post(
      "/popyt_warianty_symulacji/select_sumy",
      {
        wariant_id: this.state.modal_wariant.id,
        okres_id: this.state.modal_wariant_okres_id,
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
          });
        });
        this.setState(
          {
            wariant_symulacji_sumy: sumy,
            wariant_symulacji_sumy_wybrana:
              sumy[this.state.modal_wariant_okres_id - 1],
          },
          () => {
            console.log("Screen040 loadDataSumy state:", this.state);
            this.selectGrupaOdbiorcow(this.state.modal_wariant_okres_id);
            this.modalWariantSymulacjiRecalculate(2);
          }
        );
      }
    );
  };

  loadData = () => {
    console.log("Screen040 loadData called");
    this.loadDataElementySprzedazy();
    this.loadDataZestawienie();
  };

  componentDidMount() {
    console.log("Screen040 componentDidMount");
    this.loadData();
  }

  componentWillUnmount() {
    cancel();
  }

  modalElementSprzedarzyOn = (
    label: string,
    element_sprzedazy: ElementSprzedazy,
    callback: (element_sprzedazy: ElementSprzedazy) => void
  ) => {
    let new_state = {
      modal_sprzedaz_label: label,
      modal_sprzedaz: element_sprzedazy,
      modal_sprzedaz_on: true,
      modal_sprzedaz_callback: callback,
    };
    console.log("modalElementSprzedarzyOn: ", new_state);
    this.setState(new_state);
  };

  modalElementSprzedarzyOff = () => {
    this.setState({
      modal_sprzedaz_on: false,
    });
  };

  modalElementSprzedarzy() {
    return (
      <MDBModal
        isOpen={this.state.modal_sprzedaz_on}
        toggle={this.modalElementSprzedarzyOff}
      >
        <MDBModalHeader toggle={this.modalElementSprzedarzyOff}>
          {this.state.modal_sprzedaz_label}
        </MDBModalHeader>
        <MDBModalBody>
          <MDBInput
            type="text"
            label="Nazwa:"
            value={this.state.modal_sprzedaz.nazwa}
            onChange={(event) => {
              const { value } = event.currentTarget;
              let state = this.state;
              state.modal_sprzedaz.nazwa = value;
              this.setState(state);
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Opis:"
            value={this.state.modal_sprzedaz.opis}
            onChange={(event) => {
              const { value } = event.currentTarget;
              let state = this.state;
              state.modal_sprzedaz.opis = value;
              this.setState(state);
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Jednostka miary:"
            value={this.state.modal_sprzedaz.jednostka}
            onChange={(event) => {
              const { value } = event.currentTarget;
              let state = this.state;
              state.modal_sprzedaz.jednostka = value;
              this.setState(state);
            }}
          ></MDBInput>
          {GrupyAllokacjiControl(
            this.state.modal_sprzedaz.wspolczynnik,
            "Współczynnik alokacji:",
            (event) => {
              const { value } = event.currentTarget;
              let state = this.state;
              state.modal_sprzedaz.wspolczynnik = value;
              this.setState(state);
            }
          )}

          {this.state.modal_sprzedaz.abonament ? (
            <MDBInput
              label="Uwzględnij abonament"
              type="checkbox"
              id="checkbox1"
              checked
              onChange={(event) => {
                console.log(
                  "onChange this.state.modal_sprzedaz:",
                  this.state.modal_sprzedaz
                );
                console.log(
                  this.state.modal_sprzedaz.abonament
                    ? "this.state.modal_sprzedaz.abonament true"
                    : "ups"
                );
                console.log("onChange Checkbox event:", event);
                const { value } = event.currentTarget;
                let state = this.state;
                state.modal_sprzedaz.abonament = !state.modal_sprzedaz
                  .abonament;
                this.setState(state);
              }}
            />
          ) : (
            <MDBInput
              label="Uwzględnij abonament"
              type="checkbox"
              id="checkbox1"
              onChange={(event) => {
                console.log(
                  "onChange this.state.modal_sprzedaz:",
                  this.state.modal_sprzedaz
                );
                console.log(
                  this.state.modal_sprzedaz.abonament === true
                    ? "this.state.modal_sprzedaz.abonament===true"
                    : "ups"
                );
                console.log("onChange Checkbox event:", event);
                const { value } = event.currentTarget;
                let state = this.state;
                state.modal_sprzedaz.abonament = !state.modal_sprzedaz
                  .abonament;
                this.setState(state);
              }}
            />
          )}
          <MDBContainer
            className={
              this.state.modal_sprzedaz.abonament ? "visible" : "invisible"
            }
          >
            <MDBInput
              type="text"
              label="Nazwa Abonamentu:"
              value={this.state.modal_sprzedaz.abonament_nazwa}
              onChange={(event) => {
                const { value } = event.currentTarget;
                let state = this.state;
                state.modal_sprzedaz.abonament_nazwa = value;
                this.setState(state);
              }}
            ></MDBInput>
            {GrupyAllokacjiControl(
              this.state.modal_sprzedaz.abonament_wspolczynnik,
              "Współczynnik alokacji - abonament",
              (event) => {
                const { value } = event.currentTarget;
                let state = this.state;
                state.modal_sprzedaz.abonament_wspolczynnik = value;
                this.setState(state);
              }
            )}
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.modalElementSprzedarzyOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.modalElementSprzedarzyOff();
              this.state.modal_sprzedaz_callback(this.state.modal_sprzedaz);
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  elementySprzedazy = () => {
    return (
      <>
        <MDBBtn
          size="sm"
          className="float-left"
          style={{ width: "250px" }}
          onClick={() =>
            this.modalElementSprzedarzyOn(
              "Dodaj nowy element sprzedaży",
              {
                id: 0,
                wniosek_id: 0,
                typ_id: 0,
                nazwa: "",
                opis: "",
                wspolczynnik: "",
                jednostka: "",
                abonament: false,
                abonament_nazwa: "",
                abonament_wspolczynnik: "",
                wariant_id: 0,
              },
              this.onElementSprzedazyDodaj
            )
          }
        >
          Dodaj nowy element sprzedaży
        </MDBBtn>
        <MDBTable small>
          <MDBTableBody>
            {this.state.elementy_sprzedazy.map((item, index) => (
              <tr
                color="teal lighten-1"
                key={index}
                onClick={() => {
                  console.log("elementy_sprzedazy_selected item:", item);
                  console.log("elementy_sprzedazy_selected index:", index);
                  this.setState({ elementy_sprzedazy_selected: index }, () =>
                    this.loadDataWariantySymulacji()
                  );
                }}
              >
                <td className="p-0" color="teal lighten-1">
                  <MDBBox className="left p-0 font-weight-bold">
                    {item.nazwa}
                  </MDBBox>
                  <MDBBox className="left p-0">{item.opis}</MDBBox>
                </td>
                <td className="p-0">
                  <MDBBtn
                    className="float-right p-2 m-1"
                    size="sm"
                    style={{ width: "60px" }}
                    onClick={() => this.onElementSprzedazyUsun(item.id)}
                  >
                    Usuń
                  </MDBBtn>
                  <MDBBtn
                    className="float-right p-2 m-1"
                    size="sm"
                    style={{ width: "60px" }}
                    onClick={() => {
                      this.koszt_last_edited_id = item.id;
                      this.modalElementSprzedarzyOn(
                        "Edytuj typ kosztów",
                        item,
                        this.onElementSprzedazyEdytuj
                      );
                    }}
                  >
                    Edytuj
                  </MDBBtn>
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </>
    );
  };

  modalWariantSymulacjiOn = (
    label: string,
    wariant_symulacji: WariantSymulacji,
    callback: () => void
  ) => {
    let new_state = {
      modal_wariant_label: label,
      modal_wariant: wariant_symulacji,
      modal_wariant_on: true,
      modal_wariant_okres_id: 1,
      modal_wariant_callback: callback,
    };
    console.log("modalWariantSymulacjiOn: ", new_state);
    this.setState(new_state, () => {
      this.loadDataGrupyOdbiorcow();
      this.loadDataSumy();
    });
  };

  modalWariantSymulacjiOff = () => {
    this.setState({
      modal_wariant_on: false,
    });
  };

  //0 - sprzedaz
  //1 - wspolczynnik alokacji
  //2 - suma docelowa
  modalWariantSymulacjiRecalculate = (whatChanged: number) => {
    console.log(
      "Screen060 modalWariantSymulacjiRecalculate state:",
      this.state
    );

    let getSumaSprzedaz = (state: any) => {
      let suma = 0;
      state.wariant_symulacji_grupy_wybrana.map((item: any, index: number) => {
        suma += item.sprzedaz;
      });
      return suma;
    };

    let getSumaWspolczynnik = () => {
      let suma = 0;
      this.state.wariant_symulacji_grupy_wybrana.map((item, index) => {
        suma += item.wspolczynnik_alokacji;
      });
      return suma;
    };

    switch (whatChanged) {
      case 0:
        (() => {
          this.setState((previousState: any) => {
            let suma = getSumaSprzedaz(previousState);
            let sumy = previousState.wariant_symulacji_sumy_wybrana;
            let grupy = previousState.wariant_symulacji_grupy_wybrana;
            if (suma > 0)
              previousState.wariant_symulacji_grupy_wybrana.map(
                (item: any, index: number) => {
                  grupy[index].wspolczynnik_alokacji =
                    (100 * item.sprzedaz) / suma;
                }
              );
            sumy.sprzedaz = suma;
            sumy.sprzedaz_roznica =
              suma -
              previousState.wariant_symulacji_sumy_wybrana.sprzedaz_docelowa;
            return {
              wariant_symulacji_sumy_wybrana: sumy,
              wariant_symulacji_grupy_wybrana: grupy,
            };
          });
        })();
        break;
      case 1:
        this.setState((previousState) => {
          let suma = getSumaWspolczynnik();
          let sumy = previousState.wariant_symulacji_sumy_wybrana;
          let grupy = previousState.wariant_symulacji_grupy_wybrana;
          let suma_sprzedaz = 0;
          previousState.wariant_symulacji_grupy_wybrana.map((item, index) => {
            suma_sprzedaz += grupy[index].sprzedaz =
              (item.wspolczynnik_alokacji *
                this.state.wariant_symulacji_sumy_wybrana.sprzedaz_docelowa) /
              100;
          });
          sumy.wspolczynnik_alokacji = suma;
          sumy.sprzedaz = suma_sprzedaz;
          return {
            wariant_symulacji_sumy_wybrana: sumy,
            wariant_symulacji_grupy_wybrana: grupy,
          };
        });
        break;
      case 2:
        this.setState((previousState) => {
          let grupy = previousState.wariant_symulacji_grupy_wybrana;
          let suma = 0;
          previousState.wariant_symulacji_grupy_wybrana.map((item, index) => {
            grupy[index].sprzedaz =
              (item.wspolczynnik_alokacji *
                previousState.wariant_symulacji_sumy_wybrana
                  .sprzedaz_docelowa) /
              100;
            suma += grupy[index].sprzedaz;
          });
          let sumy = previousState.wariant_symulacji_sumy_wybrana;
          sumy.sprzedaz = suma;
          sumy.sprzedaz_roznica =
            suma -
            previousState.wariant_symulacji_sumy_wybrana.sprzedaz_docelowa;
          return {
            wariant_symulacji_sumy_wybrana: sumy,
            wariant_symulacji_grupy_wybrana: grupy,
          };
        });
        break;
      default:
        console.log(
          "Błąd użycia Screen060 modalWariantSymulacjiRecalculate, niepoprawna wartość parametru whatChanged:",
          whatChanged
        );
    }
  };

  modalWariantSymulacji() {
    return (
      <MDBModal
        isOpen={this.state.modal_wariant_on}
        toggle={this.modalWariantSymulacjiOff}
        className="modal-fluid"
      >
        <MDBModalHeader toggle={this.modalWariantSymulacjiOff}>
          {this.state.modal_wariant_label}
        </MDBModalHeader>
        <MDBModalBody>
          <MDBTable borderless>
            <MDBTableBody>
              <tr>
                <td>
                  <MDBInput
                    type="text"
                    label="Nazwa:"
                    value={this.state.modal_wariant.nazwa}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      let state = this.state;
                      state.modal_wariant.nazwa = value;
                      this.setState(state);
                    }}
                  ></MDBInput>
                  <MDBInput
                    type="text"
                    label="Opis:"
                    value={this.state.modal_wariant.opis}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      let state = this.state;
                      state.modal_wariant.opis = value;
                      this.setState(state);
                    }}
                  ></MDBInput>
                </td>
              </tr>
              <tr>
                <td>
                  {OkresyControl((index, value) => {
                    console.log("OkresyControl value:", value);
                    this.selectGrupaOdbiorcow(index + 1);
                  }, this.state.modal_wariant_okres_id)}
                </td>
              </tr>
              <tr>
                <td>
                  <MDBTable bordered>
                    <MDBTableBody>
                      <tr>
                        <td></td>
                        <td>
                          sprzedaż, m<sup>3</sup>
                        </td>
                        <td>A, %</td>
                        <td>opłaty ab., zł</td>
                        <td>B, %</td>
                        <td>suma, zł</td>
                        <td>wg wskaźnika</td>
                        <td>jako dopełnienie</td>
                        <td>jako % z całości</td>
                        <td>liczba odbiorców</td>
                      </tr>
                      {this.state.wariant_symulacji_grupy_wybrana.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{item.nazwa}</td>
                            <td>
                              <MDBInput
                                noTag
                                className="text-right"
                                style={{ width: "100px" }}
                                type="text"
                                value={
                                  this.state.wariant_symulacji_grupy_wybrana[
                                    index
                                  ].sprzedaz
                                }
                                onChange={(event) => {
                                  const { value } = event.currentTarget;
                                  let data = this.state
                                    .wariant_symulacji_grupy_wybrana;
                                  data[index].sprzedaz = Number(value);
                                  this.setState(
                                    {
                                      wariant_symulacji_grupy_wybrana: data,
                                    },
                                    () =>
                                      this.modalWariantSymulacjiRecalculate(0)
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
                                  this.state.wariant_symulacji_grupy_wybrana[
                                    index
                                  ].wspolczynnik_alokacji
                                }
                                onChange={(event) => {
                                  const { value } = event.currentTarget;
                                  let data = this.state
                                    .wariant_symulacji_grupy_wybrana;
                                  data[index].wspolczynnik_alokacji = Number(
                                    value
                                  );
                                  this.setState(
                                    {
                                      wariant_symulacji_grupy_wybrana: data,
                                    },
                                    () =>
                                      this.modalWariantSymulacjiRecalculate(1)
                                  );
                                }}
                              />
                            </td>
                            {this.state.elementy_sprzedazy[
                              this.state.elementy_sprzedazy_selected
                            ].abonament ? (
                              <>
                                <td>
                                  <MDBInput
                                    noTag
                                    className="text-right"
                                    style={{ width: "100px" }}
                                    type="text"
                                    value={
                                      this.state
                                        .wariant_symulacji_grupy_wybrana[index]
                                        .oplaty_abonament
                                    }
                                    onChange={(event) => {
                                      const { value } = event.currentTarget;
                                      let data = this.state
                                        .wariant_symulacji_grupy_wybrana;
                                      data[index].oplaty_abonament = Number(
                                        value
                                      );
                                      this.setState({
                                        wariant_symulacji_grupy_wybrana: data,
                                      });
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
                                      this.state
                                        .wariant_symulacji_grupy_wybrana[index]
                                        .wspolczynnik_alokacji_abonament
                                    }
                                    onChange={(event) => {
                                      const { value } = event.currentTarget;
                                      let data = this.state
                                        .wariant_symulacji_grupy_wybrana;
                                      data[
                                        index
                                      ].wspolczynnik_alokacji_abonament = Number(
                                        value
                                      );
                                      this.setState({
                                        wariant_symulacji_grupy_wybrana: data,
                                      });
                                    }}
                                  />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
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
                                value={
                                  this.state.wariant_symulacji_grupy_wybrana[
                                    index
                                  ].liczba_odbiorcow
                                }
                                onChange={(event) => {
                                  const { value } = event.currentTarget;
                                  let data = this.state
                                    .wariant_symulacji_grupy_wybrana;
                                  data[index].liczba_odbiorcow = Number(value);
                                  this.setState({
                                    wariant_symulacji_grupy_wybrana: data,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}
                      <tr>
                        <td>Suma</td>
                        <td>
                          {this.state.wariant_symulacji_sumy_wybrana.sprzedaz}
                        </td>
                        <td>
                          {
                            this.state.wariant_symulacji_sumy_wybrana
                              .wspolczynnik_alokacji
                          }
                        </td>
                        <td>
                          {
                            this.state.wariant_symulacji_sumy_wybrana
                              .oplaty_abonament
                          }
                        </td>
                        <td>
                          {
                            this.state.wariant_symulacji_sumy_wybrana
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
                        <td>Suma docelowa</td>
                        <td>
                          <MDBInput
                            noTag
                            className="text-right"
                            style={{ width: "100px" }}
                            type="text"
                            value={
                              this.state.wariant_symulacji_sumy_wybrana
                                .sprzedaz_docelowa
                            }
                            onChange={(event) => {
                              const { value } = event.currentTarget;
                              let data = this.state
                                .wariant_symulacji_sumy_wybrana;
                              data.sprzedaz_docelowa = Number(value);
                              this.setState(
                                {
                                  wariant_symulacji_sumy_wybrana: data,
                                },
                                () => this.modalWariantSymulacjiRecalculate(2)
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
                              this.state.wariant_symulacji_sumy_wybrana
                                .oplaty_abonament_docelowa
                            }
                            onChange={(event) => {
                              const { value } = event.currentTarget;
                              let data = this.state
                                .wariant_symulacji_sumy_wybrana;
                              data.oplaty_abonament_docelowa = Number(value);
                              this.setState({
                                wariant_symulacji_sumy_wybrana: data,
                              });
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
                        <td>Różnica</td>
                        <td>
                          {
                            this.state.wariant_symulacji_sumy_wybrana
                              .sprzedaz_roznica
                          }
                        </td>
                        <td></td>
                        <td>
                          {
                            this.state.wariant_symulacji_sumy_wybrana
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
          <MDBBtn color="secondary" onClick={this.modalWariantSymulacjiOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="primary"
            onClick={() => {
              this.modalWariantSymulacjiOff();
              this.state.modal_wariant_callback();
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  onWariantSelect = (item: any, index: number) => {
    console.log("onWariantSelect item:", item);
    console.log("onWariantSelect index:", index);

    this.setState(
      (previousState) => {
        let newState = previousState;
        let elementy_sprzedazy = [...previousState.elementy_sprzedazy];
        let element = {
          ...elementy_sprzedazy[previousState.elementy_sprzedazy_selected],
        };
        element.wariant_id = item.id;
        elementy_sprzedazy[previousState.elementy_sprzedazy_selected] = element;

        return {
          modal_wariant: item,
          elementy_sprzedazy,
        };
      },
      () => {
        this.loadDataGrupyOdbiorcow();
        this.onElementSprzedazyWariantUpdate();
        this.loadDataZestawienie();
      }
    );
  };

  wariantySymulacji = () => {
    if (
      this.state.elementy_sprzedazy_selected >= 0 &&
      this.state.elementy_sprzedazy[this.state.elementy_sprzedazy_selected].id >
        0
    )
      return (
        <>
          <MDBBtn
            size="sm"
            className="float-left"
            style={{ width: "250px" }}
            onClick={() =>
              this.modalWariantSymulacjiOn(
                "Dodaj nowy wariant symulacji",
                {
                  id: 0,
                  nazwa: "",
                  opis: "",
                },
                this.onWariantSymulacjiDodaj
              )
            }
          >
            Dodaj nowy wariant symulacji
          </MDBBtn>
          {this.state.warianty_symulacji.length > 0 ? (
            <MDBTable small>
              <MDBTableBody>
                {this.state.warianty_symulacji.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => this.onWariantSelect(item, index)}
                  >
                    <td>
                      <MDBInput
                        // onClick={this.onWariantSelect(item, index)}
                        checked={
                          this.state.elementy_sprzedazy[
                            this.state.elementy_sprzedazy_selected
                          ].wariant_id === item.id
                            ? true
                            : false
                        }
                        type="radio"
                        id="radioWarianty"
                      />
                    </td>
                    <td className="p-0">
                      <MDBBox className="left p-0 font-weight-bold">
                        {item.nazwa}
                      </MDBBox>
                      <MDBBox className="left p-0">{item.opis}</MDBBox>
                    </td>
                    <td className="p-0">
                      <MDBBtn
                        className="float-right p-2 m-1"
                        size="sm"
                        style={{ width: "60px" }}
                        onClick={() => this.onWariantSymulacjiUsun(item.id)}
                      >
                        Usuń
                      </MDBBtn>
                      <MDBBtn
                        className="float-right p-2 m-1"
                        size="sm"
                        style={{ width: "60px" }}
                        onClick={() => {
                          this.koszt_last_edited_id = item.id;
                          this.modalWariantSymulacjiOn(
                            "Edytuj typ kosztów",
                            item,
                            this.onWariantSymulacjiEdytuj
                          );
                        }}
                      >
                        Edytuj
                      </MDBBtn>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          ) : (
            <></>
          )}
        </>
      );
  };

  wynikiSymulacji = () => {
    let table: string[][] = [];
    let last_id = -1;
    let first_row: string[] = [];
    let first_row_state = 0; //0 - not started, 1 - under construction, 2 - finished
    let row1: string[] = [];
    let row2: string[] = [];
    let row3: string[] = [];
    let row4: string[] = [];
    let row: string[][] = [row1, row2, row3, row4];
    let row_counter = 0;
    this.state.zestawienie.map((item: any, index: number) => {
      if (item.element_sprzedazy_id === last_id) {
        //next elements in list for one element_sprzedazy
        if (first_row_state === 1) {
          first_row.push(item.grupy_odbiorcow_nazwa);
        }
        row[0].push(item.sprzedaz);
        row[1].push(item.wspolczynnik_alokacji);
        row[2].push(item.oplaty_abonament);
        row[3].push(item.wspolczynnik_alokacji_abonament);
      } else {
        //first element in list for one element_sprzedazy
        last_id = item.element_sprzedazy_id;
        if (first_row_state === 0) {
          first_row.push(item.grupy_odbiorcow_nazwa);
          first_row_state = 1;
        } else {
          if (first_row_state === 1) {
            first_row_state = 2;
          }
          row.map((item2: string[], index: number) => {
            table.push(item2);
            row[index] = [];
          });
        }
        row.map((item2: string[], index: number) => {
          item2.push(String(++row_counter));
        });
        row[0].push(
          "<rowSpan>" +
            item.element_sprzedazy_wspolczynnik +
            " " +
            item.wariant_nazwa
        );
        row[0].push("<rowSpan>" + item.element_sprzedazy_nazwa);
        row[0].push(item.element_sprzedazy_jednostka);
        row[1].push("%");
        if (item.element_sprzedazy_abonament)
          row[2].push(
            "<rowSpan>" +
              item.element_sprzedazy_wspolczynnik +
              " " +
              item.wariant_nazwa
          );
        row[2].push("<rowSpan>" + item.element_sprzedazy_abonament_nazwa);
        row[2].push("zł");
        row[3].push("%");
      }
    });
    row.map((item: string[], index: number) => {
      if (item !== []) table.push(item);
      row[index] = [];
    });

    return (
      <MDBTable bordered className="p-0">
        <MDBTableHead>
          <tr>
            <td>Lp.</td>
            <td>Współczynnik alokacji</td>
            <td>
              Wyszczególnienie w okresie od 25 do 36 miesiąca obowiązywania
              nowej taryfy
            </td>
            <td>Jedn. Miary</td>
            <td colSpan={first_row.length}>Taryfowa grupa odbiorców usług</td>
          </tr>
        </MDBTableHead>
        <MDBTableBody style={{ width: "100%" }}>
          <tr>
            <td colSpan={4}></td>
            {first_row.map((item: string, index: number) => (
              <td>{item}</td>
            ))}
          </tr>
          {table.map((item, index) => (
            <tr>
              {item.map((item2: string, index2) =>
                typeof item2 === "string" && item2.includes("<rowSpan>") ? (
                  <td rowSpan={2}>{item2.substr(9)}</td>
                ) : (
                  <td>{item2}</td>
                )
              )}
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    );
  };

  render() {
    return (
      <>
        {this.modalElementSprzedarzy()}
        {this.modalWariantSymulacji()}
        <MDBTable borderless className="p-0">
          <MDBTableBody style={{}}>
            <tr>
              <td style={{ width: "100%", padding: 2 }}>
                <MDBTable borderless className="p-0">
                  <MDBTableBody style={{}}>
                    <tr>
                      <td
                        style={{
                          width: "50%",
                          padding: 2,
                          paddingRight: 10,
                          borderRight: 1,
                        }}
                      >
                        <MDBBox tag="h5">Elementy sprzedaży</MDBBox>
                      </td>
                      <td style={{ width: "50%", padding: 2, paddingLeft: 10 }}>
                        <MDBBox tag="h5">Warianty symulacji</MDBBox>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          width: "50%",
                          padding: 2,
                          paddingRight: 10,
                          borderRight: 1,
                        }}
                      >
                        {this.elementySprzedazy()}
                      </td>
                      <td style={{ width: "50%", padding: 2, paddingLeft: 10 }}>
                        {this.wariantySymulacji()}
                      </td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </td>
            </tr>
            <tr>
              <td style={{ width: "100%", padding: 2 }}>
                <MDBTable borderless className="p-2">
                  <MDBTableBody style={{}}>
                    <tr>
                      <td style={{ width: "61%", padding: 2 }}></td>
                      <td
                        style={{ width: "13%", padding: 2 }}
                        className="text-center"
                      >
                        Wskaźnik rok 1
                      </td>
                      <td
                        style={{ width: "13%", padding: 2 }}
                        className="text-center"
                      >
                        Wskaźnik rok 2
                      </td>
                      <td
                        style={{ width: "13%", padding: 2 }}
                        className="text-center"
                      >
                        Wskaźnik rok 3
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: 2 }}>
                        {OkresyControl((index, value) => {},
                        this.state.okres_id)}
                      </td>
                      <td style={{ padding: 2 }}>
                        <MDBBox>
                          <MDBInput
                            noTag
                            className="text-right"
                            type="text"
                            value={this.state.wskaznik_1}
                            onChange={(event) => {
                              const { value } = event.currentTarget;
                              //todo: validate value
                              this.setState({ wskaznik_1: value });
                            }}
                          />
                        </MDBBox>
                      </td>
                      <td style={{ padding: 2 }}>
                        <MDBBox>
                          <MDBInput
                            noTag
                            className="text-right"
                            type="text"
                            value={this.state.wskaznik_2}
                            onChange={(event) => {
                              const { value } = event.currentTarget;
                              //todo: validate value
                              this.setState({ wskaznik_2: value });
                            }}
                          />
                        </MDBBox>
                      </td>
                      <td style={{ padding: 2 }}>
                        <MDBBox>
                          <MDBInput
                            noTag
                            className="text-right"
                            type="text"
                            value={this.state.wskaznik_3}
                            onChange={(event) => {
                              const { value } = event.currentTarget;
                              //todo: validate value
                              this.setState({ wskaznik_3: value });
                            }}
                          />
                        </MDBBox>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: 2 }}>
                        <MDBBox tag="h5">
                          Wyniki symulacji - dla wariantów domyślnych
                        </MDBBox>
                      </td>
                      <td style={{ padding: 2 }}></td>
                      <td style={{ padding: 2 }} colSpan={2}>
                        <MDBBtn
                          size="sm"
                          style={{ width: "250px" }}
                          className="float-right"
                          onClick={this.onPrognozuj}
                        >
                          Prognozuj
                        </MDBBtn>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: 2 }} colSpan={4}>
                        {this.wynikiSymulacji()}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: 2 }}></td>
                      <td style={{ padding: 2 }}></td>
                      <td style={{ padding: 2 }} colSpan={2}>
                        <MDBBtn
                          size="sm"
                          style={{ width: "250px" }}
                          className="float-right"
                          onClick={this.onZapisz}
                        >
                          Zapisz
                        </MDBBtn>
                      </td>
                    </tr>
                  </MDBTableBody>
                </MDBTable>
              </td>
            </tr>
          </MDBTableBody>
        </MDBTable>
      </>
    );
  }
}
export { Screen as Screen040_popyt };
