import React from "react";
import { Button } from "material-ui";

const LightButton = ({ text, onClick }) => (
  <Button style={{ textTransform: "none", padding: 0 }} onClick={onClick}>
    <p
      style={{
        textAlign: "left",
        paddingLeft: "8px",
        width: 150,
        overflowWrap: "break-word"
      }}
    >
      {text}
    </p>
  </Button>
);

export default LightButton;
