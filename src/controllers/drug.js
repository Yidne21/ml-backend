import httpStatus from 'http-status';
import Drug from '../models/drugs';

export const filterDrugController = async (req, res, next) => {
  const {
    page,
    limit,
    name,
    drugName,
    maxPrice,
    minPrice,
    category,
    pharmacyId,
    location,
  } = req.query;
  let coordinates;

  if (location) {
    coordinates = location.split(',').map(Number);
  }

  const filterParams = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    name,
    coordinates,
    drugName,
    maxPrice,
    minPrice,
    category,
    pharmacyId,
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
  // const { pharmacistId } = req.user;
  // const { pharmacyId } = req.body;
  try {
    const drug = await Drug.drugDetail(drugId);
    res.status(httpStatus.OK).json(drug);
  } catch (error) {
    next(error);
  }
};

export const createDrugController = async (req, res, next) => {
  // const { pharmacyId } = req.user;
  const { pharmacyId } = req.params;
  const {
    name,
    drugPhoto,
    instruction,
    sideEffects,
    strength,
    dosage,
    minStockLevel,
    needPrescription,
    category,
  } = req.body;

  const drugData = {
    name,
    drugPhoto,
    pharmacyId,
    instruction,
    sideEffects,
    strength,
    dosage,
    minStockLevel,
    needPrescription,
    category,
  };
  try {
    const drug = await Drug.createDrug(drugData);
    res.status(httpStatus.CREATED).json(drug);
  } catch (error) {
    next(error);
  }
};
export const updateDrugController = async (req, res, next) => {
  const { drugId } = req.params;
  const {
    name,

    drugPhoto,
    category,
    instruction,
    sideEffects,
    strength,
    dosage,
    minStockLevel,
    needPrescription,
  } = req.body;

  const drugData = {
    name,
    drugPhoto,
    category,
    instruction,
    sideEffects,
    minStockLevel,
    needPrescription,
    strength,
    dosage,
  };
  try {
    const drug = await Drug.updateDrug(drugId, drugData);
    res.status(httpStatus.OK).json(drug);
  } catch (error) {
    next(error);
  }
};
export const deleteDrugController = async (req, res, next) => {
  const { drugId } = req.params;
  try {
    const message = await Drug.deleteDrug(drugId);
    res.status(httpStatus.OK).json(message);
  } catch (error) {
    next(error);
  }
};

export const getDrugNamesController = async (req, res, next) => {
  const { pharmacyId } = req.params;
  try {
    const drugs = await Drug.getDrugNames(pharmacyId);
    res.status(httpStatus.OK).json(drugs);
  } catch (error) {
    next(error);
  }
};
