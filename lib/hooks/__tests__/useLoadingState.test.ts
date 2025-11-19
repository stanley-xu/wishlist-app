// Mock expo to prevent winter runtime issues
jest.mock('expo', () => ({}));

import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import { useLoadingState } from '../useLoadingState';

describe('useLoadingState', () => {
  // ============================================================================
  // Basic Functionality Tests
  // ============================================================================

  describe('Basic Functionality', () => {
    it('should start with loading as false', () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const { result } = renderHook(() => useLoadingState(mockFn));

      expect(result.current.loading).toBe(false);
    });

    it('should set loading to true when action is called', async () => {
      const mockFn = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'result';
      });

      const { result } = renderHook(() => useLoadingState(mockFn));

      let loadingDuringExecution = false;

      act(() => {
        result.current.action();
        loadingDuringExecution = result.current.loading;
      });

      expect(loadingDuringExecution).toBe(true);
    });

    it('should set loading to false after action completes', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const { result } = renderHook(() => useLoadingState(mockFn));

      await act(async () => {
        await result.current.action();
      });

      expect(result.current.loading).toBe(false);
    });

    it('should return the result from the wrapped function', async () => {
      const expectedResult = { data: 'test-data' };
      const mockFn = jest.fn().mockResolvedValue(expectedResult);
      const { result } = renderHook(() => useLoadingState(mockFn));

      let actualResult;
      await act(async () => {
        actualResult = await result.current.action();
      });

      expect(actualResult).toEqual(expectedResult);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should set loading to false when function throws', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() => useLoadingState(mockFn));

      await act(async () => {
        try {
          await result.current.action();
        } catch (error) {
          // Expected error
        }
      });

      expect(result.current.loading).toBe(false);
    });

    it('should propagate errors to the caller', async () => {
      const testError = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(testError);
      const { result } = renderHook(() => useLoadingState(mockFn));

      let caughtError;
      await act(async () => {
        try {
          await result.current.action();
        } catch (error) {
          caughtError = error;
        }
      });

      expect(caughtError).toBe(testError);
    });

    it('should handle synchronous errors', async () => {
      const testError = new Error('Sync error');
      const mockFn = jest.fn(() => {
        throw testError;
      });
      const { result } = renderHook(() => useLoadingState(mockFn));

      let caughtError;
      await act(async () => {
        try {
          await result.current.action();
        } catch (error) {
          caughtError = error;
        }
      });

      expect(caughtError).toBe(testError);
      expect(result.current.loading).toBe(false);
    });
  });

  // ============================================================================
  // Argument Passing Tests
  // ============================================================================

  describe('Argument Passing', () => {
    it('should pass arguments to the wrapped function', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const { result } = renderHook(() => useLoadingState(mockFn));

      const testArg = { id: '123', name: 'test' };
      await act(async () => {
        await result.current.action(testArg);
      });

      expect(mockFn).toHaveBeenCalledWith(testArg);
    });

    it('should work with multiple arguments', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const { result } = renderHook(() => useLoadingState(mockFn));

      await act(async () => {
        await result.current.action('arg1', 'arg2', 'arg3');
      });

      // Note: Current implementation only passes first arg
      // This test will fail with current implementation
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    });

    it('should work with no arguments', async () => {
      const mockFn = jest.fn().mockResolvedValue('result');
      const { result } = renderHook(() => useLoadingState(mockFn));

      await act(async () => {
        await result.current.action();
      });

      expect(mockFn).toHaveBeenCalledWith(undefined);
    });
  });

  // ============================================================================
  // Stale Closure Bug Tests (THESE WILL FAIL with current implementation)
  // ============================================================================

  describe('Stale Closure Bug', () => {
    it('should call the latest version of fn when it changes', async () => {
      const mockFn1 = jest.fn().mockResolvedValue('result1');
      const mockFn2 = jest.fn().mockResolvedValue('result2');

      let currentFn = mockFn1;
      const { result, rerender } = renderHook(() => useLoadingState(currentFn));

      // Call with first function
      await act(async () => {
        await result.current.action();
      });
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(0);

      // Change the function
      currentFn = mockFn2;
      rerender();

      // Call with second function - should use mockFn2
      await act(async () => {
        await result.current.action();
      });

      // ⚠️ This will FAIL with current implementation
      // Current behavior: mockFn1 called twice, mockFn2 never called
      // Expected behavior: mockFn1 called once, mockFn2 called once
      expect(mockFn1).toHaveBeenCalledTimes(1); // Should stay at 1
      expect(mockFn2).toHaveBeenCalledTimes(1); // Should be called
    });

    it('should use updated function in real-world scenario', async () => {
      // Simulate a component that changes its async function
      let counter = 0;

      const createFn = (id: number) => jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return `result-${id}`;
      });

      let fn = createFn(counter);
      const { result, rerender } = renderHook(() => useLoadingState(fn));

      // First call
      let firstResult;
      await act(async () => {
        firstResult = await result.current.action();
      });
      expect(firstResult).toBe('result-0');

      // Update function
      counter++;
      fn = createFn(counter);
      rerender();

      // Second call - should use new function
      let secondResult;
      await act(async () => {
        secondResult = await result.current.action();
      });

      // ⚠️ This will FAIL - will still return 'result-0'
      expect(secondResult).toBe('result-1');
    });
  });

  // ============================================================================
  // Concurrent Calls Tests (THESE WILL FAIL with current implementation)
  // ============================================================================

  describe('Concurrent Calls', () => {
    it('should handle overlapping calls correctly', async () => {
      let resolveFirst: () => void;
      let resolveSecond: () => void;

      const firstPromise = new Promise<string>(resolve => {
        resolveFirst = () => resolve('first');
      });
      const secondPromise = new Promise<string>(resolve => {
        resolveSecond = () => resolve('second');
      });

      let callCount = 0;
      const mockFn = jest.fn(async () => {
        callCount++;
        return callCount === 1 ? firstPromise : secondPromise;
      });

      const { result } = renderHook(() => useLoadingState(mockFn));

      // Start first call
      let firstCall: Promise<string>;
      await act(async () => {
        firstCall = result.current.action();
      });
      expect(result.current.loading).toBe(true);

      // Start second call while first is still pending
      let secondCall: Promise<string>;
      await act(async () => {
        secondCall = result.current.action();
      });
      expect(result.current.loading).toBe(true);

      // Resolve first call
      await act(async () => {
        resolveFirst!();
        await firstCall;
      });

      // ⚠️ This will FAIL - loading will be false even though second call is pending
      expect(result.current.loading).toBe(true); // Should still be true

      // Resolve second call
      await act(async () => {
        resolveSecond!();
        await secondCall;
      });

      expect(result.current.loading).toBe(false); // Now it should be false
    });

    it('should keep loading true until all calls complete', async () => {
      const delays = [100, 50, 150]; // Different delays
      let completedCount = 0;

      const mockFn = jest.fn(async (delay: number) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        completedCount++;
        return `result-${delay}`;
      });

      const { result } = renderHook(() => useLoadingState(mockFn));

      // Start all three calls
      const calls = delays.map(async delay => {
        return act(async () => {
          return result.current.action(delay);
        });
      });

      // All should be running
      expect(result.current.loading).toBe(true);

      // Wait for first to complete (50ms)
      await new Promise(resolve => setTimeout(resolve, 60));

      // ⚠️ This will FAIL - loading might be false after first completion
      expect(result.current.loading).toBe(true); // Should still be true

      // Wait for all to complete
      await Promise.all(calls);

      expect(result.current.loading).toBe(false);
      expect(completedCount).toBe(3);
    });
  });

  // ============================================================================
  // Type Safety Tests
  // ============================================================================

  describe('Type Safety', () => {
    it('should preserve return type of wrapped function', async () => {
      interface User {
        id: string;
        name: string;
      }

      const mockFn = jest.fn(async (): Promise<User> => ({
        id: '123',
        name: 'Test User',
      }));

      const { result } = renderHook(() => useLoadingState<User>(mockFn));

      let user: User | undefined;
      await act(async () => {
        user = await result.current.action();
      });

      // TypeScript should infer this correctly
      expect(user?.id).toBe('123');
      expect(user?.name).toBe('Test User');
    });
  });
});
