package tn.esprit.kubemigrator.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tn.esprit.kubemigrator.entities.Backup;
import tn.esprit.kubemigrator.entities.Credential;
import tn.esprit.kubemigrator.entities.Project;
import tn.esprit.kubemigrator.entities.Velero;
import tn.esprit.kubemigrator.repositories.RepBackup;
import tn.esprit.kubemigrator.repositories.RepProject;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class AnsibleService implements IAnsibleService {

    private static final String PLAYBOOK_PATH = "ansible-project/create_backup";
    private static final String PLAYBOOK_CREATE_ALL_PATH = "ansible-project/create_backup_for_all";
    private static final String PLAYBOOK_CREATE_DEPLOY_PATH = "ansible-project/create_backup_for_deployments";
    private static final String PLAYBOOK_CREATE_PV_PVC_PATH = "ansible-project/create_backup_for_deployments";
    private static final String PLAYBOOK_MIGRATE_PATH = "ansible-project/migrate_backup";
    private static final String PLAYBOOK_DELETE_PATH = "ansible-project/delete_backup";
    private static final String PLAYBOOK_SSH_PATH = "ansible-project/ssh";
    private final RepProject projectRepository;
    private final RepBackup backupRepository;

    @Autowired
    public AnsibleService( RepProject projectRepository, RepBackup backupRepository ) {
        this.projectRepository = projectRepository;
        this.backupRepository=backupRepository;
    }

    @Override
    public String AnsibleCreateBackup(String dynamicHost, String user,Long project_id,String back_name,String context_name,String namespace_name) {
         Project project = projectRepository.findById(project_id).orElse(null);

        if (project == null) {
            return "Project not found";
        }
        Credential credential = project.getCredential();
        Velero velero = project.getVelero();

        
        try {
            String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars \"dynamic_host=%s user=%s azure_backup_ressource_group=%s azure_storage_account_id=%s blob_container=%s account_access_key=%s azure_cloud_name=%s velero_version=%s velero_bin=%s velero_url=%s velero_pkg=%s velero_pkg_bin=%s velero_pkg_ext=%s back_name=%s context_name=%s namespace_name=%s\"",
                dynamicHost, user, credential.getAzure_backup_ressource_group(), credential.getAzure_storage_account_id(), credential.getBlob_container(), credential.getAccount_access_key(), credential.getAzure_cloud_name(),
                velero.getVelero_version(), velero.getVelero_bin(), velero.getVelero_url(), velero.getVelero_pkg(), velero.getVelero_pkg_bin(), velero.getVelero_pkg_ext(), back_name, context_name, namespace_name);

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
            processBuilder.directory(new java.io.File(PLAYBOOK_PATH));
            Process process = processBuilder.start();
            process.waitFor();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append("ERROR: ").append(line).append("\n");
                }
            }
            return output.toString();

        }catch (Exception e) {
            e.printStackTrace();
            return "Error running playbook: " + e.getMessage();
        }
    }
    @Override
    public String migrateBackup(String dynamicHost, String user, Long back_id, String context_name) {
        Backup backup = backupRepository.findById(back_id).orElse(null);

        if (backup == null) {
            return "Backup not found";
        }

        Credential credential = backup.getProject().getCredential();
        Velero velero = backup.getProject().getVelero();
        String back_name = backup.getBack_name();

        try {
            String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars \"dynamic_host=%s user=%s azure_backup_ressource_group=%s azure_storage_account_id=%s blob_container=%s account_access_key=%s azure_cloud_name=%s velero_version=%s velero_bin=%s velero_url=%s velero_pkg=%s velero_pkg_bin=%s velero_pkg_ext=%s back_name=%s context_name=%s\"",
                dynamicHost, user, credential.getAzure_backup_ressource_group(), credential.getAzure_storage_account_id(), credential.getBlob_container(), credential.getAccount_access_key(), credential.getAzure_cloud_name(),
                velero.getVelero_version(), velero.getVelero_bin(), velero.getVelero_url(), velero.getVelero_pkg(), velero.getVelero_pkg_bin(), velero.getVelero_pkg_ext(), back_name, context_name);

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
            processBuilder.directory(new java.io.File(PLAYBOOK_MIGRATE_PATH));
            Process process = processBuilder.start();
            process.waitFor();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append("ERROR: ").append(line).append("\n");
                }
            }
            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error running playbook: " + e.getMessage();
        }
    }
    @Override
    public String deleteBackup(String dynamicHost, String user, Long back_id, String context_name) {
        Backup backup = backupRepository.findById(back_id).orElse(null);

        if (backup == null) {
            return "Backup not found";
        }

        Credential credential = backup.getProject().getCredential();
        Velero velero = backup.getProject().getVelero();
        String back_name = backup.getBack_name();

        try {
            String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars \"dynamic_host=%s user=%s azure_backup_ressource_group=%s azure_storage_account_id=%s blob_container=%s account_access_key=%s azure_cloud_name=%s velero_version=%s velero_bin=%s velero_url=%s velero_pkg=%s velero_pkg_bin=%s velero_pkg_ext=%s back_name=%s context_name=%s\"",
                dynamicHost, user, credential.getAzure_backup_ressource_group(), credential.getAzure_storage_account_id(), credential.getBlob_container(), credential.getAccount_access_key(), credential.getAzure_cloud_name(),
                velero.getVelero_version(), velero.getVelero_bin(), velero.getVelero_url(), velero.getVelero_pkg(), velero.getVelero_pkg_bin(), velero.getVelero_pkg_ext(), back_name, context_name);

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
            processBuilder.directory(new java.io.File(PLAYBOOK_DELETE_PATH));
            Process process = processBuilder.start();
            process.waitFor();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append("ERROR: ").append(line).append("\n");
                }
            }
            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error running playbook: " + e.getMessage();
        }
    }

    @Override
    public String sshSetup(String ssh_key, String user) {
        try {
            String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars 'user=%s ssh_key=\"%s\"'", user,ssh_key.trim());

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
            processBuilder.directory(new java.io.File(PLAYBOOK_SSH_PATH));
            Process process = processBuilder.start();
            process.waitFor();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append("ERROR: ").append(line).append("\n");
                }
            }
            return output.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error running playbook: " + e.getMessage();
        }
    }

    public String AnsibleCreateBackupForAll(String dynamicHost, String user, Long project_id, String back_name,
            String context_name) {
        Project project = projectRepository.findById(project_id).orElse(null);

                if (project == null) {
                    return "Project not found";
                }
                Credential credential = project.getCredential();
                Velero velero = project.getVelero();
        
                
                try {
                    String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars \"dynamic_host=%s user=%s azure_backup_ressource_group=%s azure_storage_account_id=%s blob_container=%s account_access_key=%s azure_cloud_name=%s velero_version=%s velero_bin=%s velero_url=%s velero_pkg=%s velero_pkg_bin=%s velero_pkg_ext=%s back_name=%s context_name=%s\"",
                        dynamicHost, user, credential.getAzure_backup_ressource_group(), credential.getAzure_storage_account_id(), credential.getBlob_container(), credential.getAccount_access_key(), credential.getAzure_cloud_name(),
                        velero.getVelero_version(), velero.getVelero_bin(), velero.getVelero_url(), velero.getVelero_pkg(), velero.getVelero_pkg_bin(), velero.getVelero_pkg_ext(), back_name, context_name);
        
                    ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
                    processBuilder.directory(new java.io.File(PLAYBOOK_CREATE_ALL_PATH ));
                    Process process = processBuilder.start();
                    process.waitFor();
        
                    StringBuilder output = new StringBuilder();
                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            output.append(line).append("\n");
                        }
                    }
                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            output.append("ERROR: ").append(line).append("\n");
                        }
                    }
                    return output.toString();
        
                }catch (Exception e) {
                    e.printStackTrace();
                    return "Error running playbook: " + e.getMessage();
                }
       
    }
    public String AnsibleCreateBackupForDeploy(String dynamicHost, String user, Long project_id, String back_name,
    String context_name) {
Project project = projectRepository.findById(project_id).orElse(null);

        if (project == null) {
            return "Project not found";
        }
        Credential credential = project.getCredential();
        Velero velero = project.getVelero();

        
        try {
            String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars \"dynamic_host=%s user=%s azure_backup_ressource_group=%s azure_storage_account_id=%s blob_container=%s account_access_key=%s azure_cloud_name=%s velero_version=%s velero_bin=%s velero_url=%s velero_pkg=%s velero_pkg_bin=%s velero_pkg_ext=%s back_name=%s context_name=%s\"",
                dynamicHost, user, credential.getAzure_backup_ressource_group(), credential.getAzure_storage_account_id(), credential.getBlob_container(), credential.getAccount_access_key(), credential.getAzure_cloud_name(),
                velero.getVelero_version(), velero.getVelero_bin(), velero.getVelero_url(), velero.getVelero_pkg(), velero.getVelero_pkg_bin(), velero.getVelero_pkg_ext(), back_name, context_name);

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
            processBuilder.directory(new java.io.File(PLAYBOOK_CREATE_DEPLOY_PATH));
            Process process = processBuilder.start();
            process.waitFor();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append("ERROR: ").append(line).append("\n");
                }
            }
            return output.toString();

        }catch (Exception e) {
            e.printStackTrace();
            return "Error running playbook: " + e.getMessage();
        }

}

public String AnsibleCreateBackupForPvPvc(String dynamicHost, String user, Long project_id, String back_name,
    String context_name) {
Project project = projectRepository.findById(project_id).orElse(null);

        if (project == null) {
            return "Project not found";
        }
        Credential credential = project.getCredential();
        Velero velero = project.getVelero();

        
        try {
            String command = String.format("ansible-playbook -i ../inventory.ini main.yaml --extra-vars \"dynamic_host=%s user=%s azure_backup_ressource_group=%s azure_storage_account_id=%s blob_container=%s account_access_key=%s azure_cloud_name=%s velero_version=%s velero_bin=%s velero_url=%s velero_pkg=%s velero_pkg_bin=%s velero_pkg_ext=%s back_name=%s context_name=%s\"",
                dynamicHost, user, credential.getAzure_backup_ressource_group(), credential.getAzure_storage_account_id(), credential.getBlob_container(), credential.getAccount_access_key(), credential.getAzure_cloud_name(),
                velero.getVelero_version(), velero.getVelero_bin(), velero.getVelero_url(), velero.getVelero_pkg(), velero.getVelero_pkg_bin(), velero.getVelero_pkg_ext(), back_name, context_name);

            ProcessBuilder processBuilder = new ProcessBuilder("/bin/sh", "-c", command);
            processBuilder.directory(new java.io.File(PLAYBOOK_CREATE_PV_PVC_PATH));
            Process process = processBuilder.start();
            process.waitFor();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append("ERROR: ").append(line).append("\n");
                }
            }
            return output.toString();

        }catch (Exception e) {
            e.printStackTrace();
            return "Error running playbook: " + e.getMessage();
        }

}
}
