import React from "react";
import { Typography } from "@material-ui/core";
import { NoticeProps } from "react-select/lib/components/Menu";
import { OptionType } from "../types";

const NoOptionsMessage = (props: NoticeProps<OptionType>) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

export default NoOptionsMessage;
