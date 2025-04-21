package management.resident_management.controller;

import management.resident_management.entity.Resident;
import management.resident_management.repository.ResidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/residents")
@CrossOrigin(origins = "http://localhost:3000")
public class ResidentController {

    @Autowired
    private ResidentRepository residentRepository;

    @GetMapping
    public List<Resident> getAllResidents() {
        return residentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resident> getResidentById(@PathVariable Long id) {
        Optional<Resident> resident = residentRepository.findById(id);
        return resident.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Resident createResident(@RequestBody Resident resident) {
        return residentRepository.save(resident);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resident> updateResident(@PathVariable Long id, @RequestBody Resident residentDetails) {
        Optional<Resident> residentOptional = residentRepository.findById(id);
        if (residentOptional.isPresent()) {
            Resident resident = residentOptional.get();
            resident.setName(residentDetails.getName());
            resident.setEmail(residentDetails.getEmail());
            resident.setPhoneNumber(residentDetails.getPhoneNumber());
            return ResponseEntity.ok(residentRepository.save(resident));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResident(@PathVariable Long id) {
        if (residentRepository.existsById(id)) {
            residentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 