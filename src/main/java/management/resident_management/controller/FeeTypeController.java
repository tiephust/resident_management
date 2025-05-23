package management.resident_management.controller;

import lombok.RequiredArgsConstructor;
import management.resident_management.dto.FeeTypeDTO;
import management.resident_management.dto.NewFeeTypeDTO;
import management.resident_management.service.FeeTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/fee-type")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Validated
public class FeeTypeController {

    private final FeeTypeService feeTypeService;

    @GetMapping
    public ResponseEntity<List<FeeTypeDTO>> getAllFeeTypes() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(feeTypeService.getAllFeeTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeTypeDTO> getFeeTypeById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        FeeTypeDTO feeType = feeTypeService.getFeeTypeById(id);
        return feeType != null ? ResponseEntity.ok(feeType) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<FeeTypeDTO> createFeeType(@Valid @RequestBody NewFeeTypeDTO feeTypeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            return ResponseEntity.ok(feeTypeService.createFeeType(feeTypeDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeeTypeDTO> updateFeeType(@PathVariable Long id, @Valid @RequestBody NewFeeTypeDTO feeTypeDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            FeeTypeDTO updatedFeeType = feeTypeService.updateFeeType(id, feeTypeDTO);
            return updatedFeeType != null ? ResponseEntity.ok(updatedFeeType) : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeeType(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            feeTypeService.deleteFeeType(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<FeeTypeDTO>> searchFeeTypes(@RequestParam String searchTerm) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(feeTypeService.searchFeeTypes(searchTerm));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FeeTypeDTO>> getFeeTypesByCategory(@PathVariable String category) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(feeTypeService.getFeeTypesByCategory(category));
    }
}