export const getTranslations = () => {
  const t = key => key;

  t.rich = key => key;
  t.markup = key => key;

  return t;
};
