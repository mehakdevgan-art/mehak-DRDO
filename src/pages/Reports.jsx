import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import { ErrorState, LoadingBlock } from '../components/AsyncState';
import { getReport } from '../services/operationsService';
import ExecutiveSummary from '../components/reports/ExecutiveSummary';
import { printToPDF } from '../utils/exportUtils';

export default function Reports() {
  const q = useQuery({ queryKey: ['portfolio-report'], queryFn: getReport });

  if (q.isLoading) return <LoadingBlock />;
  if (q.isError) return <ErrorState error={q.error} retry={q.refetch} />;
  
  const d = q.data.dashboard;
  
  const summaryData = {
    progress: d.overall_progress || 72,
    budgetUtilized: d.budget_utilization || 72,
    expenditure: 420, 
    allocation: 580,
    risks: [
      { level: 'High', title: 'Critical Procurement Delay', description: 'Delayed delivery of specialized sensors is threatening the Autonomous UAV Platform schedule.' },
      { level: 'High', title: 'High-Risk Dependency', description: 'Testing phase behind schedule due to unavailability of the wind tunnel facility.' },
      { level: 'Medium', title: 'Budget Overrun Predicted', description: 'Current expenditure trend indicates a possible 8% budget overrun in the Radar Modernization project.' }
    ],
    recommendations: [
      'Increase testing resources for the Secure Communication Network to reduce the projected 10-day delay.',
      'Immediate financial audit recommended for the Next Gen Radar Modernization project.',
      'Reallocate two engineers from Deployment to Testing to improve milestone completion rates.'
    ]
  };

  return (
    <>
      <PageHeader 
        eyebrow="Decision support" 
        title="Portfolio Report" 
        description={`Generated dynamically on ${q.data.generated_on}.`}
      />
      
      <div className="mt-6">
        <ExecutiveSummary data={summaryData} onExport={printToPDF} />
      </div>
    </>
  );
}
