export class User {
  public id: string
  public username: string
  public idpUserId: string

  constructor({ id, username, idpUserId }: User) {
    this.id = id
    this.username = username
    this.idpUserId = idpUserId
  }
}
