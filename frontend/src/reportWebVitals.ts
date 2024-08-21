import { ReportHandler, getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Measure and report Core Web Vitals
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);

    // Additional custom logging for AI Zona specific metrics
    console.log('AI Zona: Web Vitals reported');
  } else {
    console.warn('AI Zona: Web Vitals reporting skipped - invalid or missing callback');
  }
};

export default reportWebVitals;