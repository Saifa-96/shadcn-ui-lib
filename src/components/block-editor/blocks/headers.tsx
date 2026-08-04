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

export const H4Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h4"
      className="relative mt-[0.75em] text-lg font-semibold tracking-tight"
      {...props}
    />
  );
};

export const H5Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h5"
      className="relative mt-[0.75em] text-lg font-semibold tracking-tight"
      {...props}
    />
  );
};

export const H6Element: React.FC<PlateElementProps> = (props) => {
  return (
    <PlateElement
      as="h6"
      className="relative mt-[0.75em] text-base font-semibold tracking-tight"
      {...props}
    />
  );
};
