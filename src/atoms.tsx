import { atom } from 'recoil';

type IToDoState = Record<string, string[]>;

export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': ['a', 'b'],
    Doing: ['c', 'd', 'e'],
    Done: ['f'],
  },
});
