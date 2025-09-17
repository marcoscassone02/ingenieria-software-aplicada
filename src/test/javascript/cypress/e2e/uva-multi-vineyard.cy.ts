import { entityCreateSaveButtonSelector, entityTableSelector } from '../support/entity';

describe('Uva Multi-Vineyard Management E2E Test', () => {
  const uvaPageUrl = '/uva';
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';

  // Datos de múltiples viñedos y variedades
  const vineyardData = [
    {
      ph: 3.2,
      acidez: 6.5,
      brix: 22.0,
      variedad: 'Cabernet Sauvignon',
      viniedo: 'Viña del Mar',
      cantidad: 1000,
    },
    {
      ph: 3.5,
      acidez: 7.0,
      brix: 24.0,
      variedad: 'Merlot',
      viniedo: 'Viña Central',
      cantidad: 800,
    },
    {
      ph: 3.3,
      acidez: 6.8,
      brix: 23.5,
      variedad: 'Chardonnay',
      viniedo: 'Viña Norte',
      cantidad: 1200,
    },
  ];

  let uvas = [];

  beforeEach(() => {
    // LOGIN NORMAL POR UI
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/uvas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/uvas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/uvas/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    // Limpiar todas las uvas creadas
    uvas.forEach(uva => {
      if (uva) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `/api/uvas/${uva.id}`,
        });
      }
    });
    uvas = [];
  });

  it('should create multiple vineyards with different grape varieties', () => {
    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    vineyardData.forEach((data, index) => {
      cy.get('#field_ph').type(data.ph.toString());
      cy.get('#field_acidez').type(data.acidez.toString());
      cy.get('#field_brix').type(data.brix.toString());
      cy.get('#field_variedad').type(data.variedad);
      cy.get('#field_viniedo').type(data.viniedo);
      cy.get('#field_cantidad').type(data.cantidad.toString());
      cy.get(entityCreateSaveButtonSelector).click();

      // Guardar referencia para limpieza
      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        uvas.push(response?.body);
      });

      // Verificar que aparece en la lista
      cy.get(entityTableSelector).should('contain', data.variedad);
      cy.get(entityTableSelector).should('contain', data.viniedo);
    });
  });

  it('should display all created vineyards in the table', () => {
    // Crear uvas usando API para el test
    vineyardData.forEach(data => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/api/uvas',
        body: data,
      }).then(({ body }) => {
        uvas.push(body);
      });
    });

    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // Verificar que todas las variedades aparecen
    cy.get(entityTableSelector).should('contain', 'Cabernet Sauvignon');
    cy.get(entityTableSelector).should('contain', 'Merlot');
    cy.get(entityTableSelector).should('contain', 'Chardonnay');
  });

  it('should manage vineyard inventory efficiently', () => {
    // Crear uvas usando API
    vineyardData.forEach(data => {
      cy.authenticatedRequest({
        method: 'POST',
        url: '/api/uvas',
        body: data,
      }).then(({ body }) => {
        uvas.push(body);
      });
    });

    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // Verificar que tenemos múltiples registros
    cy.get(entityTableSelector).should('contain', 'Cabernet Sauvignon');
    cy.get(entityTableSelector).should('contain', 'Merlot');
    cy.get(entityTableSelector).should('contain', 'Chardonnay');

    // Verificar que podemos ver detalles de cada uno
    cy.get(entityTableSelector).should('have.length.greaterThan', 0);
  });
});
