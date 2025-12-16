import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderHook, act } from '@testing-library/react';
import { ShapeModal } from './ShapeModal';
import { useCanvasStore } from '@/store/useCanvasStore';
import { createRectangle } from '@/shapes/Rectangle';
import { createCircle } from '@/shapes/Circle';
import { createTriangle } from '@/shapes/Triangle';
import { createStar } from '@/shapes/Star';

const CANVAS_SIZE = { width: 1920, height: 1080 };

describe('ShapeModal Integration - End-to-End Shape Updates', () => {
  describe('Rectangle Update Flow', () => {
    it('updates rectangle shape through store when form is submitted', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const rectangle = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      
      act(() => {
        store.current.addShape(rectangle);
      });

      const mockOnClose = jest.fn();

      render(
        <ShapeModal
          shapeId="rect-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      // Verify initial values
      expect(screen.getByTestId('shape-modal-x')).toHaveValue(100);
      expect(screen.getByTestId('shape-modal-width')).toHaveValue(200);

      // Update form values
      const xInput = screen.getByTestId('shape-modal-x');
      const widthInput = screen.getByTestId('shape-modal-width');
      const heightInput = screen.getByTestId('shape-modal-height');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(xInput);
      await user.type(xInput, '250');
      await user.clear(widthInput);
      await user.type(widthInput, '400');
      await user.clear(heightInput);
      await user.type(heightInput, '500');
      // Skip color input update for integration test

      // Submit form
      await user.click(applyButton);

      // Verify store was updated
      await waitFor(() => {
        const updatedShape = store.current.shapes.find((s) => s.id === 'rect-1');
        expect(updatedShape).toBeDefined();
        if (updatedShape && updatedShape.type === 'rectangle') {
          expect(Number(updatedShape.x)).toBe(250);
          expect(Number(updatedShape.width)).toBe(400);
          expect(Number(updatedShape.height)).toBe(500);
          expect(updatedShape.fillColor).toBeDefined();
          // Verify unchanged properties
          expect(Number(updatedShape.y)).toBe(100);
        }
      });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('preserves shape type after update', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const rectangle = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      
      act(() => {
        store.current.addShape(rectangle);
      });

      const mockOnClose = jest.fn();

      render(
        <ShapeModal
          shapeId="rect-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      const widthInput = screen.getByTestId('shape-modal-width');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(widthInput);
      await user.type(widthInput, '300');
      await user.click(applyButton);

      await waitFor(() => {
        const updatedShape = store.current.shapes.find((s) => s.id === 'rect-1');
        expect(updatedShape).toBeDefined();
        expect(updatedShape?.type).toBe('rectangle');
        if (updatedShape && updatedShape.type === 'rectangle') {
          expect(Number(updatedShape.width)).toBe(300);
          expect(Number(updatedShape.height)).toBe(150); // unchanged
        }
      });
    });
  });

  describe('Circle Update Flow', () => {
    it('updates circle shape through store when form is submitted', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const circle = createCircle('circle-1', 100, 100, 75, '#22c55e');
      
      act(() => {
        store.current.addShape(circle);
      });

      const mockOnClose = jest.fn();

      render(
        <ShapeModal
          shapeId="circle-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      const radiusInput = screen.getByTestId('shape-modal-radius');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(radiusInput);
      await user.type(radiusInput, '120');
      // Skip color input update for integration test

      await user.click(applyButton);

      await waitFor(() => {
        const updatedShape = store.current.shapes.find((s) => s.id === 'circle-1');
        expect(updatedShape).toBeDefined();
        expect(updatedShape?.type).toBe('circle');
        if (updatedShape && updatedShape.type === 'circle') {
          expect(Number(updatedShape.radius)).toBe(120);
          expect(updatedShape.fillColor).toBeDefined();
          expect(Number(updatedShape.x)).toBe(100); // unchanged
        }
      });
    });
  });

  describe('Triangle Update Flow', () => {
    it('updates triangle shape through store when form is submitted', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const triangle = createTriangle('triangle-1', 100, 100, 150, 150, '#f97316');
      
      act(() => {
        store.current.addShape(triangle);
      });

      const mockOnClose = jest.fn();

      render(
        <ShapeModal
          shapeId="triangle-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      const widthInput = screen.getByTestId('shape-modal-width');
      const heightInput = screen.getByTestId('shape-modal-height');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(widthInput);
      await user.type(widthInput, '200');
      await user.clear(heightInput);
      await user.type(heightInput, '250');

      await user.click(applyButton);

      await waitFor(() => {
        const updatedShape = store.current.shapes.find((s) => s.id === 'triangle-1');
        expect(updatedShape).toBeDefined();
        expect(updatedShape?.type).toBe('triangle');
        if (updatedShape && updatedShape.type === 'triangle') {
          expect(Number(updatedShape.width)).toBe(200);
          expect(Number(updatedShape.height)).toBe(250);
        }
      });
    });
  });

  describe('Star Update Flow', () => {
    it('updates star shape through store when form is submitted', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const star = createStar('star-1', 100, 100, 60, 30, 5, '#eab308');
      
      act(() => {
        store.current.addShape(star);
      });

      const mockOnClose = jest.fn();

      render(
        <ShapeModal
          shapeId="star-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      const outerRadiusInput = screen.getByTestId('shape-modal-outer-radius');
      const innerRadiusInput = screen.getByTestId('shape-modal-inner-radius');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(outerRadiusInput);
      await user.type(outerRadiusInput, '100');
      await user.clear(innerRadiusInput);
      await user.type(innerRadiusInput, '50');

      await user.click(applyButton);

      await waitFor(() => {
        const updatedShape = store.current.shapes.find((s) => s.id === 'star-1');
        expect(updatedShape).toBeDefined();
        expect(updatedShape?.type).toBe('star');
        if (updatedShape && updatedShape.type === 'star') {
          expect(Number(updatedShape.outerRadius)).toBe(100);
          expect(Number(updatedShape.innerRadius)).toBe(50);
          expect(updatedShape.points).toBe(5); // unchanged
        }
      });
    });
  });

  describe('Multiple Shapes Update', () => {
    it('updates correct shape when multiple shapes exist', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const rect1 = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      const rect2 = createRectangle('rect-2', 300, 300, 250, 200, '#22c55e');
      
      act(() => {
        store.current.addShape(rect1);
        store.current.addShape(rect2);
      });

      const mockOnClose = jest.fn();

      render(
        <ShapeModal
          shapeId="rect-2"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      const widthInput = screen.getByTestId('shape-modal-width');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(widthInput);
      await user.type(widthInput, '500');
      await user.click(applyButton);

      await waitFor(() => {
        const updatedShape2 = store.current.shapes.find((s) => s.id === 'rect-2');
        const unchangedShape1 = store.current.shapes.find((s) => s.id === 'rect-1');
        
        expect(updatedShape2).toBeDefined();
        if (updatedShape2 && updatedShape2.type === 'rectangle') {
          expect(Number(updatedShape2.width)).toBe(500);
        }
        
        expect(unchangedShape1).toBeDefined();
        if (unchangedShape1 && unchangedShape1.type === 'rectangle') {
          expect(unchangedShape1.width).toBe(200); // unchanged
        }
      });
    });
  });

  describe('Shape Update Persistence', () => {
    it('maintains updated shape properties after modal closes and reopens', async () => {
      const user = userEvent.setup();
      const { result: store } = renderHook(() => useCanvasStore(CANVAS_SIZE));
      
      const rectangle = createRectangle('rect-1', 100, 100, 200, 150, '#3b82f6');
      
      act(() => {
        store.current.addShape(rectangle);
      });

      const mockOnClose = jest.fn();

      const { rerender } = render(
        <ShapeModal
          shapeId="rect-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      // First update
      const widthInput = screen.getByTestId('shape-modal-width');
      const applyButton = screen.getByTestId('shape-modal-apply');

      await user.clear(widthInput);
      await user.type(widthInput, '300');
      await user.click(applyButton);

      await waitFor(() => {
        const updatedShape = store.current.shapes.find((s) => s.id === 'rect-1');
        if (updatedShape && updatedShape.type === 'rectangle') {
          expect(Number(updatedShape.width)).toBe(300);
        }
      });

      // Close modal
      act(() => {
        mockOnClose.mockClear();
      });

      // Reopen modal
      rerender(
        <ShapeModal
          shapeId="rect-1"
          shapes={store.current.shapes}
          isOpen={true}
          onClose={mockOnClose}
          onUpdate={(shapeId, updates) => {
            act(() => {
              store.current.updateShape(shapeId, updates);
            });
          }}
        />
      );

      // Verify form shows updated values
      await waitFor(() => {
        expect(screen.getByTestId('shape-modal-width')).toHaveValue(300);
      });
    });
  });
});

