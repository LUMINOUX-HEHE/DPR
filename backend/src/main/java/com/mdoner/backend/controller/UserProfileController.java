package com.mdoner.backend.controller;

import com.mdoner.backend.entity.UserProfile;
import com.mdoner.backend.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileRepository repository;

    @Autowired
    public UserProfileController(UserProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<UserProfile> getAllUsers() {
        return repository.findAll();
    }

    @PostMapping
    public UserProfile createUser(@RequestBody UserProfile user) {
        return repository.save(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserById(@PathVariable UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserProfile> getUserByUsername(@PathVariable String username) {
        return repository.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
