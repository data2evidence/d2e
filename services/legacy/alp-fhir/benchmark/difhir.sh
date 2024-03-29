#!/bin/bash

practitioners="./practitioners"
capabilitystatement="./capability-statement.json"
json_file="./patient-644201.fhir-bundle.01.json"
url="http://localhost:8081/fhir/TEST_FHIR/fhir"

# Setup 
echo "Create Persistency by CapabilityStatement"
response=$(curl -X POST -H "Content-Type: application/json" -d "@$capabilitystatement" "$url"/CapabilityStatement)
echo "$response"

for practitioner in "$practitioners"/*.json; do
    echo "Sending POST request for $practitioner..."
    response=$(curl -X POST -H "Content-Type: application/json" -d "@$practitioner" "$url")
    echo "$response"
done

response=$(curl -X POST -H "Content-Type: application/json" -d "@$json_file" "$url")
if [ $? -eq 0 ]; then
    echo "POST request successful for $json_file"
    echo "$response"
else
    echo "Error sending POST request for $json_file"
fi

echo "------------------------"
