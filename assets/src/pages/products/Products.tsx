import React, { useState } from "react";

import { RouteComponentProps, withRouter } from "react-router";

import CustomTabs from "../../components/controls/customTabs/CustomTabs";
import TabContainer from "../../components/controls/customTabs/TabContainer";
import AsyncDataGrid from "../../components/controls/datagrid/AysncDataGrid";
import ProductTab from "./productTab/ProductTab";

interface IProps extends RouteComponentProps<any> {}

const Products = (props: IProps) => {
  const [tabIndex, setTabIndex]: [any, any] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, value: any) => {
    setTabIndex(value);

    if (value === 0) {
      props.history.push("/products");
    } else {
      props.history.push("/product-types");
    }
  };

  const renderProductTab = () => {
    return (
      tabIndex == 0 && (
        <TabContainer>
          <ProductTab />
        </TabContainer>
      )
    );
  };

  const renderProductTypeTab = () => {
    return tabIndex == 1 && <TabContainer>ProductTypes</TabContainer>;
  };

  return (
    <div>
      <CustomTabs
        onChange={handleChange}
        value={tabIndex}
        items={["Products", "Product Types"]}
      />
      {renderProductTab()}
      {renderProductTypeTab()}
    </div>
  );
};

export default withRouter(Products);
