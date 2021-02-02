const Modal = {
  overlay: `
    fixed flex items-start justify-center inset-0 z-1000000003 
    bg-lightBlack bg-opacity-50 
    dark:bg-darkBlack dark:bg-opacity-50
  `,
  content: ({ size }) => `
    relative flex flex-col w-${size} mx-auto my-24 
    shadow-xl rounded 
    bg-lightWhite border border-lightGray-200 
    dark:bg-darkGray-900 dark:border-darkGray-700
  `,
};

export default Modal;
