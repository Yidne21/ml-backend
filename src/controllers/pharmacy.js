import httpStatus from 'http-status';
import Pharmacy from '../models/pharmacies';

export const filterPharmacyController = async (req, res, next) => {
  const { page, limit, name, drugName } = req.query;
  const location = req.query.location.split(',').map(Number);

  const filterParams = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    name,
    location,
    drugName,
  };
  try {
    const pharmacies = await Pharmacy.filterPharmacy(filterParams);
    res.status(httpStatus.OK).json(pharmacies);
  } catch (error) {
    next(error);
  }
};

export const parmacyDetailController = async (req, res, next) => {
  const { pharmacyId } = req.params;
  try {
    const pharmacy = await Pharmacy.getPharmacyDetail(pharmacyId);
    res.status(httpStatus.OK).json(pharmacy);
  } catch (error) {
    next(error);
  }
};

export const getMyPharmacyController = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const pharmacy = await Pharmacy.getMyPharmacy(_id);
    res.status(httpStatus.OK).json(pharmacy);
  } catch (error) {
    next(error);
  }
};

export const updatePharmacyController = async (req, res, next) => {
  const { _id } = req.user;
  const { pharmacyId } = req.params;
  const { logo, address, phoneNumber } = req.body;
  const pharmacyParams = {
    _id,
    logo,
    address,
    phoneNumber,
  };
  try {
    const updatedPharmacy = await Pharmacy.updatePharmacy(pharmacyParams);
    res.status(httpStatus.OK).json(updatedPharmacy);
  } catch (error) {
    next(error);
  }
};
