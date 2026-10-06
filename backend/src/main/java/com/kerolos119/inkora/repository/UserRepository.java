package com.kerolos119.inkora.repository;

import com.kerolos119.inkora.document.Users;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends BaseRepository<Users, String> {

    boolean existsByPhoneNumber(@NotBlank(message = "phone number is required") String phoneNumber);

    boolean existsByEmail(@NotBlank(message = "email is required") @Email(message = "Invalid email format") String email);

    boolean existsByEmailAndIdNot(@NotBlank(message = "email is required") @Email(message = "Invalid email format") String email, String id);

    boolean existsByPhoneNumberAndIdNot(@NotBlank(message = "phone number is  required") @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "Invalid phone number") String phoneNumber, String id);

    Optional<Users> findByUsername(String username);

    Optional<Users> findByEmail(@NotEmpty String email);

    boolean existsByUsername(@NotBlank(message = "username is required") String username);

    boolean existsByUsernameAndIdNot(String username, String id);

}
