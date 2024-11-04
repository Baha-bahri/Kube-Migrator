export interface Backup {
  back_id?: number;
  back_name: string;
  namespace_name: string;
  deploy: string;
  pv: string;
  pvc: string;
  key_backup: string;
  value: string;
  project_id: number;
}
