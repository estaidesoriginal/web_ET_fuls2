
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock alert para jsdom
globalThis.alert = vi.fn();


vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: () => ({
      // select().order()
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
        }),
      }),
      // insert().select().single()
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: {}, error: null }),
        }),
      }),
      // update().eq()
      update: () => ({
        eq: () => Promise.resolve({ data: {}, error: null }),
      }),
      // delete().eq()
      delete: () => ({
        eq: () => Promise.resolve({ data: {}, error: null }),
      }),
    }),
  })),
}));


import './setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('setupTests.js environment', () => {
  beforeEach(() => {
    if (vi.isMockFunction(globalThis.alert)) {
      globalThis.alert.mockClear();
    }
    document.body.innerHTML = '';
  });

  it('enables @testing-library/jest-dom matchers', () => {
    const el = document.createElement('div');
    el.textContent = 'Hello';
    document.body.appendChild(el);
    expect(el).toBeInTheDocument();
  });

  it('mocks global alert with vi.fn', () => {
    expect(vi.isMockFunction(globalThis.alert)).toBe(true);
    alert('test message');
    expect(globalThis.alert).toHaveBeenCalledTimes(1);
    expect(globalThis.alert).toHaveBeenCalledWith('test message');
  });

  it('mocks @supabase/supabase-js createClient and CRUD chains', async () => {
    expect(vi.isMockFunction(createClient)).toBe(true);

    const supabase = createClient('url', 'anon-key');
    expect(typeof supabase.from).toBe('function');

    const table = supabase.from('products');

    const readRes = await table.select().order();
    expect(readRes).toEqual({ data: [], error: null });

    const singleRes = await table.select().eq('id', 1).single();
    expect(singleRes).toEqual({ data: null, error: { code: 'PGRST116' } });

    const insertRes = await table.insert({ name: 'X' }).select().single();
    expect(insertRes).toEqual({ data: {}, error: null });

    const updateRes = await table.update({ name: 'Y' }).eq('id', 1);
    expect(updateRes).toEqual({ data: {}, error: null });

    const deleteRes = await table.delete().eq('id', 1);
    expect(deleteRes).toEqual({ data: {}, error: null });
  });
});
