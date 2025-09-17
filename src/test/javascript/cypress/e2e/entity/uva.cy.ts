import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Uva e2e test', () => {
  const uvaPageUrl = '/uva';
  const uvaPageUrlPattern = new RegExp('/uva(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const uvaSample = {
    ph: 7066.54,
    acidez: 10898.01,
    brix: 7516.6,
    variedad: 'circa simple',
    viniedo: 'aha whoa harangue',
    cantidad: 23956,
  };

  let uva;

  beforeEach(() => {
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

  it('Uvas menu should load Uvas page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('uva');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Uva').should('exist');
    cy.url().should('match', uvaPageUrlPattern);
  });

  describe('Uva page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(uvaPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Uva page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/uva/new$'));
        cy.getEntityCreateUpdateHeading('Uva');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', uvaPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/uvas',
          body: uvaSample,
        }).then(({ body }) => {
          uva = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/uvas+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [uva],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(uvaPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Uva page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('uva');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', uvaPageUrlPattern);
      });

      it('edit button click should load edit Uva page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Uva');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', uvaPageUrlPattern);
      });

      it('edit button click should load edit Uva page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Uva');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', uvaPageUrlPattern);
      });

      it('last delete button click should delete instance of Uva', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('uva').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', uvaPageUrlPattern);

        uva = undefined;
      });
    });
  });

  describe('new Uva page', () => {
    beforeEach(() => {
      cy.visit(`${uvaPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Uva');
    });

    it('should create an instance of Uva', () => {
      cy.get(`[data-cy="ph"]`).type('18648.78');
      cy.get(`[data-cy="ph"]`).should('have.value', '18648.78');

      cy.get(`[data-cy="acidez"]`).type('3936.06');
      cy.get(`[data-cy="acidez"]`).should('have.value', '3936.06');

      cy.get(`[data-cy="brix"]`).type('11040.72');
      cy.get(`[data-cy="brix"]`).should('have.value', '11040.72');

      cy.get(`[data-cy="variedad"]`).type('very fail');
      cy.get(`[data-cy="variedad"]`).should('have.value', 'very fail');

      cy.get(`[data-cy="viniedo"]`).type('jubilantly');
      cy.get(`[data-cy="viniedo"]`).should('have.value', 'jubilantly');

      cy.get(`[data-cy="cantidad"]`).type('1097');
      cy.get(`[data-cy="cantidad"]`).should('have.value', '1097');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        uva = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', uvaPageUrlPattern);
    });
  });
});
