/**
 * Modal Component Tests
 * Tests for modal component rendering and interactions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderWithProviders, screen } from '../../utils/testUtils'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/components/ui/modal'

describe('Modal', () => {
  beforeEach(() => {
    // Create portal root if it doesn't exist
    if (!document.getElementById('modal-root')) {
      const portalRoot = document.createElement('div')
      portalRoot.id = 'modal-root'
      document.body.appendChild(portalRoot)
    }
  })

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = ''
  })

  it('does not render when isOpen is false', () => {
    renderWithProviders(
      <Modal isOpen={false} onClose={vi.fn()}>
        Modal Content
      </Modal>
    )
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('renders when isOpen is true', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()}>
        Modal Content
      </Modal>
    )
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    
    renderWithProviders(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    )
    
    const backdrop = document.querySelector('.fixed.inset-0')
    expect(backdrop).toBeInTheDocument()
    
    if (backdrop) {
      await user.click(backdrop as HTMLElement)
      expect(handleClose).toHaveBeenCalledTimes(1)
    }
  })

  it('does not call onClose when modal content is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()
    
    renderWithProviders(
      <Modal isOpen={true} onClose={handleClose}>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>
    )
    
    const content = screen.getByTestId('modal-content')
    await user.click(content)
    
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('sets body overflow to hidden when opened', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('resets body overflow when closed', () => {
    const { rerender } = renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('hidden')
    
    rerender(
      <Modal isOpen={false} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('unset')
  })

  it('renders with default dark variant', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    const modal = document.querySelector('.bg-gray-900')
    expect(modal).toBeInTheDocument()
  })

  it('renders with light variant', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()} variant="light">
        Content
      </Modal>
    )
    
    const modal = document.querySelector('.bg-white')
    expect(modal).toBeInTheDocument()
  })

  it('renders with small size', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()} size="sm">
        Content
      </Modal>
    )
    
    const modal = document.querySelector('.max-w-sm')
    expect(modal).toBeInTheDocument()
  })

  it('renders with large size', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()} size="lg">
        Content
      </Modal>
    )
    
    const modal = document.querySelector('.max-w-lg')
    expect(modal).toBeInTheDocument()
  })

  it('renders with xl size', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()} size="xl">
        Content
      </Modal>
    )
    
    const modal = document.querySelector('.max-w-5xl')
    expect(modal).toBeInTheDocument()
  })

  it('renders with full size', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()} size="full">
        Content
      </Modal>
    )
    
    const modal = document.querySelector('.max-w-full')
    expect(modal).toBeInTheDocument()
  })

  it('renders children content', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div data-testid="child">Child Content</div>
        <div data-testid="child2">Another Child</div>
      </Modal>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child2')).toBeInTheDocument()
  })

  it('has backdrop blur overlay', () => {
    renderWithProviders(
      <Modal isOpen={true} onClose={vi.fn()}>
        Content
      </Modal>
    )
    
    const backdrop = document.querySelector('.backdrop-blur-sm')
    expect(backdrop).toBeInTheDocument()
  })
})


