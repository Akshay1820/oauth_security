package com.demo.outh_security.service;

import com.demo.outh_security.model.AppUser;
import com.demo.outh_security.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;


@RequiredArgsConstructor
@Component
public class CustomerUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<AppUser> appUserOptional = userRepository.findByUsername(username);
        AppUser appUser = appUserOptional.get();
        if (appUserOptional.isPresent()) {
            UserDetails userDetails = User.withUsername(appUser.getUsername()).authorities(appUser.getAccountType().name()).build();
            return userDetails;
        }
        return null;
    }
}
