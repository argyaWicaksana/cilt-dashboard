import { MenuItem } from "./menu.model";

const BASE_URL = "/ereport";

export const MENU: MenuItem[] = [
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
    subItems: [
      {
        id: 3,
        label: "Preparation",
        link: BASE_URL + "/oc1/preparation",
        parentId: 2,
        allowedRoles: [1,2,3]
      },
      {
        id: 4,
        label: "Injection",
        link: BASE_URL + "/oc1/injection",
        parentId: 2,
        allowedRoles: [1,2,4]
      },
      {
        id: 5,
        label: "BlowFill",
        link: BASE_URL + "/oc1/blowfill",
        parentId: 2,
        allowedRoles: [1,2,5]
      },
      {
        id: 6,
        label: "Packing",
        link: BASE_URL + "/oc1/packing",
        parentId: 2,
        allowedRoles: [1,2,6]
      },
      {
        id: 7,
        label: "Packer",
        link: BASE_URL + "/oc1/packer",
        parentId: 2,
        allowedRoles: [1,2,7]
      },
    ],
  },
  {
    id: 8,
    label: "OC2",
    icon: "ri-u-disk-line",
    allowedRoles: [1,2,3,9,10,11,7],
    subItems: [
      {
        id: 9,
        label: "Preparation",
        link: BASE_URL + "/oc2/preparation",
        parentId: 8,
        allowedRoles: [1,2,3]
      },
      {
        id: 10,
        label: "Injection",
        link: BASE_URL + "/oc2/injection",
        parentId: 8,
        allowedRoles: [1,2,9]
      },
      {
        id: 11,
        label: "BlowFill",
        link: BASE_URL + "/oc2/blowfill",
        parentId: 8,
        allowedRoles: [1,2,10]
      },
      {
        id: 12,
        label: "Packing",
        link: BASE_URL + "/oc2/packing",
        parentId: 8,
        allowedRoles: [1,2,11]
      },
      {
        id: 13,
        label: "Packer",
        link: BASE_URL + "/oc2/packer",
        parentId: 8,
        allowedRoles: [1,2,7]
      },
    ],
  },
  {
    id: 14,
    label: "Security",
    icon: "ri-shield-user-line",
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
];
