export interface IContent {
  id?: number;
  name?: string;
  pastedlink?: string;
}

export class Content implements IContent {
  constructor(public id?: number, public name?: string, public pastedlink?: string) {}
}
