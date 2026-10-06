package com.programmershub.medad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.programmershub.medad.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UsersDto {

        @JsonProperty(access = JsonProperty.Access.READ_ONLY)
        private String id;

        @NotBlank(message = "username is required")
        private String username;

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank(message = "password is required")
        @Size(min = 8, message = "password must contain at least 8 characters")
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
                message = "password must contain uppercase, lowercase, number, and special character")
        private String password;

        @NotBlank(message = "address is required")
        private String address;

        @NotBlank(message = "phone number is  required")
        @Pattern(regexp = "^\\+?[1-9]\\d{7,14}$", message = "Invalid phone number")
        private String phoneNumber;

        @NotBlank(message = "email is required")
        @Email(message = "Invalid email format")
        private String email;

        @JsonProperty(access =  JsonProperty.Access.READ_ONLY)
        private Role role;

}
