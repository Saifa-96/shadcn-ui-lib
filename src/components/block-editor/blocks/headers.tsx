import { PlateElement, type PlateElementProps } from "platejs/react";

export const H1Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h1"
      className="mt-[1.6em] mb-1 text-3xl font-bold tracking-tight"
      {...props}
    />
  );
};

export const H2Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h2"
      className="mt-[1.4em] mb-1 text-2xl font-semibold tracking-tight"
      {...props}
    />
  );
};

export const H3Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h3"
      className="mt-[1em] mb-1 text-xl font-semibold tracking-tight"
      {...props}
    />
  );
};
