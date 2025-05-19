package management.resident_management.dto;

public class PaymentResponse {
    String id;
    String residentName;
    String type;
    Double amount;
    String dueDate;
    String status;
    String description;
    String stripePaymentId;

    public PaymentResponse(String id, String residentName, String type, Double amount,
                           String dueDate, String status, String description, String stripePaymentId) {
        this.id = id;
        this.residentName = residentName;
        this.type = type;
        this.amount = amount;
        this.dueDate = dueDate;
        this.status = status;
        this.description = description;
        this.stripePaymentId = stripePaymentId;
    }
}