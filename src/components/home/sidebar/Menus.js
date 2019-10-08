import React, { Component, Fragment } from "react";
import List from "material-ui/List";
import { withRouter } from "react-router";
import ListSubheader from "material-ui/List/ListSubheader";
import ViewModule from "material-ui-icons/ViewModule";
import GroupAdd from "material-ui-icons/GroupAdd";
import SupervisorAccount from "material-ui-icons/SupervisorAccount";
import NoteAdd from "material-ui-icons/NoteAdd";
import LocalGroceryStore from "material-ui-icons/LocalGroceryStore";
import Assessment from "material-ui-icons/Assessment";
import LocalAtm from "material-ui-icons/LocalAtm";
import More from "material-ui-icons/More";
import SidebarMenu from "../../controls/SidebarMenu";

class Menus extends Component {
  state = {};

  isSelected = path =>
    this.props.history.location.pathname === `/${path}` ||
    this.props.history.location.pathname.includes(`/${path}/`);

  onMenuClick = route => {
    this.props.history.push(route);
  };

  render() {
    return (
      <Fragment>
        <List>
          <SidebarMenu
            isSelected={this.isSelected("sale")}
            onClick={() => this.onMenuClick("/sale")}
            text="Sale"
            icon={<ViewModule />}
          />

          <ListSubheader>MASTER</ListSubheader>

          <SidebarMenu
            isSelected={this.isSelected("customers")}
            onClick={() => this.onMenuClick("/customers")}
            text="Customers"
            icon={<GroupAdd />}
          />

          <SidebarMenu
            isSelected={this.isSelected("vendors")}
            onClick={() => this.onMenuClick("/vendors")}
            text="Vendors"
            icon={<SupervisorAccount />}
          />

          <SidebarMenu
            isSelected={
              this.isSelected("products") || this.isSelected("producttypes")
            }
            onClick={() => this.onMenuClick("/products")}
            text="Products"
            icon={<More />}
          />

          <SidebarMenu
            isSelected={
              this.isSelected("expense") || this.isSelected("expensetypes")
            }
            onClick={() => this.onMenuClick("/expense")}
            text="Expense"
            icon={<LocalAtm />}
          />

          <SidebarMenu
            isSelected={this.isSelected("receivings")}
            onClick={() => this.onMenuClick("/receivings")}
            text="Recievings"
            icon={<NoteAdd />}
          />

          <ListSubheader>REPORTS</ListSubheader>
          <SidebarMenu text="Todays Sales" icon={<Assessment />} />
          <SidebarMenu text="Credit Sale" icon={<LocalGroceryStore />} />
          <SidebarMenu text="Expense" icon={<LocalAtm />} />
        </List>
      </Fragment>
    );
  }
}

export default withRouter(Menus);
