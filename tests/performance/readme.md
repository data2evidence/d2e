Performance tool

-	How does the tool work

1)It Reads the whole HAR file and create array of nodes that are relevent to user on the basis of user specified filter (eg analytics.xsjs or assignment.xsjs).
2)Than tool iterates the array created in above step, extract data(eg endpoint url,parameters, payload etc) from each element and posts a request to that specific endpoint (with same parameters and data as read by HAR file) and records the end to end time when response came.
3)The step 2 is performed number of times specified by user to get a good measure of average end to end time in cached mode.
4)Than tool iterates again for the whole array created in step 1, extract data(eg endpoint url,parameters, payload etc) from each element, Clear SQL PlAN CACHE, then posts a request to that specific endpoint again(with same parameters and data as read by HAR file) and records the end to end time when response came.
5)After recording the end to end time, tool queries the SQL_PLAN_CACHE for the queries generated against specific request and calculates time incured by each query and number of times each query is prepared and executed. This gives us the time spent on database operations by a request.
6)The step 4 is performed number of times specified by user to get a good measure of average end to end time in non cached mode. It has same iterations as for cached version.
7)After we have these 4 arrays of average time(cached),average time(non cached) and average time(On database) and Queries per request, the tool then process these arrays to generate deviations, averages, min and max etc and push the data in to hana database.

-	How do I trigger a performance measurement 

1)Login to your system in chrome browser and open developers tab, clean network history, then perform the actions you like to and save them as a har file.
2)Now open the user_config.json file and add details into it.
3)You have to specify har file name which you want to analyze in user_config.json.
4)Now open command line and Run command 'node performance_tool.js {{path of your user_config.json file without quotes as command line argument}}'
5)Tool start to process data and generate results and insert them into database(If the database dont exist on your system, tool creates the schema and tables). It takes time depends upon the size of HAR file.

-	Where do I find the results 

1)The results of the tool can be seen in schema created in above step and consumed as you implement. Also you can use test tool that lets you perform specific operations on created database and replay and request on run time actively.


-	How to rerun a file request 

1)To replay whole HAR file, use command node test_1.js {{path of your user_config.json file without quotes as command line argument}}.
2)To replay a single request, use command node test_2.js {{path of your user_config.json file without quotes as command line argument}}. This will show you the top 15 time consuming requests as a list with Request IDs. 
3)The tool then prompts an ID to enter which you want to rerun. You can select ID either from above list or from database's main table using RID column. 


-	How do I configure the tool 

1)host: name of your machine(read, write results, perform requests on the basis of this)
2)instance: your instance eg 00
3)user_http: username of role by whom u want to send request to end point eg alice, bob
4)password_http:password for above user
5)user_hdb: user which interacts with hana database, alice bob(end users dont give correct results)
6)password_hdb:password for database user
7)host_2,instance_2, user_hdb_2,password_hdb_2 are details if you want to save results of tool on some other machine as well(not used for requesting backend).
8)filter_tag: a regex in which you can specify which end points you want to analyze 
9)fold: to get a very good results in cached and non cached modes, we perform requests multiple(fold) times and calculates average of those because backend and database dont behave always same.
10)file: Har file you want to run which is saved from browser for current session. this is also the file name which you want to run again using test.js. 
11)"Max_cached_time": requests that have average time(cached) less than this time,
   "Max_noncached_time":requests that have average time(no cached) less than this time,
   "Max_cached_deviation":requests that have deviation(cached) less than this percent(value like 10.0),
   "Max_noncached_deviation":requests that have deviation(no cached) less than this percent(value like 10.0),
12)From above four, if you give 0 to all, all single request will be in result. Otherwise if you give value for certain element while keeping all other 0, only that element will be filtered out in result.


-	Database

1)Currently there are two tables in database, one is main table that stores every thing about a request like end to end times, database provcessing times etc. 
2)The second tables is queries table that stores top 3 queries that are generated at dabase against single backend request. The are mapped togather using RID in main table with ID in queries table using primary key constraint.
3)The queries table also stores number of times that specific query executed and prepared, average exececution time of that query and count of executions.
