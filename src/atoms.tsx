import { atom } from 'recoil';

export interface ITodo {
  id: number;
  text: string;
}

type IToDoState = Record<string, ITodo[]>;

export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': [],
    Doing: [],
    Done: [],
  },
});
