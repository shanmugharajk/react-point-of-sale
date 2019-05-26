import serviceBuilder from "../../libs/serviceBuilder";

const productsService = {
  products: serviceBuilder("products"),
  productTypes: serviceBuilder("product-types")
};

export default productsService;
