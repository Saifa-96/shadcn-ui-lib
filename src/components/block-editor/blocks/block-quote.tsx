import { PlateElement, PlateElementProps } from "platejs/react";

export const BlockquoteElement: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="blockquote"
      style={{
        borderLeft: "2px solid #eee",
        marginLeft: 0,
        marginRight: 0,
        paddingLeft: "24px",
        color: "#666",
        fontStyle: "italic",
      }}
      {...props}
    />
  );
};
