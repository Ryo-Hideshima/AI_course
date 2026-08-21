package com.example.taskboard.controller;

import com.example.taskboard.dto.MoveRequest;
import com.example.taskboard.dto.TaskRequest;
import com.example.taskboard.entity.Task;
import com.example.taskboard.repository.TaskRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

  private final TaskRepository taskRepository;

  public TaskController(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  @GetMapping
  public List<Task> list(@RequestParam(required = false) String status) {
    if (status != null) {
      return taskRepository.findByStatus(status);
    }
    return taskRepository.findAll();
  }

  @PostMapping
  public Task create(@Valid @RequestBody TaskRequest request) {
    Task task = new Task();
    applyRequest(task, request);
    task.setPosition(taskRepository.findByStatus(request.status()).size());
    return taskRepository.save(task);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Task> update(
      @PathVariable Long id, @Valid @RequestBody TaskRequest request) {
    return taskRepository
        .findById(id)
        .map(
            task -> {
              applyRequest(task, request);
              return ResponseEntity.ok(taskRepository.save(task));
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PutMapping("/{id}/move")
  public ResponseEntity<Task> move(@PathVariable Long id, @Valid @RequestBody MoveRequest request) {
    return taskRepository
        .findById(id)
        .map(
            task -> {
              List<Task> columnTasks = taskRepository.findByStatusOrderByPosition(request.status());
              columnTasks.removeIf(t -> t.getId().equals(id));

              int insertAt = columnTasks.size();
              if (request.beforeTaskId() != null) {
                for (int i = 0; i < columnTasks.size(); i++) {
                  if (columnTasks.get(i).getId().equals(request.beforeTaskId())) {
                    insertAt = i;
                    break;
                  }
                }
              }
              columnTasks.add(insertAt, task);

              task.setStatus(request.status());
              for (int i = 0; i < columnTasks.size(); i++) {
                columnTasks.get(i).setPosition(i);
              }
              taskRepository.saveAll(columnTasks);
              return ResponseEntity.ok(task);
            })
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    if (!taskRepository.existsById(id)) {
      return ResponseEntity.notFound().build();
    }
    taskRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  private void applyRequest(Task task, TaskRequest request) {
    task.setTitle(request.title());
    task.setDescription(request.description());
    task.setPriority(request.priority());
    task.setDueDate(request.dueDate());
    task.setStatus(request.status());
  }
}
