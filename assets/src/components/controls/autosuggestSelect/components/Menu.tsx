import React from "react";
import Paper from "@material-ui/core/Paper";
import { MenuProps } from "react-select/lib/components/Menu";
import { OptionType } from "../types";

const Menu = (props: MenuProps<OptionType>) => (
  <Paper
    square
    className={props.selectProps.classes.paper}
    {...props.innerProps}
  >
    {props.children}
  </Paper>
);

export default Menu;
