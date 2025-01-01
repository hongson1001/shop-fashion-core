export interface IResponseData {
  statusCode: number;
  message: string;
  data: any;
}

export class PaginationSet<T> {
  page: number; // Trang hiện tại
  pageSize: number; // Số mục trên mỗi trang
  totalItems: number; // Tổng số mục
  totalPages: number; // Tổng số trang (tính toán)
  hasNextPage: boolean; // Có trang tiếp theo không
  hasPreviousPage: boolean; // Có trang trước đó không
  data: T[]; // Dữ liệu của trang hiện tại

  constructor(data: T[], totalItems: number, page: number, pageSize: number) {
    this.totalItems = totalItems;
    this.page = page;

    // Tính toán tổng số trang
    this.totalPages = Math.ceil(totalItems / pageSize);

    // Xác định xem có trang tiếp theo hoặc trước đó không
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
    this.pageSize = pageSize;

    this.data = data;
  }
}

export class ResponseContentModel<T> {
  statusCode: number;
  message: string;
  data: T | null;

  constructor(statusCode: number, message: string, data: T | null = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class ResponseMultiContentModels<T> {
  statusCode: number;
  message: string;
  data: T[];

  constructor(statusCode: number, message: string, data: T[] = []) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponseModel extends ResponseContentModel<null> {
  errors: string[];

  constructor(statusCode: number, message: string, errors: string[]) {
    super(statusCode, message, null);
    this.errors = errors;
  }
}
