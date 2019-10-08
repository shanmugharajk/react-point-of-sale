import { User } from "../../entity/User";
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
import { Role } from "../../entity/User";
import { CurrentUser } from "../../decorators/CurrentUser";

@JsonController("/users")
@Authorized(Role.Admin)
export class UsersController {
  private crudServices: CrudServices<User>;

  constructor() {
    this.crudServices = new CrudServices<User>();
    this.crudServices.setEntity(User);
  }

  @Get("/:id")
  public async getUserById(@Param("id") id: string): Promise<any> {
    const res = await this.crudServices.fetchById(id);
    return res || {};
  }

  @Get()
  public async getUsers(
    @PaginationInfo() paginationInfo: IPaginationQueryParam,
    @QueryParam("q") search?: string
  ): Promise<User[]> {
    const query: IFetchPageQuery = {
      search,
      perPage: paginationInfo.perPage,
      page: paginationInfo.pageNo
    };
    return await this.crudServices.fetchPages(query);
  }

  @Post()
  public async createNewUser(
    @Body() User: User,
    @CurrentUser() userid: string
  ): Promise<any> {
    return await this.crudServices.create(userid, User);
  }

  @Put("/:id")
  public async updateUser(
    @Param("id") id: string,
    @Body() data: User,
    @CurrentUser() userid: string
  ) {
    return await this.crudServices.updateById(userid, { id }, data);
  }

  @Delete("/:id")
  public async deleteUser(@Param("id") id: string): Promise<any> {
    return await this.crudServices.deleteById(id);
  }
}
