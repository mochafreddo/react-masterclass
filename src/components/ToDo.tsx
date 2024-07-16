import { useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { IToDo, toDoState } from '../atoms'

const TodoItem = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

const Text = styled.span`
  font-size: 16px;
  color: ${(props) => props.theme.textColor};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`

const Button = styled.button`
  background-color: ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin-left: 5px;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`

function ToDo({ id, text, category }: IToDo) {
  const setToDos = useSetRecoilState(toDoState)

  const onClick = (newCategory: IToDo['category']) => {
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((toDo) => toDo.id === id)
      const newToDo = { ...oldToDos[targetIndex], category: newCategory }
      return [...oldToDos.slice(0, targetIndex), newToDo, ...oldToDos.slice(targetIndex + 1)]
    })
  }

  return (
    <TodoItem>
      <Text>{text}</Text>
      <ButtonContainer>
        {category !== 'TO_DO' && <Button onClick={() => onClick('TO_DO')}>To Do</Button>}
        {category !== 'DOING' && <Button onClick={() => onClick('DOING')}>Doing</Button>}
        {category !== 'DONE' && <Button onClick={() => onClick('DONE')}>Done</Button>}
      </ButtonContainer>
    </TodoItem>
  )
}

export default ToDo
