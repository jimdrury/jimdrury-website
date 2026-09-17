export const getCurrentYear = async () => {
  "use cache";
  return new Date().getUTCFullYear();
};
