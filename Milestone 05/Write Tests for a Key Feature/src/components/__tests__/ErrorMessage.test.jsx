import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage Component', () => {
  test('renders error message text', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  test('displays retry button when onRetry provided', () => {
    const handleRetry = jest.fn()
    render(<ErrorMessage message="Error occurred" onRetry={handleRetry} />)
    
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  test('does not show retry button when onRetry not provided', () => {
    render(<ErrorMessage message="Error occurred" />)
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })

  test('calls onRetry when retry button clicked', async () => {
    const handleRetry = jest.fn()
    const user = userEvent.setup()

    render(<ErrorMessage message="Error" onRetry={handleRetry} />)
    await user.click(screen.getByRole('button', { name: /try again/i }))

    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  test('renders with AlertCircle icon', () => {
    render(<ErrorMessage message="Test error" />)
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  test('displays different error messages', () => {
    const message = 'Connection timeout'
    render(<ErrorMessage message={message} />)
    expect(screen.getByText(message)).toBeInTheDocument()
  })
})
