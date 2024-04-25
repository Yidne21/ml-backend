import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils/index';

export async function filterPharmacy({
  name,
  page = 1,
  limit = 10,
  location,
  drugName,
  sortBy,
  sortOrder,
}) {
  const PharmacyModel = this.model(modelNames.pharmacy);

  const mainPipeline = [
    ...(location
      ? [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [location[1], location[0]],
              },
              distanceField: 'distance',
              distanceMultiplier: 0.001,
              includeLocs: 'location',
              spherical: true,
            },
          },
          {
            $addFields: {
              distance: {
                $round: ['$distance', 2],
              },
            },
          },
        ]
      : []),
    ...(name
      ? [
          {
            $match: {
              name: { $regex: new RegExp(name, 'i') },
            },
          },
        ]
      : []),

    ...(drugName
      ? [
          {
            $lookup: {
              from: 'drugs',
              let: { pharmacyId: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ['$pharmacyId', '$$pharmacyId'] },
                        // { $eq: ['$name', drugName] },
                        {
                          $regexMatch: {
                            input: '$name',
                            regex: new RegExp(drugName, 'i'),
                          },
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'drug',
            },
          },
          {
            $match: {
              drug: { $ne: [] },
            },
          },
          {
            $unwind: { path: '$drug', preserveNullAndEmptyArrays: true },
          },
        ]
      : []),
    ...(sortBy ? [{ $sort: { [sortBy]: sortOrder === 'des' ? -1 : 1 } }] : []),
    {
      $project: {
        _id: 1,
        name: 1,
        distance: 1,
        location: 1,
        logo: 1,
        'drug._id': 1,
        'drug.name': 1,
        'drug.stockLevel': 1,
        avgRating: 1,
        status: 1,
        email: 1,
      },
    },
    ...paginationPipeline(page, limit),
  ];

  try {
    const nearbyPharmacies = await PharmacyModel.aggregate(mainPipeline);

    return nearbyPharmacies[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function getPharmacyDetail(pharmacyId) {
  const PharmacyModel = this.model(modelNames.pharmacy);
  try {
    const pharmacy = await PharmacyModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(pharmacyId),
        },
      },
      {
        $lookup: {
          from: 'reviews',
          let: { pharmacyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$pharmacyId', '$$pharmacyId'],
                },
              },
            },
            {
              $lookup: {
                from: 'users',
                let: { reviewedBy: '$reviewedBy' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$reviewedBy'],
                      },
                    },
                  },
                  {
                    $project: {
                      name: 1,
                      avatar: 1,
                    },
                  },
                ],
                as: 'user',
              },
            },
            {
              $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                _id: 1,
                rating: { $round: ['$rating', 2] },
                feedback: 1,
                user: 1,
              },
            },
          ],
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avgRating: {
            $avg: '$reviews.rating',
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          'location.coordinates': 1,
          cover: 1,
          about: 1,
          socialMedia: 1,
          address: 1,
          email: 1,
          phoneNumber: 1,
          workingHours: 1,
          logo: 1,
          avgRating: { $round: ['$avgRating', 2] },
          reviews: 1,
          deliverPricePerKm: 1,
          hasDeliveryService: 1,
          deliveryCoverage: 1,
          minDeliveryTime: 1,
          maxDeliveryTime: 1,
          pharmacyLicense: 1,
        },
      },
      {
        $limit: 1, // Limit to one document (optional)
      },
    ]);

    if (pharmacy.length === 0) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    return pharmacy[0];
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function getMyPharmacy(_id) {
  const PharmacyModel = this.model(modelNames.pharmacy);
  try {
    const myPharmacies = await PharmacyModel.aggregate([
      {
        $match: {
          pharmacistId: mongoose.Types.ObjectId(_id),
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          logo: 1,
          email: 1,
          status: 1,
        },
      },
    ]);

    return myPharmacies;
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function addPharmacy(pharmacyParams) {
  const PharmacyModel = this.model(modelNames.pharmacy);
  try {
    const pharmacy = await PharmacyModel.create(pharmacyParams);

    return { message: 'Your pharmacy is ready to review', pharmacy };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}

export async function updatePharmacy({
  pharmacistId,
  pharmacyId,
  logo,
  address,
  phoneNumber,
  cover,
  socialMedia,
  workingHours,
  deliverPricePerKm,
  deliveryCoverage,
  hasDeliveryService,
  minDeliveryTime,
  maxDeliveryTime,
  account,
  location,
  email,
  about,
}) {
  const PharmacyModel = this.model(modelNames.pharmacy);
  try {
    const currentPharmacy = await PharmacyModel.findOne({
      _id: pharmacyId,
      ...(pharmacistId ? { pharmacistId } : {}),
    });

    if (!currentPharmacy) {
      throw new APIError('Pharmacy not found', httpStatus.NOT_FOUND, true);
    }

    const updatedPharmacy = await PharmacyModel.findOneAndUpdate(
      {
        _id: pharmacyId,
        pharmacistId,
      },
      {
        ...(logo ? { logo } : {}),
        ...(address ? { address } : {}),
        ...(phoneNumber ? { phoneNumber } : {}),
        ...(cover ? { cover } : {}),
        ...(socialMedia ? { socialMedia } : {}),
        ...(workingHours ? { workingHours } : {}),
        ...(deliverPricePerKm ? { deliverPricePerKm } : {}),
        ...(deliveryCoverage ? { deliveryCoverage } : {}),
        ...(account ? { account } : {}),
        ...(location ? { location } : {}),
        ...(email ? { email } : {}),
        ...(about ? { about } : {}),
        ...(hasDeliveryService ? { hasDeliveryService } : {}),
        ...(minDeliveryTime ? { minDeliveryTime } : {}),
        ...(maxDeliveryTime ? { maxDeliveryTime } : {}),
      },
      { new: true }
    );
    return { message: 'Pharmacy updated successfully', updatedPharmacy };
  } catch (error) {
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  }
}
