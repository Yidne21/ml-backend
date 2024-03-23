import httpStatus from 'http-status';
import Drug from '../models/drugs';

// with out using thread
export const sortDrugsByExpireDate = async (req, res, next) => {
  try {
    const drugs = await Drug.find({});
    const sortedDrugs = drugs.sort({ expireDate: 1 });
    res.status(httpStatus.OK).json(sortedDrugs);
  } catch (error) {
    next(error);
  }
};

// using thread
export const sortDrugUsingWorkerThread = async (req, res, next) => {
  try {
    const drugs = await Drug.sortDrugUsingWorkerThread();
    res.status(httpStatus.OK).json(drugs);
  } catch (error) {
    next(error);
  }
};

// using aggrigation pipeline example of multi-processing
export const sortDrugUsingAggrigation = async (req, res, next) => {
  try {
    const drugs = await Drug.sortDrugUsingAggrigation();
    res.status(httpStatus.OK).json(drugs);
  } catch (error) {
    next(error);
  }
};
