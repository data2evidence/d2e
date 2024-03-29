import enum

class Service(enum.Enum):
    NIFI = 'nifi'
    NIFI_REGISTRY = 'registry'

    def is_valid_enum_name(value):
        if type(value) is not type(Service.NIFI):
            raise TypeError('Value is not Enum type of Service') 

    def is_valid_enum_value(value):
        if (value in [i.value for i in Service]) == False:
            raise TypeError(f'Service value must be either {[i.value for i in Service]}') 

class NifiAccessPolicyAction(enum.Enum):
    READ = 'read'
    WRITE = 'write'

    def is_valid_enum_name(value):
        if type(value) is not type(NifiAccessPolicyAction.READ):
            raise TypeError('Value is not Enum type of NifiAccessPolicyAction') 

    def is_valid_enum_value(value):
        if (value in [i.value for i in NifiAccessPolicyAction]) == False:
            raise TypeError(f'NifiAccessPolicyAction value must be either {[i.value for i in NifiAccessPolicyAction]}') 

class NifiAccessPolicyResource(enum.Enum):
    FLOW = '/flow'
    CONTROLLER = '/controller'
    PROVENANCE = '/provenance'
    POLICIES = '/policies'
    USER_AND_USER_GROUP = '/tenants'
    SYSTEM_DIAGNOSTICS = '/system'
    PROXY_USER_REQUESTS = '/proxy'
    ACCESS_COUNTERS = '/counters'

    def is_valid_enum_name(value):
        if type(value) is not type(NifiAccessPolicyResource.FLOW):
            raise TypeError('Value is not Enum type of NifiAccessPolicyResource') 

    def is_valid_enum_value(value):
        if (value in [i.value for i in NifiAccessPolicyResource]) == False:
            raise TypeError(f'NifiAccessPolicyResource value must be either {[i.value for i in NifiAccessPolicyResource]}') 

class NifiProcessGroupAccessPolicyResource(enum.Enum):
    COMPONENT = '/process-groups'
    OPERATION_COMPONENT = '/operation/process-groups'
    VIEW_PROVENANCE = '/provenance-data/process-groups'
    DATA = '/data/process-groups'
    POLICIES = '/policies/process-groups'

    def is_valid_enum_name(value):
        if type(value) is not type(NifiProcessGroupAccessPolicyResource.COMPONENT):
            raise TypeError('Value is not Enum type of NifiProcessGroupAccessPolicyResource') 

    def is_valid_enum_value(value):
        if (value in [i.value for i in NifiProcessGroupAccessPolicyResource]) == False:
            raise TypeError(f'NifiProcessGroupAccessPolicyResource value must be either {[i.value for i in NifiProcessGroupAccessPolicyResource]}') 

class NifiRegistryResourcePolicyAction(enum.Enum):
    READ = 'read'
    WRITE = 'write'
    DELETE = 'delete'

    def is_valid_enum_name(value):
        if type(value) is not type(NifiRegistryResourcePolicyAction.READ):
            raise TypeError('Value is not Enum type of NifiRegistryResourcePolicyAction') 

    def is_valid_enum_value(value):
        if (value in [i.value for i in NifiRegistryResourcePolicyAction]) == False:
            raise TypeError(f'NifiRegistryResourcePolicyAction value must be either {[i.value for i in NifiRegistryResourcePolicyAction]}') 

class NifiRegistryResourcePolicy(enum.Enum):
    BUCKETS = '/buckets'
    USER_AND_USER_GROUP = '/tenants'
    POLICIES = '/policies'
    PROXY_USER_REQUESTS = '/proxy'

    def is_valid_enum_name(value):
        if type(value) is not type(NifiRegistryResourcePolicy.BUCKETS):
            raise TypeError('Value is not Enum type of NifiRegistryResourcePolicy')

    def is_valid_enum_value(value):
        if (value in [i.value for i in NifiRegistryResourcePolicy]) == False:
            raise TypeError(f'NifiRegistryResourcePolicy value must be either {[i.value for i in NifiRegistryResourcePolicy]}') 

class Intent(enum.Enum):
    ADD_MEMBER = 'add'
    REMOVE_MEMBER = 'remove'

    def is_valid_enum_name(value):
        if type(value) is not type(Intent.ADD_MEMBER):
            raise TypeError('Value is not Enum type of Intent')

    def is_valid_enum_value(value):
        if (value in [i.value for i in Intent]) == False:
            raise TypeError(f'Intent value must be either {[i.value for i in Intent]}') 
