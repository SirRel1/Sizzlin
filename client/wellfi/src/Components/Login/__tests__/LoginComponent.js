import LoginComponent from '../LoginComponent';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'

test("if this works", () => {
  const {getByText} = render(<LoginComponent />)
  expect(getByText('Username')).toBeInTheDocument()
});
