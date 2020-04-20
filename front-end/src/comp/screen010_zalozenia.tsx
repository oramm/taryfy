import React, { Component } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
} from "mdbreact";
import { post, cancel } from "./post";

type Props = {
  wniosek_id: number;
};

type ZalozeniaData = {
  id: number;
  wniosek_id: number;
  inflacja_1: number;
  wskaznik_cen_1: number;
  marza_zysku_1: number;
  inflacja_2: number;
  wskaznik_cen_2: number;
  marza_zysku_2: number;
  inflacja_3: number;
  wskaznik_cen_3: number;
  marza_zysku_3: number;
};

type ComponentState = {
  wniosek_id: number;
  data: ZalozeniaData;
};

export default class Screen010 extends Component<Props, ComponentState> {
  state: ComponentState = {
    wniosek_id: 0,
    data: {
      id: 0,
      wniosek_id: 0,
      inflacja_1: 0,
      wskaznik_cen_1: 0,
      marza_zysku_1: 0,
      inflacja_2: 0,
      wskaznik_cen_2: 0,
      marza_zysku_2: 0,
      inflacja_3: 0,
      wskaznik_cen_3: 0,
      marza_zysku_3: 0,
    },
  };

  constructor(props: Props) {
    super(props);
    this.state.wniosek_id = props.wniosek_id;
  }

  loadData() {
    if (this.state.wniosek_id > 0) {
      post(
        "/zalozenia/select",
        {
          wniosek_id: this.state.wniosek_id,
        },
        (response) => {
          console.log("Axios.post zalozenia/get response");
          console.log(response);
          if (response.data.length > 0) {
            this.setState({ data: response.data[0] });
            console.log(this.state);
          }
        }
      );
    }
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    if (this.state.wniosek_id !== props.wniosek_id) {
      this.setState({ wniosek_id: props.wniosek_id }, this.loadData);
    }
  }

  onZapiszZmiany() {
    if (this.state.wniosek_id! > 0) {
      console.log("Screen010: onZapiszZmiany");
      post("/zalozenia/update", this.state.data, (response) => {
        console.log("Axios.post zalozenia/update response");
        post(
          "/zalozenia/select",
          {
            wniosek_id: this.state.wniosek_id,
          },
          (response) => {
            console.log("Axios.post zalozenia/get response");
            console.log(response);
            this.setState({ data: response.data[0] });
            console.log(this.state);
          }
        );
      });
    }
  }

  componentDidMount() {
    console.log("Screen010: componentDidMount");
    this.loadData();
  }

  componentWillUnmount() {
    cancel();
  }

  render() {
    console.log("screen010 zalozenia render()");
    console.log(this.state);
    return (
      <MDBContainer aligncontent="start">
        {this.state.wniosek_id > 0 && (
          <React.Fragment>
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th></th>
                  <th className="text-center">1 - 12</th>
                  <th className="text-center">13 - 24</th>
                  <th className="text-center">25 - 36</th>
                </tr>
              </MDBTableHead>

              <MDBTableBody>
                <tr>
                  <td>Inflacja</td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      value={this.state.data.inflacja_1}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.inflacja_1 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.inflacja_2}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.inflacja_2 = isNaN(Number.parseInt(value))
                          ? 0
                          : Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.inflacja_3}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.inflacja_3 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Wskaźnik cen produkcji sprzedanej przemysłu</td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.wskaznik_cen_1}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.wskaznik_cen_1 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.wskaznik_cen_2}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.wskaznik_cen_2 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.wskaznik_cen_3}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.wskaznik_cen_3 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Wysokość marży zysku</td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.marza_zysku_1}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.marza_zysku_1 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.marza_zysku_2}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.marza_zysku_2 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="text"
                      value={this.state.data.marza_zysku_3}
                      onChange={(event) => {
                        const { value } = event.currentTarget;
                        let stateData = this.state.data;
                        stateData.marza_zysku_3 = Number.parseInt(value);
                        this.setState({ data: stateData });
                      }}
                    />
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>
            <MDBBtn onClick={() => this.onZapiszZmiany()}>Zapisz zmiany</MDBBtn>
          </React.Fragment>
        )}
      </MDBContainer>
    );
  }
}
