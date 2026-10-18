package com.kerolos119.inkora.Utils;

import com.kerolos119.inkora.document.Users;
import com.kerolos119.inkora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component 
@RequiredArgsConstructor 
public class UserNameResolver {

    public static final String UNKNOWN = "Reader";

    private final UserRepository userRepository;
    

    public Map<String, String> namesOf(Collection<String> userId) {
        var ids = userId.stream().filter(Objects::nonNull).collect(Collectors.toSet());
        Map<String, String> names = new HashMap<>();
        if(ids.isEmpty()) return names;
        for(Users user :userRepository.findAllById(ids)) {
            names.put(user.getId(), user.getUsername());
        }
        return names;
    }

    public String nameOf(String userId) {
        return namesOf(List.of(userId)).getOrDefault(userId, UNKNOWN);
    }
}