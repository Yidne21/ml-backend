import httpStatus from 'http-status';
import { Worker } from 'worker_threads';
import Drug from '../models/drugs';

function chunkify(drugs, n) {
  const drugChunks = [];
  for (let i = n; i > 0; i -= 1) {
    drugChunks.push(drugs.splice(0, Math.ceil(drugs.length / i)));
  }
  return drugChunks;
}

async function updateStock(drugs, conCurrentWorker, amount) {
  const chunks = chunkify(drugs, conCurrentWorker);
  const workerPromises = [];
  const updatedDrugs = [];

  chunks.forEach((drugChunk, workerNo) => {
    const worker = new Worker('./src/utils/updateStockThread.mjs', {
      workerData: {
        drugChunk: drugChunk.map((drug) => ({
          ...drug,
          _id: drug._id.toString(),
        })),
        amount,
        workerNo,
      },
    });

    const workerPromise = new Promise((resolve, reject) => {
      worker.on('message', (updatedChunk) => {
        resolve(updatedChunk); // Resolve with updated chunk
        updatedDrugs.push(...updatedChunk);
      });
      worker.on('error', (err) => {
        reject(err); // Reject if there's an error in the worker thread
      });
    });

    workerPromises.push(workerPromise);
  });

  // Wait for all promises to resolve
  await Promise.all(workerPromises);

  return updatedDrugs;
}

// with out using thread
export const updateDrugsStockByExpireDate = async (req, res, next) => {
  const { amount } = req.body;
  try {
    const drugs = await Drug.find(
      {},
      {
        stockLevel: 1,
      }
    )
      .lean()
      .exec();
    const startTime = performance.now();

    let updatedDrugs = drugs;
    if (amount) {
      updatedDrugs = drugs.map((drug) => {
        // eslint-disable-next-line no-param-reassign
        drug.stockLevel += amount;
        return drug;
      });

      await Drug.bulkWrite(
        updatedDrugs.map((drug) => ({
          updateOne: {
            filter: { _id: drug._id },
            update: { stockLevel: drug.stockLevel },
          },
        }))
      );
    }
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    console.log(
      `time taken with out using thread: ${timeTaken / 1000} seconds`
    );
    res.status(httpStatus.OK).json(updatedDrugs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// using thread
export const updateDrugStockUsingWorkerThread = async (req, res, next) => {
  const { amount } = req.body;
  try {
    const drugs = await Drug.find(
      {},
      {
        stockLevel: 1,
      }
    )
      .lean()
      .exec();
    const startTime = performance.now();
    let updatedDrugs = drugs;
    if (amount) {
      updatedDrugs = await updateStock(drugs, 4, amount);
      await Drug.bulkWrite(
        updatedDrugs.map((drug) => ({
          updateOne: {
            filter: { _id: drug._id },
            update: { stockLevel: drug.stockLevel },
          },
        }))
      );
    }

    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`time taken using 4 thread: ${timeTaken / 1000} seconds`);
    res.status(httpStatus.OK).json(updatedDrugs);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
