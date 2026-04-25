// data/searchData.js
import { plants } from "./plants/plants";
import { pots } from "./pots/pots";
import { tools } from "./tools/tools";
import { gifts } from "./gifting/gifting";
import { corporateGifts } from "./corporate/corporateGifts";

export const allProducts = [
  ...plants.map(p => ({ ...p, section: "Plants", url: "/plants" })),
  ...pots.map(p => ({ ...p, section: "Pots", url: "/pots" })),
  ...tools.map(p => ({ ...p, section: "Garden Shop", url: "/garden-shop" })),
  ...gifts.map(p => ({ ...p, section: "Gifting", url: "/gifting" })),
  ...corporateGifts.map(p => ({ ...p, section: "Corporate Gifts", url: "/corporate-gifts" })),
];