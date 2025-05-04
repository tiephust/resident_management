package management.resident_management.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import management.resident_management.entity.User;
import management.resident_management.repository.UserRepository;
import management.resident_management.until.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws IOException, ServletException {
        try {
            // Try to get JWT from Authorization header first
            String jwt = getJwtFromRequest(request);

            if (jwt != null) {
                // Extract claims from token
                Long userId = jwtUtil.getIdFromAccessToken(jwt);
                String refreshToken = jwtUtil.getRefreshTokenFromAccessToken(jwt);

                // Validate token structure
                if (userId != null && refreshToken != null) {
                    // Verify token validity
                    if (jwtUtil.isAccessTokenValid(jwt, userId, refreshToken)) {
                        // Get user details
                        User user = userRepository.findById(userId).orElse(null);

                        if (user != null) {
                            // Create authentication object
                            UsernamePasswordAuthenticationToken authentication =
                                    new UsernamePasswordAuthenticationToken(
                                            user,
                                            null,
                                            user.getAuthorities()
                                    );
                            authentication.setDetails(
                                    new WebAuthenticationDetailsSource().buildDetails(request)
                            );

                            // Set authentication in security context
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        // Check Authorization header first
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        // Fall back to cookie if header not found
        Cookie cookie = WebUtils.getCookie(request, "accessToken");
        return cookie != null ? cookie.getValue() : null;
    }

    public User getCurrentUser(HttpServletRequest request) {
        String jwt = getJwtFromRequest(request);

        if (jwt != null) {
            try {
                Long userId = jwtUtil.getIdFromAccessToken(jwt);
                String refreshToken = jwtUtil.getRefreshTokenFromAccessToken(jwt);

                if (userId != null && refreshToken != null &&
                        jwtUtil.isAccessTokenValid(jwt, userId, refreshToken)) {
                    return userRepository.findById(userId).orElse(null);
                }
            } catch (Exception e) {
                logger.error("Failed to get current user", e);
            }
        }
        return null;
    }
}