/// <reference types='Cypress' />

import user from '../fixtures/user.json';
import message from '../fixtures/message.json';

const invalidFieldCredentials = [
  'c',
  user.specialCharacters,
  '          ',
  '   a   b  c  ',
  user.largeInput,
];

describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('/#/sign_in?last_page=/');
  });

  describe('Validate Username Field', () => {
    invalidFieldCredentials.forEach((username) => {
      it(`should display error message for invalid username '${username}'`, () => {
        cy.login(username, user.password);
        cy.get('.ant-form-explain')
          .should('exist')
          .and('contain', message.incorrectUsername);
      });
    });

    it('check larger than 40 character in usernames field', () => {
      cy.login(user.largeInput, user.password);
      cy.get('#normal_login_username').should(
        'have.value',
        user.largeInput.slice(0, 40)
      );
    });

    it('check a valid entry in username field', () => {
      cy.login(user.incorrectUsername, user.password);
      cy.get('.ant-form-explain').should('not.exist');
    });
  });

  describe('Validate Password Field', () => {
    invalidFieldCredentials.forEach((password) => {
      it(`should display error message for invalid password '${password}'`, () => {
        cy.login(user.username, password);
        cy.get('.ant-form-explain')
          .should('exist')
          .and('contain', message.invalidPassword);
      });
    });

    it('check larger than 20 character in password field', () => {
      cy.login(user.user, user.largeInput);
      cy.get('#normal_login_password').should(
        'have.value',
        user.largeInput.slice(0, 20)
      );
    });

    it('check a valid entry in password field', () => {
      cy.login(user.username, user.incorrectPassword);
      cy.get('.ant-form-explain').should('not.exist');
    });
  });

  describe('Login Page Credentials Tests', () => {
    const invalidLoginCredentials = [
      [
        user.incorrectUsername,
        user.incorrectPassword,
        message.incorrectCredentials,
      ],
      [user.incorrectUsername, user.password, message.invalidUsername],
      [user.username, user.incorrectPassword, message.invalidPassword],
      [user.username, user.invalidPassword, message.invalidPassword],
      [user.invalidUsername, user.password, message.invalidUsername],
    ];

    it('should display login form', () => {
      cy.get('form').should('exist');
      cy.get('#normal_login_username').should('exist');
      cy.get('#normal_login_password').should('exist');
      cy.get('.ant-btn').should('exist');
    });

    it('should display error message for empty username and password', () => {
      cy.get('.ant-btn').click();
      cy.get('.ant-form-explain')
        .should('exist')
        .and('contain', message.inputUsername)
        .and('contain', message.inputPassword);
    });

    it('should display error message for invalid login credentials', () => {
      cy.login(user.invalidUsername, user.invalidPassword);
      cy.get('.ant-form-explain')
        .should('exist')
        .and('contain', message.invalidUsername)
        .and('contain', message.invalidPassword);
    });
    invalidLoginCredentials.forEach(([username, password, errorMessage]) => {
      it(`should display error message for invalid credentials - username: '${username}', password: '${password}'`, () => {
        cy.login(username, password);
        cy.get('.ant-form-explain')
          .should('exist')
          .and('contain', errorMessage);
      });
    });

    it('should navigate to dashboard on successful login', () => {
      cy.login(user.username, user.password);
      cy.url().should('include', '#/');
      cy.get('[data-cy="appTitle"] > a').should('exist');
    });
  });

  const dimensions = require('../support/dimensions.js');

  describe('Web Responsiveness Tests', () => {
    Object.values(dimensions).forEach((key, i) => {
      it(`Scrolling pages on ${key.viewportWidth} x ${key.viewportHeight}`, () => {
        cy.viewport(key.viewportWidth, key.viewportHeight);
        cy.visit('/#/sign_in?last_page=/');
        cy.responsive('.ant-btn');
      });
    });
  });
});
