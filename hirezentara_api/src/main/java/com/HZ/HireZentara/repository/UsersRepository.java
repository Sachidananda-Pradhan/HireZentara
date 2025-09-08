package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.Users;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<Users,Integer> {

    Optional<Users> findByuserName(String userName);
}
