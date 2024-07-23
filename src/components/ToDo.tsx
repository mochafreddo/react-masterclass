import React from 'react'
import { FaCheck, FaList, FaPlay, FaTrash } from 'react-icons/fa'
import { useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { Categories, IToDo, toDoState } from '../atoms'

const ToDoItem = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`

const Text = styled.span`
  color: ${(props) => props.theme.textColor};
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;
`

const Button = styled.button<{ category: Categories }>`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${(props) => props.theme.categoryColors[props.category]};
  color: ${(props) => (props.theme.isDark ? props.theme.bgColor : props.theme.textColor)};
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`

function ToDo({ text, category, id }: IToDo) {
  const setToDos = useSetRecoilState(toDoState)

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event

    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id)
      const newToDo = { text, id, category: name as Categories }
      return [...oldToDos.slice(0, targetIndex), newToDo, ...oldToDos.slice(targetIndex + 1)]
    })
  }

  const onDelete = () => {
    setToDos((oldToDos) => oldToDos.filter((toDo) => toDo.id !== id))
  }

  return (
    <ToDoItem>
      <Text>{text}</Text>
      <ButtonContainer>
        {category !== Categories.DOING && (
          <Button
            category={Categories.DOING}
            name={Categories.DOING}
            onClick={onClick}
            aria-label="Mark as Doing"
          >
            <FaPlay /> Doing
          </Button>
        )}
        {category !== Categories.TO_DO && (
          <Button
            category={Categories.TO_DO}
            name={Categories.TO_DO}
            onClick={onClick}
            aria-label="Mark as To Do"
          >
            <FaList /> To Do
          </Button>
        )}
        {category !== Categories.DONE && (
          <Button
            category={Categories.DONE}
            name={Categories.DONE}
            onClick={onClick}
            aria-label="Mark as Done"
          >
            <FaCheck /> Done
          </Button>
        )}
        <Button
          category={category}
          onClick={onDelete}
          aria-label="Delete Todo"
          style={{ backgroundColor: 'red' }}
        >
          <FaTrash /> Delete
        </Button>
      </ButtonContainer>
    </ToDoItem>
  )
}

export default ToDo
