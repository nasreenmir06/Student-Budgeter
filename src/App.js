import React, { useState, useRef } from 'react';
import { Button, Nav, Navbar, NavDropdown, Col, Form, Row } from 'react-bootstrap';
import BalanceForm from './components/BalanceForm';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';
import BudgetChart from './components/BudgetChart';
import Suggestions from './components/Suggestions';
import axios from 'axios';

const App = () => {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [incomeList, setIncome] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartTimeRange, setChartTimeRange] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const resetZoomRef = useRef(null);

  const handleResetZoom = () => {
    if (resetZoomRef.current) {
      resetZoomRef.current();
    }
  };

  const addExpenses = (newExpenses) => {
    const updatedExpenses = [...expenses, ...newExpenses];
    setExpenses(updatedExpenses);
  };

  const addIncome = (newIncome) => {
    const updatedIncome = [...incomeList, ...newIncome];
    setIncome(updatedIncome);
  };

  const isValidValue = (value) => {
    const regex = /^-?\d+(\.\d+)?$/;
    return regex.test(value) && !isNaN(parseFloat(value));
  };

  const getChartMonths = (chartTimeRange) => {
    if (chartTimeRange === "Fall") {
      return ["September", "October", "November", "December"];
    }
    if (chartTimeRange === "Winter") {
      return ["January", "February", "March", "April"];
    }
    if (chartTimeRange === "OneSchoolYear") {
      return ["September", "October", "November", "December", "January", "February", "March", "April"];
    }
    if (chartTimeRange === "FourSchoolYears") {
      return ["September", "October", "November", "December", "January", "February", "March", "April",
              "September", "October", "November", "December", "January", "February", "March", "April",
              "September", "October", "November", "December", "January", "February", "March", "April",
              "September", "October", "November", "December", "January", "February", "March", "April"];
    }
  };

  const handleSubmitInfo = async () => {
    if (!chartTimeRange) {
      window.alert("Please choose a time range for your chart");
      return;
    }
    const monthLabels = getChartMonths(chartTimeRange);
    updateChart(expenses, incomeList, balance, monthLabels);
    setShowChart(true);
    setLoading(true);
    setShowSuggestions(false);
    setSuggestions(null);
    if (expenses.length !== 0) {
      const prompt = `
      I am a Canadian/American university student. Based on my financial info, provide some advice to improve my financial health:
      Expenses: ${expenses.map(exp => `\n  - Type: ${exp.expenseType}, Amount: ${exp.amount}, Frequency: ${exp.frequency}, Month: ${exp.month}`).join('')}
      Provide a sentence or two about each expense item, and you must express whether it is low, reasonable, or a lot.
      Here is some reference when generating your advice.
      Classifications for low, average, and high ranges of expenses for Canadian/American university students in various categories:
      Food (Monthly): Low range: CAD/USD 150 - 250, average range: CAD/USD 251 - 400, high range: CAD/USD 401 - 600+
      Rent (Monthly): Low range: CAD/USD 500 - 750, average range: CAD/USD 751 - 1250, high range: CAD/USD 1251 - 2500+
      Phone Bill (Monthly): Low range: CAD/USD 10 - 20, average range: CAD/USD 21 - 45, high range: CAD/USD 46 - 70+
      Transportation (Monthly): Low range: CAD/USD 0 - 100, average range: CAD/USD 101 - 200, high range: CAD/USD 201 - 400+
      Entertainment (Monthly): Low range: CAD/USD 0 - 50, average range: CAD/USD 51 - 150, high range: CAD/USD 151 - 300+
      Miscellaneous (Monthly): Low range: CAD/USD 0 - 175, average range: CAD/USD 176 - 250, high range: CAD/USD 251 - 400+
      You should always classify the tuition amount as reasonable, since this expense is not in the user's control.
      Provide the advice in the following JSON format:
      {
        "expenses_advice": [
          {
            "type": "<expense type>",
            "advice": "<advice>",
            "classification": "<low/reasonable/high>"
          },
          ...
        ],
      }
      `;
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/suggestions', { prompt });
        console.log(response.data.suggestion);
        setSuggestions(JSON.parse(response.data.suggestion));
        setShowSuggestions(true); 
      } catch (error) {
        setSuggestions({ error: 'Error fetching suggestions. Please try again later.' });
      } finally {
        setLoading(false); 
      }
    }
  };

  const updateChart = (updatedExpenses, updatedIncome, balance, monthLabels) => {
    const months = monthLabels;
    const colors = ['deeppink', 'lightblue', 'indigo', 'hotpink', 'indianred', 'greenyellow', 'firebrick', 'darkturquoise', 'cadetblue', 
                    'darkslateblue', 'orchid', 'lightgreen', 'firebrick', 'coral', 'darkseagreen', 'darkviolet', 'darkgoldenrod', 'crimson', 
                    'cornflowerblue', 'darksalmon', 'chartreuse', 'cyan', 'magenta'];
    const datasets = [];

    const paymentsDict = updatedExpenses.reduce((acc, expense) => {
      acc[expense.expenseType] = acc[expense.expenseType] || { monthly: 0, yearly: 0, onetime: 0, months: [] };
      const frequencyKey = expense.frequency.toLowerCase().replace(' ', '');
      if (frequencyKey in acc[expense.expenseType]) {
          acc[expense.expenseType][frequencyKey] += parseFloat(expense.amount);
          if (expense.frequency === "One Time" || expense.frequency === "Yearly") {
            acc[expense.expenseType].months.push(expense.month);
          }
      }
      return acc;
    }, {});

    Object.keys(paymentsDict).forEach((key) => {
      const data = new Array(months.length).fill(0);
      if (paymentsDict[key].monthly) {
          months.forEach((month, i) => data[i] = -paymentsDict[key].monthly);
      }
      if (paymentsDict[key].yearly) {
          paymentsDict[key].months.forEach((yearlyMonth) => {
              if (yearlyMonth) {
                monthLabels.forEach((month, index) => {
                  if (month === yearlyMonth) {
                      data[index] = -paymentsDict[key].yearly;
                  }
              });
              }
          });
      }
      if (paymentsDict[key].onetime) {
          paymentsDict[key].months.forEach((oneTimeMonth) => {
              if (oneTimeMonth) {
                  const monthIndex = months.indexOf(oneTimeMonth);
                  if (monthIndex !== -1) {
                      data[monthIndex] = -paymentsDict[key].onetime;
                  }
              }
          });
      }

      let colorIndex = Math.floor(Math.random() * colors.length);
      datasets.push({
          label: key,
          backgroundColor: colors[colorIndex],
          data: data,
          stack: 'payments'
      });
      colors.splice(colorIndex, 1);
    });

    const incomeDict = updatedIncome.reduce((acc, incomeList) => {
      acc[incomeList.incomeType] = acc[incomeList.incomeType] || { monthly: 0, yearly: 0, onetime: 0, months: [] };
      const frequencyKey = incomeList.frequency.toLowerCase().replace(' ', '');
      if (frequencyKey in acc[incomeList.incomeType]) {
          acc[incomeList.incomeType][frequencyKey] += parseFloat(incomeList.amount);
          if (incomeList.frequency === "One Time" || incomeList.frequency === "Yearly") {
            acc[incomeList.incomeType].months.push(incomeList.month);
          }
      }
      return acc;
    }, {});

    Object.keys(incomeDict).forEach((key) => {
      const data = new Array(months.length).fill(0);
      if (incomeDict[key].monthly) {
          months.forEach((month, i) => data[i] = incomeDict[key].monthly);
      }
      if (incomeDict[key].yearly) {
          incomeDict[key].months.forEach((yearlyMonth) => {
              if (yearlyMonth) {
                  const monthIndex = months.indexOf(yearlyMonth);
                  if (monthIndex !== -1) {
                      data[monthIndex] = incomeDict[key].yearly;
                  }
              }
          });
      }
      if (incomeDict[key].onetime) {
          incomeDict[key].months.forEach((oneTimeMonth) => {
              if (oneTimeMonth) {
                  const monthIndex = months.indexOf(oneTimeMonth);
                  if (monthIndex !== -1) {
                      data[monthIndex] = incomeDict[key].onetime;
                  }
              }
          });
      }
      
      let colorIndex = Math.floor(Math.random() * colors.length);
      datasets.push({
          label: key,
          backgroundColor: colors[colorIndex],
          data: data,
          stack: 'income'
      });
      colors.splice(colorIndex, 1);
    });

    const dataLineInfo = new Array(months.length).fill(0);
    let currentBalance = parseFloat(balance);
    months.forEach((month, i) => {
      datasets.forEach(set => {
        if (set.stack === 'payments' || set.stack === 'income') {
          currentBalance += parseFloat(set.data[i]);
        }
      });
      dataLineInfo[i] = currentBalance;
    });

    datasets.push({
      type: 'line',
      label: 'Monthly Balance',
      borderColor: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(0, 0, 0)',
      pointBackgroundColor: 'rgb(0, 0, 0)',
      pointBorderColor: 'rgb(0, 0, 0)',
      borderWidth: 2,
      fill: false,
      data: dataLineInfo
    });

    setChartData({
      labels: months,
      datasets: datasets
    });
  };
  
  return (
    <div className="d-flex flex-column min-vh-100 justify-content-top align-items-center">
      <Navbar className="justify-content-center fixed-top" expand={false} style={{ backgroundColor: '#e4e5e6' }}>
        <Navbar.Brand className="ml-auto">Student Budgeter</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Budgeting Resources - US Students" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://studentaid.gov/resources/prepare-for-college/students/budgeting">Budgeting</NavDropdown.Item>
                <NavDropdown.Item href="https://studentaid.gov/resources/prepare-for-college/students/budgeting/creating-your-budget">Creating Your Budget</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Budgeting Resources - Canadian Students" id="basic-nav-dropdown">
                <NavDropdown.Item href="https://www.csnpe-nslsc.canada.ca/en/managing-your-money/budgeting-for-student-life">Budgeting for Student Life</NavDropdown.Item>
                <NavDropdown.Item href="https://www.canada.ca/en/financial-consumer-agency/services/pay-down-student-debt.html">Managing your budget as a student</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="text-center w-100 pt-5 mt-5">
        <BalanceForm setBalance={setBalance} isValidValue={isValidValue} />
        <ExpenseForm addExpenses={addExpenses} expenses={expenses} isValidValue={isValidValue} />
        <IncomeForm addIncome={addIncome} incomeList={incomeList} isValidValue={isValidValue} />
        <Row>
          <Col xs={10} className="mb-3 mx-auto">
            <Form.Control
              as="select"
              value={chartTimeRange}
              onChange={(e) => setChartTimeRange(e.target.value)}
            >
              <option value="">Choose Time Range For Chart</option>
              <option value="Fall">Fall Semester</option>
              <option value="Winter">Winter Semester</option>
              <option value="OneSchoolYear">One School Year</option>
              <option value="FourSchoolYears">Four School Years</option>
            </Form.Control>
          </Col>
        </Row>
        <Button onClick={handleSubmitInfo} variant="primary" className="mb-3">Submit All Financial Info & Generate Chart</Button>
        {showChart && (
          <>
            <BudgetChart data={chartData} resetZoomRef={resetZoomRef} />
            <Button onClick={handleResetZoom} variant="primary" className="my-3">Reset Zoom</Button>
          </>
        )}
        {loading && expenses.length !== 0 && <p>Loading suggestions...</p>}
        {showSuggestions && <Suggestions suggestions={suggestions} />}
      </div>
    </div>
  );
};

export default App;
