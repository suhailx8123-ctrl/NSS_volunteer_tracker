package com.campus.volunteering.repository;

import com.campus.volunteering.model.ClubCategory;
import com.campus.volunteering.model.ClubOrUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubOrUnitRepository extends JpaRepository<ClubOrUnit, Long> {

    Optional<ClubOrUnit> findByUnitCode(String unitCode);

    List<ClubOrUnit> findByCategory(ClubCategory category);
}
