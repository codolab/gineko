const Input = {
  base:
    "w-full align-middle leading-5 relative transition duration-200 outline-none appearance-none focus:outline-none",
  variants: {
    appearance: {
      solid: `
        border 
        bg-lightGray-000 text-lightGray-900 border-lightGray-200
        focus:bg-lightWhite focus:border-lightBlue-500 focus:ring focus:ring-lightBlue-500 focus:ring-opacity-30
        dark:bg-darkGray-900 dark:text-darkGray-100 dark:border-darkGray-700
        dark-focus:bg-darkGray-900 dark-focus:border-darkBlue-400 dark-focus:ring-darkBlue-800
      `,
      unstyled: "",
    },
    size: {
      md: "rounded py-1.5 pl-3 text-base",
      lg: "rounded py-2.5 pl-4 text-base",
    },
  },
};

export default Input;
