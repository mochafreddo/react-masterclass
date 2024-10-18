import { Droppable } from 'react-beautiful-dnd';
import { Form as HookForm, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState, type ITodo } from '@/atoms';

import DraggableCard from './DraggableCard';

import type { Control } from 'react-hook-form';

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
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#dfe6e9' : props.isDraggingFromThis ? '#b2bec3' : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const StyledForm = styled(HookForm)<{ control: Control<IForm> }>`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

/**
 * Board Component
 *
 * This component represents a single board in a Kanban-style todo application.
 * It displays a list of todo items and allows adding new items to the board.
 *
 * The component uses:
 * - react-beautiful-dnd for drag and drop functionality
 * - react-hook-form for form handling
 * - Recoil for state management
 * - styled-components for styling
 *
 * @component
 * @param {Object} props - The component props
 * @param {ITodo[]} props.toDos - An array of todo items to display on the board
 * @param {string} props.boardId - The unique identifier for the board
 *
 * @example
 * <Board toDos={boardTodos} boardId="To Do" />
 */
function Board({ toDos, boardId }: IBoardProps) {
  // Access the Recoil setter function for updating the todo state
  const setToDos = useSetRecoilState(toDoState);

  // Initialize react-hook-form
  const { register, setValue, control } = useForm<IForm>();

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
      <StyledForm
        control={control as Control<IForm>}
        onSubmit={({ data }) => onValid(data as IForm)}
      >
        <input
          {...register('toDo', { required: true })}
          type="text"
          placeholder={`Add task on ${boardId}`}
        />
      </StyledForm>
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
}
export default Board;
