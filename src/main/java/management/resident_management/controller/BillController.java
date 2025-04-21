package management.resident_management.controller;

import management.resident_management.entity.Bill;
import management.resident_management.entity.Resident;
import management.resident_management.repository.BillRepository;
import management.resident_management.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @GetMapping
    public List<Bill> getAllBills(@RequestParam(required = false) String status) {
        if (status != null) {
            return billRepository.findByStatus(status);
        }
        return billRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        Optional<Bill> bill = billRepository.findById(id);
        return bill.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        if (bill.getResident() == null || bill.getResident().getId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Resident> resident = residentRepository.findById(bill.getResident().getId());
        if (resident.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        bill.setResident(resident.get());
        return ResponseEntity.ok(billRepository.save(bill));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @RequestBody Bill billDetails) {
        Optional<Bill> billOptional = billRepository.findById(id);
        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();
            bill.setDescription(billDetails.getDescription());
            bill.setAmount(billDetails.getAmount());
            bill.setStatus(billDetails.getStatus());
            bill.setDueDate(billDetails.getDueDate());
            
            if (billDetails.getResident() != null && billDetails.getResident().getId() != null) {
                Optional<Resident> resident = residentRepository.findById(billDetails.getResident().getId());
                if (resident.isPresent()) {
                    bill.setResident(resident.get());
                }
            }
            
            return ResponseEntity.ok(billRepository.save(bill));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBill(@PathVariable Long id) {
        if (billRepository.existsById(id)) {
            billRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Bill> updateBillStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Optional<Bill> billOptional = billRepository.findById(id);
        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();
            bill.setStatus(status);
            return ResponseEntity.ok(billRepository.save(bill));
        }
        return ResponseEntity.notFound().build();
    }
} 