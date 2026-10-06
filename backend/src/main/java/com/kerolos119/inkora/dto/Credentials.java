package com.kerolos119.inkora.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Credentials {

    @NotEmpty
    @Email(message = "Invalid email format")
    private String email;

    @NotEmpty
    private String password;

}
