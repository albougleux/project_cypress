/// <reference types='Cypress' />

import user from '../fixtures/user.json';

describe('Validate Table Components', () => {
  beforeEach(() => {
    cy.session([user.username, user.password], () => {});
    cy.visit('/#/page1');
  });

  it('should validate the table data with response result', () => {
    const verifyTableData = (items) => {
      items.forEach((item, index) => {
        cy.tableData(item, index);
      });
    };

    cy.request('GET', 'http://localhost:4000/page1').then((response) => {
      const apiData = response.body;
      const totalPages = Math.ceil(apiData.length / 10);

      cy.wrap(apiData).as('allData');

      cy.get('table th:nth-child(1)').should('contain', 'Name');
      cy.get('table th:nth-child(2)').should('contain', 'Borrow');
      cy.get('table th:nth-child(3)').should('contain', 'Repayment');
      cy.get('.ant-table-thead > tr > th .ant-table-column-sorter-down').should(
        'have.css',
        'color',
        'rgb(191, 191, 191)'
      );
      cy.get('.ant-table-thead > tr > th .ant-table-column-sorter-up').should(
        'have.css',
        'color',
        'rgb(191, 191, 191)'
      );

      const verifyTableDataForPage = (pageIndex) => {
        if (pageIndex <= totalPages) {
          cy.get('@allData').then((allData) => {
            const items = allData.slice((pageIndex - 1) * 10, pageIndex * 10);
            verifyTableData(items);

            const rows = items.length;
            cy.log('rows: ' + rows);
            expect(rows).to.be.lessThan(11);

            if (pageIndex < totalPages) {
              cy.get('.ant-pagination-item-' + (pageIndex + 1))
                .click()
                .then(() => {
                  cy.get('.ant-table-pagination')
                    .should('be.visible')
                    .then(() => {
                      verifyTableDataForPage(pageIndex + 1);
                    });
                });
            } else {
              cy.log('Chegou na última página');
            }
          });
        }
      };
      verifyTableDataForPage(1);
    });
  });

  it('should validate the table in decrescent alfabetic order', () => {
    const verifyTableData = (items) => {
      items.forEach((item, index) => {
        cy.tableData(item, index);
      });
    };

    cy.request('GET', 'http://localhost:4000/page1').then((response) => {
      cy.get('.ant-table-column-sorter').click();
      const apiData = response.body;
      const sortedData = apiData.sort((a, b) => b.name.localeCompare(a.name));
      const totalPages = Math.ceil(sortedData.length / 10);

      cy.wrap(sortedData).as('allData');
      cy.get('.ant-table-thead > tr > th .ant-table-column-sorter-down').should(
        'have.css',
        'color',
        'rgb(24, 144, 255)'
      );
      cy.get('.ant-table-thead > tr > th .ant-table-column-sorter-up').should(
        'have.css',
        'color',
        'rgb(191, 191, 191)'
      );

      const verifyTableDataForPage = (pageIndex) => {
        if (pageIndex <= totalPages) {
          cy.get('@allData').then((allData) => {
            const items = allData.slice((pageIndex - 1) * 10, pageIndex * 10);
            verifyTableData(items);

            if (pageIndex < totalPages) {
              cy.get('.ant-pagination-item-' + (pageIndex + 1))
                .click()
                .then(() => {
                  cy.get('.ant-table-pagination')
                    .should('be.visible')
                    .then(() => {
                      verifyTableDataForPage(pageIndex + 1);
                    });
                });
            } else {
              cy.log('Chegou na última página');
            }
          });
        }
      };
      verifyTableDataForPage(1);
    });
  });

  it('should validate the table in decrescent alfabetic order', () => {
    const verifyTableData = (items) => {
      items.forEach((item, index) => {
        cy.tableData(item, index);
      });
    };

    cy.request('GET', 'http://localhost:4000/page1').then((response) => {
      cy.get('.ant-table-column-sorter').click().click();
      const apiData = response.body;
      const sortedData = apiData.sort((a, b) => a.name.localeCompare(b.name));
      const totalPages = Math.ceil(sortedData.length / 10);

      cy.wrap(sortedData).as('allData');
      cy.get('.ant-table-thead > tr > th .ant-table-column-sorter-down').should(
        'have.css',
        'color',
        'rgb(191, 191, 191)'
      );
      cy.get('.ant-table-thead > tr > th .ant-table-column-sorter-up').should(
        'have.css',
        'color',
        'rgb(24, 144, 255)'
      );

      const verifyTableDataForPage = (pageIndex) => {
        if (pageIndex <= totalPages) {
          cy.get('@allData').then((allData) => {
            const items = allData.slice((pageIndex - 1) * 10, pageIndex * 10);
            verifyTableData(items);

            if (pageIndex < totalPages) {
              cy.get('.ant-pagination-item-' + (pageIndex + 1))
                .click()
                .then(() => {
                  cy.get('.ant-table-pagination')
                    .should('be.visible')
                    .then(() => {
                      verifyTableDataForPage(pageIndex + 1);
                    });
                });
            } else {
              cy.log('Chegou na última página');
            }
          });
        }
      };
      verifyTableDataForPage(1);
    });
  });

  describe('Navigation Bar Tests', () => {
    const navigationItens = [
      ['.ant-pagination-item-1', '.ant-pagination-prev'],
      ['.ant-pagination-item-2', '.ant-pagination-next'],
    ];

    navigationItens.forEach((button, arrow) => {
      // It should get an error because the button element is not visible in the DOM.
      // Probably an issue with responsive design.
      // When in viewport, the button is working properly.
      it(`Check if the '${button}' button is working properly`, () => {
        cy.get(button)
          .click()
          .should('have.class', 'ant-pagination-item-active');
        cy.get(arrow).should('not.be.enabled');
      });
    });

    it('Check if the arrow navigation button is working properly', () => {
      cy.get('.ant-pagination-prev').should('not.be.enabled');
      cy.get('.ant-pagination-next').click().should('not.be.enabled');
      cy.get('.ant-pagination-item-2').should(
        'have.class',
        'ant-pagination-item-active'
      );
      cy.get('.ant-pagination-prev').click().should('not.be.enabled');
      cy.get('.ant-pagination-item-1').should(
        'have.class',
        'ant-pagination-item-active'
      );
    });
  });

  const dimensions = require('../support/dimensions.js');

  describe('Web Responsiveness Tests', () => {
    Object.values(dimensions).forEach((key, i) => {
      it(`Scrolling pages on ${key.viewportWidth} x ${key.viewportHeight}`, () => {
        cy.viewport(key.viewportWidth, key.viewportHeight);
        cy.responsive('.ant-pagination-item-1');
      });
    });
  });
});
