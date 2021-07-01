package com.celonis.challenge.services;

import com.celonis.challenge.model.ProjectGenerationTask;
import com.celonis.challenge.model.ProjectGenerationTaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Component
public class CancelScheduleTask {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    private final ProjectGenerationTaskRepository projectGenerationTaskRepository;
    private final TaskService taskService;

    public CancelScheduleTask(ProjectGenerationTaskRepository projectGenerationTaskRepository, TaskService taskService) {
        this.projectGenerationTaskRepository = projectGenerationTaskRepository;
        this.taskService = taskService;
    }

    // 10:15 AM every Sunday
    @Scheduled(cron = "${cron.expression}")
    //@Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        System.out.println("Before:: " + this.taskService.listTasks().size());

                this.taskService.listTasks().stream()
                .filter(task -> Optional.ofNullable(task.getStorageLocation()).isPresent())
                       .forEach( x-> this.taskService.delete(x.getId()));
        System.out.println("After:: " + this.taskService.listTasks().size());
    }
}
