import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { toDoState } from '../atoms'
import CreateToDo from './CreateToDo'
import ToDo from './ToDo'

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`

const Title = styled.h1`
  font-size: 24px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 20px;
`

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`

const FilterButton = styled.button<{ isActive: boolean }>`
  background-color: ${(props) => (props.isActive ? props.theme.accentColor : 'transparent')};
  color: ${(props) => (props.isActive ? props.theme.bgColor : props.theme.textColor)};
  border: 1px solid ${(props) => props.theme.accentColor};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.bgColor};
  }
`

const TodoList = styled.ul`
  list-style-type: none;
  padding: 0;
`

function ToDoList() {
  const toDos = useRecoilValue(toDoState)
  const [filter, setFilter] = useState<'ALL' | 'TO_DO' | 'DOING' | 'DONE'>('ALL')

  const filteredToDos = toDos.filter((toDo) => {
    if (filter === 'ALL') return true
    return toDo.category === filter
  })

  return (
    <Container>
      <Title>To Dos</Title>
      <FilterContainer>
        <FilterButton isActive={filter === 'ALL'} onClick={() => setFilter('ALL')}>
          All
        </FilterButton>
        <FilterButton isActive={filter === 'TO_DO'} onClick={() => setFilter('TO_DO')}>
          To Do
        </FilterButton>
        <FilterButton isActive={filter === 'DOING'} onClick={() => setFilter('DOING')}>
          Doing
        </FilterButton>
        <FilterButton isActive={filter === 'DONE'} onClick={() => setFilter('DONE')}>
          Done
        </FilterButton>
      </FilterContainer>
      <CreateToDo />
      <TodoList>
        {filteredToDos.map((toDo) => (
          <ToDo key={toDo.id} {...toDo} />
        ))}
      </TodoList>
    </Container>
  )
}

export default ToDoList
