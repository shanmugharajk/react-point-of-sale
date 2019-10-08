import { createParamDecorator } from "routing-controllers";

export interface IPaginationQueryParam {
  perPage: number;
  pageNo: number;
}

export function PaginationInfo() {
  return createParamDecorator({
    value: action => {
      const perPage = action.request.query["per_page"] || 50;
      const pageNo = action.request.query["page"] || 1;

      const info: IPaginationQueryParam = {
        perPage,
        pageNo
      };

      return info;
    }
  });
}
