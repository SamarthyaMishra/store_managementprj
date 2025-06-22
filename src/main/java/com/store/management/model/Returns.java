package com.store.management.model;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.store.management.dto.ReturnsDTO.ReturnsDTOBuilder;

@Getter
@Setter
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// @Builderpublic ReturnsDTOBuilder paymentMode(PaymentMode paymentMode) {
//         // TODO Auto-generated method stub
//         throw new UnsupportedOperationException("Unimplemented method 'paymentMode'");
//     }
public class Returns {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "return_id")
    private Integer returnId;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private LocalDateTime returnDate;

    private BigDecimal totalReturnAmount;

    @OneToMany(mappedBy = "returns", cascade = CascadeType.ALL)
    private List<ReturnItem> returnItems;

    @Enumerated(EnumType.STRING)
    @Column(name = "return_type")
    private ReturnsType returnType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode") 
    private PaymentMode paymentMode;

    public enum PaymentMode { Cash, Online }

    public enum ReturnsType { Retail, Wholesale }

    // Getters and Setters
}