package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
@Entity 
@Data 
@NoArgsConstructor
@AllArgsConstructor
public class Unit { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long unitId; 
    @Column(nullable = false, unique = true) 
    private String unitName;
}
