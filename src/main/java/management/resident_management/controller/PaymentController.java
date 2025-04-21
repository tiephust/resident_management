package management.resident_management.controller;

import management.resident_management.entity.Bill;
import management.resident_management.entity.Resident;
import management.resident_management.repository.BillRepository;
import management.resident_management.repository.ResidentRepository;
import management.resident_management.service.StripeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private final StripeService stripeService;
    private final BillRepository billRepository;
    private final ResidentRepository residentRepository;

    @Value("${stripe.public.key}")
    private String stripePublicKey;

    public PaymentController(StripeService stripeService, 
                           BillRepository billRepository,
                           ResidentRepository residentRepository) {
        this.stripeService = stripeService;
        this.billRepository = billRepository;
        this.residentRepository = residentRepository;
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestParam Long billId) {
        try {
            Bill bill = billRepository.findById(billId)
                    .orElseThrow(() -> new RuntimeException("Bill not found"));
            
            Resident resident = bill.getResident();
            if (resident.getStripeCustomerId() == null) {
                String customerId = stripeService.createCustomer(resident);
                resident.setStripeCustomerId(customerId);
                residentRepository.save(resident);
            }

            // Convert amount to cents (Stripe uses smallest currency unit)
            long amountInCents = bill.getAmount().multiply(new BigDecimal("100")).longValue();
            String clientSecret = stripeService.createPaymentIntent(amountInCents, resident.getStripeCustomerId());

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", clientSecret);
            response.put("publicKey", stripePublicKey);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String payload, 
                                         @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // Verify and process the webhook
            // Update bill status based on payment success/failure
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 