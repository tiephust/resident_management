package management.resident_management.controller;

import management.resident_management.entity.Resident;
import management.resident_management.service.ResidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
@CrossOrigin(origins = "http://localhost:3000")
public class ResidentController {

    @Autowired
    private ResidentService residentService;

    @GetMapping
    public List<Resident> getAllResidents() {
        return residentService.getAllResidents();
    }

    @GetMapping("/{id}")
    public Resident getResidentById(@PathVariable Long id) {
        return residentService.getResidentById(id);
    }

    @PostMapping
    public Resident createResident(@RequestBody Resident resident) {
        return residentService.createResident(resident);
    }

    @PutMapping("/{id}")
    public Resident updateResident(@PathVariable Long id, @RequestBody Resident resident) {
        return residentService.updateResident(id, resident);
    }

    @DeleteMapping("/{id}")
    public void deleteResident(@PathVariable Long id) {
        residentService.deleteResident(id);
    }

    @GetMapping("/search")
    public List<Resident> searchResidents(@RequestParam String searchTerm) {
        return residentService.searchResidents(searchTerm);
    }

    @GetMapping("/status/{status}")
    public List<Resident> getResidentsByStatus(@PathVariable String status) {
        return residentService.getResidentsByStatus(status);
    }
} 