/// <reference types='Cypress' />

import user from '../fixtures/user.json';
import placeholder from '../fixtures/placeholder.json';
import * as formatDate from '../support/helpers.js';

describe('Validade Form Itens', () => {
  beforeEach(() => {
    cy.session([user.username, user.password], () => {});
    cy.visit('/#/page2');
  });

  describe('Validate Radio Button', () => {
    it('should navigate between Radio Buttons', () => {
      cy.get('.ant-radio-button-input')
        .eq(0)
        .should('have.attr', 'value', 'horizontal')
        .and('be.checked');
      cy.get('.ant-form').should('have.class', 'ant-form-horizontal');

      cy.get('.ant-radio-button-input')
        .eq(1)
        .should('have.attr', 'value', 'vertical')
        .and('not.be.checked');
      cy.get('.ant-radio-button-wrapper').eq(1).click();
      cy.get('.ant-radio-button-input').eq(1).should('be.checked');
      cy.get('.ant-form').should('have.class', 'ant-form-vertical');

      cy.get('.ant-radio-button-input')
        .eq(2)
        .should('have.attr', 'value', 'inline')
        .and('not.be.checked');
      cy.get('.ant-radio-button-wrapper').eq(2).click();
      cy.get('.ant-radio-button-input').eq(2).should('be.checked');
      cy.get('.ant-form').should('have.class', 'ant-form-inline');
    });
  });

  describe('Validate Input Field', () => {
    const inputParams = ['test123', user.specialCharacters, '          '];

    inputParams.forEach((input) => {
      it(`should validate the '${input}' input`, () => {
        cy.get('.ant-input-affix-wrapper > .ant-input')
          .should('have.attr', 'placeholder', placeholder.input)
          .type(input);

        cy.get('.ant-input-affix-wrapper > .ant-input')
          .invoke('val')
          .should('match', /^[a-zA-Z0-9]+$/);

        cy.get('.ant-input-clear-icon').should('be.visible').click();
        cy.get('.ant-input-affix-wrapper > .ant-input').should('be.empty');
      });
    });

    it('check larger than 80 character in Input field', () => {
      cy.checkInputMaxLength(
        '.ant-input-affix-wrapper > .ant-input',
        user.largeInput,
        80
      );
    });
  });

  describe('Validate Select Field', () => {
    it('should validate the Select input', () => {
      cy.get('div.ant-select-selection__placeholder')
        .should('contain', placeholder.select)
        .type('Brazil');

      cy.get('.ant-select-dropdown-menu-item').should('have.length', 1);
      cy.get('.ant-select-dropdown-menu-item')
        .should('contain', 'Brazil')
        .click();
      cy.get('div.ant-select-selection__rendered').should('contain', 'Brazil');

      cy.get('.ant-select-arrow-icon').should('be.visible');
      cy.get('.ant-select-clear-icon').trigger('mouseover').click();
      cy.get('.ant-input-affix-wrapper > .ant-input').should('be.empty');
    });

    it('should validate the invalid data in Select input', () => {
      cy.get('div.ant-select-selection__placeholder')
        .should('contain', placeholder.select)
        .type('aaaa');

      cy.get('.ant-select-dropdown-menu-item').should('have.length', 1);
      cy.get('.ant-empty-description').should('contain', 'No Data');
      cy.get('.ant-radio-button-wrapper-checked').click();
      cy.get('div.ant-select-selection__rendered').should(
        'contain',
        placeholder.select
      );
    });

    it('check larger than 80 character in Select field', () => {
      cy.checkInputMaxLength(
        'div.ant-select-selection__placeholder',
        user.largeInput,
        80
      );
    });
  });

  describe('Validate TreeSelect Field', () => {
    it('should validate the TreeSelect input selecting a parent input', () => {
      cy.get('.ant-select-selection').eq(1).click();

      cy.get('.ant-select-dropdown').should('have.length', 1);
      cy.get('.ant-select-dropdown').should('contain', 'Color').click();

      cy.get('.ant-select-selection')
        .eq(1)
        .should('contain', 'Color Red-Green-Blue');
    });

    it('should validate the TreeSelect input selecting a child input', () => {
      cy.get('.ant-select-selection').eq(1).click();

      cy.get('.ant-select-tree-switcher').click();
      cy.get('.ant-select-tree-switcher').should('have.length', 4);
      cy.get('.ant-select-tree-title').eq(1).should('contain', 'Red').click();

      cy.get('.ant-select-selection').eq(1).should('contain', 'Red');

      cy.get('.ant-select-arrow-icon').eq(1).should('be.visible');
      cy.get('.ant-select-clear-icon').trigger('mouseover').click();
      cy.get('.ant-input-affix-wrapper > .ant-input').should('be.empty');
    });
  });

  describe('Validate Cascader Field', () => {
    it('should validate the Cascader input', () => {
      cy.get('.ant-cascader-input.ant-input')
        .should('have.attr', 'placeholder', placeholder.cascader)
        .click();

      cy.get('.ant-cascader-menu-item').should('have.length', 1);
      cy.get('.ant-cascader-menu-item').should('contain', 'São Paulo').click();
      cy.get('[title="Campinas"]').click();
      cy.get('.ant-cascader-picker-label').should(
        'contain',
        'São Paulo / Campinas'
      );

      cy.get('.anticon-close-circle').trigger('mouseover').click();
      cy.get('.ant-input-affix-wrapper > .ant-input').should('be.empty');
    });
  });

  describe('Validate DatePicker', () => {
    const currentDate = new Date();
    const today = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
    const currentDateFormatted =
      formatDate.formatDateToCustomString(currentDate);

    it('Should validate the datepicker input', () => {
      cy.get('.ant-calendar-picker-input')
        .should('have.attr', 'placeholder', placeholder.datepicker)
        .click();

      cy.get(`[title='${currentDateFormatted}'] > .ant-calendar-date`).click();
      cy.get('.ant-calendar-picker-input').should('have.value', today);
    });

    it('Should use the Today button', () => {
      cy.get('.ant-calendar-picker-input').click();
      cy.get('.ant-calendar-today-btn').click();
      cy.get('.ant-calendar-picker-input').should('have.value', today);
    });

    it('Should use the Text Input', () => {
      cy.get('.ant-calendar-picker-input').click();
      cy.get('.ant-calendar-input').type(today)
      .type('{enter}');
      cy.get('.ant-calendar-picker-input').should('have.value', today);
    });
  });

  describe('Validate Slider with InputNumber', () => {
    const invalidValues = [
      [999, 20],
      ['↶ ↷ ↸asct ukl', 1],
    ];

    it('should update InputNumber value when Slider is changed', () => {
      cy.get('.ant-slider-handle').trigger('mousedown', { button: 0 });
      cy.get('.ant-slider-step').trigger('mousemove', 275, 0);
      cy.get('.ant-slider-handle').trigger('mouseup', { force: true });

      cy.get('.ant-input-number-input').should('have.value', '10');
    });

    it('should update Slider value when InputNumber is changed', () => {
      cy.get('.ant-input-number-input')
        .should('have.value', placeholder.inputNumber)
        .clear()
        .type('10');

      cy.get('.ant-slider-handle').should('have.attr', 'aria-valuenow', '10');
    });

    it('should update Slider value and InputNumber by arrow button', () => {
      cy.get('.ant-input-number-handler-up').click().click();
      cy.get('.ant-input-number-input').should('have.value', '3');
      cy.get('.ant-input-number-handler-down').click();
      cy.get('.ant-input-number-input').should('have.value', '2');

      cy.get('.ant-slider-handle').should('have.attr', 'aria-valuenow', '2');
    });

    invalidValues.forEach(([value, text]) => {
      it(`should update value to '${text}' when InputNumber is '${value}'`, () => {
        cy.get('.ant-input-number-input').clear().type(value);
        cy.get('.ant-slider-handle').should('have.attr', 'aria-valuenow', text);
        cy.get('.ant-input-number-input').trigger('blur');
        cy.get('.ant-input-number-input').should('have.value', text);
      });
    });
  });

  describe('Validate Switch Button', () => {
    const switchButton = '.ant-switch';

    it('should validate the Switch Button', () => {
      cy.get(switchButton)
        .should('not.be.checked')
        .and('have.attr', 'aria-checked', 'false')
        .and('be.enabled');

      cy.get(switchButton).click();

      cy.get(switchButton)
        .should('be.checked')
        .and('have.attr', 'aria-checked', 'true')
        .and('be.enabled');

      cy.get(switchButton).click();

      cy.get(switchButton).should('not.be.checked');
    });
  });

  describe('Validate TextArea Field', () => {
    it('should validate TextArea Field', () => {
      cy.get('.ant-form-item-children > .ant-input')
        .should('have.attr', 'placeholder', placeholder.textArea)
        .type(user.largeInput)
        .should('have.value', user.largeInput);
    });

    it('Should not resize TextArea Field', () => {
      cy.get('.ant-form-item-children > .ant-input').should(
        'not.have.a.property',
        'resize'
      );
    });
  });

  const dimensions = require('../support/dimensions.js');

  describe('Web Responsiveness Tests', () => {
    Object.values(dimensions).forEach((key, i) => {
      it(`Scrolling pages on ${key.viewportWidth} x ${key.viewportHeight}`, () => {
        cy.viewport(key.viewportWidth, key.viewportHeight);
        cy.visit('/#/page2');
        cy.scrollTo('bottom');
        cy.responsive('.ant-form-item-children > .ant-input');
      });
    });
  });
});
