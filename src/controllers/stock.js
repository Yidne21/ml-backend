import httpStatus from 'http-status';
import Stock from '../models/stocks';

export const addStockController = async (req, res, next) => {
  const { drugId } = req.params;
  const { price, cost, recievedFrom, expiredDate, batchNumber, quantity } =
    req.body;

  const stockData = {
    drugId,
    price,
    cost,
    recievedFrom,
    expiredDate,
    batchNumber,
    quantity,
    currentQuantity: quantity,
  };

  try {
    const stock = await Stock.createStock(stockData);
    res.status(httpStatus.CREATED).json(stock);
  } catch (error) {
    next(error);
  }
};

export const getStocksController = async (req, res, next) => {
  const { drugId } = req.params;
  const { page, limit, sortBy, sortOrder } = req.query;

  try {
    const stocks = await Stock.filterStock({
      drugId,
      page,
      limit,
      sortBy,
      sortOrder,
    });
    res.status(httpStatus.OK).json(stocks);
  } catch (error) {
    next(error);
  }
};

export const updateStockController = async (req, res, next) => {
  const { stockId } = req.params;
  const { price, cost, recievedFrom, expiredDate, batchNumber, quantity } =
    req.body;

  const stockData = {
    price,
    cost,
    recievedFrom,
    expiredDate,
    batchNumber,
    quantity,
    currentQuantity: quantity,
  };

  try {
    const stock = await Stock.updateStock(stockId, stockData);
    res.status(httpStatus.OK).json(stock);
  } catch (error) {
    next(error);
  }
};

export const deleteStockController = async (req, res, next) => {
  const { stockId } = req.params;

  try {
    const message = await Stock.deleteStock(stockId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};
