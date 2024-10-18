import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState } from './atoms';
import Board from './Components/Board';
import CreateBoardForm from './Components/CreateBoardForm';
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
 * todo items that can be dragged between boards, reordered within boards,
 * or moved to a trash can for deletion.
 *
 * The component handles the logic for:
 * - Reordering boards
 * - Moving todo items between boards
 * - Reordering todo items within a board
 * - Deleting todo items by dragging them to the trash can
 *
 * It also includes a form for creating new boards and a trash can component
 * for deleting items.
 *
 * @component
 * @example
 * <App />
 */
function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  /**
   * Handles the end of a drag operation.
   * Updates the todo state based on the drag result.
   *
   * @param {DropResult} info - The result of the drag operation
   * @param {DraggableLocation} info.source - The source of the dragged item
   * @param {DraggableLocation} info.destination - The destination of the dragged item
   * @param {string} info.type - The type of the dragged item ('board' or 'todo')
   */
  const onDragEnd = (info: DropResult): void => {
    const { destination, source, type } = info;
    if (!destination) return;

    if (type === 'board') {
      // Handle board reordering
      // Reorders the boards based on the drag and drop operation
      setToDos((allBoards) => {
        const entries = Object.entries(allBoards);
        const [reorderedBoard] = entries.splice(source.index, 1);
        entries.splice(destination.index, 0, reorderedBoard);
        return Object.fromEntries(entries);
      });
    } else if (destination.droppableId === 'trash') {
      // Handle trashing a todo
      // Removes the todo item from its source board when dropped in the trash
      setToDos((allBoards) => {
        const sourceBoard = { ...allBoards[source.droppableId] };
        sourceBoard.todos.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      });
    } else if (destination.droppableId === source.droppableId) {
      // Handle reordering within the same board
      // Reorders todo items within a single board
      setToDos((allBoards) => {
        const boardCopy = { ...allBoards[source.droppableId] };
        const taskObj = boardCopy.todos[source.index];
        boardCopy.todos.splice(source.index, 1);
        boardCopy.todos.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else {
      // Handle moving between boards
      // Moves a todo item from one board to another
      setToDos((allBoards) => {
        const sourceBoard = { ...allBoards[source.droppableId] };
        const destinationBoard = { ...allBoards[destination.droppableId] };
        const taskObj = sourceBoard.todos[source.index];
        sourceBoard.todos.splice(source.index, 1);
        destinationBoard.todos.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  // Render the main application structure
  // Sets up the drag and drop context, renders boards, and includes the trash can
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <CreateBoardForm />
        <Droppable droppableId="boards" direction="horizontal" type="board">
          {(provided) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Draggable key={boardId} draggableId={boardId} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Board boardId={boardId} toDos={toDos[boardId].todos} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
        <TrashCan />
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
