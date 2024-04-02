import httpStatus from 'http-status';
import { Worker } from 'worker_threads';
import Transaction from '../models/transactions';

function chunkify(transactions, n) {
  const transactionChunks = [];
  for (let i = n; i > 0; i -= 1) {
    transactionChunks.push(
      transactions.splice(0, Math.ceil(transactions.length / i))
    );
  }
  return transactionChunks;
}

async function updateTransactions(transactions, conCurrentWorker, status) {
  const chunks = chunkify(transactions, conCurrentWorker);
  const workerPromises = [];
  const updatedTransactions = [];

  chunks.forEach((transactionChunk, workerNo) => {
    const worker = new Worker('./src/utils/updateTransactionThread.mjs', {
      workerData: {
        transactionChunk: transactionChunk.map((transaction) => ({
          ...transaction,
          _id: transaction._id.toString(),
        })),
        status,
        workerNo,
      },
    });

    const workerPromise = new Promise((resolve, reject) => {
      worker.on('message', (updatedChunk) => {
        resolve(updatedChunk); // Resolve with updated chunk
        updatedTransactions.push(...updatedChunk);
      });
      worker.on('error', (err) => {
        reject(err); // Reject if there's an error in the worker thread
      });
    });

    workerPromises.push(workerPromise);
  });

  await Promise.all(workerPromises);

  return updatedTransactions;
}

// with out using thread
export const updateTransactionStatus = async (req, res, next) => {
  const { transactionIds, status } = req.body;
  try {
    const transactions = await Transaction.find(
      {
        _id: { $in: transactionIds },
      },
      {
        _id: 1,
        status: 1,
      }
    )
      .lean()
      .exec();
    const startTime = performance.now();
    const updatedTransactions = transactions.map((transaction) => {
      // eslint-disable-next-line no-param-reassign
      transaction.status = status;
      return transaction;
    });

    await Transaction.bulkWrite(
      updatedTransactions.map((transaction) => ({
        updateOne: {
          filter: { _id: transaction._id },
          update: { status: transaction.status },
        },
      }))
    );
    const endTime = performance.now();

    const timeTaken = endTime - startTime;
    console.log(
      `time taken with out using thread: ${timeTaken / 1000} seconds`
    );
    res.status(httpStatus.OK).json(updatedTransactions);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// using thread
export const updateTransactionStatusUsingWorkerThread = async (
  req,
  res,
  next
) => {
  const { transactionIds, status } = req.body;
  try {
    const transactions = await Transaction.find(
      {
        _id: { $in: transactionIds },
      },
      {
        _id: 1,
        status: 1,
      }
    )
      .lean()
      .exec();
    const startTime = performance.now();
    const updatedTransactions = await updateTransactions(
      transactions,
      4,
      status
    );
    await Transaction.bulkWrite(
      updatedTransactions.map((transaction) => ({
        updateOne: {
          filter: { _id: transaction._id },
          update: { status: transaction.status },
        },
      }))
    );

    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`time taken using 4 thread: ${timeTaken / 1000} seconds`);
    res.status(httpStatus.OK).json(updatedTransactions);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
