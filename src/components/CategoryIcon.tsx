import type { IconType } from "react-icons";
import { GiAmericanFootballHelmet, GiCricketBat, GiDuffelBag, GiShirt, GiTennisBall } from "react-icons/gi";
import { MdSportsCricket } from "react-icons/md";

const icons: Record<string, IconType> = {
  bats: GiCricketBat,
  balls: GiTennisBall,
  protection: GiAmericanFootballHelmet,
  clothing: GiShirt,
  bags: GiDuffelBag,
};

export function CategoryIcon({ name, size = 36 }: { name: string; size?: number }) {
  const Icon = icons[name.toLowerCase()] ?? MdSportsCricket;
  return <Icon size={size} aria-hidden />;
}
