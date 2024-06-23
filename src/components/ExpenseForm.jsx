import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';

const ExpenseForm = ({ addExpenses, expenses, isValidValue }) => {
  const [expenseType, setExpenseType] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [month, setMonth] = useState('');

  const handleAddExpense = () => {
    if (!expenseType || !frequency || (['One Time', 'Yearly'].includes(frequency) && !month)) {
      window.alert("Please do not leave a default payment selection");
      return;
    }
    if (!isValidValue(amount)) {
      window.alert("Please enter a valid expense amount");
      return;
    }
    const newExpenses = [{ expenseType, amount, frequency, month }];
    addExpenses(newExpenses);
    setExpenseType('');
    setAmount('');
    setFrequency('');
    setMonth('');
  };

  const handleFrequencyChange = (e) => {
    const value = e.target.value;
    setFrequency(value);
    if (value === 'One Time' || value === 'Yearly') {
      setMonth('');
    }
  };

  return (
    <div className="d-flex flex-column align-items-center w-75 mx-auto">
      <Form className="w-100">
        <h3 className="mb-4">Payments</h3>
        <Form.Group as={Row} className="align-items-center">
          <Form.Label column sm={2}>Expense Type</Form.Label>
          <Col sm={10}>
            <Form.Control 
              as="select" 
              value={expenseType} 
              onChange={(e) => setExpenseType(e.target.value)}
            >
              <option value="">Choose Expense Type</option>
              <option value="Food">Food</option>
              <option value="Housing">Housing</option>
              <option value="Utilities">Utilities</option>
              <option value="Tuition">Tuition</option>
              <option value="Phone">Phone Bill</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Miscellaneous">Miscellaneous (Payment)</option>
            </Form.Control>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>Amount</Form.Label>
          <Col sm={10}>
            <Form.Control 
              type="text" 
              placeholder="Enter amount here" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>Frequency</Form.Label>
          <Col sm={10}>
            <Form.Control 
              as="select" 
              value={frequency} 
              onChange={handleFrequencyChange}
            >
              <option value="">How often does this expense occur?</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="One Time">One Time</option>
            </Form.Control>
          </Col>
        </Form.Group>
        {(frequency === 'One Time' || frequency === 'Yearly') && (
          <Form.Group as={Row}>
            <Form.Label column sm={2}>Month</Form.Label>
            <Col sm={10}>
              <Form.Control 
                as="select" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select Payment Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </Form.Control>
            </Col>
          </Form.Group>
        )}
        <Button onClick={handleAddExpense} variant="primary">Add Expense</Button>
      </Form>
      <Container className="mt-4 mb-3">
        {Array.from({ length: Math.ceil(expenses.length / 3) }).map((_, rowIndex) => (
          <Row key={rowIndex} xs={1} sm={2} md={3} className="g-4 justify-content-center mb-3">
            {expenses
              .slice(rowIndex * 3, rowIndex * 3 + 3)
              .map((expense, index) => (
                <Col key={index}>
                  <Card className="h-100" border="dark">
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Card.Title>{expense.expenseType}</Card.Title>
                      <Card.Text>
                        <strong>Amount:</strong> ${expense.amount}<br />
                        <strong>Frequency:</strong> {expense.frequency}<br />
                        {expense.month && <><strong>Month:</strong> {expense.month}</>}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        ))}
      </Container>
    </div>
  );
};

export default ExpenseForm;



