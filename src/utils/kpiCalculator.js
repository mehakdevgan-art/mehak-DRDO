export const calculateSPI = (earnedValue, plannedValue) => {
  if (plannedValue === 0) return 1;
  return Number((earnedValue / plannedValue).toFixed(2));
};

export const calculateCPI = (earnedValue, actualCost) => {
  if (actualCost === 0) return 1;
  return Number((earnedValue / actualCost).toFixed(2));
};

export const calculateProjectHealth = (progress, budgetUsed, risksCount) => {
  let score = 100;
  
  // Penalize for low progress compared to expected (simplified)
  if (progress < 50) score -= 10;
  if (progress < 25) score -= 20;

  // Penalize for budget overruns
  if (budgetUsed > 100) score -= 30;
  else if (budgetUsed > 80) score -= 15;

  // Penalize for risks
  score -= (risksCount * 5);

  if (score > 85) return { status: 'Excellent', score };
  if (score > 70) return { status: 'Good', score };
  if (score > 50) return { status: 'Needs Attention', score };
  return { status: 'Critical', score: Math.max(0, score) };
};

export const calculateMissionReadiness = (tasksCompleted, totalTasks, dependenciesMet) => {
    if(totalTasks === 0) return 100;
    const taskCompletionRate = (tasksCompleted / totalTasks) * 100;
    const readiness = (taskCompletionRate * 0.7) + (dependenciesMet ? 30 : 0);
    return Math.min(100, Math.round(readiness));
}
