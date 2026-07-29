import { PlateElement, type PlateElementProps } from "platejs/react";

export const ParagraphElement: React.FC<PlateElementProps> = (props) => {
  return <PlateElement className="m-0 px-0 py-1" {...props} />;
};
