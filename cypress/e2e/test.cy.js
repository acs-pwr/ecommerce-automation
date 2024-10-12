import { VALID_PRODUCT } from "../data/test.data";
import { INVALID_PRODUCT } from "../data/test.data";
import { BASE_URL } from "../const/routes";

function searchProduct(product) {
  // 1. Access web mataharimall
  cy.visit(BASE_URL.baseUrl);
  // handling uncaught
  Cypress.on('uncaught:exception', (err, runnable) => {
      return false; 
  });
  // 2. Search produk
  cy.get('#search').first().type(product).type('{enter}');
}

describe("Checkout Valid Product", () => {
  // scenario 1
  it("should successfully retrieve login modal with valid product", () => {
    // 1. Search produk
    searchProduct(VALID_PRODUCT[0]);
    // 2. Wait and click first produk
    cy.get('[data-position="1"][data-available="1"] > .product-item-info > .details').first().click();
    // 3. click first produk
    cy.get('#option-label-size-558-item-16842').first().click();
    // 4. click tambah ukuran
    cy.get('#product-addtocart-button').first().click();
    cy.wait(6000);
    // 5. validate number of product in cart
    cy.get('.counter-number')
      .invoke('text') // Get the text content of the element
      .then((text) => {
        const count = parseInt(text.trim(), 10); // Convert to an integer
        expect(count).to.equal(1); // Assert the expected value
        if (count === 1){
          // 6. click cart
          cy.get('.showcart').first().click();
          cy.wait(5000);
        }
      }); 
    // 7. click belanja sekarang
    cy.wait(5000); 
    cy.contains('button', 'Belanja Sekarang').first().click();
    // 8. assert login modal
    cy.get('.gust-checkout__account').should('be.visible');
  });
  // scenario 2
  it("should successfully retrieve product modal and login modal with valid product", () => {
    // 1. Search produk
    searchProduct(VALID_PRODUCT[0]);
    // 3. Click button beli
    cy.wait(5000);
    cy.contains('button', 'BELI').first().click();
    //4. Choose size  
    cy.get('.cart-popup-swatch-attribute-options > #option-label-size-558-item-16533').first().click();
    cy.wait(5000);
    //5. Click button tambah ke keranjang
    cy.get('#product-addtocart-button').first().click();
    cy.wait(5000);
    //6. Click button Pembayaran
    cy.get('#top-cart-btn-checkout').click();
    cy.wait(5000);
    //7. Assert login modal
    cy.get('.gust-checkout__account').should('be.visible');
    });
  
});

describe("Checkout Invalid Product", () => {
  // scenario 3
  it("should successfully retrieve notice with invalid product", () => {
    // 1. Search produk
    searchProduct(INVALID_PRODUCT[0]);
    // 2. assert notice
    cy.get('.message.notice.mb-hidden div').should('be.visible');
    cy.get('.message.notice.mb-hidden div').invoke('text').then((text) => {
      expect(text.trim()).to.equal('Pencarian Anda tidak menghasilkan apa-apa.');
    });

  });
});
