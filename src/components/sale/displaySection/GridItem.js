import React, { Component } from "react";
import { Paper, Avatar } from "material-ui";
import { withStyles } from "material-ui/styles";

const styles = () => ({
  purpleAvatar: {
    color: "#fff",
    backgroundColor: "#3f50b5"
  }
});

class GridItem extends Component {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <Paper
        style={{
          width: 150,
          height: 150,
          overflow: "auto",
          display: "inline-block"
        }}
      >
        <div style={{ paddingTop: 30 }}>
          <Avatar style={{ margin: "auto" }} className={classes.purpleAvatar}>
            BR
          </Avatar>
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              width: 130,
              overflowWrap: "break-word",
              padding: 5,
              fontSize: "13px"
            }}
          >
            Britania Tiger
          </p>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(GridItem);
