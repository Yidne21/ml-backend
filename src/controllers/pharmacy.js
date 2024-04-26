import httpStatus from 'http-status';
import Pharmacy from '../models/pharmacies';

export const filterPharmacyController = async (req, res, next) => {
  const { page, limit, name, drugName, sortBy, sortOrder } = req.query;

  const location = req.query.location
    ? req.query.location.split(',').map(Number)
    : null;

  const filterParams = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    name,
    location,
    drugName,
    sortBy,
    sortOrder,
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
  const { pharmacyId } = req.params;
  try {
    const pharmacy = await Pharmacy.getMyPharmacy(_id, pharmacyId);
    res.status(httpStatus.OK).json(pharmacy);
  } catch (error) {
    next(error);
  }
};

export const updatePharmacyController = async (req, res, next) => {
  const { _id } = req.user;
  const { pharmacyId } = req.params;

  const {
    logo,
    address,
    phoneNumber,
    cover,
    socialMedia,
    workingHours,
    deliveryPricePerKm,
    deliveryCoverage,
    hasDeliveryService,
    minDeliveryTime,
    maxDeliveryTime,
    account,
    location,
    email,
    about,
  } = req.body;

  if (location) {
    location.type = 'Point';
  }
  const pharmacyParams = {
    pharmacistId: _id,
    pharmacyId,
    logo,
    address,
    phoneNumber,
    cover,
    socialMedia,
    workingHours,
    deliveryPricePerKm,
    deliveryCoverage,
    location,
    hasDeliveryService,
    minDeliveryTime,
    maxDeliveryTime,
    account,
    email,
    about,
  };
  try {
    const updatedPharmacy = await Pharmacy.updatePharmacy(pharmacyParams);
    res.status(httpStatus.OK).json(updatedPharmacy);
  } catch (error) {
    next(error);
  }
};

export const addPharmacyController = async (req, res, next) => {
  const { _id } = req.user;
  const { name, email, location, pharmacyLicense, phoneNumber } = req.body;

  const [lat, lng] = location.split(',');

  const pharmacyParams = {
    pharmacistId: _id,
    name,
    email,
    location: {
      type: 'Point',
      coordinates: [parseFloat(lat), parseFloat(lng)],
    },
    pharmacyLicense,
    phoneNumber,
  };
  try {
    const pharmacy = await Pharmacy.addPharmacy(pharmacyParams);
    res.status(httpStatus.OK).json(pharmacy);
  } catch (error) {
    next(error);
  }
};
