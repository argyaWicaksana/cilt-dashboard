import { AppNames, MenuItem } from "./menu.model";

const BASE_URL = "/ereport";
const BASE_URL_CCTV = "/cctv";
const BASE_URL_UNIFORM = "/uniform";
const BASE_URL_CILT = "/cilt";
const BASE_URL_LUBRICATION = "/c-go";
const BASE_URL_PROD_COST = "/production-cost";
const BASE_URL_SCHEDULE_END = "/schedule-end-cycle";

// TODO: create variable for roles
// const roles = {
//   am: {
//     admin: 99,
//     operator: 1
//   }
// }

export const MENU_EREPORT: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "OC1",
    icon: "ri-u-disk-line",
    allowedRoles: [1, 2, 3, 4, 5, 6, 7],
    allowedApps: [AppNames.EREPORT],
    subItems: [
      {
        id: 3,
        label: "Preparation",
        link: BASE_URL + "/oc1/preparation",
        parentId: 2,
        allowedRoles: [1, 2, 3],
      },
      {
        id: 4,
        label: "Injection",
        link: BASE_URL + "/oc1/injection",
        parentId: 2,
        allowedRoles: [1, 2, 4],
      },
      {
        id: 5,
        label: "BlowFill",
        link: BASE_URL + "/oc1/blowfill",
        parentId: 2,
        allowedRoles: [1, 2, 5],
      },
      {
        id: 6,
        label: "Packing",
        link: BASE_URL + "/oc1/packing",
        parentId: 2,
        allowedRoles: [1, 2, 6],
      },
      {
        id: 7,
        label: "Packer",
        link: BASE_URL + "/oc1/packer",
        parentId: 2,
        allowedRoles: [1, 2, 7],
      },
    ],
  },
  {
    id: 8,
    label: "OC2",
    icon: "ri-u-disk-line",
    allowedRoles: [1, 2, 3, 9, 10, 11, 7],
    allowedApps: [AppNames.EREPORT],
    subItems: [
      {
        id: 9,
        label: "Preparation",
        link: BASE_URL + "/oc2/preparation",
        parentId: 8,
        allowedRoles: [1, 2, 3],
      },
      {
        id: 10,
        label: "Injection",
        link: BASE_URL + "/oc2/injection",
        parentId: 8,
        allowedRoles: [1, 2, 9],
      },
      {
        id: 11,
        label: "BlowFill",
        link: BASE_URL + "/oc2/blowfill",
        parentId: 8,
        allowedRoles: [1, 2, 10],
      },
      {
        id: 12,
        label: "Packing",
        link: BASE_URL + "/oc2/packing",
        parentId: 8,
        allowedRoles: [1, 2, 11],
      },
      {
        id: 13,
        label: "Packer",
        link: BASE_URL + "/oc2/packer",
        parentId: 8,
        allowedRoles: [1, 2, 7],
      },
      {
        id: 14,
        label: "Weighing",
        link: BASE_URL + "/oc2/weighing",
        parentId: 8,
        allowedRoles: [1, 2, 7],
      },
    ],
  },
  {
    id: 14,
    label: "Security",
    icon: "ri-shield-user-line",
    allowedRoles: [1, 2],
    allowedApps: [AppNames.EREPORT],
    subItems: [
      {
        id: 13,
        label: "User Level Permission",
        link: BASE_URL + "/security/userlevelpermission",
        parentId: 8,
      },
      {
        id: 13,
        label: "User Levels",
        link: BASE_URL + "/security/userlevels",
        parentId: 8,
      },
      {
        id: 13,
        label: "Table User",
        link: BASE_URL + "/security/tableuser",
        parentId: 8,
      },
      {
        id: 13,
        label: "V PHP MS LOGIN",
        link: BASE_URL + "/security/vphpmslogin",
        parentId: 8,
      },
    ],
  },
  {
    id: 15,
    label: "Item Projects",
    icon: "ri-stack-line",
    allowedRoles: [66, 666],
    allowedApps: [AppNames.EREPORT],
    subItems: [
      {
        id: 16,
        label: "Dashboard",
        link: BASE_URL + "/item-projects",
        parentId: 15,
      },
      {
        id: 17,
        label: "Reporting",
        link: BASE_URL + "/item-projects/reporting",
        parentId: 15,
      },
    ],
  },
  {
    id: 16,
    label: "Progress Improvement",
    icon: "ri-line-chart-line",
    allowedRoles: [55, 551, 552, 553],
    allowedApps: [AppNames.EREPORT],
    subItems: [
      {
        id: 16,
        label: "Dashboard",
        link: BASE_URL + "/progress_improvement",
        parentId: 16,
      },
      // {
      //   id: 18,
      //   label: "Next Activity",
      //   link: BASE_URL + "/progress_improvement/next_activity",
      //   parentId: 16,
      // },
    ],
  },
  {
    id: 16,
    label: "Morning Meeting",
    icon: "ri-sun-line",
    allowedRoles: [56],
    allowedApps: [AppNames.EREPORT],
    link: BASE_URL + "/morning-meeting",
  },
  {
    id: 57,
    label: "User Management",
    icon: "ri-user-settings-line",
    allowedRoles: [2],
    allowedApps: [AppNames.EREPORT],
    link: BASE_URL + "/user-management",
  },
];

export const MENU_CCTV: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "Area",
    icon: "ri-u-disk-line",
    link: BASE_URL_CCTV + "/area",
    allowedApps: [AppNames.CCTV],
    allowedRoles: [2],
  },
  {
    id: 8,
    label: "Monitoring",
    icon: "ri-u-disk-line",
    link: BASE_URL_CCTV + "/monitoring",
  },
];

export const MENU_UNIFORM: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "Stock Uniform",
    icon: "ri-table-line",
    link: BASE_URL_UNIFORM + "/",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1, 2, 3],
  },
  {
    id: 3,
    label: "Transaksi",
    icon: "ri-u-disk-line",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1, 2, 3],
    subItems: [
      {
        id: 16,
        label: "Pemusnahan",
        link: BASE_URL_UNIFORM + "/pemusnahan-form",
        parentId: 15,
      },
      {
        id: 16,
        label: "Stock",
        link: BASE_URL_UNIFORM + "/stock-form",
        parentId: 15,
      },
    ],
  },
  {
    id: 4,
    label: "Detail Transaksi",
    icon: "ri-book-2-line",
    link: BASE_URL_UNIFORM + "/detail_transaction",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1, 2, 3],
  },
  {
    id: 33,
    label: "Approval",
    icon: "ri-chat-check-line",
    link: BASE_URL_UNIFORM + "/approval",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1, 2],
  },
  {
    id: 4,
    label: "Reporting Monthly",
    icon: "ri-slideshow-line",
    link: BASE_URL_UNIFORM + "/reporting-monthly",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1, 2, 3],
  },
  {
    id: 5,
    label: "Reporting Weekly",
    icon: "ri-slideshow-line",
    link: BASE_URL_UNIFORM + "/reporting-weekly",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1, 2, 3],
  },
  {
    id: 6,
    label: "Users",
    icon: " ri-team-line",
    link: BASE_URL_UNIFORM + "/users",
    allowedApps: [AppNames.UNIFORM],
    allowedRoles: [1],
  },
];

export const MENU_CILT: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "Dashboard",
    icon: "ri-dashboard-2-line",
    allowedApps: [AppNames.CILT],
    link: BASE_URL_CILT,
  },
  {
    id: 3,
    label: 'Master Data',
    icon: "ri-database-2-line",
    allowedApps: [AppNames.CILT],
    allowedRoles: [3, 99],
    subItems: [
      {
        id: 4,
        label: 'Master Pengecekan',
        link: BASE_URL_CILT + '/master-data/master-check',
        parentId: 3,
        allowedApps: [AppNames.CILT],
        allowedRoles: [3, 99]
      },
      {
        id: 5,
        label: 'Mapping User Area',
        link: BASE_URL_CILT + '/master-data/mapping-user-area',
        parentId: 3,
        allowedApps: [AppNames.CILT],
        allowedRoles: [99]
      },
    ],
  },
  {
    id: 6,
    label: "Pengecekan CILT",
    allowedRoles: [99, 1, 3],
    icon: "ri-checkbox-multiple-line",
    allowedApps: [AppNames.CILT],
    link: BASE_URL_CILT + "/cilt-check",
  },
  {
    id: 7,
    label: "Pengecekan Expired",
    allowedRoles: [99, 3],
    icon: "ri-alert-line",
    allowedApps: [AppNames.CILT],
    link: BASE_URL_CILT + "/expired-check",
  },
  {
    id: 8,
    label: "Laporan Pengecekan",
    icon: "ri-file-text-line",
    allowedApps: [AppNames.CILT],
    link: BASE_URL_CILT + "/report-check",
  },
  {
    id: 9,
    label: 'Stop Cycle',
    allowedRoles: [99, 3],
    icon: 'ri-shut-down-line',
    allowedApps: [AppNames.CILT],
    link: BASE_URL_CILT + '/stop-cycle'
  },
  // {
  //   id: 10,
  //   label: 'Generate Pengecekan',
  //   allowedRoles: [99],
  //   icon: 'ri-calendar-line',
  //   allowedApps: [AppNames.CILT],
  //   link: BASE_URL_CILT + '/generate-check'
  // },
];

export const MENU_LUBRICATION: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: 'Mapping Oil & Grease',
    icon: "ri-database-2-line",
    allowedApps: [AppNames.LUBRICATION],
    subItems: [
      {
        id: 3,
        label: 'OCI',
        link: BASE_URL_LUBRICATION + '/mapping-oil-grease/oci',
        parentId: 2
      },
      {
        id: 4,
        label: 'FSB',
        link: BASE_URL_LUBRICATION + '/mapping-oil-grease/fsb',
        parentId: 2
      },
    ],
    allowedRoles: [3, 99]
  }
];

export const MENU_PROD_COST: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "Cost Maintenance",
    icon: "ri-money-dollar-circle-line",
    allowedApps: [AppNames.PROD_COST],
    allowedRoles: [99, 2, 3, 4, 6],
    subItems: [
      {
        id: 3,
        label: "Cost Order",
        parentId: 2,
        subItems: [
          {
            id: 4,
            label: "OC1",
            link: BASE_URL_PROD_COST + "/cost-maintenance/cost-order/oc1",
            parentId: 3,
          },
          {
            id: 5,
            label: "OC2",
            link: BASE_URL_PROD_COST + "/cost-maintenance/cost-order/oc2",
            parentId: 3,
          },
          {
            id: 6,
            label: "FSB",
            link: BASE_URL_PROD_COST + "/cost-maintenance/cost-order/fsb",
            parentId: 3,
          }
        ]
      },
      {
        id: 7,
        label: "Finish Good",
        parentId: 2,
        subItems: [
          {
            id: 8,
            label: "OC1",
            link: BASE_URL_PROD_COST + "/cost-maintenance/finish-good/oc1",
            parentId: 7,
          },
          {
            id: 9,
            label: "OC2",
            link: BASE_URL_PROD_COST + "/cost-maintenance/finish-good/oc2",
            parentId: 7,
          },
          {
            id: 10,
            label: "FSB",
            link: BASE_URL_PROD_COST + "/cost-maintenance/finish-good/fsb",
            parentId: 7,
          }
        ]
      },
    ]
  },
  {
    id: 11,
    label: 'Supplies',
    icon: "ri-shopping-cart-line",
    allowedApps: [AppNames.PROD_COST],
    allowedRoles: [99, 2, 3, 4, 6],
    subItems: [
      {
        id: 12,
        label: 'Material',
        link: BASE_URL_PROD_COST + "/supplies/material",
        parentId: 11,
      },
      {
        id: 13,
        label: 'Cost Center',
        link: BASE_URL_PROD_COST + "/supplies/cost-center",
        parentId: 11,
      },
      {
        id: 13,
        label: 'Budget Plan',
        link: BASE_URL_PROD_COST + "/supplies/budget-plan",
        parentId: 11,
      }
    ]
  },
  {
    id: 14,
    label: 'CRP',
    icon: 'ri-hand-coin-line',
    allowedApps: [AppNames.PROD_COST],
    link: BASE_URL_PROD_COST + "/crp",
  }
];

export const MENU_SCHEDULE_END_CYCLE: MenuItem[] = [
  {
    id: 1,
    label: 'Schedule',
    icon: 'ri-calendar-line',
    allowedApps: [AppNames.SCHEDULE_END_CYCLE],
    link: BASE_URL_SCHEDULE_END + '/schedule'
  },
  {
    id: 2,
    label: 'Master Data',
    icon: "ri-server-line",
    allowedApps: [AppNames.SCHEDULE_END_CYCLE],
    subItems: [
      {
        id: 3,
        label: 'Activity',
        parentId: 2,
        link: BASE_URL_SCHEDULE_END + "/master-data/activity"
      },
      {
        id: 4,
        label: 'Maintenance Type',
        parentId: 2,
        link: BASE_URL_SCHEDULE_END + "/master-data/maintenance-type"
      },
    ]
  },
];
