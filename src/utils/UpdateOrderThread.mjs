import { parentPort, workerData } from 'worker_threads';

console.log(`Thread ${workerData.workerNo + 1} started`);

const updatedChunk = workerData.orderChunk.map((order) => {
  // eslint-disable-next-line no-param-reassign
  order.status = workerData.status;
  return order;
});

parentPort.postMessage(updatedChunk);

parentPort.close();
