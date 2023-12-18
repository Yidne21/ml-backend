import httpStatus from 'http-status';
import Drug from '../models/drugs';

export const filterDrugController = async (req, res, next) => {
  const { page, limit, name, drugName, maxPrice, minPrice, category } =
    req.query;
  const location = req.query.location.split(',').map(Number);

  const filterParams = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    name,
    location,
    drugName,
    maxPrice,
    minPrice,
    category,
  };
  try {
    const drugs = await Drug.filterDrug(filterParams);
    res.status(httpStatus.OK).json(drugs);
  } catch (error) {
    next(error);
  }
};

export const drugDetailController = async (req, res, next) => {
  const { drugId } = req.params;
  try {
    const drug = await Drug.drugDetail(drugId);
    res.status(httpStatus.OK).json(drug);
  } catch (error) {
    next(error);
  }
};
