package com.celonis.challenge.services;

import com.celonis.challenge.exceptions.InternalException;
import com.celonis.challenge.exceptions.NotFoundException;
import com.celonis.challenge.model.ProjectGenerationTask;
import com.celonis.challenge.model.ProjectGenerationTaskRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.concurrent.*;

@Service
public class TaskService {

    private final ProjectGenerationTaskRepository projectGenerationTaskRepository;

    private final FileService fileService;
    private final Executor executor;

    private enum TaskStatus {Created, Executing, Finished, Cancelled}

    public TaskService(ProjectGenerationTaskRepository projectGenerationTaskRepository,
                       FileService fileService, Executor executor) {
        this.projectGenerationTaskRepository = projectGenerationTaskRepository;
        this.fileService = fileService;
        this.executor = executor;
    }


    public List<ProjectGenerationTask> listTasks() {
        return projectGenerationTaskRepository.findAll();
    }

    public ProjectGenerationTask createTask(ProjectGenerationTask projectGenerationTask) {
        projectGenerationTask.setId(null);
        projectGenerationTask.setCreationDate(new Date());
        projectGenerationTask.setTaskStatus(TaskStatus.Created.toString());
        return projectGenerationTaskRepository.save(projectGenerationTask);
    }

    public ProjectGenerationTask getTask(String taskId) {
        return get(taskId);
    }

    public ProjectGenerationTask update(String taskId, ProjectGenerationTask projectGenerationTask) {
        ProjectGenerationTask existing = get(taskId);
        existing.setCreationDate(projectGenerationTask.getCreationDate());
        existing.setName(projectGenerationTask.getName());
        existing.setTaskStatus(projectGenerationTask.getTaskStatus());
        existing.setFromCount(projectGenerationTask.getFromCount());
        existing.setToCount(projectGenerationTask.getToCount());
        existing.setUpdatedFromCount(projectGenerationTask.getUpdatedFromCount());
        return projectGenerationTaskRepository.save(existing);
    }

    public void delete(String taskId) {
        projectGenerationTaskRepository.delete(taskId);
    }

    public void executeTask(String taskId) {
        URL url = Thread.currentThread().getContextClassLoader().getResource("challenge.zip");
        if (url == null) {
            throw new InternalException("Zip file not found");
        }

        try {
            fileService.storeResult(taskId, url, TaskStatus.Finished.toString());
        } catch (Exception e) {
            throw new InternalException(e);
        }
    }

    private ProjectGenerationTask get(String taskId) {
        ProjectGenerationTask projectGenerationTask = projectGenerationTaskRepository.findOne(taskId);
        if (projectGenerationTask == null) {
            throw new NotFoundException();
        }
        return projectGenerationTask;
    }

    @Async
    public CompletableFuture<ProjectGenerationTask> incrementCount(ProjectGenerationTask projectGenerationTask) {
        // Run a task specified by a Supplier object asynchronously
        return CompletableFuture.supplyAsync(() -> {
            System.out.println("Thread Name:: " + Thread.currentThread().getName());
            System.out.println(projectGenerationTask.toString());
            int updatedValue = projectGenerationTask.getFromCount();
            String id = projectGenerationTask.getId();
            ProjectGenerationTask updatedTaskObject = projectGenerationTask;
            updatedTaskObject.setTaskStatus(projectGenerationTask.getTaskStatus());
            updatedTaskObject.setToCount(projectGenerationTask.getToCount());
            updatedTaskObject.setFromCount(projectGenerationTask.getFromCount());
            update(id, updatedTaskObject);
            try {
                while (updatedValue != projectGenerationTask.getToCount()
                        && !updatedTaskObject.getTaskStatus().equals(TaskStatus.Cancelled.toString())) {
                    updatedValue++;
                    updatedTaskObject = get(id);
                    updatedTaskObject.setUpdatedFromCount(updatedValue);
                    update(id, updatedTaskObject);
                    TimeUnit.SECONDS.sleep(1);
                    System.out.println("Status: " + updatedTaskObject.getTaskStatus() + " updatedCount:: " + updatedTaskObject.getUpdatedFromCount() );
                }
            } catch (InterruptedException e) {
                throw new IllegalStateException(e);
            }
            return updatedTaskObject;
        }, executor)
        .exceptionally(ex -> {
            System.out.println("Oops! We have an exception - " + ex.getMessage());
            return null;
        });
    }

    public void finalExecution(ProjectGenerationTask projectGenerationTask) {
        CompletableFuture<ProjectGenerationTask> integerCompletableFuture = incrementCount(projectGenerationTask);

        CompletableFuture<ProjectGenerationTask> projectGenerationTaskCompletableFuture = integerCompletableFuture
                .thenApply(task -> {
                    if (!task.getTaskStatus().equals(TaskStatus.Cancelled.toString())) {
                        executeTask(task.getId());
                    }
                    return get(task.getId());
                });

        try {
            System.out.println(projectGenerationTaskCompletableFuture.get().getTaskStatus());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
    }

}
