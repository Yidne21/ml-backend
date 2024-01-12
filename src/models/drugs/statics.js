import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';

export async function filterDrug({
  maxPrice,
  minPrice,
  category,
  name,
  page = 1,
  limit = 10,
  location,
  drugName,
}) {
  const DrugModel = this.model(modelNames.drug);
  const [Lat, Long] = location;

  const mainPipeline = [
    {
      $lookup: {
        from: 'pharmacies',
        let: { pharmacyId: '$pharmacyId' },
        pipeline: [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [parseFloat(Long), parseFloat(Lat)],
              },
              distanceField: 'distance',
              distanceMultiplier: 0.001,
              includeLocs: 'location',
              spherical: true,
            },
          },
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$pharmacyId'],
              },
            },
          },
          ...(name
            ? [{ $match: { name: { $regex: new RegExp(name, 'i') } } }]
            : []),
          {
            $project: {
              _id: 1,
              name: 1,
              distance: { $round: ['$distance', 2] },
              location: 1,
            },
          },
        ],
        as: 'pharmacy',
      },
    },
    {
      $unwind: { path: '$pharmacy', preserveNullAndEmptyArrays: true },
    },
    {
      $match: {
        pharmacy: { $ne: null },
      },
    },
    ...(drugName
      ? [
          {
            $match: {
              $expr: {
                $regexMatch: {
                  input: '$name',
                  regex: new RegExp(drugName, 'i'),
                },
              },
            },
          },
        ]
      : []),
    ...(maxPrice
      ? [{ $match: { price: { $lte: parseInt(maxPrice, 10) } } }]
      : []),
    ...(minPrice
      ? [{ $match: { price: { $gte: parseInt(minPrice, 10) } } }]
      : []),
    ...(category ? [{ $match: { category } }] : []),
    {
      $sort: {
        'pharmacy.distance': 1,
      },
    },
    {
      $project: {
        location: 1,
        name: 1,
        category: 1,
        price: 1,
        expiredDate: 1,
        pharmacy: 1,
        drugPhoto: 1,
      },
    },
    {
      $facet: {
        paginationInfo: [
          { $count: 'totalDocuments' },
          {
            $addFields: {
              totalDocuments: { $ifNull: ['$totalDocuments', 0] },
              totalPages: {
                $ceil: {
                  $divide: [
                    { $ifNull: ['$totalDocuments', 1] },
                    parseInt(limit, 10),
                  ],
                },
              },
            },
          },
          {
            $project: {
              totalDocuments: 1,
              totalPages: 1,
            },
          },
        ],
        results: [
          { $skip: (parseInt(page, 10) - 1) * parseInt(limit, 10) },
          { $limit: parseInt(limit, 10) },
        ],
      },
    },
    {
      $unwind: { path: '$paginationInfo', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        totalDocuments: { $ifNull: ['$paginationInfo.totalDocuments', 0] },
        totalPages: { $ifNull: ['$paginationInfo.totalPages', 0] },
        drugs: '$results',
      },
    },
  ];

  try {
    const drugs = await DrugModel.aggregate(mainPipeline);

    return drugs[0];
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

export async function drugDetail(drugId) {
  const drugModel = this.model(modelNames.drug);
  try {
    const drug = await drugModel.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(drugId),
        },
      },
      {
        $project: {
          name: 1,
          price: 1,
          recivedFrom: 1,
          category: 1,
          ingredients: 1,
          instruction: 1,
          sideEffects: 1,
          strengthAndDosage: 1,
          manufacturedDate: 1,
          expiredDate: 1,
          stockLevel: 1,
          needPrescription: 1,
          drugPhoto: 1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (drug.length === 0) {
      throw new APIError('drug not found', httpStatus.NOT_FOUND, true);
    }

    return drug[0];
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
