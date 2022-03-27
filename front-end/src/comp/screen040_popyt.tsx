import React, { Component } from "react";
import update from "immutability-helper";
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
  MDBIcon,
} from "mdbreact";
import { post, cancel } from "./post";
import ModalWariantSymulacji from "./screen040_popyt_wariant";
import { ElementSprzedazy, WariantSymulacji } from "../../../common/model";

import {
  ModalDialogs,
  ModalDialogsGetFake,
  GrupyAllokacjiControl,
  OkresyControl,
} from "./modal_dialogs";
import { REPLServer } from "repl";

type Props = {
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type State = {
  wniosek_id: number;
  typ_id: number;
  elementy_sprzedazy: ElementSprzedazy[];
  elementy_sprzedazy_selected: number;
  warianty_symulacji: WariantSymulacji[];
  warianty_symulacji_selected: number; //index in table, not an id
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
  modal_wariant_id: number;
  modal_wariant_on: boolean;
  //modal_wariant_add_new: boolean;
  modal_sprzedaz_callback: (element_sprzedazy: ElementSprzedazy) => void;
  modal_wariant_callback: () => void;
};

export default class Screen extends Component<Props, State> {
  state: State = {
    wniosek_id: 0,
    typ_id: 1,
    modal_dialogs: ModalDialogsGetFake(),
    elementy_sprzedazy: [],
    elementy_sprzedazy_selected: -1,
    warianty_symulacji: [],
    warianty_symulacji_selected: -1,
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
      nazwa_invalid: false,
      opis: "",
      kod_wspolczynnika: "",
      jednostka: "",
      abonament: false,
      abonament_nazwa: "",
      abonament_kod_wspolczynnika: "",
      wariant_id: 0,
    },
    modal_sprzedaz_on: false,
    modal_wariant_label: "",
    modal_wariant_id: -1,
    modal_wariant_on: false,
    //modal_wariant_add_new: false,
    modal_sprzedaz_callback: (element_sprzedazy: ElementSprzedazy) => {},
    modal_wariant_callback: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state.wniosek_id = props.wniosek_id;
    this.state.modal_dialogs = props.modal_dialogs;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState(
      { wniosek_id: props.wniosek_id, typ_id: props.typ_id },
      () => {
        console.log("UNSAFE_componentWillReceiveProps state:", this.state);
        cancel();
        this.setState(
          (prevState) => {
            return update(prevState, {
              warianty_symulacji: { $set: []},
              warianty_symulacji_selected: { $set: -1},
              elementy_sprzedazy: { $set: []},
              elementy_sprzedazy_selected: { $set: -1},
            });
          },
          () =>
          {
            console.log("UNSAFE_componentWillReceiveProps update state:", this.state)
            this.loadData();
          }
        );
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
        this.loadData();
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
        this.loadDataElementySprzedazy();
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

  onWariantSymulacjiUsun = (id: number) => {
    console.log("Screen040 onWariantSymulacjiUsun id:", id);
    let element_sprzedazy_index: number | null = null;
    if (
      this.state.elementy_sprzedazy[this.state.elementy_sprzedazy_selected]
        .wariant_id === id
    ) {
      element_sprzedazy_index = this.state.elementy_sprzedazy_selected;
    }
    post(
      "/popyt_warianty_symulacji/delete",
      {
        id: id,
        element_sprzedazy_id: element_sprzedazy_index,
      },
      (response) => {
        console.log("Screen040 onWariantSymulacjiUsun response", response);
        if (element_sprzedazy_index) {
          let element_index = Number(element_sprzedazy_index);
          this.setState(
            (prevState) => {
              return update(prevState, {
                elementy_sprzedazy: {
                  [element_index]: { wariant_id: { $set: 0 } },
                },
              });
            },
            () =>
              console.log("Screen040 onWariantSymulacjiUsun state:", this.state)
          );
        }
        this.onElementSprzedazyWariantUpdate();
        this.loadDataWariantySymulacji();
        this.loadDataZestawienie();
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
        let selected: boolean =
          response.data.length > this.state.elementy_sprzedazy_selected;
        this.setState(
          () => {
            return {
              elementy_sprzedazy: response.data,
              elementy_sprzedazy_selected: selected
                ? this.state.elementy_sprzedazy_selected
                : -1,
              warianty_symulacji: selected ? this.state.warianty_symulacji : [],
              warianty_symulacji_selected: selected
                ? this.state.warianty_symulacji_selected
                : -1,
            };
          },
          () => {
            console.log("loadDataElementySprzedazy state:", this.state);
            
            this.loadDataZestawienie();
          }
        );
      }
    );
  };

  getIndedxOfWariantSymulacji = (id: number): number => {
    let index = -1;
    this.state.warianty_symulacji.map((item, item_index) => {
      if (item.id === id) index = item_index;
    });
    return index;
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
        this.setState(
          {
            warianty_symulacji: response.data,
          },
          () => {
            this.setState(
              {
                warianty_symulacji_selected: this.getIndedxOfWariantSymulacji(
                  this.state.elementy_sprzedazy[
                    this.state.elementy_sprzedazy_selected
                  ].wariant_id
                ),
              },
              () => console.log("loadDataWariantySymulacji state:", this.state)
            );
          }
        );
      }
    );
  };

  loadDataZestawienie = () => {
    post(
      "/popyt_zestawienie/select",
      {
        wniosek_id: this.state.wniosek_id,
        okres_id: this.state.okres_id,
        typ_id: this.state.typ_id,
        add_wariant: true,
      },
      (response) => {
        console.log("loadDataZestawienie response:", response);
        this.setState({ zestawienie: response.data }, () => {
          console.log("loadDataZestawienie state:", this.state);
        });
      }
    );
  };

  loadData = () => {
    console.log("Screen040 loadData called");
    this.loadDataElementySprzedazy();
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
    this.setState(new_state, () =>
      console.log("Screen040 modalElementSprzedarzyOn state:", this.state)
    );
  };

  modalElementSprzedarzyOff = () => {
    this.setState(
      {
        modal_sprzedaz_on: false,
      },
      () => console.log("Screen040 modalElementSprzedarzyOn state:", this.state)
    );
  };

  modalElementSprzedarzy() {
    return (
      <MDBModal
        isOpen={this.state.modal_sprzedaz_on}
        toggle={this.modalElementSprzedarzyOff}
        overflowScroll={false} inline={false} noClickableBodyWithoutBackdrop={false}
      >
        <MDBModalHeader toggle={this.modalElementSprzedarzyOff}>
          {this.state.modal_sprzedaz_label}
        </MDBModalHeader>
        <MDBModalBody>
          {this.state.modal_sprzedaz.nazwa_invalid ? (
            <MDBBox className="_invalid">Niepoprawna wartość pola:</MDBBox>
          ) : (
            <></>
          )}
          <MDBInput
            type="text"
            label="Nazwa:"
            value={this.state.modal_sprzedaz.nazwa}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState(
                (prevState) => {
                  return update(prevState, {
                    modal_sprzedaz: { nazwa: { $set: value } },
                  });
                },
                () =>
                  console.log(
                    "Screen040 modalElementSprzedarzyOn nazwa state:",
                    this.state
                  )
              );
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Opis:"
            value={this.state.modal_sprzedaz.opis}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState(
                (prevState) => {
                  return update(prevState, {
                    modal_sprzedaz: { opis: { $set: value } },
                  });
                },
                () =>
                  console.log(
                    "Screen040 modalElementSprzedarzyOn opis state:",
                    this.state
                  )
              );
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Jednostka miary:"
            value={this.state.modal_sprzedaz.jednostka}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState(
                (prevState) => {
                  return update(prevState, {
                    modal_sprzedaz: { jednostka: { $set: value } },
                  });
                },
                () =>
                  console.log(
                    "Screen040 modalElementSprzedarzyOn jednostka state:",
                    this.state
                  )
              );
            }}
          ></MDBInput>
          <MDBInput
            type="text"
            label="Kod współczynnika:"
            value={this.state.modal_sprzedaz.kod_wspolczynnika}
            onChange={(event) => {
              const { value } = event.currentTarget;
              this.setState(
                (prevState) => {
                  return update(prevState, {
                    modal_sprzedaz: { kod_wspolczynnika: { $set: value } },
                  });
                },
                () =>
                  console.log(
                    "Screen040 modalElementSprzedarzyOn kod_wspolczynnika state:",
                    this.state
                  )
              );
            }}
          ></MDBInput>
          {/* {GrupyAllokacjiControl(
            this.state.modal_sprzedaz.kod_wspolczynnika,
            "Kod współczynnika:",
            (event) => {
              const { value } = event.currentTarget;
              let state = this.state;
              state.modal_sprzedaz.kod_wspolczynnika = value;
              this.setState(state);
            }
          )} */}

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
            
            <MDBInput
              type="text"
              label="Abonament - kod współczynnika alokacji:"
              value={this.state.modal_sprzedaz.abonament_kod_wspolczynnika}
              onChange={(event) => {
                const { value } = event.currentTarget;
                let state = this.state;
                state.modal_sprzedaz.abonament_kod_wspolczynnika = value;
                this.setState(state);
              }}
            ></MDBInput>
            {/* {GrupyAllokacjiControl(
              this.state.modal_sprzedaz.abonament_kod_wspolczynnika,
              "Abonament - kod współczynnika alokacji",
              (event) => {
                const { value } = event.currentTarget;
                let state = this.state;
                state.modal_sprzedaz.abonament_kod_wspolczynnika = value;
                this.setState(state);
              }
            )} */}
          </MDBContainer>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="mdb-color" onClick={this.modalElementSprzedarzyOff}>
            Anuluj
          </MDBBtn>
          <MDBBtn
            color="mdb-color"
            onClick={() => {
              if (this.state.modal_sprzedaz.nazwa === "") {
                this.setState((prevState) => {
                  return update(prevState, {
                    modal_sprzedaz: { nazwa_invalid: { $set: true } },
                  });
                });
              } else {
                this.setState((prevState) => {
                  return update(prevState, {
                    modal_sprzedaz: { nazwa_invalid: { $set: false } },
                  });
                });
                this.modalElementSprzedarzyOff();
                this.state.modal_sprzedaz_callback(this.state.modal_sprzedaz);
              }
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
        <MDBTable className="_row m-0 bs-3">
          <MDBTableBody>
            <tr>
              <td colSpan={3}>
                <div className="d-flex justify-content-between">
                  <MDBBox tag="h5">Współczynniki  alokacji</MDBBox>
                  <MDBBtn
                    size="sm"
                    style={{ width: "250px" }}
                    color="mdb-color"
                    outline
                    className="float-right"
                    onClick={() =>
                      this.modalElementSprzedarzyOn(
                        "Dodaj nowy współczynnik alokacji",
                        {
                          id: 0,
                          wniosek_id: 0,
                          typ_id: 0,
                          nazwa: "",
                          nazwa_invalid: false,
                          opis: "",
                          kod_wspolczynnika: "",
                          jednostka: "",
                          abonament: false,
                          abonament_nazwa: "",
                          abonament_kod_wspolczynnika: "",
                          wariant_id: 0,
                        },
                        this.onElementSprzedazyDodaj
                      )
                    }
                  >
                    Dodaj nowy współczynniki alokacji
                  </MDBBtn>
                </div>
              </td>
            </tr>
            {this.state.elementy_sprzedazy.map((item, index) => (
              <tr
                color="teal lighten-1"
                key={index}
                onClick={
                  this.state.elementy_sprzedazy_selected !== index
                    ? () => {
                        console.log("elementy_sprzedazy_selected item:", item);
                        console.log(
                          "elementy_sprzedazy_selected index:",
                          index
                        );
                        this.setState(
                          { elementy_sprzedazy_selected: index },
                          () => this.loadDataWariantySymulacji()
                        );
                      }
                    : () => {}
                }
              >
                <td
                  className="w-100"
                  // className={
                  //   this.state.elementy_sprzedazy_selected === index
                  //     ? "p-0 selected"
                  //     : "p-0"
                  // }
                  // color="teal lighten-1"
                >
                  <div
                    //className="border rounded mb-0 pl-1"
                    className={
                      this.state.elementy_sprzedazy_selected === index
                        ? "rounded pl-1 table_row_selected"
                        : "p-0 pointer"
                    }
                  >
                    <MDBBox className="left p-0 pl-1 font-weight-bold">
                      {item.nazwa}
                    </MDBBox>
                    <MDBBox className="left p-0 pl-1">{item.opis}</MDBBox>
                  </div>
                </td>
                <td className="align-middle">
                  <div
                    onClick={() => this.onElementSprzedazyUsun(item.id)}
                    //className="border rounded mb-0 pl-1"
                    className="rounded flat_button pointer"
                  >
                    <MDBIcon far icon="trash-alt p-1" />
                  </div>
                  {/* <MDBBtn
                    flat
                    className="float-right p-2 m-1"
                    size="sm"
                    style={{ width: "60px" }}
                    onClick={() => this.onElementSprzedazyUsun(item.id)}
                  >
                    <MDBIcon far icon="trash-alt" />
                    Usuń
                  </MDBBtn> */}
                </td>
                <td className="align-middle">
                  <div
                    //className="border rounded mb-0 pl-1"
                    className="rounded flat_button pointer"
                    onClick={() => {
                      this.modalElementSprzedarzyOn(
                        "Edytuj wpółczynnik alokacji",
                        item,
                        this.onElementSprzedazyEdytuj
                      );
                    }}
                  >
                    <MDBIcon icon="pen p-1" />
                  </div>

                  {/* <MDBIcon icon="pen" /> */}
                  {/* <MDBBtn
                    className="float-right p-2 m-1"
                    size="sm"
                    style={{ width: "60px" }}
                    onClick={() => {
                      this.modalElementSprzedarzyOn(
                        "Edytuj typ kosztów",
                        item,
                        this.onElementSprzedazyEdytuj
                      );
                    }}
                  >
                    <MDBIcon icon="pen" />
                    Edytuj
                  </MDBBtn> */}
                </td>
              </tr>
            ))}
          </MDBTableBody>
        </MDBTable>
      </>
    );
  };

  modalWariantSymulacjiOn = (add_new: boolean, callback: any, id: number) => {
    console.log("modalWariantSymulacjiOn");
    this.setState(
      {
        modal_wariant_callback: callback,
        modal_wariant_id: id,
        modal_wariant_on: true,
        //modal_wariant_add_new: add_new,
      },
      () =>
        console.log("Screen040 modalWariantSymulacjiOn opis state:", this.state)
    );
  };

  modalWariantSymulacjiOff = (update: boolean) => {
    this.setState(
      {
        modal_wariant_id: -1,
        modal_wariant_on: false,
      },
      () =>
        console.log(
          "Screen040 modalWariantSymulacjiOff opis state:",
          this.state
        )
    );
    update && this.loadDataWariantySymulacji();
    update && this.loadDataZestawienie();
  };

  onWariantSelect = (item: any, index: number, event: any) => {
    console.log("onWariantSelect event:", event);
    console.log("onWariantSelect item:", item);
    console.log("onWariantSelect index:", index);
    if (this.state.warianty_symulacji_selected !== index)
      this.setState(
        (prevState) => {
          console.log("onWariantSelect prevState: ", prevState);
          return update(prevState, {
            elementy_sprzedazy: {
              [prevState.elementy_sprzedazy_selected]: {
                wariant_id: { $set: item.id },
              },
            },
            warianty_symulacji_selected: { $set: index },
          });
        },
        () => {
          console.log("onWariantSelect state: ", this.state);
          this.onElementSprzedazyWariantUpdate();
        }
      );
  };

  getWariantSymulacjiById = (id: number) => {
    let ret = null;
    this.state.warianty_symulacji.map((item, index) => {
      if (item.id === id) ret = item;
    });
    return ret;
  };

  wariantySymulacji = () => {
    console.log("wariantySymulacji state:", this.state);
    if (
      this.state.elementy_sprzedazy_selected >= 0 &&
      this.state.elementy_sprzedazy[this.state.elementy_sprzedazy_selected]
        .wariant_id > -1
    )
      return (
        <>
          {this.state.modal_wariant_on ? (
            <ModalWariantSymulacji
              callback={this.modalWariantSymulacjiOff}
              wniosek_id={this.state.wniosek_id}
              element_sprzedazy={
                this.state.elementy_sprzedazy[
                  this.state.elementy_sprzedazy_selected
                ]
              }
              wariant_symulacji_id={this.state.modal_wariant_id}
            ></ModalWariantSymulacji>
          ) : (
            <> </>
          )}
          <MDBTable className="_row bs-3">
            <MDBTableBody>
              <tr>
                <td colSpan={3}>
                  <div className="d-flex justify-content-between">
                    <MDBBox tag="h5">Warianty symulacji</MDBBox>
                    <MDBBtn
                      size="sm"
                      style={{ width: "250px" }}
                      color="mdb-color"
                      outline
                      className="float-right"
                      onClick={() =>
                        this.modalWariantSymulacjiOn(
                          true,
                          this.modalWariantSymulacjiOff,
                          -1
                        )
                      }
                    >
                      {/* <MDBBox className="left p-1 align-middle"> */}
                      Dodaj nowy wariant symulacji
                      {/* </MDBBox> */}
                    </MDBBtn>

                    {/* <div
                      //className="border rounded mb-0 pl-1"
                      className="rounded pl-0 flat_button pointer"
                      onClick={() =>
                        this.modalWariantSymulacjiOn(
                          true,
                          this.modalWariantSymulacjiOff,
                          -1
                        )
                      }
                    >
                      <MDBBox className="left p-1 align-middle">
                        Dodaj nowy wariant symulacji
                      </MDBBox>
                    </div> */}
                  </div>
                </td>
              </tr>
              {this.state.warianty_symulacji.length > 0 ? (
                this.state.warianty_symulacji.map((item, index) => (
                  <tr key={index}>
                    {/* <td
                      onClick={(event) =>
                        this.onWariantSelect(item, index, event)
                      }
                    >
                      <MDBInput
                        //onClick={this.onWariantSelect(item, index)}
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
                    </td> */}

                    <td
                      className="w-100"
                      onClick={(event) =>
                        this.state.elementy_sprzedazy[
                          this.state.elementy_sprzedazy_selected
                        ].wariant_id !== item.id &&
                        this.onWariantSelect(item, index, event)
                      }
                    >
                      <div
                        //className="border rounded mb-0 pl-1"
                        className={
                          this.state.elementy_sprzedazy[
                            this.state.elementy_sprzedazy_selected
                          ].wariant_id === item.id
                            ? "rounded pl-1 table_row_selected"
                            : "p-0 pointer"
                        }
                      >
                        <MDBBox className="left p-0 font-weight-bold pl-1">
                          {item.nazwa}
                        </MDBBox>
                        <MDBBox className="left p-0 pl-1">{item.opis}</MDBBox>
                      </div>
                    </td>
                    <td className="align-middle">
                      <div
                        onClick={() => this.onWariantSymulacjiUsun(item.id)}
                        //className="border rounded mb-0 pl-1"
                        className="rounded flat_button pointer"
                      >
                        <MDBIcon far icon="trash-alt p-1" />
                      </div>
                    </td>
                    <td className="align-middle">
                      {/* <MDBBtn
                        className="float-right p-2 m-1"
                        size="sm"
                        style={{ width: "60px" }}
                        onClick={() => {
                          this.modalWariantSymulacjiOn(
                            false,
                            this.modalWariantSymulacjiOff,
                            item.id
                          );
                        }}
                      >
                        Edytuj
                      </MDBBtn> */}
                      <div
                        //className="border rounded mb-0 pl-1"
                        className="rounded flat_button pointer"
                        onClick={() => {
                          this.modalWariantSymulacjiOn(
                            false,
                            this.modalWariantSymulacjiOff,
                            item.id
                          );
                        }}
                      >
                        <MDBIcon icon="pen p-1" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </MDBTableBody>
          </MDBTable>
        </>
      );
  };

  wynikiSymulacji = () => {
    let row_counter = 0;
    let Okresy = ["1 do 12", "13 do 24", "25 do 36"];
    return (
      <MDBTable className="bs-2 _lines text-right _zestawienie">
        <MDBTableHead>
          <tr>
            <th>Lp.</th>
            <th>Współczynnik alokacji</th>
            <th>
              Wyszczególnienie w okresie od {Okresy[this.state.okres_id-1]} miesiąca obowiązywania
              nowej taryfy
            </th>
            <th>Jedn. Miary</th>
            <th colSpan={this.state.zestawienie && this.state.zestawienie[0] && this.state.zestawienie[0].length}>Taryfowa grupa odbiorców usług</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody style={{ width: "100%" }}>
          {this.state.zestawienie && this.state.zestawienie.map((item, index) =>
            index == 0 ? (
              <tr>
                <td colSpan={4}></td>
                {this.state.zestawienie[0].map((item: string, index: number) => (
                  <td>{item}</td>
                ))}
              </tr>
            ) : (
              <tr>
                <td>{++row_counter}</td>
                {item.map((item2: string, index2: number) =>
                  typeof item2 === "string" && item2.includes("<rowSpan>") ? (
                    <td rowSpan={2}>{item2.substr(9)}</td>
                  ) : (
                    typeof item2 === "string" && item2.includes("<empty>") ? <></> : <td>{item2}</td>
                  )
                )}
              </tr>
            )
          )}
        </MDBTableBody>
      </MDBTable>
    );
  };

  render() {
    return (
      <>
        {this.modalElementSprzedarzy()}
        <MDBTable borderless className="p-0">
          <MDBTableBody style={{}}>
            <tr>
              <td style={{ width: "100%", padding: 2 }}>
                <MDBTable borderless className="p-0">
                  <MDBTableBody style={{}}>
                    <tr className="b-1">
                      <td
                        style={{
                          width: "50%",
                          padding: 2,
                          paddingRight: 10,
                          borderRight: 1,
                        }}
                      >
                        {/* <MDBBox tag="h5">Elementy sprzedaży</MDBBox> */}
                      </td>
                      <td style={{ width: "50%", padding: 2, paddingLeft: 10 }}>
                        {/* <MDBBox tag="h5">Warianty symulacji</MDBBox> */}
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
                        <div className={"rounded p-0 border"}>
                          {this.elementySprzedazy()}
                        </div>
                      </td>
                      <td style={{ width: "50%", padding: 2, paddingLeft: 10 }}>
                        <div className={"rounded p-0 border"}>
                          {this.wariantySymulacji()}
                        </div>
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
                        {OkresyControl((index, value) => {
                          this.setState({ okres_id: index + 1 }, () =>
                            this.loadDataZestawienie()
                          );
                        }, this.state.okres_id)}
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
                          color="mdb-color"
                          outline
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
                          color="mdb-color"
                          outline
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
