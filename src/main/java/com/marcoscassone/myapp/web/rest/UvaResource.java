package com.marcoscassone.myapp.web.rest;

import com.marcoscassone.myapp.domain.Uva;
import com.marcoscassone.myapp.repository.UvaRepository;
import com.marcoscassone.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.marcoscassone.myapp.domain.Uva}.
 */
@RestController
@RequestMapping("/api/uvas")
@Transactional
public class UvaResource {

    private static final Logger LOG = LoggerFactory.getLogger(UvaResource.class);

    private static final String ENTITY_NAME = "uva";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UvaRepository uvaRepository;

    public UvaResource(UvaRepository uvaRepository) {
        this.uvaRepository = uvaRepository;
    }

    /**
     * {@code POST  /uvas} : Create a new uva.
     *
     * @param uva the uva to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new uva, or with status {@code 400 (Bad Request)} if the uva has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Uva> createUva(@Valid @RequestBody Uva uva) throws URISyntaxException {
        LOG.debug("REST request to save Uva : {}", uva);
        if (uva.getId() != null) {
            throw new BadRequestAlertException("A new uva cannot already have an ID", ENTITY_NAME, "idexists");
        }
        uva = uvaRepository.save(uva);
        return ResponseEntity.created(new URI("/api/uvas/" + uva.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, uva.getId().toString()))
            .body(uva);
    }

    /**
     * {@code PUT  /uvas/:id} : Updates an existing uva.
     *
     * @param id the id of the uva to save.
     * @param uva the uva to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated uva,
     * or with status {@code 400 (Bad Request)} if the uva is not valid,
     * or with status {@code 500 (Internal Server Error)} if the uva couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Uva> updateUva(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Uva uva)
        throws URISyntaxException {
        LOG.debug("REST request to update Uva : {}, {}", id, uva);
        if (uva.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, uva.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!uvaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        uva = uvaRepository.save(uva);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, uva.getId().toString()))
            .body(uva);
    }

    /**
     * {@code PATCH  /uvas/:id} : Partial updates given fields of an existing uva, field will ignore if it is null
     *
     * @param id the id of the uva to save.
     * @param uva the uva to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated uva,
     * or with status {@code 400 (Bad Request)} if the uva is not valid,
     * or with status {@code 404 (Not Found)} if the uva is not found,
     * or with status {@code 500 (Internal Server Error)} if the uva couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Uva> partialUpdateUva(@PathVariable(value = "id", required = false) final Long id, @NotNull @RequestBody Uva uva)
        throws URISyntaxException {
        LOG.debug("REST request to partial update Uva partially : {}, {}", id, uva);
        if (uva.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, uva.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!uvaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Uva> result = uvaRepository
            .findById(uva.getId())
            .map(existingUva -> {
                if (uva.getPh() != null) {
                    existingUva.setPh(uva.getPh());
                }
                if (uva.getAcidez() != null) {
                    existingUva.setAcidez(uva.getAcidez());
                }
                if (uva.getBrix() != null) {
                    existingUva.setBrix(uva.getBrix());
                }
                if (uva.getVariedad() != null) {
                    existingUva.setVariedad(uva.getVariedad());
                }
                if (uva.getViniedo() != null) {
                    existingUva.setViniedo(uva.getViniedo());
                }
                if (uva.getCantidad() != null) {
                    existingUva.setCantidad(uva.getCantidad());
                }

                return existingUva;
            })
            .map(uvaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, uva.getId().toString())
        );
    }

    /**
     * {@code GET  /uvas} : get all the uvas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of uvas in body.
     */
    @GetMapping("")
    public List<Uva> getAllUvas() {
        LOG.debug("REST request to get all Uvas");
        return uvaRepository.findAll();
    }

    /**
     * {@code GET  /uvas/:id} : get the "id" uva.
     *
     * @param id the id of the uva to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the uva, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Uva> getUva(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Uva : {}", id);
        Optional<Uva> uva = uvaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(uva);
    }

    /**
     * {@code DELETE  /uvas/:id} : delete the "id" uva.
     *
     * @param id the id of the uva to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUva(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Uva : {}", id);
        uvaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
