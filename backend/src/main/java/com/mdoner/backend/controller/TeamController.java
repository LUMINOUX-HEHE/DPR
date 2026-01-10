package com.mdoner.backend.controller;

import com.mdoner.backend.entity.Team;
import com.mdoner.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teams")
@CrossOrigin(origins = "*")
public class TeamController {

    private final TeamRepository repository;

    @Autowired
    public TeamController(TeamRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Team> getAllTeams() {
        return repository.findAll();
    }

    @PostMapping
    public Team createTeam(@RequestBody Team team) {
        return repository.save(team);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable UUID id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
