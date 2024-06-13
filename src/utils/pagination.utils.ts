export class Pagination {
  static pagination(pageNumber?: number, limitNumber?: number) {
    const page = pageNumber || 1;
    const limit = limitNumber || 10;
    const skip = (page - 1) * limit;

    return {
      take: limit,
      skip,
    };
  }
}
