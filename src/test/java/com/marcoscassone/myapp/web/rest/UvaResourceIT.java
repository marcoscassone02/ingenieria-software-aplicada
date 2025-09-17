package com.marcoscassone.myapp.web.rest;

import static com.marcoscassone.myapp.domain.UvaAsserts.*;
import static com.marcoscassone.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marcoscassone.myapp.IntegrationTest;
import com.marcoscassone.myapp.domain.Uva;
import com.marcoscassone.myapp.repository.UvaRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UvaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UvaResourceIT {

    private static final Double DEFAULT_PH = 1D;
    private static final Double UPDATED_PH = 2D;

    private static final Double DEFAULT_ACIDEZ = 1D;
    private static final Double UPDATED_ACIDEZ = 2D;

    private static final Double DEFAULT_BRIX = 1D;
    private static final Double UPDATED_BRIX = 2D;

    private static final String DEFAULT_VARIEDAD = "AAAAAAAAAA";
    private static final String UPDATED_VARIEDAD = "BBBBBBBBBB";

    private static final String DEFAULT_VINIEDO = "AAAAAAAAAA";
    private static final String UPDATED_VINIEDO = "BBBBBBBBBB";

    private static final Integer DEFAULT_CANTIDAD = 1;
    private static final Integer UPDATED_CANTIDAD = 2;

    private static final String ENTITY_API_URL = "/api/uvas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UvaRepository uvaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUvaMockMvc;

    private Uva uva;

    private Uva insertedUva;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Uva createEntity() {
        return new Uva()
            .ph(DEFAULT_PH)
            .acidez(DEFAULT_ACIDEZ)
            .brix(DEFAULT_BRIX)
            .variedad(DEFAULT_VARIEDAD)
            .viniedo(DEFAULT_VINIEDO)
            .cantidad(DEFAULT_CANTIDAD);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Uva createUpdatedEntity() {
        return new Uva()
            .ph(UPDATED_PH)
            .acidez(UPDATED_ACIDEZ)
            .brix(UPDATED_BRIX)
            .variedad(UPDATED_VARIEDAD)
            .viniedo(UPDATED_VINIEDO)
            .cantidad(UPDATED_CANTIDAD);
    }

    @BeforeEach
    void initTest() {
        uva = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedUva != null) {
            uvaRepository.delete(insertedUva);
            insertedUva = null;
        }
    }

    @Test
    @Transactional
    void createUva() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Uva
        var returnedUva = om.readValue(
            restUvaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Uva.class
        );

        // Validate the Uva in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertUvaUpdatableFieldsEquals(returnedUva, getPersistedUva(returnedUva));

        insertedUva = returnedUva;
    }

    @Test
    @Transactional
    void createUvaWithExistingId() throws Exception {
        // Create the Uva with an existing ID
        uva.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPhIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        uva.setPh(null);

        // Create the Uva, which fails.

        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAcidezIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        uva.setAcidez(null);

        // Create the Uva, which fails.

        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBrixIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        uva.setBrix(null);

        // Create the Uva, which fails.

        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkVariedadIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        uva.setVariedad(null);

        // Create the Uva, which fails.

        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkViniedoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        uva.setViniedo(null);

        // Create the Uva, which fails.

        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCantidadIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        uva.setCantidad(null);

        // Create the Uva, which fails.

        restUvaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUvas() throws Exception {
        // Initialize the database
        insertedUva = uvaRepository.saveAndFlush(uva);

        // Get all the uvaList
        restUvaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(uva.getId().intValue())))
            .andExpect(jsonPath("$.[*].ph").value(hasItem(DEFAULT_PH)))
            .andExpect(jsonPath("$.[*].acidez").value(hasItem(DEFAULT_ACIDEZ)))
            .andExpect(jsonPath("$.[*].brix").value(hasItem(DEFAULT_BRIX)))
            .andExpect(jsonPath("$.[*].variedad").value(hasItem(DEFAULT_VARIEDAD)))
            .andExpect(jsonPath("$.[*].viniedo").value(hasItem(DEFAULT_VINIEDO)))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD)));
    }

    @Test
    @Transactional
    void getUva() throws Exception {
        // Initialize the database
        insertedUva = uvaRepository.saveAndFlush(uva);

        // Get the uva
        restUvaMockMvc
            .perform(get(ENTITY_API_URL_ID, uva.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(uva.getId().intValue()))
            .andExpect(jsonPath("$.ph").value(DEFAULT_PH))
            .andExpect(jsonPath("$.acidez").value(DEFAULT_ACIDEZ))
            .andExpect(jsonPath("$.brix").value(DEFAULT_BRIX))
            .andExpect(jsonPath("$.variedad").value(DEFAULT_VARIEDAD))
            .andExpect(jsonPath("$.viniedo").value(DEFAULT_VINIEDO))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD));
    }

    @Test
    @Transactional
    void getNonExistingUva() throws Exception {
        // Get the uva
        restUvaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUva() throws Exception {
        // Initialize the database
        insertedUva = uvaRepository.saveAndFlush(uva);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the uva
        Uva updatedUva = uvaRepository.findById(uva.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUva are not directly saved in db
        em.detach(updatedUva);
        updatedUva
            .ph(UPDATED_PH)
            .acidez(UPDATED_ACIDEZ)
            .brix(UPDATED_BRIX)
            .variedad(UPDATED_VARIEDAD)
            .viniedo(UPDATED_VINIEDO)
            .cantidad(UPDATED_CANTIDAD);

        restUvaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUva.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(updatedUva))
            )
            .andExpect(status().isOk());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUvaToMatchAllProperties(updatedUva);
    }

    @Test
    @Transactional
    void putNonExistingUva() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        uva.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUvaMockMvc
            .perform(put(ENTITY_API_URL_ID, uva.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUva() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        uva.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUvaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(uva))
            )
            .andExpect(status().isBadRequest());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUva() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        uva.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUvaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(uva)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUvaWithPatch() throws Exception {
        // Initialize the database
        insertedUva = uvaRepository.saveAndFlush(uva);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the uva using partial update
        Uva partialUpdatedUva = new Uva();
        partialUpdatedUva.setId(uva.getId());

        partialUpdatedUva.brix(UPDATED_BRIX).cantidad(UPDATED_CANTIDAD);

        restUvaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUva.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUva))
            )
            .andExpect(status().isOk());

        // Validate the Uva in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUvaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedUva, uva), getPersistedUva(uva));
    }

    @Test
    @Transactional
    void fullUpdateUvaWithPatch() throws Exception {
        // Initialize the database
        insertedUva = uvaRepository.saveAndFlush(uva);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the uva using partial update
        Uva partialUpdatedUva = new Uva();
        partialUpdatedUva.setId(uva.getId());

        partialUpdatedUva
            .ph(UPDATED_PH)
            .acidez(UPDATED_ACIDEZ)
            .brix(UPDATED_BRIX)
            .variedad(UPDATED_VARIEDAD)
            .viniedo(UPDATED_VINIEDO)
            .cantidad(UPDATED_CANTIDAD);

        restUvaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUva.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUva))
            )
            .andExpect(status().isOk());

        // Validate the Uva in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUvaUpdatableFieldsEquals(partialUpdatedUva, getPersistedUva(partialUpdatedUva));
    }

    @Test
    @Transactional
    void patchNonExistingUva() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        uva.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUvaMockMvc
            .perform(patch(ENTITY_API_URL_ID, uva.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(uva)))
            .andExpect(status().isBadRequest());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUva() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        uva.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUvaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(uva))
            )
            .andExpect(status().isBadRequest());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUva() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        uva.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUvaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(uva)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Uva in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUva() throws Exception {
        // Initialize the database
        insertedUva = uvaRepository.saveAndFlush(uva);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the uva
        restUvaMockMvc.perform(delete(ENTITY_API_URL_ID, uva.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return uvaRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Uva getPersistedUva(Uva uva) {
        return uvaRepository.findById(uva.getId()).orElseThrow();
    }

    protected void assertPersistedUvaToMatchAllProperties(Uva expectedUva) {
        assertUvaAllPropertiesEquals(expectedUva, getPersistedUva(expectedUva));
    }

    protected void assertPersistedUvaToMatchUpdatableProperties(Uva expectedUva) {
        assertUvaAllUpdatablePropertiesEquals(expectedUva, getPersistedUva(expectedUva));
    }
}
