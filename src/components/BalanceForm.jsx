import React, { useState } from 'react';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';

const BalanceForm = ({ setBalance, isValidValue }) => {
  const [money, setMoney] = useState('');
  const [displayedBalance, setDisplayedBalance] = useState(null);

  const handleInputChange = (e) => {
    setMoney(e.target.value);
  };

  const submitMoney = (e) => {
    e.preventDefault();
    if (!money || !isValidValue(money)) {
      window.alert("Please enter a valid balance amount");
      return;
    }
    setBalance(money);
    setDisplayedBalance(money);
  };

  
  return (
    <Form onSubmit={submitMoney} className="my-4 d-flex flex-column align-items-center">
      <h3 className="mb-4">Current Balance In Account</h3>
      <Col>
        {displayedBalance !== null && <Alert variant="success" id="moneyDisplay">Balance: ${displayedBalance}</Alert>}
      </Col>
      <Row className="my-3 align-items-center">
        <Col>
          <Form.Control
            type="text"
            id="moneyInput"
            placeholder="Enter balance here"
            value={money}
            onChange={handleInputChange}
          />
        </Col>
        <Col xs={4} className="d-grid">
          <Button type="submit" variant="primary">Submit</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BalanceForm;
