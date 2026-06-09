import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from '../context/AuthContext';

const TestComponent = () => {
  const { user, login, logout } = useContext(AuthContext);
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'none'}</span>
      <button onClick={() => login({ name: 'Alice' }, 'token123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  test('starts with no user', () => {
    localStorage.clear();
    render(<AuthProvider><TestComponent /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('none');
  });

  test('sets user after login', () => {
    localStorage.clear();
    render(<AuthProvider><TestComponent /></AuthProvider>);
    act(() => screen.getByText('Login').click());
    expect(screen.getByTestId('user').textContent).toBe('Alice');
  });

  test('clears user after logout', () => {
    localStorage.clear();
    render(<AuthProvider><TestComponent /></AuthProvider>);
    act(() => screen.getByText('Login').click());
    act(() => screen.getByText('Logout').click());
    expect(screen.getByTestId('user').textContent).toBe('none');
  });
});