import { AtomEffect, atom, selector } from 'recoil'

export enum Categories {
  'TO_DO' = 'TO_DO',
  'DOING' = 'DOING',
  'DONE' = 'DONE',
}

export interface IToDo {
  text: string
  id: number
  category: Categories
}

const localStorageEffect: AtomEffect<IToDo[]> = ({ setSelf, onSet }) => {
  const savedValue = localStorage.getItem('todos')
  if (savedValue != null) {
    setSelf(JSON.parse(savedValue))
  }

  onSet((newValue, _, isReset) => {
    isReset
      ? localStorage.removeItem('todos')
      : localStorage.setItem('todos', JSON.stringify(newValue))
  })
}

export const categoryState = atom<Categories>({
  key: 'category',
  default: Categories.TO_DO,
})

export const toDoState = atom<IToDo[]>({
  key: 'toDo',
  default: [],
  effects: [localStorageEffect],
})

export const toDoSelector = selector({
  key: 'toDoSelector',
  get: ({ get }) => {
    const toDos = get(toDoState)
    const category = get(categoryState)
    return toDos.filter((toDo) => toDo.category === category)
  },
})
