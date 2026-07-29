import { PlateElement, PlateElementProps } from "platejs/react";

export const BlockquoteElement: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="blockquote"
      className="my-1 border-l-2 border-[#eee] pl-6 italic text-[#666]"
      {...props}
    />
  );
};
