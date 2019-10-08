import { Expense } from "../../entity/Expense";
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

@JsonController("/expenses")
@Authorized()
export class ExpensesController {
  private crudServices: CrudServices<Expense>;

  constructor() {
    this.crudServices = new CrudServices<Expense>();
    this.crudServices.setEntity(Expense);
  }

  @Get("/:id")
  public async getExpenseById(@Param("id") id: string): Promise<any> {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  @Get()
  public async getExpenses(
    @PaginationInfo() paginationInfo: IPaginationQueryParam,
    @QueryParam("q") search?: string
  ): Promise<Expense[]> {
    const query: IFetchPageQuery = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  @Post()
  public async createNewExpense(
    @Body() Expense: Expense,
    @CurrentUser() userid: string
  ): Promise<any> {
    return await this.crudServices.create(userid, Expense);
  }

  @Put("/:id")
  public async updateExpense(
    @Param("id") id: string,
    @Body() data: Expense,
    @CurrentUser() userid: string
  ) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  @Delete("/:id")
  public async deleteExpense(@Param("id") id: string): Promise<any> {
    return await this.crudServices.deleteById(id);
  }
}
