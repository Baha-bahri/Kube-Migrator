package tn.esprit.kubemigrator.services;

public interface IAnsibleService {
    String AnsibleCreateBackup(String dynamicHost, String user,Long project_id,String back_name,String context_name,String namespace_name);
    String AnsibleCreateBackupForAll(String dynamicHost, String user,Long project_id,String back_name,String context_name);
    String AnsibleCreateBackupForDeploy(String dynamicHost, String user,Long project_id,String back_name,String context_name);
    String AnsibleCreateBackupForPvPvc(String dynamicHost, String user,Long project_id,String back_name,String context_name);
    String migrateBackup(String dynamicHost, String user, Long back_id, String context_name);
    String deleteBackup(String dynamicHost, String user, Long back_id, String context_name);
    String sshSetup(String ssh_key, String user);
}
