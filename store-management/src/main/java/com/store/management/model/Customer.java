package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 

public class Customer { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "customer_id", columnDefinition = "INT" , nullable = false)
    private Long customerId; 
    @Column(unique = true, nullable = false) 
    private String customerCode; 
    @Column(nullable = false) 
    private String customerName; 
    @Column(unique = true, nullable = false)
    private String mobileNumber; 
    @Column(length = 500) 
    private String address;
}
