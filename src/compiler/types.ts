type PrimitiveTypes = string | number | boolean | null | undefined;

export type Node<T> = T | PrimitiveTypes;

export type QueryOptions = {
  includingSelf?: boolean;
  stopAtFirstMatch?: boolean;
  recursive?: boolean;
};
