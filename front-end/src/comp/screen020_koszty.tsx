import React, { Component } from "react";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
  MDBBtn,
  MDBBox,
  MDBTable,
  MDBTableBody,
  MDBInput,
} from "mdbreact";
import { post, cancel } from "./post";

import { ModalDialogs, ModalDialogsGetFake } from "./modal_dialogs";

type Props = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number
  modal_dialogs: ModalDialogs;
};

type RodzajeKosztowData = { id: number; nazwa: string };

type State = {
  callback: (index: number) => void;
  wniosek_id: number;
  typ_id: number;
  koszty_rodzaje: RodzajeKosztowData[];
  wskaznik_1: number;
  wskaznik_2: number;
  wskaznik_3: number;
  modal_dialogs: ModalDialogs;
};

export default class Screen020 extends Component<Props, State> {
  state: State = {
    callback: (index: number) => {},
    wniosek_id: 0,
    typ_id: 1,
    wskaznik_1: 1.0,
    wskaznik_2: 1.0,
    wskaznik_3: 1.0,
    modal_dialogs: ModalDialogsGetFake(),
    koszty_rodzaje: [],
  };

  edited_id: number = 0;

  constructor(props: Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.wniosek_id = props.wniosek_id;
    this.state.modal_dialogs = props.modal_dialogs;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState({ wniosek_id: props.wniosek_id, typ_id: props.typ_id }, () => {
      cancel();
      this.loadData();
    });
  }

  onMenuItemClick(index: number) {
    this.props.callback(index);
  }

  onRodzajeKosztowDodaj = (nazwa: string) => {
    console.log("Screen020: dodaj");
    console.log(this.state);
    post(
      "/koszty_rodzaje/insert",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
        nazwa: nazwa,
      },
      (response) => {
        console.log("Axios.post/koszty_rodzaje/insert response:", response);
        this.loadData();
      }
    );
  };

  onRodzajeKosztowEdytuj = (nazwa: string) => {
    console.log("Screen020: edytuj");
    console.log(this.state);
    post(
      "/koszty_rodzaje/update",
      {
        id: this.edited_id,
        nazwa: nazwa,
      },
      (response) => {
        console.log("Axios.post/koszty_rodzaje/edytuj response");
        console.log(response);
        this.loadData();
      }
    );
  };

  onRodzajeKosztowUsun(id: number) {
    console.log("onRodzajeKosztowUsun");
    post(
      "/koszty_rodzaje/delete",
      {
        // wniosek_id: this.state.wniosek_id,
        id: id
      },
      (response) => {
        console.log("Axios.post /koszty_rodzaje/delete response");
        console.log(response);
        this.loadData();
      }
    );
  }

  onRodzajeKosztowKopiuj = (event: any) => {
    console.log("Screen020: kopiuj");
    console.log(this.state);
    //todo: implemen this

    // Axios.post("/koszty_rodzaje/insert", {
    //   wniosek_id: this.state.wniosek_id,
    //   nazwa: nazwa,
    // }).then((response) => {
    //   console.log("Axios.post/koszty_rodzaje/insert response:", response);
    //   this.loadData();
    // });
  };

  onPrognozuj = (event: any) => {
    console.log("Screen020: prognozuj");
    console.log(this.state);
    //todo: implemen this

    // Axios.post("/koszty_rodzaje/insert", {
    //   wniosek_id: this.state.wniosek_id,
    //   nazwa: nazwa,
    // }).then((response) => {
    //   console.log("Axios.post/koszty_rodzaje/insert response:", response);
    //   this.loadData();
    // });
  };

  loadData = async () => {
    console.log("Screen020: loadData called");
    await post(
      "/koszty/updatespreadsheet",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id        
      },
      (response) => {
        console.log("Axios.post /koszty_rodzaje/updatespreadsheet response");
        console.log(response);
      }
    );
    await post(
      "/koszty_rodzaje/select",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id        
      },
      (response) => {
        console.log("Axios.post /koszty_rodzaje/select response");
        console.log(response);
        this.setState({ koszty_rodzaje: response.data });
        console.log(this.state);
      }
    );
  };

  componentDidMount() {
    console.log("Screen020: componentDidMount");
    this.loadData();
  }

  componentWillUnmount() {
    cancel();
  }

  koszty_rodzaje = () => {
    return (
      <MDBListGroup>
        {this.state.koszty_rodzaje.map((koszt, index) => (
          <MDBListGroupItem className="p-0" key={index}>
            <MDBBox className="float-left p-2">{koszt.nazwa}</MDBBox>
            <MDBBtn
              size="sm"
              className="float-right p-2"
              onClick={() => this.onRodzajeKosztowUsun(koszt.id)}
            >
              Usuń
            </MDBBtn>
            <MDBBtn
              className="float-right p-2"
              size="sm"
              onClick={() => {
                this.edited_id = koszt.id;
                this.state.modal_dialogs.nazwaOn(
                  "Edytuj nazwę typu kosztów",
                  koszt.nazwa,
                  this.onRodzajeKosztowEdytuj
                );
              }}
            >
              Edytuj nazwę
            </MDBBtn>
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
    );
  };

  koszty_rodzaje_tab = () => {
    return (
      <MDBTable small>
        <MDBTableBody>
          {this.state.koszty_rodzaje.map((koszt, index) => (
            <tr key={index}>
              <td>
                <MDBBox className="float-left p-2">{koszt.nazwa}</MDBBox>

                <MDBBtn
                  size="sm"
                  className="float-right p-2 m-1"
                  onClick={() => this.onRodzajeKosztowUsun(koszt.id)}
                >
                  Usuń
                </MDBBtn>
                <MDBBtn
                  className="float-right p-2 m-1"
                  size="sm"
                  onClick={() => {
                    this.edited_id = koszt.id;
                    this.state.modal_dialogs.nazwaOn(
                      "Edytuj nazwę typu kosztów",
                      koszt.nazwa,
                      this.onRodzajeKosztowEdytuj
                    );
                  }}
                >
                  Edytuj nazwę
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    );
  };

  render() {
    return (
      <MDBContainer>
        <MDBBtn
          size="sm"
          className="float-left"
          style={{width:'250px'}}
          onClick={() =>
            this.state.modal_dialogs.nazwaOn(
              "Dodaj nowy rodzaj kosztów",
              "nowa nazwa",
              this.onRodzajeKosztowDodaj
            )
          }
        >
          Dodaj nowy rodzaj kosztów
        </MDBBtn>
        {this.koszty_rodzaje_tab()}
        <MDBBtn
          size="sm"
          className="float-left"
          style={{width:'250px'}}
          onClick={this.onRodzajeKosztowKopiuj}
        >
          Kopiuj rodzaje kosztów do tabeli
        </MDBBtn>
        
{/*todo: use global style
 .koszty_rodzaje_table td {
  padding: 2px;
}         */}
        <MDBTable borderless className="p-2">
          <MDBTableBody style={{}}>
            <tr>
              <td style={{ width: "61%", padding: 2 }}></td>
              <td style={{ width: "13%", padding: 2 }} className="text-center">
                Wskaźnik rok 1
              </td>
              <td style={{ width: "13%", padding: 2 }} className="text-center">
                Wskaźnik rok 2
              </td>
              <td style={{ width: "13%", padding: 2 }} className="text-center">
                Wskaźnik rok 3
              </td>
            </tr>
            <tr>
              <td style={{padding: 2 }}></td>
              <td style={{padding: 2 }}>
                <MDBBox>
                  <MDBInput
                    noTag
                    className="text-right"
                    type="text"
                    value={this.state.wskaznik_1}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      //todo: validate value
                      this.setState({ wskaznik_1: Number.parseInt(value) });
                    }}
                  />
                </MDBBox>
              </td>
              <td style={{padding: 2 }}>
                <MDBBox>
                  <MDBInput
                    noTag
                    className="text-right"
                    type="text"
                    value={this.state.wskaznik_2}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      //todo: validate value
                      this.setState({ wskaznik_2: Number.parseInt(value) });
                    }}
                  />
                </MDBBox>
              </td>
              <td style={{padding: 2 }}>
                <MDBBox>
                  <MDBInput
                    noTag
                    className="text-right"
                    type="text"
                    value={this.state.wskaznik_3}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      //todo: validate value
                      this.setState({ wskaznik_3: Number.parseInt(value) });
                    }}
                  />
                </MDBBox>
              </td>
            </tr>
            <tr>
              <td style={{padding: 2 }}></td>
              <td style={{padding: 2 }}></td>
              <td style={{padding: 2 }} colSpan={2}>
                <MDBBtn
                  size="sm"
                  style={{width:'250px'}}
                  className="float-right"
                  onClick={this.onPrognozuj}
                >
                  Prognozuj
                </MDBBtn>
              </td>
            </tr>
            <tr>
              <td style={{padding: 2 }} colSpan={4} >
                <MDBBox>
                  <iframe
                    width="100%"
                    title="spreadsheet"
                    height="400"
                    src="https://docs.google.com/spreadsheets/d/1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk/edit?rm=minimal"
                  ></iframe>
                </MDBBox>
              </td>
            </tr>
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
    );
  }
}
