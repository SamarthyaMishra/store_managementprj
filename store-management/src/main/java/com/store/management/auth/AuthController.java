// package com.store.management.auth;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.*;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {

//     // In-memory user store
//     private final Map<String, User> users = new HashMap<>() {{
//         put("admin", new User("admin", "admin123", "7755888840"));
//         put("user", new User("user", "user123", "8888888888"));
//     }};

//     // Store OTP per mobile number
//     private final Map<String, String> otpStore = new HashMap<>();

//     @Autowired
//     private JwtUtil jwtUtil;

//     // Login endpoint - returns JWT token on success
//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody LoginRequest request) {
//         User user = users.get(request.getUsername());
//         if (user != null && user.getPassword().equals(request.getPassword())) {
//             String token = jwtUtil.generateToken(user.getUsername());
//             Map<String, Object> response = new HashMap<>();
//             response.put("token", token);
//             response.put("username", user.getUsername());
//             response.put("mobile", user.getMobile());
//             return ResponseEntity.ok(response);
//         } else {
//             return ResponseEntity.status(401).body("Invalid credentials");
//         }
//     }

//     // Send OTP for forgot password
//     @PostMapping("/send-otp")
//     public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
//         String mobile = body.get("mobile");
//         for (User user : users.values()) {
//             if (user.getMobile().equals(mobile)) {
//                 String otp = String.valueOf(new Random().nextInt(8999) + 1000);
//                 otpStore.put(mobile, otp);
//                 System.out.println("Generated OTP for " + mobile + " is: " + otp);
//                 return ResponseEntity.ok("OTP sent to your mobile");
//             }
//         }
//         return ResponseEntity.status(404).body("Mobile number not found");
//     }

//     // Reset password using OTP
//     @PostMapping("/reset-password")
//     public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
//         String storedOtp = otpStore.get(request.getMobile());
//         if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
//             return ResponseEntity.status(400).body("Invalid or expired OTP");
//         }

//         for (Map.Entry<String, User> entry : users.entrySet()) {
//             if (entry.getValue().getMobile().equals(request.getMobile())) {
//                 entry.getValue().setPassword(request.getNewPassword());
//                 otpStore.remove(request.getMobile());
//                 return ResponseEntity.ok("Password reset successfully");
//             }
//         }
//         return ResponseEntity.status(404).body("User not found");
//     }

//     // User class (in-memory)
//     static class User {
//         private String username;
//         private String password;
//         private String mobile;

//         public User(String username, String password, String mobile) {
//             this.username = username;
//             this.password = password;
//             this.mobile = mobile;
//         }

//         public String getUsername() { return username; }
//         public String getPassword() { return password; }
//         public String getMobile() { return mobile; }
//         public void setPassword(String password) { this.password = password; }
//     }

//     // DTO for login request
//     static class LoginRequest {
//         private String username;
//         private String password;

//         public String getUsername() { return username; }
//         public void setUsername(String username) { this.username = username; }
//         public String getPassword() { return password; }
//         public void setPassword(String password) { this.password = password; }
//     }

//     // DTO for reset password request
//     static class ResetPasswordRequest {
//         private String mobile;
//         private String otp;
//         private String newPassword;

//         public String getMobile() { return mobile; }
//         public void setMobile(String mobile) { this.mobile = mobile; }
//         public String getOtp() { return otp; }
//         public void setOtp(String otp) { this.otp = otp; }
//         public String getNewPassword() { return newPassword; }
//         public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
//     }
// }
package com.store.management.auth;
import com.store.management.model.User;
import com.store.management.repository.UserRepository;
import com.store.management.auth.JwtUtil;
import com.store.management.auth.dto.AuthRequest;
import com.store.management.auth.dto.AuthResponse;
import com.store.management.auth.dto.ResetPasswordRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    private final Map<String, String> otpStore = new HashMap<>();

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody AuthRequest request) {
    try {
        // DO NOT encode the password here! Spring Security handles matching the raw password
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
    } catch (Exception e) {
        // You may want to log the exception for debugging (optional)
        // log.warn("Login failed for user: {}", request.getUsername(), e);
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // If authentication succeeds, generate JWT
    final UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
    final String jwt = jwtUtil.generateToken(userDetails.getUsername());
    return ResponseEntity.ok(new AuthResponse(jwt));
}

@PostMapping("/send-otp")
public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
    String mobile = body.get("mobile");
    Optional<User> optionalUser = userRepository.findByMobile(mobile);
    if (optionalUser.isPresent()) {
        String otp = String.valueOf(new Random().nextInt(9000) + 1000); // 4-digit OTP
        otpStore.put(mobile, otp);
        // In production, send the OTP via SMS, not console!
        System.out.println("Generated OTP for " + mobile + " is: " + otp);
        return ResponseEntity.ok("OTP sent to your mobile");
    }
    return ResponseEntity.status(404).body("Mobile number not found");
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    String storedOtp = otpStore.get(request.getMobile());
    if (storedOtp == null || !storedOtp.equals(request.getOtp())) {
        return ResponseEntity.status(400).body("Invalid or expired OTP");
    }

    Optional<User> optionalUser = userRepository.findByMobile(request.getMobile());
    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        // ENCODE the new password before saving!
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpStore.remove(request.getMobile());
        return ResponseEntity.ok("Password reset successfully");
    }
    return ResponseEntity.status(404).body("User not found");
}

}
