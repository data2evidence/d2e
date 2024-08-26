
from sqlalchemy import text, MetaData, inspect, Table, select
from datetime import datetime
from utils.types import DatabaseDialects, UserType
from utils.DBUtils import DBUtils


class UserDao(DBUtils):
    def __init__(self, use_cache_db: bool, database_code: str, schema_name: str):
        super().__init__(use_cache_db=use_cache_db, database_code=database_code)
        self.schema_name = schema_name
        self.db_dialect = self.get_database_dialect()

        if self.use_cache_db:
            self.engine = self.create_database_engine(schema_name=self.schema_name)
        else:
            self.engine = self.create_database_engine(user_type=UserType.ADMIN_USER)
            
        self.metadata = MetaData(schema_name)  # sql.MetaData()
        self.inspector = inspect(self.engine)    
        self.read_user = self.get_tenant_configs().get("readUser")
        self.read_role = self.get_tenant_configs().get("readRole")


    def check_user_exists(self, user: str) -> bool:
        with self.engine.connect() as connection:
            if self.db_dialect == DatabaseDialects.POSTGRES:
                select_stmt = text("select * from pg_user where usename = :x")
                print(f"Executing check user exists statement..")
                res = connection.execute(select_stmt, {"x": user}).fetchall()
            elif DatabaseDialects.HANA:
                schema_name = "SYS"
                self.metadata = MetaData(schema=schema_name)
                table = Table("USERS".casefold(), self.metadata,
                              autoload_with=connection)
                user_col = getattr(table.c, "USER_NAME".casefold())
                select_stmt = select(table).where(user_col == user)
                print(f"Executing check user exists statement..")
                res = connection.execute(select_stmt).fetchall()
            if res == []:
                return False
            else:
                return True


    def check_role_exists(self, role_name: str) -> bool:
        with self.engine.connect() as connection:
            if self.db_dialect == DatabaseDialects.POSTGRES:
                select_stmt = text("select * from pg_roles where rolname = :x")
                print(f"Executing check role exists statement..")
                res = connection.execute(
                    select_stmt, {"x": role_name}).fetchall()
            elif DatabaseDialects.HANA:
                schema_name = "SYS"
                self.metadata = MetaData(schema=schema_name)
                table = Table("ROLES".casefold(), self.metadata,
                              autoload_with=connection)
                role_col = getattr(table.c, "ROLE_NAME".casefold())
                select_stmt = select(table).where(role_col == role_name)
                print(f"Executing check role exists statement..")
                res = connection.execute(select_stmt).fetchall()
            if res == []:
                return False
            else:
                return True

    def create_read_role(self, role_name: str):
        match self.db_dialect:
            case DatabaseDialects.POSTGRES:
                create_role_stmt = text(f'CREATE ROLE {role_name}')
            case DatabaseDialects.HANA:
                create_role_stmt = text(
                    f'CREATE ROLE {role_name} NO GRANT TO CREATOR')
        with self.engine.connect() as connection:
            print("Executing create read role statement..")
            create_role_res = connection.execute(
                create_role_stmt)
            connection.commit()
            print(f"{role_name} role Created Successfully")

    def create_user(self, user: str, password: str = None):
        if user == self.read_user:
            password = self.__extract_database_credentials().get("readPassword")
        else:
            raise ValueError("Password cannot be empty")
        
        match self.db_dialect:
            case DatabaseDialects.POSTGRES:
                create_user_stmt = text(
                    f'CREATE USER {user} WITH PASSWORD "{password}"')
            case DatabaseDialects.HANA:
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
        match self.db_dialect:
            case DatabaseDialects.POSTGRES:
                grant_read_stmt = text(f"""
                    GRANT USAGE ON SCHEMA {self.schema_name} TO {role_name};
                    GRANT SELECT ON ALL TABLES IN SCHEMA {self.schema_name} TO {role_name};
                    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA {self.schema_name} TO {role_name};
                    GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA {self.schema_name} TO {role_name};
                    GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA {self.schema_name} TO {role_name};
                    ALTER DEFAULT PRIVILEGES IN SCHEMA {self.schema_name} GRANT SELECT ON TABLES TO {role_name};
                    ALTER DEFAULT PRIVILEGES IN SCHEMA {self.schema_name} GRANT USAGE, SELECT ON SEQUENCES TO {role_name};
                    ALTER DEFAULT PRIVILEGES IN SCHEMA {self.schema_name} GRANT EXECUTE ON FUNCTIONS TO {role_name};""")
            case DatabaseDialects.HANA:
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
                raise e
            else:
                print(
                    f"Granted cohort and cohort definition Write privileges Successfully")
