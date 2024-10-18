import { atom } from 'recoil';

import type { AtomEffect, DefaultValue } from 'recoil';

/**
 * Represents a single todo item.
 */
export interface ITodo {
  id: number;
  text: string;
}

/**
 * Represents the state of todo items, organized by category.
 */
type IToDoState = Record<string, ITodo[]>;

/**
 * Type guard to check if a value is a valid IToDoState.
 * @param value - The value to check.
 * @returns True if the value is a valid IToDoState, false otherwise.
 */
function isValidToDoState(value: unknown): value is IToDoState {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value as Record<string, unknown>).every(Array.isArray)
  );
}

/**
 * Creates an atom effect for persisting todo state in localStorage.
 * @param key - The key to use for localStorage.
 * @returns An AtomEffect for managing localStorage persistence.
 */
const localStorageEffect =
  (key: string): AtomEffect<IToDoState> =>
  ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      const parsedValue = JSON.parse(savedValue) as IToDoState;
      if (isValidToDoState(parsedValue)) {
        setSelf(parsedValue);
      }
    }

    onSet((newValue: IToDoState, _: IToDoState | DefaultValue, isReset: boolean) => {
      if (isReset) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

/**
 * Recoil atom for managing the todo state.
 * Includes persistence to localStorage.
 */
export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': [],
    Doing: [],
    Done: [],
  },
  effects: [localStorageEffect('todo_state')],
});
