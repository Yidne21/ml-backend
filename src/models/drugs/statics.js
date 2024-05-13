import httpStatus from 'http-status';
import mongoose from 'mongoose';
import APIError from '../../errors/APIError';
import modelNames from '../../utils/constants';
import { paginationPipeline } from '../../utils';

export async function filterDrug({
  maxPrice,
  minPrice,
  category,
  page = 1,
  limit = 10,
  drugName,
  pharmacyId,
  status,
  sortBy,
  sortOrder,
}) {
  const DrugModel = this.model(modelNames.drug);
  const mainPipeline = [
    {
      $match: {
        pharmacyId: mongoose.Types.ObjectId(pharmacyId),
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
    ...(status ? [{ $match: { status } }] : []),
    ...(sortBy && sortOrder
      ? [{ $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } }]
      : []),
    {
      $project: {
        location: 1,
        name: 1,
        category: 1,
        stocks: 1,
        pharmacy: 1,
        drugPhoto: 1,
        stockLevel: 1,
        needPrescription: 1,
        createdAt: 1,
        status: 1,
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

export async function filterCustomer({
  maxPrice,
  minPrice,
  category,
  name,
  page = 1,
  limit = 10,
  coordinates,
  drugName,
  pharmacyId,
  status,
  sortBy,
  sortOrder,
}) {
  const DrugModel = this.model(modelNames.drug);
  const mainPipeline = [
    {
      $match: {
        ...(pharmacyId && {
          pharmacyId: mongoose.Types.ObjectId(pharmacyId),
        }),
      },
    },

    {
      $lookup: {
        from: 'pharmacies',
        let: { pharmacyId: '$pharmacyId' },
        pipeline: [
          ...(coordinates
            ? [
                {
                  $geoNear: {
                    near: {
                      type: 'Point',
                      coordinates: [
                        parseFloat(coordinates[1]),
                        parseFloat(coordinates[0]),
                      ],
                    },
                    distanceField: 'distance',
                    distanceMultiplier: 0.001,
                    includeLocs: 'location',
                    spherical: true,
                  },
                },
              ]
            : []),
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$pharmacyId'],
              },
              status: 'approved',
            },
          },
          ...(name
            ? [{ $match: { name: { $regex: new RegExp(name, 'i') } } }]
            : []),
          {
            $project: {
              _id: 1,
              name: 1,
              ...(coordinates && {
                distance: 1,
                location: 1,
              }),
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
    ...(category ? [{ $match: { category } }] : []),

    {
      $lookup: {
        from: 'stocks',
        let: { drugId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$drugId', '$$drugId'] },
              status: 'available',
            },
          },
          {
            $group: {
              _id: {
                price: '$price',
                expiredDate: '$expiredDate',
                stockId: '$_id',
              }, // Group by price
              quantity: { $sum: '$quantity' }, // Sum up the quantity for each price
            },
          },
          {
            $project: {
              _id: 0,
              price: '$_id.price',
              expiredDate: '$_id.expiredDate',
              stockId: '$_id.stockId',
              quantity: 1,
            },
          },
        ],
        as: 'stocks',
      },
    },
    { $unwind: '$stocks' },

    {
      $sort: {
        'pharmacy.distance': 1,
      },
    },

    ...(status ? [{ $match: { status } }] : []),
    ...(maxPrice
      ? [{ $match: { 'stocks.price': { $lte: parseInt(maxPrice, 10) } } }]
      : []),
    ...(minPrice
      ? [{ $match: { 'stocks.price': { $gte: parseInt(minPrice, 10) } } }]
      : []),
    ...(sortBy && sortOrder
      ? [{ $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } }]
      : []),
    {
      $project: {
        location: 1,
        name: 1,
        category: 1,
        stocks: 1,
        pharmacy: 1,
        drugPhoto: 1,
        stockLevel: 1,
        needPrescription: 1,
        createdAt: 1,
        status: 1,
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

export async function getDrugNames(pharmacyId) {
  const drugModel = this.model(modelNames.drug);
  try {
    const drugs = await drugModel.aggregate([
      {
        $match: {
          pharmacyId: mongoose.Types.ObjectId(pharmacyId),
        },
      },
      {
        $project: {
          name: 1,
        },
      },
    ]);

    return drugs;
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

export async function drugDetail({ drugId, stockId }) {
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
                deliveryPricePerKm: 1,
                hasDeliveryService: 1,
                deliveryCoverage: 1,
                minDeliveryTime: 1,
                maxDeliveryTime: 1,
              },
            },
          ],
          as: 'pharmacy',
        },
      },
      {
        $unwind: { path: '$pharmacy', preserveNullAndEmptyArrays: true },
      },
      ...(stockId
        ? [
            {
              $lookup: {
                from: 'stocks',
                let: { drugId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$drugId', '$$drugId'] },
                    },
                  },
                ],
                as: 'stock',
              },
            },
            {
              $unwind: '$stock',
            },
            {
              $match: {
                'stock._id': mongoose.Types.ObjectId(stockId),
              },
            },
          ]
        : []),
      {
        $project: {
          name: 1,
          category: 1,
          instruction: 1,
          sideEffects: 1,
          strength: 1,
          dosage: 1,
          stockLevel: 1,
          minStockLevel: 1,
          needPrescription: 1,
          drugPhoto: 1,
          profit: 1,
          status: 1,
          stock: {
            _id: 1,
            price: 1,
            recievedFrom: 1,
            expiredDate: 1,
            batchNumber: 1,
            currentQuantity: 1,
            status: 1,
            quantity: 1,
            cost: 1,
          },
          pharmacy: 1,
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
    if (!drug) {
      throw new APIError(
        'oops something went wrong',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
    return { message: 'Drug created successfully', drug };
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
    drugPhoto: drugData.drugPhoto || currentDrug.drugPhoto,
    category: drugData.category || currentDrug.category,
    instruction: drugData.instruction || currentDrug.instruction,
    sideEffects: drugData.sideEffects || currentDrug.sideEffects,
    strength: drugData.strength || currentDrug.strength,
    dosage: drugData.dosage || currentDrug.dosage,
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
    return { message: 'Drug updated successfully', drug };
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
  const session = await mongoose.startSession();
  session.startTransaction();
  const stockModel = this.model(modelNames.stock);
  const drugModel = this.model(modelNames.drug);
  try {
    const drug = await drugModel.findByIdAndDelete(drugId);
    if (!drug) {
      throw new APIError('drug not found', httpStatus.NOT_FOUND, true);
    }
    await stockModel.deleteMany({ drugId });
    await session.commitTransaction();

    return { message: 'Drug deleted successfully' };
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  } finally {
    session.endSession();
  }
}

export async function getDrugCategories() {
  const drugModel = this.model(modelNames.drug);
  try {
    const categories = await drugModel.distinct('category');
    return categories;
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

export async function saleDrug({
  drugId,
  pharmacyId,
  userId,
  quantity,
  stockId,
}) {
  const drugModel = this.model(modelNames.drug);
  const stockModel = this.model(modelNames.stock);
  const pharmacyModel = this.model(modelNames.pharmacy);
  const notificationModel = this.model(modelNames.notification);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const drug = await drugModel.findById(drugId);
    if (!drug) {
      session.abortTransaction();
      throw new APIError('drug not found', httpStatus.NOT_FOUND, true);
    }
    const stock = await stockModel.findOne({
      _id: stockId,
      drugId,
    });
    if (!stock) {
      throw new APIError(
        'stock not found in pharmacy',
        httpStatus.NOT_FOUND,
        true
      );
    }
    const pharmacy = await pharmacyModel.findById(pharmacyId);

    if (!pharmacy) {
      throw new APIError('pharmacy not found', httpStatus.NOT_FOUND, true);
    }
    if (stock.currentQuantity < quantity) {
      session.abortTransaction();
      const data = {
        userId,
        title: 'Stock level low',
        message: `Your ${pharmacy.name} pharmacy Stock level of ${drug.name} is empty and needs to be restocked`,
        type: 'warning',
      };
      await notificationModel.create(data);
      throw new APIError('insufficient stock', httpStatus.BAD_REQUEST, true);
    }
    stock.currentQuantity -= quantity;
    drug.stockLevel -= quantity;
    drug.totalSale += quantity;
    drug.profit += quantity * (stock.price - stock.cost);

    if (drug.stockLevel < drug.minStockLevel) {
      const data = {
        userId,
        title: 'Stock level low',
        message: `Your ${pharmacy.name} pharmacy Stock level of ${drug.name} is below minimum stock level The current quantity is: ${stock.currentQuantity} and needs to be restocked`,
        type: 'warning',
      };
      await notificationModel.create(data);
    }

    await stock.save();

    await drug.save();

    await session.commitTransaction();

    return {
      message: 'Drug sold successfully',
      stockLevel: stock.currentQuantity,
    };
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof APIError) throw error;
    else {
      throw new APIError(
        'Internal Error',
        httpStatus.INTERNAL_SERVER_ERROR,
        true
      );
    }
  } finally {
    session.endSession();
  }
}
