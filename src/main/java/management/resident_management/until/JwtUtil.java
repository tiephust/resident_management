package management.resident_management.until;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import management.resident_management.dto.TokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long accessTokenExpiration = 3600000; // 1 hour
    private final long refreshTokenExpiration = 86400000; // 24 hours

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public TokenResponse generateToken(Long id, String email, LocalDateTime createdAt) {
        String refreshToken = generateRefreshToken(id, email, createdAt);
        String accessToken = generateAccessToken(id, email, refreshToken);
        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse generateToken(String refreshToken) {
        Claims claims = extractAllClaims(refreshToken);
        Long id = claims.get("id", Long.class);
        String email = claims.get("email", String.class);
        String password = claims.get("password", String.class);
        LocalDateTime createdAt = LocalDateTime.parse(claims.get("createdAt", String.class));
        String newAccessToken = generateAccessToken(id, email, refreshToken);
        return new TokenResponse(newAccessToken, refreshToken);
    }

    public String generateRefreshToken(Long id, String email, LocalDateTime createdAt) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email);
        claims.put("createdAt", createdAt.toString());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(key)
                .compact();
    }

    public String generateAccessToken(Long id, String email, String refreshToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email); // Thêm email vào claims
        claims.put("refreshToken", refreshToken);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(key)
                .compact();
    }

    public boolean isAccessTokenValid(String accessToken) {
        try {
            Claims claims = extractAllClaims(accessToken);
            return claims.containsKey("id") 
                    && claims.containsKey("refreshToken")
                    && !isTokenExpired(claims);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshTokenValid(String refreshToken) {
        try {
            Claims claims = extractAllClaims(refreshToken);
            return claims.containsKey("id")
                    && claims.containsKey("email")
                    && claims.containsKey("createdAt")
                    && !isTokenExpired(claims);
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    public Long getIdFromAccessToken(String accessToken) {
        return extractAllClaims(accessToken).get("id", Long.class);
    }

    public String getRefreshTokenFromAccessToken(String accessToken) {
        return extractAllClaims(accessToken).get("refreshToken", String.class);
    }

    public String getEmailFromToken(String token) {
        return extractAllClaims(token).get("email", String.class);
    }
}