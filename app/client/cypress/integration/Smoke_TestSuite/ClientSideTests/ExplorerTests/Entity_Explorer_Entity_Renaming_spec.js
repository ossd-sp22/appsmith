const explorer = require("../../../../locators/explorerlocators.json");
const firstApiName = "First";
const secondApiName = "Second";
const {
  AggregateHelper,
} = require("../../../../support/Pages/AggregateHelper");

const helper = new AggregateHelper();

describe("Api Naming conflict on a page test", function() {
  it("expects actions on the same page cannot have identical names", function() {
    cy.log("Login Successful");
    // create an API
    cy.NavigateToAPI_Panel();
    cy.CreateAPI(firstApiName);

    // create another API
    cy.NavigateToAPI_Panel();
    cy.CreateAPI(secondApiName);

    // try to rename one of the APIs with an existing API name
    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Edit Name");
    //cy.RenameEntity(tabname);
    cy.get(explorer.editEntity)
      .last()
      .type(firstApiName, { force: true });
    //cy.RenameEntity(firstApiName);
    cy.validateMessage(firstApiName);
    cy.ClearSearch();
    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
  });
});

describe("Api Naming conflict on different pages test", function() {
  it("it expects actions on different pages can have identical names", function() {
    cy.log("Login Successful");
    // create a new API
    cy.CreateAPI(firstApiName);
    helper.expandCollapseEntity("QUERIES/JS", true);
    // create a new page and an API on that page
    cy.Createpage("Page2");
    cy.CreateAPI(firstApiName);
    helper.expandCollapseEntity("QUERIES/JS", true);
    cy.get(".t--entity-name")
      .contains(firstApiName)
      .should("exist");
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
    cy.get(`.t--entity-item:contains(Page2)`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
  });
});

describe("Entity Naming conflict test", function() {
  it("expects JS objects and actions to not have identical names on the same page.", function() {
    cy.log("Login Successful");
    helper.expandCollapseEntity("QUERIES/JS", true);
    // create JS object and name it
    cy.createJSObject('return "Hello World";');

    cy.get(`.t--entity-item:contains('JSObject1')`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Edit Name");
    cy.get(explorer.editEntity)
      .last()
      .type(firstApiName, { force: true });

    cy.CreateAPI(secondApiName);

    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Edit Name");

    cy.get(explorer.editEntity)
      .last()
      .type(firstApiName, { force: true });
    cy.VerifyPopOverMessage(firstApiName + " is already being used.", true);
    cy.get("body").click(0, 0);
    cy.wait(2000);
    cy.get(`.t--entity-item:contains(${firstApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
    cy.get(`.t--entity-item:contains(${secondApiName})`).within(() => {
      cy.get(".t--context-menu").click({ force: true });
    });
    cy.selectAction("Delete");
  });
});
