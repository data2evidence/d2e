1. Run start minerva will start logto on container ports 3001 (API) and 3002 (ADMIN portal)
2. goto https://host.docker.internal:3002
3. create admin user with password when prompted
4. create APP -> On left menu `Applications` -> Create Application -> Under tradional web app -> Express backend
5. Create API Resources
	a. Toggle default button - MOST IMPORTANT!!
	b. goto permissions tab -> add `initial_admin`

6. Goto `Roles` on left menu
	a. Click `Create Role`
	b. Give role name and description as `initial admin`
	c. Assign the permission `initial_admin` to this role


7. Goto `User Management` on the left menu
	a. Add email and username -> click add user
	b. Copy password
	c. Then click `check user detail`
	d. click `Roles` tab and assign `initial admin` role

8. a. Goto `alp-data-node/services/logto-sample` 
   b. Update client id and secret
   c. Run `yarn && yarn start`

9. goto `http://localhost:8887` and click `sign-in` link

10. Enter username and password created in steps 7a and 7b

11. Click `Fetch access token` link

12. Copy the value of `accessToken` property and paste it in the placeholder in step 13 `<ACCESS_TOKEN>`


13. curl -v http://localhost:8887/protected \
  --header 'Authorization: Bearer <ACCESS_TOKEN>'

14. Run the curl command in the above step to get a successful jwt validation and response