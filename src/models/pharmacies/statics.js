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
}) {
  const PharmacyModel = this.model(modelNames.pharmacy);
  const [Lat, Long] = location;

  const mainPipeline = [
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [Long, Lat],
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
          socialMedia: 1,
          address: 1,
          email: 1,
          phoneNumber: 1,
          workingHours: 1,
          logo: 1,
          avgRating: { $round: ['$avgRating', 2] },
          reviews: 1,
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
