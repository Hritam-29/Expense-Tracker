import { render, screen, waitFor } from '@testing-library/react';
import Reports from '../Reports';
import { BrowserRouter } from 'react-router-dom';

// turning off warnings and logs
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

// api mocked
const mockGet = jest.fn();
jest.mock('../../api/api', () => ({
  __esModule: true,
  default: {
    get: (...args) => mockGet(...args),
  },
}));

//  using mock Recharts
 
jest.mock('recharts', () => {
  const React = require('react');
  const PieChart = ({ children, width, height }) => (
    <div data-testid="pie-chart" data-width={width} data-height={height}>
      {children}
    </div>
  );
  const Pie = ({ data, dataKey, nameKey, label, children }) => (
    <div
      data-testid="pie"
      data-data={JSON.stringify(data)}
      data-data-key={dataKey}
      data-name-key={nameKey}
      data-label={label ? 'true' : 'false'}
    >
      {children}
    </div>
  );
  const Cell = ({ fill }) => <div data-testid="pie-cell" data-fill={fill} />;
  const BarChart = ({ data, children, width, height }) => (
    <div
      data-testid="bar-chart"
      data-data={JSON.stringify(data)}
      data-width={width}
      data-height={height}
    >
      {children}
    </div>
  );
  const Bar = ({ dataKey, fill }) => (
    <div data-testid="bar" data-data-key={dataKey} data-fill={fill} />
  );
  const XAxis = (props) => <div data-testid="x-axis" data-props={JSON.stringify(props)} />;
  const YAxis = (props) => <div data-testid="y-axis" data-props={JSON.stringify(props)} />;
  const CartesianGrid = (props) => <div data-testid="grid" data-props={JSON.stringify(props)} />;
  const Tooltip = () => <div data-testid="tooltip" />;
  const Legend = () => <div data-testid="legend" />;

  return {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  };
});

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Reports />
    </BrowserRouter>
  );
};

describe('Reports Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders headings and chart containers', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    renderComponent();

 
    expect(
      screen.getByRole('heading', { name: /Expense Reports/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Category-wise Expense Distribution/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Monthly Expense Totals/i })
    ).toBeInTheDocument();

    // mocked Recharts
    await waitFor(() => {
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      expect(screen.getByTestId('pie')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar')).toBeInTheDocument();
    });

    // called api
    expect(mockGet).toHaveBeenCalledWith('/expenses');
  });

  test('computes correct category totals for Pie (Food 250, Transport 50)', async () => {
    const expenses = [
      { title: 'A', amount: 100, category: 'Food', date: '2025-01-15T00:00:00' },
      { title: 'B', amount: 50, category: 'Transport', date: '2025-01-20T00:00:00' },
      { title: 'C', amount: 150, category: 'Food', date: '2025-03-01T00:00:00' },
    ];
    mockGet.mockResolvedValueOnce({ data: expenses });

    renderComponent();

    
    const pieDiv = await screen.findByTestId('pie');
    const pieData = JSON.parse(pieDiv.getAttribute('data-data'));

    // aggregated data
    const expectedPie = [
      { name: 'Food', value: 250 },
      { name: 'Transport', value: 50 },
    ];


    expect(pieData).toEqual(
      expect.arrayContaining(expectedPie)
    );
    expect(pieData).toHaveLength(2);

    // number of cells ha to be equal to number of categories
    const cells = screen.getAllByTestId('pie-cell');
    expect(cells.length).toBe(2);
  });

  test('computes correct monthly totals for Bar (Jan=150, Mar=150)', async () => {
    const expenses = [
      { title: 'A', amount: 100, category: 'Food', date: '2025-01-15T00:00:00' },
      { title: 'B', amount: 50, category: 'Transport', date: '2025-01-20T00:00:00' },
      { title: 'C', amount: 150, category: 'Food', date: '2025-03-01T00:00:00' },
    ];
    mockGet.mockResolvedValueOnce({ data: expenses });

    renderComponent();

    const barChartDiv = await screen.findByTestId('bar-chart');
    const barData = JSON.parse(barChartDiv.getAttribute('data-data'));

    // finding month amount
    const amtFor = (monthName) =>
      barData.find((d) => d.month === monthName)?.amount ?? null;

    expect(amtFor('January')).toBe(150);  
    expect(amtFor('March')).toBe(150);    
    expect(amtFor('February')).toBe(0);
    expect(barData).toHaveLength(12);     
  });

  test('handles empty data: no categories, 12 zeroed months', async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    renderComponent();

    const pieDiv = await screen.findByTestId('pie');
    const pieData = JSON.parse(pieDiv.getAttribute('data-data'));
    expect(pieData).toEqual([]);          

    const barChartDiv = await screen.findByTestId('bar-chart');
    const barData = JSON.parse(barChartDiv.getAttribute('data-data'));
    expect(barData).toHaveLength(12);
    barData.forEach((d) => expect(d.amount).toBe(0));
  });

  test('handles API failure gracefully: charts render with empty datasets', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error'));

    renderComponent();

    // charts will be rendered in UI
    await waitFor(() => {
      expect(screen.getByTestId('pie')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    // datasets are reset
    const pieDiv = screen.getByTestId('pie');
    const pieData = JSON.parse(pieDiv.getAttribute('data-data'));
    expect(pieData).toEqual([]);

    const barChartDiv = screen.getByTestId('bar-chart');
    const barData = JSON.parse(barChartDiv.getAttribute('data-data'));
    expect(barData).toHaveLength(12);
    barData.forEach((d) => expect(d.amount).toBe(0));
  });
});
