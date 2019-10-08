import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Paper from "material-ui/Paper";
import List, { ListItem, ListItemText } from "material-ui/List";
import CustomTextField from "../textfields/CustomTextField";

// eslint-disable-next-line
const styles = theme => ({
  ddItem: {
    position: "absolute"
  }
});

class AutoSuggestWithApiDatasource extends Component {
  state = {
    hideSuggestions: true
  };

  renderOptions = () => {
    const { datasource, onSelected } = this.props;

    if (!datasource) {
      return null;
    }

    return datasource.map(data => (
      <ListItem button key={data.id} onClick={() => onSelected(data)}>
        <ListItemText>
          <span style={{ fontSize: "0.95rem" }}>{data.name}</span>
        </ListItemText>
      </ListItem>
    ));
  };

  renderNoData = () => {
    const { classes, width } = this.props;

    return (
      <Paper
        elevation={4}
        className={classes.ddItem}
        style={{ width, zIndex: 1000 }}
      >
        <List component="nav">
          <ListItem>
            <ListItemText>
              <span style={{ fontSize: "0.95rem" }}>No records available</span>
            </ListItemText>
          </ListItem>
        </List>
      </Paper>
    );
  };

  renderSuggestions = () => {
    const { hideSuggestions } = this.state;
    const { classes, width, datasource, searchText } = this.props;

    if (hideSuggestions === true || !searchText || searchText.length < 3) {
      return null;
    }

    if (!datasource || datasource.length === 0) {
      return this.renderNoData();
    }

    return (
      <Paper
        elevation={4}
        className={classes.ddItem}
        style={{ width, zIndex: 1000 }}
      >
        <List component="nav">{this.renderOptions()}</List>
      </Paper>
    );
  };

  onFocus = () => {
    this.setState({ hideSuggestions: false });
  };

  wait = async () => new Promise(resolve => setTimeout(resolve, 0));

  onBlur = async () => {
    // Hack to make the selection of item to trigget the onSelect event before this
    // sets the hideSuggestions to true. Because if its sets to true the onSelect
    // event is not getting triggerred. This way we are forcing the setState below
    //  to happen to happen after the onSelect event.
    await this.wait();
    this.setState({ hideSuggestions: true });
  };

  render() {
    const { width, onChange, searchText, onKeyDown } = this.props;

    return (
      <div>
        <CustomTextField
          onKeyDown={onKeyDown}
          value={searchText}
          onChange={onChange}
          placeholder="Enter Product Id or Barcode"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          style={{ width }}
        />
        {this.renderSuggestions()}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  AutoSuggestWithApiDatasource
);
