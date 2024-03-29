export class User {
    constructor(private user = "TEST_USER") {}

    public getUser() {
        // Tests will not initialize user, because mostly user is not used.
        // Just as a precautionary measure, If user is null then returning some fixed value for tests.
        return (this.user) ? this.user : "TEST_USER";
    }

    public getSupportedLanguages() {
        return [];
    }
}
