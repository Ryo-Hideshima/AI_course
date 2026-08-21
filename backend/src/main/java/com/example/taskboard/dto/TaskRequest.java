package com.example.taskboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record TaskRequest(
    @NotBlank(message = "タイトルは必須です") String title,
    String description,
    @Pattern(regexp = "low|medium|high", message = "優先度はlow/medium/highのいずれかです") String priority,
    LocalDate dueDate,
    @NotBlank(message = "ステータスは必須です")
        @Pattern(regexp = "todo|doing|done", message = "ステータスはtodo/doing/doneのいずれかです")
        String status) {}
