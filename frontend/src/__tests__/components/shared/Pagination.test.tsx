/**
 * Pagination Component Tests
 * Tests for pagination component interactions
 */

import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { Pagination } from '@/components/shared/Pagination'

describe('Pagination', () => {
  it('renders current page and total pages', () => {
    renderWithProviders(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    )
    
    expect(screen.getByText(/page 1 of 10/i)).toBeInTheDocument()
  })

  it('disables previous button on first page', () => {
    renderWithProviders(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    )
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()
  })

  it('disables next button on last page', () => {
    renderWithProviders(
      <Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />
    )
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('enables both buttons on middle page', () => {
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
    )
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    const nextButton = screen.getByRole('button', { name: /next/i })
    
    expect(prevButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })

  it('calls onPageChange with previous page when previous button is clicked', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={handlePageChange} />
    )
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    await user.click(prevButton)
    
    expect(handlePageChange).toHaveBeenCalledWith(4)
    expect(handlePageChange).toHaveBeenCalledTimes(1)
  })

  it('calls onPageChange with next page when next button is clicked', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    
    renderWithProviders(
      <Pagination currentPage={5} totalPages={10} onPageChange={handlePageChange} />
    )
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    expect(handlePageChange).toHaveBeenCalledWith(6)
    expect(handlePageChange).toHaveBeenCalledTimes(1)
  })

  it('does not call onPageChange when previous button is disabled and clicked', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    
    renderWithProviders(
      <Pagination currentPage={1} totalPages={10} onPageChange={handlePageChange} />
    )
    
    const prevButton = screen.getByRole('button', { name: /previous/i })
    await user.click(prevButton)
    
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange when next button is disabled and clicked', async () => {
    const user = userEvent.setup()
    const handlePageChange = vi.fn()
    
    renderWithProviders(
      <Pagination currentPage={10} totalPages={10} onPageChange={handlePageChange} />
    )
    
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)
    
    expect(handlePageChange).not.toHaveBeenCalled()
  })

  it('handles single page correctly', () => {
    renderWithProviders(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    )
    
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })
})


