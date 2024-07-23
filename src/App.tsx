import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { RecoilRoot } from 'recoil'
import styled, { ThemeProvider } from 'styled-components'
import GlobalStyle from './GlobalStyle'
import ToDoList from './components/ToDoList'
import { darkTheme, lightTheme } from './theme'

const ThemeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: ${(props) => props.theme.textColor};
  font-size: 24px;
  cursor: pointer;
`

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('isDarkTheme')
    return saved !== null ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('isDarkTheme', JSON.stringify(isDarkTheme))
  }, [isDarkTheme])

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme)

  return (
    <RecoilRoot>
      <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
        <GlobalStyle />
        <ThemeToggle onClick={toggleTheme}>{isDarkTheme ? <FaSun /> : <FaMoon />}</ThemeToggle>
        <ToDoList />
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App
