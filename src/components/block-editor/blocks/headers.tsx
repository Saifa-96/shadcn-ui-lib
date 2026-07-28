import { PlateElement, type PlateElementProps } from "platejs/react";

export const H1Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h1"
      className="text-3xl font-bold tracking-tight"
      {...props}
    />
  );
};

export const H2Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h2"
      className="text-2xl font-semibold tracking-tight"
      {...props}
    />
  );
};

export const H3Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h3"
      className="text-xl font-semibold tracking-tight"
      {...props}
    />
  );
};
