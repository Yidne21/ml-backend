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

  try {
    const stocks = await StockModel.aggregate(pipeline);

    return stocks[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function createStock(stock) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const StockModel = this.model(modelNames.stock);
  const DrugModel = this.model(modelNames.drug);
  try {
    const newStock = await StockModel.create(stock);
    await DrugModel.findByIdAndUpdate(stock.drugId, {
      $inc: { stockLevel: stock.quantity },
    });
    await session.commitTransaction();
    return newStock;
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  } finally {
    session.endSession();
  }
}

export async function stockDetails(stockId) {
  const StockModel = this.model(modelNames.stock);
  try {
    const stock = await StockModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(stockId),
        },
      },
      {
        $project: {
          price: 1,
          cost: 1,
          expiredDate: 1,
          recievedFrom: 1,
          batchNumber: 1,
          quantity: 1,
        },
      },
    ]);
    if (!stock) {
      throw new APIError({
        message: 'Stock not found',
        status: httpStatus.NOT_FOUND,
      });
    }
    return stock;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function updateStock(stockId, updateBody) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const StockModel = this.model(modelNames.stock);
  const DrugModel = this.model(modelNames.drug);
  try {
    const stock = await StockModel.findById(stockId);
    if (!stock) {
      throw new APIError({
        message: 'Stock not found',
        status: httpStatus.NOT_FOUND,
      });
    }
    const updatedStock = {
      price: updateBody.price || stock.price,
      cost: updateBody.cost || stock.cost,
      recievedFrom: updateBody.recievedFrom || stock.recievedFrom,
      expiredDate: updateBody.expiredDate || stock.expiredDate,
      batchNumber: updateBody.batchNumber || stock.batchNumber,
      quantity: stock.quantity + updateBody.quantity || stock.quantity,
    };
    const updatedStockDoc = await StockModel.findByIdAndUpdate(
      stockId,
      updatedStock,
      {
        new: true,
      }
    );
    if (updateBody.quantity) {
      const drug = await DrugModel.findByIdAndUpdate(stock.drugId, {
        $inc: { stockLevel: updateBody.quantity },
      });
      if (!drug) {
        throw new APIError({
          message: 'Drug not found',
          status: httpStatus.NOT_FOUND,
        });
      }
    }
    await session.commitTransaction();
    return { message: 'Stock updated successfully', updatedStockDoc };
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  } finally {
    session.endSession();
  }
}

export async function deleteStock(stockId) {
  const session = await mongoose.startSession();
  session.startTransaction();
  const DrugModel = this.model(modelNames.drug);
  const StockModel = this.model(modelNames.stock);
  try {
    const stock = await StockModel.findByIdAndDelete(stockId);
    if (!stock) {
      throw new APIError({
        message: 'Stock not found',
        status: httpStatus.NOT_FOUND,
      });
    }
    console.log(stock.drugId, stock.quantity);
    const drug = await DrugModel.findByIdAndUpdate(stock.drugId, {
      $inc: { stockLevel: -stock.quantity },
    });
    if (!drug) {
      throw new APIError({
        message: 'Drug not found',
        status: httpStatus.NOT_FOUND,
      });
    }
    await session.commitTransaction();
    return { message: 'Stock deleted successfully' };
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  } finally {
    session.endSession();
  }
}
