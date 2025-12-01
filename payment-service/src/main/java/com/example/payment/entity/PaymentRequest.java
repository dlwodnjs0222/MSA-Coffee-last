package com.example.payment.entity;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long orderId;
    private int amount;
    private String method;
    private String status;
}
