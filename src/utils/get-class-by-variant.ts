import { VariantType } from "@/types/index";

export const getStyleByVariant = (variant: VariantType) => {
  let style = "";
  switch (variant) {
    case "primary":
      style = "hover:bg-[#77cdd9] bg-[#5cc4b1]";
      break;
    case "secondary":
      style = "bg-gray-500 hover:bg-gray-600 text-[#000]";
      break;
    case "dark-secondary":
      style = "bg-gray-700 text-white hover:bg-gray-600";
      break;
    case "danger":
      style = "hover:bg-red-400 bg-[#d42a52] text-[#000]";
      break;
    case "warning":
      style = "hover:bg-[#93ba9a] bg-[#e8e22c]";
      break;
    case "active":
      style = "hover:bg-green-600 bg-green-500";
      break;
    case "transperent":
      style = "";
      break;
    default:
      style = "bg-gray-500 hover:bg-gray-600 text-[#000]";
      break;
  }

  return style;
};
