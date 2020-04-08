import React, { Component } from "react";

import { MDBNavbar, MDBNavbarBrand } from "mdbreact";

type ComponentProps = {
  name: string;
};

type ComponentState = {
  name: string;
};

export default class Menu040 extends Component<ComponentProps, ComponentState> {
  state: ComponentProps = {
    name: ""
  };

  constructor(props: ComponentProps) {
    super(props);
  }

  componentDidMount() {
    console.log("Menu040: componentDidMount");
  }

  render() {
    return (
      <MDBNavbar color="default-color" dark expand="md">
        <MDBNavbarBrand>
          <strong className="white-text">{this.state.name}</strong>
        </MDBNavbarBrand>
      </MDBNavbar>
    );
  }
}
