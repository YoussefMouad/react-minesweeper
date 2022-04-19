export interface Mine {
  id: string;
  isOpen: boolean;
  isFlagged: boolean;
  hasMine: boolean;
  content?: number | string;
}
