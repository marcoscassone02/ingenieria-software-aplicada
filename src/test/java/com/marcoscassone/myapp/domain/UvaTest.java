package com.marcoscassone.myapp.domain;

import static com.marcoscassone.myapp.domain.UvaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.marcoscassone.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UvaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Uva.class);
        Uva uva1 = getUvaSample1();
        Uva uva2 = new Uva();
        assertThat(uva1).isNotEqualTo(uva2);

        uva2.setId(uva1.getId());
        assertThat(uva1).isEqualTo(uva2);

        uva2 = getUvaSample2();
        assertThat(uva1).isNotEqualTo(uva2);
    }
}
