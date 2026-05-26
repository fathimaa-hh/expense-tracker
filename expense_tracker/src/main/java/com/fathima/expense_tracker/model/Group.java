package com.fathima.expense_tracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "groups_table")

public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String name;

    private String createdBy;

    private String members;

    public Group() {
    }

    public Group(
            String name,
            String createdBy,
            String members
    ) {
        this.name = name;
        this.createdBy = createdBy;
        this.members = members;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getMembers() {
        return members;
    }

    public void setMembers(String members) {
        this.members = members;
    }
}