/// <reference types="Cypress" />

import user from "../fixtures/user.json";
import message from "../fixtures/message.json";

describe("Validate Username Field", () => {
  beforeEach(() => {
    cy.visit("/#/sign_in?last_page=/");
  });

  it("check 1 character in username field", () => {
    cy.login("c", user.password);
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidUsername);
  });

  it("check larger than 40 character in usernames field", () => {
    cy.login(user.largeInput, user.password);
    cy.get("#normal_login_username").should("have.value", user.largeInput.slice(0, 40));
  });

  it("check special characters in username field", () => {
    cy.login(user.specialCharacters, user.password);
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidUsername);
  });

  it("check blank spaces in username field", () => {
    cy.login("          ", user.password);
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidUsername);
  });

  it("check characters separated by blank spaces in username field", () => {
    cy.login("   a   b  c  ", user.password);
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidUsername);
  });

  it("check a valid entry in username field", () => {
    cy.login(user.incorrectUsername, user.password);
    cy.get(".ant-form-explain")
    .should("not.exist")
  });
});

describe("Validate Password Field", () => {
  beforeEach(() => {
    cy.visit("/#/sign_in?last_page=/");
  });

  it("check 1 character in password field", () => {
    cy.login(user.username, "c");
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidPassword);
  });

  it("check larger than 40 character in password field", () => {
    cy.login(user.user, user.largeInput);
    cy.get("#normal_login_password").should("have.value", user.largeInput.slice(0, 20));
  });

  it("check special characters in password field", () => {
    cy.login(user.username, user.specialCharacters);
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidPassword);
  });

  it("check blank spaces in password field", () => {
    cy.login(user.username, "          ");
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidPassword);
  });

  it("check characters separated by blank spaces in password field", () => {
    cy.login(user.username, "   a   b  c  ");
    cy.get(".ant-form-explain")
    .should("exist")
    .and("contain", message.invalidPassword);
  });

  it("check a valid entry in password field", () => {
    cy.login(user.username, user.incorrectPassword);
    cy.get(".ant-form-explain")
    .should("not.exist")
  });
});

describe("Login Page Credentials Tests", () => {
  beforeEach(() => {
    cy.visit("/#/sign_in?last_page=/");
  });

  it("should display login form", () => {
    cy.get("form").should("exist");
    cy.get("#normal_login_username").should("exist");
    cy.get("#normal_login_password").should("exist");
    cy.get(".ant-btn").should("exist");
  });

  it("should display error message for empty username and password", () => {
    cy.get(".ant-btn").click();
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.inputUsername);
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.inputPassword);
  });

  it("should display error message for incorrect login credentials", () => {
    cy.login(user.incorrectUsername, user.incorrectPassword);
    cy.get(".error-message")
      .should("exist")
      .and("contain", message.incorrectCredentials);
  });

  it("should display error message for Enter a incorrect username and correct password", () => {
    cy.login(user.incorrectUsername, user.password);
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.invalidUsername);
  });

  it("should display error message for correct username and incorrect password", () => {
    cy.login(user.username, user.incorrectPassword);
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.invalidPassword);
  });

  it("should display error message for invalid login credentials", () => {
    cy.login(user.invalidUsername, user.invalidPassword);
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.inputUsername);
    cy.get(".ant-form-explain").should("exist").and("contain", message.input);
  });

  it("should display error message for Enter a invalid username and valid password", () => {
    cy.login(user.invalidUsername, user.password);
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.invalidUsername);
  });

  it("should display error message for valid username and invalid password", () => {
    cy.login(user.username, user.invalidPassword);
    cy.get(".ant-form-explain")
      .should("exist")
      .and("contain", message.invalidPassword);
  });

  it("should navigate to dashboard on successful login", () => {
    cy.login(user.username, user.password);
    cy.url().should("include", "#/");
    cy.get('[data-cy="appTitle"] > a').should("exist");
  });
});

const dimensions = require("../support/dimensions.js");

describe("Web Responsivess Tests", () => {
  Object.values(dimensions).map((key, i) => {
    it(`Scrolling pages`, () => {
      cy.viewport(key.viewportWidth, key.viewportHeight);
      cy.visit("/#/sign_in?last_page=/");
      cy.scrollTo("bottom");
      cy.scrollTo("top");
    });
  });
});
