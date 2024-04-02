import { Worker } from 'worker_threads';
import httpStatus from 'http-status';
import Order from '../models/orders';

function chunkify(orders, n) {
  const orderChunks = [];
  for (let i = n; i > 0; i -= 1) {
    orderChunks.push(orders.splice(0, Math.ceil(orders.length / i)));
  }
  return orderChunks;
}

async function updateOrders(orders, conCurrentWorker, status) {
  const chunks = chunkify(orders, conCurrentWorker);
  const workerPromises = [];
  const updatedOrders = [];

  chunks.forEach((orderChunk, workerNo) => {
    const worker = new Worker('./src/utils/UpdateOrderThread.mjs', {
      workerData: {
        orderChunk: orderChunk.map((order) => ({
          ...order,
          _id: order._id.toString(),
        })),
        status,
        workerNo,
      },
    });

    const workerPromise = new Promise((resolve, reject) => {
      worker.on('message', (updatedChunk) => {
        resolve(updatedChunk); // Resolve with updated chunk
        updatedOrders.push(...updatedChunk);
      });
      worker.on('error', (err) => {
        reject(err); // Reject if there's an error in the worker thread
      });
    });

    workerPromises.push(workerPromise);
  });

  // Wait for all promises to resolve
  await Promise.all(workerPromises);

  return updatedOrders;
}

// with out using thread
export const updateOrderStatus = async (req, res, next) => {
  const { orderIds, status } = req.body;
  try {
    const orders = await Order.find(
      { _id: { $in: orderIds } },
      {
        _id: 1,
        status: 1,
      }
    )
      .lean()
      .exec();
    const startTime = performance.now();
    const updatedOrders = orders.map((order) => {
      // eslint-disable-next-line no-param-reassign
      order.status = status;
      return order;
    });

    await Order.bulkWrite(
      updatedOrders.map((order) => ({
        updateOne: {
          filter: { _id: order._id },
          update: { status: order.status },
        },
      }))
    );
    const endTime = performance.now();

    const timeTaken = endTime - startTime;
    console.log(
      `time taken with out using thread: ${timeTaken / 1000} seconds`
    );
    res.status(httpStatus.OK).json(updatedOrders);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// using thread
export const updateOrderStatusUsingWorkerThread = async (req, res, next) => {
  const { orderIds, status } = req.body;
  try {
    const orders = await Order.find(
      { _id: { $in: orderIds } },
      {
        _id: 1,
        status: 1,
      }
    )
      .lean()
      .exec();
    const startTime = performance.now();
    const updatedOrders = await updateOrders(orders, 4, status);

    await Order.bulkWrite(
      updatedOrders.map((order) => ({
        updateOne: {
          filter: { _id: order._id },
          update: { status: order.status },
        },
      }))
    );
    const endTime = performance.now();

    const timeTaken = endTime - startTime;
    console.log(`time taken using 4 thread: ${timeTaken / 1000} seconds`);
    res.status(httpStatus.OK).json(updatedOrders);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
