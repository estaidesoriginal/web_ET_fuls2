import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Admin from './Admin';

describe('Admin Component', () => {
  it('renderiza sin crashear', () => {
    const { container } = render(<Admin onLogout={() => {}} />);
    expect(container).toBeTruthy();
  });
});