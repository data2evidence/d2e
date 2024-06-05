from alpconnection.dbutils import GetDBConnection, get_db_svc_endpoint_dialect
from sqlalchemy import text, MetaData, inspect
from typing import List
from datetime import datetime


class UserDao():
    def __init__(self, database_code: str, schema_name: str, user_type: str):
        self.database_code = database_code
        self.schema_name = schema_name
        self.engine = GetDBConnection(database_code, user_type)
        self.metadata = MetaData(schema=schema_name)
        self.inspector = inspect(self.engine)
        self.dialect = get_db_svc_endpoint_dialect(self.database_code)

    # Formatted string version
    def check_user_exists(self, user: str) -> bool:
        match self.dialect:
            case 'postgres':
                select_stmt = text(
                    f"select * from pg_user where usename = '{user}'")
            case 'hana':
                select_stmt = text(
                    f"select * from sys.users where user_name = '{user}'")
        with self.engine.connect() as connection:
            print(f"Executing check user exists statement..")
            res = connection.execute(select_stmt).fetchall()
            if res == []:
                return False
            else:
                return True

    def check_role_exists(self, role_name: str) -> bool:
        match self.dialect:
            case 'postgres':
                select_stmt = text(
                    f"select * from pg_roles where rolname = '{role_name}'")
            case 'hana':
                select_stmt = text(
                    f"select * from sys.roles where role_name = '{role_name}'")
        with self.engine.connect() as connection:
            print(f"Executing check role exists statement..")
            res = connection.execute(select_stmt).fetchall()
            if res == []:
                return False
            else:
                return True

    def create_read_role(self, role_name: str):
        match self.dialect:
            case 'postgres':
                create_role_stmt = text(f'CREATE ROLE {role_name}')
            case 'hana':
                create_role_stmt = text(
                    f'CREATE ROLE {role_name} NO GRANT TO CREATOR')
        with self.engine.connect() as connection:
            print("Executing create read role statement..")
            create_role_res = connection.execute(
                create_role_stmt)
            connection.commit()
            print(f"{role_name} role Created Successfully")

    def create_user(self, user: str, password: str):
        match self.dialect:
            case 'postgres':
                create_user_stmt = text(
                    f'CREATE USER {user} WITH PASSWORD "{password}"')
            case 'hana':
                create_user_stmt = text(
                    f'CREATE USER {user} PASSWORD "{password}" NO FORCE_FIRST_PASSWORD_CHANGE')
        with self.engine.connect() as connection:
            print("Executing create user statement..")
            create_user_res = connection.execute(
                create_user_stmt)
            connection.commit()
            print(f"{user} User Created Successfully")

    def create_and_assign_role(self, user: str, role_name: str):
        with self.engine.connect() as connection:
            create_role_stmt = text(f"CREATE ROLE {role_name}")
            print("Executing create role statement..")
            create_role_res = connection.execute(
                create_role_stmt)
            print(f"{role_name} role Created Successfully")

            grant_role_stmt = text(f"GRANT {role_name} TO {user}")
            print("Executing grant role to user statement..")
            grant_role_res = connection.execute(
                grant_role_stmt, {"x": role_name, "y": user})
            connection.commit()
            print(f" {role_name} Role Granted to {user} User Successfully")

    def grant_read_privileges(self, role_name: str):
        match self.dialect:
            case 'postgres':
                grant_read_stmt = text(f"""
                    GRANT USAGE ON SCHEMA {self.schema_name} TO {role_name};
                    GRANT SELECT ON ALL TABLES IN SCHEMA {self.schema_name} TO {role_name};
                    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA {self.schema_name} TO {role_name};
                    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA {self.schema_name} TO {role_name};
                    GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA {self.schema_name} TO {role_name};
                    ALTER DEFAULT PRIVILEGES IN SCHEMA {self.schema_name} GRANT SELECT ON TABLES TO {role_name};
                    ALTER DEFAULT PRIVILEGES IN SCHEMA {self.schema_name} GRANT USAGE, SELECT ON SEQUENCES TO {role_name};
                    ALTER DEFAULT PRIVILEGES IN SCHEMA {self.schema_name} GRANT EXECUTE ON FUNCTIONS TO {role_name};""")
            case 'hana':
                grant_read_stmt = text(
                    f"GRANT SELECT, EXECUTE, CREATE TEMPORARY TABLE ON SCHEMA {self.schema_name} to {role_name}")
        with self.engine.connect() as connection:

            print("Executing grant read privilege statement..")
            grant_read_res = connection.execute(
                grant_read_stmt)
            connection.commit()
            print(f"Granted Read privileges Successfully")

    def grant_cohort_write_privileges(self, role_name: str):
        with self.engine.connect() as connection:
            grant_cohort_write_stmt = text(
                f"GRANT DELETE, INSERT, UPDATE ON {self.schema_name}.cohort TO {role_name}")
            grant_cohort_def_write_stmt = text(
                f"GRANT DELETE, INSERT, UPDATE ON {self.schema_name}.cohort_definition TO {role_name}")
            print("Executing grant cohort write privilege statement..")
            try:
                grant_cohort_write_res = connection.execute(
                    grant_cohort_write_stmt)
                grant_cohort_def_write_res = connection.execute(
                    grant_cohort_def_write_stmt)
                connection.commit()
            except Exception as e:
                print(f"e is {e}")
            else:
                print(
                    f"Granted cohort and cohort definition Write privileges Successfully")

    # Parameterized query
    '''
    def check_user_exists(self, user: str) -> bool:
        match self.dialect:
            case 'postgres':
                select_stmt = text(
                    "select * from pg_user where usename = :x")
            case 'hana':
                select_stmt = text(
                    "select * from sys.users where user_name = :x")
        with self.engine.connect() as connection:
            print(f"Executing check user exists statement..")
            res = connection.execute(select_stmt, {"x": user}).fetchall()
            if res == []:
                return False
            else:
                return True

    def check_role_exists(self, role_name: str) -> bool:
        match self.dialect:
            case 'postgres':
                select_stmt = text(
                    "select * from pg_roles where rolname = :x")
            case 'hana':
                select_stmt = text(
                    "select * from sys.roles where role_name = :x")
        with self.engine.connect() as connection:
            print(f"Executing check role exists statement..")
            res = connection.execute(select_stmt, {"x": role_name}).fetchall()
            if res == []:
                return False
            else:
                return True

    def create_read_role(self, role_name: str):
        match self.dialect:
            case 'postgres':
                create_role_stmt = text('CREATE ROLE :x')
            case 'hana':
                create_role_stmt = text('CREATE ROLE :x NO GRANT TO CREATOR')
        with self.engine.connect() as connection:
            print("Executing create read role statement..")
            create_role_res = connection.execute(
                create_role_stmt, {"x": role_name})
            connection.commit()
            print(f"{role_name} role Created Successfully")

    def create_user(self, user: str, password: str):
        with self.engine.connect() as connection:
            create_user_stmt = text(
                'CREATE USER :x PASSWORD ":y" NO FORCE_FIRST_PASSWORD_CHANGE')
            print("Executing create user statement..")
            create_user_res = connection.execute(
                create_user_stmt, {"x": user, "y": password})
            connection.commit()
            print(f"{user} User Created Successfully")

    def create_and_assign_role(self, user: str, role_name: str):
        with self.engine.connect() as connection:
            create_role_stmt = text("CREATE ROLE :x")
            print("Executing create role statement..")
            create_role_res = connection.execute(
                create_role_stmt, {"x": role_name})
            print(f"{role_name} role Created Successfully")
            grant_role_stmt = text("GRANT :x TO :y")
            print("Executing grant role to user statement..")
            grant_role_res = connection.execute(
                grant_role_stmt, {"x": role_name, "y": user})
            connection.commit()
            print(f" {role_name} Role Granted to {user} User Successfully")

    def grant_read_privileges(self, role_name: str):
        match self.dialect:
            case 'postgres':
                grant_read_stmt = text("""
                    GRANT USAGE ON SCHEMA :x TO :y;
                    GRANT SELECT ON ALL TABLES IN SCHEMA :x TO :y;
                    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA :x TO :y;
                    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA :x TO :y;
                    GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA :x TO :y;
                    ALTER DEFAULT PRIVILEGES IN SCHEMA :x GRANT SELECT ON TABLES TO :y;
                    ALTER DEFAULT PRIVILEGES IN SCHEMA :x GRANT USAGE, SELECT ON SEQUENCES TO :y;
                    ALTER DEFAULT PRIVILEGES IN SCHEMA :x GRANT EXECUTE ON FUNCTIONS TO :y;""")
            case 'hana':
                grant_read_stmt = text(
                    "GRANT SELECT, EXECUTE, CREATE TEMPORARY TABLE ON SCHEMA :x to :y")
        with self.engine.connect() as connection:

            print("Executing grant read privilege statement..")
            grant_read_res = connection.execute(
                grant_read_stmt, {"x": text(self.schema_name), "y": text(role_name)})
            connection.commit()
            print(f"Granted Read privileges Successfully")

    def grant_cohort_write_privileges(self, role_name: str):
        with self.engine.connect() as connection:
            grant_cohort_write_stmt = text(
                "GRANT DELETE, INSERT, UPDATE ON :x.cohort TO :y")
            grant_cohort_def_write_stmt = text(
                "GRANT DELETE, INSERT, UPDATE ON :x.cohort_definition TO :y")
            print("Executing grant cohort write privilege statement..")
            try:
                grant_cohort_write_res = connection.execute(
                    grant_cohort_write_stmt, {"x": self.schema_name, "y": role_name})
                grant_cohort_def_write_res = connection.execute(
                    grant_cohort_def_write_stmt, {"x": self.schema_name, "y": role_name})
                connection.commit()
            except Exception as e:
                print(f"e is {e}")
            else:
                print(
                    f"Granted cohort and cohort definition Write privileges Successfully")

    '''

    def grant_write_privileges(self):
        # not used
        pass

    def grant_admin_privileges(self):
        # used for create staging area
        pass

    def grant_all_privileges(self):
        # not used
        pass

    def create_role(self, role_name: str):
        # used for create staging area
        pass

    def assign_role(self):
        # used for create staging area
        pass
