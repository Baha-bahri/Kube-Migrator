package tn.esprit.kubemigrator.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tn.esprit.kubemigrator.services.AnsibleService;

@RestController
@RequestMapping("/ansible")
@CrossOrigin(origins = "*")
public class AnsibleController {

    @Autowired
    private AnsibleService ansibleService;

    @PostMapping("/create-backup")
    public ResponseEntity<String> AnsibleCreateBackup(@RequestParam String dynamicHost, @RequestParam String user, @RequestParam Long project_id, @RequestParam String back_name, @RequestParam String context_name, @RequestParam String namespace_name) {
        String result = ansibleService.AnsibleCreateBackup(dynamicHost, user, project_id, back_name, context_name, namespace_name);
        return processAnsibleResult(result);
    }

    @PostMapping("/create-backup-for-all")
    public ResponseEntity<String> AnsibleCreateBackupForAll(@RequestParam String dynamicHost, @RequestParam String user, @RequestParam Long project_id, @RequestParam String back_name, @RequestParam String context_name) {
        String result = ansibleService.AnsibleCreateBackupForAll(dynamicHost, user, project_id, back_name, context_name);
        return processAnsibleResult(result);
    }

    @PostMapping("/create-backup-for-deploy")
    public ResponseEntity<String> AnsibleCreateBackupForDeploy(@RequestParam String dynamicHost, @RequestParam String user, @RequestParam Long project_id, @RequestParam String back_name, @RequestParam String context_name) {
        String result = ansibleService.AnsibleCreateBackupForDeploy(dynamicHost, user, project_id, back_name, context_name);
        return processAnsibleResult(result);
    }

    @PostMapping("/create-backup-for-pv-pvc")
    public ResponseEntity<String> AnsibleCreateBackupForPvPvc(@RequestParam String dynamicHost, @RequestParam String user, @RequestParam Long project_id, @RequestParam String back_name, @RequestParam String context_name) {
        String result = ansibleService.AnsibleCreateBackupForPvPvc(dynamicHost, user, project_id, back_name, context_name);
        return processAnsibleResult(result);
    }

    @PostMapping("/migrate-backup")
    public ResponseEntity<String> migrateBackup(@RequestParam String dynamicHost, @RequestParam String user, @RequestParam Long back_id, @RequestParam String context_name) {
        String result = ansibleService.migrateBackup(dynamicHost, user, back_id, context_name);
        return processAnsibleResult(result);
    }

    @PostMapping("/delete-backup")
    public ResponseEntity<String> deleteBackup(@RequestParam String dynamicHost, @RequestParam String user, @RequestParam Long back_id, @RequestParam String context_name) {
        String result = ansibleService.deleteBackup(dynamicHost, user, back_id, context_name);
        return processAnsibleResult(result);
    }

    private ResponseEntity<String> processAnsibleResult(String result) {
        if (result.contains("ERROR: [WARNING]: Could not match supplied host pattern"))
            return new ResponseEntity<>(result, HttpStatus.FORBIDDEN);

        Pattern failedPattern = Pattern.compile("failed=\\d+");
        Matcher failedMatcher = failedPattern.matcher(result);

        Pattern unreachPattern = Pattern.compile("unreachable=\\d+");
        Matcher unreachMatcher = unreachPattern.matcher(result);

        List<String> failedParts = new ArrayList<>();
        List<String> unreachParts = new ArrayList<>();

        while (failedMatcher.find()) {
            failedParts.add(failedMatcher.group());
        }

        while (unreachMatcher.find()) {
            unreachParts.add(unreachMatcher.group());
        }

        for (String part : failedParts) {
            if (!part.equals("failed=0"))
                return new ResponseEntity<>(result, HttpStatus.EXPECTATION_FAILED);
        }

        for (String part : unreachParts) {
            if (!part.equals("unreachable=0"))
                return new ResponseEntity<>(result, HttpStatus.GATEWAY_TIMEOUT);
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @PostMapping("/ssh-setup")
    public String sshSetup(@RequestParam String ssh_key, @RequestParam String user) {
        return ansibleService.sshSetup(ssh_key, user);
    }
}