import { ActivityChart } from './components/dashboard/ActivityChart';

const mockData = [
  { total: 10, week: 1, days: [0, 0, 0, 10, 0, 0, 0] },
  { total: 20, week: 2, days: [0, 0, 0, 20, 0, 0, 0] },
  { total: 5, week: 3, days: [0, 0, 0, 5, 0, 0, 0] },
  { total: 30, week: 4, days: [0, 0, 0, 30, 0, 0, 0] },
];

export function DebugChartPage() {
  return (
    <div className="p-20 bg-bg min-h-screen">
      <h1 className="text-3xl text-text mb-10">Activity Chart Debug</h1>
      <div className="max-w-4xl">
        <ActivityChart data={mockData} />
      </div>
      
      <h2 className="text-2xl text-text mt-20 mb-5">Loading State</h2>
      <div className="max-w-4xl">
        <ActivityChart data={undefined} />
      </div>

      <h2 className="text-2xl text-text mt-20 mb-5">Computing State (null)</h2>
      <div className="max-w-4xl">
        <ActivityChart data={null} />
      </div>

      <h2 className="text-2xl text-text mt-20 mb-5">Empty State ([])</h2>
      <div className="max-w-4xl">
        <ActivityChart data={[]} />
      </div>
    </div>
  );
}
