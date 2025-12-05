
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddExpense from '../AddExpense';
import { BrowserRouter } from 'react-router-dom';

// turning off future warnings for console log 
jest.spyOn(console, 'warn').mockImplementation(() => {});


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// mocking the api module 
const mockPost = jest.fn();
jest.mock('../../api/api', () => ({
  __esModule: true,
  default: {
    post: (...args) => mockPost(...args),
  },
}));

const renderComponent = () => {
  render(
    <BrowserRouter>
      <AddExpense />
    </BrowserRouter>
  );
};

describe('AddExpense Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields', () => {
    renderComponent();
    // to avoid duplicate text error
    expect(screen.getByRole('heading', { name: /Add Expense/i })).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument();
  });

  test('shows error if amount <= 0 (client-side validation)', async () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Test Expense' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '-10' } });
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2025-12-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Expense/i }));

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument();
    });

    expect(mockPost).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows custom category input when "Other" is selected', () => {
    renderComponent();
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Other' } });
    expect(screen.getByTestId('custom-category-input')).toBeInTheDocument();
  });

  test('calls API and navigates on valid submit', async () => {
    mockPost.mockResolvedValueOnce({ data: { success: true } });

    renderComponent();

    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Lunch' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '100' } });
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Food' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2025-12-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Expense/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith('/expenses', {
        title: 'Lunch',
        amount: 100,
        category: 'Food',
        date: '2025-12-01',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows server error if API fails', async () => {
    mockPost.mockRejectedValueOnce(new Error('Server error'));

    renderComponent();

    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Taxi' } });
    fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '50' } });
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Transport' } });
    fireEvent.change(screen.getByTestId('date-input'), { target: { value: '2025-12-01' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Expense/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to add expense/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
