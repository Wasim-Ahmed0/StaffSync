import { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({ children, ...attributes }) => {
  return (
    <button
      className="group flex items-center justify-center gap-1 rounded-full bg-neutral-800 px-3 py-2 font-medium text-white shadow-lg transition hover:bg-primary hover:text-black active:bg-primary active:bg-opacity-70 active:text-black"
      {...attributes}
    >
      {children}
    </button>
  );
};

export default Button;
