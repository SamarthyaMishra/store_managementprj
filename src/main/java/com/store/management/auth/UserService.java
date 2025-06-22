// // package com.store.management.auth;

// // import com.store.management.model.User;
// // import com.store.management.repository.UserRepository;
// // import org.springframework.beans.factory.annotation.Autowired;
// // import org.springframework.security.core.userdetails.UserDetails;
// // import org.springframework.security.core.userdetails.UserDetailsService;
// // import org.springframework.security.core.userdetails.UsernameNotFoundException;
// // import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// // import org.springframework.stereotype.Service;

// // @Service
// // public class UserService implements UserDetailsService {

// //     @Autowired
// //     private UserRepository userRepository;

// //     @Override
// //     public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
// //         User user = userRepository.findByUsername(username)
// //             .orElseThrow(() -> new UsernameNotFoundException("User not found"));
// // System.out.println("Loading user by username: @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + username);

// // System.out.println("Loading user by password: @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@" + user.getPassword());
// // System.out.println("Username: ******************************************" + user.getPassword());
// //                     System.out.println(new BCryptPasswordEncoder().encode(user.getPassword()));

// //         return org.springframework.security.core.userdetails.User
// //                 .withUsername(user.getUsername())
// //                 .password(user.getPassword())
// //                 .roles("USER")
// //                 .build();
// //     }
// // }

package com.store.management.auth;

import com.store.management.model.User;
import com.store.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User login(String username, String password) {
        return userRepository.findByUsername(username)
            .filter(user -> user.getPassword().equals(password))
            .orElse(null);
    }
public boolean authenticate(String username, String password) {
        return userRepository.findByUsername(username)
            .map(user -> user.getPassword().equals(password))
            .orElse(false);
    }
    public boolean registerUser(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) return false;

        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // In production: hash the password!
        userRepository.save(user);
        return true;
    }
}

