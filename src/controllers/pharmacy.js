import httpStatus from 'http-status';
import Pharmacy from '../models/pharmacies';
import APIError from '../errors/APIError';
import { paginationPipeline } from '../utils/index';

export const filterPharmacyController = async (req, res, next) => {
  const { role, _id } = req.user;
  const { page, limit, name, drugName, sortBy, sortOrder } = req.query;
  let status = '';
  let adminId = '';
  const location = req.query.location
    ? req.query.location.split(',').map(Number)
    : null;

  try {
    if (role === 'admin') {
      status = 'pending';
      adminId = _id;
    } else if (role === 'customer') {
      status = 'approved';
    } else if (role === 'superAdmin') {
      status = 'any';
    } else {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    const filterParams = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      name,
      location,
      drugName,
      sortBy,
      sortOrder,
      status,
      adminId,
    };
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

export const updatePharmacyStatusController = async (req, res, next) => {
  const { role } = req.user;
  const { pharmacyId } = req.params;
  const { status } = req.body;
  try {
    if (role !== 'admin' && role !== 'superAdmin') {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    const pharmacy = await Pharmacy.updatePharmacyStatus({
      pharmacyId,
      status,
    });
    res.status(httpStatus.OK).json(pharmacy);
  } catch (error) {
    next(error);
  }
};

export const getPharmacyAddressController = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const address = await Pharmacy.aggregate([
      {
        $project: {
          _id: 0,
          address: 1,
          location: 1,
        },
      },
      ...paginationPipeline(page, limit),
    ]);
    res.status(httpStatus.OK).json(address);
  } catch (error) {
    next(error);
  }
};

export const assignToAdminController = async (req, res, next) => {
  const { role } = req.user;
  const { adminId } = req.params;
  const { numberofPharmacies } = req.body;
  try {
    if (role !== 'superAdmin') {
      throw new APIError(
        'You are not authorized to perform this action',
        httpStatus.UNAUTHORIZED,
        true
      );
    }
    const pharmacy = await Pharmacy.assignToAdmin({
      adminId,
      numberofPharmacies,
    });
    res.status(httpStatus.OK).json(pharmacy);
  } catch (error) {
    next(error);
  }
};
