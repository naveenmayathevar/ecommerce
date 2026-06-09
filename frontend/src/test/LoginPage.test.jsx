import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../auth/LoginPage';

vi.mock('axios');

const renderLogin = (loginFn = vi.fn()) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ login: loginFn }}>
        <LoginPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('LoginPage', () => {
  test('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  test('shows Login button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('calls login context function on successful submit', async () => {
    const mockLogin = vi.fn();
    axios.post.mockResolvedValue({
      data: { user: { name: 'Alice' }, token: 'tok123' }
    });
    renderLogin(mockLogin);
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'a@b.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'password' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /login/i }).closest('form'));
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith(
      { name: 'Alice' }, 'tok123'
    ));
  });
});