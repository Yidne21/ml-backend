import { parentPort, workerData } from 'worker_threads';

console.log(`Thread ${workerData.workerNo + 1} started`);

const updatedChunk = workerData.transactionChunk.map((transaction) => {
  // eslint-disable-next-line no-param-reassign
  transaction.status = workerData.status;
  return transaction;
});

parentPort.postMessage(updatedChunk);

parentPort.close();
