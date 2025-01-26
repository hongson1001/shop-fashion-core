import moment from 'moment-timezone';

export interface IResponseData<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

// Class dữ liệu phân trang
export class PaginationSet<T> {
  page: number; // Trang hiện tại
  pageSize: number; // Số dữ liệu trên mỗi trang
  totalItems: number; // Tổng số dữ liệu
  totalPages: number; // Tổng số trang (tính toán)
  hasNextPage: boolean; // Có trang tiếp theo không
  hasPreviousPage: boolean; // Có trang trước đó không
  data: T[]; // Dữ liệu của trang hiện tại

  constructor(data: T[], totalItems: number, page: number, pageSize: number) {
    this.totalItems = totalItems;
    this.page = page;
    this.pageSize = pageSize;

    //Tính toán số trang
    this.totalPages = Math.ceil(totalItems / pageSize);

    //Xác định có trang trước hay trang tiếp theo hay không
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;

    this.data = data;
  }
}

// Class response trả dữ liệu thành công
export class ResponseContentModel<T> {
  statusCode: number;
  message: string;
  data: T | T[] | PaginationSet<T> | null;
  timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    data: T | T[] | PaginationSet<T> | null,
    timeZone: string = 'Asia/Ho_Chi_Minh',
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    this.data = data;
  }
}

export class ErrorResponseModel {
  statusCode: number;
  message: string;
  errors: string[] | Record<string, any>;
  timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    errors: string[] | Record<string, any>,
    timeZone: string = 'Asia/Ho_Chi_Minh',
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
    this.errors = errors;
  }
}
