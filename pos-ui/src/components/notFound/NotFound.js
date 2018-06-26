import React from "react";
import Container from "../controls/Container";
import SuccessMessage from "../controls/messages/SuccessMessage";

const NotFound = () => (
  <Container>
    <SuccessMessage
      title="Page not found"
      message="The requested page is not found."
    />
  </Container>
);

export default NotFound;
