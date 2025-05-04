package management.resident_management.until;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import management.resident_management.dto.TokenResponse;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long accessTokenExpiration = 3600000; // 1 giờ cho AccessToken
    private final long refreshTokenExpiration = 86400000; // 1 ngày cho RefreshToken

    public TokenResponse generateToken(Long id, String email, String password, LocalDateTime createdAt) {
        String accessToken = generateAccessToken(id, generateRefreshToken(id, email, password, createdAt));
        String refreshToken = generateRefreshToken(id, email, password, createdAt);
        return new TokenResponse(accessToken, refreshToken);
    }

    public TokenResponse generateToken(String refreshToken) {
        Claims claims = extractAllClaims(refreshToken);
        Long id = claims.get("id", Long.class);
        String email = claims.get("email", String.class);
        String password = claims.get("password", String.class);
        LocalDateTime createdAt = LocalDateTime.parse(claims.get("createdAt", String.class));
        String accessToken = generateAccessToken(id, refreshToken);
        return new TokenResponse(accessToken, refreshToken);
    }

    // Tạo RefreshToken với id và thông tin cần thiết
    public String generateRefreshToken(Long id, String email, String password, LocalDateTime createdAt) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email);
        claims.put("password", password); // Nên lưu password đã được hash
        claims.put("createdAt", createdAt.toString());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(key)
                .compact();
    }

    // Tạo AccessToken chỉ dựa trên id và RefreshToken
    public String generateAccessToken(Long id, String refreshToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("refreshToken", refreshToken); // Liên kết với RefreshToken

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(key)
                .compact();
    }

    // Kiểm tra AccessToken có hợp lệ không (dựa trên id và RefreshToken)
    public boolean isAccessTokenValid(String accessToken, Long id, String refreshToken) {
        try {
            Claims claims = extractAllClaims(accessToken);
            return claims.get("id").equals(id)
                    && claims.get("refreshToken").equals(refreshToken)
                    && !isTokenExpired(claims);
        } catch (Exception e) {
            return false;
        }
    }

    // Kiểm tra RefreshToken có hợp lệ không
    public boolean isRefreshTokenValid(String refreshToken, Long id, String email, String password) {
        try {
            Claims claims = extractAllClaims(refreshToken);
            return claims.get("id").equals(id)
                    && claims.get("email").equals(email)
                    && claims.get("password").equals(password)
                    && !isTokenExpired(claims);
        } catch (Exception e) {
            return false;
        }
    }

    // Trích xuất tất cả claims từ token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Kiểm tra token đã hết hạn chưa
    private boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    // Lấy id từ AccessToken
    public Long getIdFromAccessToken(String accessToken) {
        return extractAllClaims(accessToken).get("id", Long.class);
    }

    // Lấy RefreshToken từ AccessToken
    public String getRefreshTokenFromAccessToken(String accessToken) {
        return extractAllClaims(accessToken).get("refreshToken", String.class);
    }
}