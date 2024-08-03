import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { BsHouseCheck } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
const categories = [
  {
    label: "",
    Icon: BsHouseCheck,
    description: "All categories",
  },
  {
    label: "Beach",
    Icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "Windmills",
    Icon: GiWindmill,
    description: "This property has windmills!",
  },
  {
    label: "Modern",
    Icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    label: "Countryside",
    Icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    label: "Pools",
    Icon: TbPool,
    description: "This property has a beautiful pool!",
  },
  {
    label: "Islands",
    Icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "Lake",
    Icon: GiBoatFishing,
    description: "This property is near a lake!",
  },
  {
    label: "Skiing",
    Icon: FaSkiing,
    description: "This property has skiing activities!",
  },
  {
    label: "Castles",
    Icon: GiCastle,
    description: "This property is an ancient castle!",
  },
  {
    label: "Caves",
    Icon: GiCaveEntrance,
    description: "This property is in a spooky cave!",
  },
  {
    label: "Camping",
    Icon: GiForestCamp,
    description: "This property offers camping activities!",
  },
  {
    label: "Arctic",
    Icon: BsSnow,
    description: "This property is in an arctic environment!",
  },
  {
    label: "Desert",
    Icon: GiCactus,
    description: "This property is in the desert!",
  },
  {
    label: "Barns",
    Icon: GiBarn,
    description: "This property is in a barn!",
  },
  {
    label: "Lux",
    Icon: IoDiamond,
    description: "This property is brand new and luxurious!",
  },
];
export default categories;
