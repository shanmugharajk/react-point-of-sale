import React from "react";
import Container from "../controls/container/InnerContainer";
import Message from "../controls/messages/Message";

const NotFound = () => (
  <Container>
    <Message
      title="Page not found"
      message="The requested page is not found."
    />
  </Container>
);

export default NotFound;
