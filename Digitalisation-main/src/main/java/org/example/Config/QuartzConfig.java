/*package org.example.Config;


import org.example.jobs.UpdateRelationStatusJob;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuartzConfig {

    @Bean
    public JobDetail jobDetail() {
        return JobBuilder.newJob(UpdateRelationStatusJob.class)
                .withIdentity("updateRelationStatusJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger trigger(JobDetail jobDetail) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity("updateRelationStatusTrigger")
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
//                        .withIntervalInHours(24)  // Exécute toutes les 24 heures
                        .withIntervalInMinutes(1)
                        .repeatForever())
                .build();
    }
}*/
