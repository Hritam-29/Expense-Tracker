
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditExpense from '../EditExpense';
import { BrowserRouter } from 'react-router-dom';

// turning off warnings and logs
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// mocking navigate & param
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '123' }),
}));

// api mocked
const mockGet = jest.fn();
const mockPut = jest.fn();
jest.mock('../../api/api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
    put: (...args) => mockPut(...args),
  },
}));

const renderComponent = () => {
  render(
    <BrowserRouter>
      <EditExpense />
    </BrowserRouter>
  );
};

describe('EditExpense Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads existing expense data and populates fields', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        title: 'Dinner',
        amount: 250,
        category: 'Food',
        date: '2025-12-01T00:00:00',
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Dinner')).toBeInTheDocument();
      expect(screen.getByDisplayValue('250')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-12-01')).toBeInTheDocument();
    });

    expect(mockGet).toHaveBeenCalledWith('/expenses/123');
  });

  test('shows error if unable to load expense', async () => {
    mockGet.mockRejectedValueOnce(new Error('Load failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Unable to load expense/i)).toBeInTheDocument();
    });
  });

  test('shows error if amount <= 0 (client-side validation)', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        title: 'Dinner',
        amount: 250,
        category: 'Food',
        date: '2025-12-01T00:00:00',
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Dinner')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Amount/i), {
      target: { value: '-50' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Expense/i }));

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
    });

    expect(mockPut).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('updates expense successfully and navigates', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        title: 'Dinner',
        amount: 250,
        category: 'Food',
        date: '2025-12-01T00:00:00',
      },
    });

    mockPut.mockResolvedValueOnce({ data: { success: true } });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Dinner')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/Expense title/i), {
      target: { value: 'Updated Dinner' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Amount/i), {
      target: { value: '300' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Expense/i }));

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/expenses/123', {
        title: 'Updated Dinner',
        amount: 300,
        category: 'Food',
        date: '2025-12-01',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error if update fails', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        title: 'Dinner',
        amount: 250,
        category: 'Food',
        date: '2025-12-01T00:00:00',
      },
    });

    mockPut.mockRejectedValueOnce(new Error('Update failed'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Dinner')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Update Expense/i }));

    await waitFor(() => {
      expect(screen.getByText(/Update failed/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows custom category input when "Other" is selected', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        title: 'Dinner',
        amount: 250,
        category: 'Food',
        date: '2025-12-01T00:00:00',
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Other' } });
    expect(screen.getByPlaceholderText(/Enter custom category/i)).toBeInTheDocument();
  });
});
