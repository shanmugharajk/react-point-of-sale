import React from "react";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/styles";
import { InputAdornment, IconButton } from "@material-ui/core";
import CustomTextField from "../textfields/CustomTextField";
import styles from "./searchBox.style";

interface IProps {
  onChange: (e: any) => void;
  value: string | number;
  onSubmit: (e: any) => void;
  placeholder?: string;
}

const Searchbox = ({ onChange, value, onSubmit, placeholder }: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  return (
    <form onSubmit={onSubmit} className={classes.root}>
      <CustomTextField
        onChange={onChange}
        value={value}
        style={{ width: 200 }}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={onSubmit}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </form>
  );
};

Searchbox.defaultProps = {
  placeholder: "Enter ID."
};

export default Searchbox;
