package com.store.management;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;

@Component
public class DatabaseKeepAlive {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseKeepAlive(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Runs every 10 minutes
    @Scheduled(fixedRate = 600000)
    public void keepAlive() {
        try {
            jdbcTemplate.execute("SELECT 1");
            System.out.println("✅ Pinged DB at " + java.time.LocalDateTime.now());
        } catch (Exception e) {
            System.err.println("❌ Keep-alive failed: " + e.getMessage());
        }
    }
}

