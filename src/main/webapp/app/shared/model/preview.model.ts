export interface IPreview {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export class Preview implements IPreview {
  constructor(public title?: string, public description?: string, public image?: string, public url?: string) {}
}
