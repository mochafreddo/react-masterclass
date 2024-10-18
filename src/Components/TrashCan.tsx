import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const TrashCanWrapper = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ff6b6b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
`;

const TrashIcon = styled.span`
  font-size: 24px;
  color: white;
`;

/**
 * TrashCan Component
 *
 * This component represents a draggable trash can area in a drag-and-drop interface.
 * It uses react-beautiful-dnd for drag and drop functionality and styled-components for styling.
 *
 * The trash can changes color when an item is being dragged over it, providing visual feedback to the user.
 */
const TrashCan: React.FC = () => {
  return (
    <Droppable droppableId="trash">
      {(provided, snapshot) => (
        <TrashCanWrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            backgroundColor: snapshot.isDraggingOver ? '#e74c3c' : '#ff6b6b',
          }}
        >
          <TrashIcon>🗑️</TrashIcon>
          {provided.placeholder}
        </TrashCanWrapper>
      )}
    </Droppable>
  );
};

export default TrashCan;
