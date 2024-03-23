import httpStatus from 'http-status';
import Order from '../models/orders';

export const createOrderController = async (req, res, next) => {
  const { orderTo, orderedBy, deliveryAddress, drugId, deliveryDate } =
    req.body;
  const data = {
    orderTo,
    orderedBy,
    deliveryAddress,
    drugId,
    deliveryDate,
  };
  try {
    const order = await Order.createOrder(data);
    res.status(httpStatus.CREATED).json(order);
  } catch (error) {
    next(error);
  }
}; // after a successful payment
export const orderDetailController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await Order.getOrder(orderId);
    res.status(httpStatus.OK).json(order);
  } catch (error) {
    next(error);
  }
};
export const filterOrderController = async (req, res, next) => {
  const {
    customerId,
    pharmacyId,
    customerName,
    customerEmail,
    pharmacyName,
    pharmacyEmail,
    sortBy,
    sortOrder,
    status,
    page,
    limit,
  } = req.query;

  const filter = {
    customerId,
    pharmacyId,
    customerName,
    customerEmail,
    pharmacyName,
    pharmacyEmail,
    sortBy,
    sortOrder,
    status,
    page,
    limit,
  };
  try {
    const orders = await Order.filterOrders(filter);
    res.status(httpStatus.OK).json(orders);
  } catch (error) {
    next(error);
  }
};
export const confirmOrderDeliveryController = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const message = await Order.confirmDelivery(orderId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
}; // after delivery

export const cancelOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  const { bank, accountName, accountNumber } = req.body;
  const bankDetails = {
    bank,
    accountName,
    accountNumber,
  };
  try {
    const message = await Order.cancelOrder(orderId, bankDetails);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};
