import React from 'react';

interface SpinnerProps {
  size?: number; // Optional prop for the size of the spinner
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40 }) => {
  return (
    <div style={spinnerContainerStyle}>
      <svg
        style={{ ...spinnerStyle, height: `${size}px`, width: `${size}px` }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          style={{ opacity: 0.25 }}
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          style={{ opacity: 0.75 }}
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
    </div>
  );
};

const spinnerContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 6px'
};

const spinnerStyle: React.CSSProperties = {
  color: '#fff', // Adjust the color as needed
  animation: 'spin 1s linear infinite', // Spinning animation
};

// Injecting keyframes into the document safely
function addSpinnerKeyframes() {
  const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;

  // Create a new stylesheet if none exists
  let styleSheet = document.styleSheets[0];
  if (!styleSheet) {
    const style = document.createElement('style');
    document.head.appendChild(style);
    styleSheet = style.sheet!;
  }

  // Insert the keyframes rule
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

// Call the function to add keyframes on component initialization
addSpinnerKeyframes();

export default Spinner;
