declare namespace SticksAndPicks {
  declare type JSON = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: string | number | boolean | JSON | JSON[] | any;
  };
}
