import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createDefaultState } from './lib/repository';
import { useOltStore } from './store/olt-store';

function reset() {
  localStorage.clear();
  const d = createDefaultState();
  useOltStore.setState({ settings: d.settings, intentionsByDay: d.intentionsByDay });
}
beforeEach(() => {
  reset();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('One Last Thing', () => {
  it('shows the intro and is visible (no opacity-freeze)', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Close the day/ })).toBeVisible();
  });

  it('runs the tidy countdown and advances to the intention step', () => {
    useOltStore.setState((s) => ({ settings: { ...s.settings, tidySecs: 3 } }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    expect(screen.getByRole('heading', { name: /Tidy one surface/ })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByRole('heading', { name: /Tomorrow, one thing/ })).toBeInTheDocument();
  });

  it('saves the intention and reaches the done screen', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Begin' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done early' }));
    fireEvent.change(screen.getByLabelText(/intention/i), { target: { value: 'walk at dawn' } });
    fireEvent.click(screen.getByRole('button', { name: 'Set it down' }));
    expect(screen.getByRole('heading', { name: /That.?s everything/ })).toBeInTheDocument();
    const saved = Object.values(useOltStore.getState().intentionsByDay);
    expect(saved).toContain('walk at dawn');
  });
});
