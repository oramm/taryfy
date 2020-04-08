import React, { Component } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBTable,
  MDBTableBody,
  MDBBtn,
  MDBNavbarBrand,
  MDBNavbar,
  MDBBox,
} from "mdbreact";

import { post } from "./post";
import { OnModal } from "./modal_dialogs";

type Props = {
  callback: (token: string) => void;
  on_modal_error: OnModal | undefined;
};

type LoginData = {
  nazwa: string;
  haslo: string;
};

type State = {
  data: LoginData;
  callback: (token: string) => void;
  on_modal_error: OnModal | undefined;
};

export default class Screen050 extends Component<Props, State> {
  state: State = {
    data: { nazwa: "", haslo: "" },
    callback: (token: string) => {},
    on_modal_error: (
      label: string,
      nazwa: string,
      action: (nazwa: string) => void
    ) => {},
  };

  constructor(props: Props) {
    super(props);
    console.log("Screen050 constructor: props:", props);
    this.state.callback = props.callback;
    this.state.on_modal_error = props.on_modal_error;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {}

  onLogin() {
    //todo: validate eg not empty
    console.log("Screen050: onLogin");

    post(
      "/uzytkownicy/login",
      this.state.data,
      (response) => {
        if (response.data) {
          console.log("Screen050: onLogin ok");
          this.state.callback(response.data);
        } else {
          //todo: check when it happend
          console.log("Screen050: onLogin error");
          this.state.on_modal_error &&
            this.state.on_modal_error("Nie udało się załogwać", "", () => {});
        }
      },
      (error) => {
        console.log(
          "Screen050: onLogin error, on_modal_error:",
          this.state.on_modal_error
        );
        this.state.on_modal_error &&
          this.state.on_modal_error("Nie udało się załogwać", "", () => {});
      }
    );
  }

  componentDidMount() {
    console.log("Screen010: componentDidMount");
  }

  render() {
    console.log("screen010 zalozenia render()");
    console.log(this.state);
    return (
      <>
        <MDBNavbar
          color="default-color"
          dark
          expand="md"
          style={{ width: "100%" }}
          fixed="top"
        >
          <MDBNavbarBrand>
            <strong className="white-text">Wnioski taryfowe</strong>
          </MDBNavbarBrand>
        </MDBNavbar>
        <MDBContainer style={{ marginTop: "100px" }} className="w-25">
          <MDBTable>
            <MDBTableBody>
              <tr>
                <td>Użytkownik:</td>
                <td>
                  <MDBInput
                    noTag
                    className="text-right"
                    style={{ width: "200px" }}
                    value={this.state.data.nazwa}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      let data = this.state.data;
                      data.nazwa = value;
                      this.setState({ data: data });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Hasło:</td>
                <td>
                  <MDBInput
                    noTag
                    className="text-right"
                    style={{ width: "200px" }}
                    type="text"
                    value={this.state.data.haslo}
                    onChange={(event) => {
                      const { value } = event.currentTarget;
                      let data = this.state.data;
                      data.haslo = value;
                      this.setState({ data: data });
                    }}
                  />
                </td>
              </tr>
            </MDBTableBody>
          </MDBTable>
          <MDBBox display="flex" justifyContent="center">
            <MDBBtn onClick={() => this.onLogin()}>Zaloguj</MDBBtn>
          </MDBBox>
        </MDBContainer>
      </>
    );
  }
}
