import React, { ChangeEvent, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/styles";
import { InputAdornment, IconButton } from "@material-ui/core";
import CustomTextField from "../textfields/CustomTextField";
import styles from "./searchBox.style";

interface IProps {
  onSubmit: (e: any) => void;
  placeholder?: string;
}

const Searchbox = ({ onSubmit, placeholder }: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [searchtext, setSearchText] = useState("");

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(searchtext);
      }}
      className={classes.root}
    >
      <CustomTextField
        onChange={onSearchChange}
        value={searchtext}
        style={{ width: 200 }}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton onClick={() => onSubmit(searchtext)}>
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
