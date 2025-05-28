export interface MenuItem {
  id?: number;
  label?: any;
  icon?: string;
  link?: string;
  subItems?: any;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  allowedRoles?: number[];
  allowedApps?: AppNames[];
}

export enum AppNames {
  EREPORT = 'ereport',
  CCTV = 'cctv',
  UNIFORM = 'uniform',
  CILT = 'cilt',
  LUBRICATION = 'c-go',
  PROD_COST = 'production-cost',
  SCHEDULE_END_CYCLE = 'schedule-end-cycle',
}
