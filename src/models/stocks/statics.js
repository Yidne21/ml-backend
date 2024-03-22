import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

export async function filterStock({
  sortBy = 'expiredDate',
  sortOrder,
  drugId,
  page = 1,
  limit = 10,
}) {
  const StockModel = this.model(modelNames.stock);
  const pipeline = [
    {
      $match: {
        ...(drugId && {
          drugId: mongoose.Types.ObjectId(drugId),
        }),
      },
    },
    {
      $sort: {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
      },
    },
    ...paginationPipeline(page, limit),
  ];

  const stocks = StockModel.aggregate(pipeline);

  return stocks[0];
}

export async function createStock(stock) {
  const StockModel = this.model(modelNames.stock);
  const newStock = await StockModel.create(stock);
  return newStock;
}

export async function stockDetails(stockId) {
  const StockModel = this.model(modelNames.stock);
  const stock = await StockModel.findById(stockId);
  if (!stock) {
    throw new APIError({
      message: 'Stock not found',
      status: httpStatus.NOT_FOUND,
    });
  }
  return stock;
}

export async function updateStock(stockId, updateBody) {
  const StockModel = this.model(modelNames.stock);
  const stock = await StockModel.findById(stockId);
  if (!stock) {
    throw new APIError({
      message: 'Stock not found',
      status: httpStatus.NOT_FOUND,
    });
  }
  Object.assign(stock, updateBody);
  await stock.save();
  return stock;
}

export async function deleteStock(stockId) {
  const StockModel = this.model(modelNames.stock);
  const stock = await StockModel.findByIdAndDelete(stockId);
  if (!stock) {
    throw new APIError({
      message: 'Stock not found',
      status: httpStatus.NOT_FOUND,
    });
  }
  return { message: 'Stock deleted successfully' };
}
