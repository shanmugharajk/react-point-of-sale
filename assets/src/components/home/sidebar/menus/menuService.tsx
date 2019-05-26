import React from "react";
import ViewModule from "@material-ui/icons/ViewModule";
import GroupAdd from "@material-ui/icons/GroupAdd";
import SupervisorAccount from "@material-ui/icons/SupervisorAccount";
import NoteAdd from "@material-ui/icons/NoteAdd";
import LocalGroceryStore from "@material-ui/icons/LocalGroceryStore";
import Assessment from "@material-ui/icons/Assessment";
import LocalAtm from "@material-ui/icons/LocalAtm";
import More from "@material-ui/icons/More";

const menuMapper: any = {
  sales: { name: "Sales", route: "/sales", icon: <ViewModule /> },
  customers: { name: "Customers", route: "/customers", icon: <GroupAdd /> },
  vendors: { name: "Vendors", route: "/vendors", icon: <SupervisorAccount /> },
  products: {
    name: "Products",
    paths: ["/products", "/product-types"],
    route: "/products",
    icon: <More />
  },
  expenses: { name: "Expenses", route: "/expenses", icon: <LocalAtm /> },
  receivings: { name: "Receivings", route: "/receivings", icon: <NoteAdd /> },
  "todays-sales": {
    name: "Today's Sales",
    route: "/todays-sales",
    icon: <Assessment />
  },
  "credit-sales": {
    name: "Credit Sales",
    route: "/credit-sales",
    icon: <LocalGroceryStore />
  }
};

const fetchMenus = () => {
  // TODO: Fetch from apis based on role.
  const menus: any = {
    sales: "sales",
    master: ["customers", "products", "expenses", "vendors", "receivings"],
    reports: ["todays-sales", "credit-sales"]
  };

  const toReturn: any = {};

  for (const key in menus) {
    if (Array.isArray(menus[key]) === false) {
      toReturn[key] = menuMapper[key];
    } else {
      toReturn[key] = menus[key].map((o: any) => menuMapper[o]);
    }
  }

  return toReturn;
};

export default { fetchMenus };
