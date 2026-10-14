package com.campus.volunteering.repository;

import com.campus.volunteering.model.ActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityEventRepository extends JpaRepository<ActivityEvent, Long> {

    List<ActivityEvent> findAllByOrderByEventDateDesc();

    List<ActivityEvent> findByClubId(Long clubId);
}
