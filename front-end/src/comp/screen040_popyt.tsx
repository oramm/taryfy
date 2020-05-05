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
} from "mdbreact";
import { post, cancel } from "./post";

import {
  ModalDialogs,
  ModalDialogsGetFake,
  GrupyAllokacjiControl,
  OkresyControl,
} from "./modal_dialogs";

type Props = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type ElementSprzedazy = {
  id: number;
  nazwa: string;
  opis: string;
  wspolczynnik: string;
  jednostka: string;
  abonament: boolean;
  abonament_nazwa: string;
  abonament_wspolczynnik: string;
};
let ElementSprzedazyEmpty = {
  id: 0,
  nazwa: "",
  opis: "",
  wspolczynnik: "",
  jednostka: "",
  abonament: false,
  abonament_nazwa: "",
  abonament_wspolczynnik: "",
};
type WariantSymulacji = {
  id: number;
  okres_id: number;
  nazwa: string;
  opis: string;
};

let WariantSymulacjiEmpty = {
  id: 0,
  okres_id: 0,
  nazwa: "",
  opis: "",
};

type State = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  elementy_sprzedazy: ElementSprzedazy[];
  elementy_sprzedazy_selected: ElementSprzedazy;
  warianty_symulacji: WariantSymulacji[];
  wskaznik_1: string;
  wskaznik_2: string;
  wskaznik_3: string;
  modal_dialogs: ModalDialogs;
  modal_sprzedaz_label: string;
  modal_sprzedaz: ElementSprzedazy;
  modal_sprzedaz_on: boolean;
  modal_wariant_label: string;
  modal_wariant: WariantSymulacji;
  modal_wariant_on: boolean;
  modal_sprzedaz_callback: (/* name: string, opis: string, wspolczynnik: string*/) => void;
  modal_wariant_callback: (data: any) => void;
};

export default class Screen extends Component<Props, State> {
  state: State = {
    callback: (index: number) => {},
    wniosek_id: 0,
    typ_id: 1,
    modal_dialogs: ModalDialogsGetFake(),
    elementy_sprzedazy: [],
    elementy_sprzedazy_selected: ElementSprzedazyEmpty,
    warianty_symulacji: [],
    wskaznik_1: "1.0",
    wskaznik_2: "1.0",
    wskaznik_3: "1.0",
    modal_sprzedaz_label: "",
    modal_sprzedaz: ElementSprzedazyEmpty,
    modal_sprzedaz_on: false,
    modal_wariant_label: "",
    modal_wariant: WariantSymulacjiEmpty,
    modal_wariant_on: false,
    modal_sprzedaz_callback: (/*name: string, opis: string, wspolczynnik: string*/) => {},
    modal_wariant_callback: (data: any) => {},
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

  onElementSprzedazyEdytuj = () => {
    console.log("Screen040 onElementSprzedazyEdytuj");
    console.log(this.state);
    post(
      "/popyt_element_sprzedazy/update",
      {
        sprzedaz: this.state.modal_sprzedaz,
      },
      (response) => {
        console.log("Screen040 onElementSprzedazyEdytuj response:", response);
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

  onWariantSymulacjiDodaj = (data: any) => {
    console.log("Screen040 onWariantSymulacjiDodaj");
    console.log(this.state);
    post(
      "/popyt_warianty_symulacji/insert",
      {
        element_sprzedazy_id: this.state.elementy_sprzedazy_selected.id,
        data: data,
      },
      (response) => {
        console.log("Screen040 onWariantSymulacjiDodaj response:", response);
        this.loadDataWariantySymulacji();
      }
    );
  };

  onWariantSymulacjiEdytuj = (data: any) => {
    console.log("Screen040 onWariantSymulacjiEdytuj");
    console.log(this.state);
    post(
      "/popyt_warianty_symulacji/update",
      {
        element_sprzedazy_id: this.state.elementy_sprzedazy_selected.id,
        data: data,
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
            elementy_sprzedazy_selected: ElementSprzedazyEmpty,
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
        element_sprzedazy_id: this.state.elementy_sprzedazy_selected.id,
      },
      (response) => {
        console.log("loadDataWariantySymulacji response:", response);
        this.setState({ warianty_symulacji: response.data }, () =>
          console.log("loadDataWariantySymulacji state:", this.state)
        );
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
    callback: (/*name: string, opis: string, wspolczynnik: string*/) => void
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
              this.state.modal_sprzedaz_callback();
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
              ElementSprzedazyEmpty,
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
                  this.setState({ elementy_sprzedazy_selected: item }, () =>
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
    callback: (data: any) => void
  ) => {
    let new_state = {
      modal_wariant_label: label,
      modal_wariant: wariant_symulacji,
      modal_wariant_on: true,
      modal_wariant_callback: callback,
    };
    console.log("modalWariantSymulacjiOn: ", new_state);
    this.setState(new_state);
  };

  modalWariantSymulacjiOff = () => {
    this.setState({
      modal_wariant_on: false,
    });
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
                    this.state.modal_wariant.okres_id = index;
                  })}
                </td>
              </tr>
              <tr>
                <td>
                  <MDBTable bordered>
                    <MDBTableBody>
                      <tr>
                        <td></td>
                        <td>sprzedaż, m3</td>
                        <td>A [%]</td>
                        <td>opłaty ab. [zł]</td>
                        <td>B [%]</td>
                        <td>Suma [zł]</td>
                        <td>wg wskaźnika</td>
                        <td>jako dopełnienie</td>
                        <td>jako % z całości</td>
                        <td>liczba odbiorców</td>
                      </tr>
                      <tr>
                        <td>grupa 1</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Suma</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>Suma docelowa</td>
                        <td></td>
                        <td></td>
                        <td></td>
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
              this.state.modal_wariant_callback(this.state.modal_wariant);
            }}
          >
            Akceptuj
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    );
  }

  wariantySymulacji = () => {
    if (
      this.state.elementy_sprzedazy_selected &&
      this.state.elementy_sprzedazy_selected.id > 0
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
                WariantSymulacjiEmpty,
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
                  <tr key={index}>
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
    return (
      <MDBTable bordered className="p-0">
        <MDBTableBody style={{ width: "100%" }}>
          <tr>
            <td>Lp.</td>
            <td>Współczynnik alokacji</td>
            <td>
              Wyszczególnienie w okresie od 25 do 36 miesiąca obowiązywania
              nowej taryfy
            </td>
            <td>Jedn. Miary</td>
            <td>Taryfowa grupa odbiorców usług</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>grupa 1</td>
            <td>grupa 2</td>
            <td>grupa 3</td>
            <td>grupa 4</td>
            <td>grupa 5</td>
          </tr>
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
                      <td style={{ padding: 2 }}></td>
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
                      <td style={{ padding: 2 }}></td>
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
