import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

const grantList = [
  {
    role: 'admin',
    resource: 'user',
    action: 'create:any',
    attributes: '*',
  },

  {
    role: 'pharmaciest',
    resource: 'product',
    action: 'create:any',
    attributes: '*',
  },

  {
    role: 'customer',
    resource: 'product',
    action: 'read:own',
    attributes: '*',
  },
];

ac.setGrants(grantList);

export default ac;
