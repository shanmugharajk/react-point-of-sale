import React, { useState, ChangeEvent, useEffect } from "react";
import equal from "fast-deep-equal";
import { withRouter, RouteComponentProps } from "react-router";
import { makeStyles } from "@material-ui/styles";
import Container from "../../../components/controls/container/InnerContainer";
import useApi, { RequestType } from "../../../hooks/useApi";
import productsService from "../productsService";
import Prompt from "../../../components/controls/dialog/Prompt";
import CircularLoader from "../../../components/controls/loader/CircularLoader";
import Form from "../../../components/controls/form/Form";
import AutoCloseMessage from "../../../components/controls/messages/AutoCloseMessage";
import CustomTextField from "../../../components/controls/textfields/CustomTextField";
import CustomNumberTextField from "../../../components/controls/textfields/CustomNumberTextField";
import { IFormData, IApiResult } from "../../../common/interfaces";
import { isValueExists } from "../../../libs/utils";
import styles from "./productForm.style";
import AutosuggestSelect from "../../../components/controls/autosuggestSelect/AutosuggestSelect";
import { ValueType } from "react-select/lib/types";
import { OptionType } from "../../../components/controls/autosuggestSelect/types";

interface IProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const initialFormData = {
  data: {
    id: "",
    name: "",
    description: "",
    cost_price: "",
    selling_price: "",
    productTypeSelectedItem: "",
    product_type_id: ""
  },
  errors: {}
};

const normalizeData = (productTypes: IApiResult) => {
  if (!productTypes || !productTypes.data) {
    return [];
  }

  return productTypes.data.map((o: any) => ({
    value: o.id,
    label: o.id
  }));
};

const loadData = (params: { id: string }) => {
  let [loading, productTypes, error] = useApi(
    productsService.productTypes.urls.fetchAll()
  );

  const { id } = params;

  if (error || !id) {
    return [loading, productTypes, null, error];
  }

  let productToEdit;
  [loading, productToEdit, error] = useApi(
    productsService.products.urls.fetchAll()
  );

  return [loading, productTypes, productToEdit, error];
};

const ProductForm = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const { id } = props.match.params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [message, setMessage] = useState("");
  const [productTypes, setProductTypes] = useState();
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isError, setIsError] = useState(false);

  // === EFFECTS - START ===

  // Fetch all productTyeps for the dropdown
  const [
    productTypesListLoading,
    productTypesList,
    productTypesListError
  ] = useApi(productsService.productTypes.urls.fetchAll());

  useEffect(() => {
    const res = normalizeData(productTypesList);
    if (res.length > 0) {
      setProductTypes(res);
    }
  }, [productTypesList]);

  // If its a edit fetch the data and update the state.
  const [productToEditLoading, productToEdit, productToEditError] = useApi(
    productsService.products.urls.fetchById(id),
    RequestType.GET,
    !!id
  );

  // To update the form with the details to edit.
  useEffect(() => {
    if (!isEdit) {
      return;
    }
    setFormData({
      data: {
        ...productToEdit.data,
        productTypeSelectedItem: {
          label: productToEdit.data.product_type_id,
          value: productToEdit.data.product_type_id
        }
      },
      errors: {}
    });
  }, [productToEdit && productToEdit.data.id]);

  // To update the loading in localstate accordingly
  useEffect(() => {
    setLoading(productTypesListLoading || productToEditLoading);
  }, [productTypesListLoading, productToEditLoading]);

  // === EFFECTS - END ===

  const { data, errors } = formData;
  const isEdit = !!productToEdit;

  let idRef: any;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const { data, errors } = formData;
    setFormData({
      data: { ...data, [name]: value },
      errors: { ...errors, [name]: "" }
    });
  };

  const onProductTypeDropdownChange = (value: ValueType<OptionType>) => {
    const productTypeSelectedItem = value === null ? "" : value;
    const { data, errors } = formData;

    setFormData({
      data: {
        ...data,
        productTypeSelectedItem,
        product_type_id: (productTypeSelectedItem as OptionType).value
      },
      errors: { ...errors, product_type_id: "" }
    });
  };

  const onMessageDialogCloseClick = () => {
    setShowMessageDialog(false);
    props.history.goBack();
  };

  const clearForm = () => {
    setFormData(initialFormData);
    setMessage("");
    setIsError(false);

    if (idRef) {
      idRef.focus();
    }
  };

  const onMessageCloseClick = () => {
    setMessage("");
  };

  const onSubmit = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const errors = isValueExists(formData.data);

    if (Object.keys(errors).length > 0) {
      setFormData({ data: { ...formData.data }, errors });
      return;
    }

    try {
      data.cost_price = Number(data.cost_price);
      data.selling_price = Number(data.selling_price);

      if (isEdit === false) {
        await createNew();
      } else {
        await update();
      }
    } catch (error) {
      let message = error && error.message;
      if (!message) {
        message = "Error in saving the details";
      }
      setMessage(message);
      setIsError(true);
    }
  };

  const createNew = async () => {
    const toSubmit = { ...data };
    delete toSubmit.productTypeSelectedItem;

    const res = await productsService.products.services.createNew(toSubmit);

    if (res.status === 200) {
      clearForm();
      setMessage("Saved successfully");
    } else {
      throw new Error(
        `Unable to create the record. The status code is ${res.status}`
      );
    }
  };

  const update = async () => {
    const res = await productsService.products.services.update(
      props.match.params.id,
      data
    );
    if (res.status === 200) {
      clearForm();
      setShowMessageDialog(true);
    } else {
      throw new Error(`Unable to update. The status code is ${res.status}`);
    }
  };

  const onCancel = () => {
    if (isEdit) {
      props.history.goBack();
      return;
    }

    const isDirty = !equal(initialFormData, formData);

    if (isDirty === true) {
      clearForm();
      return;
    }

    props.history.goBack();
  };

  return (
    <Container title={isEdit ? "Edit Product" : "New Product"}>
      <Prompt
        message="The product was updated successfully"
        open={showMessageDialog}
        handleClose={onMessageDialogCloseClick}
      />
      <CircularLoader isLoading={loading} />
      <AutoCloseMessage
        title="Message"
        message={message}
        show={!!message}
        isError={isError}
        onCloseClick={onMessageCloseClick}
      />
      <Form id="product" onSubmit={onSubmit} onCancel={onCancel}>
        <CustomTextField
          inputRef={input => {
            idRef = input;
          }}
          error={!!errors.id}
          name="id"
          value={data.id}
          label="Product Id"
          helperText="This should be unique"
          onChange={onChange}
          disabled={isEdit}
        />

        <AutosuggestSelect
          label="Product type"
          suggestions={productTypes}
          value={data.productTypeSelectedItem}
          onChange={onProductTypeDropdownChange}
          error={!!errors.product_type_id}
        />

        <CustomTextField
          error={!!errors.name}
          name="name"
          value={data.name}
          label="Name"
          onChange={onChange}
        />

        <CustomTextField
          error={!!errors.description}
          name="description"
          value={data.description}
          label="Description"
          onChange={onChange}
        />

        <CustomNumberTextField
          error={!!errors.cost_price}
          name="cost_price"
          value={data.cost_price}
          label="Cost price"
          onChange={onChange}
        />

        <CustomNumberTextField
          error={!!errors.selling_price}
          name="selling_price"
          value={data.selling_price}
          label="Selling price"
          onChange={onChange}
        />
      </Form>
    </Container>
  );
};

export default withRouter(ProductForm);
