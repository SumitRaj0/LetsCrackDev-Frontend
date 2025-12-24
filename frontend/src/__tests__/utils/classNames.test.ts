/**
 * ClassNames Utility Tests
 * Tests for className merging utility
 */

import { describe, it, expect } from 'vitest'
import { cn } from '@/utils/classNames'

describe('cn (classNames)', () => {
  it('should merge multiple class strings', () => {
    const result = cn('foo', 'bar', 'baz')
    expect(result).toBe('foo bar baz')
  })

  it('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz')
    expect(result).toBe('foo baz')
  })

  it('should merge Tailwind classes correctly', () => {
    // twMerge should handle conflicting classes
    const result = cn('px-2 py-1', 'px-4 py-2')
    // Should keep the last conflicting classes
    expect(result).toContain('px-4')
    expect(result).toContain('py-2')
  })

  it('should handle undefined and null values', () => {
    const result = cn('foo', undefined, 'bar', null, 'baz')
    expect(result).toBe('foo bar baz')
  })

  it('should handle array of classes', () => {
    const result = cn(['foo', 'bar'], 'baz')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
    expect(result).toContain('baz')
  })

  it('should handle object syntax', () => {
    const result = cn({
      foo: true,
      bar: false,
      baz: true,
    })
    expect(result).toContain('foo')
    expect(result).not.toContain('bar')
    expect(result).toContain('baz')
  })

  it('should handle empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should merge conflicting Tailwind utilities', () => {
    // px-2 conflicts with px-4, should keep px-4
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('should preserve non-conflicting classes', () => {
    const result = cn('px-2 py-1', 'bg-blue-500', 'text-white')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('bg-blue-500')
    expect(result).toContain('text-white')
  })

  it('should handle complex mixed inputs', () => {
    const result = cn(
      'base-class',
      false && 'hidden',
      true && 'visible',
      ['array-class-1', 'array-class-2'],
      {
        'conditional-true': true,
        'conditional-false': false,
      }
    )
    expect(result).toContain('base-class')
    expect(result).not.toContain('hidden')
    expect(result).toContain('visible')
    expect(result).toContain('array-class-1')
    expect(result).toContain('array-class-2')
    expect(result).toContain('conditional-true')
    expect(result).not.toContain('conditional-false')
  })
})


