/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { v4 as uuid4 } from 'uuid';
import Drug from '../models/drugs';
import Order from '../models/orders';
import Pharmacy from '../models/pharmacies';
import Review from '../models/reviews';
import User from '../models/users';
import Transaction from '../models/transactions';
import Feedback from '../models/feedbacks';
import Stock from '../models/stocks';
import Notification from '../models/notifications';
import { calculateDistance, addMinutes } from '.';
import Cart from '../models/cart';

const insertDummyData = async () => {
  try {
    // Insert dummy data for User
    const hashedPassword = await bcrypt.hash('12345678', 10);
    const userData = {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      password: hashedPassword,
      email: faker.internet.email(),
      location: {
        type: 'Point',
        coordinates: [
          faker.location.longitude({ max: 42.8, min: 34.53333 }),
          faker.location.latitude({ max: 14.277, min: 4.05 }),
        ],
      },
      role: faker.helpers.arrayElement([
        'admin',
        'pharmacist',
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
      userData.deliveryAddress = [
        {
          address: faker.helpers.arrayElement(addresses),
          phoneNumber: faker.phone.number(),
          location: {
            type: 'Point',
            coordinates: [
              faker.location.longitude({ max: 40.4897, min: 34.53333 }),
              faker.location.latitude({ max: 9.145, min: 4.05 }),
            ],
          },
        },
      ];
    }

    if (userData.role === 'pharmacist') {
      userData.pharmacistLicense = faker.image.urlLoremFlickr();
    }

    const user = await User.create(userData);
    console.log('Inserted dummy data for User:', user);

    const pharmacistIDs = await User.find({
      role: 'pharmacist',
    }).select('_id');

    const customerIDs = await User.find({
      role: 'customer',
    }).select('_id');

    const adminIDs = await User.find({
      role: 'admin',
    }).select('_id');

    const coordinates = [
      [37.794870550915164, 8.211353690574859],
      [37.78830707604154, 8.209432058179084],
      [37.78830707604154, 8.209432058179084],
      [37.784197365038004, 8.285900090531689],
      [37.78653687882788, 8.297775941889617],
      [37.78955114801032, 8.283795742703491],
      [37.97831313690903, 8.546196199643733],
      [37.980322208654485, 8.532530773088192],
      [37.97831313690903, 8.546196199643733],
      [38.746011647657916, 9.013284113951018],
      [38.72933376994206, 9.016578080212906],
      [38.722911385598124, 9.030002617780667],
      [38.722911385698124, 9.130002617780667],
      [38.723911385598124, 9.330002617780667],
      [38.721911385598124, 9.230002617780667],
      [38.712911385598124, 9.530002617780667],
      [38.742911385598124, 9.030002617780667],
      [38.722911385598124, 9.630002617780667],
      [38.722911385598124, 9.330002617780667],
      [38.722911385598124, 9.930002617780667],
    ];

    const accounts = [
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900123456',
        bankName: 'Awash Bank',
        accountType: 'Mobile Banking',
        branchName: 'Bole',
        bankCode: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900112233',
        bankName: 'Awash Bank',
        accountType: 'Mobile Banking',
        branchName: 'Bole',
        bankCode: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900881111',
        bankName: 'Awash Bank',
        accountType: 'Mobile Banking',
        branchName: 'Bole',
        bankCode: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900123456',
        bankName: 'telebirr',
        accountType: 'Mobile Banking',
        bankCode: '853d0598-9c01-41ab-ac99-48eab4da1513',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900112233',
        bankName: 'telebirr',
        accountType: 'Mobile Banking',
        branchName: 'Bole',
        bankCode: '853d0598-9c01-41ab-ac99-48eab4da1513',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900881111',
        bankName: 'telebirr',
        accountType: 'Mobile Banking',
        branchName: 'Bole',
        bankCode: '853d0598-9c01-41ab-ac99-48eab4da1513',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900123456',
        bankName: 'CBEBirr',
        accountType: 'Mobile Banking',
        branchName: 'Wolkite',
        bankCode: '153d0598-4e01-41ab-a693-t9e2g4da6u13',
      },
      {
        accountHolderName: faker.finance.accountName(),
        accountNumber: '0900881111',
        bankName: 'CBEBirr',
        accountType: 'Mobile Banking',
        branchName: 'Wolkite',
        bankCode: '153d0598-4e01-41ab-a693-t9e2g4da6u13',
      },
    ];
    const names = [
      'MedLife Pharmacy',
      'HealthPlus Pharmacy',
      'Family Pharmacy',
      'City Pharmacy',
      'CareWell Pharmacy',
      'PharmaCare',
      'MediMart Pharmacy',
      'Wellness Pharmacy',
      'MediHealth Pharmacy',
      'LifeLine Pharmacy',
      'MediCentre Pharmacy',
      'CareOne Pharmacy',
      'Apex Pharmacy',
      'Prime Pharmacy',
      'Sunrise Pharmacy',
      'Metro Pharmacy',
      'Sunset Pharmacy',
      'GoodHealth Pharmacy',
      'PillBox Pharmacy',
      'Essential Pharmacy',
      'MediQuick Pharmacy',
      'Relief Pharmacy',
      'MediSave Pharmacy',
      'HappyCare Pharmacy',
      'Vitality Pharmacy',
      'TotalCare Pharmacy',
      'Friendly Pharmacy',
      'HealthFirst Pharmacy',
      'MediPro Pharmacy',
      'QuickRelief Pharmacy',
      'Sunshine Pharmacy',
      'MediLink Pharmacy',
      'Express Pharmacy',
      'CareZone Pharmacy',
      'MediWorld Pharmacy',
      'Quality Pharmacy',
      'QuickCare Pharmacy',
      'HappyDays Pharmacy',
      'FastRelief Pharmacy',
      'SunnyDay Pharmacy',
      'WellCare Pharmacy',
      'HelpingHand Pharmacy',
      'PharmaPlus Pharmacy',
      'Spring Pharmacy',
      'QuickSave Pharmacy',
      'LifeCare Pharmacy',
      'Pioneer Pharmacy',
      'Reliable Pharmacy',
      'SunsetStrip Pharmacy',
      'PharmaHouse Pharmacy',
      'BetterHealth Pharmacy',
      'Apothecary Pharmacy',
      'MediMagic Pharmacy',
      'HealthWise Pharmacy',
      'MediNet Pharmacy',
      'PrimeCare Pharmacy',
      'SunsetView Pharmacy',
      'NorthStar Pharmacy',
      'FirstAid Pharmacy',
      'ComfortCare Pharmacy',
      'SunsetValley Pharmacy',
      'CareMark Pharmacy',
      'SunriseSunset Pharmacy',
      'UrbanCare Pharmacy',
      'SunsetBoulevard Pharmacy',
      'GoldenGate Pharmacy',
      'HomeTown Pharmacy',
      'SunsetHills Pharmacy',
      'MediCenter Pharmacy',
      'SunsetVillage Pharmacy',
      'PioneerPlaza Pharmacy',
      'Everyday Pharmacy',
      'MediPlex Pharmacy',
      'SunsetGrove Pharmacy',
      'HealthHub Pharmacy',
      'GreenHills Pharmacy',
      'MediCove Pharmacy',
      'SunsetMeadows Pharmacy',
      'Community Pharmacy',
      'SunsetPark Pharmacy',
      'Heartland Pharmacy',
      'MediPoint Pharmacy',
      'SunsetCrest Pharmacy',
      'SunsetLane Pharmacy',
      'MediLane Pharmacy',
      'SunsetRidge Pharmacy',
      'SunsetPlace Pharmacy',
      'SunsetDrive Pharmacy',
      'MediSquare Pharmacy',
      'SunsetHeights Pharmacy',
      'SunsetTerrace Pharmacy',
      'SunsetWay Pharmacy',
      'MediPlaza Pharmacy',
      'SunsetAvenue Pharmacy',
      'MediVillage Pharmacy',
      'SunsetStreet Pharmacy',
      'SunsetCircle Pharmacy',
      'SunsetCourt Pharmacy',
      'SunsetPath Pharmacy',
      'SunsetTrail Pharmacy',
    ];
    const address = [
      'Belay Zeleke St, Addis Ababa, Ethiopia',
      'Bole Medhanealem St, Addis Ababa, Ethiopia',
      'Kazanchis Rd, Addis Ababa, Ethiopia',
      'Arada Subcity, Woreda 01, Addis Ababa, Ethiopia',
      '22 Mazoria, Addis Ababa, Ethiopia',
      'Gurd Shola Rd, Addis Ababa, Ethiopia',
      'Kasanchis, Addis Ababa, Ethiopia',
      'Bole Rd, Addis Ababa, Ethiopia',
      'Mexico Square, Addis Ababa, Ethiopia',
      'Gurd Shola, Addis Ababa, Ethiopia',
      'Piassa, Addis Ababa, Ethiopia',
      'Megenagna, Addis Ababa, Ethiopia',
      'CMC, Addis Ababa, Ethiopia',
      '22 Mazoria, Addis Ababa, Ethiopia',
      'Abo Kirkos, Addis Ababa, Ethiopia',
      'Gullele, Addis Ababa, Ethiopia',
      'Sar Bet, Addis Ababa, Ethiopia',
      'Addis Ketema, Addis Ababa, Ethiopia',
      'Kirkos Subcity, Addis Ababa, Ethiopia',
      'Kirkos, Addis Ababa, Ethiopia',
      '22 Mazoria, Addis Ababa, Ethiopia',
      'Bole Subcity, Addis Ababa, Ethiopia',
      'Gerji, Addis Ababa, Ethiopia',
      'Gerji Sefer, Addis Ababa, Ethiopia',
      'Kolfe Keranio Subcity, Addis Ababa, Ethiopia',
      'Gotera, Addis Ababa, Ethiopia',
      'Addis Ketema Subcity, Addis Ababa, Ethiopia',
      'Yeka Subcity, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Goro, Addis Ababa, Ethiopia',
      'Lafto, Addis Ababa, Ethiopia',
      'Lafto Subcity, Addis Ababa, Ethiopia',
      'Yeka, Addis Ababa, Ethiopia',
      '22 Mazoria, Addis Ababa, Ethiopia',
      'Lideta Subcity, Addis Ababa, Ethiopia',
      'Nifas Silk-Lafto Subcity, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kirkos, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Nifas Silk-Lafto, Addis Ababa, Ethiopia',
      'Yeka, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole Subcity, Addis Ababa, Ethiopia',
      'Akaky Kaliti Subcity, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Kirkos, Addis Ababa, Ethiopia',
      'Lideta, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Gullele Subcity, Addis Ababa, Ethiopia',
      'Kolfe Keranio Subcity, Addis Ababa, Ethiopia',
      'Lideta Subcity, Addis Ababa, Ethiopia',
      'Gullele, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Arada, Addis Ababa, Ethiopia',
      'Arada Subcity, Addis Ababa, Ethiopia',
      'Arada Subcity, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Addis Ketema, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Addis Ketema, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kirkos, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kirkos, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Arada, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Addis Ketema, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Arada, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Addis Ketema, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Kolfe Keranio, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
      'Bole, Addis Ababa, Ethiopia',
    ];

    // Insert dummy data for Pharmacy
    const pharmacyData = {
      name: faker.helpers.arrayElement(names),
      address: faker.helpers.arrayElement(address),
      location: {
        type: 'Point',
        coordinates: faker.helpers.arrayElement(coordinates),
      },
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      pharmacistId: faker.helpers.arrayElement(pharmacistIDs),
      assignedTo: faker.helpers.arrayElement(adminIDs),
      about: faker.lorem.paragraph(),
      logo: faker.image.urlPicsumPhotos({ height: 100, width: 100 }),
      cover: faker.image.urlPicsumPhotos({ height: 100, width: 500 }),
      socialMedia: {
        facebook: faker.internet.url(),
        instagram: faker.internet.url(),
        twitter: faker.internet.url(),
      },
      pharmacyLicense: faker.image.urlPicsumPhotos({ height: 100, width: 500 }),
      deliveryPricePerKm: faker.number.float({ min: 0, max: 100 }),
      deliveryCoverage: faker.number.float({ min: 1000, max: 1000000 }),
      hasDeliveryService: faker.datatype.boolean(),
      minDeliveryTime: faker.number.int({ min: 30, max: 3000 }),
      maxDeliveryTime: faker.number.int({ min: 100, max: 10000 }),
      status: faker.helpers.arrayElement([
        'pending',
        'approved',
        'rejected',
        'deactivated',
        'unassigned',
      ]),
      account: faker.helpers.arrayElement(accounts),
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
    const drugNames = [
      'Paracetamol',
      'Ibuprofen',
      'Aspirin',
      'Amoxicillin',
      'Ciprofloxacin',
      'Metformin',
      'Lisinopril',
      'Atorvastatin',
      'Omeprazole',
      'Metronidazole',
      'Azithromycin',
      'Diazepam',
      'Simvastatin',
      'Tramadol',
      'Warfarin',
      'Insulin',
      'Prednisone',
      'Furosemide',
      'Prednisolone',
      'Levothyroxine',
      'Losartan',
      'Cephalexin',
      'Amlodipine',
      'Doxycycline',
      'Fluoxetine',
      'Gliclazide',
      'Ranitidine',
      'Esomeprazole',
      'Fluconazole',
      'Hydrochlorothiazide',
      'Acetaminophen',
      'Naproxen',
      'Clarithromycin',
      'Clopidogrel',
      'Montelukast',
      'Pantoprazole',
      'Metoclopramide',
      'Amitriptyline',
      'Tamsulosin',
      'Cetirizine',
      'Salbutamol',
      'Levofloxacin',
      'Aripiprazole',
      'Sildenafil',
      'Atenolol',
      'Fentanyl',
      'Duloxetine',
      'Mirtazapine',
      'Gabapentin',
      'Allopurinol',
      'Dexamethasone',
      'Cyclobenzaprine',
      'Risperidone',
      'Venlafaxine',
      'Carvedilol',
      'Methotrexate',
      'Lorazepam',
      'Hydrocodone',
      'Fluticasone',
      'Quetiapine',
      'Metoprolol',
      'Doxazosin',
      'Bupropion',
      'Cloxacillin',
      'Dapoxetine',
      'Amiodarone',
      'Enalapril',
      'Tetracycline',
      'Ketorolac',
      'Celecoxib',
      'Ezetimibe',
      'Permethrin',
      'Nifedipine',
      'Tadalafil',
      'Budesonide',
      'Clotrimazole',
      'Pioglitazone',
      'Carbamazepine',
      'Olanzapine',
      'Citalopram',
      'Miconazole',
      'Desloratadine',
      'Rosuvastatin',
      'Risperdal',
      'Sotalol',
      'Lamotrigine',
      'Phenobarbital',
      'Morphine',
      'Valsartan',
      'Chlorpheniramine',
      'Levetiracetam',
      'Fluvoxamine',
      'Ondansetron',
      'Baclofen',
      'Clonazepam',
      'Diclofenac',
      'Zolpidem',
      'Hydrocortisone',
      'Tretinoin',
      'Oxybutynin',
      'Nystatin',
      'Thyroxine',
      'Escitalopram',
      'Clobetasol',
      'Amphetamine',
    ];

    const strengths = [
      '10 mg',
      '20 mg',
      '50 mg',
      '100 mg',
      '200 mg',
      '500 mg',
      '1 g',
      '2 g',
      '5 g',
      '10 g',
      '25 mg/mL',
      '50 mg/mL',
      '100 mg/mL',
      '200 mg/mL',
      '500 mg/mL',
      '1 mg/mL',
      '2 mg/mL',
      '5 mg/mL',
      '10 mg/mL',
      '20 mg/mL',
      '50 mg/5 mL',
      '100 mg/5 mL',
      '200 mg/5 mL',
      '500 mg/5 mL',
      '1 g/5 mL',
      '10 mg/10 mL',
      '20 mg/10 mL',
      '50 mg/10 mL',
      '100 mg/10 mL',
      '200 mg/10 mL',
      '500 mg/10 mL',
      '1 g/10 mL',
      '5 g/10 mL',
      '10 g/10 mL',
      '20 g/10 mL',
      '25 mg/1 g',
      '50 mg/1 g',
      '100 mg/1 g',
      '200 mg/1 g',
      '500 mg/1 g',
      '1 g/1 g',
      '2 g/1 g',
      '5 g/1 g',
      '10 g/1 g',
      '20 g/1 g',
      '50 mg/100 mL',
      '100 mg/100 mL',
      '200 mg/100 mL',
      '500 mg/100 mL',
      '1 g/100 mL',
      '10 mg/100 mL',
      '20 mg/100 mL',
      '50 mg/100 mL',
      '100 mg/100 mL',
      '200 mg/100 mL',
      '500 mg/100 mL',
      '1 g/100 mL',
      '2 g/100 mL',
      '5 g/100 mL',
      '10 g/100 mL',
      '20 g/100 mL',
    ];

    const dosages = [
      'Once daily',
      'Twice daily',
      'Three times daily',
      'Four times daily',
      'Every 6 hours',
      'Every 8 hours',
      'Every 12 hours',
      'Every 24 hours',
      'Every other day',
      'Once weekly',
      'Twice weekly',
      'Three times weekly',
      'Four times weekly',
      'Once monthly',
      'Twice monthly',
      'As needed',
      'Before meals',
      'After meals',
      'With food',
      'Without food',
      'At bedtime',
      'Morning and evening',
      'Morning, afternoon, and evening',
      'At noon',
      'In the morning',
      'In the afternoon',
      'In the evening',
      'Every 2 hours',
      'Every 3 hours',
      'Every 4 hours',
      'Every 5 hours',
      'Every 7 hours',
      'Every 9 hours',
      'Every 10 hours',
      'Every 11 hours',
      'Every 16 hours',
      'Every 18 hours',
      'Every 20 hours',
      'Every 36 hours',
      'Every 48 hours',
    ];

    // Insert dummy data for Notification if stockLevel <= minStockLevel
    const drugData = {
      pharmacyId: faker.helpers.arrayElement(pharmacyId),
      name: faker.helpers.arrayElement(drugNames),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(categories),
      price: faker.number.float({ min: 500, max: 1000000 }),
      cost: faker.number.float({ min: 100, max: 10000 }),
      stockLevel: faker.number.int({ min: 0, max: 10000 }),
      minStockLevel: faker.number.int({ min: 200, max: 1000 }),
      recivedFrom: faker.company.name(),
      instruction: faker.lorem.paragraph(),
      sideEffects: faker.lorem.paragraph(),
      strength: faker.helpers.arrayElement(strengths),
      dosage: faker.helpers.arrayElement(dosages),
      needPrescription: faker.datatype.boolean(),
      drugPhoto: [
        'https://fakeimg.pl/150x150/bdbdbd/ffffff?text=Drug+Photo&font=noto',
        faker.image.urlLoremFlickr({ category: 'medicin' }),
        faker.image.urlLoremFlickr({ category: 'medicin' }),
      ],
      status: 'available',
    };

    const drug = await Drug.create(drugData);
    console.log('Inserted dummy data for Drug:', drug);
    const drugId = await Drug.find().select('_id');
    const drugSources = [
      'Ethiopian Pharmaceuticals Manufacturing Factory (EPHARM)',
      'Private Pharmaceutical Importers and Distributors',
      'Ethiopian Pharmaceutical Supply Agency (EPSA)',
      'International Aid Organizations (e.g., UNICEF, WHO)',
      'Non-Governmental Organizations (NGOs) providing medical assistance',
      'Ethiopian Medical Stores Enterprise (EMSE)',
      'Donor Programs supporting healthcare initiatives',
      'Government Health Facilities (e.g., hospitals, clinics)',
      'Pharmaceutical Manufacturers in other countries',
      'Cooperative Pharmacies or Pharmacy Networks',
    ];
    const stockData = {
      drugId: faker.helpers.arrayElement(drugId),
      price: faker.number.int({ min: 20, max: 1000 }),
      cost: faker.number.int({ min: 10, max: 500 }),
      quantity: faker.number.int({ min: 0, max: 1000 }),
      currentQuantity: faker.number.int({ min: 0, max: 1000 }),
      recievedFrom: faker.helpers.arrayElement(drugSources),
      batchNumber: faker.string.numeric(10),
      expiredDate: faker.date.future(),
    };
    const stock = await Stock.create(stockData);
    console.log('Inserted dummy data for Stock:', stock);
    // Insert dummy data for Order
    const customerid = faker.helpers.arrayElement(customerIDs);
    const customer = await User.findOne({ _id: customerid });

    const orderDrug = await Drug.findOne({ _id: stock.drugId });
    const orederTopharmacy = await Pharmacy.findOne({
      _id: orderDrug.pharmacyId,
    });

    const drugs = [
      {
        drugId: stock.drugId,
        stockId: stock._id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: stock.price,
        drugName: orderDrug.name,
      },
      {
        drugId: stock.drugId,
        stockId: stock._id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: stock.price,
        drugName: orderDrug.name,
      },
      {
        drugId: stock.drugId,
        stockId: stock._id,
        quantity: faker.number.int({ min: 1, max: 5 }),
        price: stock.price,
        drugName: orderDrug.name,
      },
    ];

    let toqty = 0;
    let totAmount = 0;
    let totalCost = 0;

    drugs.forEach((drg) => {
      toqty += drg.quantity;
      totAmount += drg.quantity * drg.price;
      totalCost += drg.quantity * stock.cost;
    });

    const orderData = {
      orderedTo: orederTopharmacy._id,
      orderedBy: customerid,
      drugs,
      quantity: toqty,
      hasDelivery: faker.datatype.boolean(),
      totalAmount: totAmount,
      profit: totAmount - totalCost,
      status: faker.helpers.arrayElement([
        'inprogress',
        'delivered',
        'expired',
        'rejected',
        'pending',
        'refunded',
      ]),
    };

    if (orderData.hasDelivery) {
      const dExpireDate = addMinutes(
        new Date(),
        orederTopharmacy.maxDeliveryTime
      );
      const deAddress = faker.helpers.arrayElement(customer.deliveryAddress);
      const distance = calculateDistance({
        lat1: deAddress.location.coordinates[1],
        long1: deAddress.location.coordinates[0],
        lat2: orederTopharmacy.location.coordinates[1],
        long2: orederTopharmacy.location.coordinates[0],
      });
      orderData.deliveryAddress = deAddress;
      orderData.deliveryDistance = distance;
      orderData.deliveryFee = distance * orederTopharmacy.deliveryPricePerKm;
      orderData.totalAmount += orderData.deliveryFee;
      orderData.deliveryExpireDate = dExpireDate;
      orderData.profit += orderData.deliveryFee;
    }

    const order = await Order.create(orderData);
    console.log('Inserted dummy data for Order:', order);

    if (order.status === 'delivered') {
      const transactionData = {
        receiverPharmacy: order.orderedTo,
        senderAccount: {
          accountHolderName: 'Medicine Locator System',
          accountNumber: 'Chapa system',
        },
        receiverAccount: orederTopharmacy.account,
        reason: 'pharmacy-payment',
        amount: orderData.totalAmount,
        orderId: order._id,
        tx_ref: uuid4(),
      };
      const transaction = await Transaction.create(transactionData);
      console.log('Inserted dummy data for Transaction:', transaction);
    }

    if (order.status === 'pending') {
      const transactionData = {
        sender: customer._id,
        senderAccount: {
          accountHolderName: customer.name,
          accountNumber: '0900123456',
          bankName: 'Awash Bank',
          accountType: 'Mobile Banking',
          branchName: 'Wolkite',
          bankCode: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
        },
        receiverAccount: {
          accountHolderName: 'Medicine Locator System',
          accountNumber: 'Chapa system',
        },
        reason: 'order-payment',
        amount: orderData.totalAmount,
        orderId: order._id,
        tx_ref: uuid4(),
      };
      const transaction = await Transaction.create(transactionData);
      console.log('Inserted dummy data for Transaction:', transaction);
      orderData.transactionId = transaction._id;
    }

    if (order.status === 'refunded') {
      const transactionData = {
        receiverPharmacy: customer._id,
        senderAccount: {
          accountHolderName: 'Medicine Locator System',
          accountNumber: 'Chapa system',
        },
        receiverAccount: {
          accountHolderName: customer.name,
          accountNumber: '0900123456',
          bankName: 'Awash Bank',
          accountType: 'Mobile Banking',
          branchName: 'Wolkite',
          bankCode: '80a510ea-7497-4499-8b49-ac13a3ab7d07',
        },
        reason: 'refund',
        amount: order.totalAmount,
        orderId: order._id,
        tx_ref: uuid4(),
      };
      const transaction = await Transaction.create(transactionData);
      console.log('Inserted dummy data for Transaction:', transaction);
      orderData.transactionId = transaction._id;
    }

    const cartData = {
      userId: faker.helpers.arrayElements(customerIDs),
      pharmacyId: faker.helpers.arrayElements(pharmacyId),
      pharmacyName: orederTopharmacy.name,
      drugs,
      totalQuantity: toqty,
      totalPrice: totAmount,
    };

    const cart = await Cart.create(cartData);
    console.log('Inserted dummy data for Cart:', cart);

    // Insert dummy data for Notification
    const notificationData = {
      userId: faker.helpers.arrayElement(customerIDs.concat(pharmacistIDs)),
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      type: faker.helpers.arrayElement(['info', 'warning', 'error', 'success']),
      isRead: faker.datatype.boolean(),
    };

    const notification = await Notification.create(notificationData);
    console.log('Inserted dummy data for Notification:', notification);
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
      userId: faker.helpers.arrayElement(customerIDs.concat(pharmacistIDs)),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      type: faker.helpers.arrayElement(['complaint', 'suggestion', 'question']),
    };
    const feedback = await Feedback.create(feedbackData);
    console.log('Inserted dummy data for Feedback:', feedback);
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
};

export default insertDummyData;
