Cypress.Commands.add('login', (email, password) => {
  cy.get('#normal_login_username').type(email);
  cy.get('#normal_login_password').type(password);
  cy.get('.ant-btn').click();
});

Cypress.Commands.add('tableData', (item, index) => {
  cy.get(`table tr:nth-child(${index + 1}) td:nth-child(1)`).should(
    'contain',
    item.name

  );
  cy.get(`table tr:nth-child(${index + 1}) td:nth-child(2)`).should(
    'contain',
    item.borrow
    
  );
  cy.get(`table tr:nth-child(${index + 1}) td:nth-child(3)`).should(
    'contain',
    item.repayment
  );
});

Cypress.Commands.add('responsive', (elementSelector) => {
  cy.get(elementSelector).then(($el) => {
    if ($el.length > 0 && (cy.wrap($el).should('be.visible'))) {
      return;
    } else {
      cy.scrollTo('bottom');
      cy.get(elementSelector).scrollIntoView();
    }
  });
});

Cypress.Commands.add('checkInputMaxLength', (inputSelector, inputValue, expectedValue) => {
  const expectedValueSlice = inputValue.slice(0, expectedValue);
  cy.get(inputSelector).type(inputValue);
  cy.get(inputSelector).should('have.value', expectedValueSlice);
});