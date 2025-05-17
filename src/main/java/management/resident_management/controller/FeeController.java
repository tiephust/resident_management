package management.resident_management.controller;

import management.resident_management.entity.Fee;
import management.resident_management.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    public ResponseEntity<List<Fee>> getAllFees() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fee> getFeeById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.getFeeById(id));
    }

    @PostMapping
    public ResponseEntity<Fee> createFee(@RequestBody Fee fee) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.createFee(fee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee> updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.updateFee(id, fee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFee(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        feeService.deleteFee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Fee>> searchFees(@RequestParam String searchTerm) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.searchFees(searchTerm));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Fee>> getFeesByStatus(@PathVariable String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.getFeesByStatus(status));
    }

    @GetMapping("/resident/{residentId}")
    public ResponseEntity<List<Fee>> getFeesByResident(@PathVariable Long residentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(feeService.getFeesByResident(residentId));
    }
}