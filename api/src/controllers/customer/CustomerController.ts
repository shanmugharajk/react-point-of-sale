import { Customer } from "../../entity/Customer";
import {
  Get,
  Post,
  Body,
  JsonController,
  Authorized,
  QueryParam,
  Param,
  Put,
  Delete
} from "routing-controllers";
import {
  PaginationInfo,
  IPaginationQueryParam
} from "../../decorators/PaginationInfo";
import { CrudServices, IFetchPageQuery } from "../../services/CrudServices";
import { CurrentUser } from "../../decorators/CurrentUser";

@JsonController("/customers")
@Authorized()
export class CustomersController {
  private crudServices: CrudServices<Customer>;

  constructor() {
    this.crudServices = new CrudServices<Customer>();
    this.crudServices.setEntity(Customer);
  }

  @Get("/:id")
  public async getCustomerById(@Param("id") id: string): Promise<any> {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  @Get()
  public async getCustomers(
    @PaginationInfo() paginationInfo: IPaginationQueryParam,
    @QueryParam("q") search?: string
  ): Promise<Customer[]> {
    const query: IFetchPageQuery = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  @Post()
  public async createNewCustomer(
    @Body() Customer: Customer,
    @CurrentUser() userid: string
  ): Promise<any> {
    return await this.crudServices.create(userid, Customer);
  }

  @Put("/:id")
  public async updateCustomer(
    @Param("id") id: string,
    @Body() data: Customer,
    @CurrentUser() userid: string
  ) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  @Delete("/:id")
  public async deleteCustomer(@Param("id") id: string): Promise<any> {
    return await this.crudServices.deleteById(id);
  }
}
