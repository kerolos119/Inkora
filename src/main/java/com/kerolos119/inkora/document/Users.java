package com.kerolos119.inkora.document;


import com.kerolos119.inkora.model.Auditable;
import com.kerolos119.inkora.model.Role;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class Users extends Auditable {

        @Id
        private String id;

        @Indexed(unique = true)
        private String username;

        private String password;

        private String address;

        @Indexed(unique = true)
        private String phoneNumber;

        @Indexed(unique = true)
        private String email;

        private Role role;

        private String otpCode;

        private LocalDateTime otpExpiry;

}
