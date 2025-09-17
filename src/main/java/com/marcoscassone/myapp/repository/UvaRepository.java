package com.marcoscassone.myapp.repository;

import com.marcoscassone.myapp.domain.Uva;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Uva entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UvaRepository extends JpaRepository<Uva, Long> {}
