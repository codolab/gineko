const SelectMenu = {
  base: "box-border relative",
  labelBase: "block text-xs leading-5 text-lightGray-700 dark:text-darkGray-300 mb-1",
  modalBase: "fixed inset-0 z-99 flex flex-col w-full p-4 sm:absolute sm:inset-auto sm:p-0 focus:outline-none",
  modalContainer: `
    relative z-99
    flex flex-col
    w-full max-h-2/3
    my-auto mx-0
    overflow-hidden
    text-sm
    rounded shadow-sm
    border border-lightGray-200
    bg-lightWhite
    dark:bg-darkGray-700 dark:border-darkGray-600
    sm:h-auto sm:max-h-80 sm:mt-1 sm:mx-0
  `,
  headerBase: `
    py-2 px-2.5 
    text-xs leading-4 
    bg-lightWhite border-b border-lightGray-200 
    dark:bg-darkGray-700 dark:border-darkGray-600
  `,
  headerContent: "font-semibold text-lightGray-900 dark:text-darkGray-100",
  listBase: "relative p-0 m-0 flex-1 overflow-x-hidden overflow-y-auto bg-lightWhite",
  itemBase: `
    relative
    flex items-center
    w-full
    pr-4 pl-8 py-2
    text-left text-xs
    overflow-hidden cursor-pointer
    bg-lightWhite text-lightGray-600 border-b border-lightGray-200
    dark:bg-darkGray-700 dark:text-darkGray-100 dark:border-darkGray-600
    hover:no-underline
  `,
  itemIcon: "absolute inset-y-0 left-0 flex items-center pl-2",
};

export default SelectMenu;
