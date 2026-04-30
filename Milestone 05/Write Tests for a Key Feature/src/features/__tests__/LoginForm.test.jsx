import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../LoginForm'
import * as useLoginModule from '../../hooks/useLogin'

// Mock useLogin hook
jest.mock('../../hooks/useLogin')

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNavigate.mockClear()
  })

  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    )
  }

  test('renders login form with email and password inputs', () => {
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    })

    renderLoginForm()
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('allows user to type email and password', async () => {
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    })

    const user = userEvent.setup()
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })

  test('calls handleLogin on form submission', async () => {
    const mockHandleLogin = jest.fn()
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: mockHandleLogin,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    })

    const user = userEvent.setup()
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'pass123')
    await user.click(submitButton)

    expect(mockHandleLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'pass123',
    })
  })

  test('shows loading state during login', () => {
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: jest.fn(),
      isLoading: true,
      error: null,
      clearError: jest.fn(),
    })

    renderLoginForm()
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('Loading...')
    expect(button).toBeDisabled()
  })

  test('displays error message when login fails', () => {
    const errorMessage = 'Invalid email or password'
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: jest.fn(),
      isLoading: false,
      error: errorMessage,
      clearError: jest.fn(),
    })

    renderLoginForm()
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test('submits form with Enter key', async () => {
    const mockHandleLogin = jest.fn()
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: mockHandleLogin,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    })

    const user = userEvent.setup()
    renderLoginForm()

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.type(passwordInput, '{Enter}')

    expect(mockHandleLogin).toHaveBeenCalled()
  })

  test('form title and description are visible', () => {
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    })

    renderLoginForm()
    
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByText(/please enter your details to sign in/i)).toBeInTheDocument()
  })

  test('prevents submission with empty fields', async () => {
    const mockHandleLogin = jest.fn()
    useLoginModule.useLogin.mockReturnValue({
      handleLogin: mockHandleLogin,
      isLoading: false,
      error: null,
      clearError: jest.fn(),
    })

    const user = userEvent.setup()
    renderLoginForm()

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Try to click without filling fields
    await user.click(submitButton)

    // HTML5 validation should prevent form submission on required fields
    expect(mockHandleLogin).not.toHaveBeenCalled()
  })
})
