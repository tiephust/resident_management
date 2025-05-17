package management.resident_management.controller;

import management.resident_management.entity.FeeType;
import management.resident_management.service.FeeTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-type")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class FeeTypeController {

    private final FeeTypeService feeTypeService;

    @GetMapping
    public ResponseEntity<List<FeeType>> getAllFeeTypes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeTypeService.getAllFeeTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeType> getFeeTypeById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeTypeService.getFeeTypeById(id));
    }

    @PostMapping
    public ResponseEntity<FeeType> createFeeType(@RequestBody FeeType feeType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeTypeService.createFeeType(feeType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeeType> updateFeeType(@PathVariable Long id, @RequestBody FeeType feeType) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeTypeService.updateFeeType(id, feeType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeeType(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        feeTypeService.deleteFeeType(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<FeeType>> searchFeeTypes(@RequestParam String searchTerm) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeTypeService.searchFeeTypes(searchTerm));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FeeType>> getFeeTypesByCategory(@PathVariable String category) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeTypeService.getFeeTypesByCategory(category));
    }
} 