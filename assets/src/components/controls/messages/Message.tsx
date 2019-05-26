import React from "react";
import { makeStyles } from "@material-ui/styles";
import styles from "./message.style";

interface IProps {
  title: string;
  message: string;
  style?: any;
}

const Message = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { title, message, style } = props;

  return (
    <div className={classes.root} style={style}>
      <div className={classes.message}>
        <div className={classes.header}> {title} </div>
        <span>{message}</span>
      </div>
    </div>
  );
};

Message.defaultProps = {
  style: {}
};

export default Message;
