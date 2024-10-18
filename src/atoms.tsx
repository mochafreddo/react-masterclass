import { atom } from 'recoil';

import type { AtomEffect, DefaultValue } from 'recoil';

/**
 * Represents a single todo item.
 * @interface ITodo
 * @property {number} id - Unique identifier for the todo item.
 * @property {string} text - The content of the todo item.
 */
export interface ITodo {
  id: number;
  text: string;
}

/**
 * Represents the state of a single board.
 * @interface IBoardState
 * @property {ITodo[]} todos - Array of todo items in the board.
 * @property {number} order - The order of the board in the overall layout.
 */
interface IBoardState {
  todos: ITodo[];
  order: number;
}

type IToDoState = Record<string, IBoardState>;

/**
 * Type guard to check if a value is a valid IToDoState.
 * @param value - The value to check.
 * @returns {boolean} True if the value is a valid IToDoState, false otherwise.
 */
function isValidToDoState(value: unknown): value is IToDoState {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value as Record<string, unknown>).every(
      (board) => typeof board === 'object' && board !== null && 'todos' in board && 'order' in board
    )
  );
}

/**
 * Creates an atom effect for persisting todo state in localStorage.
 * @param key - The key to use for localStorage.
 * @returns {AtomEffect<IToDoState>} An AtomEffect for managing localStorage persistence.
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
 *
 * This atom represents the entire state of the todo application, including:
 * - Multiple boards (e.g., 'To Do', 'Doing', 'Done')
 * - Todo items within each board
 * - Order of boards
 *
 * The state is persisted in localStorage using the localStorageEffect, allowing for
 * data persistence across page reloads. The isValidToDoState function is used to
 * validate the structure of the saved state when loading from localStorage.
 */
export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': { todos: [], order: 0 },
    Doing: { todos: [], order: 1 },
    Done: { todos: [], order: 2 },
  },
  effects: [localStorageEffect('todo_state')],
});
