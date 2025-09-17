import { IUva, NewUva } from './uva.model';

export const sampleWithRequiredData: IUva = {
  id: 26114,
  ph: 24261.26,
  acidez: 19614.23,
  brix: 12828.29,
  variedad: 'purse',
  viniedo: 'failing',
  cantidad: 15874,
};

export const sampleWithPartialData: IUva = {
  id: 28375,
  ph: 28248.92,
  acidez: 19071.09,
  brix: 17308.13,
  variedad: 'ski median prioritize',
  viniedo: 'circular aw',
  cantidad: 15685,
};

export const sampleWithFullData: IUva = {
  id: 21231,
  ph: 4154.82,
  acidez: 9206.85,
  brix: 24162.79,
  variedad: 'league so funny',
  viniedo: 'lest give',
  cantidad: 3063,
};

export const sampleWithNewData: NewUva = {
  ph: 18225.65,
  acidez: 29056.43,
  brix: 6547.88,
  variedad: 'sermon upward democratize',
  viniedo: 'utterly',
  cantidad: 4439,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
