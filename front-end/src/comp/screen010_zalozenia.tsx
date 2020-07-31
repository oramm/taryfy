import React, { Component } from "react";
import update from "immutability-helper";
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

class Screen010 extends Component<Props, ComponentState> {
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
          console.log("Axios.post zalozenia/select response");
          console.log(response);
          if (response.data.length > 1) {
            this.setState({ data: response.data[1][0] });
            console.log(this.state);
          } else {
            //todo: some error?
          }
        }
      );
    }
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState({ wniosek_id: props.wniosek_id }, this.loadData);
  }

  onZapiszZmiany() {
    if (this.state.wniosek_id > 0) {
      console.log("Screen010: onZapiszZmiany");
      post("/zalozenia/update", this.state.data, (response) => {
        console.log("Axios.post zalozenia/update response");
        this.loadData();
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
          <form
            className="needs-validation"
            onSubmit={this.onZapiszZmiany}
            noValidate
          >
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
                      type="number"
                      required
                      value={this.state.data.inflacja_1}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { inflacja_1: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      value={this.state.data.inflacja_2}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { inflacja_2: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      value={this.state.data.inflacja_3}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { inflacja_3: { $set: Number(value) } },
                            });
                          });
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
                      type="number"
                      value={this.state.data.wskaznik_cen_1}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { wskaznik_cen_1: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      value={this.state.data.wskaznik_cen_2}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { wskaznik_cen_2: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      value={this.state.data.wskaznik_cen_3}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { wskaznik_cen_3: { $set: Number(value) } },
                            });
                          });
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
                      type="number"
                      value={this.state.data.marza_zysku_1}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { marza_zysku_1: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      value={this.state.data.marza_zysku_2}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { marza_zysku_2: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                  <td>
                    <MDBInput
                      noTag
                      className="text-right"
                      type="number"
                      value={this.state.data.marza_zysku_3}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        if (Number(value) || value === "0")
                          this.setState((prevState) => {
                            return update(prevState, {
                              data: { marza_zysku_3: { $set: Number(value) } },
                            });
                          });
                      }}
                    />
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>
            <MDBBtn color="mdb-color" outline onClick={() => this.onZapiszZmiany()}>
              Zapisz zmiany
            </MDBBtn>
          </form>
        )}
      </MDBContainer>
    );
  }
}

export { Screen010 as Screen010_zalozenia };
