import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

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
    ...paginationPipeline(page, limit),
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
        $lookup: {
          from: 'pharmacies',
          let: { pharmacyId: '$pharmacyId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$pharmacyId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                location: 1,
              },
            },
          ],
          as: 'pharmacy',
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
          pharmacyName: '$pharmacy.name',
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

export async function createDrug(drugData) {
  const drugModel = this.model(modelNames.drug);
  try {
    const drug = await drugModel.create(drugData);
    return drug;
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

export async function updateDrug(drugId, drugData) {
  const drugModel = this.model(modelNames.drug);

  const currentDrug = await drugModel.findById(drugId);
  if (!currentDrug) {
    throw new APIError('drug not found', httpStatus.NOT_FOUND, true);
  }

  const updatedFields = {
    name: drugData.name || currentDrug.name,
    price: drugData.price || currentDrug.price,
    cost: drugData.cost || currentDrug.cost,
    drugPhoto: drugData.drugPhoto || currentDrug.drugPhoto,
    recivedFrom: drugData.recivedFrom || currentDrug.recivedFrom,
    category: drugData.category || currentDrug.category,
    ingredients: drugData.ingredients || currentDrug.ingredients,
    instruction: drugData.instruction || currentDrug.instruction,
    sideEffects: drugData.sideEffects || currentDrug.sideEffects,
    strengthAndDosage:
      drugData.strengthAndDosage || currentDrug.strengthAndDosage,
    manufacturedDate: currentDrug.manufacturedDate,
    expiredDate: currentDrug.expiredDate,
    stockLevel: drugData.stockLevel || currentDrug.stockLevel,
    minStockLevel: drugData.minStockLevel || currentDrug.minStockLevel,
    needPrescription: drugData.needPrescription || currentDrug.needPrescription,
  };

  try {
    const drug = await drugModel.findByIdAndUpdate(drugId, updatedFields, {
      new: true,
    });
    if (!drug) {
      throw new APIError('drug not found', httpStatus.NOT_FOUND, true);
    }
    return drug;
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

export async function deleteDrug(drugId) {
  const drugModel = this.model(modelNames.drug);
  try {
    const drug = await drugModel.findByIdAndDelete(drugId);
    if (!drug) {
      throw new APIError('drug not found', httpStatus.NOT_FOUND, true);
    }
    return drug;
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
