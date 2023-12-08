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
    role: 'encoder',
    resource: 'product',
    action: 'create:any',
    attributes: '*',
  },

  {
    role: 'sales',
    resource: 'product',
    action: 'read:own',
    attributes: '*',
  },
];

ac.setGrants(grantList);

export default ac;
