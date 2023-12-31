/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';

import Drug from '../models/drugs';
import Order from '../models/orders';
import Pharmacy from '../models/pharmacies';
import Review from '../models/reviews';
import User from '../models/users';

const insertDummyData = async () => {
  try {
    // Insert dummy data for User
    const userData = {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      coverPhoto: faker.image.url(),
      location: {
        type: 'Point',
        coordinates: [
          faker.location.longitude({ max: 42.8, min: 34.53333 }),
          faker.location.latitude({ max: 14.277, min: 4.05 }),
        ],
      },
      role: faker.helpers.arrayElement(['admin', 'pharmaciest', 'customer']),
    };
    const user = await User.create(userData);
    console.log('Inserted dummy data for User:', user);

    const pharmaciestID = await User.find({
      role: 'pharmaciest',
    }).select('_id');

    const customerID = await User.find({
      role: 'customer',
    }).select('_id');

    // Insert dummy data for Pharmacy
    const pharmacyData = {
      name: faker.company.name(),
      address: faker.location.secondaryAddress(),
      location: {
        type: 'Point',
        coordinates: [
          faker.location.longitude({ max: 42.8, min: 34.53333 }),
          faker.location.latitude({ max: 14.277, min: 4.05 }),
        ],
      },
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      pharmaciestId: faker.helpers.arrayElement(pharmaciestID),
      about: faker.lorem.paragraph(),
      logo: faker.image.urlPicsumPhotos({ height: 100, width: 100 }),
      coverPhoto: faker.image.urlPicsumPhotos({ height: 100, width: 500 }),
      socialMedia: {
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
        twitter: faker.internet.url(),
      },
    };

    const pharmacy = await Pharmacy.create(pharmacyData);
    console.log('Inserted dummy data for Pharmacy:', pharmacy);

    const pharmacyId = await Pharmacy.find().select('_id');
    // Insert dummy data for Notification if stockLevel <= minStockLevel
    const drugData = {
      pharmacyId: faker.helpers.arrayElement(pharmacyId),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.commerce.department(),
      price: faker.number.float({ min: 500, max: 1000000 }),
      cost: faker.number.float({ min: 100, max: 10000 }),
      stockLevel: faker.number.int({ min: 0, max: 10000 }),
      minStockLevel: faker.number.int({ min: 200, max: 1000 }),
      recivedFrom: faker.company.name(),
      instruction: faker.lorem.paragraph(),
      sideEffects: faker.lorem.paragraph(),
      strengthAndDosage: faker.lorem.sentence(),
      manufacturedDate: faker.date.past(),
      expiredDate: faker.date.future(),
      needPrescription: faker.datatype.boolean(),
      drugPhoto: [
        'https://fakeimg.pl/150x150/bdbdbd/ffffff?text=Drug+Photo&font=noto',
        faker.image.urlLoremFlickr({ category: 'medicin' }),
        faker.image.urlLoremFlickr({ category: 'medicin' }),
      ],
    };

    const drug = await Drug.create(drugData);
    console.log('Inserted dummy data for Drug:', drug);
    const drugId = await Drug.find().select('_id');

    // Insert dummy data for Order
    const orderData = {
      orderedTo: faker.helpers.arrayElement(pharmacyId),
      orderedBy: faker.helpers.arrayElement(customerID),
      drugId: faker.helpers.arrayElement(drugId),
      quantity: faker.number.int({ min: 1, max: 5 }),
      transactionId: faker.string.alphanumeric({
        length: { min: 10, max: 11 },
      }),
      paymentMethod: faker.helpers.arrayElement([
        'chapa',
        'telbirr',
        'helloCash',
      ]),
      status: faker.helpers.arrayElement([
        'inprogress',
        'delivered',
        'aborted',
      ]),
    };

    const orderedDrug = await Drug.findOne({ _id: orderData.drugId });
    if (orderData.status === 'delivered') {
      orderData.deliveredAt = faker.date.past();
      orderData.profit =
        orderData.quantity * (orderedDrug.price - orderedDrug.cost);
    }

    const order = await Order.create(orderData);
    console.log('Inserted dummy data for Order:', order);

    // Insert dummy data for Review
    const reviewData = {
      reviewedBy: faker.helpers.arrayElement(customerID),
      pharmacyId: faker.helpers.arrayElement(pharmacyId),
      rating: faker.number.float({ min: 0, max: 5 }),
      feedback: faker.lorem.paragraph(),
    };

    const review = await Review.create(reviewData);
    console.log('Inserted dummy data for Review:', review);
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
};

export default insertDummyData;
