import { DragDropContext } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState } from './atoms';
import Board from './Components/Board';
import TrashCan from './Components/TrashCan';

import type { DropResult } from 'react-beautiful-dnd';

/**
 * Styled component for the main wrapper of the application.
 * It centers the content both horizontally and vertically,
 * and takes up the full viewport width and height.
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
 * It arranges the boards horizontally with equal spacing,
 * and aligns them to the top of the container.
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
 * and Recoil for state management. It renders multiple boards, each containing
 * todo items that can be dragged between boards or to a trash can for deletion.
 *
 * The component handles the logic for updating the todo state when items are
 * moved between boards or deleted.
 */
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  /**
   * Handles the end of a drag operation.
   * Updates the todo state based on the drag result.
   *
   * @param {DropResult} info - The result of the drag operation, containing source and destination information
   */
  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;

    if (destination.droppableId === 'trash') {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      });
    } else if (destination.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={toDos[boardId]} />
          ))}
        </Boards>
        <TrashCan />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
