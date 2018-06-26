import { openConnection } from "../persistence";
import { User, Role } from "../entity/User";
import { getManager } from "typeorm";
import { ProductType } from "../entity/ProductType";
import { Product } from "../entity/Product";
import { Customer } from "../entity/Customer";

const ADMIN_USER_ID = "admin";

export class Seed {
  public static async run() {
    await openConnection();
    await Seed.addUsers();
    await Seed.addProductTypes();
    await Seed.addProducts();
    await Seed.addCustomer();
  }

  private static async addCustomer() {
    const customer = new Customer();
    customer.id = "shan";
    customer.name = "shan sfk";
    customer.address = "my address";
    customer.description = "test customer";
    customer.email = "mail@mail.com";
    customer.mobile = "1234567899";
    customer.createdBy = "admin";
    customer.updatedBy = "admin";

    await getManager().insert(Customer, customer);
  }

  private static async addProducts() {
    const pen = new Product();
    pen.id = "pen";
    pen.name = "pen";
    pen.description = "awesome pen";
    pen.costPrice = 10;
    pen.sellingPrice = 20;
    pen.productTypeId = "stat";
    pen.createdBy = ADMIN_USER_ID;
    pen.updatedBy = ADMIN_USER_ID;

    await getManager().insert(Product, pen);

    const pencil = new Product();
    pencil.id = "pencil";
    pencil.description = "awesome pencil";
    pencil.name = "apsara pencil";
    pencil.costPrice = 5;
    pencil.sellingPrice = 10;
    pencil.productTypeId = "stat";
    pencil.createdBy = ADMIN_USER_ID;
    pencil.updatedBy = ADMIN_USER_ID;

    await getManager().insert(Product, pencil);

    const notebook = new Product();
    notebook.id = "notebook";
    notebook.description = "awesome notebook";
    notebook.name = "papermate notebook";
    notebook.costPrice = 50;
    notebook.sellingPrice = 70;
    notebook.productTypeId = "stat";
    notebook.createdBy = ADMIN_USER_ID;
    notebook.updatedBy = ADMIN_USER_ID;

    await getManager().insert(Product, notebook);
  }

  private static async addProductTypes() {
    const stat = new ProductType();
    stat.id = "stat";
    stat.description = "stationary items";
    stat.createdBy = ADMIN_USER_ID;
    stat.updatedBy = ADMIN_USER_ID;

    await getManager().insert(ProductType, stat);
  }

  private static async addUsers() {
    const admin = new User();
    admin.id = ADMIN_USER_ID;
    admin.name = ADMIN_USER_ID;
    admin.password = ADMIN_USER_ID;
    admin.role = Role.Admin;

    await getManager().insert(User, admin);
  }
}
