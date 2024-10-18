import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState } from './atoms';
import Board from './Components/Board';
import CreateBoardForm from './Components/CreateBoardForm';
import TrashCan from './Components/TrashCan';

import type { JSX } from 'react';
import type { DropResult } from 'react-beautiful-dnd';

/**
 * Styled component for the main wrapper of the application.
 * It centers the content both horizontally and vertically,
 * and takes up the full viewport width and height.
 */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  padding: 20px;
  background-color: ${(props) => props.theme.bgColor};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

/**
 * Styled component for the container of all boards.
 * It arranges the boards horizontally with equal spacing,
 * and aligns them to the top of the container.
 */
const Boards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

/**
 * Main application component for a drag-and-drop Kanban board.
 *
 * This component implements a Kanban-style task management system with the following features:
 * - Multiple boards (e.g., 'To Do', 'Doing', 'Done') that can be reordered
 * - Draggable todo items that can be moved between boards or reordered within a board
 * - A trash can for deleting todo items
 * - A form for creating new boards
 *
 * Key functionalities:
 * - Uses react-beautiful-dnd for drag and drop functionality
 * - Employs Recoil for state management (toDoState atom)
 * - Persists state in localStorage for data retention across sessions
 *
 * The component handles the following operations:
 * 1. Reordering boards
 * 2. Moving todo items between boards
 * 3. Reordering todo items within a board
 * 4. Deleting todo items by dragging them to the trash can
 * 5. Adding new boards
 *
 * State updates are managed in the onDragEnd function, which is called after each drag operation.
 *
 * @component
 * @example
 * return (
 *   <RecoilRoot>
 *     <ThemeProvider theme={darkTheme}>
 *       <App />
 *     </ThemeProvider>
 *   </RecoilRoot>
 * )
 * @returns {JSX.Element} The rendered Kanban board application
 * @see {@link https://github.com/atlassian/react-beautiful-dnd|react-beautiful-dnd}
 * @see {@link https://recoiljs.org/|Recoil}
 * @see {@link https://styled-components.com/|styled-components}
 */
const App = (): JSX.Element => {
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
        <Header>
          <Title>Kanban Board</Title>
          <Description>Drag and drop tasks between boards to organize your work</Description>
        </Header>
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
};

export default App;
