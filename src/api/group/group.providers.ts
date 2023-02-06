import { Group } from 'src/db/models/group.models';

export const groupProviders = [
  {
    provide: 'GROUP_REPOSITORY',
    useValue: Group,
  },
];
