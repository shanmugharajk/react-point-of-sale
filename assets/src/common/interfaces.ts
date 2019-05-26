export interface IFormData {
  data: any;
  errors: any;
}

interface IPagination {
  page_number: number;
  page_size: number;
  total_pages: number;
  total_rows: number;
}

export interface IApiResult {
  data: Array<any>;
  pagination_info: IPagination;
}
