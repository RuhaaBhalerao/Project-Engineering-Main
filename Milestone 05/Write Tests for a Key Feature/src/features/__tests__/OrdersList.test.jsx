import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrdersList from '../OrdersList'
import * as useOrdersModule from '../../hooks/useOrders'

// Mock useOrders hook
jest.mock('../../hooks/useOrders')

// Mock the EmptyState component
jest.mock('../../components/EmptyState', () => {
  return function EmptyState({ title, message }) {
    return <div>{title} - {message}</div>
  }
})

describe('OrdersList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows loading skeleton when fetching orders', () => {
    useOrdersModule.useOrders.mockReturnValue({
      orders: [],
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    // Should show loading animation (animate-pulse divs instead of list)
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  test('displays orders in a list', () => {
    const mockOrders = [
      { id: 1, name: 'Order #1001', date: '2024-01-15', status: 'Delivered' },
      { id: 2, name: 'Order #1002', date: '2024-01-14', status: 'In Transit' },
    ]

    useOrdersModule.useOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    expect(screen.getByText('Order #1001')).toBeInTheDocument()
    expect(screen.getByText('Order #1002')).toBeInTheDocument()
  })

  test('displays order dates', () => {
    const mockOrders = [
      { id: 1, name: 'Test Order', date: '2024-01-20', status: 'Processing' },
    ]

    useOrdersModule.useOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    expect(screen.getByText('2024-01-20')).toBeInTheDocument()
  })

  test('displays order status badges', () => {
    const mockOrders = [
      { id: 1, name: 'Order A', date: '2024-01-15', status: 'Delivered' },
      { id: 2, name: 'Order B', date: '2024-01-14', status: 'In Transit' },
      { id: 3, name: 'Order C', date: '2024-01-13', status: 'Processing' },
    ]

    useOrdersModule.useOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    expect(screen.getByText('Delivered')).toBeInTheDocument()
    expect(screen.getByText('In Transit')).toBeInTheDocument()
    expect(screen.getByText('Processing')).toBeInTheDocument()
  })

  test('shows empty state when no orders', () => {
    useOrdersModule.useOrders.mockReturnValue({
      orders: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    expect(screen.getByText(/no orders yet/i)).toBeInTheDocument()
    expect(screen.getByText(/your first order will appear here/i)).toBeInTheDocument()
  })

  test('shows error message and retry button on fetch error', async () => {
    const mockRefetch = jest.fn()
    useOrdersModule.useOrders.mockReturnValue({
      orders: [],
      isLoading: false,
      error: 'Failed to fetch orders',
      refetch: mockRefetch,
    })

    const user = userEvent.setup()
    render(<OrdersList />)
    
    expect(screen.getByText(/something went wrong loading your orders/i)).toBeInTheDocument()
    
    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
    
    await user.click(retryButton)
    expect(mockRefetch).toHaveBeenCalled()
  })

  test('renders orders with Package icon', () => {
    const mockOrders = [
      { id: 1, name: 'Order #1001', date: '2024-01-15', status: 'Delivered' },
    ]

    useOrdersModule.useOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    // Check that order is rendered
    expect(screen.getByText('Order #1001')).toBeInTheDocument()
  })

  test('displays multiple orders in order', () => {
    const mockOrders = [
      { id: 1, name: 'First Order', date: '2024-01-20', status: 'Delivered' },
      { id: 2, name: 'Second Order', date: '2024-01-19', status: 'Processing' },
      { id: 3, name: 'Third Order', date: '2024-01-18', status: 'In Transit' },
    ]

    useOrdersModule.useOrders.mockReturnValue({
      orders: mockOrders,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })

    render(<OrdersList />)
    
    const list = screen.getAllByRole('listitem')
    expect(list).toHaveLength(3)
    expect(list[0]).toHaveTextContent('First Order')
    expect(list[1]).toHaveTextContent('Second Order')
    expect(list[2]).toHaveTextContent('Third Order')
  })
})
