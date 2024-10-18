import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState, type ITodo } from '@/atoms';

import DraggableCard from './DraggableCard';

import type { JSX } from 'react';

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Wrapper = styled.div`
  width: 300px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 10px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 15px;
  background-color: ${(props: { theme: { boardTitleBg: string } }) => props.theme.boardTitleBg};
  color: ${(props: { theme: { boardTitleColor: string } }) => props.theme.boardTitleColor};
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  padding: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.accentColor};
  }
`;

const Button = styled.button`
  font-size: 16px;
  border: none;
  background-color: ${(props) => props.theme.accentColor};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin-left: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.accentColorHover};
  }
`;

const Area = styled.div<IAreaProps>`
  flex-grow: 1;
  padding: 15px;
  transition: background-color 0.3s ease-in-out;
  background-color: ${(props) =>
    props.isDraggingOver
      ? props.theme.dragOverColor
      : props.isDraggingFromThis
        ? props.theme.dragFromColor
        : 'transparent'};
`;

/**
 * Board Component
 *
 * This component represents a single board in a Kanban-style todo application.
 * It displays a list of todo items and allows adding new items to the board.
 * The component supports drag-and-drop functionality for reordering tasks.
 *
 * @param {IBoardProps} props - The component props
 * @param {ITodo[]} props.toDos - Array of todo items to display on the board
 * @param {string} props.boardId - Unique identifier for the board
 *
 * @returns {JSX.Element} A board component with a title, form for adding new todos, and a list of draggable todo items
 *
 * @see DraggableCard
 * @see {@link https://github.com/atlassian/react-beautiful-dnd|react-beautiful-dnd}
 * @see {@link ../atoms.tsx|toDoState} for the Recoil atom managing the todo state
 */
const Board = ({ toDos, boardId }: IBoardProps): JSX.Element => {
  // Access the Recoil setter function for updating the todo state
  const setToDos = useSetRecoilState(toDoState);

  // Initialize react-hook-form
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    // Create a new todo object
    const newToDo: ITodo = {
      id: Date.now(),
      text: toDo,
    };

    // Update the Recoil state with the new todo
    setToDos((allBoards) => ({
      ...allBoards,
      [boardId]: {
        ...allBoards[boardId],
        todos: [newToDo, ...allBoards[boardId].todos],
      },
    }));

    // Clear the input field after submission
    setValue('toDo', '');
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Form onSubmit={(e) => void handleSubmit(onValid)(e)}>
        <Input
          {...register('toDo', { required: 'This field is required' })}
          type="text"
          placeholder={`Add task to ${boardId}`}
        />
        <Button type="submit">Add</Button>
      </Form>
      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};
export default Board;
