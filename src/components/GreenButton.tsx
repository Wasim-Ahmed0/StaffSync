import { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const GreenButton: FC<ButtonProps> = ({ children, ...attributes }) => {
  return (
    <button
      className="flex items-center justify-center gap-1 text-nowrap rounded-full bg-primary px-3 py-2 font-medium text-black shadow-lg transition hover:bg-white active:bg-white active:bg-opacity-70"
      {...attributes}
    >
      {children}
    </button>
  );
};

export default GreenButton;
