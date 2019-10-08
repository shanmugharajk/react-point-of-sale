import { ExpenseType } from "../../entity/ExpenseType";
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

@JsonController("/expenseTypes")
@Authorized()
export class EpenseTypesController {
  private crudServices: CrudServices<ExpenseType>;

  constructor() {
    this.crudServices = new CrudServices<ExpenseType>();
    this.crudServices.setEntity(ExpenseType);
  }

  @Get("/all/items")
  public async getAllEpenseTypes(): Promise<ExpenseType[]> {
    return await this.crudServices.fetchAll();
  }

  @Get("/:id")
  public async getExpenseTypeById(@Param("id") id: string): Promise<any> {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  @Get()
  public async getEpenseTypes(
    @PaginationInfo() paginationInfo: IPaginationQueryParam,
    @QueryParam("q") search?: string
  ): Promise<ExpenseType[]> {
    const query: IFetchPageQuery = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  @Post()
  public async createNewExpenseType(
    @Body() ExpenseType: ExpenseType,
    @CurrentUser() userid: string
  ): Promise<any> {
    return await this.crudServices.create(userid, ExpenseType);
  }

  @Put("/:id")
  public async updateExpenseType(
    @Param("id") id: string,
    @Body() data: ExpenseType,
    @CurrentUser() userid: string
  ) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  @Delete("/:id")
  public async deleteExpenseType(@Param("id") id: string): Promise<any> {
    return await this.crudServices.deleteById(id);
  }
}
