/// <reference types="Cypress" />

import user from "../fixtures/user.json";

describe("Validate Table Components", () => {
  beforeEach(() => {
    cy.session([user.username, user.password], () => {});
    cy.visit("/#/page1");
});

it("should validate the table data with response result", () => {
    const verifyTableData = (items) => {
      items.forEach((item, index) => {
        cy.tableData(item, index);
      });
    };
  
    cy.request("GET", "http://localhost:4000/page1").then(response => {
      const apiData = response.body;
      const totalPages = Math.ceil(apiData.length / 10);
  
      cy.wrap(apiData).as("allData");
  
      cy.get("table th:nth-child(1)").should("contain", "Name");
      cy.get("table th:nth-child(2)").should("contain", "Borrow");
      cy.get("table th:nth-child(3)").should("contain", "Repayment");
  
      const verifyTableDataForPage = (pageIndex) => {
        if (pageIndex <= totalPages) {
          cy.get(".ant-pagination-item-" + pageIndex + " > a").click();
          cy.get("@allData").then(allData => {
            const items = allData.slice((pageIndex - 1) * 10, pageIndex * 10);
            verifyTableData(items);
            verifyTableDataForPage(pageIndex + 1);
          });
        }
      };
      verifyTableDataForPage(2);
    });
  });
  });
