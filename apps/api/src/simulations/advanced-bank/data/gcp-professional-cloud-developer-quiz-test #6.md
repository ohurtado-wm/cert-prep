# gcp-professional-cloud-developer-quiz-test #6

## Question 1

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service using Cloud Code for VS Code. You want to test your containerized application locally before deploying to production. You need the ability to automatically rebuild and redeploy the service when you make code changes. How should you configure your local development environment?

**Correct answer:** C. Run the 'Run on Cloud Run Emulator' command from the Command Palette and ensure the 'watch' option is enabled in the launch configuration.

**Options:**

- **A.** Create a Cloud Build configuration that runs locally using 'cloud-build-local' and set up file watchers in VS Code.
- **B.** Deploy to a remote Cloud Run service and use Cloud Build triggers to automatically redeploy when code changes are detected.
- **C.** Run the 'Run on Cloud Run Emulator' command from the Command Palette and ensure the 'watch' option is enabled in the launch configuration. — _correct answer_
- **D.** Configure a local Docker Compose file with a custom entrypoint that watches for file changes and restarts the container.

## Question 2

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that needs to send all outbound traffic through your VPC network for security compliance. Your VPC network has firewall rules and Cloud NAT configured for internet access control. You have already created a Serverless VPC Access connector. How should you configure the Cloud Run service deployment?

**Correct answer:** A. Deploy the service with the --vpc-connector flag pointing to your connector and set --vpc-egress to all-traffic.

**Options:**

- **A.** Deploy the service with the --vpc-connector flag pointing to your connector and set --vpc-egress to all-traffic. — _correct answer_
- **B.** Deploy the service with the --vpc-connector flag and configure Cloud Armor policies on the connector.
- **C.** Deploy the service with the --ingress flag set to internal-only and the --vpc-connector flag.
- **D.** Deploy the service with the --vpc-connector flag pointing to your connector and set --vpc-egress to private-ranges-only.

## Question 3

**Domain:** Building and testing applications

**Question:** Your team has deployed a new Cloud Run revision tagged as 'green' that is currently receiving 0% of traffic. After testing the revision at its dedicated tag URL, you want to gradually roll out traffic to it. You plan to start with 10% and increase over several days. Which gcloud command correctly migrates 10% of traffic to the tagged revision?

**Correct answer:** A. gcloud run services update-traffic myservice --to-tags green=10

**Options:**

- **A.** gcloud run services update-traffic myservice --to-tags green=10 — _correct answer_
- **B.** gcloud run revisions update green --traffic-percent 10
- **C.** gcloud run deploy myservice --update-traffic green=10
- **D.** gcloud run services set-traffic myservice --tag green --percent 10

## Question 4

**Domain:** Building and testing applications

**Question:** You need to test a Cloud Run service locally before deploying to Google Cloud. You are using Cloud Code for VS Code and want to configure an environment representative of the production Cloud Run environment. What should you do?

**Correct answer:** B. Use the Cloud Run Emulator in Cloud Code, which allows you to configure properties like CPU, memory allocation, environment variables, and Cloud SQL database connections

**Options:**

- **A.** Configure minikube with Cloud Run APIs enabled and deploy the service using kubectl with Cloud Run-specific annotations
- **B.** Use the Cloud Run Emulator in Cloud Code, which allows you to configure properties like CPU, memory allocation, environment variables, and Cloud SQL database connections — _correct answer_
- **C.** Create a Docker Compose file that replicates the Cloud Run environment and use Docker Desktop to run the services locally
- **D.** Deploy the application to a GKE Autopilot cluster and use Cloud Code's remote debugging feature to test the service in a production-like environment

## Question 5

**Domain:** Building and testing applications

**Question:** Your development team is using Cloud Build to build and deploy container images to Artifact Registry in a different Google Cloud project than where Cloud Build runs. Builds are failing with permission denied errors when attempting to push images. What is the most likely cause and resolution?

**Correct answer:** D. Grant the Artifact Registry Writer role to the Cloud Build service account in the project containing the Artifact Registry repository.

**Options:**

- **A.** Enable cross-project access in the Cloud Build settings and specify the target Artifact Registry project ID.
- **B.** Create a service account key for the Cloud Build service account and add it as a secret in the target Artifact Registry project.
- **C.** Configure VPC peering between the Cloud Build project and the Artifact Registry project to enable private network access.
- **D.** Grant the Artifact Registry Writer role to the Cloud Build service account in the project containing the Artifact Registry repository. — _correct answer_

## Question 6

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an IoT application that stores sensor data from 100,000 devices in Cloud Bigtable. Each sensor reports data every second with a timestamp. Your current row key design is 'timestamp#device_id'. The application experiences severe performance degradation during peak write periods. You need to redesign the row key to improve write performance. What should you do?

**Correct answer:** A. Change the row key format to 'device_id#timestamp' with the device identifier as the prefix.

**Options:**

- **A.** Change the row key format to 'device_id#timestamp' with the device identifier as the prefix. — _correct answer_
- **B.** Add more nodes to the Bigtable cluster to handle the increased write throughput during peak periods.
- **C.** Hash the timestamp value using MD5 and use the hash as the row key prefix to randomize write distribution.
- **D.** Enable replication by adding a second cluster in a different region to distribute the write load.

## Question 7

**Domain:** Deploying applications

**Question:** You are developing a Cloud Run service that requires database credentials stored in Secret Manager. The application uses a custom service account. After deploying the service, it fails to start, and you see permission errors in the logs indicating the secret cannot be accessed. You need to grant the minimum required permissions for the Cloud Run service to access the secret. What should you do?

**Correct answer:** D. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secret to the Cloud Run service's service account.

**Options:**

- **A.** Grant the Editor role (roles/editor) on the project to the Cloud Run service's service account.
- **B.** Grant the Secret Manager Admin role (roles/secretmanager.admin) on the project to the Cloud Run service's service account.
- **C.** Grant the Secret Manager Viewer role (roles/secretmanager.viewer) on the specific secret to the Cloud Run service's service account.
- **D.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secret to the Cloud Run service's service account. — _correct answer_

## Question 8

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Cloud Run service that handles real-time event processing through HTTP webhooks. The service currently scales to over 200 instances during peak traffic, but you notice that many instances show low CPU utilization. You want to reduce costs by improving resource efficiency without affecting latency. The application is multi-threaded and can handle concurrent requests. What should you do?

**Correct answer:** B. Increase the maximum concurrency setting to allow each instance to handle more simultaneous requests.

**Options:**

- **A.** Set maximum instances to 50 to limit the number of instances that can be created.
- **B.** Increase the maximum concurrency setting to allow each instance to handle more simultaneous requests. — _correct answer_
- **C.** Reduce the CPU allocation per instance to match the observed utilization.
- **D.** Decrease the maximum concurrency setting to ensure each request gets more CPU time.

## Question 9

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company operates a microservices application deployed across multiple Google Cloud projects in your organization. The security team requires all audit logs from these projects to be stored in a centralized location for compliance analysis. You want to route logs from all projects using a single configuration while allowing each project to retain its local copies. What should you do?

**Correct answer:** D. Create a non-intercepting aggregated sink at the organization level to route audit logs to a centralized log bucket in a dedicated project.

**Options:**

- **A.** Create an intercepting aggregated sink at the organization level to route audit logs to a centralized log bucket.
- **B.** Create a log sink in each project with the same filter and destination pointing to a centralized BigQuery dataset.
- **C.** Configure the _Default sink in each project to route logs to a centralized Cloud Storage bucket.
- **D.** Create a non-intercepting aggregated sink at the organization level to route audit logs to a centralized log bucket in a dedicated project. — _correct answer_

## Question 10

**Domain:** Building and testing applications

**Question:** Your team's Cloud Build pipeline takes 15 minutes to complete for Docker image builds despite minimal code changes between commits. You want to reduce the build time by leveraging Docker layer caching while using Artifact Registry as your container registry. What should you configure in your Cloud Build configuration file?

**Correct answer:** D. Add a build step to pull the previously built image from Artifact Registry, ignoring errors if the image does not exist. Add the --cache-from argument referencing the pulled image in the docker build step.

**Options:**

- **A.** Configure the docker build step to use --no-cache to ensure clean builds, and increase the Cloud Build machine type to reduce overall build duration.
- **B.** Enable the Cloud Build caching feature in the project settings and set the cache retention to 30 days. Cloud Build will automatically cache all Docker layers for future builds.
- **C.** Configure Cloud Build to use a persistent disk volume that stores Docker build cache across builds. Mount the volume in each build step to maintain layer caching automatically.
- **D.** Add a build step to pull the previously built image from Artifact Registry, ignoring errors if the image does not exist. Add the --cache-from argument referencing the pulled image in the docker build step. — _correct answer_

## Question 11

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline that runs integration tests after deploying your application to a staging environment. You need to ensure that the deployment step completes successfully before the integration tests begin. The deployment and test setup should be able to run concurrently with downloading external test dependencies. What should you do?

**Correct answer:** C. Use the id field to identify the deployment step and reference it in the waitFor field of the integration test step. Add waitFor: ['-'] to the test dependency download step to run it immediately.

**Options:**

- **A.** Configure the integration test step to use allowFailure: true so it starts immediately regardless of whether the deployment has completed successfully.
- **B.** Set the timeout field to a high value for the deployment step to ensure Cloud Build allocates sufficient time for the integration tests to prepare while deployment is in progress.
- **C.** Use the id field to identify the deployment step and reference it in the waitFor field of the integration test step. Add waitFor: ['-'] to the test dependency download step to run it immediately. — _correct answer_
- **D.** Remove the waitFor field from all steps to allow Cloud Build to automatically determine the optimal execution order based on resource dependencies and inter-step communication patterns.

## Question 12

**Domain:** Deploying applications

**Question:** You are developing a multi-tier web application on GKE that requires internal HTTP(S) load balancing for services within your VPC network. The application should only be accessible by internal clients and must use container-native load balancing for optimal performance. You need to configure an Ingress to deploy an internal Application Load Balancer. What should you do?

**Correct answer:** A. Create a VPC-native cluster and apply an Ingress manifest with the annotation kubernetes.io/ingress.class: 'gce-internal'. Ensure your Services are annotated to use NEGs.

**Options:**

- **A.** Create a VPC-native cluster and apply an Ingress manifest with the annotation kubernetes.io/ingress.class: 'gce-internal'. Ensure your Services are annotated to use NEGs. — _correct answer_
- **B.** Create a VPC-native cluster and apply an Ingress manifest with the annotation kubernetes.io/ingress.class: 'gce'. Configure a firewall rule to block external traffic.
- **C.** Create a routes-based cluster and apply an Ingress manifest with spec.ingressClassName: 'gce-internal'. Enable instance group backends for the Services.
- **D.** Create a VPC-native cluster and apply an Ingress manifest without any class annotation. Set type: LoadBalancer with the annotation networking.gke.io/load-balancer-type: Internal on each Service.

## Question 13

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to access private resources in a VPC network using a Serverless VPC Access connector. The service needs to connect to both a Memorystore instance at 10.0.0.5 and an external third-party API at api.example.com. You want to minimize the traffic routed through the connector to reduce costs. Which egress setting should you configure?

**Correct answer:** B. Configure the egress setting to private-ranges-only so that only traffic to RFC 1918 and RFC 6598 IP addresses is routed through the connector.

**Options:**

- **A.** Configure the egress setting to internal-only which routes traffic exclusively to internal Google Cloud services and private IP addresses.
- **B.** Configure the egress setting to private-ranges-only so that only traffic to RFC 1918 and RFC 6598 IP addresses is routed through the connector. — _correct answer_
- **C.** Configure the egress setting to custom-ranges and specify only the 10.0.0.0/8 CIDR range for Memorystore traffic routing.
- **D.** Configure the egress setting to all-traffic to ensure both internal and external traffic flows through the connector for consistent routing.

## Question 14

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is building a data processing pipeline that lists objects from a Cloud Storage bucket using the JSON API. The bucket contains objects with large amounts of metadata. You notice that the listing requests are returning more data than necessary, impacting application performance. You want to optimize the API responses while maintaining pagination functionality. What should you do?

**Correct answer:** A. Add the fields query parameter to specify only the required object properties and include nextPageToken and items fields to preserve pagination capability.

**Options:**

- **A.** Add the fields query parameter to specify only the required object properties and include nextPageToken and items fields to preserve pagination capability. — _correct answer_
- **B.** Configure the bucket to store metadata in a separate location and use the metadataOnly parameter to retrieve object names without metadata.
- **C.** Use the projection query parameter set to 'noAcl' to exclude ACL data, which automatically excludes all metadata and reduces response size.
- **D.** Set the includeMetadata parameter to false in each list request to exclude all object metadata from the response payload.

## Question 15

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a web application on Cloud Run and need to track the number of HTTP 500 errors occurring in your application. You want to create an alert when the error rate exceeds a threshold. The errors are logged with a specific message pattern in Cloud Logging. What should you do?

**Correct answer:** D. Create a counter-type log-based metric with a filter matching the HTTP 500 error pattern. Then create an alerting policy in Cloud Monitoring based on this metric.

**Options:**

- **A.** Create a distribution-type log-based metric with a filter matching the HTTP 500 error pattern. Then create an alerting policy in Cloud Monitoring based on this metric.
- **B.** Create a Pub/Sub subscription to the Cloud Logging stream and implement a Cloud Run service to count errors and trigger alerts programmatically.
- **C.** Create a log sink to route HTTP 500 error logs to a BigQuery dataset. Then schedule a BigQuery query to count errors and send alerts via Cloud Functions.
- **D.** Create a counter-type log-based metric with a filter matching the HTTP 500 error pattern. Then create an alerting policy in Cloud Monitoring based on this metric. — _correct answer_

## Question 16

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a task handler for Cloud Tasks that targets a Cloud Run service. During high traffic periods, your handler occasionally experiences resource constraints and cannot process tasks. You want to signal to Cloud Tasks to slow down task dispatches while still ensuring tasks are retried. Which HTTP response code should your handler return?

**Correct answer:** C. Return HTTP 503 Service Unavailable to trigger system throttling and have the task retried later.

**Options:**

- **A.** Return HTTP 500 Internal Server Error to fail the task and have it retried immediately.
- **B.** Return HTTP 200 OK to acknowledge the task and let the application handle queuing internally.
- **C.** Return HTTP 503 Service Unavailable to trigger system throttling and have the task retried later. — _correct answer_
- **D.** Return HTTP 400 Bad Request to indicate the task payload is invalid and prevent retries.

## Question 17

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are creating a new GKE cluster to run production workloads that need to access Google Cloud APIs. You want to ensure Workload Identity Federation for GKE is enabled and requires minimal ongoing configuration. Which cluster type should you create?

**Correct answer:** D. Create a GKE Autopilot cluster. Workload Identity Federation for GKE is always enabled and cannot be disabled in Autopilot mode.

**Options:**

- **A.** Create a GKE Standard cluster and enable the metadata concealment feature. This feature includes Workload Identity Federation for GKE functionality.
- **B.** Create a GKE Standard cluster with Shielded GKE Nodes enabled. Shielded Nodes automatically configure Workload Identity Federation for GKE.
- **C.** Create a GKE Standard cluster with the default configuration. Workload Identity Federation for GKE is enabled automatically on all new Standard clusters.
- **D.** Create a GKE Autopilot cluster. Workload Identity Federation for GKE is always enabled and cannot be disabled in Autopilot mode. — _correct answer_

## Question 18

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that lists Cloud Storage objects using the JSON API. The bucket contains over 100,000 objects, but your application only needs the object names and sizes to generate a summary report. You want to minimize network bandwidth usage and improve response times. What should you do?

**Correct answer:** A. Use the fields query parameter to request only the nextPageToken, items/name, and items/size fields in the API response.

**Options:**

- **A.** Use the fields query parameter to request only the nextPageToken, items/name, and items/size fields in the API response. — _correct answer_
- **B.** Configure the bucket to only store name and size metadata for new objects to reduce the API response size.
- **C.** Set the maxResults parameter to 1000 and use parallel threads to make multiple concurrent list requests with different pageToken values.
- **D.** Download all object metadata first, then filter the results in your application code to extract only the name and size properties.

## Question 19

**Domain:** Building and testing applications

**Question:** Your Cloud Run service is currently serving production traffic with a single revision. You want to implement a canary deployment pattern where new revisions are always deployed without immediate traffic and require manual approval before receiving production traffic. What configuration approach should you use?

**Correct answer:** C. Configure your CI/CD pipeline to always deploy using gcloud run deploy with --no-traffic flag, then use a separate approval step to run gcloud run services update-traffic after validation.

**Options:**

- **A.** Create a custom IAM policy that denies the run.routes.invoke permission on new revisions until manually granted by an administrator.
- **B.** Set the Cloud Run service configuration to 'manual traffic management' mode in the Google Cloud console to prevent automatic traffic routing to new revisions.
- **C.** Configure your CI/CD pipeline to always deploy using gcloud run deploy with --no-traffic flag, then use a separate approval step to run gcloud run services update-traffic after validation. — _correct answer_
- **D.** Configure the service with maximum instances set to 0 for new revisions, which prevents them from receiving traffic until the limit is increased.

## Question 20

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that processes objects from a Cloud Storage bucket containing over one million objects. You need to list all objects using the JSON API and ensure your application handles the paginated results correctly. Which approach should you implement?

**Correct answer:** B. Include the nextPageToken value from each response as the pageToken parameter in subsequent requests until no nextPageToken is returned in the response.

**Options:**

- **A.** Set maxResults to the total number of objects in the bucket to retrieve all objects in a single API request without pagination.
- **B.** Include the nextPageToken value from each response as the pageToken parameter in subsequent requests until no nextPageToken is returned in the response. — _correct answer_
- **C.** Continuously poll the API until the response includes an 'isComplete' flag set to true indicating all objects have been returned.
- **D.** Use the offset query parameter to skip objects already processed and retrieve subsequent batches of objects in each request.

## Question 21

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have configured a VPC Service Controls perimeter around your production project containing Cloud Storage buckets with confidential data. Your application running on Compute Engine inside the perimeter needs to access a publicly available machine learning model stored in a Cloud Storage bucket owned by a partner organization outside the perimeter. What should you configure?

**Correct answer:** C. Create an egress rule specifying the service account identity used by the application and the partner project's Cloud Storage resource as the allowed destination.

**Options:**

- **A.** Create an access level that includes the partner organization's project and add it to the service perimeter to allow bidirectional access to Cloud Storage.
- **B.** Add the partner organization's Cloud Storage bucket to your service perimeter as a protected resource to enable your application to access the data.
- **C.** Create an egress rule specifying the service account identity used by the application and the partner project's Cloud Storage resource as the allowed destination. — _correct answer_
- **D.** Create a perimeter bridge between your perimeter and the partner organization's perimeter to enable seamless communication between the Cloud Storage buckets.

## Question 22

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application on Cloud Run functions needs to cache frequently accessed data from Firestore using Memorystore for Redis. During testing, your functions are unable to connect to the Memorystore instance. Both resources are in the us-central1 region. The Memorystore instance uses private services access and has no public IP. What should you do to resolve the connectivity issue?

**Correct answer:** B. Configure a Serverless VPC Access connector in the same region and VPC network as the Memorystore instance, and configure the Cloud Run function to use the connector to route egress traffic.

**Options:**

- **A.** Deploy the Memorystore instance to a different region that supports direct Cloud Run connectivity without a VPC connector, and update your application to use cross-region caching.
- **B.** Configure a Serverless VPC Access connector in the same region and VPC network as the Memorystore instance, and configure the Cloud Run function to use the connector to route egress traffic. — _correct answer_
- **C.** Enable public IP access on the Memorystore instance and update the Cloud Run function to connect using the public endpoint. Configure appropriate firewall rules to allow access.
- **D.** Create an Identity-Aware Proxy tunnel to the Memorystore instance and configure the Cloud Run function to route Redis traffic through the IAP tunnel using TCP forwarding.

## Question 23

**Domain:** Deploying applications

**Question:** You need to deploy a Cloud Run service with a secret stored in Secret Manager using the gcloud CLI. The secret should be exposed as an environment variable named 'DB_PASSWORD' using version 3 of a secret called 'prod-db-credentials'. Which command should you use?

**Correct answer:** A. gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=DB_PASSWORD=prod-db-credentials:3

**Options:**

- **A.** gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=DB_PASSWORD=prod-db-credentials:3 — _correct answer_
- **B.** gcloud run deploy my-service --image gcr.io/my-project/my-image --secret-env-vars=DB_PASSWORD:prod-db-credentials:3
- **C.** gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=/secrets/db-password=prod-db-credentials:3
- **D.** gcloud run deploy my-service --image gcr.io/my-project/my-image --set-env-vars=DB_PASSWORD=prod-db-credentials:3

## Question 24

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has multiple Google Cloud projects across several environments (development, staging, production). Your security team requires all audit logs from production projects to be centralized in a dedicated security project for compliance monitoring while still keeping logs accessible in their source projects. What should you do?

**Correct answer:** C. Create a non-intercepting aggregated sink at the folder level for production projects that routes audit logs to a log bucket in the security project.

**Options:**

- **A.** Create individual log sinks in each production project that route audit logs to the security project's log bucket and manage them manually.
- **B.** Create an intercepting aggregated sink at the folder level for production projects that routes audit logs directly to a log bucket in the security project.
- **C.** Create a non-intercepting aggregated sink at the folder level for production projects that routes audit logs to a log bucket in the security project. — _correct answer_
- **D.** Configure the _Default sink in each production project to route logs to both the local _Default bucket and the security project's bucket.

## Question 25

**Domain:** Deploying applications

**Question:** Your application running on GKE requires a minimum of 256Mi of memory and 100m CPU to function correctly. Under load, the application may need up to 512Mi of memory and 500m CPU. You want to ensure efficient resource utilization while preventing out-of-memory issues. Following Google Cloud best practices, how should you configure resource requests and limits in your deployment YAML?

**Correct answer:** C. Set memory requests and limits both to 512Mi, and set CPU requests to 100m with no CPU limit specified.

**Options:**

- **A.** Set memory requests and limits both to 256Mi, and set CPU requests and limits both to 100m.
- **B.** Set memory requests to 256Mi and limits to 512Mi, and set CPU requests to 100m and limits to 500m.
- **C.** Set memory requests and limits both to 512Mi, and set CPU requests to 100m with no CPU limit specified. — _correct answer_
- **D.** Do not specify any resource requests or limits and let Kubernetes use default values for optimal scheduling.

## Question 26

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your ecommerce application uses Memorystore for Redis to cache shopping cart data with the default volatile-lru eviction policy. Users are reporting that their shopping carts are unexpectedly empty before checkout. You observe that system memory usage frequently exceeds 80%, and the cache-hit ratio has dropped significantly. What should you do to resolve this issue?

**Correct answer:** C. Ensure all shopping cart keys are stored with TTL expirations set, and scale up the Memorystore instance to accommodate the workload and improve cache-hit ratio.

**Options:**

- **A.** Enable RDB snapshots for the Memorystore instance to automatically restore evicted shopping cart data when users return to their carts.
- **B.** Lower the maxmemory-gb configuration to 50% of instance capacity to provide more overhead and prevent memory pressure from causing evictions.
- **C.** Ensure all shopping cart keys are stored with TTL expirations set, and scale up the Memorystore instance to accommodate the workload and improve cache-hit ratio. — _correct answer_
- **D.** Change the eviction policy to noeviction to prevent any shopping cart data from being removed, ensuring cart persistence throughout the user session.

## Question 27

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a product catalog application that reads frequently accessed product data from Cloud SQL. The application experiences high read traffic, causing database load and latency issues. You want to implement a cache-aside pattern using Memorystore for Redis to reduce database load. What should you do?

**Correct answer:** D. Configure your application to first check Memorystore for requested data, query Cloud SQL on cache miss, and write the result to Memorystore with an appropriate TTL before returning to the client.

**Options:**

- **A.** Configure your application to write all data simultaneously to both Cloud SQL and Memorystore, then read exclusively from Memorystore for all product queries.
- **B.** Configure Cloud SQL to replicate data to Memorystore using Cloud SQL read replicas, which automatically populate Redis keys based on query patterns.
- **C.** Configure Memorystore for Redis to automatically sync data from Cloud SQL using database triggers, eliminating the need for application-level caching logic.
- **D.** Configure your application to first check Memorystore for requested data, query Cloud SQL on cache miss, and write the result to Memorystore with an appropriate TTL before returning to the client. — _correct answer_

## Question 28

**Domain:** Deploying applications

**Question:** You need to create a custom alerting policy in Cloud Logging that notifies your team immediately whenever a specific error message appears in your GKE application logs. You want to receive notifications even for individual occurrences without any aggregation delay. What should you do?

**Correct answer:** B. Create a log-based alerting policy in Cloud Logging using a filter query that matches the specific error message pattern.

**Options:**

- **A.** Create a user-defined counter log-based metric that counts occurrences of the error, then create an alerting policy with a threshold of 1.
- **B.** Create a log-based alerting policy in Cloud Logging using a filter query that matches the specific error message pattern. — _correct answer_
- **C.** Export logs to BigQuery and create a scheduled query that runs every minute to check for the error message pattern.
- **D.** Configure a Pub/Sub sink for your logs and create a Cloud Function subscriber that sends notifications when it detects the error message.

## Question 29

**Domain:** Deploying applications

**Question:** You have deployed a stateless web application to GKE and need to configure autoscaling based on CPU utilization. The application currently runs 3 replicas and should scale between 2 and 10 replicas when average CPU usage exceeds 60%. You want to use the simplest kubectl command to achieve this. What should you do?

**Correct answer:** D. Run: kubectl autoscale deployment my-app --min=2 --max=10 --cpu-percent=60

**Options:**

- **A.** Create a HorizontalPodAutoscaler YAML manifest with apiVersion: autoscaling/v2 and apply it with kubectl apply -f hpa.yaml
- **B.** Run: kubectl set resources deployment my-app --requests=cpu=60m to trigger automatic scaling
- **C.** Run: kubectl scale deployment my-app --replicas=10 with a cron job to periodically check CPU metrics
- **D.** Run: kubectl autoscale deployment my-app --min=2 --max=10 --cpu-percent=60 — _correct answer_

## Question 30

**Domain:** Deploying applications

**Question:** Your team is developing a Cloud Run service that connects to a third-party API using credentials stored in Secret Manager. The credentials are rotated weekly by an automated system. Your application needs to pick up rotated credentials without requiring redeployment. How should you configure the Cloud Run service to access the secret?

**Correct answer:** C. Mount the secret as a volume, and configure the application to read the credentials from the mounted file path at runtime.

**Options:**

- **A.** Expose the secret as an environment variable with a pinned version number, and redeploy the service weekly after rotation.
- **B.** Use the Secret Manager client library in your application to fetch the secret on each API call and cache it for one hour.
- **C.** Mount the secret as a volume, and configure the application to read the credentials from the mounted file path at runtime. — _correct answer_
- **D.** Expose the secret as an environment variable using the 'latest' version alias, and read the environment variable in the application code.

## Question 31

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team needs to be notified when a critical batch processing container running on GKE stops sending heartbeat metrics for more than 10 minutes, indicating a potential failure. Which Cloud Monitoring configuration meets this requirement?

**Correct answer:** A. Create a metric-absence alerting policy that monitors the heartbeat metric. Set the trigger absence time to 10 minutes, and configure the alert trigger to 'Any time series violates' to detect individual container failures.

**Options:**

- **A.** Create a metric-absence alerting policy that monitors the heartbeat metric. Set the trigger absence time to 10 minutes, and configure the alert trigger to 'Any time series violates' to detect individual container failures. — _correct answer_
- **B.** Create a log-based alerting policy that searches for 'heartbeat' log entries. Configure the policy to alert when no matching entries are found within 10 minutes.
- **C.** Create a metric-threshold alerting policy with a 'less than' condition set to 1 on the heartbeat metric. Configure a retest window of 10 minutes to detect when heartbeats drop.
- **D.** Create a metric-absence alerting policy that monitors the heartbeat metric. Set the trigger absence time to 10 minutes, and configure the alert trigger to 'All time series violate'.

## Question 32

**Domain:** Integrating applications with Google Cloud services

**Question:** Your batch processing application uses the Cloud Storage JSON API to read and write thousands of objects. The application occasionally receives HTTP 408 and 5xx errors. You want to implement error handling that differentiates between transient and permanent errors while following Google-recommended best practices. What should you do?

**Correct answer:** A. Retry requests that receive 408, 429, and 5xx error codes using exponential backoff, and log permanent errors like 400 and 403 without retrying.

**Options:**

- **A.** Retry requests that receive 408, 429, and 5xx error codes using exponential backoff, and log permanent errors like 400 and 403 without retrying. — _correct answer_
- **B.** Retry all error codes indefinitely using exponential backoff until the requests succeed to ensure data consistency.
- **C.** Implement custom application-level retry logic with short intervals on top of client library defaults to ensure faster recovery from errors.
- **D.** Handle all errors by adding a fixed 10-second delay before retrying once, then failing permanently if the retry is unsuccessful.

## Question 33

**Domain:** Deploying applications

**Question:** You are setting up a CI/CD pipeline using Cloud Build to push container images to an Artifact Registry repository. Your builds are failing with permission denied errors. The Cloud Build service account has the default permissions. What should you do to allow Cloud Build to push images to Artifact Registry?

**Correct answer:** B. Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the Cloud Build service account.

**Options:**

- **A.** Create the Artifact Registry repository using the Cloud Build service account so it has ownership permissions.
- **B.** Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the Cloud Build service account. — _correct answer_
- **C.** Grant the Storage Object Admin role (roles/storage.objectAdmin) to the Cloud Build service account on the project.
- **D.** Enable the Artifact Registry API and use the default permissions that are automatically granted to Cloud Build.

## Question 34

**Domain:** Building and testing applications

**Question:** Your team is deploying a new version of an e-commerce application running on Cloud Run. You want to test the new revision in production without affecting existing users before gradually shifting traffic. You need to deploy the new revision and create a dedicated URL to test it directly. What should you do?

**Correct answer:** C. Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary' and test using the tagged URL before migrating traffic.

**Options:**

- **A.** Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL --traffic 0' and use Cloud Monitoring to inspect the revision's health before migrating traffic.
- **B.** Deploy the new revision to a separate staging Cloud Run service, run tests, then delete the staging service and redeploy to production with full traffic.
- **C.** Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary' and test using the tagged URL before migrating traffic. — _correct answer_
- **D.** Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL' and immediately use 'gcloud run services update-traffic' to set traffic to 0%.

## Question 35

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization has a VPC Service Controls perimeter protecting BigQuery and Cloud Storage resources. Remote data analysts need to access these resources from their managed corporate devices over the internet. You need to allow access based on their device security posture and IP address while maintaining the perimeter protection. What should you configure?

**Correct answer:** C. Create an access level in Access Context Manager with conditions for trusted IP ranges and device trust attributes, then configure an ingress rule on the perimeter to allow access based on that access level.

**Options:**

- **A.** Configure an egress rule on the perimeter to allow the protected resources to respond to requests from the analysts' IP addresses with appropriate device attributes.
- **B.** Add the analysts' user accounts directly to the perimeter's access levels list and configure VPC firewall rules to allow traffic only from their corporate IP addresses.
- **C.** Create an access level in Access Context Manager with conditions for trusted IP ranges and device trust attributes, then configure an ingress rule on the perimeter to allow access based on that access level. — _correct answer_
- **D.** Create a perimeter bridge between the perimeter containing the protected resources and a new perimeter containing the projects where the analysts work.

## Question 36

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a Cloud Tasks queue for an order processing application. The queue processes tasks that call an external payment service. You want tasks to retry with exponential backoff starting at 10 seconds, doubling 4 times, and then continuing with linear increases until reaching a maximum backoff of 600 seconds. Which retry configuration should you use?

**Correct answer:** D. Configure the queue with minBackoff set to 10s, maxDoublings set to 4, and maxBackoff set to 600s.

**Options:**

- **A.** Configure the queue with minBackoff set to 10s, maxDoublings set to 6, and maxBackoff set to 600s.
- **B.** Configure the queue with minBackoff set to 10s, maxDoublings set to 5, and maxBackoff set to 320s.
- **C.** Configure the queue with minBackoff set to 5s, maxDoublings set to 4, and maxBackoff set to 600s.
- **D.** Configure the queue with minBackoff set to 10s, maxDoublings set to 4, and maxBackoff set to 600s. — _correct answer_

## Question 37

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to use secrets from Secret Manager for production database credentials. Your company's security policy requires predictable deployments and the ability to roll back to a known working configuration if issues arise with secret values. What is the Google-recommended approach for referencing secret versions?

**Correct answer:** C. Reference secrets by their specific version number and deploy version updates using your existing release processes.

**Options:**

- **A.** Use the latest alias when referencing secrets to automatically receive the most current credential values.
- **B.** Create separate secrets for each environment with the same name and use project-level isolation.
- **C.** Reference secrets by their specific version number and deploy version updates using your existing release processes. — _correct answer_
- **D.** Configure the secret with an expiration date that matches your deployment schedule.

## Question 38

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing time-series sensor data in Cloud Bigtable for an environmental monitoring system. Each sensor reports readings every minute, and the most common query retrieves all readings for a specific sensor over the past week. The data must be retained for 90 days before being deleted automatically. How should you organize your schema?

**Correct answer:** B. Design row keys as sensorId#weekBucket#timestamp with column family measurements containing columns for each metric, and configure a garbage collection policy with a 90-day maximum age.

**Options:**

- **A.** Design row keys as hashOf(sensorId)#timestamp and store metrics as JSON in a single column to optimize storage efficiency with automatic garbage collection.
- **B.** Design row keys as sensorId#weekBucket#timestamp with column family measurements containing columns for each metric, and configure a garbage collection policy with a 90-day maximum age. — _correct answer_
- **C.** Design row keys as sensorId#timestamp storing one row per reading with all metrics in separate column families, and configure different garbage collection policies per column family.
- **D.** Design row keys as timestamp#sensorId with a single column family containing all metrics, and use a scheduled Cloud Function to delete rows older than 90 days.

## Question 39

**Domain:** Deploying applications

**Question:** You manage a microservices application on GKE that experiences variable traffic throughout the day. You want to automatically scale the number of Pods based on CPU utilization while keeping costs optimized. You need to configure a HorizontalPodAutoscaler for a Deployment named 'frontend' that maintains an average CPU utilization of 70% across all Pods, with a minimum of 2 and maximum of 10 replicas. Which kubectl command should you use?

**Correct answer:** D. kubectl autoscale deployment frontend --min=2 --max=10 --cpu-percent=70

**Options:**

- **A.** kubectl set autoscale deployment frontend --min-pods=2 --max-pods=10 --cpu-target=70
- **B.** kubectl scale deployment frontend --replicas=2 --max-replicas=10 --target-cpu-utilization=70
- **C.** kubectl apply -f hpa.yaml with HorizontalPodAutoscaler using autoscaling/v1 API version and specifying averageUtilization: 70 under metrics
- **D.** kubectl autoscale deployment frontend --min=2 --max=10 --cpu-percent=70 — _correct answer_

## Question 40

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses Cloud SQL for MySQL with customer-managed encryption keys (CMEK) to meet compliance requirements. You need to create a new Cloud SQL instance in the us-central1 region and encrypt it with a CMEK stored in Cloud KMS. When you attempt to create the instance, the operation fails with a region mismatch error. What is the most likely cause of this issue?

**Correct answer:** A. The Cloud KMS key ring is located in a multi-region or global location instead of the us-central1 region.

**Options:**

- **A.** The Cloud KMS key ring is located in a multi-region or global location instead of the us-central1 region. — _correct answer_
- **B.** The Cloud SQL service agent was not granted the Cloud KMS CryptoKey Encrypter/Decrypter role on the key ring.
- **C.** The Cloud KMS key was created using the HSM protection level, which is not supported in us-central1.
- **D.** The Cloud SQL instance was configured with automatic backups enabled, which requires a separate key in a different region.

## Question 41

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Java Spring Boot API deployed on Cloud Run. The application has a startup time of approximately 30 seconds, and users are experiencing high latency during scale-up events. You want to reduce the container startup time without modifying the application code. What should you do?

**Correct answer:** D. Enable startup CPU boost to temporarily increase CPU allocation during instance startup, reducing the time needed for JVM initialization.

**Options:**

- **A.** Set maximum concurrency to 1 to ensure instances are fully warmed up before handling additional concurrent requests.
- **B.** Configure instance-based billing to ensure CPU is always allocated and the JVM can perform background optimization.
- **C.** Increase the vCPU allocation from 1 to 4 to provide more CPU resources for the JVM during startup and request processing.
- **D.** Enable startup CPU boost to temporarily increase CPU allocation during instance startup, reducing the time needed for JVM initialization. — _correct answer_

## Question 42

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Firestore query that filters on multiple fields with both equality and range conditions. The query searches for orders with status='processing', region='us-west', and created_at > last_week, ordered by created_at descending. You want to minimize the number of index entries scanned. How should you structure your composite index?

**Correct answer:** C. Create a composite index with fields ordered as status (ascending), region (ascending), and created_at (descending).

**Options:**

- **A.** Create a composite index with fields ordered as created_at (descending), status (ascending), and region (ascending).
- **B.** Create a composite index with fields ordered by decreasing selectivity: created_at (descending), region (ascending), status (ascending).
- **C.** Create a composite index with fields ordered as status (ascending), region (ascending), and created_at (descending). — _correct answer_
- **D.** Create separate single-field indexes for status, region, and created_at, and let Firestore merge them using the zig-zag algorithm.

## Question 43

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application on Cloud SQL for PostgreSQL is experiencing slow query performance during peak usage. Development teams using ORM frameworks are having difficulty identifying which application code is causing the performance problems. You need to diagnose and identify the root cause of slow queries while correlating them back to specific application code paths. What should you do?

**Correct answer:** B. Enable Query Insights on your Cloud SQL instance and use the sqlcommenter library in your application to automatically tag SQL queries with application information from your MVC framework.

**Options:**

- **A.** Enable Cloud Monitoring for your Cloud SQL instance and create custom dashboards to track CPU and memory usage, then manually investigate queries during periods of high resource consumption.
- **B.** Enable Query Insights on your Cloud SQL instance and use the sqlcommenter library in your application to automatically tag SQL queries with application information from your MVC framework. — _correct answer_
- **C.** Configure verbose logging on your ORM framework and export all logs to Cloud Logging, then use log-based queries to identify slow database operations by parsing execution times from log entries.
- **D.** Run EXPLAIN ANALYZE on each slow query manually in the database console and maintain a spreadsheet documenting query performance metrics correlated with application endpoints.

## Question 44

**Domain:** Building and testing applications

**Question:** You are developing a Java Spring Boot application that needs to be containerized and deployed to Google Kubernetes Engine. Your build times are consistently slow, and your container images are exceeding 1 GB in size. You want to optimize the build process and reduce image sizes following Google Cloud best practices. What should you do?

**Correct answer:** C. Use a multi-stage Dockerfile with a JDK base image for building and a JRE base image for the final runtime stage. Configure Cloud Build to build and push the image to Artifact Registry.

**Options:**

- **A.** Use a multi-stage Dockerfile with a JRE base image for building and a JDK base image for the final runtime stage. Configure Cloud Build to push only the final stage to Artifact Registry.
- **B.** Create a single-stage Dockerfile with a JDK base image and use Cloud Build to build the image. Configure Artifact Registry cleanup policies to delete large images automatically.
- **C.** Use a multi-stage Dockerfile with a JDK base image for building and a JRE base image for the final runtime stage. Configure Cloud Build to build and push the image to Artifact Registry. — _correct answer_
- **D.** Configure Cloud Build to increase the machine type to e2-highcpu-32 and enable parallel builds. Store the complete image with all dependencies in Artifact Registry for faster deployments.

## Question 45

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new Cloud Run service that receives sporadic traffic with long periods of no requests followed by sudden bursts. Users are experiencing slow response times on the first requests after periods of inactivity due to cold starts. You want to reduce cold start latency while minimizing costs during idle periods. What should you do?

**Correct answer:** C. Configure minimum instances to 1 and enable startup CPU boost for the service.

**Options:**

- **A.** Switch to instance-based billing to ensure CPU is always allocated, even when no requests are being processed.
- **B.** Increase the maximum concurrency setting to allow each instance to handle more requests simultaneously during traffic bursts.
- **C.** Configure minimum instances to 1 and enable startup CPU boost for the service. — _correct answer_
- **D.** Set the maximum instances limit higher to ensure Cloud Run can quickly scale to handle burst traffic.

## Question 46

**Domain:** Building and testing applications

**Question:** Your team is building a Java application using Cloud Build. The final production container image is currently 1.2 GB and takes a long time to deploy. You want to reduce the container image size and improve security while maintaining build reproducibility. What should you do?

**Correct answer:** C. Use a multi-stage Dockerfile that compiles the application in a build stage with the JDK and copies only the compiled JAR file to a final stage using a minimal JRE base image.

**Options:**

- **A.** Configure Cloud Build to compress the container image using gzip before pushing to Artifact Registry, and decompress it during deployment to reduce storage costs.
- **B.** Create a Cloud Build configuration that uses a single-stage Dockerfile with the full JDK, then run a separate step to delete unnecessary files from the image before pushing to Artifact Registry.
- **C.** Use a multi-stage Dockerfile that compiles the application in a build stage with the JDK and copies only the compiled JAR file to a final stage using a minimal JRE base image. — _correct answer_
- **D.** Add a .dockerignore file to exclude test files during the build, which will automatically reduce the final image size by removing unnecessary dependencies from all layers.

## Question 47

**Domain:** Integrating applications with Google Cloud services

**Question:** You are managing a GKE cluster and need to configure Horizontal Pod Autoscaler (HPA) to scale your deployment based on a custom application metric stored in Cloud Monitoring. What component must you install to enable HPA to access Cloud Monitoring metrics?

**Correct answer:** B. Install the Custom Metrics Stackdriver Adapter in your GKE cluster. This adapter exposes Cloud Monitoring metrics through the Kubernetes custom metrics API, allowing HPA to use them for scaling decisions.

**Options:**

- **A.** Configure the HPA manifest with Cloud Monitoring query language (MQL) expressions to define the metric conditions for scaling directly in the Kubernetes resource specification.
- **B.** Install the Custom Metrics Stackdriver Adapter in your GKE cluster. This adapter exposes Cloud Monitoring metrics through the Kubernetes custom metrics API, allowing HPA to use them for scaling decisions. — _correct answer_
- **C.** Enable the Cloud Monitoring API in your project and grant the cluster service account the roles/monitoring.viewer role. HPA will automatically query Cloud Monitoring metrics through the API.
- **D.** Deploy a Prometheus server in your cluster with the prometheus-to-sd exporter. Configure HPA to use the Prometheus metrics API for custom metric-based scaling decisions.

## Question 48

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service experiences unpredictable traffic patterns, with periods of no traffic followed by sudden spikes. During traffic spikes, you observe HTTP 429 errors even though your maximum instances setting is 100. Investigation shows that requests queue for approximately 10 seconds before failing. You want to reduce the frequency of 429 errors during traffic spikes. What should you do?

**Correct answer:** C. Configure minimum instances greater than 0 to maintain warm instances ready to handle sudden traffic spikes.

**Options:**

- **A.** Enable startup CPU boost and increase CPU allocation to speed up container startup times during scaling events.
- **B.** Increase the maximum instances limit beyond 100 to allow more instances during traffic spikes.
- **C.** Configure minimum instances greater than 0 to maintain warm instances ready to handle sudden traffic spikes. — _correct answer_
- **D.** Set maximum concurrency to the highest value of 1000 to maximize the requests each instance can handle before new instances are needed.

## Question 49

**Domain:** Deploying applications

**Question:** You are configuring an external Application Load Balancer using GKE Ingress for a production web application. The application will be running for an extended period and must have a permanent IP address that can be registered with DNS. By default, what type of IP address does GKE allocate for an Ingress, and how should you configure a static IP?

**Correct answer:** D. GKE allocates an ephemeral IP address by default. Reserve a global static external IP address and reference it using the kubernetes.io/ingress.global-static-ip-name annotation.

**Options:**

- **A.** GKE allocates a static IP address by default. No additional configuration is needed for long-running production applications.
- **B.** GKE allocates an ephemeral IP address by default. Specify the desired IP address directly in the spec.loadBalancerIP field of the Ingress manifest.
- **C.** GKE allocates an ephemeral IP address by default. Reserve a regional static external IP address and reference it using the kubernetes.io/ingress.regional-static-ip-name annotation.
- **D.** GKE allocates an ephemeral IP address by default. Reserve a global static external IP address and reference it using the kubernetes.io/ingress.global-static-ip-name annotation. — _correct answer_

## Question 50

**Domain:** Building and testing applications

**Question:** You are developing a CI/CD pipeline using Cloud Build that requires database credentials for running integration tests. The credentials are stored in Secret Manager. You need to configure your cloudbuild.yaml file to securely access these credentials during the test step while following Google Cloud security best practices. What should you do?

**Correct answer:** B. Use the availableSecrets field to specify the Secret Manager secret version, and reference the secret using the secretEnv field in the test build step to expose it as an environment variable.

**Options:**

- **A.** Store the database credentials as substitution variables in the Cloud Build trigger configuration and reference them using ${_DATABASE_PASSWORD} syntax.
- **B.** Use the availableSecrets field to specify the Secret Manager secret version, and reference the secret using the secretEnv field in the test build step to expose it as an environment variable. — _correct answer_
- **C.** Create a build step that uses gcloud secrets versions access to retrieve the secret and save it to a file in the /workspace directory, then read the file in subsequent build steps.
- **D.** Hardcode the credentials in an encrypted format within the cloudbuild.yaml file and decrypt them at runtime using a custom decryption build step.

## Question 51

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses VPC Service Controls with a perimeter that protects Cloud Storage and BigQuery. You notice that VMs within your VPC network can still access unsupported Google Cloud services that are not protected by VPC Service Controls. You want to limit which services can be accessed from within the perimeter to only the restricted services. What should you configure?

**Correct answer:** A. Enable VPC accessible services on the perimeter and set it to RESTRICTED-SERVICES to limit access from VMs inside the perimeter to only the services that are restricted by the perimeter.

**Options:**

- **A.** Enable VPC accessible services on the perimeter and set it to RESTRICTED-SERVICES to limit access from VMs inside the perimeter to only the services that are restricted by the perimeter. — _correct answer_
- **B.** Create organization policies to deny the use of unsupported Google Cloud services within projects inside the perimeter.
- **C.** Add all supported Google Cloud services to the restricted services list of your perimeter to ensure comprehensive protection against data exfiltration.
- **D.** Configure VPC firewall rules to block outbound traffic to all Google API endpoints except for the restricted services defined in your perimeter.

## Question 52

**Domain:** Building and testing applications

**Question:** Your team is implementing a canary deployment strategy for a Cloud Run service. You need to deploy a new revision and test it before exposing it to production traffic. The new revision should be accessible via a unique URL for testing purposes. What should you do?

**Correct answer:** C. Use gcloud run deploy with the --no-traffic and --tag flags to deploy the new revision without serving traffic and create a tagged URL for testing.

**Options:**

- **A.** Use gcloud run deploy with the --traffic=0 flag to deploy the new revision with zero percent traffic allocation.
- **B.** Deploy the new revision to a separate Cloud Run service in the same project and test it independently before merging.
- **C.** Use gcloud run deploy with the --no-traffic and --tag flags to deploy the new revision without serving traffic and create a tagged URL for testing. — _correct answer_
- **D.** Use gcloud run deploy to deploy the revision normally, then immediately run gcloud run services update-traffic to set traffic to 0%.

## Question 53

**Domain:** Integrating applications with Google Cloud services

**Question:** You are deploying a Cloud Run service that connects to a Cloud SQL for PostgreSQL instance. The service handles bursty traffic with periods of no requests followed by sudden spikes. You want to minimize cold start latency when connecting to Cloud SQL and optimize connection handling. What should you do?

**Correct answer:** B. Configure the Cloud Run service with the Cloud SQL connection using the --add-cloudsql-instances flag. Implement application-level connection pooling with appropriate pool size limits and connection recycling.

**Options:**

- **A.** Configure Direct VPC egress to connect directly to Cloud SQL private IP without using any proxy. Create a new database connection for each incoming request and close it immediately after use.
- **B.** Configure the Cloud Run service with the Cloud SQL connection using the --add-cloudsql-instances flag. Implement application-level connection pooling with appropriate pool size limits and connection recycling. — _correct answer_
- **C.** Enable Managed Connection Pooling on Cloud SQL with session pooling mode and configure your application to establish persistent connections that remain open indefinitely.
- **D.** Deploy the Cloud SQL Auth Proxy as a separate Cloud Run service and configure your application service to connect to it over the network using TCP.

## Question 54

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a real-time chat application using Firestore. Users report that messages sometimes appear twice in their chat interface. After investigation, you discover that your application is creating new snapshot listeners without removing the previous ones when users navigate between chat rooms. You need to fix this issue while maintaining real-time updates for the active chat room. What should you do?

**Correct answer:** A. Store the unsubscribe function returned by onSnapshot() and call it before creating a new listener when users switch chat rooms.

**Options:**

- **A.** Store the unsubscribe function returned by onSnapshot() and call it before creating a new listener when users switch chat rooms. — _correct answer_
- **B.** Restart the Firestore client instance each time the user switches chat rooms to ensure only one listener is active at a time.
- **C.** Implement a client-side deduplication function that filters out duplicate messages based on document ID before displaying them in the UI.
- **D.** Configure your Firestore security rules to only allow one active listener per user per collection to prevent duplicate subscriptions.

## Question 55

**Domain:** Deploying applications

**Question:** You are optimizing a large GKE cluster that contains over 10,000 ConfigMaps and Secrets. Your team rarely modifies these objects after initial creation. You want to improve cluster performance and protect against accidental configuration changes. What should you do?

**Correct answer:** C. Mark the ConfigMaps and Secrets as immutable by setting the immutable field to true in their specifications.

**Options:**

- **A.** Move all ConfigMaps and Secrets to a separate namespace and configure resource quotas to limit the number of watch operations per namespace.
- **B.** Enable automatic ConfigMap and Secret compression in the etcd database by updating the GKE cluster configuration settings.
- **C.** Mark the ConfigMaps and Secrets as immutable by setting the immutable field to true in their specifications. — _correct answer_
- **D.** Configure RBAC policies to remove update and patch verbs for ConfigMaps and Secrets from all service accounts except cluster administrators.

## Question 56

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a ticket booking application using Cloud Firestore. Multiple users may attempt to book the same seat simultaneously. You need to implement a booking function that reads the seat availability, checks if the seat is available, and if so, marks it as booked with the user's ID. What should you do?

**Correct answer:** A. Use a Firestore transaction that reads the seat document first, checks availability, and then writes the booking update if the seat is available.

**Options:**

- **A.** Use a Firestore transaction that reads the seat document first, checks availability, and then writes the booking update if the seat is available. — _correct answer_
- **B.** Read the seat document, check availability in application code, then update the document if available using a simple update operation.
- **C.** Use a batched write to update the seat availability and user ID in a single atomic operation.
- **D.** Use FieldValue.increment() to atomically update a counter tracking available seats without reading the document first.

## Question 57

**Domain:** Building and testing applications

**Question:** During a canary deployment of your Cloud Run service, you discover that the new revision is causing errors for 15% of users. The current traffic split is 20% to the new 'canary' revision and 80% to the stable 'production' revision. You need to immediately roll back to the stable revision. What should you do?

**Correct answer:** C. Run gcloud run services update-traffic SERVICE --to-tags production=100 to route all traffic to the stable revision.

**Options:**

- **A.** Run gcloud run deploy with the previous container image to create a new revision that serves all traffic.
- **B.** Scale down the canary revision to zero instances using gcloud run services update --min-instances=0.
- **C.** Run gcloud run services update-traffic SERVICE --to-tags production=100 to route all traffic to the stable revision. — _correct answer_
- **D.** Delete the canary revision using gcloud run revisions delete to stop it from receiving traffic.

## Question 58

**Domain:** Integrating applications with Google Cloud services

**Question:** You are running a containerized application on GKE and need to monitor the health of your containers by tracking CPU, memory, and restart counts. You notice that system metrics are not appearing in Cloud Monitoring. What should you verify first to troubleshoot this issue?

**Correct answer:** D. Verify that Cloud Monitoring is enabled on the cluster with system metrics collection by checking the monitoringConfig settings and ensuring SYSTEM_COMPONENTS is in the enableComponents list.

**Options:**

- **A.** Verify that Workload Identity is disabled on the cluster because the metrics agent requires the node service account to have direct IAM permissions.
- **B.** Verify that each container in your deployments has the Cloud Monitoring client library installed and is exporting metrics using the Monitoring API.
- **C.** Verify that you have deployed the Prometheus Operator CRD to the cluster and configured a ServiceMonitor resource to scrape container metrics from each pod.
- **D.** Verify that Cloud Monitoring is enabled on the cluster with system metrics collection by checking the monitoringConfig settings and ensuring SYSTEM_COMPONENTS is in the enableComponents list. — _correct answer_

## Question 59

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company has a VPC Service Controls perimeter protecting BigQuery datasets. Developers need to access these resources from the corporate network, which has a static IP range, while service accounts from Cloud Functions need access from within the VPC network. You want to configure context-aware access following Google Cloud best practices. What should you do?

**Correct answer:** A. Create an access level in Access Context Manager using the corporate IP range, attach it to the perimeter, and configure an ingress rule allowing the Cloud Functions service accounts from authorized VPC networks.

**Options:**

- **A.** Create an access level in Access Context Manager using the corporate IP range, attach it to the perimeter, and configure an ingress rule allowing the Cloud Functions service accounts from authorized VPC networks. — _correct answer_
- **B.** Add the corporate network's public IP addresses to the VPC accessible services allowlist and grant the Cloud Functions service accounts direct IAM permissions on the BigQuery datasets.
- **C.** Configure an ingress rule that allows ANY_IDENTITY from the corporate IP range and create a perimeter bridge between the Cloud Functions project and the protected BigQuery project.
- **D.** Create a single access level that includes both the corporate IP range and the Cloud Functions service accounts, then attach this access level to the perimeter for simplified management.

## Question 60

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an order processing system using Cloud Firestore server client libraries. When an order is placed, you need to create an order document, update the customer's order count, and update inventory counts for each ordered item. You do not need to read any current values before making updates. What is the most efficient approach?

**Correct answer:** C. Use a batched write to atomically perform all document create and update operations in a single commit.

**Options:**

- **A.** Perform individual write operations for each document and handle partial failures through application-level compensating transactions.
- **B.** Use the BulkWriter class to parallelize writes and maximize throughput for the multi-document update operation.
- **C.** Use a batched write to atomically perform all document create and update operations in a single commit. — _correct answer_
- **D.** Use a transaction to group all the create and update operations together to ensure atomicity.

## Question 61

**Domain:** Integrating applications with Google Cloud services

**Question:** You are deploying a critical application on GKE and need to monitor container restarts. You want to receive an alert when any container in a specific namespace restarts more than 3 times within a 10-minute window. Which Cloud Monitoring metric and configuration should you use?

**Correct answer:** D. Use the kubernetes.io/container/restart_count metric with a filter for namespace_name and configure a delta aggregation over a 10-minute rolling window with a threshold of 3.

**Options:**

- **A.** Create a log-based metric from GKE container logs that filters for restart events, then set an alert threshold of 3 with a 10-minute evaluation period.
- **B.** Use the kubernetes.io/container/uptime metric with a filter for namespace_name and configure an alert when the value drops below 10 minutes.
- **C.** Use the kubernetes.io/pod/restart_count metric with a filter for pod_name and configure a gauge aggregation with a threshold of 3.
- **D.** Use the kubernetes.io/container/restart_count metric with a filter for namespace_name and configure a delta aggregation over a 10-minute rolling window with a threshold of 3. — _correct answer_

## Question 62

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service locally using Cloud Code in VS Code. You want to test changes quickly and have the service automatically rebuild and redeploy whenever you save your source code. How should you configure your development environment?

**Correct answer:** A. Use the Cloud Run Emulator with watch mode enabled by ensuring the 'watch' field is set to true in your .vscode/launch.json file or enabling 'Automatically re-build and re-run on changes' in the Run/Debug dialog.

**Options:**

- **A.** Use the Cloud Run Emulator with watch mode enabled by ensuring the 'watch' field is set to true in your .vscode/launch.json file or enabling 'Automatically re-build and re-run on changes' in the Run/Debug dialog. — _correct answer_
- **B.** Deploy your service to Cloud Run on Google Cloud and use Cloud Build triggers to automatically build and deploy on every local file save through Cloud Source Repositories sync.
- **C.** Enable the Cloud Code file watcher by adding the 'cloudcode.fileWatcher.enabled' setting to your VS Code settings.json and configure a custom webhook to trigger container rebuilds.
- **D.** Configure a custom script that monitors file system changes and executes 'docker build' and 'docker run' commands manually to restart the container.

## Question 63

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses Cloud SQL for PostgreSQL Enterprise Plus edition with Managed Connection Pooling enabled. Users are reporting errors when executing prepared statements through the connection pool. You need to resolve this issue while maintaining connection pooling benefits. What should you do?

**Correct answer:** D. Change the Managed Connection Pooling mode from transaction pooling to session pooling for applications that require prepared statement support.

**Options:**

- **A.** Increase the max_pool_size configuration option for Managed Connection Pooling to ensure each prepared statement gets a dedicated connection.
- **B.** Modify the application to use parameterized queries instead of prepared statements while keeping transaction pooling mode enabled.
- **C.** Disable Managed Connection Pooling on the Cloud SQL instance and implement client-side connection pooling in the application code instead.
- **D.** Change the Managed Connection Pooling mode from transaction pooling to session pooling for applications that require prepared statement support. — _correct answer_

## Question 64

**Domain:** Building and testing applications

**Question:** You are setting up Cloud Build to run integration tests against different environment configurations (development, staging, and production). Each environment has different database connection strings and API endpoints. You want to use a single cloudbuild.yaml file that can be reused across all environments. What should you do?

**Correct answer:** B. Define user-defined substitution variables like $_DATABASE_URL and $_API_ENDPOINT in your cloudbuild.yaml. Create separate build triggers for each environment and specify the substitution variable values in each trigger's configuration.

**Options:**

- **A.** Store the environment configurations in Secret Manager and use the availableSecrets field in cloudbuild.yaml. Reference secrets using environment variables in each build step.
- **B.** Define user-defined substitution variables like $_DATABASE_URL and $_API_ENDPOINT in your cloudbuild.yaml. Create separate build triggers for each environment and specify the substitution variable values in each trigger's configuration. — _correct answer_
- **C.** Use the env field in build steps to hardcode all environment values. Add conditional logic using bash scripts to select the correct values based on the branch name.
- **D.** Create environment-specific cloudbuild.yaml files (cloudbuild-dev.yaml, cloudbuild-staging.yaml, cloudbuild-prod.yaml). Configure separate triggers to use the appropriate configuration file for each environment.

## Question 65

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Node.js API on Cloud Run that uses asynchronous background tasks to send telemetry data after returning responses to clients. During testing, you notice that telemetry data is occasionally missing. What is the most likely cause and solution?

**Correct answer:** A. Configure the service to use instance-based billing so that CPU remains allocated after returning responses, allowing background tasks to complete.

**Options:**

- **A.** Configure the service to use instance-based billing so that CPU remains allocated after returning responses, allowing background tasks to complete. — _correct answer_
- **B.** Set minimum instances to a value greater than zero to ensure instances are always available to complete background work.
- **C.** Enable startup CPU boost to provide additional CPU resources for processing background telemetry tasks.
- **D.** Increase the maximum concurrency setting to allow more requests to be processed in parallel, providing more CPU for background tasks.

## Question 66

**Domain:** Integrating applications with Google Cloud services

**Question:** Your mobile application uses Firestore real-time listeners to display a list of active orders. When users navigate away from the orders screen, you notice the application continues consuming bandwidth. You need to properly manage the listener lifecycle to optimize resource usage. What should you do?

**Correct answer:** C. Store the unsubscribe function returned by onSnapshot() and call it when the user navigates away from the orders screen.

**Options:**

- **A.** Configure the listener with a maximum document limit to reduce bandwidth consumption.
- **B.** Set a timeout on the listener to automatically disconnect after 5 minutes of inactivity.
- **C.** Store the unsubscribe function returned by onSnapshot() and call it when the user navigates away from the orders screen. — _correct answer_
- **D.** Disable offline persistence for the Firestore instance to prevent cached data from triggering updates.

## Question 67

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application creates Cloud Tasks to process user-uploaded documents. Users occasionally click the upload button multiple times, creating duplicate tasks. You want to prevent these duplicate tasks from being processed while minimizing latency impact on task creation. What should you do?

**Correct answer:** D. Generate a hashed task ID based on the document metadata and explicitly specify it when creating tasks to enable deduplication.

**Options:**

- **A.** Use sequential task IDs based on timestamps to create predictable, unique identifiers for each document upload.
- **B.** Configure the queue with max_concurrent_dispatches set to 1 to ensure tasks are processed sequentially and duplicates are avoided.
- **C.** Let Cloud Tasks auto-generate unique task IDs and implement deduplication logic in your task handler using a database.
- **D.** Generate a hashed task ID based on the document metadata and explicitly specify it when creating tasks to enable deduplication. — _correct answer_

## Question 68

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a production application on Cloud Run that retrieves database credentials from Secret Manager at startup. The security team requires a deployment strategy that minimizes the risk of service outages caused by accidental secret changes. What should you do?

**Correct answer:** D. Configure your application to reference secrets by their version number rather than using the latest alias. Deploy updates to version numbers using your existing release processes.

**Options:**

- **A.** Store the secrets as environment variables on Cloud Run instead of using Secret Manager. Environment variables are resolved at runtime and provide faster access.
- **B.** Enable automatic replication for all secrets and configure Secret Manager to automatically rollback to previous versions when new secrets are created.
- **C.** Configure your application to always use the latest alias when accessing secrets. This ensures your application automatically uses the most recent credentials without requiring redeployment.
- **D.** Configure your application to reference secrets by their version number rather than using the latest alias. Deploy updates to version numbers using your existing release processes. — _correct answer_

## Question 69

**Domain:** Integrating applications with Google Cloud services

**Question:** You manage an application that makes frequent Cloud Storage JSON API calls. The application writes audit logs for each API call, but the high request volume is causing it to approach Cloud Storage quotas. You want to reduce API calls while maintaining accurate object listings. What should you do?

**Correct answer:** C. Use the maxResults parameter to increase the page size and reduce the total number of API calls needed to list all objects.

**Options:**

- **A.** Disable the audit logging feature to reduce the processing overhead associated with each API call.
- **B.** Switch from the JSON API to the XML API, which has higher rate limits for listing operations.
- **C.** Use the maxResults parameter to increase the page size and reduce the total number of API calls needed to list all objects. — _correct answer_
- **D.** Set a higher quota limit for Cloud Storage API requests through the IAM & Admin Quotas page in the Google Cloud console.

## Question 70

**Domain:** Deploying applications

**Question:** Your organization requires that container image tags in production Artifact Registry repositories cannot be overwritten to prevent accidental deployments of modified images. You need to configure the repository to enforce this requirement while still allowing development teams to push new image versions. What should you configure?

**Correct answer:** D. Enable the immutable image tags setting on the Artifact Registry repository to prevent tags from being reassigned to different image versions.

**Options:**

- **A.** Grant development teams only the Artifact Registry Reader role and reserve the Writer role for the CI/CD pipeline service account.
- **B.** Configure a cleanup policy on the repository that prevents deletion of tagged images older than 30 days.
- **C.** Set up Binary Authorization with a policy that only allows deployment of images with specific approved tags.
- **D.** Enable the immutable image tags setting on the Artifact Registry repository to prevent tags from being reassigned to different image versions. — _correct answer_

## Question 71

**Domain:** Deploying applications

**Question:** Your Cloud Run service uses a Serverless VPC Access connector to access a Cloud SQL database in your VPC network. Security requirements mandate that all outbound traffic from the service, including traffic to external APIs, must pass through your corporate firewall running on a Compute Engine VM in the VPC. What VPC egress setting should you configure for the Cloud Run service?

**Correct answer:** C. Set the vpc-egress setting to all-traffic to route all outbound requests through the VPC network.

**Options:**

- **A.** Configure Cloud NAT on the VPC network and keep the default egress setting.
- **B.** Set the vpc-egress setting to private-ranges-only to route only private IP traffic through the VPC.
- **C.** Set the vpc-egress setting to all-traffic to route all outbound requests through the VPC network. — _correct answer_
- **D.** Create a VPC firewall rule to deny all egress traffic and allow only specific destinations.

## Question 72

**Domain:** Building and testing applications

**Question:** During a canary deployment of your Cloud Run service, you notice increased error rates from Cloud Monitoring for the new revision receiving 25% of traffic. You need to immediately roll back all traffic to the stable revision tagged 'stable'. What should you do?

**Correct answer:** D. Run 'gcloud run services update-traffic myservice --to-tags stable=100' to route all traffic back to the stable revision.

**Options:**

- **A.** Delete the canary revision using 'gcloud run revisions delete REVISION_NAME' to stop it from receiving traffic.
- **B.** Redeploy the stable container image using 'gcloud run deploy myservice --image STABLE_IMAGE_URL' to create a new revision.
- **C.** Scale the canary revision to zero instances using 'gcloud run services update myservice --max-instances 0'.
- **D.** Run 'gcloud run services update-traffic myservice --to-tags stable=100' to route all traffic back to the stable revision. — _correct answer_

## Question 73

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a cloud-native application on Google Cloud that handles sensitive financial data stored in BigQuery and Cloud Storage. Your security team requires you to implement data exfiltration protection to prevent data from being copied outside the organization. You need to test the impact of security controls before enforcing them. What should you do?

**Correct answer:** B. Create a VPC Service Controls perimeter in dry run mode with BigQuery and Cloud Storage as restricted services. Analyze the violation logs in Cloud Audit Logs to identify legitimate traffic patterns before enabling enforced mode.

**Options:**

- **A.** Enable Cloud Data Loss Prevention (DLP) scanning on all BigQuery tables and Cloud Storage buckets to prevent unauthorized data access.
- **B.** Create a VPC Service Controls perimeter in dry run mode with BigQuery and Cloud Storage as restricted services. Analyze the violation logs in Cloud Audit Logs to identify legitimate traffic patterns before enabling enforced mode. — _correct answer_
- **C.** Configure VPC firewall rules to block all outbound traffic from your VPC network to prevent data exfiltration from BigQuery and Cloud Storage.
- **D.** Create a VPC Service Controls perimeter in enforced mode immediately with BigQuery and Cloud Storage as restricted services. Configure ingress rules for all IP addresses to avoid service disruption.

## Question 74

**Domain:** Building and testing applications

**Question:** You are setting up a Cloud Build pipeline to run integration tests that may occasionally fail due to external service flakiness. You want the build to continue even if specific non-critical test steps fail, but you still need to track which tests failed for investigation. Critical tests should still cause the build to fail. What should you do?

**Correct answer:** C. Set allowFailure: true for non-critical test steps. Review the build results using gcloud builds describe to check the status of individual steps and identify which ones failed.

**Options:**

- **A.** Configure allowExitCodes with common failure codes for non-critical test steps. Critical test steps should not have allowExitCodes configured so they fail the build on any non-zero exit.
- **B.** Remove non-critical test steps from the main build pipeline and schedule them to run as a separate build using Cloud Scheduler after each deployment.
- **C.** Set allowFailure: true for non-critical test steps. Review the build results using gcloud builds describe to check the status of individual steps and identify which ones failed. — _correct answer_
- **D.** Wrap non-critical test commands in shell scripts that always return exit code 0 and write the actual result to a log file in Cloud Storage for later review.

## Question 75

**Domain:** Integrating applications with Google Cloud services

**Question:** Your development team wants to collect custom application metrics from a Cloud Run service. The metrics should be consistent with metrics collected from GKE workloads and allow querying with PromQL across both environments. What is the recommended approach?

**Correct answer:** C. Deploy the Managed Service for Prometheus sidecar with your Cloud Run service. Configure your application to expose Prometheus-format metrics on a metrics endpoint for the sidecar to scrape.

**Options:**

- **A.** Install the Ops Agent on the underlying Cloud Run infrastructure to collect metrics from your containerized application.
- **B.** Create log-based counter metrics from structured log entries containing metric values. Export the logs to BigQuery for analysis.
- **C.** Deploy the Managed Service for Prometheus sidecar with your Cloud Run service. Configure your application to expose Prometheus-format metrics on a metrics endpoint for the sidecar to scrape. — _correct answer_
- **D.** Use the Cloud Monitoring API directly in your application code to write custom metrics to Cloud Monitoring using the custom.googleapis.com metric prefix.

## Question 76

**Domain:** Deploying applications

**Question:** You are deploying a new Cloud Run service using the gcloud CLI and need to configure both a database password as an environment variable and an API certificate as a mounted file. Both are stored as secrets in Secret Manager in the same project. Which gcloud command correctly configures both secrets?

**Correct answer:** A. gcloud run deploy my-service --image IMAGE_URL --update-secrets=DB_PASSWORD=db-password:1,/secrets/api-cert=api-certificate:1

**Options:**

- **A.** gcloud run deploy my-service --image IMAGE_URL --update-secrets=DB_PASSWORD=db-password:1,/secrets/api-cert=api-certificate:1 — _correct answer_
- **B.** gcloud run deploy my-service --image IMAGE_URL --secrets=DB_PASSWORD=db-password,/secrets/api-cert=api-certificate
- **C.** gcloud run deploy my-service --image IMAGE_URL --set-env-vars=DB_PASSWORD=db-password:1 --set-volumes=/secrets/api-cert=api-certificate:1
- **D.** gcloud run deploy my-service --image IMAGE_URL --env-secrets=DB_PASSWORD=db-password:1 --volume-secrets=/secrets/api-cert=api-certificate:1

## Question 77

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization has deployed a Cloud Run application that needs to access BigQuery datasets protected by a VPC Service Controls perimeter. Users access the application from corporate networks and trusted devices. You need to configure the perimeter to allow context-aware access based on user identity and IP address while preventing unauthorized access. What should you do?

**Correct answer:** B. Create an ingress rule that specifies the allowed identities and source IP ranges. Configure the rule to permit access only to the BigQuery service and specific methods required by the application.

**Options:**

- **A.** Create an access level based on IP address ranges and add it to the service perimeter. Grant all users access to all services within the perimeter once they satisfy the access level conditions.
- **B.** Create an ingress rule that specifies the allowed identities and source IP ranges. Configure the rule to permit access only to the BigQuery service and specific methods required by the application. — _correct answer_
- **C.** Add the Cloud Run service project to the same service perimeter as the BigQuery datasets. Configure network firewall rules to restrict traffic to corporate IP ranges.
- **D.** Configure Identity-Aware Proxy (IAP) to authenticate users accessing the Cloud Run application. IAP automatically integrates with VPC Service Controls to enforce perimeter policies.

## Question 78

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for an IoT application that collects temperature readings from 100,000 sensors every 5 seconds. Your primary query pattern is to retrieve the last 24 hours of readings for a specific sensor. You want to optimize for both write throughput and query performance. Which row key design should you use?

**Correct answer:** B. Use a row key format of sensorId#reverseTimestamp, where reverseTimestamp is calculated by subtracting the timestamp from Long.MAX_VALUE.

**Options:**

- **A.** Use a row key format of hashOfSensorId#timestamp to maximize write distribution across nodes with fully randomized prefixes.
- **B.** Use a row key format of sensorId#reverseTimestamp, where reverseTimestamp is calculated by subtracting the timestamp from Long.MAX_VALUE. — _correct answer_
- **C.** Use a row key format of timestamp#sensorId to enable efficient time-range queries across all sensors by scanning rows sequentially based on time.
- **D.** Use a row key format of date#sensorId#timestamp to organize data by date first for easier management and garbage collection.

## Question 79

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is migrating a time-series analytics application to Cloud Bigtable. The application records metrics from web servers every second and frequently queries metrics for specific servers over week-long periods. You want to optimize for read performance while minimizing storage costs. How should you design your schema?

**Correct answer:** B. Use a time bucket pattern where each row represents one week of data for a server, with the row key formatted as server_id#week_number and store each metric in a separate column with multiple timestamped cells.

**Options:**

- **A.** Use a single-timestamp pattern where each row represents one measurement, with the row key formatted as timestamp#server_id to optimize for time-range queries across all servers.
- **B.** Use a time bucket pattern where each row represents one week of data for a server, with the row key formatted as server_id#week_number and store each metric in a separate column with multiple timestamped cells. — _correct answer_
- **C.** Store all metrics for all servers in a single row per day using a date-only row key, with server_id stored in the column qualifier.
- **D.** Create separate tables for each server to isolate their data and simplify query patterns.

## Question 80

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application using Firestore. Users need to see changes made by other users in real-time. You want to implement the most efficient method to keep the user interface updated while minimizing costs. What should you do?

**Correct answer:** A. Use the onSnapshot() method to attach a real-time listener to the document collection. Process document changes in the callback to update the UI.

**Options:**

- **A.** Use the onSnapshot() method to attach a real-time listener to the document collection. Process document changes in the callback to update the UI. — _correct answer_
- **B.** Configure Firestore Triggers with Cloud Functions to send push notifications to the application whenever documents change.
- **C.** Implement a polling mechanism using get() that retrieves documents from Firestore every 2 seconds to check for updates.
- **D.** Use Cloud Pub/Sub to subscribe to Firestore change notifications and push updates to the application through a websocket server.

## Question 81

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying an event-driven API on Cloud Run that uses OpenTelemetry for distributed tracing. After deployment, you discover that trace data is incomplete because the OpenTelemetry agent cannot run background threads to export traces after request processing completes. The application currently uses the default Cloud Run billing configuration. What should you do to resolve this issue while minimizing costs?

**Correct answer:** D. Update the Cloud Run service to use instance-based billing by deploying with the --no-cpu-throttling flag.

**Options:**

- **A.** Configure minimum instances to 1 to ensure the OpenTelemetry agent always has an instance available to export trace data.
- **B.** Increase the request timeout to 15 minutes to give the OpenTelemetry agent more time to export traces within the request context.
- **C.** Modify the application code to synchronously export all trace data before returning the HTTP response to each request.
- **D.** Update the Cloud Run service to use instance-based billing by deploying with the --no-cpu-throttling flag. — _correct answer_

## Question 82

**Domain:** Deploying applications

**Question:** Your team deployed an application update to GKE that is causing errors. You need to quickly revert to the previous working version while investigating the issue. The application was deployed using a Deployment resource. What is the fastest way to roll back using kubectl?

**Correct answer:** D. kubectl rollout undo deployment/my-app

**Options:**

- **A.** kubectl scale deployment my-app --replicas=0 && kubectl apply -f stable-deployment.yaml
- **B.** kubectl delete deployment my-app && kubectl apply -f previous-deployment.yaml
- **C.** kubectl rollout restart deployment/my-app --to-revision=1
- **D.** kubectl rollout undo deployment/my-app — _correct answer_

## Question 83

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team stores application log data in Cloud Bigtable. You have configured two column families: 'metadata' for log source and level information that is always needed, and 'details' for verbose debugging information that is rarely accessed. Users report slow query performance when retrieving metadata. You want to optimize read performance for the common query pattern. What should you do?

**Correct answer:** D. Configure read requests to filter by the 'metadata' column family only, allowing Bigtable to efficiently seek past the 'details' column family data.

**Options:**

- **A.** Merge the 'metadata' and 'details' column families into a single column family to reduce the overhead of managing multiple families.
- **B.** Increase the number of nodes in your Bigtable cluster to distribute the read workload across more servers.
- **C.** Create a separate table exclusively for metadata to eliminate any performance impact from the details data.
- **D.** Configure read requests to filter by the 'metadata' column family only, allowing Bigtable to efficiently seek past the 'details' column family data. — _correct answer_

## Question 84

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an IoT monitoring application that stores sensor readings in Cloud Bigtable. Each sensor sends data every second and your application needs to efficiently query all readings for a specific sensor within a time range. You need to design a row key that supports efficient range scans while avoiding hotspots. Which row key design should you use?

**Correct answer:** C. sensor_id#timestamp (e.g., 'sensor_4223#1425330757685')

**Options:**

- **A.** timestamp#sensor_id (e.g., '1425330757685#sensor_4223')
- **B.** hash(sensor_id)#timestamp (e.g., 'a7b3c9#1425330757685')
- **C.** sensor_id#timestamp (e.g., 'sensor_4223#1425330757685') — _correct answer_
- **D.** reverse_timestamp#sensor_id (e.g., '8574669574257#sensor_4223')

## Question 85

**Domain:** Building and testing applications

**Question:** You are a developer setting up your local environment to develop and debug a containerized Kubernetes application using VS Code. You need to configure Cloud Code to build, run, and debug your application on a local Kubernetes cluster. You want to minimize setup complexity. What should you do?

**Correct answer:** D. Install the Cloud Code extension and allow it to manage dependencies. Use the Cloud Code: Control minikube command to start a local cluster, then use Cloud Code: Run on Kubernetes to deploy your application.

**Options:**

- **A.** Install Cloud Code and manually download Skaffold binaries. Create a custom skaffold.yaml file from scratch and configure environment variables for Docker daemon access.
- **B.** Install Cloud Code and create a GKE cluster in Google Cloud. Configure Cloud Code to deploy directly to the remote GKE cluster for all development and testing workflows.
- **C.** Install Docker Desktop, kubectl, and minikube manually. Configure each tool separately before installing Cloud Code, then manually run minikube start from the terminal before using Cloud Code.
- **D.** Install the Cloud Code extension and allow it to manage dependencies. Use the Cloud Code: Control minikube command to start a local cluster, then use Cloud Code: Run on Kubernetes to deploy your application. — _correct answer_

## Question 86

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is developing a Cloud Run-based application that requires caching for session data using Memorystore for Redis. During testing, the application returns connection errors when attempting to reach the Redis instance. The Memorystore instance is configured correctly and running. What is the most likely cause of this issue?

**Correct answer:** C. The Cloud Run service is not configured to access the VPC network where the Memorystore instance is located.

**Options:**

- **A.** The Memorystore instance has in-transit encryption enabled, which prevents connections from Cloud Run services.
- **B.** The Memorystore instance is using the Basic Tier which does not support Cloud Run integrations.
- **C.** The Cloud Run service is not configured to access the VPC network where the Memorystore instance is located. — _correct answer_
- **D.** The Cloud Run service and the Memorystore instance are running on different versions of Redis protocol.

## Question 87

**Domain:** Deploying applications

**Question:** Your team is deploying a Cloud Run service that needs to access database credentials stored in Secret Manager. The service will be deployed using a custom service account. When you deploy the service, it fails with a permission denied error when trying to access the secret. What is the most likely cause and how should you fix it?

**Correct answer:** C. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service account on the secret.

**Options:**

- **A.** Grant the Secret Manager Admin role (roles/secretmanager.admin) to the Cloud Run service account on the project.
- **B.** Enable the Secret Manager API and retry the deployment without any role changes.
- **C.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service account on the secret. — _correct answer_
- **D.** Grant the Cloud Run Admin role (roles/run.admin) to the Cloud Run service account on the project.

## Question 88

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application deployed on Cloud Run. The application uses Firestore to store document data and needs to display real-time updates to users. Your application receives spikes of traffic with multiple users editing the same document collection. You notice that users sometimes receive stale data. You want to ensure users always see the latest document changes while minimizing costs. What should you do?

**Correct answer:** B. Implement snapshot listeners using the onSnapshot method to subscribe to document changes and receive immediate notifications when data is modified.

**Options:**

- **A.** Configure the application to use periodic polling with one-shot get() requests every 500 milliseconds to fetch the latest document state from Firestore.
- **B.** Implement snapshot listeners using the onSnapshot method to subscribe to document changes and receive immediate notifications when data is modified. — _correct answer_
- **C.** Enable Firestore offline persistence and rely solely on the local cache with getDocFromCache() to serve data to users faster.
- **D.** Implement a Pub/Sub topic that triggers Cloud Run functions to notify clients whenever documents change in Firestore.

## Question 89

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company runs an e-commerce application with a Cloud SQL for MySQL primary instance that handles both transactional operations and analytics reporting queries. The reporting queries are causing performance degradation for the transactional workload. You need to improve performance while ensuring reporting data is as current as possible. What should you do?

**Correct answer:** A. Create a read replica of the primary Cloud SQL instance and configure the application to direct all reporting queries to the read replica while keeping transactional operations on the primary instance.

**Options:**

- **A.** Create a read replica of the primary Cloud SQL instance and configure the application to direct all reporting queries to the read replica while keeping transactional operations on the primary instance. — _correct answer_
- **B.** Increase the Cloud SQL instance machine type to provide more CPU and memory resources for handling both transactional and reporting workloads on the same instance.
- **C.** Export the database to BigQuery on a scheduled basis and configure the reporting application to query BigQuery instead of Cloud SQL for all analytics queries.
- **D.** Configure the primary Cloud SQL instance with a higher priority for transactional queries using database query hints and lower priority for reporting queries.

## Question 90

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are a developer at a financial services company that is planning to enable VPC Service Controls for sensitive data in BigQuery and Cloud Storage. Before enforcing the perimeter, you need to test the configuration without disrupting production workloads. How should you configure the service perimeter?

**Correct answer:** D. Create the service perimeter in dry run mode. Analyze the violation logs in Cloud Audit Logs to identify access patterns, then enforce the configuration after resolving identified issues.

**Options:**

- **A.** Create the service perimeter in enforced mode with wide-open access levels. Gradually restrict access levels over time based on observed traffic patterns.
- **B.** Create the service perimeter in enforced mode. Monitor Cloud Monitoring dashboards to identify any blocked requests and add access levels as needed.
- **C.** Create a separate test project with sample data and enforce the service perimeter there. Copy the exact configuration to production after testing is complete.
- **D.** Create the service perimeter in dry run mode. Analyze the violation logs in Cloud Audit Logs to identify access patterns, then enforce the configuration after resolving identified issues. — _correct answer_

## Question 91

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a containerized application on GKE and need to create an alerting policy that monitors the ratio of HTTP 5xx errors to total requests. You want to be alerted when the error rate exceeds 5% for 10 minutes. What is the recommended approach to create this alerting policy?

**Correct answer:** B. Create an alerting policy with a PromQL-based condition that calculates the ratio of error requests to total requests, and configure the threshold and evaluation duration.

**Options:**

- **A.** Create a log-based metric that counts 5xx errors from Cloud Logging, then create a separate metric-threshold alerting policy that monitors the error count against total requests.
- **B.** Create an alerting policy with a PromQL-based condition that calculates the ratio of error requests to total requests, and configure the threshold and evaluation duration. — _correct answer_
- **C.** Create two separate alerting policies: one to monitor 5xx error count and another to monitor total request count, then manually correlate the alerts when both trigger simultaneously.
- **D.** Export all GKE request metrics to BigQuery using a log sink, then create a scheduled query to calculate the error ratio and trigger alerts using Cloud Functions when the threshold is exceeded.

## Question 92

**Domain:** Building and testing applications

**Question:** You have deployed a new revision of your Cloud Run service with the --no-traffic flag and a tag named 'green'. After successfully testing the revision at its tagged URL, you want to gradually migrate production traffic to it. You plan to start with 10% traffic. Which command should you use?

**Correct answer:** B. gcloud run services update-traffic myservice --to-tags green=10

**Options:**

- **A.** gcloud run revisions update green --traffic-percent=10
- **B.** gcloud run services update-traffic myservice --to-tags green=10 — _correct answer_
- **C.** gcloud run services update-traffic myservice --to-latest=10
- **D.** gcloud run deploy myservice --image IMAGE_URL --traffic green=10

## Question 93

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team runs a Cloud Run service that processes financial transactions. You need to collect custom application metrics to track the number of transactions processed per second and display them on Cloud Monitoring dashboards. The metrics should be collected without modifying the application's deployment architecture significantly. What should you do?

**Correct answer:** D. Add an OpenTelemetry Collector sidecar to the Cloud Run service configuration. Instrument the application to export metrics in OTLP format, and ensure the service account has the Monitoring Metric Writer role.

**Options:**

- **A.** Configure the Cloud Run service to write metrics directly to Cloud Logging in JSON format. Create log-based metrics in Cloud Monitoring to convert the logs into metrics.
- **B.** Install the Ops Agent on the Cloud Run container and configure it to collect custom application metrics from the application's metrics endpoint.
- **C.** Deploy a separate Compute Engine VM running Prometheus to scrape metrics from the Cloud Run service endpoint. Configure Prometheus to push metrics to Cloud Monitoring.
- **D.** Add an OpenTelemetry Collector sidecar to the Cloud Run service configuration. Instrument the application to export metrics in OTLP format, and ensure the service account has the Monitoring Metric Writer role. — _correct answer_

## Question 94

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new application to GKE Autopilot that needs to access BigQuery. You created an IAM service account with the BigQuery Data Viewer role. You want to configure your application's Pod to authenticate using Workload Identity Federation for GKE. Which configuration step is unnecessary for GKE Autopilot clusters?

**Correct answer:** D. Manually enabling Workload Identity Federation for GKE on the cluster or its node pools using the gcloud container clusters update command.

**Options:**

- **A.** Annotating the Kubernetes service account with iam.gke.io/gcp-service-account to specify which IAM service account it should impersonate.
- **B.** Creating a Kubernetes service account in the namespace where your application will run and specifying it in the Pod's serviceAccountName field.
- **C.** Creating an IAM policy binding between the Kubernetes service account and the IAM service account using the roles/iam.workloadIdentityUser role.
- **D.** Manually enabling Workload Identity Federation for GKE on the cluster or its node pools using the gcloud container clusters update command. — _correct answer_

## Question 95

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an analytics application using Cloud Firestore that requires querying employee documents by salary and years of experience. Users need to filter employees whose salary is greater than $100,000 and experience is greater than 5 years. The query must return results ordered by salary in descending order. You want to minimize index entries scanned and query costs. How should you structure your composite index?

**Correct answer:** B. Create a composite index with salary in descending order as the first field followed by experience in ascending order, with collection scope.

**Options:**

- **A.** Create a composite index with experience in ascending order as the first field followed by salary in descending order, with collection scope.
- **B.** Create a composite index with salary in descending order as the first field followed by experience in ascending order, with collection scope. — _correct answer_
- **C.** Create separate single-field indexes for salary and experience fields and let Firestore merge them automatically at query time.
- **D.** Create a composite index with salary and experience fields both in descending order, with collection group scope.

## Question 96

**Domain:** Integrating applications with Google Cloud services

**Question:** Your microservices application runs on GKE and connects to multiple Cloud SQL instances using the Cloud SQL Auth Proxy. You notice that application pods are failing to connect to the database intermittently. After investigation, you find that the Cloud SQL Auth Proxy process occasionally stops, causing all connections to drop. You need to ensure high availability of database connections. What should you do?

**Correct answer:** D. Deploy the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application container and configure appropriate health checks.

**Options:**

- **A.** Install the Cloud SQL Auth Proxy on each GKE node using a DaemonSet and have applications connect to the node's IP address.
- **B.** Deploy a single Cloud SQL Auth Proxy as a separate Deployment with multiple replicas and expose it as a Service.
- **C.** Configure your application to use direct TCP connections to Cloud SQL with SSL certificates instead of the Cloud SQL Auth Proxy.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application container and configure appropriate health checks. — _correct answer_

## Question 97

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a web application on Cloud Run that processes user transactions. Your operations team needs to track the distribution of API response times from your application logs to set up SLI-based alerting. The response times are logged as structured JSON with a 'latency_ms' numeric field. What should you do to enable tracking of response time distributions in Cloud Monitoring?

**Correct answer:** B. Create a distribution log-based metric with a filter matching your application logs and configure the value extractor to use the 'latency_ms' field from the JSON payload.

**Options:**

- **A.** Create a counter log-based metric with a filter matching your application logs and add labels to extract the 'latency_ms' field for grouping.
- **B.** Create a distribution log-based metric with a filter matching your application logs and configure the value extractor to use the 'latency_ms' field from the JSON payload. — _correct answer_
- **C.** Configure Cloud Trace to automatically extract latency values from your application logs and create custom metrics.
- **D.** Export your logs to BigQuery using a log sink and create a scheduled query to calculate latency percentiles for Cloud Monitoring.

## Question 98

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing an application deployed on Cloud Run that needs to read API keys from Secret Manager. The application should automatically receive updated secret values when secrets are rotated without requiring a redeployment. What should you do?

**Correct answer:** A. Mount the secrets as a volume in Cloud Run. When reading the volume, Cloud Run fetches the secret value from Secret Manager to use the value with the latest version.

**Options:**

- **A.** Mount the secrets as a volume in Cloud Run. When reading the volume, Cloud Run fetches the secret value from Secret Manager to use the value with the latest version. — _correct answer_
- **B.** Use the Secret Manager client library in your application to access secrets directly via the API. Configure Cloud Run to use a dedicated service account with the secretAccessor role.
- **C.** Configure Eventarc to trigger a Cloud Run service redeployment whenever a new secret version is added to Secret Manager.
- **D.** Expose the secrets as environment variables in Cloud Run and pin the secret to the latest version. Environment variables are resolved each time the container processes a request.

## Question 99

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service in us-east1 that needs to access a Memorystore for Redis instance with a private IP address. You created a Serverless VPC Access connector in us-central1 and configured your Cloud Run service to use it. When testing, your application cannot connect to Memorystore. What is causing this issue?

**Correct answer:** D. The Serverless VPC Access connector must be in the same region as your Cloud Run service. Create the connector in us-east1.

**Options:**

- **A.** The Cloud Run service must be configured with the all-traffic egress setting instead of the default private-ranges-only setting.
- **B.** The Serverless VPC Access connector subnet CIDR must be /26 or larger to support Cloud Run connections.
- **C.** The Memorystore for Redis instance needs to have a public IP address enabled for Cloud Run to access it through VPC connectors.
- **D.** The Serverless VPC Access connector must be in the same region as your Cloud Run service. Create the connector in us-east1. — _correct answer_

## Question 100

**Domain:** Deploying applications

**Question:** Your team deployed a GKE application exposed through an external Ingress. Users report intermittent 502 errors. Upon investigation, you discover that the load balancer health checks are failing even though Kubernetes readiness probes pass. You need to configure custom health check parameters for the load balancer. What should you do?

**Correct answer:** C. Create a BackendConfig custom resource with a healthCheck section and reference it in the Service using the cloud.google.com/backend-config annotation.

**Options:**

- **A.** Create a FrontendConfig custom resource with healthCheck parameters and add the networking.gke.io/v1beta1.FrontendConfig annotation to your Ingress manifest.
- **B.** Update the Ingress resource with a kubernetes.io/ingress.health-check annotation specifying the health check path, port, and thresholds.
- **C.** Create a BackendConfig custom resource with a healthCheck section and reference it in the Service using the cloud.google.com/backend-config annotation. — _correct answer_
- **D.** Modify the Pod readiness probe configuration to match the expected load balancer health check path and interval settings.

## Question 101

**Domain:** Building and testing applications

**Question:** Your team is developing a microservices application using Cloud Code for IntelliJ. You have an existing Kubernetes project with manifests and Dockerfiles but no Skaffold configuration. What is the recommended approach to enable Cloud Code support for your existing project?

**Correct answer:** B. Navigate to Tools > Cloud Code > Kubernetes and select Add Kubernetes Support to automatically generate a skaffold.yaml file and create the necessary run configurations

**Options:**

- **A.** Export your Kubernetes manifests to Cloud Build, then import the Cloud Build configuration into Cloud Code to generate the Skaffold file
- **B.** Navigate to Tools > Cloud Code > Kubernetes and select Add Kubernetes Support to automatically generate a skaffold.yaml file and create the necessary run configurations — _correct answer_
- **C.** Create a new Cloud Code project from a template and manually copy all your existing code and manifests into the new project structure
- **D.** Install the Kubernetes plugin separately and configure it to work with Cloud Code through a manual plugin bridge configuration

## Question 102

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a Cloud Tasks queue for an order fulfillment system. You want the retry interval to start at 5 seconds, double 4 times, and then cap at 300 seconds for all subsequent retries. Which gcloud command correctly configures these retry parameters?

**Correct answer:** B. gcloud tasks queues update order-queue --min-backoff=5s --max-backoff=300s --max-doublings=4

**Options:**

- **A.** gcloud tasks queues update order-queue --backoff-multiplier=2 --min-backoff=5s --max-backoff=300s --max-doublings=4
- **B.** gcloud tasks queues update order-queue --min-backoff=5s --max-backoff=300s --max-doublings=4 — _correct answer_
- **C.** gcloud tasks queues update order-queue --initial-backoff=5s --max-backoff=300s --doublings=4
- **D.** gcloud tasks queues update order-queue --min-backoff=5s --max-backoff=300s --max-attempts=4

## Question 103

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that needs to access database credentials stored in Secret Manager. Your security team requires that the service follows the principle of least privilege. Which IAM role should be granted to the Cloud Run service identity to access the secret?

**Correct answer:** B. Grant the roles/secretmanager.secretAccessor role on the specific secret to the Cloud Run service identity.

**Options:**

- **A.** Grant the roles/secretmanager.admin role at the project level to the Cloud Run service identity.
- **B.** Grant the roles/secretmanager.secretAccessor role on the specific secret to the Cloud Run service identity. — _correct answer_
- **C.** Grant the roles/viewer role at the project level to the Cloud Run service identity.
- **D.** Grant the roles/editor role at the project level to the Cloud Run service identity.

## Question 104

**Domain:** Deploying applications

**Question:** Your team is deploying a Java application to GKE that reads configuration from a properties file. The application needs to pick up configuration changes without requiring a pod restart. You want to use a ConfigMap for this configuration and implement the simplest solution. How should you configure the application to consume the ConfigMap?

**Correct answer:** B. Mount the ConfigMap as a volume at the path where your application reads the configuration file. Configure your application to watch for file changes.

**Options:**

- **A.** Create an immutable ConfigMap and use a rolling deployment strategy to update pods when configuration changes occur.
- **B.** Mount the ConfigMap as a volume at the path where your application reads the configuration file. Configure your application to watch for file changes. — _correct answer_
- **C.** Reference the ConfigMap using environment variables in the container specification. Configure a sidecar container to restart the main container when the ConfigMap changes.
- **D.** Inject the ConfigMap as environment variables and configure a liveness probe to detect stale configuration and trigger pod replacement.

## Question 105

**Domain:** Deploying applications

**Question:** You deployed a new version of your application to a GKE cluster using kubectl apply, but users report errors. You need to quickly revert to the previous working version. The deployment is named 'api-service'. What is the fastest way to restore the previous version?

**Correct answer:** A. Run the command: kubectl rollout undo deployment/api-service

**Options:**

- **A.** Run the command: kubectl rollout undo deployment/api-service — _correct answer_
- **B.** Run the command: kubectl rollout restart deployment/api-service
- **C.** Run the command: kubectl delete deployment/api-service && kubectl apply -f previous-version.yaml
- **D.** Run the command: kubectl rollout status deployment/api-service --previous

## Question 106

**Domain:** Building and testing applications

**Question:** Your team has configured Cloud Build to run integration tests and deploy to Cloud Run only when tests pass. You need to ensure that only container images built by Cloud Build can be deployed to production, preventing deployment of images built elsewhere. What should you configure?

**Correct answer:** D. Enable the built-by-cloud-build attestor in Binary Authorization and configure a policy requiring attestations for images deployed to Cloud Run.

**Options:**

- **A.** Configure Artifact Analysis to scan all images and only allow deployment of images with zero vulnerabilities in the scan results.
- **B.** Add a verification step in the cloudbuild.yaml that checks the image digest against Artifact Registry metadata before deployment.
- **C.** Configure requestedVerifyOption: VERIFIED in the options section to generate SLSA provenance and manually verify provenance before each deployment.
- **D.** Enable the built-by-cloud-build attestor in Binary Authorization and configure a policy requiring attestations for images deployed to Cloud Run. — _correct answer_

## Question 107

**Domain:** Deploying applications

**Question:** You manage a GKE cluster running a critical production workload. You want to be notified immediately whenever a specific error message appears in your container logs. The error indicates a potential security issue and occurs rarely. You need to configure alerts with the least operational overhead. What should you do?

**Correct answer:** D. Create a log-based alerting policy in Cloud Logging using the Logs Explorer by defining a filter query that matches the specific error message.

**Options:**

- **A.** Export all container logs to BigQuery using a logging sink, then create a scheduled Cloud Function that queries BigQuery for the error message and sends notifications via Pub/Sub.
- **B.** Create a user-defined log-based metric that counts occurrences of the error message, then create a metric-based alerting policy in Cloud Monitoring that triggers when the count exceeds zero.
- **C.** Deploy a custom monitoring agent as a DaemonSet that tails container logs on each node, parses them for the error message, and sends alerts using a third-party notification service.
- **D.** Create a log-based alerting policy in Cloud Logging using the Logs Explorer by defining a filter query that matches the specific error message. — _correct answer_

## Question 108

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses Cloud Tasks to process background jobs. You are configuring the RetryConfig for your queue with min_backoff=10s, max_backoff=300s, and max_doublings=3. You need to understand the retry intervals for failed tasks. What will be the sequence of retry intervals?

**Correct answer:** C. 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 10s, 20s, 40s, 80s, 160s, 300s, 300s, 300s
- **B.** 10s, 20s, 40s, 80s, 80s, 80s, 80s, 80s
- **C.** 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_
- **D.** 10s, 30s, 90s, 270s, 300s, 300s, 300s, 300s

## Question 109

**Domain:** Deploying applications

**Question:** Your organization requires that all Cloud Run deployments use a specific service account with minimal permissions rather than the default Compute Engine service account. You are configuring continuous deployment from GitHub using Cloud Build. How should you configure the cloudbuild.yaml to deploy with a custom service identity?

**Correct answer:** C. Add the --service-account flag to the gcloud run deploy command in the cloudbuild.yaml specifying the custom service account email.

**Options:**

- **A.** Grant the custom service account the Cloud Build Service Account role and it will be used automatically.
- **B.** Configure the GOOGLE_APPLICATION_CREDENTIALS environment variable in the cloudbuild.yaml to point to the custom service account key.
- **C.** Add the --service-account flag to the gcloud run deploy command in the cloudbuild.yaml specifying the custom service account email. — _correct answer_
- **D.** Set the serviceAccount field in the Cloud Build trigger configuration to use the custom service account.

## Question 110

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a social media application that stores posts in Cloud Firestore. Posts are organized as subcollections under user documents (users/{userId}/posts/{postId}). You need to implement a feature that displays the most recent posts from all users on a global feed page sorted by timestamp. What should you do?

**Correct answer:** B. Use a collection group query on the 'posts' subcollection with an orderBy clause on the timestamp field, and create a composite index with collection group scope.

**Options:**

- **A.** Query each user's posts subcollection individually and merge the results in your application code, sorting by timestamp after combining all results.
- **B.** Use a collection group query on the 'posts' subcollection with an orderBy clause on the timestamp field, and create a composite index with collection group scope. — _correct answer_
- **C.** Enable the collection group index setting globally in Firestore to allow all subcollection queries to work automatically without explicit configuration.
- **D.** Restructure your data model to store all posts in a single top-level collection and add a userId field to each post document for filtering by user when needed.

## Question 111

**Domain:** Integrating applications with Google Cloud services

**Question:** You are migrating an existing Cloud Endpoints API to API Gateway. The Endpoints API uses an OpenAPI 2.0 specification with a host property set to the ESP deployment URL. You want to reuse the same OpenAPI specification for API Gateway with minimal changes. What modification is required?

**Correct answer:** C. Remove the host property or update it to the DNS name of the deployed API Gateway. API Gateway does not enforce the host property value.

**Options:**

- **A.** Update all x-google-backend extensions to use HTTPS URLs with the API Gateway domain and add the x-google-endpoint extension to the specification.
- **B.** Convert the OpenAPI 2.0 specification to OpenAPI 3.x format and add a servers object with the x-google-endpoint extension before deploying to API Gateway.
- **C.** Remove the host property or update it to the DNS name of the deployed API Gateway. API Gateway does not enforce the host property value. — _correct answer_
- **D.** Replace all securityDefinitions with new API Gateway-specific security configurations and regenerate API keys for all consumers in the new API Gateway project.

## Question 112

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Cloud Run service that needs to connect to a Memorystore for Redis instance. During testing, your application cannot establish a connection to the Redis instance. The Redis instance was created in the default VPC network. What is the most likely cause of this connectivity issue?

**Correct answer:** D. The Cloud Run service does not have VPC access configured to reach the Memorystore instance, which uses private IP addresses within the VPC network.

**Options:**

- **A.** The Memorystore for Redis instance requires Redis AUTH to be enabled before Cloud Run services can establish connections.
- **B.** The Cloud Run service needs a firewall rule explicitly allowing egress traffic on port 6379 to the Memorystore instance IP address.
- **C.** The Memorystore for Redis instance does not have a public IP address enabled, preventing external connections from Cloud Run services.
- **D.** The Cloud Run service does not have VPC access configured to reach the Memorystore instance, which uses private IP addresses within the VPC network. — _correct answer_

## Question 113

**Domain:** Building and testing applications

**Question:** Your Cloud Run application is currently serving traffic from two revisions: 'blue' (90%) and 'green' (10%). You notice elevated error rates from the 'green' revision in Cloud Monitoring. You need to immediately roll back all traffic to the stable 'blue' revision. What should you do?

**Correct answer:** B. Run 'gcloud run services update-traffic myservice --to-tags blue=100' to route all traffic to the blue revision.

**Options:**

- **A.** Run 'gcloud run services update-traffic myservice --clear' to reset traffic configuration back to the default revision.
- **B.** Run 'gcloud run services update-traffic myservice --to-tags blue=100' to route all traffic to the blue revision. — _correct answer_
- **C.** Run 'gcloud run deploy myservice --image BLUE_IMAGE_URL' to redeploy the blue image and automatically receive 100% traffic.
- **D.** Run 'gcloud run revisions delete green' to remove the problematic revision and automatically shift traffic to blue.

## Question 114

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is developing a microservices application on Cloud Run. You need to create an alerting policy that triggers when a specific error message appears in the application logs more than 100 times within a 5-minute period. The alert should be configurable in Cloud Monitoring. What should you do?

**Correct answer:** B. Create a user-defined counter log-based metric with a filter that matches the specific error message. Create an alerting policy in Cloud Monitoring to monitor this metric.

**Options:**

- **A.** Create a log sink to export logs to BigQuery. Query the BigQuery table to count error occurrences and configure a scheduled query to send alerts.
- **B.** Create a user-defined counter log-based metric with a filter that matches the specific error message. Create an alerting policy in Cloud Monitoring to monitor this metric. — _correct answer_
- **C.** Create a distribution log-based metric with a value extractor that matches the specific error message. Create an alerting policy in Cloud Monitoring to monitor this metric.
- **D.** Create a log-based alerting policy directly in Cloud Logging that filters for the specific error message and sends notifications based on the count threshold.

## Question 115

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is experiencing elevated P99 latencies in a Cloud Bigtable table that stores user activity data with a row key format of '[user_id]#[event_timestamp]'. You suspect certain user accounts are causing hotspots due to significantly higher activity levels than average users. Which Google Cloud tool should you use to identify the specific row key ranges causing these performance issues?

**Correct answer:** D. Use Key Visualizer to generate heatmaps showing access patterns across row keys over time, which helps identify hotspots on specific row key ranges.

**Options:**

- **A.** Use Cloud Monitoring to check cluster CPU utilization metrics and determine if the cluster is overloaded with write requests.
- **B.** Use the Cloud Console Bigtable instance page to view the table storage utilization breakdown by column family.
- **C.** Use Cloud Logging to filter application logs by user ID and calculate the write frequency for each user account.
- **D.** Use Key Visualizer to generate heatmaps showing access patterns across row keys over time, which helps identify hotspots on specific row key ranges. — _correct answer_

## Question 116

**Domain:** Building and testing applications

**Question:** Your development team uses Application Default Credentials to test applications locally. A team member reports that their application is using unexpected credentials despite running 'gcloud auth application-default login'. You need to help them troubleshoot. In what order does ADC search for credentials?

**Correct answer:** C. First GOOGLE_APPLICATION_CREDENTIALS environment variable, then the well-known location for local ADC credentials, then the metadata server for attached service accounts.

**Options:**

- **A.** First the well-known location for local ADC credentials, then GOOGLE_APPLICATION_CREDENTIALS environment variable, then the metadata server for attached service accounts.
- **B.** First gcloud CLI credentials, then GOOGLE_APPLICATION_CREDENTIALS environment variable, then the well-known location for local ADC credentials.
- **C.** First GOOGLE_APPLICATION_CREDENTIALS environment variable, then the well-known location for local ADC credentials, then the metadata server for attached service accounts. — _correct answer_
- **D.** First the metadata server for attached service accounts, then the GOOGLE_APPLICATION_CREDENTIALS environment variable, then the well-known location for local ADC credentials.

## Question 117

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses Secret Manager to store API keys for multiple Cloud Run services. Your security team requires that old secret versions be recoverable for 30 days after they are no longer needed, in case dependent applications are still using them. You need to implement a process to safely retire old secret versions while meeting this requirement. What should you do?

**Correct answer:** D. Disable the old secret versions and wait 30 days to verify applications do not break before destroying them.

**Options:**

- **A.** Create an expiration policy on the secrets to automatically delete old versions after 30 days without any manual intervention.
- **B.** Configure delayed destruction on the secrets with a 30-day destruction delay duration, then immediately destroy old secret versions.
- **C.** Grant the Secret Manager Secret Accessor role only to applications using the current version, and revoke access for the old versions from all service accounts.
- **D.** Disable the old secret versions and wait 30 days to verify applications do not break before destroying them. — _correct answer_

## Question 118

**Domain:** Building and testing applications

**Question:** Your application uses ADC to authenticate to Google Cloud APIs. During local testing, the application unexpectedly uses different credentials than intended. You have configured both the GOOGLE_APPLICATION_CREDENTIALS environment variable and run 'gcloud auth application-default login'. Which credentials will ADC use?

**Correct answer:** B. ADC will use the credentials from the JSON file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable because ADC checks this location first.

**Options:**

- **A.** ADC will prompt you to select which credentials to use because multiple valid credential sources exist in your environment.
- **B.** ADC will use the credentials from the JSON file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable because ADC checks this location first. — _correct answer_
- **C.** ADC will merge both sets of credentials and use the most recent one based on the timestamp of when each credential was created.
- **D.** ADC will use the credentials from the local ADC file created by 'gcloud auth application-default login' because user credentials have higher priority than service account credentials.

## Question 119

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are experiencing elevated P99 latencies in your Cloud Bigtable application after a recent traffic spike. You suspect hotspots in your table but need to identify the specific row key ranges causing the issue. The hotspots appear to be short-lived and periodic. What approach should you use to diagnose and identify the problematic row keys?

**Correct answer:** D. Use the ListHotTablets API to identify specific row key ranges with high CPU usage and correlate with your schema design.

**Options:**

- **A.** Add custom instrumentation to your application to track which row keys are accessed most frequently.
- **B.** Review Cloud Monitoring CPU utilization metrics for the Bigtable cluster to identify the nodes with highest load.
- **C.** Check application logs for slow query patterns and manually correlate them with row key patterns.
- **D.** Use the ListHotTablets API to identify specific row key ranges with high CPU usage and correlate with your schema design. — _correct answer_

## Question 120

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses VPC Service Controls to protect Cloud Storage and BigQuery services within a perimeter. Users within VMs in the perimeter's VPC network report they can access unsupported Google Cloud services like Cloud Shell, potentially creating data exfiltration paths. How should you address this security gap?

**Correct answer:** B. Enable VPC accessible services and configure it to allow only restricted services. Configure DNS to point *.googleapis.com to restricted.googleapis.com for VMs inside the perimeter.

**Options:**

- **A.** Create egress rules that explicitly deny access to unsupported services from identities within the perimeter to prevent data exfiltration through those services.
- **B.** Enable VPC accessible services and configure it to allow only restricted services. Configure DNS to point *.googleapis.com to restricted.googleapis.com for VMs inside the perimeter. — _correct answer_
- **C.** Add all unsupported services to the restricted services list in the perimeter configuration to block access to services like Cloud Shell from within the VPC.
- **D.** Configure firewall rules on the VPC network to block outbound traffic to IP addresses associated with unsupported Google Cloud services like Cloud Shell.

## Question 121

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization runs a globally distributed application that writes data to a Cloud SQL for MySQL instance in us-central1. Users in Europe are experiencing high latency when reading data. You need to reduce read latency for European users while maintaining data consistency for write operations. What should you do?

**Correct answer:** B. Create a cross-region read replica in a European region and configure the application to route read queries from European users to the replica.

**Options:**

- **A.** Enable Managed Connection Pooling on the primary instance to reduce connection overhead for European users.
- **B.** Create a cross-region read replica in a European region and configure the application to route read queries from European users to the replica. — _correct answer_
- **C.** Configure Cloud SQL high availability with a failover replica in a European region and route all European traffic to the failover instance.
- **D.** Migrate the primary Cloud SQL instance to a European region and create a read replica in us-central1 for existing users.

## Question 122

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an IoT telemetry system that stores sensor readings in Cloud Bigtable. Each sensor sends data every second and you need to design a row key to store this time-series data. You want to query readings for a specific sensor over a time range. You also need to ensure even write distribution across nodes. What row key design should you use?

**Correct answer:** A. Use the format sensor_id#timestamp, where sensor_id is the unique identifier for each sensor followed by the timestamp of the reading.

**Options:**

- **A.** Use the format sensor_id#timestamp, where sensor_id is the unique identifier for each sensor followed by the timestamp of the reading. — _correct answer_
- **B.** Use the format timestamp#sensor_id, where timestamp precedes the sensor identifier to enable efficient time-based queries across all sensors.
- **C.** Use a randomly generated UUID as the row key and store sensor_id and timestamp in column qualifiers for flexible querying.
- **D.** Use an auto-incrementing numeric ID as the row key and store sensor_id and timestamp as separate columns in the row.

## Question 123

**Domain:** Deploying applications

**Question:** Your organization requires that container images deployed to GKE production clusters must only come from images built by Cloud Build. You need to implement a policy that blocks deployment of images not built by Cloud Build. What should you do?

**Correct answer:** C. Configure a Binary Authorization policy with the built-by-cloud-build attestor that requires attestation before allowing deployment to GKE.

**Options:**

- **A.** Create a Cloud Build trigger that scans all images in Artifact Registry and deletes any images that were not built by Cloud Build.
- **B.** Enable VPC Service Controls on Artifact Registry and only allow access from Cloud Build service accounts.
- **C.** Configure a Binary Authorization policy with the built-by-cloud-build attestor that requires attestation before allowing deployment to GKE. — _correct answer_
- **D.** Configure Artifact Registry cleanup policies to automatically delete images that do not have Cloud Build metadata attached.

## Question 124

**Domain:** Building and testing applications

**Question:** You are setting up a new developer's workstation to use Cloud Code with VS Code for Kubernetes application development. The developer needs to be able to debug containerized applications that call Google Cloud APIs locally. When they attempt to run and debug the application, authentication errors occur. What should the developer do to resolve this issue?

**Correct answer:** B. Run 'gcloud auth application-default login' to create a local credentials file that Cloud Code can use when debugging applications that call Google Cloud APIs.

**Options:**

- **A.** Install the Docker client and configure Cloud Build to handle authentication automatically when debugging locally.
- **B.** Run 'gcloud auth application-default login' to create a local credentials file that Cloud Code can use when debugging applications that call Google Cloud APIs. — _correct answer_
- **C.** Export the GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to a service account key file and restart VS Code.
- **D.** Run 'gcloud auth login' to authenticate the gcloud CLI, which automatically enables Cloud Code to authenticate API calls during debugging.

## Question 125

**Domain:** Building and testing applications

**Question:** You are implementing a canary deployment strategy for a Cloud Run service using Cloud Deploy. This is the first time deploying the application to the target environment. The canary deployment is configured with 10%, 50%, and 75% traffic phases before the stable phase. What behavior should you expect during this first deployment?

**Correct answer:** D. Cloud Deploy skips the canary phases and deploys directly to the stable phase at 100%, because there is no existing revision to split traffic with.

**Options:**

- **A.** Cloud Deploy prompts you to manually advance through each canary phase, waiting for your approval to create the initial baseline revision.
- **B.** Cloud Deploy fails the deployment with an error indicating that canary deployments require an existing stable revision in the target environment.
- **C.** Cloud Deploy creates placeholder revisions at each percentage phase and proceeds through all configured canary phases before reaching stable.
- **D.** Cloud Deploy skips the canary phases and deploys directly to the stable phase at 100%, because there is no existing revision to split traffic with. — _correct answer_

## Question 126

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to access a Cloud SQL instance on a private IP address. You need to create a Serverless VPC Access connector for the Cloud Run service. When specifying the subnet requirements for the connector, which configuration is correct?

**Correct answer:** B. Use a dedicated /28 subnet that contains no other resources and is exclusively used by the connector.

**Options:**

- **A.** Use a /16 subnet to ensure there is sufficient IP address space for connector auto-scaling during traffic spikes.
- **B.** Use a dedicated /28 subnet that contains no other resources and is exclusively used by the connector. — _correct answer_
- **C.** Use a /32 subnet to minimize IP address usage and reduce the attack surface of the connector.
- **D.** Use an existing /24 subnet shared with Compute Engine VMs to leverage existing network infrastructure.

## Question 127

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application running on Cloud Run functions connects to Cloud SQL for PostgreSQL. The application processes event-driven workloads with sudden bursts of concurrent invocations. You are experiencing 'too many connections' errors during peak loads. You need to implement a solution that handles connection spikes efficiently while using Google-recommended practices. What should you do?

**Correct answer:** C. Use the Cloud SQL Python Connector or equivalent language connector with lazy refresh enabled and configure a connection pool with appropriate size limits in your application code.

**Options:**

- **A.** Create multiple read replicas distributed across different zones and configure a round-robin DNS entry to balance connections across all instances.
- **B.** Deploy a Serverless VPC Access connector and connect directly to Cloud SQL using private IP without using Cloud SQL connectors or connection pooling.
- **C.** Use the Cloud SQL Python Connector or equivalent language connector with lazy refresh enabled and configure a connection pool with appropriate size limits in your application code. — _correct answer_
- **D.** Configure the Cloud Run function to maintain persistent connections by setting the minimum instances to match your expected peak concurrent executions.

## Question 128

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new Cloud Storage bucket in the europe-west1 region that must be encrypted with a customer-managed encryption key (CMEK). You have an existing key ring with keys in the europe multi-region. When you try to configure the bucket with your existing CMEK key, the configuration fails. What should you do?

**Correct answer:** B. Create a new key ring in the europe-west1 region and create a CMEK key in that key ring to use with the bucket.

**Options:**

- **A.** Grant the Cloud Storage service account additional permissions to access multi-region keys from regional resources.
- **B.** Create a new key ring in the europe-west1 region and create a CMEK key in that key ring to use with the bucket. — _correct answer_
- **C.** Change the Cloud Storage bucket location to the europe multi-region to match the key ring location.
- **D.** Enable cross-region key access in Cloud KMS organization policies to allow the regional bucket to use the multi-region key.

## Question 129

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization runs a Cloud SQL for PostgreSQL Enterprise Plus edition instance supporting multiple applications with varying connection patterns. Some applications establish short-lived connections for quick transactions, while others maintain long-lived connections for batch processing. You want to enable Managed Connection Pooling to improve overall connection efficiency. What pool_mode should you configure for the workload that primarily consists of short-lived transactional queries?

**Correct answer:** C. Transaction pooling mode, which returns connections to the pool after each transaction completes and is recommended by Google for short-lived connections.

**Options:**

- **A.** Statement pooling mode, which allocates a connection for each individual SQL statement and provides the finest granularity.
- **B.** Session pooling mode, which maintains a dedicated connection for the entire client session and provides better isolation.
- **C.** Transaction pooling mode, which returns connections to the pool after each transaction completes and is recommended by Google for short-lived connections. — _correct answer_
- **D.** Disable Managed Connection Pooling and rely on application-level pooling to avoid the slight performance overhead that pooling introduces for short connections.

## Question 130

**Domain:** Building and testing applications

**Question:** You are a developer using Cloud Code for VS Code to build and test a containerized application that calls Google Cloud APIs. When you attempt to run your application locally with the Cloud Run emulator, you receive authentication errors when the application tries to access Google Cloud services. What should you do to resolve this issue?

**Correct answer:** B. Run 'gcloud auth application-default login' to create local Application Default Credentials that Cloud Code will use when running and debugging your application locally.

**Options:**

- **A.** Create a service account key file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to the key file in your launch.json configuration.
- **B.** Run 'gcloud auth application-default login' to create local Application Default Credentials that Cloud Code will use when running and debugging your application locally. — _correct answer_
- **C.** Sign in to Cloud Code using the status bar option, which automatically configures all authentication required for both the IDE and running applications.
- **D.** Enable the Cloud Code API in the Google Cloud Console and restart VS Code to automatically configure authentication for local development.

## Question 131

**Domain:** Deploying applications

**Question:** You are managing a production application on GKE and need to update the container image from version 1.0 to version 2.0 with zero downtime. After deploying the update, you discover a critical bug in version 2.0 and need to quickly revert to the previous version. What kubectl commands should you use to perform the update and then roll back?

**Correct answer:** D. Use 'kubectl set image deployment/my-app container=image:2.0' to update, then use 'kubectl rollout undo deployment/my-app' to roll back.

**Options:**

- **A.** Use 'kubectl apply -f deployment-v2.yaml' to update, then use 'kubectl delete deployment my-app && kubectl apply -f deployment-v1.yaml' to roll back.
- **B.** Use 'kubectl patch deployment my-app -p image:2.0' to update, then use 'kubectl rollout restart deployment/my-app' to roll back.
- **C.** Use 'kubectl replace -f deployment-v2.yaml' to update, then use 'kubectl rollout status deployment/my-app --revision=1' to roll back.
- **D.** Use 'kubectl set image deployment/my-app container=image:2.0' to update, then use 'kubectl rollout undo deployment/my-app' to roll back. — _correct answer_

## Question 132

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are troubleshooting performance issues in your Cloud Bigtable instance. Users report intermittent high latency when accessing certain data. You suspect the schema design may be causing hotspots. You need to identify the specific row key ranges that are experiencing high CPU utilization. Which approach should you use?

**Correct answer:** C. Use the Key Visualizer tool to view heatmaps showing access patterns and identify row key ranges with concentrated reads or writes.

**Options:**

- **A.** Use the ListHotTablets API method to get a list of tablets with high CPU usage and their corresponding row key ranges.
- **B.** Enable Cloud Monitoring to view overall cluster CPU metrics and identify performance bottlenecks at the instance level.
- **C.** Use the Key Visualizer tool to view heatmaps showing access patterns and identify row key ranges with concentrated reads or writes. — _correct answer_
- **D.** Review application logs to identify which queries are being executed most frequently and correlate with performance issues.

## Question 133

**Domain:** Integrating applications with Google Cloud services

**Question:** Your microservice creates tasks in Cloud Tasks using explicitly specified task names for deduplication. You notice that task creation latency has increased significantly. The task names are based on order IDs formatted as timestamps. What should you do to reduce latency while maintaining deduplication?

**Correct answer:** B. Use hashed strings for task IDs or as a prefix for task names to achieve a well-distributed naming pattern.

**Options:**

- **A.** Increase the queue's max-concurrent-dispatches to process tasks faster and reduce queue buildup.
- **B.** Use hashed strings for task IDs or as a prefix for task names to achieve a well-distributed naming pattern. — _correct answer_
- **C.** Create multiple queues and distribute tasks across them using a round-robin algorithm to reduce individual queue load.
- **D.** Remove explicit task names and let Cloud Tasks generate unique task IDs, then implement deduplication in the handler using Firestore.

## Question 134

**Domain:** Building and testing applications

**Question:** You are developing a CI/CD pipeline using Cloud Build that includes multiple stages: compile, unit test, integration test, build container, and deploy. Integration tests require a database service running alongside the test container. You need the tests to be able to communicate with the database service within the build environment. What should you configure?

**Correct answer:** C. Start the database service as a separate build step with waitFor: ['-'] and use the cloudbuild Docker network to enable communication between the test container and database container using container names as hostnames.

**Options:**

- **A.** Use Cloud Build private pools with VPC connectivity to access a persistent database instance running in your VPC for integration testing.
- **B.** Configure a Cloud SQL instance for testing and use the Cloud SQL Auth Proxy in a separate build step to establish a secure connection for the integration tests.
- **C.** Start the database service as a separate build step with waitFor: ['-'] and use the cloudbuild Docker network to enable communication between the test container and database container using container names as hostnames. — _correct answer_
- **D.** Store database connection details as substitution variables and configure the integration test step to connect to an external database service hosted outside the build environment.

## Question 135

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a mobile application that uses Firestore snapshot listeners to display real-time inventory updates. Users report that the application continues consuming battery and mobile data even when they navigate away from the inventory screen. You need to optimize resource usage when the inventory screen is not visible. What should you do?

**Correct answer:** B. Call the unsubscribe function returned by onSnapshot() when the user navigates away from the inventory screen to detach the listener.

**Options:**

- **A.** Set a timeout parameter on the snapshot listener configuration to automatically expire after 30 seconds of inactivity.
- **B.** Call the unsubscribe function returned by onSnapshot() when the user navigates away from the inventory screen to detach the listener. — _correct answer_
- **C.** Configure the Firestore client to disable real-time synchronization when the application enters background mode at the database level.
- **D.** Implement a query filter that returns zero documents when the screen is not visible to prevent data transfer.

## Question 136

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that needs to access API credentials stored in Secret Manager. The application reads the credentials at startup and caches them for the lifetime of the instance. You want to ensure predictable behavior and support rollback capabilities if a new secret version causes issues. What should you do?

**Correct answer:** C. Configure the secret as an environment variable and reference a specific version number of the secret instead of using the 'latest' alias.

**Options:**

- **A.** Store the credentials in a plain environment variable in Cloud Run configuration instead of using Secret Manager for faster access.
- **B.** Mount the secret as a volume and reference the 'latest' alias so the application can dynamically read the newest credential value at runtime.
- **C.** Configure the secret as an environment variable and reference a specific version number of the secret instead of using the 'latest' alias. — _correct answer_
- **D.** Configure the secret as an environment variable and reference the 'latest' alias so the application automatically receives updated credentials without redeployment.

## Question 137

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is configuring a Cloud Tasks queue for batch data processing. You want the retry interval to start at 10 seconds, double 3 times, and then cap at 300 seconds. You need to understand the resulting retry schedule to estimate processing delays. What will be the sequence of retry intervals for this queue configuration?

**Correct answer:** C. 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 10s, 30s, 90s, 270s, 300s, 300s, 300s, 300s
- **B.** 10s, 20s, 40s, 80s, 160s, 300s, 300s, 300s
- **C.** 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_
- **D.** 10s, 20s, 40s, 80s, 300s, 300s, 300s, 300s

## Question 138

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are preparing to enable VPC Service Controls for production projects containing sensitive customer data. Before enforcement, you want to validate that your perimeter configuration will not disrupt existing workloads. How should you test your VPC Service Controls configuration?

**Correct answer:** C. Create the service perimeter in dry run mode to log violations without blocking requests. Analyze the violation logs to identify and resolve any access issues before switching to enforced mode.

**Options:**

- **A.** Use VPC Service Controls in audit-only mode by enabling Cloud Audit Logs for all API calls without creating any perimeter configuration.
- **B.** Deploy a replica of the production environment in a separate project and test the enforced perimeter configuration against the replica before applying it to production.
- **C.** Create the service perimeter in dry run mode to log violations without blocking requests. Analyze the violation logs to identify and resolve any access issues before switching to enforced mode. — _correct answer_
- **D.** Create the perimeter in enforced mode during a maintenance window and monitor Cloud Logging for any access denied errors from applications.

## Question 139

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a server-side application that processes high-frequency updates to inventory documents in Cloud Firestore. Multiple application instances running on Cloud Run frequently update the same inventory documents. You observe that transactions are failing with 'ABORTED: Too much contention on these documents' errors. You need to reduce transaction failures while maintaining data consistency. What should you do?

**Correct answer:** D. Redesign your data model to distribute writes across multiple documents using sharded counters, reducing contention on individual documents.

**Options:**

- **A.** Switch from server client libraries to mobile/web SDKs since they use optimistic concurrency controls that avoid document locking.
- **B.** Increase the transaction timeout to allow more time for locks to be released and transactions to complete successfully.
- **C.** Replace transactions with batched writes to avoid the automatic retry behavior that causes transaction failures.
- **D.** Redesign your data model to distribute writes across multiple documents using sharded counters, reducing contention on individual documents. — _correct answer_

## Question 140

**Domain:** Building and testing applications

**Question:** You are configuring Cloud Build to build container images and store them in Artifact Registry. You want the built images to be displayed in Cloud Build's build results and accessible through the Google Cloud console's Build History page. What should you configure in your cloudbuild.yaml file?

**Correct answer:** A. Add the images field at the top level of the build configuration file, listing the full Artifact Registry path of each image to be stored after the build completes.

**Options:**

- **A.** Add the images field at the top level of the build configuration file, listing the full Artifact Registry path of each image to be stored after the build completes. — _correct answer_
- **B.** Add an artifacts field in the build configuration that references the Docker image path, which uploads the image metadata to Cloud Build for display purposes.
- **C.** Configure the Artifact Registry repository with the 'display-in-build-history' flag enabled, which automatically links pushed images to their corresponding Cloud Build executions.
- **D.** Add a build step using the gcr.io/cloud-builders/docker builder with 'push' arguments to push the image to Artifact Registry during the build flow without using the images field.

## Question 141

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service using VS Code with Cloud Code. You want to test your containerized application locally before deploying to Google Cloud. You need to debug the service with the ability to set breakpoints and step through code. Which Cloud Code feature should you use?

**Correct answer:** B. Use the Debug on Cloud Run Emulator command from the VS Code command palette, which attaches a debug session to your containerized service running locally.

**Options:**

- **A.** Use the Run on Cloud Run Emulator command and then manually attach the VS Code debugger to the running container process.
- **B.** Use the Debug on Cloud Run Emulator command from the VS Code command palette, which attaches a debug session to your containerized service running locally. — _correct answer_
- **C.** Run your application directly using node, python, or java commands locally without containerization, then debug using VS Code's standard debugger.
- **D.** Deploy your service to Cloud Run with debug mode enabled, then use Cloud Code's remote debugging feature to connect to the running instance.

## Question 142

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have deployed a new Cloud Run API service that experiences cold start latency of approximately 8 seconds due to a large Java application startup time. Users accessing the service during low-traffic periods experience unacceptable delays. You want to reduce cold start latency while minimizing costs. What should you do?

**Correct answer:** D. Configure minimum instances to keep at least one instance warm and enable startup CPU boost.

**Options:**

- **A.** Enable manual scaling and set a fixed instance count of 5 to pre-provision capacity.
- **B.** Set maximum instances to a high value and configure request-based billing.
- **C.** Switch the billing setting to instance-based billing and increase CPU allocation to 4 vCPUs.
- **D.** Configure minimum instances to keep at least one instance warm and enable startup CPU boost. — _correct answer_

## Question 143

**Domain:** Deploying applications

**Question:** Your company is deploying a new Cloud Run service that needs to access API keys stored in Secret Manager. The deployment is failing with a permission denied error when trying to access the secrets. The Cloud Run service uses a custom service account. What IAM role must be granted to the service account to resolve this issue?

**Correct answer:** C. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service account on the secrets.

**Options:**

- **A.** Grant the Editor role (roles/editor) to the Cloud Run service account on the project.
- **B.** Grant the Secret Manager Viewer role (roles/secretmanager.viewer) to the Cloud Run service account on the secrets.
- **C.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service account on the secrets. — _correct answer_
- **D.** Grant the Secret Manager Admin role (roles/secretmanager.admin) to the Cloud Run service account on the project.

## Question 144

**Domain:** Deploying applications

**Question:** You are deploying an HTTP-based application on GKE that needs to be accessible only from within your organization's VPC network. You need to configure an Ingress resource to create an internal Application Load Balancer. What annotation should you add to your Ingress manifest?

**Correct answer:** D. Add the annotation kubernetes.io/ingress.class: 'gce-internal' to the Ingress metadata.

**Options:**

- **A.** Set spec.ingressClassName: 'gce-internal' in the Ingress specification.
- **B.** Add the annotation kubernetes.io/ingress.class: 'gce' to the Ingress metadata.
- **C.** Add the annotation networking.gke.io/load-balancer-type: 'Internal' to the Ingress metadata.
- **D.** Add the annotation kubernetes.io/ingress.class: 'gce-internal' to the Ingress metadata. — _correct answer_

## Question 145

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an internal web application running on GKE behind an HTTPS load balancer. You have enabled Identity-Aware Proxy (IAP) to control access to the application. Security audits reveal that users who can SSH into the GKE nodes could potentially bypass IAP authentication by accessing the application directly. You need to implement a defense-in-depth approach to ensure that all requests to your application are authenticated by IAP. What should you do?

**Correct answer:** C. Validate the x-goog-iap-jwt-assertion header in your application code by verifying the JWT signature, audience, and issuer claims.

**Options:**

- **A.** Validate the x-goog-authenticated-user-email header in your application code by checking the email address format and domain.
- **B.** Configure VPC firewall rules to block traffic from internal IP addresses and allow only external load balancer traffic.
- **C.** Validate the x-goog-iap-jwt-assertion header in your application code by verifying the JWT signature, audience, and issuer claims. — _correct answer_
- **D.** Grant the IAP-secured Web App User role only to authenticated users and remove all public access from the load balancer.

## Question 146

**Domain:** Building and testing applications

**Question:** You are debugging a Java application running in a container using Cloud Code for VS Code. After making code changes, you notice that your application is automatically rebuilt and redeployed, but you want to manually control when rebuilds occur. How should you configure Cloud Code to disable automatic rebuilds?

**Correct answer:** B. Set the watch flag to false in your project's launch.json file to disable automatic redeploys when changes are saved

**Options:**

- **A.** Uninstall the Skaffold dependency and configure Cloud Code to use Docker-only builds which do not support file watching
- **B.** Set the watch flag to false in your project's launch.json file to disable automatic redeploys when changes are saved — _correct answer_
- **C.** Modify the skaffold.yaml file to remove the sync configuration and set the build mode to manual in the profiles section
- **D.** Configure the JAVA_TOOL_OPTIONS environment variable to disable hot reload functionality during the debug session

## Question 147

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a log sink to route audit logs from your production project to a Cloud Storage bucket in a separate compliance project. After creating the sink, logs are not appearing in the destination bucket. You have verified the sink filter is correct using the Preview logs feature. What is the most likely cause and how should you resolve it?

**Correct answer:** C. The sink's service account does not have permission to write to the Cloud Storage bucket. Grant the Storage Object Creator role to the sink's writer identity on the destination bucket.

**Options:**

- **A.** The sink is configured as a non-intercepting sink, which prevents it from routing audit logs. Reconfigure the sink as an intercepting sink to capture audit logs.
- **B.** The Cloud Storage bucket was created after the sink, causing a timing synchronization issue. Delete and recreate the sink to establish a new connection to the bucket.
- **C.** The sink's service account does not have permission to write to the Cloud Storage bucket. Grant the Storage Object Creator role to the sink's writer identity on the destination bucket. — _correct answer_
- **D.** The audit logs are being written to the _Required bucket which cannot be routed to external destinations. Configure a custom log bucket and route from there to Cloud Storage.

## Question 148

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company uses Shared VPC with a host project and multiple service projects. You need to implement VPC Service Controls to protect Cloud Storage and BigQuery resources in the service projects. You want to ensure that VMs in the Shared VPC can access the protected services. How should you configure the service perimeter?

**Correct answer:** C. Include both the host project and all service projects in the same service perimeter, and restrict the Cloud Storage and BigQuery services.

**Options:**

- **A.** Include only the service projects in the service perimeter since that is where the protected resources reside.
- **B.** Create separate service perimeters for the host project and each service project, then configure perimeter bridges between them.
- **C.** Include both the host project and all service projects in the same service perimeter, and restrict the Cloud Storage and BigQuery services. — _correct answer_
- **D.** Configure an access level that grants access based on the Shared VPC network, and apply it to a perimeter containing only the service projects.

## Question 149

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema to store web analytics data. Your data includes URLs from multiple domains like www.example.com, shop.example.com, and api.example.com. You need to efficiently query all data for a specific domain (e.g., all example.com entries) while ensuring related data is stored contiguously for efficient retrieval. How should you design your row keys?

**Correct answer:** B. Use reversed domain names as row key prefixes, such as com.example.www, com.example.shop, and com.example.api.

**Options:**

- **A.** Hash the domain name and use the hash value as the row key prefix to distribute data evenly.
- **B.** Use reversed domain names as row key prefixes, such as com.example.www, com.example.shop, and com.example.api. — _correct answer_
- **C.** Use the full URL as the row key without modification to maintain readability and simplicity.
- **D.** Store each domain in a separate table and use the subdomain as the row key prefix.

## Question 150

**Domain:** Integrating applications with Google Cloud services

**Question:** You are designing a task handler for Cloud Tasks that processes financial transactions. Due to the 'at least once' delivery guarantee, you need to ensure your handler is idempotent. Your handler writes transaction records to Cloud SQL. Which approach correctly implements idempotency for this scenario?

**Correct answer:** C. Include a unique transaction ID in the task payload and use it as the primary key when inserting records into Cloud SQL, allowing duplicate executions to fail gracefully on the unique constraint.

**Options:**

- **A.** Wrap all database operations in a Cloud SQL transaction and rely on the transaction's atomicity to automatically handle duplicate task executions.
- **B.** Use Cloud Tasks task names to prevent duplicate tasks from being added, which automatically ensures the handler only processes each transaction once.
- **C.** Include a unique transaction ID in the task payload and use it as the primary key when inserting records into Cloud SQL, allowing duplicate executions to fail gracefully on the unique constraint. — _correct answer_
- **D.** Configure the Cloud Tasks queue with max_attempts=1 to ensure each task is executed exactly once and never retried, eliminating the need for idempotent handlers.

## Question 151

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an ecommerce application running on Cloud Run that uses Cloud SQL for persistent storage. Users report slow page load times when viewing product details. The product catalog changes infrequently but is accessed thousands of times per second. You need to implement a caching strategy using Memorystore for Redis to improve performance while minimizing code complexity. What should you do?

**Correct answer:** D. Implement a cache-aside pattern where your application first checks Memorystore for the product data, and on a cache miss, retrieves the data from Cloud SQL, caches it in Memorystore with a TTL, and returns it to the user.

**Options:**

- **A.** Create a Pub/Sub topic that triggers a Cloud Run function to synchronously write product data to both Cloud SQL and Memorystore simultaneously whenever data is accessed.
- **B.** Store all product data exclusively in Memorystore for Redis and remove Cloud SQL from the architecture since the data changes infrequently.
- **C.** Configure Cloud SQL to automatically replicate all data to Memorystore for Redis using database triggers. Have your application read exclusively from Memorystore for all product queries.
- **D.** Implement a cache-aside pattern where your application first checks Memorystore for the product data, and on a cache miss, retrieves the data from Cloud SQL, caches it in Memorystore with a TTL, and returns it to the user. — _correct answer_

## Question 152

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application running on Compute Engine generates verbose DEBUG and INFO level logs during normal operation. These logs are consuming a significant portion of your Cloud Logging budget. You need to reduce costs while ensuring that ERROR and higher severity logs are still available in Logs Explorer. What should you do?

**Correct answer:** A. Add an exclusion filter to the _Default log sink that excludes logs with severity less than ERROR for your application's resource type.

**Options:**

- **A.** Add an exclusion filter to the _Default log sink that excludes logs with severity less than ERROR for your application's resource type. — _correct answer_
- **B.** Modify your application to stop emitting DEBUG and INFO logs by changing the logging configuration.
- **C.** Reduce the retention period of the _Default log bucket to 1 day for all logs.
- **D.** Create a new log sink with an inclusion filter for ERROR and higher severity logs and delete the _Default sink.

## Question 153

**Domain:** Deploying applications

**Question:** You are configuring a new CI/CD pipeline using Cloud Build to build Docker images and push them to Artifact Registry. You have created a cloudbuild.yaml file with build steps and specified the image path as us-central1-docker.pkg.dev/my-project/my-image:v1. When you run the build, it fails with an error indicating that the repository does not exist. What should you do?

**Correct answer:** C. Create a Docker repository in Artifact Registry before running the build, and update the image path to include the repository name.

**Options:**

- **A.** Switch to using Container Registry hostnames like gcr.io/my-project/my-image:v1 which automatically create the registry on first push.
- **B.** Grant the Artifact Registry Repository Administrator role to the Cloud Build service account so it can automatically create repositories.
- **C.** Create a Docker repository in Artifact Registry before running the build, and update the image path to include the repository name. — _correct answer_
- **D.** Enable the Artifact Registry API and re-run the build to allow automatic repository creation.

## Question 154

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your healthcare organization has two VPC Service Controls perimeters: one protecting PHI (Protected Health Information) data in Project A, and another protecting anonymized research data in Project B. Project A needs to write de-identified data to Project B for sharing with external research partners. Both perimeters restrict Cloud Storage. What configuration allows this controlled data exchange?

**Correct answer:** C. Configure an egress rule on the PHI perimeter to allow Project A's service account to write to Cloud Storage in Project B, and configure an ingress rule on the research data perimeter to accept requests from Project A.

**Options:**

- **A.** Combine both Project A and Project B into a single unified perimeter and use IAM policies to control access between the resources.
- **B.** Configure only an egress rule on the PHI perimeter since the data is flowing out of Project A and the research perimeter will automatically allow incoming data from trusted sources.
- **C.** Configure an egress rule on the PHI perimeter to allow Project A's service account to write to Cloud Storage in Project B, and configure an ingress rule on the research data perimeter to accept requests from Project A. — _correct answer_
- **D.** Create a perimeter bridge between the two perimeters and use IAM permissions on the service account to restrict which buckets can be accessed.

## Question 155

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a production application on GKE that retrieves database credentials from Secret Manager. The security team is concerned about service-wide outages if an incorrect secret value is deployed. How should you configure secret access to minimize this risk while still allowing for credential updates?

**Correct answer:** D. Resolve the secret version at deployment time and store the specific version number in the deployment configuration.

**Options:**

- **A.** Configure Secret Manager to require manual approval before any secret version can be accessed by production workloads.
- **B.** Always reference the 'latest' alias when accessing secrets to ensure the most current credentials are used.
- **C.** Create separate secrets for each environment and use Kubernetes Network Policies to control which pods can access which secrets.
- **D.** Resolve the secret version at deployment time and store the specific version number in the deployment configuration. — _correct answer_

## Question 156

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is developing a web application that displays real-time analytics dashboards using Firestore. During testing, you notice that the application consumes significant bandwidth even when users navigate away from the dashboard page. You need to optimize resource usage while maintaining real-time functionality when users are viewing the dashboard. What should you do?

**Correct answer:** D. Store the listener reference returned by onSnapshot and call the unsubscribe function when users navigate away from the dashboard page to detach the listener.

**Options:**

- **A.** Configure Firestore to use memory-only cache settings which will automatically clean up listeners when the browser tab is closed.
- **B.** Set a timeout parameter on the snapshot listener configuration to automatically disconnect after a period of inactivity.
- **C.** Implement a Web Worker to handle Firestore listeners separately from the main application thread, which will automatically terminate listeners on page navigation.
- **D.** Store the listener reference returned by onSnapshot and call the unsubscribe function when users navigate away from the dashboard page to detach the listener. — _correct answer_

## Question 157

**Domain:** Deploying applications

**Question:** You are deploying a new Cloud Run service that requires access to two secrets from Secret Manager: an API key that should be available as an environment variable named API_KEY, and a TLS certificate that should be mounted as a file at /secrets/tls/cert.pem. Both secrets should use version 3. Which gcloud command correctly configures this deployment?

**Correct answer:** A. gcloud run deploy my-service --image gcr.io/project/image --set-secrets=API_KEY=api-key-secret:3,/secrets/tls/cert.pem=tls-cert-secret:3

**Options:**

- **A.** gcloud run deploy my-service --image gcr.io/project/image --set-secrets=API_KEY=api-key-secret:3,/secrets/tls/cert.pem=tls-cert-secret:3 — _correct answer_
- **B.** gcloud run deploy my-service --image gcr.io/project/image --set-secrets=API_KEY=api-key-secret:3 --volume-secrets=/secrets/tls/cert.pem=tls-cert-secret:3
- **C.** gcloud run deploy my-service --image gcr.io/project/image --secrets=API_KEY:api-key-secret:3,/secrets/tls:cert.pem:tls-cert-secret:3
- **D.** gcloud run deploy my-service --image gcr.io/project/image --update-env-vars=API_KEY=api-key-secret:3 --mount-secret=/secrets/tls/cert.pem=tls-cert-secret:3

## Question 158

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses the Cloud Storage JSON API to list objects and is experiencing 429 rateLimitExceeded errors during peak usage. You have verified that your retry logic with exponential backoff is implemented correctly, but errors persist. You need to reduce the frequency of rate limit errors while maintaining functionality. What should you do?

**Correct answer:** C. Increase the maxResults parameter value in your list requests to retrieve more objects per page, reducing the total number of API calls required.

**Options:**

- **A.** Switch from the JSON API to the XML API, as it has separate and higher rate limits that will not trigger 429 errors under your current load.
- **B.** Remove the exponential backoff implementation and retry requests immediately to complete operations faster before rate limits are reached.
- **C.** Increase the maxResults parameter value in your list requests to retrieve more objects per page, reducing the total number of API calls required. — _correct answer_
- **D.** Implement parallel requests by splitting the bucket into alphabetical ranges and querying multiple prefix ranges simultaneously to distribute the load.

## Question 159

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on GKE Autopilot experiences intermittent authentication failures to Google Cloud APIs immediately after pod startup. The application uses Workload Identity Federation for GKE, and the failures resolve after a few seconds. Your development team needs to implement a reliable solution to prevent these transient authentication errors. What should you do?

**Correct answer:** C. Deploy an initContainer that waits for the GKE metadata server to be ready by polling the metadata endpoint before the main application container starts.

**Options:**

- **A.** Increase the memory resources allocated to the gke-metadata-server DaemonSet pods to handle the authentication requests more efficiently during startup.
- **B.** Configure a dedicated quota project annotation on the Kubernetes service account to ensure API quota is available for authentication requests during startup.
- **C.** Deploy an initContainer that waits for the GKE metadata server to be ready by polling the metadata endpoint before the main application container starts. — _correct answer_
- **D.** Add retry logic to the application's IAM binding configuration using exponential backoff policy with a maximum of five attempts for service account impersonation.

## Question 160

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is preparing to implement VPC Service Controls to protect sensitive BigQuery datasets and Cloud Storage buckets across multiple projects. You want to test the perimeter configuration before enforcing it to identify potential access disruptions without impacting existing workloads. What should you do?

**Correct answer:** A. Create the service perimeter in dry run mode, review Cloud Audit Logs with the query filter for dryRun=true to identify violations, and then enforce the perimeter after resolving issues.

**Options:**

- **A.** Create the service perimeter in dry run mode, review Cloud Audit Logs with the query filter for dryRun=true to identify violations, and then enforce the perimeter after resolving issues. — _correct answer_
- **B.** Create the service perimeter using Access Context Manager and configure VPC firewall rules to log traffic before enabling the perimeter enforcement mode.
- **C.** Deploy the service perimeter to a development environment first, verify all applications work correctly, then replicate the configuration to production using Terraform.
- **D.** Create the service perimeter in enforced mode, monitor Cloud Audit Logs for access denied errors, and create exception rules to allow legitimate traffic after deployment.

## Question 161

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for an application that stores user profile data and user activity logs. User profiles are updated infrequently but read frequently, while activity logs are written continuously but rarely queried together with profile data. Both datasets share the same user identifier. You want to optimize for read and write performance. How should you organize this data in Bigtable?

**Correct answer:** A. Store both datasets in the same table using different column families: one for profile data and another for activity logs.

**Options:**

- **A.** Store both datasets in the same table using different column families: one for profile data and another for activity logs. — _correct answer_
- **B.** Store user profiles in Bigtable and activity logs in BigQuery since logs are better suited for analytical queries.
- **C.** Store user profiles and activity logs in separate Bigtable tables to isolate their different access patterns.
- **D.** Store both datasets in the same column family and use column qualifiers with prefixes to distinguish between profile data and activity logs.

## Question 162

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is developing an API on Cloud Run that sends telemetry data to a monitoring backend asynchronously after responding to client requests. During testing, you notice that the telemetry data is not being sent reliably. You have confirmed that the monitoring backend is available and that your code works correctly in local testing. What is the most likely cause of this issue, and how should you resolve it?

**Correct answer:** C. The Cloud Run service is configured with request-based billing, which throttles CPU access after request processing completes. Configure instance-based billing using the --no-cpu-throttling flag.

**Options:**

- **A.** The Cloud Run service is using the first-generation execution environment which does not support asynchronous operations. Migrate to the second-generation execution environment.
- **B.** The maximum concurrency setting is too high, causing instances to queue internal tasks. Lower the concurrency to allow background processing time.
- **C.** The Cloud Run service is configured with request-based billing, which throttles CPU access after request processing completes. Configure instance-based billing using the --no-cpu-throttling flag. — _correct answer_
- **D.** The Cloud Run service has insufficient memory allocated for buffering telemetry data. Increase the memory allocation for the service.

## Question 163

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a mobile inventory management application using Firestore. Warehouse workers need to update inventory counts while in areas with poor connectivity. When connectivity is restored, updates should sync automatically. You need to configure your Firestore client to support this workflow. What should you do?

**Correct answer:** B. Enable offline persistence using persistentLocalCache when initializing Firestore, allowing workers to read and write data while offline with automatic sync when online.

**Options:**

- **A.** Configure snapshot listeners with the source option set to cache to ensure all reads come from local data and prevent network requests in low connectivity areas.
- **B.** Enable offline persistence using persistentLocalCache when initializing Firestore, allowing workers to read and write data while offline with automatic sync when online. — _correct answer_
- **C.** Implement a local SQLite database to store changes while offline and create a background service that syncs with Firestore when connectivity is detected.
- **D.** Store pending write operations in Cloud Tasks and configure the mobile app to create tasks when offline that execute writes when connectivity is restored.

## Question 164

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Cloud Run service that needs to connect to a Memorystore for Redis instance for session caching. During testing, you receive connection timeout errors when the service attempts to connect to the Redis instance. What should you do to resolve this issue?

**Correct answer:** D. Configure Direct VPC egress for your Cloud Run service and ensure it is deployed in the same region as your Memorystore for Redis instance.

**Options:**

- **A.** Deploy your Cloud Run service with the --allow-unauthenticated flag to enable external connections to Memorystore for Redis.
- **B.** Configure Cloud Run to use the Memorystore for Redis instance's internal DNS name instead of the IP address for automatic service discovery.
- **C.** Create a public IP address for your Memorystore for Redis instance and update firewall rules to allow traffic from Cloud Run.
- **D.** Configure Direct VPC egress for your Cloud Run service and ensure it is deployed in the same region as your Memorystore for Redis instance. — _correct answer_

## Question 165

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a high-memory Python API on Cloud Run that processes CPU-intensive image transformations. The application is single-threaded and requires 4 vCPUs to meet memory requirements. During load testing, you notice that autoscaling is not responding effectively to increased traffic, and request latency is growing. The Cloud Monitoring metrics show low average CPU utilization despite one vCPU core being fully utilized. What should you do to improve autoscaling behavior?

**Correct answer:** A. Lower the maximum concurrency setting to drive scaling based on request throughput instead of CPU utilization.

**Options:**

- **A.** Lower the maximum concurrency setting to drive scaling based on request throughput instead of CPU utilization. — _correct answer_
- **B.** Enable instance-based billing to allow the application to process requests faster and improve CPU utilization metrics.
- **C.** Increase the maximum instances limit to allow Cloud Run to scale out more aggressively during traffic spikes.
- **D.** Reduce the vCPU allocation from 4 to 1 to ensure CPU-based autoscaling works correctly for single-threaded workloads.

## Question 166

**Domain:** Deploying applications

**Question:** You recently updated the container image version in a GKE Deployment, but users are reporting that the new version has a critical bug. You need to quickly revert to the previous working version while minimizing user disruption. What is the most efficient kubectl command to accomplish this?

**Correct answer:** D. kubectl rollout undo deployment/my-app

**Options:**

- **A.** kubectl delete deployment my-app && kubectl apply -f previous-deployment.yaml
- **B.** kubectl set image deployment/my-app container=image:previous-tag
- **C.** kubectl scale deployment my-app --replicas=0 && kubectl apply -f deployment.yaml
- **D.** kubectl rollout undo deployment/my-app — _correct answer_

## Question 167

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a product catalog application using Cloud Firestore. Your application needs to query products by category and sort them by price in descending order. You receive an error when running the query. What should you do to resolve this issue?

**Correct answer:** A. Create a composite index with the category field in ascending mode and the price field in descending mode with collection scope.

**Options:**

- **A.** Create a composite index with the category field in ascending mode and the price field in descending mode with collection scope. — _correct answer_
- **B.** Enable automatic indexing for the products collection to automatically generate all needed indexes.
- **C.** Execute two separate queries: one to filter by category and another to sort by price, then merge the results in your application.
- **D.** Restructure your data model to store products in separate collections by category so you can use single-field indexes.

## Question 168

**Domain:** Building and testing applications

**Question:** Your development team builds container images using Cloud Build and stores them in Artifact Registry. The team wants to use the same cloudbuild.yaml file to push images to different repositories for development, staging, and production environments. What is the recommended approach to achieve this?

**Correct answer:** B. Use Cloud Build substitutions such as ${_REPOSITORY} and ${_LOCATION} in the image path within cloudbuild.yaml, and specify the values using the --substitutions flag when running gcloud builds submit.

**Options:**

- **A.** Configure Artifact Registry to use virtual repositories that automatically route images to the appropriate underlying repository based on environment tags in the image name.
- **B.** Use Cloud Build substitutions such as ${_REPOSITORY} and ${_LOCATION} in the image path within cloudbuild.yaml, and specify the values using the --substitutions flag when running gcloud builds submit. — _correct answer_
- **C.** Set environment variables in the Cloud Build trigger configuration that override the repository path in cloudbuild.yaml based on the branch name that triggered the build.
- **D.** Create separate cloudbuild.yaml files for each environment (cloudbuild-dev.yaml, cloudbuild-staging.yaml, cloudbuild-prod.yaml) with hardcoded repository paths for maintainability and clarity.

## Question 169

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Cloud Run API that connects to a Cloud SQL PostgreSQL database. The database has a maximum connection limit of 100 concurrent connections. Your Cloud Run service uses a connection pool with 10 connections per instance. You need to configure Cloud Run to prevent exceeding the database connection limit while maximizing throughput. What should you do?

**Correct answer:** A. Set the Cloud Run maximum instances to 10 to ensure total connections do not exceed the database limit.

**Options:**

- **A.** Set the Cloud Run maximum instances to 10 to ensure total connections do not exceed the database limit. — _correct answer_
- **B.** Enable Cloud SQL Managed Connection Pooling and remove the maximum instances limit from Cloud Run.
- **C.** Set the Cloud Run concurrency to 100 to limit the total number of concurrent requests matching the database connection limit.
- **D.** Configure the connection pool to use lazy initialization and reduce pool size to 1 connection per instance.

## Question 170

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are configuring VPC Service Controls to protect sensitive data in BigQuery and Cloud Storage. Your CI/CD pipeline running in Cloud Build needs to read data from Cloud Storage and write results to BigQuery, both of which are inside the perimeter. The Cloud Build default pool is being blocked by the perimeter. What should you do?

**Correct answer:** A. Create a Cloud Build private pool within a VPC network that is included in the service perimeter. Configure the private pool with NO_PUBLIC_EGRESS to ensure VPC Service Controls protection is enforced.

**Options:**

- **A.** Create a Cloud Build private pool within a VPC network that is included in the service perimeter. Configure the private pool with NO_PUBLIC_EGRESS to ensure VPC Service Controls protection is enforced. — _correct answer_
- **B.** Configure an ingress rule that allows the Cloud Build service account to access Cloud Storage and BigQuery resources within the perimeter. Specify the default Cloud Build pool project as the source.
- **C.** Configure an egress rule that allows data to flow from Cloud Storage to Cloud Build and from Cloud Build to BigQuery. Specify the Cloud Build default pool service account in the egress rule identities.
- **D.** Add an access level that includes the Cloud Build service agent's service account. Associate the access level with the perimeter to grant the CI/CD pipeline access to protected resources.
