export const baseClasses = `
  relative
  appearance-none select-none whitespace-nowrap align-middle outline-none
  transition-all duration-200 
  text-left font-medium leading-5 
  focus:outline-none
`;

export const solidClasses = `
  border
  bg-lightGray-000 text-lightGray-900 border-lightGray-200 
  hover:bg-lightGray-100
  focus:ring focus:ring-lightBlue-500 focus:ring-opacity-30
  dark:bg-darkGray-700 dark:text-darkGray-100 dark:border-darkGray-600
  dark-hover:bg-darkGray-600 dark-hover:border-darkGray-300
  dark-focus:border-darkGray-300
`;

const Button = {
  base: `inline-block ${baseClasses}`,
  variants: {
    appearance: {
      solid: solidClasses,
      unstyled: "",
    },
    size: {
      md: "rounded py-1.5 pl-4 text-sm",
      unstyled: "",
    },
  },
};

export default Button;
