export const randomFromArray = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

export const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getShuffled = <T>(array: Array<T>): Array<T> =>
  array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

export const getRandomThatFitsRequirements = <T, Context>(
  items: Array<T>,
  context: Context,
  checkRequirements: (item: T, context: Context) => boolean
): T | null => {
    const check = (item: T) => checkRequirements(item, context);
    return getShuffled(items).find(check) || null;
  };
