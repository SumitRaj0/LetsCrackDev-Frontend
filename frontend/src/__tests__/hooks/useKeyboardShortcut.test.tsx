/**
 * useKeyboardShortcut Hook Tests
 * Tests for keyboard shortcut hook functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'

describe('useKeyboardShortcut', () => {
  let mockCallback: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockCallback = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should trigger callback on key press', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should trigger callback with metaKey (Cmd on Mac)', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        metaKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should not trigger if modifiers do not match', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: false, // Missing ctrlKey
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not trigger if key does not match', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'j', // Different key
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should not trigger when typing in input field', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      target: input,
    } as any)
    document.dispatchEvent(event)

    expect(mockCallback).not.toHaveBeenCalled()

    document.body.removeChild(input)
  })

  it('should not trigger when typing in textarea', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.focus()

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      target: textarea,
    } as any)
    document.dispatchEvent(event)

    expect(mockCallback).not.toHaveBeenCalled()

    document.body.removeChild(textarea)
  })

  it('should not trigger when contentEditable element is focused', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const div = document.createElement('div')
    div.contentEditable = 'true'
    document.body.appendChild(div)
    div.focus()

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      target: div,
    } as any)
    document.dispatchEvent(event)

    expect(mockCallback).not.toHaveBeenCalled()

    document.body.removeChild(div)
  })

  it('should handle case-insensitive key matching', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'K', // Uppercase
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'k', // Lowercase
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should handle shift key modifier', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'K',
        shiftKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'K',
      shiftKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should not trigger when disabled', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
        enabled: false,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(mockCallback).not.toHaveBeenCalled()
  })

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('should prevent default action', () => {
    renderHook(() =>
      useKeyboardShortcut({
        key: 'k',
        ctrlKey: true,
        callback: mockCallback,
      })
    )

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  it('should use latest callback reference', () => {
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()

    const { rerender } = renderHook(
      ({ callback }) =>
        useKeyboardShortcut({
          key: 'k',
          ctrlKey: true,
          callback,
        }),
      { initialProps: { callback: firstCallback } }
    )

    rerender({ callback: secondCallback })

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(firstCallback).not.toHaveBeenCalled()
    expect(secondCallback).toHaveBeenCalledTimes(1)
  })
})


