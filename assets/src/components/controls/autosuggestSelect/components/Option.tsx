import React from "react";
import { MenuItem } from "@material-ui/core";
import { OptionProps } from "react-select/lib/components/Option";
import { OptionType } from "../types";

const Option = (props: OptionProps<OptionType> | any) => (
  <MenuItem
    ref={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);

export default Option;
