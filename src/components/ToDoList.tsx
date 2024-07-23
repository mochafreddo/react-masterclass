import { useRecoilState, useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { Categories, categoryState, toDoSelector, toDoState } from '../atoms'
import CreateToDo from './CreateToDo'
import ProgressBar from './ProgressBar'
import ToDo from './ToDo'

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
  font-size: 24px;
  margin-bottom: 20px;
`

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border: 1px solid ${(props) => props.theme.accentColor};
  border-radius: 5px;
`

function ToDoList() {
  const [category, setCategory] = useRecoilState(categoryState)
  const toDos = useRecoilValue(toDoSelector)
  const allToDos = useRecoilValue(toDoState)

  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value as Categories)
  }

  const totalToDos = allToDos.length
  const completedToDos = allToDos.filter((toDo) => toDo.category === Categories.DONE).length

  return (
    <Container>
      <Title>My Todo List</Title>
      <ProgressBar total={totalToDos} completed={completedToDos} />
      <Select value={category} onInput={onInput}>
        <option value={Categories.TO_DO}>To Do</option>
        <option value={Categories.DOING}>Doing</option>
        <option value={Categories.DONE}>Done</option>
      </Select>
      <CreateToDo />
      {toDos?.map((toDo) => <ToDo key={toDo.id} {...toDo} />)}
    </Container>
  )
}

export default ToDoList
