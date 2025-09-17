package com.marcoscassone.myapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Uva.
 */
@Entity
@Table(name = "uva")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Uva implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "ph", nullable = false)
    private Double ph;

    @NotNull
    @Column(name = "acidez", nullable = false)
    private Double acidez;

    @NotNull
    @Column(name = "brix", nullable = false)
    private Double brix;

    @NotNull
    @Column(name = "variedad", nullable = false)
    private String variedad;

    @NotNull
    @Column(name = "viniedo", nullable = false)
    private String viniedo;

    @NotNull
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Uva id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getPh() {
        return this.ph;
    }

    public Uva ph(Double ph) {
        this.setPh(ph);
        return this;
    }

    public void setPh(Double ph) {
        this.ph = ph;
    }

    public Double getAcidez() {
        return this.acidez;
    }

    public Uva acidez(Double acidez) {
        this.setAcidez(acidez);
        return this;
    }

    public void setAcidez(Double acidez) {
        this.acidez = acidez;
    }

    public Double getBrix() {
        return this.brix;
    }

    public Uva brix(Double brix) {
        this.setBrix(brix);
        return this;
    }

    public void setBrix(Double brix) {
        this.brix = brix;
    }

    public String getVariedad() {
        return this.variedad;
    }

    public Uva variedad(String variedad) {
        this.setVariedad(variedad);
        return this;
    }

    public void setVariedad(String variedad) {
        this.variedad = variedad;
    }

    public String getViniedo() {
        return this.viniedo;
    }

    public Uva viniedo(String viniedo) {
        this.setViniedo(viniedo);
        return this;
    }

    public void setViniedo(String viniedo) {
        this.viniedo = viniedo;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public Uva cantidad(Integer cantidad) {
        this.setCantidad(cantidad);
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Uva)) {
            return false;
        }
        return getId() != null && getId().equals(((Uva) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Uva{" +
            "id=" + getId() +
            ", ph=" + getPh() +
            ", acidez=" + getAcidez() +
            ", brix=" + getBrix() +
            ", variedad='" + getVariedad() + "'" +
            ", viniedo='" + getViniedo() + "'" +
            ", cantidad=" + getCantidad() +
            "}";
    }
}
