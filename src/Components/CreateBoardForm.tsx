import React from 'react';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { toDoState } from '@/atoms';

/**
 * Interface for the form data
 */
interface IForm {
  boardName: string;
}

/**
 * Styled component for the form
 */
const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

/**
 * Styled component for the input field
 */
const Input = styled.input`
  font-size: 16px;
  border: 0;
  background-color: white;
  width: 200px;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
`;

/**
 * Styled component for the submit button
 */
const Button = styled.button`
  font-size: 16px;
  border: 0;
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

/**
 * CreateBoardForm component
 *
 * This component renders a form for creating a new board.
 * It uses react-hook-form for form handling and Recoil for state management.
 */
function CreateBoardForm() {
  const setToDos = useSetRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  /**
   * Handles form submission
   * @param {IForm} param0 - The form data
   */
  const onSubmit = ({ boardName }: IForm) => {
    setToDos((allBoards) => {
      if (boardName in allBoards) {
        alert('A board with this name already exists.');
        return allBoards;
      }
      return {
        ...allBoards,
        [boardName]: { todos: [], order: Object.keys(allBoards).length },
      };
    });
    setValue('boardName', '');
  };

  /**
   * Handles form submission event
   * @param {React.FormEvent<HTMLFormElement>} event - The form event
   */
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit(onSubmit)();
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Input
        {...register('boardName', { required: true })}
        type="text"
        placeholder="Enter new board name"
      />
      <Button type="submit">Add Board</Button>
    </Form>
  );
}

export default CreateBoardForm;
