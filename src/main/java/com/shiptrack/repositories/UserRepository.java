package com.shiptrack.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shiptrack.models.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

}
