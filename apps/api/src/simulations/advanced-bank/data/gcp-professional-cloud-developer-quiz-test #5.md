# gcp-professional-cloud-developer-quiz-test #5

## Question 1

**Domain:** Building and testing applications

**Question:** Your team has deployed a new Cloud Run revision tagged 'green' and completed initial testing through the tagged URL. You now want to begin a canary rollout by sending 10% of production traffic to the new revision while the remaining traffic continues to the current revision. Which command should you use?

**Correct answer:** A. gcloud run services update-traffic myservice --to-tags green=10

**Options:**

- **A.** gcloud run services update-traffic myservice --to-tags green=10 — _correct answer_
- **B.** gcloud run deploy myservice --image IMAGE_URL --traffic-percent 10
- **C.** gcloud run services update-traffic myservice --to-revisions green=10
- **D.** gcloud run services update myservice --set-traffic green=10,current=90

## Question 2

**Domain:** Building and testing applications

**Question:** You deployed a new revision of your Cloud Run service using a canary deployment strategy. After gradually increasing traffic to 50%, you notice increased error rates in Cloud Logging. You need to immediately redirect all traffic back to the previous stable revision named 'myservice-00003-stable'. What is the fastest way to accomplish this rollback?

**Correct answer:** C. Run 'gcloud run services update-traffic myservice --to-revisions myservice-00003-stable=100' to immediately route all traffic to the stable revision.

**Options:**

- **A.** Deploy a new revision using the same container image as the stable revision and configure it to receive 100% traffic.
- **B.** Run 'gcloud run deploy myservice --rollback-to-revision myservice-00003-stable' to restore the previous revision configuration.
- **C.** Run 'gcloud run services update-traffic myservice --to-revisions myservice-00003-stable=100' to immediately route all traffic to the stable revision. — _correct answer_
- **D.** Delete the problematic new revision to force all traffic to the remaining stable revision.

## Question 3

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is deploying a new internal web application on Compute Engine behind an external HTTP(S) load balancer. You have enabled Identity-Aware Proxy (IAP) to protect the application. Security team members with the Project Owner IAM role report they cannot access the application, receiving an 'access denied' message. You need to grant them access while following Google-recommended best practices. What should you do?

**Correct answer:** A. Grant the Security team the IAP-secured Web App User role (roles/iap.httpsResourceAccessor) on the IAP-protected resource.

**Options:**

- **A.** Grant the Security team the IAP-secured Web App User role (roles/iap.httpsResourceAccessor) on the IAP-protected resource. — _correct answer_
- **B.** Grant the Security team the IAP Policy Admin role (roles/iap.admin) on the project to allow them to manage IAP policies and access the application.
- **C.** Add the Security team members' IP addresses to the load balancer's Cloud Armor security policy allowlist.
- **D.** Disable IAP temporarily and re-enable it after adding the Security team to the OAuth consent screen's authorized users list.

## Question 4

**Domain:** Deploying applications

**Question:** You are deploying a stateless application to GKE that requires configuration values from a ConfigMap. The configuration changes frequently, and your application must reflect these changes without Pod restarts. You want to implement the most efficient approach. How should you configure your application to consume the ConfigMap?

**Correct answer:** D. Mount the ConfigMap as a volume and implement logic in your application to watch for file changes in the mounted directory.

**Options:**

- **A.** Consume the ConfigMap as environment variables and configure a sidecar container to restart the main application when changes are detected.
- **B.** Use an init container to copy the ConfigMap values into shared storage before the main container starts.
- **C.** Store configuration in Memorystore for Redis and have your application poll for changes periodically.
- **D.** Mount the ConfigMap as a volume and implement logic in your application to watch for file changes in the mounted directory. — _correct answer_

## Question 5

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema to store time-series data from weather balloons that send measurements (temperature, pressure, humidity, altitude) every minute. Your queries typically retrieve all measurements for a specific balloon over a one-week period. The table will store data for hundreds of balloons over several years. What is the most efficient schema design approach?

**Correct answer:** D. Use a time bucket pattern with row keys containing location#balloon_id#week_number, storing each week's measurements for a balloon in columns within that row.

**Options:**

- **A.** Create one row per measurement with row keys in the format timestamp#balloon_id#measurement_type to enable fast time-based queries across all balloons.
- **B.** Store each measurement as a separate row with row key balloon_id#timestamp, creating a tall narrow table with one reading per row.
- **C.** Create separate tables for each balloon to isolate the data and simplify queries when retrieving measurements for a specific balloon.
- **D.** Use a time bucket pattern with row keys containing location#balloon_id#week_number, storing each week's measurements for a balloon in columns within that row. — _correct answer_

## Question 6

**Domain:** Integrating applications with Google Cloud services

**Question:** Your development team needs to track API response latency from your application logs. The latency values are captured in a field called 'response_time_ms' within the JSON payload of each log entry. You want to visualize the latency distribution as a heatmap in Cloud Monitoring. What should you do?

**Correct answer:** D. Create a distribution-type log-based metric with a value extractor that extracts the response_time_ms field from the log entry JSON payload.

**Options:**

- **A.** Create a counter-type log-based metric with multiple filters for different latency ranges and chart each counter separately.
- **B.** Create a log sink to route logs to BigQuery and use Looker Studio to create a heatmap visualization of the response_time_ms values.
- **C.** Create a counter-type log-based metric with a label extractor that extracts the response_time_ms field from the log entry JSON payload.
- **D.** Create a distribution-type log-based metric with a value extractor that extracts the response_time_ms field from the log entry JSON payload. — _correct answer_

## Question 7

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a real-time IoT analytics platform that stores sensor data from thousands of devices across multiple manufacturing facilities. Each device sends readings every second, and data needs to be stored in Cloud Bigtable. Your team has proposed using a row key format of 'timestamp#device_id' to allow easy retrieval of data by time range. During testing, you notice write latency is extremely high and inconsistent. What should you do to fix this issue?

**Correct answer:** C. Change the row key format to 'device_id#timestamp' to avoid hotspots by distributing writes across the table based on device identifiers.

**Options:**

- **A.** Add more nodes to the Bigtable cluster to handle the increased write throughput and reduce contention on a single node.
- **B.** Enable automatic sharding in the Bigtable instance configuration and set the shard count to match the number of devices.
- **C.** Change the row key format to 'device_id#timestamp' to avoid hotspots by distributing writes across the table based on device identifiers. — _correct answer_
- **D.** Create separate tables for each device and configure application logic to route writes to the appropriate table based on device ID.

## Question 8

**Domain:** Integrating applications with Google Cloud services

**Question:** You are operating a microservices application on GKE and want to be alerted when any container's CPU utilization exceeds 80% for 5 consecutive minutes. You need to configure this alerting policy using Google Cloud recommended practices. What should you do?

**Correct answer:** D. Create a metric-threshold alerting policy in Cloud Monitoring using the kubernetes.io/container/cpu/limit_utilization metric. Set the threshold to 0.8, and configure a retest window of 5 minutes.

**Options:**

- **A.** Create a custom metric by instrumenting your application code to emit CPU utilization data to Cloud Monitoring. Create an alerting policy with a 5-minute duration condition on this custom metric.
- **B.** Create a log-based alerting policy that parses container CPU metrics from Cloud Logging. Set the condition to trigger when parsed values exceed 0.8 for 5 minutes.
- **C.** Deploy Prometheus to your cluster and configure PromQL-based alerting rules directly in Prometheus. Use Alertmanager to send notifications when CPU exceeds 80%.
- **D.** Create a metric-threshold alerting policy in Cloud Monitoring using the kubernetes.io/container/cpu/limit_utilization metric. Set the threshold to 0.8, and configure a retest window of 5 minutes. — _correct answer_

## Question 9

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses Shared VPC with a host project containing the VPC network and multiple service projects running different workloads. You need to implement VPC Service Controls to protect Cloud Storage buckets in the service projects from data exfiltration. After configuring the perimeter with only the service projects, applications are experiencing connectivity issues when accessing Cloud Storage. What is the most likely cause of this issue?

**Correct answer:** B. The Shared VPC host project is not included in the same service perimeter as the service projects, causing network endpoints to appear as if they are outside the perimeter.

**Options:**

- **A.** The service perimeter is configured in enforced mode instead of dry run mode, which is blocking all traffic until the configuration is validated.
- **B.** The Shared VPC host project is not included in the same service perimeter as the service projects, causing network endpoints to appear as if they are outside the perimeter. — _correct answer_
- **C.** The VPC accessible services feature is enabled but Cloud Storage is not included in the allowed services list, blocking access to the service from within the perimeter.
- **D.** The Cloud Storage API has not been added to the list of restricted services in the perimeter configuration, causing the service to be inaccessible from within the perimeter.

## Question 10

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a payment processing application that runs on Cloud Run and uses multiple API keys stored in Secret Manager. The application reads the secrets at startup and caches them in memory. Your security team requires you to implement a strategy that allows quick rollback if a new API key causes issues in production. You want to follow Google-recommended best practices. How should you configure secret access in your application?

**Correct answer:** D. Reference secrets using explicit version numbers in your application configuration, and deploy updates to version numbers through your existing release process.

**Options:**

- **A.** Store multiple versions of the API key as separate secrets with version suffixes in their names, then update environment variables to point to the correct secret name.
- **B.** Reference secrets using the 'latest' alias so the application automatically picks up new secret versions without requiring redeployment.
- **C.** Create separate secrets for each environment (dev, staging, prod) and use the 'latest' alias in production for automatic updates.
- **D.** Reference secrets using explicit version numbers in your application configuration, and deploy updates to version numbers through your existing release process. — _correct answer_

## Question 11

**Domain:** Integrating applications with Google Cloud services

**Question:** You are monitoring a Memorystore for Redis instance that caches database query results for your web application. The system memory usage ratio has been steadily increasing and recently exceeded 80 percent. You need to take immediate action to prevent the instance from experiencing an out-of-memory condition while maintaining cache effectiveness. What should you do?

**Correct answer:** B. Lower the maxmemory-gb configuration limit to provide more overhead for system operations, and enable activedefrag to reduce memory fragmentation.

**Options:**

- **A.** Immediately scale up the Memorystore instance to a larger capacity tier to accommodate the growing memory usage.
- **B.** Lower the maxmemory-gb configuration limit to provide more overhead for system operations, and enable activedefrag to reduce memory fragmentation. — _correct answer_
- **C.** Export the current data to Cloud Storage using RDB backup and import it to a new instance with more memory capacity.
- **D.** Change the eviction policy from volatile-lru to allkeys-random to ensure that all keys can be evicted when memory is full.

## Question 12

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application on Cloud Run connects to a Cloud SQL for MySQL instance. During load testing, you discover that the application fails to connect when the Cloud Run service scales beyond 50 container instances due to exhausting the database's connection limit. You want to ensure the application can scale to handle traffic spikes while maintaining efficient database access. What should you do?

**Correct answer:** D. Configure each Cloud Run container to use a connection pool with a small pool size, and limit the maximum number of Cloud Run instances based on the database connection limits.

**Options:**

- **A.** Create multiple read replicas to distribute the connections from Cloud Run instances and use each replica's connection name in application configuration.
- **B.** Configure the Cloud SQL Auth Proxy to manage connection pooling and limit the total connections across all Cloud Run instances.
- **C.** Enable Managed Connection Pooling on the Cloud SQL instance and increase max_connections to match the expected scale of Cloud Run instances.
- **D.** Configure each Cloud Run container to use a connection pool with a small pool size, and limit the maximum number of Cloud Run instances based on the database connection limits. — _correct answer_

## Question 13

**Domain:** Deploying applications

**Question:** You are operating a production application on GKE. You need to be notified whenever error messages appear in your application's container logs. You want to configure alerting that evaluates individual log entries in real time. What should you do?

**Correct answer:** C. Create a log-based alerting policy in Cloud Logging with a filter that matches log entries containing error messages from your application containers.

**Options:**

- **A.** Create a user-defined log-based metric that counts error log entries, then create an alerting policy in Cloud Monitoring that triggers when the count exceeds a threshold.
- **B.** Create a SQL-based alerting policy in Cloud Logging that runs a query every minute to count error logs and triggers when the count is greater than zero.
- **C.** Create a log-based alerting policy in Cloud Logging with a filter that matches log entries containing error messages from your application containers. — _correct answer_
- **D.** Configure Pub/Sub to receive exported logs from Cloud Logging, then create a Cloud Run function that parses each log and sends notifications when errors are detected.

## Question 14

**Domain:** Deploying applications

**Question:** You need to configure your Cloud Run service to comply with VPC Service Controls for data exfiltration prevention. The service must route all outbound traffic through your VPC network using a Serverless VPC Access connector. Which combination of settings must you configure on the Cloud Run service?

**Correct answer:** B. Configure the VPC connector and set the vpc-egress setting to 'all-traffic' to route all outbound requests through the VPC network.

**Options:**

- **A.** Configure the ingress setting to 'internal-only' without configuring a VPC connector to restrict all network traffic.
- **B.** Configure the VPC connector and set the vpc-egress setting to 'all-traffic' to route all outbound requests through the VPC network. — _correct answer_
- **C.** Configure the VPC connector and set the vpc-egress setting to 'private-ranges-only' to prevent traffic from leaving the private network.
- **D.** Configure the VPC connector and disable the default run.app URL to prevent external network access.

## Question 15

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization has Compute Engine VMs without external IP addresses that developers need to access via SSH for troubleshooting. You want to provide secure SSH access without deploying bastion hosts or configuring VPN connections. The solution must enforce user authentication and allow fine-grained access control over which developers can access specific VMs. What should you do?

**Correct answer:** A. Enable IAP TCP forwarding and create a firewall rule allowing ingress from 35.235.240.0/20. Grant the IAP-Secured Tunnel User role to developers who need access to specific VMs.

**Options:**

- **A.** Enable IAP TCP forwarding and create a firewall rule allowing ingress from 35.235.240.0/20. Grant the IAP-Secured Tunnel User role to developers who need access to specific VMs. — _correct answer_
- **B.** Deploy a bastion host with an external IP address and configure firewall rules to allow SSH only from the bastion. Grant developers the Compute Instance Admin role on the bastion host.
- **C.** Configure OS Login on all VMs and create IAM policies to grant the Compute OS Login role to developers. Enable SSH-in-browser from the Google Cloud console.
- **D.** Configure Cloud NAT for the VPC network and grant developers the Compute Instance Admin role on the VMs they need to access.

## Question 16

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application creates Cloud Tasks to process customer subscription renewals. You want to prevent duplicate tasks from being created when your application retries after a network timeout during task creation. What should you do?

**Correct answer:** D. Specify an explicit task name using a hash of the subscription ID and renewal period when creating each task.

**Options:**

- **A.** Store task creation timestamps in Memorystore and check for duplicates before calling the CreateTask API.
- **B.** Configure the queue's maxAttempts to -1 to enable unlimited retries and rely on the target service to reject duplicates.
- **C.** Enable automatic deduplication on the Cloud Tasks queue and let Cloud Tasks generate unique task IDs.
- **D.** Specify an explicit task name using a hash of the subscription ID and renewal period when creating each task. — _correct answer_

## Question 17

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an API using API Gateway with a Cloud Run backend. You want to ensure that all API requests are authenticated with an API key before reaching your backend service. Which configuration should you add to your OpenAPI specification?

**Correct answer:** C. Add a securityDefinitions section with type 'apiKey', and reference it in a security section at the top level of the specification to apply API key validation to all paths.

**Options:**

- **A.** Create a separate Cloud Run function that validates API keys and configure API Gateway to call this function before routing to your main backend.
- **B.** Add a custom header validation rule in the x-google-backend extension that checks for the presence of an API key before routing to the backend.
- **C.** Add a securityDefinitions section with type 'apiKey', and reference it in a security section at the top level of the specification to apply API key validation to all paths. — _correct answer_
- **D.** Configure the Cloud Run service to reject requests without API keys by implementing authentication middleware in your application code.

## Question 18

**Domain:** Building and testing applications

**Question:** Your organization uses Cloud Build for CI/CD with automated integration testing. You want to enable concurrent execution of multiple independent test suites to reduce overall build time. Your build has four test steps: unit-tests, api-tests, ui-tests, and security-tests. The unit-tests must complete before other tests run, but the remaining three test suites can run concurrently. How should you configure your cloudbuild.yaml?

**Correct answer:** B. Assign id: 'unit-tests' to the unit test step. For each of the other three test steps, add waitFor: ['unit-tests'] to specify they should wait only for the unit tests to complete.

**Options:**

- **A.** Remove the waitFor field from all four test steps and rely on Cloud Build to automatically parallelize steps that do not have output dependencies on each other.
- **B.** Assign id: 'unit-tests' to the unit test step. For each of the other three test steps, add waitFor: ['unit-tests'] to specify they should wait only for the unit tests to complete. — _correct answer_
- **C.** Configure a separate Cloud Build trigger for each test suite and use Pub/Sub to coordinate their execution after the unit-tests trigger completes.
- **D.** Add waitFor: ['-'] to the api-tests, ui-tests, and security-tests steps to make them start immediately when the build begins alongside the unit tests.

## Question 19

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application using Firestore. Multiple users can edit the same document simultaneously. Your application needs to display real-time updates to users as other collaborators make changes and differentiate between newly created content, modifications, and deletions in the document. How should you implement the Firestore real-time listener to meet these requirements?

**Correct answer:** B. Use addSnapshotListener() on the document collection and iterate through snapshot.getDocumentChanges() to check each change's type property for ADDED, MODIFIED, or REMOVED values.

**Options:**

- **A.** Use addSnapshotListener() on the document collection and compare the current snapshot with the previous snapshot stored in memory to determine which documents changed.
- **B.** Use addSnapshotListener() on the document collection and iterate through snapshot.getDocumentChanges() to check each change's type property for ADDED, MODIFIED, or REMOVED values. — _correct answer_
- **C.** Use addSnapshotListener() with includeMetadataChanges option and filter documents where metadata.hasPendingWrites is false to identify server-confirmed changes.
- **D.** Implement polling with get() calls every 500 milliseconds and compare document versions using server timestamps to detect changes.

## Question 20

**Domain:** Integrating applications with Google Cloud services

**Question:** You manage a multi-region application deployed on GKE that uses Cloud SQL for PostgreSQL as its database. To improve read performance for users in a secondary region, you created a cross-region read replica. Your application needs to route read traffic to the replica while ensuring write operations go to the primary instance. You want to implement this with minimal application changes. What should you do?

**Correct answer:** B. Configure your application with two separate connection strings: one pointing to the primary instance for write operations and one pointing to the read replica for read operations.

**Options:**

- **A.** Create a Kubernetes Service with a custom endpoint that uses a traffic-splitting controller to route 80% of queries to the replica and 20% to the primary.
- **B.** Configure your application with two separate connection strings: one pointing to the primary instance for write operations and one pointing to the read replica for read operations. — _correct answer_
- **C.** Enable Managed Connection Pooling on both the primary and replica, then configure the pooler to detect SELECT statements and route them to the replica automatically.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar in each pod and configure it to automatically route reads and writes to the appropriate endpoints.

## Question 21

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is building an IoT application that collects sensor data from 50,000 devices every second. The data must be stored in Cloud Bigtable for real-time analytics. Each device sends readings with a unique device ID and timestamp. You need to design a row key that allows efficient querying of all readings for a specific device within a time range while avoiding hotspots. Which row key design should you use?

**Correct answer:** D. Use deviceId#timestamp as the row key, placing the high-cardinality device ID first followed by the timestamp.

**Options:**

- **A.** Use a hash of the timestamp as the row key prefix followed by the device ID to distribute writes evenly.
- **B.** Use a sequential auto-incrementing ID as the row key to ensure unique entries for each sensor reading.
- **C.** Use timestamp#deviceId as the row key, placing the timestamp first to enable efficient time-based queries.
- **D.** Use deviceId#timestamp as the row key, placing the high-cardinality device ID first followed by the timestamp. — _correct answer_

## Question 22

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your Cloud Run service and want to implement a canary deployment strategy. You need to deploy the new revision without affecting production traffic and then gradually shift traffic to it over several days while monitoring for issues. What sequence of commands should you use to deploy and initially test the new revision before migrating any production traffic?

**Correct answer:** C. Run 'gcloud run deploy myservice --image gcr.io/project/myimage:v2 --no-traffic --tag canary' to deploy the new revision without serving traffic, then test the revision at the tag-specific URL.

**Options:**

- **A.** Run 'gcloud run deploy myservice --image gcr.io/project/myimage:v2 --max-instances=1' to limit the new revision to one instance, then test it at the default service URL.
- **B.** Run 'gcloud run deploy myservice --image gcr.io/project/myimage:v2 --min-instances=0' to deploy the new revision with zero minimum instances, then test it at the default service URL.
- **C.** Run 'gcloud run deploy myservice --image gcr.io/project/myimage:v2 --no-traffic --tag canary' to deploy the new revision without serving traffic, then test the revision at the tag-specific URL. — _correct answer_
- **D.** Run 'gcloud run deploy myservice --image gcr.io/project/myimage:v2' followed by 'gcloud run services update-traffic myservice --to-revisions PREVIOUS=100' to immediately route traffic back to the previous revision.

## Question 23

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Cloud Run API service that performs short-lived background tasks after returning HTTP responses to users. When you test the service, you notice that background threads are not completing reliably. You want to ensure background tasks execute properly while keeping costs optimized. What should you do?

**Correct answer:** A. Configure the service with instance-based billing using the --no-cpu-throttling flag to allocate CPU for the entire lifecycle of each instance.

**Options:**

- **A.** Configure the service with instance-based billing using the --no-cpu-throttling flag to allocate CPU for the entire lifecycle of each instance. — _correct answer_
- **B.** Increase the maximum concurrency setting to 1000 so background threads have more CPU available during request processing.
- **C.** Set the minimum instances to 0 and enable startup CPU boost to ensure background threads complete during the startup period.
- **D.** Configure Cloud Tasks to process background work asynchronously instead of modifying Cloud Run CPU allocation settings.

## Question 24

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for an IoT application that ingests sensor data from thousands of devices. Each device sends readings every second with a timestamp. You need to store this data efficiently and ensure even distribution of writes across the cluster. Which row key design should you use?

**Correct answer:** A. Use device_id#timestamp as the row key, where device_id is a high-cardinality unique identifier for each sensor.

**Options:**

- **A.** Use device_id#timestamp as the row key, where device_id is a high-cardinality unique identifier for each sensor. — _correct answer_
- **B.** Use timestamp as the sole row key and create separate tables for each device to distribute the load.
- **C.** Use a sequential numeric ID generated by a counter service as the row key to guarantee uniqueness.
- **D.** Use timestamp#device_id as the row key to ensure time-series data is stored in chronological order for all devices.

## Question 25

**Domain:** Deploying applications

**Question:** You are developing a Cloud Run service that connects to a Cloud SQL database. The database password must be stored securely and made available to your application. Your security team requires that if the password is rotated, the application should be able to retrieve the new password without redeploying the service. What should you do?

**Correct answer:** A. Store the password in Secret Manager and configure Cloud Run to mount the secret as a volume. Have your application read the password from the mounted file path at the time of each database connection.

**Options:**

- **A.** Store the password in Secret Manager and configure Cloud Run to mount the secret as a volume. Have your application read the password from the mounted file path at the time of each database connection. — _correct answer_
- **B.** Store the password in Secret Manager and configure Cloud Run to expose the secret as an environment variable. Have your application read the password from the environment variable.
- **C.** Store the password as a plaintext environment variable in Cloud Run. Use Cloud KMS to decrypt the password in your application code before connecting to the database.
- **D.** Store the password in a Cloud Storage bucket and configure your application to read the file on each database connection. Grant the Cloud Run service account the Storage Object Viewer role.

## Question 26

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your development team uses Cloud Build to build container images from source code stored in a Cloud Source Repository. All resources are in projects protected by a VPC Service Controls perimeter. Cloud Build jobs are failing with VPC Service Controls violations. What should you do to enable Cloud Build to work within the VPC Service Controls perimeter?

**Correct answer:** C. Create a Cloud Build private pool with the egressOption set to NO_PUBLIC_EGRESS and configure the pool to use a VPC network inside the perimeter.

**Options:**

- **A.** Grant the Cloud Build service account the VPC Service Controls Admin role to bypass perimeter restrictions during build operations.
- **B.** Configure an ingress rule on the perimeter to allow the Cloud Build service account to access all restricted services within the perimeter.
- **C.** Create a Cloud Build private pool with the egressOption set to NO_PUBLIC_EGRESS and configure the pool to use a VPC network inside the perimeter. — _correct answer_
- **D.** Add the Cloud Build service agent's service account to an access level and associate it with the perimeter to grant the necessary permissions.

## Question 27

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application deployed on Cloud Run that logs response times in a textPayload field formatted as 'Request completed in 250ms'. You need to create a log-based metric that tracks the distribution of response times across all requests to create latency-based SLIs in Cloud Monitoring. What should you do?

**Correct answer:** C. Create a distribution log-based metric with a filter for your Cloud Run logs. Configure a value extractor that uses a regular expression to extract the numeric latency value from the textPayload field.

**Options:**

- **A.** Export all Cloud Run logs to BigQuery using a log sink. Create a scheduled query to calculate latency percentiles and write the results to a custom metric in Cloud Monitoring.
- **B.** Create a distribution log-based metric without a filter to capture all Cloud Run logs. Configure the metric to automatically detect and extract numeric values from log payloads.
- **C.** Create a distribution log-based metric with a filter for your Cloud Run logs. Configure a value extractor that uses a regular expression to extract the numeric latency value from the textPayload field. — _correct answer_
- **D.** Create a counter log-based metric with a filter for your Cloud Run logs. Add labels to categorize requests by different latency ranges to track response time distribution.

## Question 28

**Domain:** Deploying applications

**Question:** You have a microservices application running on GKE. Your development team reports that container logs appear with a plain text format in Cloud Logging, making it difficult to search for specific fields. You need to configure your application to output logs that can be easily filtered by custom fields in Cloud Logging while making minimal changes to your existing logging approach. What should you do?

**Correct answer:** C. Update your application to write logs as single-line serialized JSON objects to standard output, and include custom fields in the JSON structure.

**Options:**

- **A.** Install the Cloud Logging client library and configure your application to call the Cloud Logging API directly to write structured logs.
- **B.** Configure a custom Fluentd configuration file on each GKE node to parse the plain text logs and convert them to structured format before sending to Cloud Logging.
- **C.** Update your application to write logs as single-line serialized JSON objects to standard output, and include custom fields in the JSON structure. — _correct answer_
- **D.** Create a Cloud Logging sink that routes logs to BigQuery, then use BigQuery to parse the text logs into structured columns.

## Question 29

**Domain:** Building and testing applications

**Question:** Your team shares a development environment and you have been testing an application that accesses sensitive data using Application Default Credentials. You have finished testing and want to remove the local ADC credentials from your workstation for security reasons. What should you do?

**Correct answer:** C. Run gcloud auth application-default revoke to remove the local ADC credentials file and invalidate the associated refresh token.

**Options:**

- **A.** Delete the service account key file and unset the GOOGLE_APPLICATION_CREDENTIALS environment variable from your shell configuration.
- **B.** Run gcloud auth revoke to remove all local credentials including the ADC credentials used by client libraries from your workstation.
- **C.** Run gcloud auth application-default revoke to remove the local ADC credentials file and invalidate the associated refresh token. — _correct answer_
- **D.** Run gcloud config unset auth/impersonate_service_account to remove the impersonated service account configuration from your local environment.

## Question 30

**Domain:** Deploying applications

**Question:** You are deploying a web application on GKE and want to use a permanent static IP address for your external Ingress that persists across Ingress resource deletions. You have reserved a global static external IP address named 'my-web-address'. How should you configure your Ingress to use this static IP?

**Correct answer:** C. Add the annotation kubernetes.io/ingress.global-static-ip-name: 'my-web-address' to the Ingress manifest.

**Options:**

- **A.** Set the loadBalancerIP field in the Ingress spec to the actual IP address value.
- **B.** Add the annotation kubernetes.io/ingress.regional-static-ip-name: 'my-web-address' to the Ingress manifest.
- **C.** Add the annotation kubernetes.io/ingress.global-static-ip-name: 'my-web-address' to the Ingress manifest. — _correct answer_
- **D.** Add the annotation networking.gke.io/static-ip: 'my-web-address' to the Ingress manifest.

## Question 31

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on GKE needs to access a secret stored in Secret Manager. Following Google-recommended best practices for production workloads, how should you configure the application to reference the secret?

**Correct answer:** B. Reference the secret by its specific version number. Deploy updates to version numbers using your existing release processes, reading the secret version at application startup.

**Options:**

- **A.** Export the secret value to an environment variable at pod startup using an init container. Reference the environment variable from the main application container.
- **B.** Reference the secret by its specific version number. Deploy updates to version numbers using your existing release processes, reading the secret version at application startup. — _correct answer_
- **C.** Store a copy of the secret in a Kubernetes Secret object. Configure the application to read from the Kubernetes Secret for faster access and to avoid dependency on external services.
- **D.** Reference the secret using the 'latest' alias. This ensures the application automatically receives updated secret values without requiring redeployment or configuration changes.

## Question 32

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to access an API key stored in Secret Manager. You need the secret to be available at a file path for a legacy library that reads credentials from disk. You also want to be able to read updated secret values without redeploying the service. What should you do?

**Correct answer:** A. Mount the secret as a volume using the 'latest' version alias and read the file at runtime when credentials are needed.

**Options:**

- **A.** Mount the secret as a volume using the 'latest' version alias and read the file at runtime when credentials are needed. — _correct answer_
- **B.** Expose the secret as an environment variable using the 'latest' version alias and read it when the application starts.
- **C.** Store the API key in a plain text file within the container image and rebuild the container when credentials change.
- **D.** Create a startup script that calls the Secret Manager API directly and writes the secret to a local file.

## Question 33

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application using Firestore on Google Cloud. Multiple users need to see changes to documents in real-time. Users occasionally experience slow updates when the application polls the database every 5 seconds. You want to optimize the application for responsiveness while minimizing costs. What should you do?

**Correct answer:** A. Replace polling with snapshot listeners using the onSnapshot() method to receive updates automatically when documents change in the collection.

**Options:**

- **A.** Replace polling with snapshot listeners using the onSnapshot() method to receive updates automatically when documents change in the collection. — _correct answer_
- **B.** Increase the polling frequency to every 1 second and implement client-side caching to reduce database reads.
- **C.** Configure Cloud Scheduler to trigger a Cloud Function that pushes document changes to clients via WebSocket connections every 2 seconds.
- **D.** Implement server-side event streaming using Cloud Pub/Sub to notify clients of Firestore document changes with batched updates.

## Question 34

**Domain:** Integrating applications with Google Cloud services

**Question:** Your task handler running on Cloud Run receives HTTP tasks from Cloud Tasks. Some tasks are failing, and you want to ensure that failed tasks are retried indefinitely until they succeed, with no time limit. How should you configure the queue?

**Correct answer:** A. Set max_attempts to -1 and max_retry_duration to 0 to allow unlimited retries without time constraints.

**Options:**

- **A.** Set max_attempts to -1 and max_retry_duration to 0 to allow unlimited retries without time constraints. — _correct answer_
- **B.** Set max_retry_duration to -1 to indicate unlimited retry duration, with max_attempts at the default value.
- **C.** Set max_attempts to 0 and max_retry_duration to 0 to disable both limits and enable infinite retries.
- **D.** Set max_attempts to -1 only, as this automatically disables the max_retry_duration time limit.

## Question 35

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a Cloud Run application that logs response times in the JSON payload of each log entry. Your SRE team requires tracking the percentile distribution of response latencies from these logs to monitor Service Level Objectives (SLOs). How should you configure Cloud Logging to meet this requirement?

**Correct answer:** A. Create a distribution log-based metric with a filter matching your application logs and configure a value extractor to extract the latency value from the JSON payload.

**Options:**

- **A.** Create a distribution log-based metric with a filter matching your application logs and configure a value extractor to extract the latency value from the JSON payload. — _correct answer_
- **B.** Create a counter log-based metric with a filter matching your application logs and configure labels to capture the latency values for grouping.
- **C.** Create a log sink to route all application logs to BigQuery and use SQL aggregation queries to calculate latency percentiles from the raw log data.
- **D.** Create a counter log-based metric for each latency bucket range and use the sum of counters to calculate the latency distribution in Cloud Monitoring.

## Question 36

**Domain:** Deploying applications

**Question:** Your Cloud Run service deployment is failing with an error indicating it cannot access a secret stored in Secret Manager. The secret exists and contains valid data. You need to resolve this issue following Google-recommended practices. What should you do?

**Correct answer:** B. Grant the roles/secretmanager.secretAccessor role to the Cloud Run service's service account on the specific secret that needs to be accessed.

**Options:**

- **A.** Grant the roles/secretmanager.admin role to the Cloud Run service's service account at the project level.
- **B.** Grant the roles/secretmanager.secretAccessor role to the Cloud Run service's service account on the specific secret that needs to be accessed. — _correct answer_
- **C.** Configure the secret with public access so any authenticated user can retrieve the secret value from Secret Manager.
- **D.** Grant the roles/editor role to the Cloud Run service's service account to ensure full access to all project resources including secrets.

## Question 37

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service that connects to a third-party API using an API key stored in Secret Manager. The API key is rotated monthly by your security team. You need to ensure the Cloud Run service always uses the current API key without requiring redeployment. What is the recommended approach?

**Correct answer:** A. Mount the secret as a volume in Cloud Run, and read the secret value from the mounted file path at runtime when making API calls.

**Options:**

- **A.** Mount the secret as a volume in Cloud Run, and read the secret value from the mounted file path at runtime when making API calls. — _correct answer_
- **B.** Expose the secret as an environment variable using the 'latest' version alias, and access it from the environment at runtime.
- **C.** Use the Secret Manager client library in your application code to fetch the secret on every request.
- **D.** Configure a Pub/Sub trigger to redeploy the Cloud Run service whenever the secret version changes using Secret Manager event notifications.

## Question 38

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are operating a social media analytics platform using Cloud Bigtable. Your row key design uses user_id as the prefix. After launching a marketing campaign, you discover that a few celebrity accounts receive significantly more traffic than other users, causing elevated P99 latencies. You need to resolve this performance issue while maintaining the ability to query data by user. What should you do?

**Correct answer:** A. Implement key salting by prepending a computed hash prefix to the row key, distributing traffic for highly active rows across multiple tablets.

**Options:**

- **A.** Implement key salting by prepending a computed hash prefix to the row key, distributing traffic for highly active rows across multiple tablets. — _correct answer_
- **B.** Configure garbage collection policies to retain fewer versions of data for celebrity user rows to reduce storage and access overhead.
- **C.** Create separate Bigtable tables for celebrity users to isolate their traffic from regular users.
- **D.** Enable autoscaling on the Bigtable cluster to automatically add nodes when traffic increases from celebrity accounts.

## Question 39

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is experiencing performance issues with a Cloud Bigtable table that stores user activity data. The row key is the sequential user ID assigned during registration. New users are more active than existing users. You need to resolve the performance issues. What should you do?

**Correct answer:** A. Reverse the user ID string in the row key to distribute traffic more evenly across all nodes.

**Options:**

- **A.** Reverse the user ID string in the row key to distribute traffic more evenly across all nodes. — _correct answer_
- **B.** Increase the number of nodes in your Bigtable cluster to handle the additional load.
- **C.** Add a timestamp suffix to the user ID row key to make each row key unique per activity.
- **D.** Configure replication with a second cluster in a different region to distribute the read load.

## Question 40

**Domain:** Building and testing applications

**Question:** Your development team uses VS Code with Cloud Code to develop containerized applications that make calls to Google Cloud APIs during local testing. Team members report authentication errors when debugging applications locally. You need to configure authentication so that local applications can access Google Cloud services. What should you do?

**Correct answer:** B. Run 'gcloud auth application-default login' to create local Application Default Credentials that Cloud Code can use when debugging applications.

**Options:**

- **A.** Run 'gcloud auth login' and export the GOOGLE_CLOUD_PROJECT environment variable in your terminal session.
- **B.** Run 'gcloud auth application-default login' to create local Application Default Credentials that Cloud Code can use when debugging applications. — _correct answer_
- **C.** Create a service account key file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable in your launch.json.
- **D.** Configure OAuth 2.0 client credentials in the Cloud Code extension settings and enable API access for your project.

## Question 41

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for storing weather sensor data from multiple geographic locations. Each sensor reports temperature, humidity, and pressure readings every minute. Your application needs to query all metrics for a specific sensor over time ranges, and data older than 30 days should be automatically deleted. How should you design your schema?

**Correct answer:** C. Create row keys as location#sensor_id#timestamp, store all metrics in a single column family with separate columns for each metric, and configure a garbage collection policy with a 30-day max age on the column family.

**Options:**

- **A.** Create row keys as hash(sensor_id)#timestamp and store all metrics in a single serialized JSON column for storage efficiency, relying on client-side filtering for specific metrics.
- **B.** Create row keys as timestamp#location#sensor_id and store all metrics in separate column families so different garbage collection policies can be applied to each metric.
- **C.** Create row keys as location#sensor_id#timestamp, store all metrics in a single column family with separate columns for each metric, and configure a garbage collection policy with a 30-day max age on the column family. — _correct answer_
- **D.** Create separate tables for each sensor and use timestamp as the row key, with separate column families for each metric type, each with its own garbage collection policy.

## Question 42

**Domain:** Deploying applications

**Question:** Your Cloud Run service in a Shared VPC service project needs to access resources in the Shared VPC host project's network. You have created a Serverless VPC Access connector in the host project. When deploying the Cloud Run service using gcloud CLI, how should you specify the connector?

**Correct answer:** C. Use the fully qualified connector name: projects/HOST_PROJECT_ID/locations/REGION/connectors/CONNECTOR_NAME with the --vpc-connector flag.

**Options:**

- **A.** Configure the connector reference in the service YAML metadata annotations section using the annotation run.googleapis.com/vpc-connector-host.
- **B.** Use only the connector name with the --vpc-connector flag, as Cloud Run automatically discovers connectors in the Shared VPC host project.
- **C.** Use the fully qualified connector name: projects/HOST_PROJECT_ID/locations/REGION/connectors/CONNECTOR_NAME with the --vpc-connector flag. — _correct answer_
- **D.** Specify the connector using --vpc-connector=CONNECTOR_NAME and add --vpc-connector-project=HOST_PROJECT_ID to indicate the host project.

## Question 43

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new application that requires access to BigQuery and Cloud Storage within a VPC Service Controls perimeter. Before enforcing the perimeter, you want to understand how the new security controls will affect existing workloads without disrupting production traffic. You need to test the perimeter configuration while allowing applications to continue operating normally. What should you do?

**Correct answer:** A. Create a service perimeter in dry run mode that includes your projects and restricts the required services. Monitor the Cloud Audit Logs to analyze any violations that would occur if the perimeter were enforced.

**Options:**

- **A.** Create a service perimeter in dry run mode that includes your projects and restricts the required services. Monitor the Cloud Audit Logs to analyze any violations that would occur if the perimeter were enforced. — _correct answer_
- **B.** Create a service perimeter in enforced mode with broad ingress rules that allow all traffic. Gradually tighten the rules while monitoring for access denials in Cloud Monitoring dashboards.
- **C.** Create a service perimeter in enforced mode and configure access levels with all company IP addresses. Use Cloud Logging to track any denied requests and update access levels as needed.
- **D.** Deploy a duplicate set of workloads in a separate project and create an enforced perimeter around the duplicate project. Compare application behavior between the original and duplicate environments.

## Question 44

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that reads a TLS certificate stored in Secret Manager. During testing, you notice that when Secret Manager is temporarily unavailable, your service fails to start even though instances could proceed without the certificate initially. You want to change the configuration so that secret unavailability does not prevent service startup. What should you do?

**Correct answer:** B. Configure the secret to be mounted as a volume instead of exposing it as an environment variable.

**Options:**

- **A.** Embed the certificate directly in the container image as a fallback when Secret Manager is unavailable.
- **B.** Configure the secret to be mounted as a volume instead of exposing it as an environment variable. — _correct answer_
- **C.** Store the certificate in Cloud Storage instead of Secret Manager and mount it as a volume.
- **D.** Configure the Cloud Run service with a longer startup timeout to wait for Secret Manager availability.

## Question 45

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an internal web application running on Compute Engine VMs behind a Cloud Load Balancer with Identity-Aware Proxy (IAP) enabled. Your security team requires that your application verifies user identity information cannot be spoofed, even if a network misconfiguration allows direct access to the VMs. What should you do?

**Correct answer:** B. Update your application code to validate the x-goog-iap-jwt-assertion header by verifying the JWT signature using Google's public keys and checking the audience claim.

**Options:**

- **A.** Configure Cloud Armor security policies with IP-based rules to restrict access to the backend services and read user identity from the request cookies.
- **B.** Update your application code to validate the x-goog-iap-jwt-assertion header by verifying the JWT signature using Google's public keys and checking the audience claim. — _correct answer_
- **C.** Configure VPC firewall rules to only allow traffic from the load balancer's IP address range to your VMs, and read user identity from the x-goog-authenticated-user-email header.
- **D.** Create a service account for the application and use it to call the IAM API to verify user permissions on each request.

## Question 46

**Domain:** Building and testing applications

**Question:** Your team is building an integration test suite for an API deployed on Cloud Run with Cloud Endpoints. You need to ensure that all test requests can be traced end-to-end through your distributed system, even when trace sampling is disabled in ESPv2. What should you configure in your test requests?

**Correct answer:** A. Include the X-Cloud-Trace-Context header in your test requests to force trace data to be sent to Cloud Trace regardless of sampling settings.

**Options:**

- **A.** Include the X-Cloud-Trace-Context header in your test requests to force trace data to be sent to Cloud Trace regardless of sampling settings. — _correct answer_
- **B.** Set the Cloud Trace API access scope on your Cloud Run service to ensure trace data collection is enabled.
- **C.** Configure the Cloud Endpoints deployment to set trace_sampling to true in the endpoints_api_service section.
- **D.** Enable verbose logging in Cloud Logging to automatically capture trace information for all requests passing through ESPv2.

## Question 47

**Domain:** Integrating applications with Google Cloud services

**Question:** You need to export application logs from Cloud Logging to a third-party SIEM tool for security analysis. The logs must be delivered in near real-time, and the SIEM tool can consume data via a message queue subscriber. You want to use a managed solution with minimal operational overhead. What should you configure?

**Correct answer:** A. Create a log sink with a Pub/Sub topic as the destination. Configure the SIEM tool to create a subscription and consume messages from the Pub/Sub topic.

**Options:**

- **A.** Create a log sink with a Pub/Sub topic as the destination. Configure the SIEM tool to create a subscription and consume messages from the Pub/Sub topic. — _correct answer_
- **B.** Create a bucket-scoped log-based metric that counts all log entries. Configure Cloud Monitoring to send notifications to the SIEM tool webhook whenever new logs arrive.
- **C.** Create a log sink with Cloud Storage as the destination. Configure the SIEM tool to poll the Cloud Storage bucket for new log files at regular intervals.
- **D.** Create a log sink with BigQuery as the destination. Configure the SIEM tool to run scheduled queries against the BigQuery dataset to retrieve new log entries.

## Question 48

**Domain:** Building and testing applications

**Question:** Your team is developing a CI/CD pipeline in Cloud Build that runs integration tests after building a container image. The integration tests require the container image to be available in Artifact Registry before they can run. Unit tests can run independently while the container image is being built. You want to optimize the total build time. How should you configure the build steps in your cloudbuild.yaml file?

**Correct answer:** B. Configure unit tests with 'waitFor: ['-']' to start immediately, container build step with a unique 'id', and integration tests with 'waitFor' referencing the container build step id.

**Options:**

- **A.** Configure all build steps to run serially by omitting the 'waitFor' field on all steps, as Cloud Build automatically determines the optimal execution order.
- **B.** Configure unit tests with 'waitFor: ['-']' to start immediately, container build step with a unique 'id', and integration tests with 'waitFor' referencing the container build step id. — _correct answer_
- **C.** Configure unit tests and integration tests with 'waitFor: ['-']' to start both immediately after the build begins.
- **D.** Configure the container build step with 'waitFor' referencing the unit tests step id to ensure unit tests pass before building the container image.

## Question 49

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an e-commerce application on Cloud Firestore that tracks inventory counts for products. Multiple server instances can simultaneously update the same product's inventory count when orders are placed. You need to ensure that concurrent updates to the same product's inventory count do not result in lost writes.. Which approach should you use?

**Correct answer:** A. Use FieldValue.increment() to atomically modify the inventory count field on each update operation.

**Options:**

- **A.** Use FieldValue.increment() to atomically modify the inventory count field on each update operation. — _correct answer_
- **B.** Use a transaction to read the current inventory count, calculate the new value, and write the updated count within the transaction.
- **C.** Implement application-level locking using a separate lock document that must be acquired before updating inventory.
- **D.** Use batched writes to group inventory updates and ensure they are applied atomically to maintain consistency.

## Question 50

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service connects to a Cloud SQL database that has a maximum connection limit of 100 concurrent connections. Each Cloud Run instance maintains a connection pool of 10 connections. During peak traffic, users experience database connection errors, and you observe that Cloud Run has scaled to 15 instances. How should you configure Cloud Run to prevent database connection issues while maintaining service availability?

**Correct answer:** D. Set maximum instances to 10 to ensure the total number of database connections does not exceed the Cloud SQL limit.

**Options:**

- **A.** Configure instance-based billing and enable connection pooling to better manage database connections across instances.
- **B.** Set minimum instances to 10 and disable autoscaling to maintain a fixed number of database connections.
- **C.** Increase the maximum concurrency per instance to reduce the number of instances needed and limit database connections.
- **D.** Set maximum instances to 10 to ensure the total number of database connections does not exceed the Cloud SQL limit. — _correct answer_

## Question 51

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is experiencing high latency on a Cloud Bigtable table that stores web analytics data. The schema uses page URL as the row key prefix, but you suspect certain popular pages are causing performance issues. You need to identify and diagnose the problematic row key ranges. What should you do?

**Correct answer:** B. Use Key Visualizer to examine the heatmap showing read and write patterns across the row key space and identify hotspots on specific row key ranges.

**Options:**

- **A.** Increase the number of column families in your table to distribute read and write operations more evenly across the cluster.
- **B.** Use Key Visualizer to examine the heatmap showing read and write patterns across the row key space and identify hotspots on specific row key ranges. — _correct answer_
- **C.** Add Cloud Logging instrumentation to your application code to track latency per page URL and aggregate results in BigQuery.
- **D.** Run the ListHotTablets API command to identify tablets with elevated CPU usage and map them to the affected row key ranges.

## Question 52

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team runs a microservices application on GKE. You need to monitor custom application metrics and set up alerts when the application's request latency exceeds 500 milliseconds. You want to use Google Cloud's recommended approach for collecting Prometheus-style metrics and alerting. What should you do?

**Correct answer:** D. Enable Google Cloud Managed Service for Prometheus on the GKE cluster. Deploy a PodMonitoring resource to scrape application metrics. Create an alerting policy in Cloud Monitoring with a PromQL-based condition to alert on request latency.

**Options:**

- **A.** Enable system metrics collection on the GKE cluster. Create a log-based alerting policy in Cloud Logging to alert when request latency exceeds 500ms. Configure the alert to send notifications via email.
- **B.** Configure the application to write metrics directly to Cloud Monitoring using the custom.googleapis.com prefix. Create an alerting policy using the Monitoring Query Language (MQL) to evaluate request latency.
- **C.** Install a self-managed Prometheus server in the GKE cluster. Configure Prometheus Alertmanager to send alerts to email when request latency exceeds 500ms. Store all metrics locally on the Prometheus server.
- **D.** Enable Google Cloud Managed Service for Prometheus on the GKE cluster. Deploy a PodMonitoring resource to scrape application metrics. Create an alerting policy in Cloud Monitoring with a PromQL-based condition to alert on request latency. — _correct answer_

## Question 53

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an application that stores sensitive customer financial records in Cloud Storage. Your security team requires that you use customer-managed encryption keys (CMEK) to protect data at rest. The Cloud KMS key will be managed in a separate project from the data. Your Cloud Storage bucket is located in the us-east1 region. What must you configure to enable CMEK encryption for this bucket?

**Correct answer:** A. Create a key ring and symmetric key in the us-east1 location in the Cloud KMS project. Grant the Cloud Storage service account the Cloud KMS CryptoKey Encrypter/Decrypter role on the key.

**Options:**

- **A.** Create a key ring and symmetric key in the us-east1 location in the Cloud KMS project. Grant the Cloud Storage service account the Cloud KMS CryptoKey Encrypter/Decrypter role on the key. — _correct answer_
- **B.** Create a key ring and symmetric key in the global location in the Cloud KMS project. Grant the Cloud Storage service account the Cloud KMS Admin role on the key.
- **C.** Create a key ring and symmetric key in the us-east1 location in the Cloud KMS project. Grant the application service account the Cloud KMS Viewer role on the key.
- **D.** Create a key ring and asymmetric key in the us-east1 location in the Cloud KMS project. Grant the Cloud Storage service account the Cloud KMS CryptoKey Encrypter/Decrypter role on the key.

## Question 54

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an application on GKE that connects to a Cloud SQL for MySQL instance. Your security team requires that database connections are encrypted and authenticated without embedding database credentials in your application code. You need to implement a secure connection method that also provides connection encryption. What should you do?

**Correct answer:** D. Deploy the Cloud SQL Auth Proxy as a sidecar container in your GKE pods. Configure Workload Identity to authenticate the proxy using a Google service account with the Cloud SQL Client role.

**Options:**

- **A.** Configure SSL certificates on the Cloud SQL instance and store the certificates in Kubernetes Secrets. Modify your application to load the certificates and establish SSL connections directly.
- **B.** Store database credentials in environment variables within your GKE deployment manifest and connect to Cloud SQL using the instance's private IP address.
- **C.** Enable public IP on the Cloud SQL instance and configure authorized networks to allow connections from your GKE cluster's external IP addresses.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar container in your GKE pods. Configure Workload Identity to authenticate the proxy using a Google service account with the Cloud SQL Client role. — _correct answer_

## Question 55

**Domain:** Deploying applications

**Question:** You are deploying a microservices application to GKE. The application requires database connection strings and API endpoints that vary between development and production environments. You also need to store database passwords securely. Following Google-recommended best practices, how should you manage these configuration values?

**Correct answer:** A. Store database connection strings and API endpoints in a ConfigMap and store database passwords in a Kubernetes Secret. Reference them in your Pod specification.

**Options:**

- **A.** Store database connection strings and API endpoints in a ConfigMap and store database passwords in a Kubernetes Secret. Reference them in your Pod specification. — _correct answer_
- **B.** Store all configuration values including passwords in ConfigMaps since they provide encryption at rest by default and simplify management.
- **C.** Store all values including passwords directly in the container image using environment variables defined in the Dockerfile to ensure consistency across environments.
- **D.** Store database connection strings in environment variables hardcoded in deployment manifests and use Google Cloud Secret Manager for passwords accessed via API calls at runtime.

## Question 56

**Domain:** Deploying applications

**Question:** A developer reports that their Cloud Run service starts successfully but fails when the application attempts to read configuration from a mounted Secret Manager volume. The service account has been granted the Secret Manager Secret Accessor role. What is the most likely cause of this issue?

**Correct answer:** B. The secret version specified in the volume mount configuration has been disabled or destroyed in Secret Manager.

**Options:**

- **A.** The Cloud Run service account does not have the Secret Manager Secret Accessor role on the secret.
- **B.** The secret version specified in the volume mount configuration has been disabled or destroyed in Secret Manager. — _correct answer_
- **C.** The volume mount path specified conflicts with a reserved system directory such as /proc or /dev.
- **D.** The Secret Manager API is not enabled in the project where the Cloud Run service is deployed.

## Question 57

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing time-series weather data from sensors in Cloud Bigtable. Each sensor reports temperature humidity and pressure readings every minute. You need to design a schema that supports efficient queries for retrieving all measurements from a specific sensor over a one-week period while optimizing for storage efficiency and write performance. What schema design pattern should you use?

**Correct answer:** A. Use a time bucket pattern with row keys formatted as 'sensor_id#week_number' and store each minute's readings as new cells in measurement columns within the same row.

**Options:**

- **A.** Use a time bucket pattern with row keys formatted as 'sensor_id#week_number' and store each minute's readings as new cells in measurement columns within the same row. — _correct answer_
- **B.** Use row keys formatted as 'timestamp#sensor_id' to enable efficient time-range queries across all sensors simultaneously.
- **C.** Store all sensor data in a single row per sensor with unbounded columns growing indefinitely as new readings arrive over time.
- **D.** Use a tall narrow table pattern with row keys formatted as 'sensor_id#timestamp' creating a new row for every minute's readings from each sensor.

## Question 58

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an order management system using Firestore. Your application needs to track and log different types of changes to order documents including new orders, order modifications, and order cancellations. You want to implement this using Firestore client libraries with minimal code complexity. How should you implement change tracking in your snapshot listener callback?

**Correct answer:** D. Iterate over the DocumentChange objects from the snapshot and check the change type property to identify ADDED, MODIFIED, and REMOVED changes for appropriate processing.

**Options:**

- **A.** Create three separate snapshot listeners for each change type - one for new orders, one for modifications, and one for deletions to separate the logic.
- **B.** Compare each document's updateTime with the previous snapshot to determine if it was added, modified, or deleted from the collection.
- **C.** Maintain a local copy of all documents and perform a diff comparison with each new snapshot to identify changes to the order collection.
- **D.** Iterate over the DocumentChange objects from the snapshot and check the change type property to identify ADDED, MODIFIED, and REMOVED changes for appropriate processing. — _correct answer_

## Question 59

**Domain:** Building and testing applications

**Question:** Your development team uses Cloud Build to run automated integration tests against a staging environment before deploying to production. You need to include the Git commit SHA in test output filenames for traceability. Which substitution variable should you use in your cloudbuild.yaml to reference the short version of the commit ID when the build is triggered by a Git push event?

**Correct answer:** D. Use the $SHORT_SHA substitution variable to reference the first seven characters of the commit ID associated with the build.

**Options:**

- **A.** Create a custom user-defined substitution variable named $_GIT_SHORT_HASH and configure the trigger to pass the shortened commit SHA value.
- **B.** Use the $REVISION_ID substitution variable which provides a truncated version of the commit SHA optimized for filenames.
- **C.** Use the $COMMIT_SHA substitution variable and apply bash parameter expansion to extract the first seven characters.
- **D.** Use the $SHORT_SHA substitution variable to reference the first seven characters of the commit ID associated with the build. — _correct answer_

## Question 60

**Domain:** Deploying applications

**Question:** You are developing a Cloud Run service that stores sensitive configuration in Secret Manager. The application needs to read a TLS certificate from the secret. You want to ensure the secret can be updated without redeploying the service and minimize the impact if a directory already exists at the mount path. What should you do?

**Correct answer:** B. Mount the secret as a volume to a new directory path that does not already exist in the container filesystem.

**Options:**

- **A.** Use the Secret Manager client library to fetch the certificate programmatically at application startup.
- **B.** Mount the secret as a volume to a new directory path that does not already exist in the container filesystem. — _correct answer_
- **C.** Configure the secret as an environment variable containing the base64-encoded certificate data.
- **D.** Mount the secret as a volume to an existing application directory to simplify file path references.

## Question 61

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is configuring a Cloud Tasks queue with RetryConfig settings for an inventory management system. You set minBackoff to 10 seconds, maxBackoff to 300 seconds, and maxDoublings to 3. A task fails on its first attempt. What will be the sequence of retry intervals for subsequent attempts?

**Correct answer:** A. 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_
- **B.** 10s, 10s, 10s, 20s, 40s, 80s, 160s, 300s
- **C.** 10s, 30s, 90s, 270s, 300s, 300s, 300s, 300s
- **D.** 10s, 20s, 40s, 80s, 300s, 300s, 300s, 300s

## Question 62

**Domain:** Deploying applications

**Question:** Your development team is building a CI/CD pipeline using Cloud Build to create container images and push them to Artifact Registry for deployment to GKE. The Cloud Build trigger is configured but builds are failing with permission denied errors when pushing images. Your organization has disabled automatic role granting to default service accounts. What should you do to resolve this issue?

**Correct answer:** D. Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the Cloud Build service account on the target repository.

**Options:**

- **A.** Grant the Storage Admin role (roles/storage.admin) to the Cloud Build service account at the project level.
- **B.** Create a new Docker repository in Artifact Registry and use Container Registry hostnames (gcr.io) instead of pkg.dev hostnames in your build configuration.
- **C.** Enable the Artifact Registry API and wait for the default permissions to propagate to the Cloud Build service account.
- **D.** Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the Cloud Build service account on the target repository. — _correct answer_

## Question 63

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application stores user posts in a Firestore collection structure where each user document has a subcollection called 'posts'. You need to query all posts across all users that have a 'published' field set to true and order the results by the 'createdAt' timestamp field. The query returns an error indicating a missing index. What should you do?

**Correct answer:** A. Create a composite index with collection group scope that includes the 'published' and 'createdAt' fields with the appropriate ordering directions.

**Options:**

- **A.** Create a composite index with collection group scope that includes the 'published' and 'createdAt' fields with the appropriate ordering directions. — _correct answer_
- **B.** Restructure your data model to store all posts in a single top-level collection, then create a composite index with collection scope for the query.
- **C.** Create separate single-field indexes for 'published' and 'createdAt' fields with collection scope on each user's posts subcollection.
- **D.** Run the collection group query without any filters or ordering, then sort and filter the results in your application code to avoid needing additional indexes.

## Question 64

**Domain:** Deploying applications

**Question:** You need to configure Cloud Build to generate SLSA build provenance for your container images pushed to Artifact Registry. Your security team requires both SLSA v1.0 and v0.1 provenance formats. How should you configure your builds?

**Correct answer:** B. Use Cloud Build triggers to initiate builds from repository events such as pushes or pull requests.

**Options:**

- **A.** Configure the Container Analysis API with both provenance versions and build manually using any method.
- **B.** Use Cloud Build triggers to initiate builds from repository events such as pushes or pull requests. — _correct answer_
- **C.** Add requestedVerifyOption: VERIFIED to your cloudbuild.yaml and run builds manually with gcloud builds submit.
- **D.** Enable Binary Authorization and configure attestors for both SLSA v0.1 and v1.0 formats.

## Question 65

**Domain:** Building and testing applications

**Question:** You are developing applications for Google Cloud and want to use Cloud Shell as your primary development environment. You need to ensure that custom packages you install are automatically available each time Cloud Shell starts a new session. What should you do?

**Correct answer:** A. Create a .customize_environment script in your $HOME directory with commands to install the required packages using Debian package management commands.

**Options:**

- **A.** Create a .customize_environment script in your $HOME directory with commands to install the required packages using Debian package management commands. — _correct answer_
- **B.** Install the packages using apt-get and store a backup of the /usr/local/bin directory in Cloud Storage. Create a startup script to restore from Cloud Storage on each session.
- **C.** Configure a custom Cloud Shell container image and deploy it to Cloud Run for all team members to use.
- **D.** Add apt-get install commands to your .bashrc file in the $HOME directory so packages are installed on each shell login.

## Question 66

**Domain:** Building and testing applications

**Question:** Your organization requires all production container images to have verifiable build provenance that meets SLSA Level 3 requirements. You are configuring Cloud Build to generate this provenance metadata. What must you ensure when triggering your builds?

**Correct answer:** D. Use Cloud Build triggers to invoke builds from repository events, and configure the requestedVerifyOption field to VERIFIED in your build configuration.

**Options:**

- **A.** Run builds manually using gcloud builds submit with the --provenance flag set to true to generate SLSA Level 3 compliant provenance metadata.
- **B.** Enable the Container Analysis API and configure Binary Authorization to automatically generate provenance for all builds regardless of how they are triggered.
- **C.** Store your build configuration in Secret Manager and reference it during builds to ensure the build process is tamper-proof and meets SLSA Level 3 provenance requirements.
- **D.** Use Cloud Build triggers to invoke builds from repository events, and configure the requestedVerifyOption field to VERIFIED in your build configuration. — _correct answer_

## Question 67

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for an e-commerce application that assigns incrementing numeric IDs to new customers. The application frequently queries customer data by customer ID. You are concerned about potential performance issues with this design. What is the primary problem with using sequential numeric IDs as row keys, and what is the recommended solution?

**Correct answer:** B. Sequential numeric IDs cause hotspots because new and active users cluster in the same key range; reverse the numeric ID or use a hash of the ID as the row key prefix to spread traffic evenly.

**Options:**

- **A.** Sequential numeric IDs violate Bigtable's 4 KB row key limit when IDs become very large; use a UUID instead of numeric IDs.
- **B.** Sequential numeric IDs cause hotspots because new and active users cluster in the same key range; reverse the numeric ID or use a hash of the ID as the row key prefix to spread traffic evenly. — _correct answer_
- **C.** Sequential numeric IDs cause storage inefficiency because numeric values consume more bytes; convert numeric IDs to strings with fixed-width zero-padding.
- **D.** Sequential numeric IDs limit query flexibility because Bigtable only supports exact row key lookups; add a secondary index using Firestore.

## Question 68

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are implementing a caching layer using Memorystore for Redis for a financial reporting application. Reports are generated nightly by a batch process and accessed frequently during business hours. You need to ensure that reports are immediately available in the cache after generation and remain available throughout the next business day. What caching pattern and configuration should you implement?

**Correct answer:** B. Implement a write-through pattern in the batch process to populate Memorystore immediately after report generation, set TTLs on report keys to expire after 24 hours, and use the volatile-lru eviction policy.

**Options:**

- **A.** Configure Memorystore with RDB persistence enabled and use the noeviction policy to ensure reports are never removed from cache, relying on RDB snapshots to restore data after maintenance.
- **B.** Implement a write-through pattern in the batch process to populate Memorystore immediately after report generation, set TTLs on report keys to expire after 24 hours, and use the volatile-lru eviction policy. — _correct answer_
- **C.** Configure a Pub/Sub topic to trigger a Cloud Run function that pre-warms the cache by reading reports from storage, and set the volatile-ttl eviction policy to prioritize removing keys with the shortest remaining TTL.
- **D.** Implement a cache-aside pattern where the first user request triggers report retrieval from the database and caches it in Memorystore, using the allkeys-lru eviction policy without TTLs.

## Question 69

**Domain:** Integrating applications with Google Cloud services

**Question:** You are managing log aggregation for your organization. You need to create log-based metrics that count errors across all projects within your organization's central logging bucket. The metrics should include data from logs routed to the bucket from multiple source projects. What should you do?

**Correct answer:** B. Create a bucket-scoped log-based metric in the project containing the central logging bucket. Configure the metric filter to match error log entries stored in that bucket.

**Options:**

- **A.** Create a project-scoped log-based metric in each source project and configure the filter to match error log entries. Aggregate the metrics using a Cloud Monitoring dashboard.
- **B.** Create a bucket-scoped log-based metric in the project containing the central logging bucket. Configure the metric filter to match error log entries stored in that bucket. — _correct answer_
- **C.** Create an organization-level log-based metric with a filter that matches error log entries across all projects in the organization.
- **D.** Create a log sink from the central bucket to BigQuery and use BigQuery queries to calculate error counts across all source projects.

## Question 70

**Domain:** Deploying applications

**Question:** Your company is migrating from Container Registry to Artifact Registry. You configure your Cloud Build pipeline to push images to a new Artifact Registry Docker repository, but builds fail with a 'repository not found' error. The Cloud Build service account has the Artifact Registry Writer role on the project. What is the most likely cause of this issue?

**Correct answer:** A. The Artifact Registry Docker repository does not exist and must be created before pushing images to it.

**Options:**

- **A.** The Artifact Registry Docker repository does not exist and must be created before pushing images to it. — _correct answer_
- **B.** The image path in the cloudbuild.yaml file uses the old gcr.io hostname instead of the pkg.dev hostname.
- **C.** The Cloud Build service account requires the Artifact Registry Administrator role instead of Writer to create repositories.
- **D.** The Artifact Registry API is not enabled in the project and must be enabled manually.

## Question 71

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is running a microservices application on GKE. You want to configure an alerting policy in Cloud Monitoring that triggers only when CPU utilization exceeds 80% AND memory usage exceeds 70% on the same pod for at least 5 minutes. You want to minimize alert noise by ensuring both conditions must be met before receiving notifications. How should you configure the alerting policy?

**Correct answer:** B. Create an alerting policy with two conditions and set the multi-condition trigger to 'All conditions are met'. Configure both conditions with a retest window of 5 minutes.

**Options:**

- **A.** Create an alerting policy with one condition using a PromQL query that monitors both CPU and memory metrics with an AND operator and a duration of 5 minutes.
- **B.** Create an alerting policy with two conditions and set the multi-condition trigger to 'All conditions are met'. Configure both conditions with a retest window of 5 minutes. — _correct answer_
- **C.** Create an alerting policy with two conditions and set the multi-condition trigger to 'Any condition is met'. Add a Cloud Function to filter notifications when both conditions are true.
- **D.** Create two separate alerting policies for CPU and memory, then use Cloud Workflows to combine notifications and trigger alerts when both policies are in incident state.

## Question 72

**Domain:** Deploying applications

**Question:** Your team is deploying a web application on GKE with an external Application Load Balancer using Ingress. Users are reporting intermittent 502 errors during rolling deployments. You determine that the load balancer's health checks are failing for new pods before they are ready to serve traffic. You need to customize the health check configuration to match your application's specific readiness endpoint at /healthz on port 8080. What is the recommended approach?

**Correct answer:** B. Create a BackendConfig custom resource with a healthCheck section specifying the path '/healthz' and port 8080. Reference this BackendConfig in the Service using the cloud.google.com/backend-config annotation.

**Options:**

- **A.** Create a FrontendConfig custom resource with a healthCheck section specifying the path '/healthz' and port 8080. Reference this FrontendConfig in the Ingress using the networking.gke.io/v1beta1.FrontendConfig annotation.
- **B.** Create a BackendConfig custom resource with a healthCheck section specifying the path '/healthz' and port 8080. Reference this BackendConfig in the Service using the cloud.google.com/backend-config annotation. — _correct answer_
- **C.** Configure a readiness probe in the Pod specification with httpGet path '/healthz' and port 8080. The GKE Ingress controller will automatically infer these health check parameters.
- **D.** Modify the Google Cloud health check directly using the gcloud compute health-checks update command to set the request path to '/healthz' and port to 8080.

## Question 73

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying a Cloud Run service that needs to run asynchronous background tasks after returning HTTP responses to users. The service uses Node.js with async/await patterns and relies on setInterval() for periodic cache updates. During testing, you observe that background tasks are not completing as expected. What should you configure to ensure background processing works correctly?

**Correct answer:** B. Configure the service to use instance-based billing by setting the --no-cpu-throttling flag during deployment.

**Options:**

- **A.** Increase the request timeout to 3600 seconds to allow more time for background processing to complete.
- **B.** Configure the service to use instance-based billing by setting the --no-cpu-throttling flag during deployment. — _correct answer_
- **C.** Configure minimum instances to 1 so the container is always running and can process background tasks.
- **D.** Set the maximum concurrency to 1 to ensure each instance processes only one request at a time without interference.

## Question 74

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is developing a REST API on Cloud Run that processes machine learning inference requests. Each request takes approximately 500ms to complete and requires dedicated CPU resources. Users are reporting that some requests fail with HTTP 429 errors during peak traffic periods. You want to optimize the service to handle more concurrent requests while minimizing costs. What should you do?

**Correct answer:** C. Lower the maximum concurrency setting and increase the maximum instances limit to allow more instances to be created during traffic spikes.

**Options:**

- **A.** Configure manual scaling with a fixed number of instances based on expected peak traffic patterns.
- **B.** Increase the CPU allocation to 8 vCPUs per instance to process more requests faster without changing concurrency settings.
- **C.** Lower the maximum concurrency setting and increase the maximum instances limit to allow more instances to be created during traffic spikes. — _correct answer_
- **D.** Enable instance-based billing and set the maximum concurrency to 1000 to allow each instance to handle more requests simultaneously.

## Question 75

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying an API on Cloud Run that processes incoming requests and then asynchronously sends telemetry data to a monitoring service using a background thread. After deployment, you notice that telemetry data is frequently missing or delayed. The application works correctly when tested locally. You need to fix this issue while minimizing operational costs. What should you do?

**Correct answer:** D. Configure the Cloud Run service to use instance-based billing so that CPU is allocated for the entire lifecycle of container instances.

**Options:**

- **A.** Increase the request timeout setting to allow more time for the background telemetry thread to complete before the request finishes.
- **B.** Set the minimum instances to 1 to ensure at least one container instance is always running and can process background work.
- **C.** Enable startup CPU boost to ensure the background thread has sufficient CPU resources during instance initialization.
- **D.** Configure the Cloud Run service to use instance-based billing so that CPU is allocated for the entire lifecycle of container instances. — _correct answer_

## Question 76

**Domain:** Building and testing applications

**Question:** Your organization uses Cloud Build to build container images and stores them in Artifact Registry. The security team requires that all images have verifiable build provenance with SLSA level 3 assurance for audit purposes. You need to configure Cloud Build to generate this provenance. What should you do?

**Correct answer:** C. Use Cloud Build triggers to initiate builds from repository events and set requestedVerifyOption to VERIFIED in the build options, then enable the Container Analysis API.

**Options:**

- **A.** Configure the cloudbuild.yaml to include a custom step that generates provenance metadata using an open-source SLSA provenance generator tool and uploads it to Cloud Storage.
- **B.** Enable Binary Authorization on the GKE cluster where images will be deployed, which automatically generates SLSA provenance for all images stored in Artifact Registry.
- **C.** Use Cloud Build triggers to initiate builds from repository events and set requestedVerifyOption to VERIFIED in the build options, then enable the Container Analysis API. — _correct answer_
- **D.** Submit builds manually using gcloud builds submit with the --provenance flag to generate SLSA level 3 provenance for each build execution.

## Question 77

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You need to implement a blue-green deployment strategy for an application that uses database credentials stored in Secret Manager. During deployment, you must ensure that both the current and new application versions can access their respective credentials simultaneously. What approach should you use?

**Correct answer:** B. Create version aliases for the secret, assigning different aliases to specific versions for blue and green deployments.

**Options:**

- **A.** Use the 'latest' alias for the green deployment and a specific version number for the blue deployment during transition.
- **B.** Create version aliases for the secret, assigning different aliases to specific versions for blue and green deployments. — _correct answer_
- **C.** Create two separate secrets with identical names in different projects, one for blue and one for green deployments.
- **D.** Store both sets of credentials in a single secret version as a JSON object and have each deployment extract its respective credentials.

## Question 78

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses Cloud Tasks to process asynchronous work. You want to configure the queue so that if a task fails, Cloud Tasks retries with exponential backoff starting at 10 seconds, doubling 4 times, and capping at 300 seconds. What queue configuration should you use?

**Correct answer:** C. Set min-backoff to 10s, max-backoff to 300s, and max-doublings to 4.

**Options:**

- **A.** Set min-backoff to 10s, max-doublings to 4, and max-attempts to 300.
- **B.** Set min-backoff to 10s, max-backoff to 300s, and max-attempts to 4.
- **C.** Set min-backoff to 10s, max-backoff to 300s, and max-doublings to 4. — _correct answer_
- **D.** Set max-retry-duration to 300s and max-doublings to 4.

## Question 79

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline to build Docker images and store them in Artifact Registry. You need the built images to be displayed in the Cloud Build results in the Google Cloud console and also generate build provenance for security compliance. What should you do?

**Correct answer:** A. Add the images field to your build config file with the Artifact Registry image path and set requestedVerifyOption to VERIFIED in the options section.

**Options:**

- **A.** Add the images field to your build config file with the Artifact Registry image path and set requestedVerifyOption to VERIFIED in the options section. — _correct answer_
- **B.** Use only a docker push build step to push the image to Artifact Registry and add a separate step to generate provenance using the gcloud CLI.
- **C.** Configure an Eventarc trigger to monitor the Artifact Registry repository and generate provenance after images are pushed.
- **D.** Use docker push in your build steps and add the provenance field set to true in the Cloud Build configuration options.

## Question 80

**Domain:** Deploying applications

**Question:** You are maintaining a microservices application on GKE. Your team uses version-controlled YAML manifests to define Kubernetes resources. A developer accidentally deleted a Deployment using kubectl delete, but the YAML manifest is still available in the repository. You need to recreate the Deployment while ensuring future updates to the same resource can be applied incrementally without errors. What should you do?

**Correct answer:** C. Run 'kubectl apply -f deployment.yaml' to create the Deployment from the manifest file.

**Options:**

- **A.** Run 'kubectl replace -f deployment.yaml' to replace the missing Deployment object.
- **B.** Run 'kubectl create -f deployment.yaml' to imperatively create the Deployment resource.
- **C.** Run 'kubectl apply -f deployment.yaml' to create the Deployment from the manifest file. — _correct answer_
- **D.** Run 'kubectl patch deployment <name> --patch-file deployment.yaml' to recreate the Deployment.

## Question 81

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Run application makes frequent requests to the Cloud Storage JSON API to list objects in a bucket. During peak load, your application starts receiving HTTP 429 errors. You need to implement a strategy to handle these errors while following Google-recommended best practices. What should you do?

**Correct answer:** D. Implement exponential backoff with jitter, retrying failed requests with exponentially increasing wait times between retries up to a maximum backoff time.

**Options:**

- **A.** Immediately retry the request up to 10 times with a fixed 1-second delay between each retry attempt.
- **B.** Cache the API responses indefinitely in Memorystore to eliminate future requests to the Cloud Storage JSON API.
- **C.** Increase the Cloud Storage quota for your project by submitting a request through the Google Cloud console IAM & Admin Quotas page.
- **D.** Implement exponential backoff with jitter, retrying failed requests with exponentially increasing wait times between retries up to a maximum backoff time. — _correct answer_

## Question 82

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an IoT monitoring application that stores sensor data from thousands of devices in Cloud Bigtable. Each device reports telemetry data every second. Your current row key design uses the format 'timestamp#device_id' and you are experiencing high write latency. You need to optimize the row key design to improve write performance. What should you do?

**Correct answer:** C. Change the row key format to 'device_id#timestamp' to distribute writes across the row key space and prevent hotspotting on timestamp-ordered rows.

**Options:**

- **A.** Enable automatic load balancing in the Bigtable instance to distribute timestamp-prefixed writes across all available nodes.
- **B.** Change the row key format to 'timestamp' only and remove the device_id to simplify the key structure and improve write performance.
- **C.** Change the row key format to 'device_id#timestamp' to distribute writes across the row key space and prevent hotspotting on timestamp-ordered rows. — _correct answer_
- **D.** Increase the number of nodes in the Bigtable cluster to handle the concentrated write load on timestamp-ordered rows.

## Question 83

**Domain:** Integrating applications with Google Cloud services

**Question:** You are deploying a containerized application to GKE that needs to connect to a Cloud SQL for MySQL instance with a private IP address. You want to implement the Google-recommended approach for secure connectivity. What should you do?

**Correct answer:** B. Deploy the Cloud SQL Auth Proxy as a sidecar container in each application pod, and connect to the database through the localhost address exposed by the proxy.

**Options:**

- **A.** Configure VPC-native networking on the GKE cluster and connect directly to the Cloud SQL private IP address from application pods without using the Cloud SQL Auth Proxy.
- **B.** Deploy the Cloud SQL Auth Proxy as a sidecar container in each application pod, and connect to the database through the localhost address exposed by the proxy. — _correct answer_
- **C.** Deploy a single Cloud SQL Auth Proxy instance as a Kubernetes Deployment with multiple replicas and configure all pods to connect through this shared proxy service.
- **D.** Install the Cloud SQL Auth Proxy on each GKE node using a DaemonSet and configure pods to connect through the node's local proxy instance.

## Question 84

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema to store web analytics data where each row represents page views for URLs on your company's websites. You need to support efficient queries that retrieve all page views for a specific domain and its subdomains. The URLs follow standard web conventions like 'www.example.com/page1' and 'blog.example.com/article2'. How should you design the row key to optimize these queries?

**Correct answer:** B. Use reversed domain names as the row key prefix such as 'com.example.www#page1' to group all data for a domain and its subdomains in contiguous rows.

**Options:**

- **A.** Create a composite row key with the page path first followed by the domain like 'page1#www.example.com' to optimize queries by page type.
- **B.** Use reversed domain names as the row key prefix such as 'com.example.www#page1' to group all data for a domain and its subdomains in contiguous rows. — _correct answer_
- **C.** Use a hash of the domain name as the row key prefix to ensure even distribution of data across all Bigtable nodes.
- **D.** Use the full URL as the row key in standard format like 'www.example.com/page1' to maintain human readability and simplify debugging.

## Question 85

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service that requires database credentials from Secret Manager. Your security team requires that all secret versions be explicitly tracked and that problematic secret versions can be rolled back using existing CI/CD processes. How should you configure the secret reference following Google-recommended best practices?

**Correct answer:** D. Reference the secret using a specific version number and update the version number through your CI/CD pipeline when deploying new revisions.

**Options:**

- **A.** Store the secret version number in a separate environment variable and use the Secret Manager API in code to fetch the specified version.
- **B.** Configure automatic secret rotation in Secret Manager and reference the secret using the 'latest' alias to always use the most current credentials.
- **C.** Reference the secret using the 'latest' alias and configure Cloud Run to automatically roll back to the previous revision if errors are detected.
- **D.** Reference the secret using a specific version number and update the version number through your CI/CD pipeline when deploying new revisions. — _correct answer_

## Question 86

**Domain:** Deploying applications

**Question:** Your development team uses Cloud Build to build container images and push them to Artifact Registry in a different project for deployment to GKE. Your builds are failing with permission denied errors when attempting to push images. What should you do to resolve this issue?

**Correct answer:** C. Grant the Artifact Registry Writer role to the Cloud Build service account in the project containing the Artifact Registry repository.

**Options:**

- **A.** Configure the Cloud Build service account to use Application Default Credentials by setting the GOOGLE_APPLICATION_CREDENTIALS environment variable.
- **B.** Grant the Storage Admin role to the Cloud Build service account in the project containing Cloud Build.
- **C.** Grant the Artifact Registry Writer role to the Cloud Build service account in the project containing the Artifact Registry repository. — _correct answer_
- **D.** Create the repository in the same project as Cloud Build to use default permissions.

## Question 87

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Build pipeline to build and push a container image to Artifact Registry. You want the built image to appear in the Cloud Build results, including the Build description page in the Google Cloud console. You also need to ensure the image is pushed during the build process for use by subsequent build steps. What should you configure in your cloudbuild.yaml file?

**Correct answer:** D. Add a Docker push build step to push the image during the build, and include the image path in the images field at the end of the configuration file.

**Options:**

- **A.** Use the gcloud builds submit command with the --tag flag which automatically handles both pushing and displaying the image in results.
- **B.** Add only a Docker push build step to push the image during the build. The image will automatically appear in the Cloud Build results.
- **C.** Add only the images field at the end of the cloudbuild.yaml file with the image path. Cloud Build will automatically push the image after all steps complete.
- **D.** Add a Docker push build step to push the image during the build, and include the image path in the images field at the end of the configuration file. — _correct answer_

## Question 88

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an inventory management system that uses the Cloud Storage JSON API to list objects. Your bucket may contain between a few hundred to several million objects depending on the time of year. You need to implement pagination that works efficiently across all scenarios. What is the correct approach?

**Correct answer:** B. Check if nextPageToken exists in each response and pass it as the pageToken parameter in subsequent requests until nextPageToken is no longer returned.

**Options:**

- **A.** Count the number of items returned in each response and stop requesting when fewer items than maxResults are returned.
- **B.** Check if nextPageToken exists in each response and pass it as the pageToken parameter in subsequent requests until nextPageToken is no longer returned. — _correct answer_
- **C.** Set maxResults to the maximum estimated object count and retrieve all objects in a single request to simplify application logic.
- **D.** Store the last object name from each response and use it as a startOffset parameter in subsequent requests to continue listing.

## Question 89

**Domain:** Building and testing applications

**Question:** You are running integration tests in Cloud Build for a microservices application. The integration tests occasionally take longer than expected due to network latency when calling external services. The builds are failing with timeout errors even though the tests eventually complete successfully when run locally. The current build configuration does not specify any timeout values. What should you do to resolve this issue?

**Correct answer:** B. Add a 'timeout' field to the integration test build step with a duration value longer than the expected test execution time.

**Options:**

- **A.** Configure the 'queueTtl' field to allow the build to wait longer in the queue before starting execution.
- **B.** Add a 'timeout' field to the integration test build step with a duration value longer than the expected test execution time. — _correct answer_
- **C.** Increase the default Cloud Build timeout by setting 'timeout' at the build level in the options section of the cloudbuild.yaml file.
- **D.** Set 'allowFailure: true' on the integration test step to prevent the build from failing when tests timeout.

## Question 90

**Domain:** Deploying applications

**Question:** You are developing an application on GKE that needs to store a database connection string, an API endpoint URL, and a database password. You want to follow Google-recommended security practices for managing application configuration. How should you store this configuration data?

**Correct answer:** C. Store the database connection string and API endpoint URL in a ConfigMap. Store the database password in a Kubernetes Secret.

**Options:**

- **A.** Store all configuration values in a single Kubernetes Secret since Secrets provide encryption for all data.
- **B.** Store the database connection string and API endpoint URL in environment variables hardcoded in the deployment manifest. Store the database password in Secret Manager.
- **C.** Store the database connection string and API endpoint URL in a ConfigMap. Store the database password in a Kubernetes Secret. — _correct answer_
- **D.** Store all configuration values in a single ConfigMap for simplified management and use RBAC to restrict access.

## Question 91

**Domain:** Deploying applications

**Question:** You manage multiple GKE clusters and want to receive notifications whenever a specific error message appears in your application container logs. You need a solution that monitors individual log entries in real-time and sends alerts when the error pattern is detected. What should you configure?

**Correct answer:** D. Create a log-based alerting policy in Cloud Monitoring that matches the specific error message pattern in your container logs.

**Options:**

- **A.** Configure a Cloud Logging sink to export logs to Pub/Sub, then create a Cloud Function to parse the logs and send notifications when the error pattern is found.
- **B.** Enable Error Reporting on your GKE cluster and configure it to send notifications for all detected errors.
- **C.** Create a log-based metric that counts occurrences of the error message, then configure an alerting policy on the metric with a threshold of greater than zero.
- **D.** Create a log-based alerting policy in Cloud Monitoring that matches the specific error message pattern in your container logs. — _correct answer_

## Question 92

**Domain:** Building and testing applications

**Question:** You are developing a containerized Kubernetes application using VS Code with Cloud Code. You want to debug your application against a local minikube cluster. When you attempt to debug, you receive an error indicating the necessary configuration files are missing. What configuration files must be present for Cloud Code debugging to work?

**Correct answer:** D. A skaffold.yaml configuration file and a cloudcode.kubernetes launch configuration in your .vscode/launch.json file.

**Options:**

- **A.** A Dockerfile and a kubernetes.yaml manifest file only, with no additional IDE configuration required.
- **B.** A Dockerfile and a docker-compose.yml file specifying the container build and debug port configuration.
- **C.** A kubernetes.yaml manifest file and a .cloudcode/config.json file with debug settings.
- **D.** A skaffold.yaml configuration file and a cloudcode.kubernetes launch configuration in your .vscode/launch.json file. — _correct answer_

## Question 93

**Domain:** Building and testing applications

**Question:** You are managing container images in Artifact Registry for a microservices application. Storage costs are increasing because old and unused images are not being removed. You need to automatically delete untagged images older than 30 days while keeping the 5 most recent versions of each package. What should you configure?

**Correct answer:** A. Create a cleanup policy with a delete policy for untagged images older than 30 days, and add a keep policy to retain the 5 most recent versions of each package.

**Options:**

- **A.** Create a cleanup policy with a delete policy for untagged images older than 30 days, and add a keep policy to retain the 5 most recent versions of each package. — _correct answer_
- **B.** Create an organization policy that enforces image retention across all Artifact Registry repositories and configure it to delete images after 30 days while keeping the most recent 5 versions.
- **C.** Set up a lifecycle policy on the underlying Cloud Storage bucket that stores Artifact Registry data to delete objects older than 30 days and retain the 5 newest objects.
- **D.** Configure a Cloud Scheduler job to run daily, calling a Cloud Run function that uses the Artifact Registry API to delete untagged images older than 30 days and keep only the latest 5 versions.

## Question 94

**Domain:** Building and testing applications

**Question:** You are setting up a Cloud Build pipeline that needs to run linting, unit tests, and integration tests. The linting and unit tests have no dependencies on each other and should run in parallel to reduce total build time. The integration tests should only execute after both linting and unit tests pass successfully. How should you configure the build steps?

**Correct answer:** D. Configure the lint step with id: 'lint', unit test step with id: 'unit-test' and waitFor: ['-'], and the integration test step with waitFor: ['lint', 'unit-test'].

**Options:**

- **A.** Configure all three steps with waitFor: ['-'] to run them all concurrently from the start of the build.
- **B.** Configure all three steps without any waitFor or id fields to run them in the default serial order, and rely on Cloud Build to optimize execution.
- **C.** Create three separate Cloud Build triggers, each running one type of test, and use Pub/Sub to coordinate their execution order.
- **D.** Configure the lint step with id: 'lint', unit test step with id: 'unit-test' and waitFor: ['-'], and the integration test step with waitFor: ['lint', 'unit-test']. — _correct answer_

## Question 95

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a data processing pipeline that frequently lists objects in Cloud Storage buckets to check for new files. Each bucket contains thousands of objects, but your application only needs the object name and size for processing decisions. You want to minimize API response payload size and reduce network bandwidth consumption. What should you do?

**Correct answer:** A. Use the fields query parameter to request a partial response containing only the items/name and items/size fields in your list objects API call.

**Options:**

- **A.** Use the fields query parameter to request a partial response containing only the items/name and items/size fields in your list objects API call. — _correct answer_
- **B.** Use the projection parameter set to 'noAcl' to reduce the response size by excluding ACL information from the object metadata.
- **C.** Set the maxResults parameter to a lower value to reduce the amount of data returned per request while maintaining all metadata fields.
- **D.** Configure a Cloud Storage notification to Pub/Sub for object changes instead of polling the bucket with list operations.

## Question 96

**Domain:** Building and testing applications

**Question:** You are developing a Kubernetes application using Cloud Code in IntelliJ. Your application needs to access Google Cloud APIs such as Cloud Storage during local development on a minikube cluster. How should you configure authentication so your application can access these APIs?

**Correct answer:** D. Start minikube with the gcp-auth addon by running 'minikube start --addons gcp-auth' to mount Application Default Credentials in your pods automatically.

**Options:**

- **A.** Export a service account key to a JSON file and add it to your container image during the Docker build process.
- **B.** Create a Kubernetes secret containing API keys and reference the secret in your deployment manifest's environment variables section.
- **C.** Configure the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to a credentials file path that exists only on your host machine.
- **D.** Start minikube with the gcp-auth addon by running 'minikube start --addons gcp-auth' to mount Application Default Credentials in your pods automatically. — _correct answer_

## Question 97

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an application that accesses sensitive data stored in BigQuery within a VPC Service Controls perimeter. External partners need to query specific BigQuery datasets from their on-premises network using a known range of IP addresses. The partners should only have read access to specific tables. What should you configure?

**Correct answer:** C. Create an ingress rule that specifies the partner IP addresses as source and allows only BigQuery read methods to the specific project resources within the perimeter.

**Options:**

- **A.** Configure VPC accessible services to allow only BigQuery API access within the perimeter. Grant the partners a service account with read-only IAM roles on the specific tables.
- **B.** Create a perimeter bridge between your perimeter and a new perimeter containing the partner project. Configure IAM roles to limit access to read-only operations on the datasets.
- **C.** Create an ingress rule that specifies the partner IP addresses as source and allows only BigQuery read methods to the specific project resources within the perimeter. — _correct answer_
- **D.** Create an access level with the partner IP range and add it to the service perimeter. Use IAM roles on the datasets to restrict access to read-only permissions for partner accounts.

## Question 98

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application on Google Cloud. The application needs to display real-time updates to users when other collaborators make changes to shared documents stored in Firestore. You want to minimize costs while ensuring that users see updates immediately. What should you do?

**Correct answer:** B. Implement Firestore snapshot listeners using the onSnapshot method to subscribe to document changes. Keep listeners attached while users have the document open.

**Options:**

- **A.** Configure a Cloud Scheduler job to trigger a Cloud Function every minute that reads all documents and pushes updates to clients via Pub/Sub messages.
- **B.** Implement Firestore snapshot listeners using the onSnapshot method to subscribe to document changes. Keep listeners attached while users have the document open. — _correct answer_
- **C.** Store document data in Memorystore for Redis and use Redis pub/sub for real-time notifications, syncing data from Firestore using Cloud Functions triggers.
- **D.** Implement a polling mechanism that calls the get() method on documents every 2 seconds to check for changes and refresh the user interface accordingly.

## Question 99

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Firestore query that filters on 'country' (equality) and 'salary' (range) fields, then orders results by 'experience' field. The query is scanning many index entries and has high latency. How should you optimize the composite index field order?

**Correct answer:** B. Order the index fields as: country (equality), salary (range), experience (order by) to minimize index entries scanned.

**Options:**

- **A.** Order the index fields as: salary (range), country (equality), experience (order by) to prioritize the range filter.
- **B.** Order the index fields as: country (equality), salary (range), experience (order by) to minimize index entries scanned. — _correct answer_
- **C.** Create separate single-field indexes for each field and let Firestore merge them at query time.
- **D.** Order the index fields as: experience (order by), country (equality), salary (range) to match the query's orderBy clause.

## Question 100

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a Cloud Run API that experiences highly variable traffic with long periods of no requests followed by sudden traffic bursts. You need to balance cost optimization with acceptable response times for the first requests after idle periods. Your budget allows for some idle instance costs. What configuration should you apply?

**Correct answer:** C. Set minimum instances to 1 with request-based billing and enable startup CPU boost.

**Options:**

- **A.** Set minimum instances to 0 with instance-based billing and enable startup CPU boost.
- **B.** Set minimum instances to 0 with request-based billing and disable startup CPU boost.
- **C.** Set minimum instances to 1 with request-based billing and enable startup CPU boost. — _correct answer_
- **D.** Set minimum instances to 10 with instance-based billing and disable startup CPU boost.

## Question 101

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You manage multiple GKE clusters across different Google Cloud projects. You want to configure Workload Identity so that pods in a specific namespace can access resources in a central shared services project. The goal is to minimize the number of IAM service accounts and simplify ongoing management. Which approach should you use?

**Correct answer:** B. Use IAM principal identifiers with the principalSet notation to grant access to all workloads in the target namespace across multiple clusters directly on the resources in the shared services project.

**Options:**

- **A.** Configure the node service accounts for each cluster's node pools with the required permissions and use metadata concealment to control which pods can access those credentials.
- **B.** Use IAM principal identifiers with the principalSet notation to grant access to all workloads in the target namespace across multiple clusters directly on the resources in the shared services project. — _correct answer_
- **C.** Create a single IAM service account in the shared services project, grant it access to all required resources, and configure every Kubernetes service account in the target namespace to impersonate this IAM service account.
- **D.** Export a JSON key from a single IAM service account and store it as a Kubernetes Secret in the target namespace of each cluster, ensuring consistent access across all clusters.

## Question 102

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are migrating a legacy application to Google Cloud. The application uses Cloud SQL for MySQL and experiences performance degradation when executing ORDER BY operations on large result sets. Query execution plans show 'Using temporary; Using filesort' in the Extra column. You need to optimize query performance while minimizing changes to the application. What should you do?

**Correct answer:** D. Create indexes on the columns used in ORDER BY clauses to enable index-based sorting, and analyze the table to update index statistics.

**Options:**

- **A.** Increase the sort_buffer_size database flag to its maximum value and scale up the Cloud SQL instance memory to handle larger sort operations.
- **B.** Enable query caching on the Cloud SQL instance to store sorted results and serve them directly for repeated queries with the same parameters.
- **C.** Modify the application to remove ORDER BY clauses and perform sorting in the application layer using in-memory collections.
- **D.** Create indexes on the columns used in ORDER BY clauses to enable index-based sorting, and analyze the table to update index statistics. — _correct answer_

## Question 103

**Domain:** Building and testing applications

**Question:** You are testing a local application that uses Cloud Client Libraries. The application needs to authenticate using the same permissions as a specific service account. Your organization has disabled service account key creation. What is the Google-recommended approach to configure ADC for this scenario?

**Correct answer:** A. Run gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL to use service account impersonation.

**Options:**

- **A.** Run gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL to use service account impersonation. — _correct answer_
- **B.** Request an exception from your security team to create a service account key file for local development testing purposes.
- **C.** Download the default Compute Engine service account key from the metadata server and use it locally with GOOGLE_APPLICATION_CREDENTIALS.
- **D.** Configure your application to use OAuth 2.0 user credentials directly instead of service account credentials for testing.

## Question 104

**Domain:** Deploying applications

**Question:** Your team is deploying a containerized application on GKE that uses a configuration file. The configuration changes frequently during development, and your team needs to update the configuration without restarting pods. How should you provide the configuration file to your application?

**Correct answer:** A. Create a ConfigMap and mount it as a volume in the pod specification. Configure the application to watch for file changes and reload the configuration.

**Options:**

- **A.** Create a ConfigMap and mount it as a volume in the pod specification. Configure the application to watch for file changes and reload the configuration. — _correct answer_
- **B.** Store the configuration file in Cloud Storage and configure the application to download it at startup. Update the file in Cloud Storage when changes are needed.
- **C.** Create a ConfigMap and expose it as environment variables in the pod specification. Update the ConfigMap when configuration changes.
- **D.** Create a Kubernetes Secret and mount it as a volume in the pod specification. Use kubectl rollout restart after each configuration change.

## Question 105

**Domain:** Integrating applications with Google Cloud services

**Question:** You have deployed a Cloud Run service that processes customer transactions. You want to be notified when the request latency for successful requests exceeds 2 seconds for more than 3 consecutive minutes. You need to configure the alerting policy correctly. What should you configure for the condition?

**Correct answer:** A. Select the run.googleapis.com/request_latencies metric, filter by response_code_class='2xx', set the threshold to 2000ms, and configure a retest window of 3 minutes.

**Options:**

- **A.** Select the run.googleapis.com/request_latencies metric, filter by response_code_class='2xx', set the threshold to 2000ms, and configure a retest window of 3 minutes. — _correct answer_
- **B.** Select the run.googleapis.com/request_latencies metric, group by revision_name, set the threshold to 2 seconds, and configure the incident autoclose duration to 3 minutes.
- **C.** Create a log-based metric from Cloud Run request logs that extracts latency values, then create an alerting policy with a 3-minute notification cooldown.
- **D.** Select the run.googleapis.com/request_count metric, filter by status='success', set the threshold to 2000, and configure an alignment period of 3 minutes.

## Question 106

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company's e-commerce application uses a Cloud SQL for MySQL primary instance to handle both transactional orders and analytics reporting queries. During business hours, analytics queries are causing performance degradation for customer-facing order processing. You need to improve the performance of order processing without affecting the analytics team's ability to run queries. What should you do?

**Correct answer:** A. Create a read replica in the same region as the primary instance and configure the analytics application to connect directly to the read replica using its connection name.

**Options:**

- **A.** Create a read replica in the same region as the primary instance and configure the analytics application to connect directly to the read replica using its connection name. — _correct answer_
- **B.** Create a read replica and configure Cloud SQL to automatically route analytics queries to the replica while sending write operations to the primary.
- **C.** Enable Managed Connection Pooling on the primary instance to handle the increased connection load from both analytics and transactional workloads.
- **D.** Promote the analytics database to a separate primary instance and configure bi-directional replication between the instances.

## Question 107

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an order fulfillment system using Cloud Tasks. Due to the 'at least once' delivery guarantee, your task handler may occasionally process the same order multiple times. You need to prevent duplicate order processing without modifying the downstream inventory system. What should you do?

**Correct answer:** A. Design your handler to be idempotent by storing processed task IDs in Firestore and checking for duplicates before processing each task.

**Options:**

- **A.** Design your handler to be idempotent by storing processed task IDs in Firestore and checking for duplicates before processing each task. — _correct answer_
- **B.** Enable exactly-once delivery mode on the Cloud Tasks queue to prevent duplicate task executions.
- **C.** Configure the queue with max-attempts=1 to ensure each task is delivered exactly once.
- **D.** Use the Retry-After HTTP header in your handler response to control the timing and prevent duplicate deliveries.

## Question 108

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company has multiple Google Cloud projects across different teams. You need to centralize all audit logs from these projects into a single log bucket for compliance analysis. The security team requires that logs from individual projects not be stored in their original project's _Default bucket to avoid duplicate storage costs. What should you do?

**Correct answer:** B. Create an intercepting aggregated sink at the organization level that routes audit logs to a central observability project. Configure sinks in the observability project to route logs to a centralized log bucket.

**Options:**

- **A.** Create a non-intercepting aggregated sink at the organization level that routes audit logs to a centralized log bucket. Add exclusion filters to each project's _Default sink to exclude audit logs.
- **B.** Create an intercepting aggregated sink at the organization level that routes audit logs to a central observability project. Configure sinks in the observability project to route logs to a centralized log bucket. — _correct answer_
- **C.** Create a folder-level aggregated sink that routes all logs to BigQuery for analysis. Configure BigQuery to automatically delete duplicate log entries based on insertId.
- **D.** Create project-level sinks in each project that route audit logs directly to the central log bucket. Disable the _Default sink in each project to prevent duplicate storage.

## Question 109

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an application that processes large datasets stored in Cloud Storage. Your application uses the JSON API to list objects and occasionally receives 429 rateLimitExceeded errors. Your Cloud Storage client library uses automatic retries. You notice some write operations are being duplicated after retries. You need to ensure safe retries without duplicate writes. What should you do?

**Correct answer:** D. Include the ifGenerationMatch precondition in your write requests to make operations conditionally idempotent and safe to retry.

**Options:**

- **A.** Disable automatic retries in the client library and manually implement retry logic with exponential backoff.
- **B.** Configure the client library to use a strict idempotency policy that only retries operations that are always idempotent.
- **C.** Add a random delay before each write operation to reduce the likelihood of concurrent writes causing conflicts.
- **D.** Include the ifGenerationMatch precondition in your write requests to make operations conditionally idempotent and safe to retry. — _correct answer_

## Question 110

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an order processing application using Cloud Tasks to handle asynchronous order fulfillment requests. Your target service occasionally becomes overloaded and returns HTTP errors. You need to configure retry behavior that allows Cloud Tasks to automatically adapt to your service's capacity constraints. Which HTTP response codes should your service return to signal Cloud Tasks to apply a higher backoff rate beyond the configured rate limits?

**Correct answer:** D. HTTP 429 (Too Many Requests) and HTTP 503 (Service Unavailable)

**Options:**

- **A.** HTTP 404 (Not Found) and HTTP 502 (Bad Gateway)
- **B.** HTTP 400 (Bad Request) and HTTP 401 (Unauthorized)
- **C.** HTTP 500 (Internal Server Error) and HTTP 504 (Gateway Timeout)
- **D.** HTTP 429 (Too Many Requests) and HTTP 503 (Service Unavailable) — _correct answer_

## Question 111

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an event-driven application that uses Cloud Tasks to send order confirmation emails. Due to occasional network issues, your email service sometimes fails and tasks are retried. You want to prevent duplicate emails from being sent to customers. How should you implement idempotency for your task handlers?

**Correct answer:** C. Include a unique order ID in the task payload and check a database to verify if the email was already sent before processing each task.

**Options:**

- **A.** Set maxAttempts to 1 in the queue configuration to ensure each task is only attempted once and never retried.
- **B.** Return HTTP 200 from your handler immediately before processing to mark the task as complete and prevent retries.
- **C.** Include a unique order ID in the task payload and check a database to verify if the email was already sent before processing each task. — _correct answer_
- **D.** Configure the queue with deduplication enabled and rely on Cloud Tasks to automatically prevent duplicate task executions.

## Question 112

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** A Cloud Run service in your project needs to retrieve an API key stored in Secret Manager from a different project. The secret was created with automatic replication. The Cloud Run service's identity is a user-managed service account. When the service attempts to access the secret, it receives a permission denied error. What should you do to resolve this issue?

**Correct answer:** C. Grant the Secret Manager Secret Accessor role to the Cloud Run service account on the specific secret in the other project.

**Options:**

- **A.** Enable the Secret Manager API in the Cloud Run project and create a new secret with the same value in that project.
- **B.** Configure VPC Service Controls with an access level that allows the Cloud Run service to access Secret Manager in the other project.
- **C.** Grant the Secret Manager Secret Accessor role to the Cloud Run service account on the specific secret in the other project. — _correct answer_
- **D.** Grant the roles/owner role to the Cloud Run service account at the organization level to enable access to all secrets across all projects.

## Question 113

**Domain:** Deploying applications

**Question:** Your team is setting up a Cloud Build pipeline to deploy a containerized application to Cloud Run. You need to ensure that each deployment uses a unique, traceable image tag that corresponds to the specific code commit. The pipeline should automatically tag images during the build process. What should you configure in your cloudbuild.yaml file?

**Correct answer:** D. Use the $COMMIT_SHA substitution variable in the image tag to automatically tag images with the Git commit hash.

**Options:**

- **A.** Use the $BUILD_ID variable to tag images since it generates a unique identifier for each build execution.
- **B.** Configure the docker build step to use the 'latest' tag and enable automatic version incrementing.
- **C.** Create a custom script step that queries the Git repository for the commit hash and stores it in an environment variable.
- **D.** Use the $COMMIT_SHA substitution variable in the image tag to automatically tag images with the Git commit hash. — _correct answer_

## Question 114

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a microservices application deployed to Cloud Run. Your team needs to collect custom application metrics such as request counts and business KPIs. You want to follow Google-recommended practices for metrics collection in serverless environments. What should you do?

**Correct answer:** D. Deploy the Managed Service for Prometheus sidecar alongside your Cloud Run service container to scrape Prometheus-format metrics and send them to Cloud Monitoring.

**Options:**

- **A.** Configure your Cloud Run service to write metrics directly to Cloud Logging, then create log-based metrics that extract the application data for dashboards and alerting.
- **B.** Install the Ops Agent on the underlying Cloud Run infrastructure to collect metrics from your application containers automatically.
- **C.** Configure Cloud Monitoring API calls directly from your application code using the Cloud Client Libraries to write custom metrics on each request.
- **D.** Deploy the Managed Service for Prometheus sidecar alongside your Cloud Run service container to scrape Prometheus-format metrics and send them to Cloud Monitoring. — _correct answer_

## Question 115

**Domain:** Building and testing applications

**Question:** You are debugging a Java application deployed to a local Kubernetes cluster using Cloud Code in VS Code. When you set breakpoints and run the Debug on Kubernetes command, the breakpoints are not being hit. You have verified that requests are reaching the application. What is the most likely cause and solution?

**Correct answer:** C. Cloud Code automatically injects the JAVA_TOOL_OPTIONS environment variable with JDWP configuration, but an existing JAVA_TOOL_OPTIONS setting in your container may be overriding it. Remove or modify the existing setting to allow Cloud Code's debug configuration.

**Options:**

- **A.** The skaffold.yaml file is missing the debug profile configuration. Add a debug profile that builds the application with the -g flag to include debug symbols.
- **B.** The source mapping between local files and remote container paths is incorrect. Configure the sourceFileMap in the .vscode/launch.json debug section to map the workspace folder to the correct application directory in the container.
- **C.** Cloud Code automatically injects the JAVA_TOOL_OPTIONS environment variable with JDWP configuration, but an existing JAVA_TOOL_OPTIONS setting in your container may be overriding it. Remove or modify the existing setting to allow Cloud Code's debug configuration. — _correct answer_
- **D.** The application is running in release mode rather than debug mode. Modify the Dockerfile to set the JAVA_DEBUG environment variable to true and rebuild the container.

## Question 116

**Domain:** Deploying applications

**Question:** You are managing a microservices application on GKE. Your team needs to be notified when specific application error messages appear in container logs. The notifications should trigger immediately when a matching log entry is detected, and the solution should be simple to configure. What should you do?

**Correct answer:** B. Create a log-based alerting policy in Cloud Logging that matches the error message pattern and configure notification channels.

**Options:**

- **A.** Export logs to BigQuery using a sink, then create a scheduled query to detect error patterns and send alerts via Cloud Functions.
- **B.** Create a log-based alerting policy in Cloud Logging that matches the error message pattern and configure notification channels. — _correct answer_
- **C.** Create a user-defined counter metric based on the error log pattern, then create an alerting policy in Cloud Monitoring to trigger when the counter exceeds zero.
- **D.** Create an exclusion filter in Cloud Logging to route error logs to a dedicated log bucket and enable alerting on that bucket.

## Question 117

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You deployed a containerized application to a GKE Standard cluster with Workload Identity Federation for GKE enabled. The application fails to authenticate to Cloud Storage during the first few seconds after Pod startup. The error message indicates that the metadata server could not be found. The application works correctly after waiting approximately 10 seconds. You need to resolve this authentication issue with minimal code changes. What should you do?

**Correct answer:** B. Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container by making requests to the metadata server endpoint with retries.

**Options:**

- **A.** Increase the CPU and memory resources allocated to the kube-system namespace to ensure that the GKE metadata server DaemonSet Pod has enough resources to start quickly.
- **B.** Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container by making requests to the metadata server endpoint with retries. — _correct answer_
- **C.** Create a Kubernetes Secret containing a service account key and mount it in your application Pod. Update your application to use the key file path for authentication instead of metadata server.
- **D.** Disable Workload Identity Federation for GKE on the node pool and use the node's Compute Engine default service account credentials for authentication instead of pod-level identity.

## Question 118

**Domain:** Building and testing applications

**Question:** You are implementing a blue-green deployment strategy for your Cloud Run service using traffic tags. After deploying a new revision tagged 'green' with 0% traffic, you want to test it directly before migrating any production traffic. How can you access the new revision for testing without affecting the production URL?

**Correct answer:** D. Access the revision at its tag-specific URL using the format https://green---SERVICE_NAME-PROJECT_HASH.REGION.run.app, which routes requests directly to the tagged revision regardless of traffic split configuration.

**Options:**

- **A.** Temporarily set the traffic split to route 1% of traffic to the green revision, then filter production logs to verify requests are being handled correctly by the new revision.
- **B.** Access the revision by adding a custom HTTP header 'X-Cloud-Run-Revision: green' to requests sent to the production URL, which routes the request to the specified revision.
- **C.** Access the revision at a URL derived from the revision name using the format https://REVISION_NAME.REGION.run.app, which provides direct access to any deployed revision.
- **D.** Access the revision at its tag-specific URL using the format https://green---SERVICE_NAME-PROJECT_HASH.REGION.run.app, which routes requests directly to the tagged revision regardless of traffic split configuration. — _correct answer_

## Question 119

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company runs a mission-critical application that stores user shopping cart data in Memorystore for Redis. The operations team requires the cache to remain available even during zonal outages and needs to minimize data loss during failover events. The application must also support scaling read queries. How should you configure the Memorystore instance?

**Correct answer:** D. Deploy a Standard Tier Memorystore for Redis instance with read replicas enabled across multiple zones.

**Options:**

- **A.** Deploy a Standard Tier instance and configure the application to connect directly to the replica node for all operations.
- **B.** Deploy two Basic Tier Memorystore for Redis instances in different zones and configure your application to handle replication.
- **C.** Deploy a Basic Tier Memorystore for Redis instance with RDB snapshots enabled at 1-hour intervals.
- **D.** Deploy a Standard Tier Memorystore for Redis instance with read replicas enabled across multiple zones. — _correct answer_

## Question 120

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are configuring VPC Service Controls for a Shared VPC environment where the host project contains VPC networks and multiple service projects run workloads that access Cloud Storage. After enabling the service perimeter, the service projects cannot access Cloud Storage. What is the most likely cause of this issue?

**Correct answer:** D. The host project is not included in the same service perimeter as the service projects, causing network endpoints to appear outside the perimeter.

**Options:**

- **A.** The service projects are using public IP addresses instead of Private Google Access to reach Cloud Storage.
- **B.** The ingress rules for the service perimeter do not allow the service account identities used by the service projects.
- **C.** The Cloud Storage API is not added to the VPC accessible services list for the perimeter.
- **D.** The host project is not included in the same service perimeter as the service projects, causing network endpoints to appear outside the perimeter. — _correct answer_

## Question 121

**Domain:** Building and testing applications

**Question:** You are setting up a Cloud Build CI/CD pipeline to build and store container images in an Artifact Registry repository. The Artifact Registry repository is in a different Google Cloud project than where Cloud Build runs. When you attempt to run the build, it fails with a permission denied error when pushing the image. What should you do?

**Correct answer:** D. Grant the Artifact Registry Writer role to the Cloud Build service account on the Artifact Registry repository project.

**Options:**

- **A.** Enable the Artifact Registry API in the Cloud Build project and retry the build.
- **B.** Create the Artifact Registry repository in the same project as Cloud Build to use automatic permission grants.
- **C.** Use a user-specified service account with Storage Object Creator permissions on the Artifact Registry bucket.
- **D.** Grant the Artifact Registry Writer role to the Cloud Build service account on the Artifact Registry repository project. — _correct answer_

## Question 122

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run application needs to access API credentials stored in Secret Manager. The credentials are updated periodically, and you want your application to automatically use the updated credentials without requiring a new deployment. You also want to minimize cold start latency. What should you do?

**Correct answer:** D. Mount the secret as a volume in your Cloud Run service, and configure your application to read the credentials from the mounted file path when needed.

**Options:**

- **A.** Expose the secret as an environment variable in your Cloud Run service configuration, referencing the 'latest' version alias.
- **B.** Use the Secret Manager client library to fetch credentials at application startup and cache them in memory for the instance lifetime.
- **C.** Configure a Pub/Sub subscription to receive secret update notifications and trigger a Cloud Build pipeline to redeploy your Cloud Run service automatically.
- **D.** Mount the secret as a volume in your Cloud Run service, and configure your application to read the credentials from the mounted file path when needed. — _correct answer_

## Question 123

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization wants to implement least privileged access for Secret Manager secrets. A development team needs to add new versions to existing secrets but should not be able to read the secret values. Which IAM role should you grant to the development team?

**Correct answer:** A. Grant the Secret Manager Secret Version Adder role (roles/secretmanager.secretVersionAdder) on the specific secrets.

**Options:**

- **A.** Grant the Secret Manager Secret Version Adder role (roles/secretmanager.secretVersionAdder) on the specific secrets. — _correct answer_
- **B.** Grant the Secret Manager Admin role (roles/secretmanager.admin) on the project with an IAM condition that denies access operations.
- **C.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secrets.
- **D.** Grant the Secret Manager Secret Version Manager role (roles/secretmanager.secretVersionManager) on the specific secrets.

## Question 124

**Domain:** Deploying applications

**Question:** You are deploying a new version of your application to a GKE cluster. After applying the new deployment YAML manifest, you notice that the new Pods are failing to start due to an incorrect image tag. Users are experiencing intermittent errors because some traffic is being routed to the failing Pods. You need to quickly revert to the previous working version of your application. What should you do?

**Correct answer:** B. Run 'kubectl rollout undo deployment/your-deployment' to roll back to the previous revision.

**Options:**

- **A.** Scale the deployment to zero replicas using 'kubectl scale deployment/your-deployment --replicas=0' until the issue is resolved.
- **B.** Run 'kubectl rollout undo deployment/your-deployment' to roll back to the previous revision. — _correct answer_
- **C.** Run 'kubectl delete deployment/your-deployment' and then apply the previous YAML manifest manually.
- **D.** Run 'kubectl set image deployment/your-deployment container=previous-image:tag' to update to the previous image tag.

## Question 125

**Domain:** Deploying applications

**Question:** Your team is developing a Cloud Run application that uses API keys stored in Secret Manager. The application reads the API key once at startup. You need to ensure that if the secret is unavailable or deleted, the application fails fast rather than starting and then encountering errors during runtime. How should you configure the secret access?

**Correct answer:** B. Configure the secret as an environment variable in the Cloud Run service configuration.

**Options:**

- **A.** Configure a startup probe that verifies the secret is accessible before accepting traffic.
- **B.** Configure the secret as an environment variable in the Cloud Run service configuration. — _correct answer_
- **C.** Configure the secret as a mounted volume in the Cloud Run service configuration.
- **D.** Use the Secret Manager client library to fetch the secret in the application main function.

## Question 126

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing time-series metrics data in Cloud Bigtable for a monitoring application. Users frequently query for the most recent data points for each monitored resource. You want to optimize read performance for these queries while avoiding hotspots. What row key design pattern should you implement?

**Correct answer:** C. Use resource_id#reversed_timestamp as the row key, where reversed_timestamp is calculated by subtracting the actual timestamp from a maximum value.

**Options:**

- **A.** Use resource_id#timestamp as the row key and enable reverse scans to read recent data first.
- **B.** Use reversed_timestamp#resource_id as the row key to group all recent data together for faster access.
- **C.** Use resource_id#reversed_timestamp as the row key, where reversed_timestamp is calculated by subtracting the actual timestamp from a maximum value. — _correct answer_
- **D.** Store all metrics in a single row per resource using cell timestamps for versioning, and use timestamp filters to retrieve recent data.

## Question 127

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service that uses multiple secrets from Secret Manager exposed as environment variables. Your team follows a release process where configuration changes are tested in staging before production. What is the Google-recommended approach for referencing secret versions?

**Correct answer:** C. Pin secrets to specific version numbers and update the version references through your release process.

**Options:**

- **A.** Always use the latest version alias to ensure the application uses the most current secrets.
- **B.** Store the version number in a separate configuration file and read it at application startup.
- **C.** Pin secrets to specific version numbers and update the version references through your release process. — _correct answer_
- **D.** Create separate secrets for each environment and use the latest version in all environments.

## Question 128

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is running a GKE Standard cluster with Workload Identity Federation enabled. After deploying a new application, you notice that authentication to Google Cloud APIs fails intermittently during the first few seconds after pod startup. The application then works correctly after a manual retry. You want to implement a solution that handles this behavior automatically without modifying application code. What should you do?

**Correct answer:** C. Deploy an initContainer that waits until the GKE metadata server is ready before the main application container starts.

**Options:**

- **A.** Store the IAM service account key as a Kubernetes Secret and configure the application to use Application Default Credentials from the mounted secret file.
- **B.** Configure the Kubernetes ServiceAccount to use the node's service account credentials instead of Workload Identity Federation for GKE.
- **C.** Deploy an initContainer that waits until the GKE metadata server is ready before the main application container starts. — _correct answer_
- **D.** Disable Workload Identity Federation for GKE on the node pool and enable metadata concealment to protect sensitive metadata instead.

## Question 129

**Domain:** Building and testing applications

**Question:** You have finished local development and testing of your application using Application Default Credentials configured with your user account. Before committing your code to the repository, you want to ensure no local credentials remain that could pose a security risk. What command should you run to properly remove the local ADC credentials?

**Correct answer:** C. Run gcloud auth application-default revoke to remove the local ADC credentials file.

**Options:**

- **A.** Delete the JSON file at $HOME/.config/gcloud/credentials.db to remove all stored credentials.
- **B.** Run gcloud auth revoke to remove both gcloud CLI and ADC credentials simultaneously.
- **C.** Run gcloud auth application-default revoke to remove the local ADC credentials file. — _correct answer_
- **D.** Run unset GOOGLE_APPLICATION_CREDENTIALS to clear the environment variable pointing to credentials.

## Question 130

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a CPU-intensive API using Cloud Run that processes image transformations. Your application is single-threaded due to a legacy library constraint, but you allocated 4 vCPUs per instance because the application requires 8 GiB of memory. During load testing, you notice that the application is not scaling properly despite high latency. Upon investigation, you see that average CPU utilization remains low even when requests are queuing. What should you do to improve the autoscaling behavior?

**Correct answer:** B. Lower the maximum concurrency setting to encourage scaling based on request throughput instead of CPU utilization.

**Options:**

- **A.** Increase the request timeout setting to give instances more time to process requests before autoscaling.
- **B.** Lower the maximum concurrency setting to encourage scaling based on request throughput instead of CPU utilization. — _correct answer_
- **C.** Increase the maximum instances limit to allow Cloud Run to provision more instances during traffic spikes.
- **D.** Enable instance-based billing to allocate CPU continuously and improve CPU utilization calculations for autoscaling.

## Question 131

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You deployed a VPC Service Controls perimeter that protects your BigQuery datasets. Users outside the perimeter are receiving 'Request is prohibited by organization's policy' errors when trying to access BigQuery from their workstations. You need to diagnose why specific requests are being denied. What should you do?

**Correct answer:** C. Find the unique ID from the VPC Service Controls denial in Cloud Audit Logs. Use the VPC Service Controls troubleshooter or violation analyzer to diagnose the access denial.

**Options:**

- **A.** Review the Cloud Storage audit logs for the BigQuery datasets to identify which users are being denied access.
- **B.** Check the VPC flow logs from the users' network to identify which packets are being blocked by the perimeter.
- **C.** Find the unique ID from the VPC Service Controls denial in Cloud Audit Logs. Use the VPC Service Controls troubleshooter or violation analyzer to diagnose the access denial. — _correct answer_
- **D.** Add all users to an access level with 'any IP' to temporarily allow access, then progressively restrict the IP ranges until failures occur again.

## Question 132

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a data analytics platform where a project inside a VPC Service Controls perimeter needs to read public datasets from BigQuery that are located in a Google-managed project outside the perimeter. You must maintain perimeter security while enabling this access with minimal risk. What should you do?

**Correct answer:** D. Create an egress rule in the service perimeter that specifies the external BigQuery dataset project and restricts the allowed operations to read-only methods using permission selectors.

**Options:**

- **A.** Create an ingress rule allowing the BigQuery service account from the external project to access resources in your perimeter, restricting the allowed methods to read operations.
- **B.** Create a perimeter bridge between your project and the Google-managed BigQuery public dataset project to enable bidirectional communication between the perimeters.
- **C.** Add the external BigQuery project to your existing service perimeter to include it within the security boundary, enabling unrestricted access to the public datasets.
- **D.** Create an egress rule in the service perimeter that specifies the external BigQuery dataset project and restricts the allowed operations to read-only methods using permission selectors. — _correct answer_

## Question 133

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an application that stores sensitive customer data in Cloud SQL. Your company's compliance team requires that all data be encrypted with customer-managed encryption keys (CMEK) stored in Cloud KMS. The Cloud SQL instance is deployed in the us-east1 region. When you attempt to configure CMEK for the Cloud SQL instance, the operation fails with a region mismatch error. What should you do to resolve this issue?

**Correct answer:** A. Create a Cloud KMS key ring in the us-east1 location and create a new symmetric key within that key ring. Use this key for CMEK encryption of the Cloud SQL instance.

**Options:**

- **A.** Create a Cloud KMS key ring in the us-east1 location and create a new symmetric key within that key ring. Use this key for CMEK encryption of the Cloud SQL instance. — _correct answer_
- **B.** Create a Cloud KMS key ring in the global location and create a new symmetric key. Grant the Cloud SQL service account the CryptoKey Encrypter/Decrypter role on the key.
- **C.** Create a Cloud KMS key ring in the us multi-region location and create a new symmetric key. Configure the Cloud SQL instance to use this key for encryption.
- **D.** Create a Cloud KMS key ring in any regional location and import an existing AES-256 key. Associate this imported key with the Cloud SQL instance for CMEK encryption.

## Question 134

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that requires database credentials stored in Secret Manager. The service fails to start, and the deployment logs show 'Permission denied' errors when accessing secrets. The Cloud Run service account is the default compute service account. What should you do to resolve this issue?

**Correct answer:** C. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service identity on the specific secret.

**Options:**

- **A.** Store the database credentials directly in Cloud Run environment variables to bypass Secret Manager permission requirements.
- **B.** Create a new secret with public read access enabled to allow the Cloud Run service to access the credentials without IAM configuration.
- **C.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service identity on the specific secret. — _correct answer_
- **D.** Grant the Editor role (roles/editor) to the Cloud Run service identity at the project level to enable access to all secrets.

## Question 135

**Domain:** Building and testing applications

**Question:** You have configured traffic splitting on your Cloud Run service to send 80% of traffic to revision A and 20% to revision B for testing. After completing testing, you deploy a new revision C. You expect revision C to receive all traffic, but instead the traffic split pattern persists with revision A and B still receiving their configured percentages. What should you do to ensure new deployments receive 100% of traffic?

**Correct answer:** A. Use 'gcloud run services update-traffic SERVICE --to-latest' to configure the service to route all traffic to the latest revision and override the existing traffic split.

**Options:**

- **A.** Use 'gcloud run services update-traffic SERVICE --to-latest' to configure the service to route all traffic to the latest revision and override the existing traffic split. — _correct answer_
- **B.** Redeploy revision C with the --force-latest flag to override the existing traffic configuration and serve all traffic.
- **C.** Modify the service YAML to remove the traffic stanza and apply it using 'gcloud run services replace service.yaml' to reset traffic routing.
- **D.** Delete revisions A and B using 'gcloud run revisions delete' to automatically redirect all traffic to revision C.

## Question 136

**Domain:** Deploying applications

**Question:** Your Cloud Run application reads database credentials from Secret Manager. The security team has implemented a policy requiring credentials to be rotated every 30 days. You need to configure the Cloud Run service to automatically use updated credentials after rotation without requiring redeployment. What should you do?

**Correct answer:** B. Mount the secret as a volume and reference the 'latest' version. Configure your application to read the credentials from the mounted file path.

**Options:**

- **A.** Expose the secret as an environment variable using the 'latest' version alias and configure the application to read from the environment variable.
- **B.** Mount the secret as a volume and reference the 'latest' version. Configure your application to read the credentials from the mounted file path. — _correct answer_
- **C.** Use the Secret Manager client library in your application code to fetch the secret at each database connection, implementing caching with a 30-day TTL.
- **D.** Configure Eventarc to listen for secret version changes and trigger a Cloud Run service redeployment when a new version is created.

## Question 137

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team needs to receive Cloud Monitoring alerts through an automated incident management system that transforms alert payloads before routing them to different on-call teams. You need a notification channel that supports reliable message delivery and custom processing. What should you use?

**Correct answer:** A. Configure a Pub/Sub notification channel and create a Cloud Function that subscribes to the topic to transform and route alert notifications.

**Options:**

- **A.** Configure a Pub/Sub notification channel and create a Cloud Function that subscribes to the topic to transform and route alert notifications. — _correct answer_
- **B.** Configure a webhook notification channel pointing directly to your incident management system's API endpoint for real-time alert delivery.
- **C.** Configure a Slack notification channel and use Slack's workflow automation to transform and route alerts to appropriate channels.
- **D.** Configure an email notification channel and use email parsing rules in your incident management system to extract and route alerts.

## Question 138

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a collaborative task management application using Firestore. When tasks are updated, you need to display different UI indicators depending on whether a task was newly created, modified, or deleted. You are using snapshot listeners on a task collection. How should you implement this functionality?

**Correct answer:** C. Process the DocumentChange objects in the query snapshot and check the change type property (ADDED, MODIFIED, or REMOVED) for each change to determine the appropriate UI indicator.

**Options:**

- **A.** Query the Firestore audit log after each snapshot event to determine what type of operation triggered the change in the task collection.
- **B.** Create separate snapshot listeners for each operation type by using different query filters to listen for created, updated, and deleted tasks independently.
- **C.** Process the DocumentChange objects in the query snapshot and check the change type property (ADDED, MODIFIED, or REMOVED) for each change to determine the appropriate UI indicator. — _correct answer_
- **D.** Maintain a local copy of all task documents and manually compare document IDs and data fields to detect additions, modifications, and deletions.

## Question 139

**Domain:** Building and testing applications

**Question:** Your team is starting a new cloud-native project that will run containerized microservices on GKE. You need to set up local development environments using Cloud Code in VS Code for your developers. The developers want to build and test containers locally before deploying. You want to minimize manual configuration efforts. What prerequisites should you ensure are available on developers' machines before installing the Cloud Code extension?

**Correct answer:** C. Install Docker and Git on developers' machines and ensure they are added to the PATH environment variable.

**Options:**

- **A.** Install only the gcloud CLI and configure Application Default Credentials on developers' machines.
- **B.** Install Kubernetes, Helm, and Terraform on developers' machines to enable full infrastructure-as-code capabilities.
- **C.** Install Docker and Git on developers' machines and ensure they are added to the PATH environment variable. — _correct answer_
- **D.** Install Docker, Git, kubectl, Skaffold, minikube, and manually configure the Kubernetes context on each developer's machine.

## Question 140

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is building a real-time leaderboard for a gaming application using Cloud Run and Memorystore for Redis. The leaderboard needs to track player scores and rankings that update continuously. You want to implement an efficient caching strategy that keeps the leaderboard current while handling high read volumes. What approach should you implement?

**Correct answer:** B. Use Redis Sorted Sets to store player scores in Memorystore with write-through caching, updating scores directly in Redis when they change.

**Options:**

- **A.** Store the leaderboard data only in Cloud SQL and cache the entire leaderboard as a single JSON object in Memorystore with a long TTL.
- **B.** Use Redis Sorted Sets to store player scores in Memorystore with write-through caching, updating scores directly in Redis when they change. — _correct answer_
- **C.** Implement cache-aside pattern by querying Cloud SQL for every leaderboard request and caching results for 5 minutes.
- **D.** Store player scores in BigQuery and use Memorystore as a read-through cache that automatically syncs with BigQuery.

## Question 141

**Domain:** Deploying applications

**Question:** Your team is deploying a microservices application to Cloud Run. Each service needs access to its own database password stored in Secret Manager. You want to follow security best practices while minimizing operational overhead. How should you configure the IAM permissions for secret access?

**Correct answer:** D. Create a dedicated service account for each Cloud Run service and grant the Secret Manager Secret Accessor role on only the specific secret that each service needs.

**Options:**

- **A.** Create a single shared service account for all Cloud Run services and grant Secret Manager Admin role at the project level.
- **B.** Store all database passwords in a single secret as JSON and grant all service accounts access to this combined secret.
- **C.** Use the default Compute Engine service account for all Cloud Run services and grant it Secret Manager Secret Accessor role at the project level.
- **D.** Create a dedicated service account for each Cloud Run service and grant the Secret Manager Secret Accessor role on only the specific secret that each service needs. — _correct answer_

## Question 142

**Domain:** Integrating applications with Google Cloud services

**Question:** You are designing a multi-tier application on GKE that connects to Cloud SQL for PostgreSQL. Your security team requires that all database connections be encrypted without managing SSL certificates, and that access control be based on IAM permissions rather than database usernames and passwords. You also need to minimize operational overhead. What should you do?

**Correct answer:** A. Deploy the Cloud SQL Auth Proxy as a sidecar container in each application pod and configure Workload Identity to authenticate using the pod's Kubernetes service account.

**Options:**

- **A.** Deploy the Cloud SQL Auth Proxy as a sidecar container in each application pod and configure Workload Identity to authenticate using the pod's Kubernetes service account. — _correct answer_
- **B.** Enable IAM database authentication on Cloud SQL and have each pod connect directly using the service account's OAuth token as the password.
- **C.** Configure a VPN tunnel between GKE and Cloud SQL to ensure encrypted traffic, and use database users with IP-based allow lists.
- **D.** Configure SSL certificates on the Cloud SQL instance and distribute client certificates to each pod through Kubernetes Secrets.

## Question 143

**Domain:** Deploying applications

**Question:** You are deploying a new containerized application to a GKE cluster. You have a YAML manifest file that defines a Deployment with three replicas. The application image is stored in Artifact Registry. You want to deploy the application and ensure that future updates to the manifest can be applied declaratively. What should you do?

**Correct answer:** C. Run kubectl apply -f deployment.yaml to create the Deployment and enable declarative management of the resource through subsequent apply commands.

**Options:**

- **A.** Run kubectl replace -f deployment.yaml to create the Deployment. For updates, modify the manifest and run kubectl replace again.
- **B.** Run kubectl create -f deployment.yaml to create the Deployment. For future updates, modify the file and run kubectl create again with the --save-config flag.
- **C.** Run kubectl apply -f deployment.yaml to create the Deployment and enable declarative management of the resource through subsequent apply commands. — _correct answer_
- **D.** Run kubectl create deployment --image=us-docker.pkg.dev/project/repo/app:v1 --replicas=3 to create the Deployment, then use kubectl edit to make configuration changes.

## Question 144

**Domain:** Building and testing applications

**Question:** You are deploying an API using Cloud Endpoints with an OpenAPI specification document. Your specification includes required parameter definitions and JSON schema types for request validation. During testing, you notice that requests with missing required parameters are still being forwarded to your backend. What explains this behavior?

**Correct answer:** D. ESP and ESPv2 do not enforce required parameter and type definitions from the OpenAPI document; they forward incoming requests to the API backend regardless.

**Options:**

- **A.** You need to configure API key validation in your OpenAPI security definitions to enable request parameter enforcement.
- **B.** The gcloud endpoints services deploy command failed to properly parse the required parameter definitions from your OpenAPI document.
- **C.** The OpenAPI specification version 2.0 does not support required parameter enforcement, and you need to upgrade to version 3.0 for validation.
- **D.** ESP and ESPv2 do not enforce required parameter and type definitions from the OpenAPI document; they forward incoming requests to the API backend regardless. — _correct answer_

## Question 145

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application is making frequent Cloud Storage JSON API calls to list and retrieve objects. During peak usage, you start receiving HTTP 429 errors with 'rateLimitExceeded' in the response. You need to implement error handling to ensure reliable operation while following Google-recommended best practices. What should you do?

**Correct answer:** C. Implement exponential backoff with jitter by using wait times of min((2^n + random_milliseconds), max_backoff) where n increments with each retry attempt.

**Options:**

- **A.** Catch the 429 error and switch to a different Cloud Storage region to distribute API requests across Google's infrastructure.
- **B.** Implement a fixed retry interval of 1 second between each failed request to ensure consistent spacing of API calls during rate limiting events.
- **C.** Implement exponential backoff with jitter by using wait times of min((2^n + random_milliseconds), max_backoff) where n increments with each retry attempt. — _correct answer_
- **D.** Immediately retry any failed request without delay, as 429 errors are typically transient and resolve quickly with the next attempt.

## Question 146

**Domain:** Building and testing applications

**Question:** Your application makes calls to Google Cloud APIs during local development with Cloud Code. When you attempt to run and debug the application locally, you receive an error message indicating that the application cannot authenticate to Google Cloud services. What should you do to resolve this authentication issue?

**Correct answer:** A. Sign in to Google Cloud using the Cloud Code status bar and authenticate your credentials for debugging applications that make Google API calls.

**Options:**

- **A.** Sign in to Google Cloud using the Cloud Code status bar and authenticate your credentials for debugging applications that make Google API calls. — _correct answer_
- **B.** Install kubectl separately and configure it with cluster credentials to enable API access from your local application.
- **C.** Configure a Cloud SQL Auth Proxy in your local development environment to handle authentication for all Google Cloud API calls.
- **D.** Create a service account key file, download it to your local machine, and set the GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to this file.

## Question 147

**Domain:** Integrating applications with Google Cloud services

**Question:** Your development team is deploying a new version of their containerized application to GKE. They want to proactively monitor CPU limit utilization to prevent performance degradation. You need to create an alerting policy that notifies the team when any container's average CPU limit utilization exceeds 80% for more than five minutes. How should you configure the alert condition?

**Correct answer:** A. Select the kubernetes.io/container/cpu/limit_utilization metric, configure a rolling window of 1 minute with the mean function, set a threshold condition to trigger when any time series exceeds 0.8, and configure a 5-minute retest window.

**Options:**

- **A.** Select the kubernetes.io/container/cpu/limit_utilization metric, configure a rolling window of 1 minute with the mean function, set a threshold condition to trigger when any time series exceeds 0.8, and configure a 5-minute retest window. — _correct answer_
- **B.** Select the kubernetes.io/container/cpu/core_usage_time metric, configure a rolling window of 5 minutes with the sum function, set a threshold condition to trigger when any time series exceeds 80.
- **C.** Select the container/cpu/utilization metric from GKE system metrics, configure a rolling window of 5 minutes, set a threshold to trigger when usage exceeds 80%, and configure notifications.
- **D.** Select the kubernetes.io/container/cpu/request_utilization metric, configure a rolling window of 5 minutes with the max function, set a threshold condition to trigger when any time series exceeds 80.

## Question 148

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an e-commerce application on Cloud Run that needs to cache product catalog data from Cloud SQL to improve read performance. Product data changes infrequently but is read thousands of times per day. You want to implement a caching strategy using Memorystore for Redis that minimizes initial latency overhead while ensuring data consistency when products are updated. What should you do?

**Correct answer:** D. Implement a cache-aside pattern where your application checks Memorystore first, queries Cloud SQL on cache miss, and writes the result to cache with a TTL. When product data is updated, invalidate the corresponding cache key.

**Options:**

- **A.** Store product data exclusively in Memorystore without Cloud SQL backup, and configure RDB snapshots for persistence to ensure data durability across instance restarts.
- **B.** Implement a write-through pattern where every database read operation writes directly to Memorystore, and use the noeviction maxmemory policy to retain all cached data indefinitely without expiration.
- **C.** Configure Cloud SQL to automatically sync all table rows to Memorystore using database triggers, and enable the allkeys-random eviction policy to randomly remove keys when memory pressure occurs.
- **D.** Implement a cache-aside pattern where your application checks Memorystore first, queries Cloud SQL on cache miss, and writes the result to cache with a TTL. When product data is updated, invalidate the corresponding cache key. — _correct answer_

## Question 149

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is storing website analytics data in Cloud Bigtable. The row key format is the full domain name (e.g., www.example.com) followed by the timestamp. You need to query all data for a domain and its subdomains efficiently. What row key design change should you implement?

**Correct answer:** A. Use a reverse domain name format (com.example.www) as the row key prefix to group related domains together for efficient range scans.

**Options:**

- **A.** Use a reverse domain name format (com.example.www) as the row key prefix to group related domains together for efficient range scans. — _correct answer_
- **B.** Hash the domain name to create a uniform distribution of row keys and prevent hotspots during writes.
- **C.** Create separate tables for each top-level domain to organize the data by domain hierarchy and query specific domains efficiently.
- **D.** Store the domain name in a column and use a random UUID as the row key for even distribution across nodes.

## Question 150

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a high-traffic REST API that will be deployed to Cloud Run. The application is written in Python and is single-threaded due to the GIL (Global Interpreter Lock). To meet memory requirements, you must allocate 4 vCPUs to each instance. During load testing, you notice that the service is not scaling appropriately even under high load. The Cloud Run autoscaler is not starting new instances despite the application processing requests slowly. What should you do to ensure proper autoscaling?

**Correct answer:** A. Lower the maximum concurrency setting to encourage scaling sooner based on request throughput rather than relying on CPU-based autoscaling.

**Options:**

- **A.** Lower the maximum concurrency setting to encourage scaling sooner based on request throughput rather than relying on CPU-based autoscaling. — _correct answer_
- **B.** Increase the maximum concurrency setting to 1000 to allow each instance to handle more requests simultaneously.
- **C.** Enable startup CPU boost to provide additional CPU during container startup and help the autoscaler respond more quickly to traffic.
- **D.** Enable instance-based billing to allocate CPU for the entire container instance lifecycle and improve autoscaling performance.

## Question 151

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service needs to process Pub/Sub messages and perform background tasks after returning HTTP responses to clients. The service uses request-based billing and you notice that background tasks fail to complete. What should you do to resolve this issue?

**Correct answer:** C. Change the billing setting to instance-based billing using the --no-cpu-throttling flag.

**Options:**

- **A.** Set minimum instances to 1 to ensure an instance is always running for background processing.
- **B.** Increase the request timeout to allow more time for background tasks to complete.
- **C.** Change the billing setting to instance-based billing using the --no-cpu-throttling flag. — _correct answer_
- **D.** Deploy the background processing logic to a separate Cloud Run service with higher concurrency settings.

## Question 152

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your ecommerce application uses Cloud Firestore to store inventory data. Multiple users can simultaneously purchase the same product, and you need to ensure that the inventory count is accurately decremented. You want to prevent overselling while maintaining high availability. What should you do?

**Correct answer:** A. Use Firestore transactions to read the current inventory count and update it within the same transaction, implementing retry logic for contention failures.

**Options:**

- **A.** Use Firestore transactions to read the current inventory count and update it within the same transaction, implementing retry logic for contention failures. — _correct answer_
- **B.** Store inventory data in Memorystore for Redis and use Firestore only for order records to improve write performance.
- **C.** Use batched writes to update the inventory count and a separate read operation to check availability before processing the purchase.
- **D.** Use the FieldValue.increment() method to decrement the inventory count and check the result after the write completes.

## Question 153

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks queue dispatches HTTP tasks to a Cloud Run service that processes payment transactions. The service occasionally returns HTTP 429 errors due to rate limiting from a third-party payment gateway. You observe that Cloud Tasks automatically slows down task dispatch during these periods. You need to configure the queue to allow more time for the third-party gateway limits to reset before retrying. What should you configure in the RetryConfig?

**Correct answer:** B. Increase the min_backoff and max_backoff values, and adjust max_doublings to control the exponential increase rate of retry intervals.

**Options:**

- **A.** Set max_attempts to -1 to enable unlimited retries for all failed payment tasks.
- **B.** Increase the min_backoff and max_backoff values, and adjust max_doublings to control the exponential increase rate of retry intervals. — _correct answer_
- **C.** Configure max_dispatches_per_second to a lower value to reduce the overall rate of task dispatch from the queue.
- **D.** Decrease max_concurrent_dispatches to limit the number of tasks sent simultaneously to the payment service.

## Question 154

**Domain:** Deploying applications

**Question:** You are setting up a new development environment and need to push container images from Cloud Build to Artifact Registry for deployment to GKE. You run gcloud builds submit with the --tag flag pointing to your Artifact Registry path, but the build fails with an error indicating the repository does not exist. What is the most likely cause of this failure?

**Correct answer:** D. The Artifact Registry Docker repository was not created before attempting to push images. You must create the repository before pushing images to it.

**Options:**

- **A.** The Cloud Build service account does not have permissions to create repositories and needs the Artifact Registry Admin role.
- **B.** The image tag format is incorrect because it should use gcr.io instead of the pkg.dev hostname.
- **C.** The gcloud auth configure-docker command was not run to authenticate Docker with the Artifact Registry hostname.
- **D.** The Artifact Registry Docker repository was not created before attempting to push images. You must create the repository before pushing images to it. — _correct answer_

## Question 155

**Domain:** Integrating applications with Google Cloud services

**Question:** You are architecting a real-time dashboard application on GKE that aggregates IoT sensor data stored in Firestore. The application has thousands of concurrent users viewing the same dashboard with data updating every few seconds. You observe that Firestore costs are higher than expected and response times are degrading. You want to optimize the architecture while maintaining real-time updates. What should you do?

**Correct answer:** C. Implement long-lived snapshot listeners that receive only changed data after the initial load, reducing redundant document reads and leveraging Firestore's efficient fan-out to connected clients.

**Options:**

- **A.** Convert all snapshot listeners to one-shot queries with a higher frequency polling interval to ensure data freshness across all clients.
- **B.** Enable local persistence on server-side applications to cache Firestore data and reduce the number of read operations to the backend.
- **C.** Implement long-lived snapshot listeners that receive only changed data after the initial load, reducing redundant document reads and leveraging Firestore's efficient fan-out to connected clients. — _correct answer_
- **D.** Create a caching layer using Memorystore for Redis that polls Firestore every second and have all clients read from Redis instead of connecting to Firestore directly.

## Question 156

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization requires administrators to use SSH to access Compute Engine VMs without assigning external IP addresses. You have enabled IAP TCP forwarding and granted users the IAP-Secured Tunnel User role. However, administrators report that SSH connections are failing. What should you do to resolve this issue?

**Correct answer:** A. Create a firewall rule that allows ingress TCP traffic on port 22 from the source IP range 35.235.240.0/20.

**Options:**

- **A.** Create a firewall rule that allows ingress TCP traffic on port 22 from the source IP range 35.235.240.0/20. — _correct answer_
- **B.** Grant the IAP-secured Web App User role to the administrators in addition to the IAP-Secured Tunnel User role.
- **C.** Configure Cloud NAT for the subnet where the VMs reside to enable outbound internet connectivity for SSH.
- **D.** Enable Private Google Access on the subnet to allow the VMs to communicate with IAP services.

## Question 157

**Domain:** Deploying applications

**Question:** Your organization has multiple development teams using Cloud Build with separate build triggers. You want to follow the principle of least privilege and ensure that each team's builds can only push images to their designated Artifact Registry repository. What should you do?

**Correct answer:** D. Create a dedicated service account for each team's Cloud Build trigger and grant the Artifact Registry Writer role on only their specific repository.

**Options:**

- **A.** Create separate Google Cloud projects for each team with their own Artifact Registry repositories and Cloud Build configurations.
- **B.** Grant the Artifact Registry Writer role to the Cloud Build default service account at the project level for all teams.
- **C.** Configure VPC Service Controls perimeters around each team's Artifact Registry repository to restrict access.
- **D.** Create a dedicated service account for each team's Cloud Build trigger and grant the Artifact Registry Writer role on only their specific repository. — _correct answer_

## Question 158

**Domain:** Building and testing applications

**Question:** Your team has deployed a new Cloud Run revision with a canary tag and completed initial testing at the tag URL. You now want to begin routing 5% of production traffic to this canary revision while the remaining 95% continues to go to the current stable revision. How should you update the traffic configuration?

**Correct answer:** B. Run gcloud run services update-traffic SERVICE --to-tags canary=5 to route 5% of traffic to the tagged canary revision.

**Options:**

- **A.** Run gcloud run deploy SERVICE with the canary image and specify --traffic=5 to set the new revision to receive 5% traffic.
- **B.** Run gcloud run services update-traffic SERVICE --to-tags canary=5 to route 5% of traffic to the tagged canary revision. — _correct answer_
- **C.** Run gcloud run revisions update canary-revision --traffic-percent=5 to modify the traffic allocation for the specific revision.
- **D.** Edit the Cloud Run service YAML to set the traffic percentage to 5% for the canary revision, then redeploy the service using gcloud run deploy.

## Question 159

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a Node.js API on Cloud Run that performs background data synchronization tasks after responding to HTTP requests. Users are reporting that data synchronization is inconsistent and sometimes incomplete. You need to ensure background tasks complete reliably while maintaining cost efficiency. What should you do?

**Correct answer:** A. Configure instance-based billing for the Cloud Run service to ensure CPU is allocated for the entire container instance lifecycle, allowing background tasks to complete.

**Options:**

- **A.** Configure instance-based billing for the Cloud Run service to ensure CPU is allocated for the entire container instance lifecycle, allowing background tasks to complete. — _correct answer_
- **B.** Increase the maximum concurrency setting to 1000 to ensure the instance has capacity to handle background processing alongside requests.
- **C.** Configure minimum instances to 1 and set the request timeout to the maximum value to ensure background tasks have time to complete.
- **D.** Enable startup CPU boost to allocate additional CPU resources that will persist after the initial startup phase for background processing.

## Question 160

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a secure architecture for a Cloud Run application that needs to access secrets stored in Secret Manager. Following the principle of least privilege, you need to grant the minimum permissions required for the application to read secret values at runtime. What IAM role should you assign to the Cloud Run service account?

**Correct answer:** A. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secrets the application needs to access.

**Options:**

- **A.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secrets the application needs to access. — _correct answer_
- **B.** Grant the Project Viewer role (roles/viewer) at the project level which includes permissions to view secrets stored in Secret Manager.
- **C.** Grant the Secret Manager Secret Version Manager role (roles/secretmanager.secretVersionManager) to allow the application to access and manage secret versions.
- **D.** Grant the Secret Manager Admin role (roles/secretmanager.admin) on the project so the application can manage secrets if requirements change in the future.

## Question 161

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses Cloud Run to deploy microservices that process sensitive data stored in Cloud Storage buckets. You need to ensure that Cloud Run services comply with VPC Service Controls and prevent data exfiltration. The services must only communicate through your VPC network within the service perimeter. What should you configure?

**Correct answer:** A. Set the organization policy run.allowedVPCEgress to allow only 'all-traffic' and run.allowedIngress to allow only 'internal' traffic, ensuring all Cloud Run services route traffic through the VPC network.

**Options:**

- **A.** Set the organization policy run.allowedVPCEgress to allow only 'all-traffic' and run.allowedIngress to allow only 'internal' traffic, ensuring all Cloud Run services route traffic through the VPC network. — _correct answer_
- **B.** Create a private Cloud Run service with IAP enabled and configure the service to use a dedicated service account with limited Cloud Storage permissions within the perimeter.
- **C.** Add the Cloud Run service project to the VPC Service Controls perimeter and configure the Cloud Run services with a Serverless VPC Access connector to the VPC network.
- **D.** Configure ingress rules on the VPC Service Controls perimeter to allow Cloud Run service accounts access to Cloud Storage. Enable Binary Authorization to verify container images.

## Question 162

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Cloud Firestore to track inventory levels across multiple warehouses. You need to implement a function that decrements inventory counts when orders are placed, ensuring that the inventory level never goes below zero even when multiple orders are processed simultaneously. What should you do?

**Correct answer:** D. Use a Firestore transaction to read the current inventory level, verify that it is greater than or equal to the order quantity, and then update the inventory count within the same transaction.

**Options:**

- **A.** Read the inventory level using a standard get() operation, check if inventory is sufficient, and then use a set() operation to update the inventory value with the merge option enabled.
- **B.** Use FieldValue.increment() with a negative value to atomically decrement the inventory count, then check if the resulting value is negative and revert if necessary.
- **C.** Use a batched write to update multiple warehouse inventory documents simultaneously with the decremented values after checking inventory levels in a separate read operation.
- **D.** Use a Firestore transaction to read the current inventory level, verify that it is greater than or equal to the order quantity, and then update the inventory count within the same transaction. — _correct answer_

## Question 163

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a banking application using Cloud Firestore that processes money transfers between accounts. During load testing, you observe that some transactions fail with the error 'ABORTED: Too much contention on these documents.' You need to reduce transaction failures while maintaining data consistency. What should you do?

**Correct answer:** C. Distribute account balances across multiple shard documents and aggregate the values when reading the balance, reducing contention on individual documents.

**Options:**

- **A.** Switch from server client libraries to mobile/web SDKs, which use optimistic concurrency controls that handle contention more efficiently than pessimistic locking.
- **B.** Increase the maximum transaction retry count in your client code to allow more attempts before failing, giving contending transactions more opportunities to succeed.
- **C.** Distribute account balances across multiple shard documents and aggregate the values when reading the balance, reducing contention on individual documents. — _correct answer_
- **D.** Use batched writes instead of transactions for the money transfer operations to avoid the locking behavior that causes contention.

## Question 164

**Domain:** Building and testing applications

**Question:** Your team is implementing automated integration tests in Cloud Build for a Python application. The tests generate JUnit XML reports that must be preserved for analysis after the build completes. You want to use Google-recommended practices for storing test artifacts. What should you do?

**Correct answer:** B. Configure the artifacts field with an objects section in cloudbuild.yaml to upload test log files to a Cloud Storage bucket after the tests complete.

**Options:**

- **A.** Mount a persistent disk to the Cloud Build worker VM and configure tests to write reports to the mounted volume.
- **B.** Configure the artifacts field with an objects section in cloudbuild.yaml to upload test log files to a Cloud Storage bucket after the tests complete. — _correct answer_
- **C.** Add a final build step that emails the test results to the development team using a custom notification service.
- **D.** Configure each test step to write results directly to Cloud Logging using print statements in the test framework output.

## Question 165

**Domain:** Building and testing applications

**Question:** A development team is building a microservices application on Kubernetes using IntelliJ with the Cloud Code plugin. They want to debug the application locally without needing to deploy to a remote GKE cluster. They want Cloud Code to manage the local cluster lifecycle automatically. What should they configure in their Run/Debug settings?

**Correct answer:** D. Select 'Deploy locally to a minikube cluster' in the Deployment section, which allows Cloud Code to start a managed minikube cluster and stop it when deployment stops.

**Options:**

- **A.** Create a Docker Desktop Kubernetes cluster and manually configure kubectl context switching before each debug session.
- **B.** Configure the skaffold.yaml file with a profile named 'local' and set the KUBECONFIG environment variable to point to a non-existent cluster.
- **C.** Install kind (Kubernetes in Docker) and configure Cloud Code to connect to port 6443 for local cluster access.
- **D.** Select 'Deploy locally to a minikube cluster' in the Deployment section, which allows Cloud Code to start a managed minikube cluster and stop it when deployment stops. — _correct answer_

## Question 166

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Run service is receiving HTTP tasks from Cloud Tasks but is temporarily overwhelmed. You want Cloud Tasks to automatically slow down task dispatch to protect your service from overload. Which HTTP response codes should your task handler return to trigger Cloud Tasks system throttling?

**Correct answer:** C. Return HTTP 429 (Too Many Requests) or HTTP 503 (Service Unavailable) from your task handler when overloaded.

**Options:**

- **A.** Return HTTP 200 with an error message in the response body to indicate server overload.
- **B.** Return HTTP 500 (Internal Server Error) or HTTP 502 (Bad Gateway) from your task handler when overloaded.
- **C.** Return HTTP 429 (Too Many Requests) or HTTP 503 (Service Unavailable) from your task handler when overloaded. — _correct answer_
- **D.** Return HTTP 400 (Bad Request) or HTTP 404 (Not Found) from your task handler when overloaded.

## Question 167

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is building an application that stores customer purchase history in Cloud Bigtable. Each purchase includes customer_id, purchase_date, product_id, and transaction details. Users frequently run two types of queries: retrieving all purchases for a specific customer, and finding the most recent purchases for a customer. You want to optimize for both query patterns. Which schema design should you use?

**Correct answer:** A. Use customer_id#reversed_timestamp#product_id as the row key, storing transaction details in column values within a single column family.

**Options:**

- **A.** Use customer_id#reversed_timestamp#product_id as the row key, storing transaction details in column values within a single column family. — _correct answer_
- **B.** Use purchase_date#customer_id#product_id as the row key to organize data chronologically for reporting purposes.
- **C.** Create two separate tables: one with customer_id#timestamp as the row key for customer queries, and another with timestamp#customer_id for chronological queries.
- **D.** Use product_id#customer_id#timestamp as the row key and create a secondary index on customer_id for customer-specific queries.

## Question 168

**Domain:** Building and testing applications

**Question:** You are configuring Cloud Build to run integration tests that require access to a Cloud SQL database in your staging environment. Following the principle of least privilege, you need to configure the appropriate service account permissions. What should you do?

**Correct answer:** D. Create a user-specified service account with only the Cloud SQL Client role and configure the build trigger to use this service account for integration test builds.

**Options:**

- **A.** Configure the integration tests to use the Cloud SQL Auth Proxy with the Compute Engine default service account for authentication.
- **B.** Store Cloud SQL credentials in the cloudbuild.yaml file and pass them as environment variables to the integration test step.
- **C.** Use the default Cloud Build service account and grant it the Project Editor role to ensure it has all necessary permissions for testing.
- **D.** Create a user-specified service account with only the Cloud SQL Client role and configure the build trigger to use this service account for integration test builds. — _correct answer_

## Question 169

**Domain:** Building and testing applications

**Question:** You are setting up a CI/CD pipeline for a containerized application using Cloud Build and Artifact Registry. Your security team requires that all container images be automatically scanned for Common Vulnerabilities and Exposures (CVEs) when pushed to the registry. The scan results must be continuously updated as new vulnerabilities are discovered. What should you do?

**Correct answer:** D. Enable the Container Scanning API in your project. Push container images to a Docker repository in Artifact Registry where automatic scanning is enabled.

**Options:**

- **A.** Configure a Cloud Build trigger that runs a custom vulnerability scanner after each image push. Store the scan results in Cloud Storage and set up Cloud Scheduler to rescan images weekly.
- **B.** Enable Security Command Center and configure it to scan all images in Artifact Registry on a daily schedule. Export scan results to BigQuery for analysis.
- **C.** Install a vulnerability scanning tool in your Cloud Build pipeline and fail the build if critical CVEs are detected. Store images in Artifact Registry only if they pass the scan.
- **D.** Enable the Container Scanning API in your project. Push container images to a Docker repository in Artifact Registry where automatic scanning is enabled. — _correct answer_

## Question 170

**Domain:** Integrating applications with Google Cloud services

**Question:** You created a log sink to export application logs from your Google Cloud project to a BigQuery dataset in a different project. After verifying the sink configuration, you notice that no log entries are appearing in the BigQuery dataset. What is the most likely cause of this issue?

**Correct answer:** A. The sink's service account has not been granted the BigQuery Data Editor role on the destination dataset in the other project.

**Options:**

- **A.** The sink's service account has not been granted the BigQuery Data Editor role on the destination dataset in the other project. — _correct answer_
- **B.** The BigQuery streaming insert API is experiencing an outage that prevents log entries from being written to the destination dataset.
- **C.** The log sink filter is incorrectly configured and does not match any log entries being generated by the application.
- **D.** The destination BigQuery dataset is configured with a customer-managed encryption key that Cloud Logging cannot access.
