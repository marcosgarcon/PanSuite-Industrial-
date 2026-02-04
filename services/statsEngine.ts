
export const calculateStats = (data: number[], usl: number, lsl: number) => {
  if (data.length === 0) return null;

  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  
  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (data.length - 1);
  const stdDev = Math.sqrt(variance);

  // Cp = (USL - LSL) / (6 * sigma)
  const cp = (usl - lsl) / (6 * stdDev);

  // Cpk = min((USL - Mean) / (3 * sigma), (Mean - LSL) / (3 * sigma))
  const cpkUpper = (usl - mean) / (3 * stdDev);
  const cpkLower = (mean - lsl) / (3 * stdDev);
  const cpk = Math.min(cpkUpper, cpkLower);

  return {
    mean: mean.toFixed(4),
    stdDev: stdDev.toFixed(4),
    cp: cp.toFixed(2),
    cpk: cpk.toFixed(2),
    count: data.length,
    status: cpk >= 1.33 ? 'OPTIMAL' : cpk >= 1.0 ? 'ACCEPTABLE' : 'CRITICAL'
  };
};
