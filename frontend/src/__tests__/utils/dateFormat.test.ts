/**
 * Date Format Utility Tests
 * Tests for date formatting functions
 */

import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/dateFormat'

describe('formatDate', () => {
  it('should format Date object correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const formatted = formatDate(date)

    // Should be in format: "January 15, 2024"
    expect(formatted).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/)
    expect(formatted).toContain('15')
    expect(formatted).toContain('2024')
  })

  it('should format date string correctly', () => {
    const dateString = '2024-03-20'
    const formatted = formatDate(dateString)

    expect(formatted).toMatch(/March|April/)
    expect(formatted).toContain('20')
    expect(formatted).toContain('2024')
  })

  it('should handle ISO date strings', () => {
    const isoString = '2024-12-25T00:00:00.000Z'
    const formatted = formatDate(isoString)

    expect(formatted).toMatch(/December/)
    expect(formatted).toContain('25')
    expect(formatted).toContain('2024')
  })

  it('should format different months correctly', () => {
    const months = [
      { date: '2024-01-15', month: 'January' },
      { date: '2024-06-15', month: 'June' },
      { date: '2024-12-15', month: 'December' },
    ]

    months.forEach(({ date, month }) => {
      const formatted = formatDate(date)
      expect(formatted).toContain(month)
    })
  })

  it('should handle different years', () => {
    const date2023 = formatDate('2023-01-15')
    const date2024 = formatDate('2024-01-15')
    const date2025 = formatDate('2025-01-15')

    expect(date2023).toContain('2023')
    expect(date2024).toContain('2024')
    expect(date2025).toContain('2025')
  })
})


