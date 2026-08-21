package com.example.taskboard.repository;

import com.example.taskboard.entity.Task;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

  List<Task> findByStatus(String status);

  List<Task> findByStatusOrderByPosition(String status);
}
