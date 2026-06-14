package com.demo.outh_security.service;

import com.demo.outh_security.dto.AppUserDto;
import com.demo.outh_security.model.AppUser;
import com.demo.outh_security.model.Provider;
import com.demo.outh_security.model.ACCOUNT_TYPE;
import com.demo.outh_security.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public void createAppUser(AppUserDto dto) {

        AppUser appUser = checkUserExistOrNot(dto)
                .map(this::updateUser)
                .orElseGet(() -> createNewAppUser(dto));

        appUserRepository.save(appUser);
    }

    public List<AppUser> getAllUsers(){
        return appUserRepository.findAll();
    }

    private AppUser createNewAppUser(AppUserDto dto) {
        LocalDateTime now = LocalDateTime.now();

        AppUser appUser = new AppUser();
        appUser.setAccountType(ACCOUNT_TYPE.ROLE_USER);
        appUser.setName(dto.getName());
        appUser.setUsername(dto.getUserName());
        appUser.setEmail(dto.getEmail());
        appUser.setAvatarUrl(dto.getAvatarUrl());
        appUser.setProvider(resolveProvider(dto.getProvider()));
        appUser.setCreatedAt(now);
        appUser.setLastLoginAt(now);

        return appUser;
    }

    private AppUser updateUser(AppUser appUser) {
        appUser.setLastLoginAt(LocalDateTime.now());
        return appUser;
    }

    private Provider resolveProvider(String provider) {
        if (provider == null) {
            return null;
        }

        return switch (provider.toLowerCase()) {
            case "github" -> Provider.GITHUB;
            case "google" -> Provider.GOOGLE;
            default -> null;
        };
    }

    private Optional<AppUser> checkUserExistOrNot(AppUserDto dto) {
        return Optional.ofNullable(dto.getEmail())
                .flatMap(appUserRepository::findByEmail)
                .or(() -> appUserRepository.findByUsername(dto.getUserName()));
    }
}
