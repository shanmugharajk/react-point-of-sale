import { Product } from "../../entity/Product";
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

@JsonController("/products")
@Authorized()
export class ProductsController {
  private crudServices: CrudServices<Product>;

  constructor() {
    this.crudServices = new CrudServices<Product>();
    this.crudServices.setEntity(Product);
  }

  @Get("/:id")
  public async getProductById(@Param("id") id: string): Promise<any> {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  @Get()
  public async getProducts(
    @PaginationInfo() paginationInfo: IPaginationQueryParam,
    @QueryParam("q") search?: string
  ): Promise<Product[]> {
    const query: IFetchPageQuery = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  @Post()
  public async createNewProduct(
    @Body() product: Product,
    @CurrentUser() userid: string
  ): Promise<any> {
    return await this.crudServices.create(userid, product);
  }

  @Put("/:id")
  public async updateProduct(
    @Param("id") id: string,
    @Body() data: Product,
    @CurrentUser() userid: string
  ) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  @Delete("/:id")
  public async deleteProduct(@Param("id") id: string): Promise<any> {
    return await this.crudServices.deleteById(id);
  }
}
