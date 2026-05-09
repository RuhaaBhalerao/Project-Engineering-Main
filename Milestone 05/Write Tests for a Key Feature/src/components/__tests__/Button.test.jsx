import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../Button'

describe('Button Component', () => {
  test('renders button label correctly', () => {
    render(<Button label="Submit" />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button label="Click Me" onClick={handleClick} />)
    await user.click(screen.getByRole('button', { name: /click me/i }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('disabled state prevents clicks', () => {
    const handleClick = jest.fn()
    render(<Button label="Submit" disabled onClick={handleClick} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    button.click()
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('shows loading state', () => {
    render(<Button label="Submit" loading />)
    expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
  })

  test('disables button while loading', () => {
    render(<Button label="Submit" loading />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('applies custom className', () => {
    render(<Button label="Submit" className="custom-class" />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('custom-class')
  })
})
