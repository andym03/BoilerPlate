import { renderHook, waitFor } from '@testing-library/react'
import { useTextImage } from './useTextImage'
import { TextImageOptions } from '@/types/textImage'

/**
 * Interface for useTextImage hook return value
 */
export interface UseTextImageReturn {
  /** Rendered image data */
  imageData: {
    svg: string
    dataUrl: string
    blob: Blob | null
    width: number
    height: number
  } | null
  /** Whether font is currently loading */
  isLoading: boolean
  /** Error object if any error occurred */
  error: Error | null
  /** Function to trigger rendering */
  render: (options: TextImageOptions) => Promise<void>
  /** Function to clear error state */
  clearError: () => void
}

describe('useTextImage', () => {
  beforeEach(() => {
    // Mock font loading
    global.FontFace = jest.fn().mockImplementation((family, source) => ({
      family,
      source,
      status: 'unloaded',
      load: jest.fn().mockResolvedValue({}),
    })) as unknown as typeof FontFace

    global.document.fonts = {
      add: jest.fn(),
      check: jest.fn().mockReturnValue(true),
    } as unknown as FontFaceSet
  })

  it('should initialize with null image data', () => {
    const { result } = renderHook(() => useTextImage())

    expect(result.current.imageData).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should render text image successfully', async () => {
    const { result } = renderHook(() => useTextImage())

    const options: TextImageOptions = {
      text: 'Hello World',
      fontFamily: 'Arial',
      fontSize: 24,
      textColor: '#000000',
      backgroundColor: '#ffffff',
    }

    await result.current.render(options)

    await waitFor(() => {
      expect(result.current.imageData).not.toBeNull()
      expect(result.current.imageData?.svg).toContain('Hello World')
      expect(result.current.imageData?.dataUrl).toBeDefined()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should set loading state during font loading', async () => {
    // Mock slow font loading
    let resolveFont: () => void
    const fontLoadPromise = new Promise((resolve) => {
      resolveFont = resolve
    })

    global.FontFace = jest.fn().mockImplementation(() => ({
      load: jest.fn().mockReturnValue(fontLoadPromise),
    })) as unknown as typeof FontFace

    const { result } = renderHook(() => useTextImage())

    const options: TextImageOptions = {
      text: 'Test',
      fontFamily: 'SlowFont',
      fontSize: 16,
      textColor: '#000000',
      backgroundColor: '#ffffff',
    }

    const renderPromise = result.current.render(options)

    // Should be loading
    expect(result.current.isLoading).toBe(true)

    // Resolve font loading
    resolveFont!()
    await renderPromise

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle font loading errors', async () => {
    // Mock font loading failure
    global.FontFace = jest.fn().mockImplementation(() => ({
      load: jest.fn().mockRejectedValue(new Error('Font load failed')),
    })) as unknown as typeof FontFace

    const { result } = renderHook(() => useTextImage())

    const options: TextImageOptions = {
      text: 'Test',
      fontFamily: 'InvalidFont',
      fontSize: 16,
      textColor: '#000000',
      backgroundColor: '#ffffff',
    }

    await result.current.render(options)

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.imageData).toBeNull()
    })
  })

  it('should handle rendering errors', async () => {
    const { result } = renderHook(() => useTextImage())

    // Invalid options that might cause rendering error
    const options: TextImageOptions = {
      text: '',
      fontFamily: '',
      fontSize: -1, // Invalid font size
      textColor: '',
      backgroundColor: '',
    }

    await result.current.render(options)

    await waitFor(() => {
      // Should handle error gracefully
      expect(result.current.error).not.toBeNull()
    })
  })

  it('should clear error when clearError is called', async () => {
    // Mock font loading failure
    global.FontFace = jest.fn().mockImplementation(() => ({
      load: jest.fn().mockRejectedValue(new Error('Font load failed')),
    })) as unknown as typeof FontFace

    const { result } = renderHook(() => useTextImage())

    const options: TextImageOptions = {
      text: 'Test',
      fontFamily: 'InvalidFont',
      fontSize: 16,
      textColor: '#000000',
      backgroundColor: '#ffffff',
    }

    await result.current.render(options)

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
    })

    result.current.clearError()

    expect(result.current.error).toBeNull()
  })

  it('should update image data on re-render with new options', async () => {
    const { result } = renderHook(() => useTextImage())

    const options1: TextImageOptions = {
      text: 'First',
      fontFamily: 'Arial',
      fontSize: 16,
      textColor: '#000000',
      backgroundColor: '#ffffff',
    }

    await result.current.render(options1)

    await waitFor(() => {
      expect(result.current.imageData?.svg).toContain('First')
    })

    const options2: TextImageOptions = {
      text: 'Second',
      fontFamily: 'Arial',
      fontSize: 20,
      textColor: '#ff0000',
      backgroundColor: '#ffffff',
    }

    await result.current.render(options2)

    await waitFor(() => {
      expect(result.current.imageData?.svg).toContain('Second')
      expect(result.current.imageData?.svg).not.toContain('First')
    })
  })

  it('should generate blob for image data', async () => {
    const { result } = renderHook(() => useTextImage())

    const options: TextImageOptions = {
      text: 'Test',
      fontFamily: 'Arial',
      fontSize: 16,
      textColor: '#000000',
      backgroundColor: '#ffffff',
    }

    await result.current.render(options)

    await waitFor(() => {
      expect(result.current.imageData?.blob).not.toBeNull()
      expect(result.current.imageData?.blob).toBeInstanceOf(Blob)
    })
  })
})

