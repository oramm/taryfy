import React, { Component } from "react";
import {
  MDBContainer,
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
  MDBIcon,
} from "mdbreact";
import { post, cancel } from "./post";

import { ModalDialogs, ModalDialogsGetFake, ElementPrzychoduControl } from "./modal_dialogs";
import { ElementPrzychodu, KosztyRodzaje } from "../../../common/model";

type Props = {
  wniosek_id: number;
  typ_id: number;
  modal_dialogs: ModalDialogs;
};

type State = {
  wniosek_id: number;
  typ_id: number;
  link: string;
  // koszty_rodzaje: KosztyRodzaje[];
  // elementy_przychodow: ElementPrzychodu[];
  // wskaznik_id: number;
  // wskaznik_1: string;
  // wskaznik_2: string;
  // wskaznik_3: string;
  // modal_dialogs: ModalDialogs;
  // modal_koszt_label: string;
  // modal_koszt_nazwa: string;
  // modal_koszt_nazwa_invalid: boolean;
  // modal_koszt_opis: string;
  // modal_koszt_elementy_przychodow_id: number;
  // modal_koszt_on: boolean;
  // modal_koszt_action: (/* name: string, opis: string, wspolczynnik: string*/) => void;
};

class Screen extends Component<Props, State> {
  state: State = {
    wniosek_id: 0,
    typ_id: 1,
    link: "",
    // koszty_rodzaje: [],
    // elementy_przychodow: [],
    // wskaznik_id: 0,
    // wskaznik_1: "1.0",
    // wskaznik_2: "1.0",
    // wskaznik_3: "1.0",
    // modal_dialogs: ModalDialogsGetFake(),
    // modal_koszt_label: "",
    // modal_koszt_nazwa: "",
    // modal_koszt_nazwa_invalid: false,
    // modal_koszt_opis: "",
    // modal_koszt_elementy_przychodow_id: 0,
    // modal_koszt_on: false,
    // modal_koszt_action: (/*name: string, opis: string, wspolczynnik: string*/) => {},
  };

  koszt_last_edited_id: number = 0;

  constructor(props: Props) {
    super(props);
    this.state.wniosek_id = props.wniosek_id;
    // this.state.modal_dialogs = props.modal_dialogs;
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

  loadData = () => {
    console.log("Screen020: loadData called");
  };

  generujWyniki = () => {
    console.log("generujWyniki");
    post(
      "/wyniki/generuj",
      {
        wniosek_id: this.state.wniosek_id,
        typ_id: this.state.typ_id,
      },
      (response) => {
        console.log("generujWyniki /wyniki/generuj response:", response);
        this.setState({ link: response.data.link }, () =>
        console.log("generujWyniki /wyniki/generuj state:", this.state)
      );
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

  render() {
    let link = this.state.link.replace("&rm=minimal","");
    return (
      <>
        <MDBBtn
          size="sm"
          color="mdb-color"
          outline
          className="float-left"
          style={{ width: "250px" }}
          onClick={
            this.generujWyniki
          }
        >
          Generuj wyniki
        </MDBBtn>
        <MDBTable>
          <MDBTableBody style={{}}>
            <tr>
              <td style={{ padding: 2 }} colSpan={4}>
                <MDBBox>
                  <iframe
                    width="100%"
                    title="spreadsheet"
                    height="400"
                    src={this.state.link}
                  ></iframe>
                </MDBBox>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 2 }}> <a href={link} target="_blank">{link}</a></td>
            </tr>
          </MDBTableBody>
        </MDBTable>
      </>
    );
  }
}

export { Screen as Screen_wyniki };
