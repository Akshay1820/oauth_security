package com.demo.outh_security.repository;

import com.demo.outh_security.model.ACCOUNT_TYPE;
import com.demo.outh_security.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {


    Optional<AppUser> findByEmail(String email);

    Optional<AppUser> findByUsername(String username);

    long countByAccountType(ACCOUNT_TYPE accountType);

    long countByCreatedAtAfter(LocalDateTime date);
}
