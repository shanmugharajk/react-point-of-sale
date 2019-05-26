import React, { useState, ChangeEvent, useEffect } from "react";
import equal from "fast-deep-equal";
import { withRouter, RouteComponentProps } from "react-router";
import { makeStyles } from "@material-ui/styles";
import Container from "../../components/controls/container/InnerContainer";
import useApi from "../../hooks/useApi";
import productsService from "./productsService";
import Prompt from "../../components/controls/dialog/Prompt";
import CircularLoader from "../../components/controls/loader/CircularLoader";
import Form from "../../components/controls/form/Form";
import AutoCloseMessage from "../../components/controls/messages/AutoCloseMessage";
import CustomTextField from "../../components/controls/textfields/CustomTextField";
import CustomNumberTextField from "../../components/controls/textfields/CustomNumberTextField";
import { IFormData, IApiResult } from "../../common/interfaces";
import { isValueExists } from "../../libs/utils";
import styles from "./productForm.style";
import AutosuggestSelect from "../../components/controls/autosuggestSelect/AutosuggestSelect";
import { ValueType } from "react-select/lib/types";
import { OptionType } from "../../components/controls/autosuggestSelect/types";

interface IProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const initialFormData = {
  data: {
    id: "",
    name: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    productTypeId: ""
  },
  errors: {}
};

const loadData = (params: { id: string }) => {
  let [loading, productTypeId, error] = useApi(
    productsService.productTypes.urls.fetchAll()
  );

  const { id } = params;

  if (error || !id) {
    return [loading, productTypeId, null, error];
  }

  let productToEdit;
  [loading, productToEdit, error] = useApi(
    productsService.products.urls.fetchAll()
  );

  return [loading, productTypeId, productToEdit, error];
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

const ProductForm = (props: IProps) => {
  const useStyles = makeStyles(styles);
  const classes = useStyles();

  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [message, setMessage] = useState("");
  const [productTypes, setProductTypes] = useState();
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [isError, setIsError] = useState(false);

  let [loading, productTypeIds, productToEdit, error]: Array<any> = loadData(
    props.match.params
  );

  useEffect(() => {
    const res = normalizeData(productTypeIds);
    if (res.length > 0) {
      setProductTypes(res);
    }
  }, [productTypeIds]);

  const { data, errors } = formData;
  const isEdit = !!productToEdit;

  if (isEdit) {
    // TODO: Do the edit here.
  }

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
    const productTypeId = value === null ? "" : value;
    const { data, errors } = formData;

    setFormData({
      data: { ...data, productTypeId },
      errors: { ...errors, productTypeId: "" }
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

  const showMessage = (message: string) => {
    setMessage(message);
  };

  const onSubmit = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const errors = isValueExists(formData.data);

    if (Object.keys(errors).length > 0) {
      setFormData({ data: { ...formData.data }, errors });
      return;
    }

    try {
      data.costPrice = Number(data.costPrice);
      data.sellingPrice = Number(data.sellingPrice);

      if (isEdit === false) {
        await createNew();
      } else {
        await update();
      }
    } catch (error) {
      setMessage(error);
      setIsError(true);
    }
  };

  const createNew = async () => {
    const res = await productsService.products.services.createNew(data);

    if (res.status === 200) {
      showMessage("Saved successfully");
      clearForm();
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
    } else {
      throw new Error(`Unable to update. The status code is ${res.status}`);
    }
  };

  const onCancel = () => {
    const isDirty = !equal(initialFormData, formData);

    if (isDirty === true) {
      clearForm();
      return;
    }

    props.history.goBack();
  };

  return (
    <Container>
      <Prompt
        message="The product was saved successfully"
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
          value={data.productTypeId}
          onChange={onProductTypeDropdownChange}
          error={!!errors.productTypeId}
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
          error={!!errors.costPrice}
          name="costPrice"
          value={data.costPrice}
          label="Cost price"
          onChange={onChange}
        />

        <CustomNumberTextField
          error={!!errors.sellingPrice}
          name="sellingPrice"
          value={data.sellingPrice}
          label="Selling price"
          onChange={onChange}
        />
      </Form>
    </Container>
  );
};

export default withRouter(ProductForm);
