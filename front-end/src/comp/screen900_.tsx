import React, { Component } from "react";
import { MDBContainer} from "mdbreact";

type Props = {
  nazwa: string;
};

type ComponentState = {
  nazwa: string;
};

export default class Screen900 extends Component<
  Props,
  ComponentState
> {
  state: ComponentState = {
    nazwa: "under construction"
  };

  constructor(props: Props) {
    super(props);
    this.state.nazwa = props.nazwa;
  }

  UNSAFE_componentWillReceiveProps(props: Props) {
    this.setState({nazwa: props.nazwa});
  }

  componentDidMount() {
    console.log("Screen900: componentDidMount");
  }

  render() {
    return (
      <MDBContainer aligncontent="start">
        under construction
      </MDBContainer>
    );
  }
}
