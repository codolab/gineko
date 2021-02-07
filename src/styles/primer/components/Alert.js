const Alert = {
  base: "flex items-center relative overflow-hidden px-4 py-3",
  status: ({ color }) =>
    `bg-${color.light}-200 text-lightGray-900 
     dark:bg-${color.dark}-400 dark:bg-opacity-10 dark:text-${color.dark}-200`,
  closeIcon: ({ color }) => `text-lightGray-900 dark:text-${color.dark}-200`,
};

export default Alert;
