package management.resident_management.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import management.resident_management.entity.Resident;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    public String createCustomer(Resident resident) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        CustomerCreateParams params = CustomerCreateParams.builder()
                .setEmail(resident.getEmail())
                .setName(resident.getName())
                .setPhone(resident.getPhoneNumber())
                .build();

        Customer customer = Customer.create(params);
        return customer.getId();
    }

    public String createPaymentIntent(Long amount, String customerId) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency("usd")
                .setCustomer(customerId)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        return paymentIntent.getClientSecret();
    }
} 