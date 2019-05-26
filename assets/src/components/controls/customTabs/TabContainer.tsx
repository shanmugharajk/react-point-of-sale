import React, { ReactNode } from "react";
import { Typography } from "@material-ui/core";

const TabContainer = (props: { children: ReactNode }) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

export default TabContainer;
