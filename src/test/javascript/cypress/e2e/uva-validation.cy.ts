import { entityCreateSaveButtonSelector, entityTableSelector } from '../support/entity';

describe('Uva Validation E2E Test', () => {
  const uvaPageUrl = '/uva';
  const username = Cypress.env('E2E_USERNAME') ?? 'admin'; // Cambiar a admin para tener permisos
  const password = Cypress.env('E2E_PASSWORD') ?? 'admin';

  let uva;

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
    if (uva) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/uvas/${uva.id}`,
      }).then(() => {
        uva = undefined;
      });
    }
  });

  it('should validate pH range for wine grapes', () => {
    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // ✅ CORREGIDO: Hacer clic en "Crear nueva UVA"
    cy.get('[data-cy="entityCreateButton"]').click();

    // Esperar a que se cargue el formulario
    cy.get('#field_ph').should('be.visible');

    // Test pH válido (3.0-4.0)
    cy.get('#field_ph').type('3.2');
    cy.get('#field_acidez').type('6.5');
    cy.get('#field_brix').type('22.0');
    cy.get('#field_variedad').type('Cabernet Sauvignon');
    cy.get('#field_viniedo').type('Viña Test');
    cy.get('#field_cantidad').type('1000');
    cy.get(entityCreateSaveButtonSelector).click();

    // Verificar que se creó exitosamente
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response?.statusCode).to.equal(201);
      uva = response?.body;
    });

    cy.get(entityTableSelector).should('contain', 'Cabernet Sauvignon');
  });

  it('should validate Brix range for wine grapes', () => {
    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // ✅ CORREGIDO: Hacer clic en "Crear nueva UVA"
    cy.get('[data-cy="entityCreateButton"]').click();

    // Esperar a que se cargue el formulario
    cy.get('#field_ph').should('be.visible');

    // Test Brix válido (18-28)
    cy.get('#field_ph').type('3.2');
    cy.get('#field_acidez').type('6.5');
    cy.get('#field_brix').type('24.5');
    cy.get('#field_variedad').type('Merlot');
    cy.get('#field_viniedo').type('Viña Test');
    cy.get('#field_cantidad').type('800');
    cy.get(entityCreateSaveButtonSelector).click();

    // Verificar que se creó exitosamente
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response?.statusCode).to.equal(201);
      uva = response?.body;
    });

    cy.get(entityTableSelector).should('contain', 'Merlot');
  });

  it('should validate acidity range for wine grapes', () => {
    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // ✅ CORREGIDO: Hacer clic en "Crear nueva UVA"
    cy.get('[data-cy="entityCreateButton"]').click();

    // Esperar a que se cargue el formulario
    cy.get('#field_ph').should('be.visible');

    // Test acidez válida (5.0-8.0 g/L)
    cy.get('#field_ph').type('3.4');
    cy.get('#field_acidez').type('7.2');
    cy.get('#field_brix').type('23.0');
    cy.get('#field_variedad').type('Chardonnay');
    cy.get('#field_viniedo').type('Viña Test');
    cy.get('#field_cantidad').type('1200');
    cy.get(entityCreateSaveButtonSelector).click();

    // Verificar que se creó exitosamente
    cy.wait('@postEntityRequest').then(({ response }) => {
      expect(response?.statusCode).to.equal(201);
      uva = response?.body;
    });

    cy.get(entityTableSelector).should('contain', 'Chardonnay');
  });

  it('should require all mandatory fields', () => {
    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    // ✅ CORREGIDO: Hacer clic en "Crear nueva UVA"
    cy.get('[data-cy="entityCreateButton"]').click();

    // Esperar a que se cargue el formulario
    cy.get('#field_ph').should('be.visible');

    // Intentar guardar sin llenar campos requeridos
    cy.get(entityCreateSaveButtonSelector).should('be.disabled');

    // Llenar solo algunos campos
    cy.get('#field_ph').type('3.2');
    cy.get('#field_variedad').type('Test');

    // El botón debería seguir deshabilitado hasta llenar todos los campos
    cy.get(entityCreateSaveButtonSelector).should('be.disabled');
  });

  it('should handle different grape varieties', () => {
    const varieties = ['Cabernet Sauvignon', 'Merlot', 'Chardonnay'];

    cy.visit(uvaPageUrl);
    cy.wait('@entitiesRequest');

    varieties.forEach((variety, index) => {
      // ✅ CORREGIDO: Hacer clic en "Crear nueva UVA" para cada variedad
      cy.get('[data-cy="entityCreateButton"]').click();

      // Esperar a que se cargue el formulario
      cy.get('#field_ph').should('be.visible');

      cy.get('#field_ph').type('3.2');
      cy.get('#field_acidez').type('6.5');
      cy.get('#field_brix').type('22.0');
      cy.get('#field_variedad').type(variety);
      cy.get('#field_viniedo').type(`Viña ${index + 1}`);
      cy.get('#field_cantidad').type('1000');
      cy.get(entityCreateSaveButtonSelector).click();

      // Verificar que se creó
      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        uva = response?.body;
      });

      cy.get(entityTableSelector).should('contain', variety);

      // Volver a la lista para la siguiente iteración
      cy.visit(uvaPageUrl);
      cy.wait('@entitiesRequest');
    });
  });
});
