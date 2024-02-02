/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';

import Drug from '../models/drugs';
import Order from '../models/orders';
import Pharmacy from '../models/pharmacies';
import Review from '../models/reviews';
import User from '../models/users';
import Transaction from '../models/transactions';
import Feedback from '../models/feedbacks';

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
      role: faker.helpers.arrayElement([
        'admin',
        'pharmaciest',
        'customer',
        'superAdmin',
      ]),
    };

    const addresses = [
      '1000, Addis Ababa-Addis Ababa Zone 1, Addis Ababa',
      '1000, Addis Ababa-Addis Ababa Zone 1, Addis Ababa Stadium',
      '1000, Addis Ababa-Addis Ababa Zone 1, Bole International Airport',
      '1000, Addis Ababa-Addis Ababa Zone 2, Alem Gena, Addis Ababa Liddetta Airport',
      '1000, Addis Ababa-Addis Ababa Zone 2, Alem Gena, Mebrat Hayel Stadium',
      '1000, Oromia-Semen Shewa, Eydu',
      '1000, Oromia-Semen Shewa, Gebre Guracha',
      '1000, Oromia-Semen Shewa, Golje Giyorgis Bete Kiristyan',
      "1000, Oromia-Semen Shewa, Muke T'uri",
      '1000, Oromia-Semen Shewa, Robe',
      '1000, Oromia-Semen Shewa, Sembo',
      '1000, Oromia-Semen Shewa, Sendafa',
      '1000, Oromia-Semen Shewa, Sheno',
      '1000, Oromia-Semen Shewa, Sululta',
      '1000, Oromia-Semen Shewa, Tulu Milki',
      '1150, Addis Ababa-Addis Ababa Zone 2, Alem Gena',
      "1230, Addis Ababa-Addis Ababa Zone 6, Ak'ak'i Besek'a",
      '2040, Oromia-Arssi, Abomsa',
      '2040, Oromia-Arssi, Adele',
      '2040, Oromia-Arssi, Bekeksa',
      '2040, Oromia-Arssi, Carri',
      '2040, Oromia-Arssi, Dino',
      '2040, Oromia-Arssi, Gololcha',
      '2040, Oromia-Arssi, Mechara',
      '2040, Oromia-Arssi, Seru',
      '2040, Oromia-Arssi, Shek Husen',
      "2040, Oromia-Arssi, Tinsa'E Birhan",
      '2120, Oromia-Arssi, Asasa',
      "2120, Oromia-Arssi, Bek'oji",
      '2120, Oromia-Arssi, Bilbilo',
      '2120, Oromia-Arssi, Buccio',
      '2120, Oromia-Arssi, Kofele',
      '2120, Oromia-Arssi, Sire (2)',
      '2140, Oromia-Arssi, Agere Sisay',
      '2140, Oromia-Arssi, Dera',
      '2140, Oromia-Arssi, Hamda Diksis',
      '2140, Oromia-Arssi, Huruta',
      '2140, Oromia-Arssi, Robi',
      '2140, Oromia-Arssi, Sire',
      '3000, Dire Dawa-Dire Dawa, Dire Dawa',
      '3000, Dire Dawa-Dire Dawa, Dire Dawa Stadium',
      '3020, Dire Dawa-Dire Dawa, Dire Dawa, Aba Tenna Dejazmatch Yilma Airport',
      '3020, Dire Dawa-Dire Dawa, Melka Jebti',
      '3040, Somali-Gode, Balbalaiar',
      '3040, Somali-Gode, Denan',
      '3040, Somali-Gode, Dibugur',
      '3040, Somali-Gode, Gabro',
      '3040, Somali-Gode, Gelhalali',
      '3040, Somali-Gode, Gode',
      '3040, Somali-Gode, Gode',
      '3040, Somali-Gode, Ididole',
      '3040, Somali-Gode, Ididole, Gode Airport',
      '3040, Somali-Gode, Imi',
      '3040, Somali-Gode, Megwin',
      '3040, Somali-Gode, Melka Bafeta',
      '3040, Somali-Gode, Melka Teka',
      '3040, Somali-Gode, Obdamer',
      '3060, Somali-Korahe, Giadabele',
      "3060, Somali-Korahe, K'ebri Dehar",
      "3060, Somali-Korahe, K'ebri Dehar, Kabri Dar Airport",
      "3060, Somali-Korahe, K'orahe",
      '3060, Somali-Korahe, Shilabe',
      '3060, Somali-Korahe, Uarandab',
      '3080, Somali-Afder, Bargheile',
      '3080, Somali-Afder, Busle',
      "3080, Somali-Afder, El Bi'oba",
      "3080, Somali-Afder, El K'oran",
      '3080, Somali-Afder, Ferfer',
      '3080, Somali-Afder, Godder',
      "3080, Somali-Afder, K'elafo",
      '3080, Somali-Afder, Kunyo',
      '3080, Somali-Afder, Mustahil',
      '3080, Somali-Afder, Sulsul',
      '3120, Somali-Warder, Balleh Ad',
      '3120, Somali-Warder, Domo',
      '3120, Somali-Warder, Dudub',
      '3120, Somali-Warder, Gashamo',
      '3120, Somali-Warder, Godegude',
      '3120, Somali-Warder, Gudis',
      '3120, Somali-Warder, Harshin',
      '3120, Somali-Warder, Kebri Beyah',
      '3120, Somali-Warder, Kebri Beyah, Kebri Beyah Airport',
      '3120, Somali-Warder, Warder',
      '3120, Somali-Warder, Warder Airport',
      '3140, Somali-Degahbur, Birkot',
      '3140, Somali-Degahbur, Degahbur',
      '3140, Somali-Degahbur, Degahbur Airport',
      '3140, Somali-Degahbur, Dolo Odo',
      '3140, Somali-Degahbur, Dolo Odo Airport',
      '3140, Somali-Degahbur, Filtu',
      '3140, Somali-Degahbur, Filtu Airport',
      '3140, Somali-Degahbur, Godegude',
      '3140, Somali-Degahbur, Gudis',
      '3140, Somali-Degahbur, Harshin',
      '3140, Somali-Degahbur, Kebri Beyah',
      '3140, Somali-Degahbur, Kebri Beyah Airport',
      '3140, Somali-Degahbur, Warder',
      '3140, Somali-Degahbur, Warder Airport',
    ];

    if (userData.role === 'customer') {
      userData.deliveryAddress = {
        address: faker.helpers.arrayElement(addresses),
        phoneNumber: faker.phone.number(),
        location: {
          type: 'Point',
          coordinates: [
            faker.location.longitude({ max: 42.8, min: 34.53333 }),
            faker.location.latitude({ max: 14.277, min: 4.05 }),
          ],
        },
      };
    }

    if (
      userData.role === 'customer' ||
      userData.role === 'pharmaciest' ||
      userData.role === 'superAdmin'
    ) {
      userData.account = {
        accountHolder: faker.person.fullName(),
        accountNumber: faker.finance.accountNumber(),
        bankName: faker.helpers.arrayElement([
          'CBE',
          'Awash',
          'Dashen',
          'BoA',
          'NIB',
          'Wegagen',
          'Zemen',
          'telebirr',
          'helloCash',
          'CBE Birr',
        ]),
        branch: faker.helpers.arrayElement([
          'Addis Ababa',
          'Dire Dawa',
          'Adama',
          'Mekelle',
          'Bahir Dar',
          'Gonder',
          'Hawassa',
          'Jimma',
          'Dessie',
          'Jijiga',
          'Shashemene',
          'Arba Minch',
          'Gambela',
        ]),
        accountType: 'bank',
      };
    }
    if (
      userData.bankName === 'telebirr' ||
      userData.bankName === 'helloCash' ||
      userData.bankName === 'CBE Birr' ||
      userData.bankName === 'BoA'
    ) {
      userData.accountNumber = faker.phone.phoneNumber();
      userData.accountType = 'wallet';
    }

    const user = await User.create(userData);
    console.log('Inserted dummy data for User:', user);

    const pharmaciestID = await User.find({
      role: 'pharmaciest',
    }).select('_id');

    const customerIDs = await User.find({
      role: 'customer',
    }).select('_id');

    const superAdminIDs = await User.find({ role: 'superAdmin' }).select('_id');
    console.log('superAdminIDs:', superAdminIDs);

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
      cover: faker.image.urlPicsumPhotos({ height: 100, width: 500 }),
      socialMedia: {
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
        twitter: faker.internet.url(),
      },
    };

    const pharmacy = await Pharmacy.create(pharmacyData);
    console.log('Inserted dummy data for Pharmacy:', pharmacy);

    const categories = [
      'analgesics',
      'antibiotics',
      'antidepressants',
      'antihypertensives',
      'antipyretics',
      'antivirals',
      'bronchodilators',
      'diuretics',
      'hormones',
      'immunosuppressants',
      'laxatives',
      'muscle_relaxants',
      'narcotics',
      'nsaids',
      'sedatives',
      'stimulants',
      'tranquilizers',
      'antifungals',
      'antiemetics',
      'anticoagulants',
      'antidiabetics',
      'antiemetics',
      'antinauseants',
      'antipsychotics',
      'antiseptics',
      'antispasmodics',
      'antitussives',
      'expectorants',
      'antimalarials',
      'antiparasitics',
      'antiseizure_medications',
      'antiglaucoma_medications',
      'antiemetics',
      'immunoglobulins',
      'vitamins',
      'minerals',
      'homeopathic_remedies',
      'herbal_supplements',
      'probiotics',
      'dietary_supplements',
      'topical_steroids',
      'topical_antifungals',
      'topical_antibiotics',
      'topical_analgesics',
      'topical_antiseptics',
      'topical_acne_medications',
      'topical_corticosteroids',
      'topical_retinoids',
    ];
    const pharmacyId = await Pharmacy.find().select('_id');
    // Insert dummy data for Notification if stockLevel <= minStockLevel
    const drugData = {
      pharmacyId: faker.helpers.arrayElement(pharmacyId),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(categories),
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
    const customerid = faker.helpers.arrayElement(customerIDs);
    const deliveryAddress = await User.findOne({ _id: customerid }).select(
      'deliveryAddress'
    );
    const orderData = {
      orderedTo: faker.helpers.arrayElement(pharmacyId),
      orderedBy: customerid,
      drugId: faker.helpers.arrayElement(drugId),
      quantity: faker.number.int({ min: 1, max: 5 }),
      status: faker.helpers.arrayElement([
        'inprogress',
        'delivered',
        'aborted',
      ]),
      deliveryAddress: faker.helpers.arrayElement(
        deliveryAddress.deliveryAddress
      ),
      deliveryDate: faker.date.future(),
    };

    if (orderData.status === 'delivered') {
      const orderedDrug = await Drug.findOne({ _id: orderData.drugId });
      orderData.deliveredAt = Date.now();
      orderData.profit =
        orderData.quantity * (orderedDrug.price - orderedDrug.cost);
      const superAdminId = faker.helpers.arrayElement(superAdminIDs);
      const senderAccounts = await User.findOne({
        _id: superAdminId,
      }).select('account');
      const receiverAccounts = await User.findOne({
        _id: orderData.orderedTo,
      }).select('account');

      const transactionData = {
        sender: superAdminId,
        receiver: orderData.orderedTo,
        senderAccount: faker.helpers.arrayElement(senderAccounts.account),
        receiverAccount: faker.helpers.arrayElement(receiverAccounts.account),
        reason: 'order Payment to pharmacies',
      };
      const transaction = await Transaction.create(transactionData);
      console.log('Inserted dummy data for Transaction:', transaction);
      orderData.transactionId = transaction._id;
    }

    if (orderData.status === 'aborted') {
      orderData.abortedAt = Date.now();
      const superAdminId = faker.helpers.arrayElement(superAdminIDs);
      const senderAccounts = await User.findOne({
        _id: superAdminId,
      }).select('account');
      const receiverAccounts = await User.findOne({
        _id: orderData.orderedBy,
      }).select('account');
      const transactionData = {
        sender: orderData.orderedBy,
        receiver: superAdminId,
        senderAccount: faker.helpers.arrayElement(senderAccounts.account),
        receiverAccount: faker.helpers.arrayElement(receiverAccounts.account),
        reason: 'refund for aborted order',
      };
      const transaction = await Transaction.create(transactionData);
      console.log('Inserted dummy data for Transaction:', transaction);
      orderData.transactionId = transaction._id;
    }

    if (orderData.status === 'inprogress') {
      const senderAccounts = await User.findOne({
        _id: orderData.orderedBy,
      }).select('account');
      const superAdminId = faker.helpers.arrayElement(superAdminIDs);
      const receiverAccounts = await User.findOne({
        _id: superAdminId,
      }).select('account');
      const transactionData = {
        sender: orderData.orderedBy,
        receiver: superAdminId,
        senderAccount: faker.helpers.arrayElement(senderAccounts.account),
        receiverAccount: faker.helpers.arrayElement(receiverAccounts.account),
        reason: 'Order Payment',
      };
      const transaction = await Transaction.create(transactionData);
      console.log('Inserted dummy data for Transaction:', transaction);
      orderData.transactionId = transaction._id;
    }

    const order = await Order.create(orderData);
    console.log('Inserted dummy data for Order:', order);

    // Insert dummy data for Review
    const reviewData = {
      reviewedBy: faker.helpers.arrayElement(customerIDs),
      pharmacyId: faker.helpers.arrayElement(pharmacyId),
      rating: faker.number.float({ min: 0, max: 5 }),
      feedback: faker.lorem.paragraph(),
    };

    const review = await Review.create(reviewData);
    console.log('Inserted dummy data for Review:', review);

    // Insert dummy data for Feedback
    const feedbackData = {
      userId: faker.helpers.arrayElement(customerIDs.concat(pharmaciestID)),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
    };
    const feedback = await Feedback.create(feedbackData);
    console.log('Inserted dummy data for Feedback:', feedback);
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
};

export default insertDummyData;
