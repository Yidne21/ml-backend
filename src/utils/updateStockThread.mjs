import { parentPort, workerData } from 'worker_threads';

console.log(`Thread ${workerData.workerNo + 1} started`);

const updatedChunk = workerData.drugChunk.map((drug) => {
  // eslint-disable-next-line no-param-reassign
  drug.stockLevel += workerData.amount;
  return drug;
});

parentPort.postMessage(updatedChunk);

// Terminate the worker thread after completing the task
parentPort.close();
