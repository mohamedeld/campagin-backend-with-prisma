// src/utils/pagination.js

export const paginate = async (model, page = 1, limit = 10) => {
  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);

  if (isNaN(pageNumber) || isNaN(pageSize) || pageNumber < 1 || pageSize < 1) {
    throw new Error('Invalid pagination parameters');
  }

  const skip = (pageNumber - 1) * pageSize;
  const [items, totalItems] = await Promise.all([
    model.findMany({ skip, take: pageSize }),
    model.count(),
  ]);

  return {
    items,
    total: totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    currentPage: pageNumber,
  };
};