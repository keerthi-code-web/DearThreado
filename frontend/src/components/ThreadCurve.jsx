import React from 'react';

const ThreadCurve = () => {
  return (
    <div className="w-100 my-4 overflow-hidden" style={{ height: '30px' }}>
      <svg viewBox="0 0 1200 30" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <path 
          d="M0,15 C150,30 350,0 600,15 C850,30 1050,0 1200,15" 
          fill="none" 
          stroke="#DDD6FE" 
          strokeWidth="2" 
          strokeDasharray="6 4"
        />
      </svg>
    </div>
  );
};

export default ThreadCurve;
