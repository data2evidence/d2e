## Test case descriptions for Configuration Applications
### chp_ps_validation_activation_test.har
#### Description
This test case measures the end-to-end execution times for the Patient Summary Configuration application. This includes loading the existing configurations, create, validate and activate a new configuration and deleting it afterwards.

#### Execution Steps
- Pre recording steps
  - Open the Patient Summary Configuration and open the import dialog
    - this step should load all UI files, therefore the recorded har file will be smaller
  - Preview the Demo Configuration and copy the content to the clipboard
  - Return to FLP
- Recording steps
  - Open the Patient Summary Configuration
  - Create a new configuration by importing the configuration copied in the pre recording steps
  - Name the configuration
  - Validate the configuration
  - Activate the configuration
  - Delete the configuration

#### Measured actions
- Get the current configurations for Patient Summary
- Get the list of lane colors
- Get the Demo Configuration
- Get the configuration template data
- Validating a configuration
- Activating a configuration
- Deletion of a configuration

#### Test Case Details
- App User: HPH_ADMIN
- User Type: Analytics Platform Administrator
- Query Types:
  - xsjs requests in to `config.xsjs`
- Max execution times:
  - cached: 5s
  - non-cached: 5s
