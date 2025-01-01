const genStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Dang kích hoạt';
    case 'unactive':
      return 'Chưa kích hoạt';
    case 'deleted':
      return 'Đã bị xoá';
    case 'blocked':
      return 'Đã bị khoá';
    default:
      return 'Không xác định';
  }
};

export { genStatusLabel };
