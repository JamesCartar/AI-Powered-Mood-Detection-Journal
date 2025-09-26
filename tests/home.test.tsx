import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Page from '../app/page';

vi.mock('@clerk/nextjs', () => ({
  auth: () => new Promise((resolve) => resolve({ userId: 'whatever' })),
  ClerkProvider: ({ children }) => <div>{children}</div>,
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'user_2NNEqL2nrIRdJ194ndJqAHwEfxC',
      fullName: 'Charles Harris',
    },
  }),
}));

test('home', async () => {
  render(await Page());
  expect(screen.getByText('tracking your mood')).toBeTruthy();
});
