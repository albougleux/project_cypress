/// <reference types='Cypress' />

import user from '../fixtures/user.json';
import message from '../fixtures/message.json';

describe('Page 3 Tests', () => {
  beforeEach(() => {
    cy.session([user.username, user.password], () => {});
    cy.visit('/#/page3');
  });

  describe('Validate Header and Breadcrumb elements', () => {

    const headerElements = [
      ['[data-cy="appTitle"] > a', 'Test Automation', 'http://localhost:3000/#/'],
      ['[href="#/page1"] > span', 'Page 1', 'http://localhost:3000/#/page1'],
      ['[href="#/page2"] > span', 'Page 2', 'http://localhost:3000/#/page2'],
      ['[href="#/page3"] > span', 'Page 3', 'http://localhost:3000/#/page3'],
      [':nth-child(1) > .ant-breadcrumb-link > a', 'HOME', 'http://localhost:3000/#/'],
      [':nth-child(2) > .ant-breadcrumb-link > a', 'Page 1', 'http://localhost:3000/#/page1'],
      [':nth-child(3) > .ant-breadcrumb-link > a', 'Page 2', 'http://localhost:3000/#/page2'],
      [':nth-child(4) > .ant-breadcrumb-link > a', 'Page 3', 'http://localhost:3000/#/page3'],
    ];

    headerElements.forEach(([element, text, urlRedirect]) => {
      it(`should validate the '${text}' element`, () => {
        cy.get(element).should('contain', text).click();
        cy.url().should('be.eql', urlRedirect);
      });
    });
  });

  
  describe('Validate Footer elements', () => {
    
    const footerElements = [
      ['.Footer_Footer__j6byp > div > a', 'Venturus', 'https://venturus.org.br/'],
      ['[data-cy="mailInfo"]', 'Support', 'mailto:eloi.taniguti@venturus.org.br']
    ];
    
    footerElements.forEach(([element, text, urlRedirect]) => {
      it(`should validate the '${text}' element`, () => {
        cy.get(element).should('contain', text)
        .and('have.attr','href', urlRedirect);
      });
    });
    
    it(`should validate the Rights footer text`, () => {
      cy.get('[data-cy="footerMsg"]').should('have.text', message.footerRights);
    });
  });
  
  describe('Validate Profile elements', () => {

    const profileElements = [
      ['[data-cy="userAvatar"]', '.ant-dropdown-menu > :nth-child(2)' , 'Preferences', 'http://localhost:3000/#/preferences'],
      ['[data-cy="userAvatar"]', '.ant-dropdown-menu > :nth-child(3)' , 'Help', 'http://localhost:3000/#/help'],
      ['[data-cy="userAvatar"]', '.ant-dropdown-menu > :nth-child(4)' , 'Logout', '/#/sign_in?last_page=/'],
    ];

    profileElements.forEach(([element, profileElement, text, urlRedirect]) => {
      it(`should validate the '${text}' element`, () => {
        cy.get(element).click();
        cy.get(profileElement).should('contain', text).click();
        cy.url().should('be.eql', urlRedirect);
      });
    });
  });
  
  const dimensions = require('../support/dimensions.js');

  describe('Web Responsiveness Tests', () => {
    Object.values(dimensions).forEach((key, i) => {
      it(`Scrolling pages on ${key.viewportWidth} x ${key.viewportHeight}`, () => {
        cy.viewport(key.viewportWidth, key.viewportHeight);
        cy.responsive('[data-cy="footerMsg"]');
      });
    });
  });
});
