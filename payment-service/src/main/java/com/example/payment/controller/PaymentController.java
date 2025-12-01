package com.example.payment.controller;

import com.example.payment.entity.Payment;
import com.example.payment.entity.PaymentRequest;
import com.example.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequest request) {

        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setMethod(request.getMethod());
        payment.setStatus(request.getStatus());

        Payment saved = paymentRepository.save(payment);

        return ResponseEntity.ok(saved);
    }
    // 결제 내역 조회
//    @GetMapping
//    public ResponseEntity<List<Payment>> getPayments() {
//        List<Payment> list = paymentRepository.findAll();
//        return new ResponseEntity<>(list, HttpStatus.OK);
//    }
}


//import com.example.payment.entity.Payment;
//import com.example.payment.repository.PaymentRepository;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/payment")
//public class PaymentController {
//
//    private final PaymentRepository paymentRepository;
//
//    public PaymentController(PaymentRepository paymentRepository) {
//        this.paymentRepository = paymentRepository;
//    }
//
//    // 결제 생성
//    @PostMapping
//    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
//        Payment savedPayment = paymentRepository.save(payment);
//        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
//    }
//
//    // 결제 내역 조회
//    @GetMapping
//    public ResponseEntity<List<Payment>> getPayments() {
//        List<Payment> list = paymentRepository.findAll();
//        return new ResponseEntity<>(list, HttpStatus.OK);
//    }
//}
