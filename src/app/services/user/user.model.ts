export class User {
  public username: string = '';
  public password: string = '';
  public image?: string;
  public name?: string;
  public job_role?: string;
  public token?: string;
  public id?: number;

  constructor(obj?: any) {
    this.username = obj && obj.username || '';
    this.password = obj && obj.password || '';
    this.image = obj && obj.image || '';
    this.name = obj && obj.name || '';
    this.job_role = obj && obj.job_role || '';
    this.token = obj && obj.token || '';
    this.id = obj && obj.id || null;
  }
}
