package com.demo.outh_security.service;

import com.demo.outh_security.dto.AppUserDto;
import com.demo.outh_security.model.AppUser;
import com.demo.outh_security.model.Provider;
import com.demo.outh_security.model.Role;
import com.demo.outh_security.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser createAppUser(AppUserDto appUserDto) {

        checkUserExistOrNot(appUserDto);
        AppUser appUser = new AppUser();
        appUser.setRole(Role.USER);
        appUser.setName(appUserDto.getName());
        appUser.setUsername(appUserDto.getUsername());
        appUser.setEmail(appUserDto.getEmail());
        appUser.setAvatarUrl(appUserDto.getAvatarUrl());
        appUser.setProvider(resolvedProvider(appUserDto.getProvider()));
        appUser.setCreatedAt(LocalDateTime.now());
        appUser.setLastLoginAt(LocalDateTime.now());

        appUserRepository.save(appUser);
        return appUser;
    }

    private Provider resolvedProvider(String provider) {
        if(provider.toLowerCase().equals("github")){
            return Provider.GITHUB;
        } else if (provider.toLowerCase().equals("google")) {
            return Provider.GOOGLE;
        }
        return null;
    }

    private void checkUserExistOrNot(AppUserDto appUserDto) {

    }
}
