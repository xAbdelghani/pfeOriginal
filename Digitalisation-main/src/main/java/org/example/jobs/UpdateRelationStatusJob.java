package org.example.jobs;

import org.example.service.CompagniePointVenteService;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UpdateRelationStatusJob implements Job {

    @Autowired
    private CompagniePointVenteService compagniePointVenteService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        //compagniePointVenteService.updateRelationStatuses();
    }
}
