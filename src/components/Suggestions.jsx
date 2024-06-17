import React from 'react';

const Suggestions = ({ suggestions }) => {
  if (suggestions.error) {
    return <div>{suggestions.error}</div>;
  }
  
  return (
    <div>
      <p>Suggestions are made by ChatGPT. Check important info.</p>
      <div id="suggestions">
        <h3>Expenses Suggestions</h3>
        {suggestions.expenses_advice && suggestions.expenses_advice.map((advice, index) => (
          <div key={index}>
            <strong>Type:</strong> {advice.type}<br />
            <strong>Advice:</strong> {advice.advice}<br />
            <strong>Classification:</strong> {advice.classification}<br />
          </div>
        ))}
        <h3>Income Suggestions</h3>
        {suggestions.income_advice && suggestions.income_advice.map((advice, index) => (
          <div key={index}>
            <strong>Type:</strong> {advice.type}<br />
            <strong>Advice:</strong> {advice.advice}<br />
            <strong>Classification:</strong> {advice.classification}<br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;



