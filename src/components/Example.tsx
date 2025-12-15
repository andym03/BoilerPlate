import { FC } from 'react'

interface ExampleProps {
  title?: string
}

export const Example: FC<ExampleProps> = ({ title = 'Example Component' }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>This is an example component using import aliases.</p>
    </div>
  )
}

