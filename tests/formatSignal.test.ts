import { describe, it, expect } from 'vitest'
import { formatSignal } from '../app/utils/formatSignal'

describe('formatSignal', () => {
  it('formats mapped signals', () => {
    expect(formatSignal('new_multi_source')).toBe('New across multiple sources')
  })

  it('formats multi_source_ prefix', () => {
    expect(formatSignal('multi_source_3')).toBe('Detected in 3 sources')
  })

  it('formats spike_ prefix', () => {
    expect(formatSignal('spike_python')).toBe('python mention spike')
  })

  it('replaces underscores for unknown signals', () => {
    expect(formatSignal('high_growth')).toBe('high growth')
  })

  it('handles empty string', () => {
    expect(formatSignal('')).toBe('')
  })
})
