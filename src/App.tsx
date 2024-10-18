import { DragDropContext } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState } from './atoms';
import Board from './Components/Board';

import type { DropResult } from 'react-beautiful-dnd';

/**
 * Styled component for the main wrapper of the application.
 * It centers the content both horizontally and vertically.
 */
const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

/**
 * Styled component for the container of all boards.
 * It arranges the boards horizontally with some spacing.
 */
const Boards = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

/**
 * Main application component for a drag-and-drop todo list.
 *
 * This component uses react-beautiful-dnd for drag and drop functionality,
 * and Recoil for state management. It renders a list of boards, each containing
 * todo items that can be dragged between boards.
 */
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  /**
   * Handles the end of a drag operation.
   * Updates the todo state based on the drag result.
   *
   * @param {DropResult} info - The result of the drag operation
   */
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;

    setToDos((allBoards) => {
      const sourceBoard = [...allBoards[source.droppableId]];
      const taskObj = sourceBoard[source.index];

      if (destination.droppableId === source.droppableId) {
        sourceBoard.splice(source.index, 1);
        sourceBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      } else {
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
