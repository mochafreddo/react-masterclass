import { RecoilRoot } from 'recoil'
import GlobalStyle from './GlobalStyle'
import ToDoList from './components/ToDoList'

function App() {
  return (
    <RecoilRoot>
      <GlobalStyle />
      <ToDoList />
    </RecoilRoot>
  )
}

export default App
