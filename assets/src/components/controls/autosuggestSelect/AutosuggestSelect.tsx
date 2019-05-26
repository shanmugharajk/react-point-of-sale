import React, { CSSProperties } from "react";
import Select from "react-select";
import NoSsr from "@material-ui/core/NoSsr";
import { ValueType } from "react-select/lib/types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import styles from "./autosuggestSelect.style";
import components from "./components";
import { OptionType } from "./types";

interface IProps {
  label: string;
  suggestions: OptionType[];
  value?: ValueType<OptionType>;
  error: boolean;
  onChange: (value: ValueType<OptionType>) => void;
}

const useStyles = makeStyles(styles);

function AutosuggestSelect(props: IProps) {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    })
  };

  return (
    <NoSsr>
      <Select
        TextFieldProps={{
          label: props.label,
          InputLabelProps: {
            shrink: true
          },
          error: props.error
        }}
        classes={classes}
        styles={selectStyles}
        options={props.suggestions}
        components={components}
        value={props.value}
        onChange={props.onChange}
        placeholder=""
        isClearable
      />
    </NoSsr>
  );
}

export default AutosuggestSelect;
