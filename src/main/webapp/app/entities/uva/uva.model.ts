export interface IUva {
  id: number;
  ph?: number | null;
  acidez?: number | null;
  brix?: number | null;
  variedad?: string | null;
  viniedo?: string | null;
  cantidad?: number | null;
}

export type NewUva = Omit<IUva, 'id'> & { id: null };
