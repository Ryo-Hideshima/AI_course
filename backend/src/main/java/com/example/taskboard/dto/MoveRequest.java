package com.example.taskboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record MoveRequest(
    @NotBlank(message = "ステータスは必須です")
        @Pattern(regexp = "todo|doing|done", message = "ステータスはtodo/doing/doneのいずれかです")
        String status,
    Long beforeTaskId) {}
