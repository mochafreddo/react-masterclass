import styled from 'styled-components'

const ProgressContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 5px;
  margin-bottom: 20px;
`

const Progress = styled.div<{ width: number }>`
  width: ${(props) => props.width}%;
  height: 100%;
  background-color: ${(props) => props.theme.accentColor};
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
`

interface ProgressBarProps {
  total: number
  completed: number
}

function ProgressBar({ total, completed }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <ProgressContainer>
      <Progress width={percentage} />
    </ProgressContainer>
  )
}

export default ProgressBar
