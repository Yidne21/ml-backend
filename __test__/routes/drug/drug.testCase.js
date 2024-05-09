const validFilterDrugQuery = {
  location: '7.6123, 38.9557',
  page: 1,
  limit: 5,
  drugName: 'drug name',
  maxPrice: 200,
  minPrice: 400,
  category: 'category',
  pharmacyId: '66309b7568c23227d905c6a2',
};

const inValidFilterPharmacyId = {
  ...validFilterDrugQuery,
  pharmacyId: 'pharmacyId',
};

const inValidPageQuery = {
  ...validFilterDrugQuery,
  page: 'jkl',
};

const inValidLimitQuery = {
  ...validFilterDrugQuery,
  limit: 'ljj',
};

const validDrugIdAndStockId = {
  drugId: '66309b7668c23227d905c6df',
  stockId: '66309b7668c23227d905c7b2',
};

const inValidStockId = {
  ...validDrugIdAndStockId,
  stockId: '66309b7668c23227d',
};

const inValidDrugIdAndValidStockId = {
  ...validDrugIdAndStockId,
  drugId: '66309b7668c23227d905c',
};

const validCreateDrugData = {
  name: 'Test Drug',
  drugPhoto: 'url',
  instruction: 'sample Instraction',
  sideEffects: 'sample sideEffect',
  strength: '50 mg/5 mL',
  dosage: 'Four times weekly',
  minStockLevel: 100,
  needPrescription: false,
  category: 'Four times weekly',
};

const invalidMinStockLevel = {
  ...validCreateDrugData,
  minStockLevel: 'hhjdhfdjfh',
};

const invalidNeedPrescription = {
  ...validCreateDrugData,
  needPrescription: 200,
};

export {
  validCreateDrugData,
  invalidMinStockLevel,
  invalidNeedPrescription,
  validFilterDrugQuery,
  inValidFilterPharmacyId,
  inValidPageQuery,
  inValidLimitQuery,
  validDrugIdAndStockId,
  inValidStockId,
  inValidDrugIdAndValidStockId,
};
