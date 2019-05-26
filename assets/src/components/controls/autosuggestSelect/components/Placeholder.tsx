import React from "react";
import Typography from "@material-ui/core/Typography";
import {
  PlaceholderProps,
  placeholderCSS
} from "react-select/lib/components/Placeholder";
import { OptionType } from "../types";

const Placeholder = (props: PlaceholderProps<OptionType>) => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

export default Placeholder;
