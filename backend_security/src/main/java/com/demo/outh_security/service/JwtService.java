package com.demo.outh_security.service;

import com.demo.outh_security.dto.AppUserDto;
import com.demo.outh_security.model.AppUser;
import com.demo.outh_security.repository.AppUserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class JwtService {

    private final AppUserService appUserService;
    private final AppUserRepository appUserRepository;

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    @Value("${app.jwt.expiration}")
    private long EXPIRATION_TIME;


    public String getJwtFromHeader(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // ✅ For OAuth2 (GitHub login)
    public String generateToken(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String provider = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
        String username = oAuth2User.getAttribute("login");
        String name = oAuth2User.getAttribute("name");
        String email = oAuth2User.getAttribute("email");
        String avatarUrl = oAuth2User.getAttribute("avatar_url");


        AppUserDto appUserDto = AppUserDto.builder()
                .provider(provider)
                .userName(username)
                .name(name)
                .email(email)
                .avatarUrl(avatarUrl)
                .build();

        appUserService.createAppUser(appUserDto);

        // Look up the user's role from DB
        String role = lookupUserRole(username, email);

        return Jwts.builder()
                .setSubject(username)
                .claim("email", email)
                .claim("avatar_url", avatarUrl)
                .claim("provider", "github")
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Keep this for regular username/password login if needed
    public String generateToken(String username) {
        String role = lookupUserRole(username, null);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        String userName = userDetails.getUsername();

        // Extract role from UserDetails authorities
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        return Jwts.builder()
                .setSubject(userName)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ Fixed - no more double encoding
    private Key getSignKey() {
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Look up the user's role from the database by username or email.
     */
    private String lookupUserRole(String username, String email) {
        Optional<AppUser> user = Optional.empty();

        if (username != null) {
            user = appUserRepository.findByUsername(username);
        }
        if (user.isEmpty() && email != null) {
            user = appUserRepository.findByEmail(email);
        }

        return user.map(u -> u.getAccountType().name())
                .orElse("ROLE_USER");
    }
}