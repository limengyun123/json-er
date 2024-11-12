export enum NodeDataType {
  OBJECT,
  ARRAY,
  OTHER,
}

export interface DataSourceType {
  id: number;
  key: string | number;
  value: any;
  isComplex: boolean;
  fontEditing: boolean;
  backEditing: boolean;
}
