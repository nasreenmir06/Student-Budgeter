import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';

const IncomeForm = ({ addIncome, incomeList, isValidValue }) => {
  const [incomeType, setIncomeType] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('');
  const [month, setMonth] = useState('');

  const handleAddIncome = () => {
    if (!incomeType || !frequency || (['One Time', 'Yearly'].includes(frequency) && !month)) {
      window.alert("Please do not leave a default income selection");
      return;
    }
    if (!isValidValue(amount)) {
      window.alert("Please enter a valid income amount");
      return;
    }
    const newIncome = [{ incomeType, amount, frequency, month }];
    addIncome(newIncome);
    setIncomeType('');
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
        <h3 className="mb-4">Income</h3>
        <Form.Group as={Row} className="align-items-center">
          <Form.Label column sm={2}>Income Type</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="select"
              value={incomeType}
              onChange={(e) => setIncomeType(e.target.value)}
              className="w-100"
            >
              <option value="">Choose Income Type</option>
          <option value="Job">Job</option>
          <option value="Loan">Loan</option>
          <option value="Grant">Grant</option>
          <option value="Other">Other (Income)</option>
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
              <option value="">How often does this income occur?</option>
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
                <option value="">Select Month of Income</option>
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
        <Button onClick={handleAddIncome} variant="primary">Add Income</Button>
      </Form>
      <Container className="mt-4 mb-3">
       {Array.from({ length: Math.ceil(incomeList.length / 3) }).map((_, rowIndex) => (
         <Row key={rowIndex} xs={1} sm={2} md={3} className="g-4 justify-content-center mb-3">
           {incomeList
             .slice(rowIndex * 3, rowIndex * 3 + 3)
             .map((income, index) => (
               <Col key={index}> 
                 <Card className="h-100" border="dark">
                   <Card.Body className="d-flex flex-column justify-content-between">
                     <Card.Title>{income.incomeType}</Card.Title>
                     <Card.Text>
                       <strong>Amount:</strong> ${income.amount}<br />
                       <strong>Frequency:</strong> {income.frequency}<br />
                       {income.month && <><strong>Month:</strong> {income.month}</>}
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

export default IncomeForm;
