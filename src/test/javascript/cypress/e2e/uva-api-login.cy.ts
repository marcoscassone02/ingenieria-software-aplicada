import {
  entityCreateSaveButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../support/entity';

describe('Uva API Login E2E Test', () => {
  const uvaPageUrl = '/uva';
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';

  // Datos reales de Cabernet Sauvignon
  const cabernetSauvignonData = {
    ph: 3.2,
    acidez: 6.5,
    brix: 22.0,
    variedad: 'Cabernet Sauvignon',
    viniedo: 'Viña del Mar',
    cantidad: 1000,
  };

  let uva;

  beforeEach(() => {
    // LOGIN USANDO API (más rápido y confiable)
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/uvas+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/uvas').as('postEntityRequest');
    cy.intercept('DELETE', '/api/uvas/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (uva) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/uvas/${uva.id}`,
      }).then(() => {
        uva = undefined;
      });
    }
  });

  it('should create, view, edit and delete Cabernet Sauvignon using API login', () => {
    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // Crear nueva uva usando API
    cy.authenticatedRequest({
      method: 'POST',
      url: '/api/uvas',
      body: cabernetSauvignonData,
    }).then(({ body }) => {
      uva = body;

      // Verificar que aparece en la lista
      cy.visit(uvaPageUrl);
      cy.wait('@entitiesRequest');
      cy.get(entityTableSelector).should('contain', cabernetSauvignonData.variedad);
      cy.get(entityTableSelector).should('contain', cabernetSauvignonData.viniedo);

      // Ver detalles usando el selector correcto
      cy.get(entityDetailsButtonSelector).first().click();
      cy.getEntityDetailsHeading('uva').should('exist');

      // Volver a la lista
      cy.get('[data-cy="entityDetailsBackButton"]').click();
      cy.wait('@entitiesRequest');

      // Editar
      cy.get(entityEditButtonSelector).first().click();
      cy.getEntityCreateUpdateHeading('Uva').should('exist');
      cy.get('#field_cantidad').clear().type('1500');
      cy.get('#field_viniedo').clear().type('Viña Premium');
      cy.get(entityCreateSaveButtonSelector).click();

      // Verificar cambios
      cy.wait('@entitiesRequest');
      cy.get(entityTableSelector).should('contain', 'Viña Premium');
      cy.get(entityTableSelector).should('contain', '1500');
    });
  });

  it('should verify API authentication is working', () => {
    // Verificar que estamos autenticados usando authenticatedRequest
    cy.authenticatedRequest({
      method: 'GET',
      url: '/api/account',
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('login');
    });

    // Verificar que podemos acceder a la API de uvas
    cy.authenticatedRequest({
      method: 'GET',
      url: '/api/uvas',
    }).then(response => {
      expect(response.status).to.eq(200);
      // La API devuelve un array directamente, no un objeto con 'content'
      expect(response.body).to.be.an('array');
    });
  });
});
