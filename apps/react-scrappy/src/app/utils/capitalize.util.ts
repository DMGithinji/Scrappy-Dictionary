export const capitalize = (sentence: string) => {
  return sentence.slice(0, 1).toUpperCase() + sentence.slice(1);
};

export const slice = (sentence: string, limit: number) => {
  if (sentence.length <= limit) {
    return sentence;
  }

  return sentence.slice(0, limit) + '...';
};
