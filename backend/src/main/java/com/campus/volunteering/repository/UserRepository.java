package com.campus.volunteering.repository;

import com.campus.volunteering.model.Role;
import com.campus.volunteering.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByRollNumber(String rollNumber);

    boolean existsByEmail(String email);

    boolean existsByRollNumber(String rollNumber);

    List<User> findAllByRoleOrderByTotalVerifiedHoursDesc(Role role);

    List<User> findAllByRoleAndDepartmentOrderByTotalVerifiedHoursDesc(Role role, String department);

    @Query("SELECT u.department, SUM(u.totalVerifiedHours) FROM User u WHERE u.role = 'STUDENT' GROUP BY u.department")
    List<Object[]> findDepartmentAggregatedHours();
}
