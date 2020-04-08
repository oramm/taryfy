import React, { Component } from "react";
import {
  MDBListGroup,
  MDBListGroupItem,
  MDBContainer,
  MDBBtn,
  MDBBox,
  MDBTable,
  MDBTableBody,
} from "mdbreact";
import Axios from "axios";
import { OnModal } from "./modal_dialogs";

type Props = {
  callback: (index: number) => void;
  wniosek_id: number;
  on_modal_nazwa: OnModal | undefined;
};

type RodzajeKosztowData = { id: number; nazwa: string };

type State = {
  callback: (index: number) => void;
  wniosek_id: number;
  rodzaje_kosztow: RodzajeKosztowData[];
  on_modal_nazwa: OnModal | undefined;
};

export default class Screen020 extends Component<Props, State> {
  state: State = {
    callback: (index: number) => {},
    wniosek_id: 0,
    on_modal_nazwa: (
      label: string,
      nazwa: string,
      action: (nazwa: string) => void
    ) => {},
    rodzaje_kosztow: [{ id: 1, nazwa: "testowa 1" }],
  };

  edited_id: number = 0;

  constructor(props: Props) {
    super(props);
    this.state.callback = props.callback;
    this.state.wniosek_id = props.wniosek_id;
    this.state.on_modal_nazwa = props.on_modal_nazwa;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState({ wniosek_id: props.wniosek_id }, this.loadData);
  }

  onMenuItemClick(index: number) {
    this.props.callback(index);
  }

  dodaj = (nazwa: string) => {
    console.log("Screen020: dodaj");
    console.log(this.state);
    Axios.post("/rodzaje_kosztow/insert", {
      wniosek_id: this.state.wniosek_id,
      nazwa: nazwa,
    }).then((response) => {
      console.log("Axios.post/rodzaje_kosztow/insert response:", response);
      this.loadData();
    });
  };

  edytuj = (nazwa: string) => {
    console.log("Screen020: edytuj");
    console.log(this.state);
    Axios.post("/rodzaje_kosztow/update", {
      id: this.edited_id,
      nazwa: nazwa,
    }).then((response) => {
      console.log("Axios.post/rodzaje_kosztow/edytuj response");
      console.log(response);
      this.loadData();
    });
  };

  loadData = () => {
    console.log("Screen020: loadData called");
    Axios.post("/koszty/updatespreadsheet", {
      wniosek_id: this.state.wniosek_id,
    });
    Axios.post("/rodzaje_kosztow/select", {
      wniosek_id: this.state.wniosek_id,
    }).then((response) => {
      console.log("Axios.post /rodzaje_kosztow/select response");
      console.log(response);
      this.setState({ rodzaje_kosztow: response.data });
      console.log(this.state);
    });
  };

  onRodzajeKosztowDelete(id: number) {
    console.log("onRodzajeKosztowDelete");
    Axios.post("/rodzaje_kosztow/delete", {
      wniosek_id: this.state.wniosek_id,
      id: id,
    }).then((response) => {
      console.log("Axios.post /rodzaje_kosztow/delete response");
      console.log(response);
      this.loadData();
    });
  }

  rodzaje_kosztow = () => {
    return (
      <MDBListGroup>
        {this.state.rodzaje_kosztow.map((koszt, index) => (
          <MDBListGroupItem className="p-0" key={index}>
            <MDBBox className="float-left p-2">{koszt.nazwa}</MDBBox>
            <MDBBtn
              size="sm"
              className="float-right p-2"
              onClick={() => this.onRodzajeKosztowDelete(koszt.id)}
            >
              Usuń
            </MDBBtn>
            <MDBBtn
              className="float-right p-2"
              size="sm"
              onClick={() => {
                this.edited_id = koszt.id;
                this.state.on_modal_nazwa &&
                  this.state.on_modal_nazwa(
                    "Edytuj nazwę typu kosztów",
                    koszt.nazwa,
                    this.edytuj
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
  rodzaje_kosztow_tab = () => {
    return (
      <MDBTable small>
        <MDBTableBody>
          {this.state.rodzaje_kosztow.map((koszt, index) => (
            <tr>
              <td>
                <MDBBox className="float-left p-2">{koszt.nazwa}</MDBBox>

                <MDBBtn
                  size="sm"
                  className="float-right p-2 m-1"
                  onClick={() => this.onRodzajeKosztowDelete(koszt.id)}
                >
                  Usuń
                </MDBBtn>
                <MDBBtn
                  className="float-right p-2 m-1"
                  size="sm"
                  onClick={() => {
                    this.edited_id = koszt.id;
                    this.state.on_modal_nazwa &&
                      this.state.on_modal_nazwa(
                        "Edytuj nazwę typu kosztów",
                        koszt.nazwa,
                        this.edytuj
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
          onClick={() =>
            this.state.on_modal_nazwa &&
            this.state.on_modal_nazwa(
              "Dodaj nowy typ kosztów",
              "nowa nazwa",
              this.dodaj
            )
          }
        >
          Dodaj nowy rodzaj kosztów
        </MDBBtn>
        {this.rodzaje_kosztow_tab()}
        <MDBBox>
          <iframe
            width="100%"
            title="spreadsheet"
            height="400"
            src="https://docs.google.com/spreadsheets/d/1Whi0wLCOyF1NSjc04vMDNXs3xcOvJL5Qd1FZV_gwnAk/edit?rm=minimal"
          ></iframe>
        </MDBBox>
      </MDBContainer>
    );
  }
}
