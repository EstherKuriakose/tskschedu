// src/utils/aiUtils.js

// Simple AI helper functions

// Heuristic-based priority prediction
export function predictPriority(title) {
  const lower = title.toLowerCase();

  if (lower.includes("urgent") || lower.includes("immediate") || lower.includes("asap")) {
    return "high";
  } else if (lower.includes("soon") || lower.includes("important")) {
    return "medium";
  } else {
    return "low";
  }
}

// Detect if a task with a similar title already exists
export function isDuplicateTask(title, existingTasks) {
  return existingTasks.some(task =>
    task.title.trim().toLowerCase() === title.trim().toLowerCase()
  );
}
