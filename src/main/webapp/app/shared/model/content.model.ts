export interface IContent {
  id?: number;
  name?: string;
  pastedlink?: string;
  type?: string;
  fileupload?: any;
  fileName?: string;
}

export class Content implements IContent {
  constructor(
    public id?: number,
    public name?: string,
    public pastedlink?: string,
    public type?: string,
    public fileupload?: any,
    public fileName?: string
  ) {}
}
