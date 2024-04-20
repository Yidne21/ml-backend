import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

const grantList = [
  // read access to resource users
  {
    role: ['customer', 'pharmaciest', 'admin', 'superAdmin'],
    resource: ['users'],
    action: 'read:own',
    attributes: ['*'],
  },
  {
    role: ['superAdmin', 'admin'],
    resource: ['users'],
    action: 'read:any',
    attributes: ['*', '!password', '!deliveryAddress', '!location', '!address'],
  },
  // update access to resource users
  {
    role: ['admin', 'superAdmin', 'pharmaciest', 'customer'],
    resource: ['users'],
    action: 'update:own',
    attributes: [
      '*',
      '!email',
      '!role',
      '!emailVerified',
      '!pharmaciestLicense',
    ],
  },
  {
    role: ['superAdmin', 'admin'],
    resource: ['users'],
    action: 'update:any',
    attributes: ['status'],
  },

  // create access to resource users
  {
    role: ['superAdmin'],
    resource: ['users'],
    action: 'create:any',
    attributes: ['name', 'email', 'password', 'role'],
  },
  {
    role: ['superAdmin', 'pharmaciest', 'customer'],
    resource: ['users'],
    action: 'create:own',
    attributes: ['*'],
  },
  //  access to resource notifications
  {
    role: ['superAdmin', 'admin', 'pharmaciest', 'customer'],
    resource: ['notifications'],
    action: 'read:own',
    attributes: ['*'],
  },
  {
    role: ['superAdmin', 'admin', 'pharmaciest', 'customer'],
    resource: ['notifications'],
    action: 'update:own',
    attributes: ['*'],
  },
  {
    role: ['superAdmin', 'admin', 'pharmaciest', 'customer'],
    resource: ['notifications'],
    action: 'delete:own',
    attributes: ['*'],
  },

  // read access to resource feedbacks
  {
    role: ['admin', 'superAdmin'],
    resource: ['feedbacks'],
    action: 'read:any',
    attributes: ['*'],
  },
  {
    role: ['admin', 'customer', 'pharmaciest', 'superAdmin'],
    resource: ['feedbacks'],
    action: 'read:own',
    attributes: ['*'],
  },

  // create access to resource feedbacks
  {
    role: ['admin', 'customer', 'pharmaciest', 'superAdmin'],
    resource: ['feedbacks'],
    action: 'create:own',
    attributes: ['*'],
  },

  // update access to resource feedbacks
  {
    role: ['admin', 'customer', 'pharmaciest', 'superAdmin'],
    resource: ['feedbacks'],
    action: 'update:own',
    attributes: ['*'],
  },
  {
    role: ['admin', 'superAdmin'],
    resource: ['feedbacks'],
    action: 'update:any',
    attributes: ['*'],
  },

  // read acess to resource drugs
  {
    role: ['customer'],
    resource: ['drugs'],
    action: 'read:any',
    attributes: ['*', '!minStoclLevel', '!totalSale', '!profit'],
  },

  // read access to resource pharmacies
  {
    role: ['customer', 'admin', 'superAdmin'],
    resource: ['pharmacies'],
    action: 'read:any',
    attributes: ['*'],
  },
  // update access to resource pharmacies
  {
    role: ['superAdmin', 'admin'],
    resource: ['pharmacies'],
    action: 'update:any',
    attributes: ['status'],
  },

  // read access to resource transaction
  {
    role: ['customer', 'pharmaciest'],
    resource: ['transaction'],
    action: 'read:own',
    attributes: ['*'],
  },
  {
    role: ['superAdmin', 'admin'],
    resource: ['transaction'],
    action: 'read:any',
    attributes: ['*', '!receiverAccount'],
  },

  // create access to resource reviews
  {
    role: ['superAdmin', 'admin', 'customer'],
    resource: ['reviews'],
    action: 'read:any',
    attributes: ['*'],
  },
  {
    role: ['customer'],
    resource: ['reviews'],
    action: 'create:own',
    attributes: ['*'],
  },

  // multiple resources acess to pharmaciest
  {
    role: ['pharmaciest'],
    resource: ['drugs', 'orders', 'stocks', 'pharmacies'],
    action: 'update:own',
    attributes: ['*'],
  },
  {
    role: ['pharmaciest'],
    resource: ['drugs', 'orders', 'stocks'],
    action: 'delete:own',
    attributes: ['*'],
  },
  {
    role: ['pharmaciest'],
    resource: ['drugs', 'orders', 'stocks', 'pharmacies', 'reviews'],
    action: 'read:own',
    attributes: ['*'],
  },

  // multiple resources acess to customer
  {
    role: ['customer'],
    resource: ['carts', 'orders'],
    action: 'read:own',
    attributes: ['*'],
  },
  {
    role: ['customer'],
    resource: ['carts'],
    action: 'update:own',
    attributes: ['*'],
  },
  {
    role: ['customer'],
    resource: ['orders'],
    action: 'update:own',
    attributes: ['status'], // if not delivered on time
  },
  {
    role: ['customer'],
    resource: ['carts', 'orders'],
    action: 'create:own',
    attributes: ['*'],
  },
  {
    role: ['customer'],
    resource: ['carts'],
    action: 'delete:own',
    attributes: ['*'],
  },
  {
    role: ['customer'],
    resource: ['stocks'],
    action: 'read:any',
    attributes: ['*', '!quantity'],
  },

  // access to rolesPermissions resource
  {
    role: ['superAdmin'],
    resource: ['rolesPermissions'],
    action: 'read:any',
    attributes: ['*'],
  },
  {
    role: ['superAdmin'],
    resource: ['rolesPermissions'],
    action: 'update:any',
    attributes: ['*'],
  },
  {
    role: ['superAdmin'],
    resource: ['rolesPermissions'],
    action: 'delete:any',
    attributes: ['*'],
  },
  {
    role: ['superAdmin'],
    resource: ['rolesPermissions'],
    action: 'create:any',
    attributes: ['*'],
  },
];

ac.setGrants(grantList);

export default ac;
