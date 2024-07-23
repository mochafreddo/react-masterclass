import { useForm } from 'react-hook-form'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import styled from 'styled-components'
import { categoryState, toDoState } from '../atoms'

interface IForm {
  toDo: string
}

const Form = styled.form`
  display: flex;
  margin-bottom: 20px;
`

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.accentColor};
  border-radius: 5px 0 0 5px;
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
`

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.bgColor};
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }
`

function CreateToDo() {
  const { register, handleSubmit, setValue } = useForm<IForm>()

  const category = useRecoilValue(categoryState)
  const setToDos = useSetRecoilState(toDoState)

  const handleValid = ({ toDo }: IForm) => {
    setToDos((oldToDos) => [{ text: toDo, id: Date.now(), category }, ...oldToDos])
    setValue('toDo', '')
  }

  return (
    <Form onSubmit={handleSubmit(handleValid)}>
      <Input
        {...register('toDo', {
          required: 'Please write a To Do',
        })}
        placeholder="Write a to do"
      />
      <Button>Add</Button>
    </Form>
  )
}

export default CreateToDo
