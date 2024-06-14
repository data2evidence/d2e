# Fetch metadata for datasets

To fetch metadata for datasets, click the `Check for data model updates` button in the `Datasets` tab
<img width="1400" alt="Screenshot 2024-06-14 at 07 49 35" src="https://github.com/alp-os/d2e-dev-alicia/assets/110385419/d48512f1-e79a-407c-b103-f1605e2a57c7">


This should trigger a job to run in the background which will update the following metadata:
- Current Schema Version
- Latest Available Schema Version
- CDM Version (OMOP data models only)
- Patient Count (OMOP data models only)
- Entity Count Distribution (OMOP data models only)
- Total Entity Count (OMOP data models only)
![Screenshot 2024-06-14 at 09 36 34](https://github.com/alp-os/d2e-dev-alicia/assets/110385419/be3e8679-2a55-4c24-85b4-bc28072be77a)


Current Schema Version and Latest Available Schema Version are displayed on the datasets page
![Screenshot 2024-06-14 at 09 37 18](https://github.com/alp-os/d2e-dev-alicia/assets/110385419/a693dbfa-d2e9-41aa-82eb-59c82a3725fa)


For OMOP data models:
- The dataset will be displayed in the Researcher portal alongside an updated donut chart if data is present in the schema
- The donut chart is populated based on the Entity Count Distribution
- Total Subjects is based on the Patient Count
- This information can also be viewed in the Dataset Info tab

![Screenshot 2024-06-14 at 09 37 32](https://github.com/alp-os/d2e-dev-alicia/assets/110385419/c6073451-10b4-44ce-a810-30f55b89384f)
![Screenshot 2024-06-14 at 09 37 38](https://github.com/alp-os/d2e-dev-alicia/assets/110385419/0e48484b-0e67-48c7-9781-f757b4004f9c)
