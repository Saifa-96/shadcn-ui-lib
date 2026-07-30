import { PlateElement, type PlateElementProps } from "platejs/react";

export const H1Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h1"
      className="relative mt-[1.6em] pb-1 text-4xl font-bold tracking-tight"
      {...props}
    />
  );
};

export const H2Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h2"
      className="relative mt-[1.4em] pb-px text-2xl font-semibold tracking-tight"
      {...props}
    />
  );
};

export const H3Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h3"
      className="relative mt-[1em] pb-px text-xl font-semibold tracking-tight"
      {...props}
    />
  );
};
