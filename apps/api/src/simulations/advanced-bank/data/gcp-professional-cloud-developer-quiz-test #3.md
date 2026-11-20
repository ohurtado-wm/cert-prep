# gcp-professional-cloud-developer-quiz-test #3

## Question 1

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema to store web analytics data for multiple customer domains. The application needs to efficiently query page views by domain, and the most common query retrieves all page views for a specific subdomain (e.g., blog.example.com). Which row key design optimizes query performance for this access pattern?

**Correct answer:** C. Use a reversed domain name as the row key prefix (e.g., com.example.blog#timestamp), followed by a timestamp for the page view event.

**Options:**

- **A.** Use the full domain name as the row key prefix (e.g., blog.example.com#timestamp) to maintain readability.
- **B.** Use a hash of the domain name as the row key prefix to distribute writes evenly across nodes.
- **C.** Use a reversed domain name as the row key prefix (e.g., com.example.blog#timestamp), followed by a timestamp for the page view event. — _correct answer_
- **D.** Use the timestamp as the row key prefix followed by the domain name to retrieve the most recent data first.

## Question 2

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is developing a mobile application that uses Firestore snapshot listeners to display real-time inventory updates across multiple screens. Users report that the application becomes sluggish after navigating between screens multiple times. You suspect a resource management issue. What is the most likely cause and how should you address it?

**Correct answer:** A. Snapshot listeners are not being detached when users navigate away from screens. Call the unsubscribe function returned by onSnapshot() when the component or screen is destroyed.

**Options:**

- **A.** Snapshot listeners are not being detached when users navigate away from screens. Call the unsubscribe function returned by onSnapshot() when the component or screen is destroyed. — _correct answer_
- **B.** The local cache is growing too large. Call clearPersistence() each time the user navigates away from a screen displaying Firestore data.
- **C.** The Firestore client is creating multiple database connections. Configure connection pooling at the application initialization level to reuse connections.
- **D.** The application is fetching too much data. Implement pagination using startAfter() and limit() to reduce the amount of data loaded per listener.

## Question 3

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company uses a Shared VPC architecture with a host project containing the VPC network and multiple service projects running workloads. You need to configure VPC Service Controls to protect Cloud Storage and BigQuery resources in the service projects. Some service projects contain sensitive data and require isolation from others. What should you do?

**Correct answer:** B. Create service perimeters that include both the host project and each service project requiring protection. Use ingress and egress rules to control data exchange between service projects in different perimeters.

**Options:**

- **A.** Create individual VPC networks for each service project and remove them from the Shared VPC. Place each project in its own service perimeter for complete isolation.
- **B.** Create service perimeters that include both the host project and each service project requiring protection. Use ingress and egress rules to control data exchange between service projects in different perimeters. — _correct answer_
- **C.** Create a single service perimeter containing all service projects. Use VPC firewall rules to isolate sensitive service projects from others within the shared perimeter.
- **D.** Create separate service perimeters for each service project without including the host project. Configure access levels to allow network connectivity from the Shared VPC.

## Question 4

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have a batch processing application running on Compute Engine that needs to access an internal API secured by Identity-Aware Proxy (IAP). The application uses a dedicated service account and must authenticate programmatically without user interaction. How should you configure the application to access the IAP-protected API?

**Correct answer:** C. Obtain an OIDC token with the audience set to the OAuth 2.0 client ID of the IAP-secured resource and include it in the Authorization header as a Bearer token when making requests.

**Options:**

- **A.** Create an API key in the Google Cloud console, associate it with the service account, and include it in the X-API-Key header when making requests to the IAP-secured endpoint.
- **B.** Generate a Google-issued access token for the service account using the IAM API and include it in the Authorization header with scope iap.httpsResourceAccessor.
- **C.** Obtain an OIDC token with the audience set to the OAuth 2.0 client ID of the IAP-secured resource and include it in the Authorization header as a Bearer token when making requests. — _correct answer_
- **D.** Configure the service account with the IAP-secured Web App User role and allow the application to make requests without authentication headers since IAP will recognize the compute instance's identity.

## Question 5

**Domain:** Deploying applications

**Question:** You are deploying a stateless web application to GKE and need to configure resource requests and limits to ensure optimal scheduling and cost efficiency. The application typically uses 200m CPU and 256Mi memory under normal load but can burst to 400m CPU during peak traffic. Memory usage remains stable. Following Google Cloud best practices, how should you configure the container resources in your deployment manifest?

**Correct answer:** D. Set CPU request to 200m with no CPU limit specified, and set both memory request and memory limit to 256Mi.

**Options:**

- **A.** Set both CPU request and limit to 400m to guarantee peak performance, and set memory request and memory limit to 256Mi.
- **B.** Set CPU request to 200m and CPU limit to 400m, and set memory request to 256Mi with memory limit to 512Mi to allow memory bursting.
- **C.** Do not specify resource requests or limits to allow the Kubernetes scheduler maximum flexibility in placing the pod.
- **D.** Set CPU request to 200m with no CPU limit specified, and set both memory request and memory limit to 256Mi. — _correct answer_

## Question 6

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service in the us-east1 region that needs to connect to a Memorystore for Redis instance in your VPC network. You have created a Serverless VPC Access connector. However, when you deploy the service, it cannot connect to the Redis instance. What is the most likely cause of this connectivity issue?

**Correct answer:** C. The Serverless VPC Access connector was created in a different region than your Cloud Run service.

**Options:**

- **A.** The Cloud Run service was deployed with the --vpc-egress=private-ranges-only flag instead of --vpc-egress=all-traffic.
- **B.** The Serverless VPC Access API was not enabled in the project before creating the connector.
- **C.** The Serverless VPC Access connector was created in a different region than your Cloud Run service. — _correct answer_
- **D.** The Memorystore for Redis instance does not have a public IP address assigned.

## Question 7

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is building an event-driven microservice on Cloud Run that processes messages using Go goroutines and maintains an in-memory cache that needs periodic background updates using a background thread. The application continues background processing after responding to requests. You notice that background tasks are intermittently failing or not completing. What configuration change should you make to resolve this issue?

**Correct answer:** D. Configure the Cloud Run service to use instance-based billing using the --no-cpu-throttling flag during deployment.

**Options:**

- **A.** Set the maximum concurrency to 1 to ensure that background tasks have dedicated CPU resources for each request.
- **B.** Configure a minimum instances value of 1 to keep an instance always warm and available for background processing.
- **C.** Increase the CPU allocation to 4 vCPUs to provide more processing power for concurrent background operations.
- **D.** Configure the Cloud Run service to use instance-based billing using the --no-cpu-throttling flag during deployment. — _correct answer_

## Question 8

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is developing a Cloud Run service that uses Go routines to perform background processing after returning HTTP responses to clients. The service caches weather data by periodically fetching updates from an external API every 5 minutes using a timer-based goroutine. During testing, you notice that the background processing tasks are not executing reliably. What configuration change should you make to ensure the background tasks run properly?

**Correct answer:** D. Configure the service to use instance-based billing with the --no-cpu-throttling flag during deployment.

**Options:**

- **A.** Set the minimum instances to 1 to ensure there is always an active instance available for background processing.
- **B.** Enable startup CPU boost to provide continuous CPU allocation during the container lifecycle.
- **C.** Increase the request timeout to 60 minutes to allow more time for background processing to complete.
- **D.** Configure the service to use instance-based billing with the --no-cpu-throttling flag during deployment. — _correct answer_

## Question 9

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service needs to perform background processing tasks such as sending telemetry data using OpenTelemetry after returning HTTP responses to clients. You notice that background tasks are not completing reliably. What should you do?

**Correct answer:** B. Configure the Cloud Run service to use instance-based billing by setting the --no-cpu-throttling flag during deployment.

**Options:**

- **A.** Set the maximum concurrency to 1 so that each instance handles only one request at a time, allowing background tasks to use remaining CPU.
- **B.** Configure the Cloud Run service to use instance-based billing by setting the --no-cpu-throttling flag during deployment. — _correct answer_
- **C.** Increase the request timeout setting to allow more time for background tasks to complete before the instance becomes idle.
- **D.** Enable startup CPU boost to provide additional CPU resources for background processing during container startup.

## Question 10

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a microservices application on GKE that requires secure connections to a Cloud SQL for MySQL instance with private IP. You want to follow Google-recommended best practices for connecting from GKE while maintaining secure authentication without managing SSL certificates manually. What should you do?

**Correct answer:** B. Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod using the initContainers section with restartPolicy set to Always. Configure the proxy to connect over private IP and have your application connect to localhost.

**Options:**

- **A.** Create an authorized network entry for the GKE cluster's IP range in Cloud SQL. Connect directly from application pods to the Cloud SQL private IP without using the proxy.
- **B.** Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod using the initContainers section with restartPolicy set to Always. Configure the proxy to connect over private IP and have your application connect to localhost. — _correct answer_
- **C.** Configure SSL certificates on the Cloud SQL instance and store the client certificates as Kubernetes Secrets. Mount the certificates in each pod and configure the MySQL client to use SSL.
- **D.** Create a Kubernetes Deployment with a single Cloud SQL Auth Proxy container and expose it as a ClusterIP Service. Configure all application pods to connect to this centralized proxy service.

## Question 11

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application needs to update metadata on 500 objects in a Cloud Storage bucket. You want to minimize the number of HTTP requests while staying within API limits. What is the most efficient approach using the Cloud Storage JSON API?

**Correct answer:** A. Send multiple batch requests, each containing up to 100 individual API calls, with each batch request having a total payload under 10MB.

**Options:**

- **A.** Send multiple batch requests, each containing up to 100 individual API calls, with each batch request having a total payload under 10MB. — _correct answer_
- **B.** Use the objects.bulkUpdate method in the JSON API to update all 500 objects with a single API call.
- **C.** Make 500 individual API calls sequentially with a fixed delay between requests to avoid hitting rate limits.
- **D.** Send a single batch request containing all 500 metadata update operations to minimize the number of HTTP connections required.

## Question 12

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company has a sensitive internal application protected by Identity-Aware Proxy (IAP). You need to restrict access so that employees can only access the application from corporate-managed devices that have encrypted storage and from specific IP address ranges. You want to implement this using Google-recommended practices. What should you do?

**Correct answer:** B. Create an access level in Access Context Manager with device policy and IP subnetwork conditions. Apply the access level as an IAM condition when granting the IAP-secured Web App User role.

**Options:**

- **A.** Configure VPC firewall rules to allow only the corporate IP range and require users to install endpoint verification on their devices before granting access.
- **B.** Create an access level in Access Context Manager with device policy and IP subnetwork conditions. Apply the access level as an IAM condition when granting the IAP-secured Web App User role. — _correct answer_
- **C.** Create a custom OAuth consent screen that validates device attributes and IP address before redirecting users to the application.
- **D.** Grant the IAP Policy Admin role to users and configure IP allowlisting directly in the IAP settings page without using Access Context Manager.

## Question 13

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You recently enforced a VPC Service Controls perimeter and users are reporting 'Error 403: Request is prohibited by organization's policy' when accessing protected resources. You need to investigate and resolve this issue. The error started occurring 10 minutes after you made changes to the perimeter. What is the most likely cause and how should you troubleshoot?

**Correct answer:** B. The perimeter changes are still propagating; wait up to 30 minutes for changes to take effect, then check Cloud Audit Logs to identify the specific violations causing the denials.

**Options:**

- **A.** The perimeter configuration is incorrect and must be deleted immediately; recreate the perimeter from scratch with the correct settings.
- **B.** The perimeter changes are still propagating; wait up to 30 minutes for changes to take effect, then check Cloud Audit Logs to identify the specific violations causing the denials. — _correct answer_
- **C.** The VPC Service Controls service is experiencing an outage; contact Google Cloud Support immediately and request an emergency exemption for affected users.
- **D.** The users' IAM permissions were automatically revoked when the perimeter was enforced; re-grant the necessary IAM roles to affected users.

## Question 14

**Domain:** Integrating applications with Google Cloud services

**Question:** You need to create a Service Level Indicator (SLI) for request latency in your application. The latency values are logged in your application logs as a field containing values like '250ms'. You want to use this data to track the distribution of latency values and create SLOs in Cloud Monitoring. What should you do?

**Correct answer:** B. Create a distribution log-based metric with a filter for request logs. Configure a value extractor using a regular expression to extract the numeric latency value from the log field.

**Options:**

- **A.** Create a counter log-based metric that counts request logs and calculate the average latency by dividing the total latency sum by the count.
- **B.** Create a distribution log-based metric with a filter for request logs. Configure a value extractor using a regular expression to extract the numeric latency value from the log field. — _correct answer_
- **C.** Export logs to BigQuery and create a scheduled query to calculate latency percentiles. Use the query results to create custom metrics in Cloud Monitoring.
- **D.** Use Cloud Trace to automatically capture latency data from your application logs and create SLIs based on trace spans.

## Question 15

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a microservices application on Cloud Run that requires database credentials stored in Secret Manager. The application reads secrets at container startup. Your security team wants to ensure that deployments use validated secret versions and can be rolled back if issues arise. Following Google-recommended best practices, how should you configure the secret access for your Cloud Run services?

**Correct answer:** C. Reference secrets by their specific version number in the Cloud Run deployment configuration, and deploy version number updates using your existing release processes.

**Options:**

- **A.** Create a custom versioning system using Cloud Storage to store secret versions, then have Cloud Run read from Cloud Storage at startup for maximum flexibility.
- **B.** Store secrets as plain environment variables in Cloud Run and manually update them when credentials change to maintain full control over the deployment process.
- **C.** Reference secrets by their specific version number in the Cloud Run deployment configuration, and deploy version number updates using your existing release processes. — _correct answer_
- **D.** Reference secrets using the 'latest' alias in the Cloud Run deployment configuration to automatically retrieve the most recent secret value whenever the container starts.

## Question 16

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a microservices application on GKE that uses Memorystore for Redis for caching. During peak traffic, some application instances experience connection timeouts when reconnecting to Redis after brief network interruptions. You need to implement a solution that minimizes the impact of connection issues. What should you do?

**Correct answer:** B. Implement retry logic with exponential backoff in your application to handle connection drops and reconnection attempts.

**Options:**

- **A.** Create a Redis connection proxy deployment in GKE to manage and pool connections centrally.
- **B.** Implement retry logic with exponential backoff in your application to handle connection drops and reconnection attempts. — _correct answer_
- **C.** Configure a Kubernetes readiness probe that checks Redis connectivity before routing traffic to pods.
- **D.** Increase the GKE node pool size to reduce the connection density per Redis instance.

## Question 17

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a web application running on Cloud Run that needs to connect to a Cloud SQL for PostgreSQL instance. The application experiences frequent traffic spikes where many concurrent requests are made. During peak loads, your application encounters connection errors due to the database's max_connections limit being exceeded. You want to minimize development effort while optimizing connection management. What should you do?

**Correct answer:** B. Configure application-level connection pooling in your code by setting pool_size and max_overflow parameters to limit the number of connections per instance.

**Options:**

- **A.** Enable Managed Connection Pooling on the Cloud SQL instance and change the application to connect to port 6432 using transaction pooling mode.
- **B.** Configure application-level connection pooling in your code by setting pool_size and max_overflow parameters to limit the number of connections per instance. — _correct answer_
- **C.** Increase the max_connections flag on the Cloud SQL instance to allow more concurrent connections.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar to manage connection throttling and automatic connection pooling.

## Question 18

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a microservices application on GKE that needs to access Cloud Storage and Pub/Sub APIs. You want to implement the most secure method for authenticating your Pods to Google Cloud services without managing service account keys. Your company uses GKE Standard clusters. What should you do?

**Correct answer:** C. Enable Workload Identity Federation for GKE on the cluster and node pools. Create a Kubernetes service account and grant IAM roles to the Kubernetes service account's principal identifier to access the required Google Cloud APIs.

**Options:**

- **A.** Assign the required IAM roles directly to the Compute Engine default service account used by your GKE nodes. Configure your application to use Application Default Credentials to inherit these permissions.
- **B.** Enable GKE Metadata concealment to protect your workloads. Create a custom IAM policy that references the node pool's service account to grant the required permissions.
- **C.** Enable Workload Identity Federation for GKE on the cluster and node pools. Create a Kubernetes service account and grant IAM roles to the Kubernetes service account's principal identifier to access the required Google Cloud APIs. — _correct answer_
- **D.** Create an IAM service account with the required permissions. Download the service account key JSON file and store it as a Kubernetes Secret. Mount the Secret in your Pods and set the GOOGLE_APPLICATION_CREDENTIALS environment variable.

## Question 19

**Domain:** Building and testing applications

**Question:** Your team uses Artifact Registry to store container images built by Cloud Build. Over time, storage costs have increased significantly due to accumulating old image versions. You want to automatically manage image lifecycle while ensuring that production releases are retained. What should you do?

**Correct answer:** D. Create Artifact Registry cleanup policies with a delete policy for images older than 30 days and a conditional keep policy that retains images with tag prefixes matching your production release tags.

**Options:**

- **A.** Enable automatic scanning with Artifact Analysis and configure it to delete images that have critical vulnerabilities older than 30 days.
- **B.** Set a retention period on the Cloud Storage bucket underlying the Artifact Registry repository to automatically delete objects older than 30 days.
- **C.** Configure Cloud Build to automatically delete previous image versions from Artifact Registry after each successful build by adding a cleanup step at the end of your build configuration.
- **D.** Create Artifact Registry cleanup policies with a delete policy for images older than 30 days and a conditional keep policy that retains images with tag prefixes matching your production release tags. — _correct answer_

## Question 20

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is developing a single-threaded Python API on Cloud Run configured with 4 vCPUs to meet the application's memory requirements. During load testing, you observe that the service is not scaling out as expected despite high latency on individual requests. Cloud Monitoring shows the average CPU utilization across instances remains below 25% even under load. You need to ensure the service scales appropriately to handle incoming requests. What should you do?

**Correct answer:** D. Lower the maximum concurrency setting to force Cloud Run to scale based on request throughput instead of CPU utilization.

**Options:**

- **A.** Configure instance-based billing to ensure CPU is always allocated and allow background processing to continue.
- **B.** Enable startup CPU boost to provide additional CPU during instance startup and reduce cold start latency.
- **C.** Increase the maximum instances limit to allow Cloud Run to scale to more instances during traffic spikes.
- **D.** Lower the maximum concurrency setting to force Cloud Run to scale based on request throughput instead of CPU utilization. — _correct answer_

## Question 21

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a social media application using Cloud Firestore. Users can create posts with fields for 'category' (string), 'timestamp' (date), and 'likes' (number). You need to query posts where category equals 'technology' and order results by timestamp in descending order. When you run this query during testing, you receive an error. What is the most likely cause of this error?

**Correct answer:** B. The query requires a composite index on the 'category' and 'timestamp' fields that has not been created yet.

**Options:**

- **A.** The 'timestamp' field has been excluded from automatic single-field indexing in the database settings.
- **B.** The query requires a composite index on the 'category' and 'timestamp' fields that has not been created yet. — _correct answer_
- **C.** Cloud Firestore does not support ordering query results by date fields when combined with equality filters.
- **D.** The query exceeds the maximum number of fields allowed in a Firestore query clause.

## Question 22

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on Cloud Run uses the Firestore server client library to perform frequent read operations on the same set of documents for generating reports. You notice data contention errors during peak usage. The reports only need to display data and never modify it. What should you do to reduce contention and improve throughput?

**Correct answer:** C. Use read-only transactions for the report generation queries to avoid acquiring document locks.

**Options:**

- **A.** Configure the Firestore database concurrency mode from PESSIMISTIC to OPTIMISTIC to reduce lock contention.
- **B.** Increase the number of retry attempts for read-write transactions to handle contention more gracefully.
- **C.** Use read-only transactions for the report generation queries to avoid acquiring document locks. — _correct answer_
- **D.** Implement client-side caching using Memorystore for Redis to reduce the number of Firestore reads.

## Question 23

**Domain:** Building and testing applications

**Question:** A development team uses Cloud Code to develop Kubernetes applications. They need to authenticate with Google Cloud APIs when running and debugging their containerized applications locally. Some developers report receiving authentication errors when their local applications try to call Google Cloud APIs. What should the team do to resolve this issue?

**Correct answer:** D. Sign in to the gcloud CLI through Cloud Code, which updates the Application Default Credentials that local applications use to authenticate with Google Cloud APIs.

**Options:**

- **A.** Configure each application's Kubernetes deployment manifest to use a GKE Workload Identity annotation that maps to a Google Cloud service account.
- **B.** Create a service account key JSON file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable in each developer's shell profile to point to the key file.
- **C.** Add an OAuth 2.0 client ID and secret to the application code and implement an authentication flow that prompts users to sign in when the application starts.
- **D.** Sign in to the gcloud CLI through Cloud Code, which updates the Application Default Credentials that local applications use to authenticate with Google Cloud APIs. — _correct answer_

## Question 24

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company runs a customer-facing API on Cloud Run that experiences unpredictable traffic spikes. Users complain about occasional slow response times during the first few requests after periods of inactivity. You need to reduce latency while minimizing costs. The service currently scales to zero and has an average container startup time of 4 seconds. What should you do?

**Correct answer:** B. Configure minimum instances to a small value like 1 or 2 to keep warm instances ready for incoming requests.

**Options:**

- **A.** Enable startup CPU boost to reduce cold start latency during container initialization.
- **B.** Configure minimum instances to a small value like 1 or 2 to keep warm instances ready for incoming requests. — _correct answer_
- **C.** Increase maximum concurrency to reduce the number of instances needed and avoid scaling delays.
- **D.** Switch to manual scaling with a fixed instance count to eliminate autoscaling delays entirely.

## Question 25

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is planning to implement VPC Service Controls to protect sensitive BigQuery and Cloud Storage resources. Before enforcing the service perimeter, you want to identify any potential issues that might disrupt existing applications. You need to test the perimeter configuration without affecting current operations. What should you do?

**Correct answer:** A. Create a service perimeter in dry run mode and analyze the VPC Service Controls audit logs to identify violations before enforcing the perimeter.

**Options:**

- **A.** Create a service perimeter in dry run mode and analyze the VPC Service Controls audit logs to identify violations before enforcing the perimeter. — _correct answer_
- **B.** Create an enforced service perimeter with all services protected and configure broad access levels to allow all traffic temporarily.
- **C.** Create a copy of your production environment in a separate project and test the enforced service perimeter in the copied environment.
- **D.** Configure IAM deny policies on the target resources to simulate VPC Service Controls blocking behavior and review the denied access attempts.

## Question 26

**Domain:** Building and testing applications

**Question:** You are setting up Cloud Code in VS Code for a new containerized application project. The project has a Dockerfile but no Skaffold configuration. When you try to run your application on Kubernetes using Cloud Code, what will happen?

**Correct answer:** D. Cloud Code guides you through creating the necessary skaffold.yaml and cloudcode.kubernetes launch configuration when you run or debug your application for the first time

**Options:**

- **A.** Cloud Code will prompt you to install Skaffold CLI separately before proceeding with any configuration
- **B.** Cloud Code will refuse to run the application and display an error requiring manual creation of all configuration files
- **C.** Cloud Code will automatically generate a default Kubernetes deployment manifest and deploy directly to the cluster without any configuration
- **D.** Cloud Code guides you through creating the necessary skaffold.yaml and cloudcode.kubernetes launch configuration when you run or debug your application for the first time — _correct answer_

## Question 27

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for a mobile gaming application that needs to store player profile data. The application frequently queries recent game sessions for a specific player to display on their profile. Players occasionally query their historical sessions from months ago. You want to optimize for the most common access pattern. How should you design the row key?

**Correct answer:** A. Use player_id#reverse_timestamp where the timestamp is calculated by subtracting the actual timestamp from a large constant (such as Long.MAX_VALUE).

**Options:**

- **A.** Use player_id#reverse_timestamp where the timestamp is calculated by subtracting the actual timestamp from a large constant (such as Long.MAX_VALUE). — _correct answer_
- **B.** Use player_id#timestamp with the actual Unix timestamp as the second component to maintain chronological ordering for each player.
- **C.** Use session_id as the row key and store player_id as a column to enable direct lookup of any session by its unique identifier.
- **D.** Use timestamp#player_id to enable efficient time-based queries across all players while still supporting player-specific lookups.

## Question 28

**Domain:** Building and testing applications

**Question:** You are developing a microservices application that will run on GKE. You want to set up your VS Code development environment for containerized application development using Cloud Code. Your team requires the ability to debug applications running in containers on a local Kubernetes cluster without using Google Cloud resources. Which components must be installed and configured on your development machine?

**Correct answer:** B. Install Cloud Code extension, Docker, Git, and minikube, and ensure your local cluster is configured as the current context in ~/.kube/config.

**Options:**

- **A.** Install Cloud Code extension and Docker. Configure GOOGLE_APPLICATION_CREDENTIALS environment variable to point to a service account key file for authentication.
- **B.** Install Cloud Code extension, Docker, Git, and minikube, and ensure your local cluster is configured as the current context in ~/.kube/config. — _correct answer_
- **C.** Install Cloud Code extension, configure Cloud Build API access, and create a GKE cluster in your project for development testing.
- **D.** Install Cloud Code extension and kubectl. Run gcloud components install skaffold to install Skaffold manually for the build process.

## Question 29

**Domain:** Deploying applications

**Question:** Your company wants to minimize costs while enabling Cloud Run services to access private resources in a VPC network. The traffic patterns are highly variable with extended periods of no traffic. You need to recommend the most cost-effective VPC egress solution. What should you recommend?

**Correct answer:** D. Use Direct VPC egress because you only pay for network egress charges, which scale to zero when there is no traffic.

**Options:**

- **A.** Use a Serverless VPC Access connector with the minimum instance count set to 2 and maximum set to 3 to reduce costs.
- **B.** Use a Serverless VPC Access connector with the f1-micro machine type to minimize the per-instance cost.
- **C.** Use Cloud NAT with a Serverless VPC Access connector to optimize egress costs and reduce the number of required connector instances.
- **D.** Use Direct VPC egress because you only pay for network egress charges, which scale to zero when there is no traffic. — _correct answer_

## Question 30

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is building an IoT data platform that stores telemetry data from millions of devices in Cloud Bigtable. The data includes device measurements with timestamps that arrive continuously throughout the day. You need to design a row key schema that allows efficient retrieval of all data for a specific device within a time range while preventing performance issues. Which row key design should you use?

**Correct answer:** B. Use a row key format of device_id#timestamp, where device_id is a unique identifier for the device and timestamp represents when the measurement was taken.

**Options:**

- **A.** Use a row key format of timestamp#device_id, where timestamp represents when the measurement was taken and device_id uniquely identifies the device.
- **B.** Use a row key format of device_id#timestamp, where device_id is a unique identifier for the device and timestamp represents when the measurement was taken. — _correct answer_
- **C.** Use a row key format of region#timestamp#device_id, where region is a geographic identifier, timestamp is the measurement time, and device_id is the device identifier.
- **D.** Use a row key format of sequential_id, where sequential_id is an auto-incrementing number assigned to each measurement as it arrives.

## Question 31

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a mobile application that stores user orders in Cloud Firestore. The application needs to query orders by 'status' field with an equality filter and by 'createdAt' field with a range filter, then sort results by 'createdAt' in descending order. Users report that queries are failing with an error. What should you do to resolve this issue?

**Correct answer:** B. Create a composite index on the 'orders' collection that includes the 'status' field in ascending order, the 'createdAt' field in descending order, and has collection scope.

**Options:**

- **A.** Configure the application to execute two separate queries: first filter by 'status', then filter the results by 'createdAt' in application code.
- **B.** Create a composite index on the 'orders' collection that includes the 'status' field in ascending order, the 'createdAt' field in descending order, and has collection scope. — _correct answer_
- **C.** Add single-field index exemptions for both 'status' and 'createdAt' fields to optimize query performance and reduce index conflicts.
- **D.** Increase the query timeout settings in the application code to allow more time for index scanning and add retry logic with exponential backoff.

## Question 32

**Domain:** Deploying applications

**Question:** You need to deploy a Cloud Run service that uses Secret Manager secrets exposed as environment variables. Following Google Cloud best practices for production deployments, which approach should you use for specifying secret versions?

**Correct answer:** A. Pin secrets to specific version numbers and update versions through your deployment pipeline when secrets are rotated.

**Options:**

- **A.** Pin secrets to specific version numbers and update versions through your deployment pipeline when secrets are rotated. — _correct answer_
- **B.** Mount secrets as volumes using the 'latest' alias since environment variables cannot be pinned to specific versions.
- **C.** Use the 'latest' version alias to ensure the application always uses the most current secret values automatically.
- **D.** Configure secrets without specifying a version to let Secret Manager automatically select the appropriate version.

## Question 33

**Domain:** Deploying applications

**Question:** A developer is troubleshooting a Cloud Run service that fails to start. The service is configured to reference a secret from Secret Manager as an environment variable. The logs show the secret access is failing. The developer verified that the service account has the Secret Manager Secret Accessor role on the secret. What is the most likely cause of this issue?

**Correct answer:** B. The secret version specified in the configuration is disabled or has been destroyed in Secret Manager.

**Options:**

- **A.** The secret was created less than 24 hours ago and is not yet available for access.
- **B.** The secret version specified in the configuration is disabled or has been destroyed in Secret Manager. — _correct answer_
- **C.** The Secret Manager API is not enabled in the project where Cloud Run is deployed.
- **D.** The Cloud Run service is deployed in a different region than where the Secret Manager secret is stored.

## Question 34

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline for a Node.js application. The build needs to run npm install for dependencies, execute unit tests, and run security scanning in parallel to reduce build time. The final Docker build step should only execute after all three tasks complete successfully. How should you configure the build steps?

**Correct answer:** D. Define each parallel step with an id field and waitFor: ['-'] to start immediately. Configure the Docker build step to wait for all three step IDs using the waitFor field.

**Options:**

- **A.** Use the parallel: true flag in the Cloud Build configuration to automatically run all steps in parallel, then add a barrier step before the Docker build.
- **B.** Configure the npm install, unit tests, and security scanning steps sequentially, as Cloud Build automatically optimizes step execution order for maximum parallelism.
- **C.** Create three separate Cloud Build configurations and use Cloud Workflows to orchestrate them in parallel, then trigger the Docker build as a final step.
- **D.** Define each parallel step with an id field and waitFor: ['-'] to start immediately. Configure the Docker build step to wait for all three step IDs using the waitFor field. — _correct answer_

## Question 35

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a microservices application deployed on GKE. Your team needs to be notified when more than 100 error-level log entries occur within a 5-minute window for any specific service. You want to use a Google-recommended approach that minimizes custom code. What should you do?

**Correct answer:** D. Create a log-based counter metric with a filter for severity>=ERROR and add a label to extract the service name. Configure an alerting policy in Cloud Monitoring to trigger when the metric exceeds 100.

**Options:**

- **A.** Configure a log-based alerting policy directly in Cloud Logging that triggers when the specified filter matches 100 entries within 5 minutes.
- **B.** Export all logs to BigQuery using a log sink and create a scheduled query that runs every 5 minutes to count errors. Use BigQuery alerts to notify the team.
- **C.** Create a Cloud Run function that is triggered by Pub/Sub and queries Cloud Logging every 5 minutes to count error logs. Send a notification via Cloud Tasks if the count exceeds 100.
- **D.** Create a log-based counter metric with a filter for severity>=ERROR and add a label to extract the service name. Configure an alerting policy in Cloud Monitoring to trigger when the metric exceeds 100. — _correct answer_

## Question 36

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses the Cloud Storage JSON API to list objects and occasionally receives HTTP 429 rateLimitExceeded errors when the request rate spikes during batch processing. You are implementing retry logic using exponential backoff. Which formula correctly calculates the wait time before the next retry attempt?

**Correct answer:** C. wait_time = min(((2^n) + random_milliseconds), maximum_backoff), where n is the retry attempt number and random_milliseconds adds jitter.

**Options:**

- **A.** wait_time = random(0, 60000) milliseconds, selecting a random value between 0 and 60 seconds for each retry.
- **B.** wait_time = 0 milliseconds for all retries to process the request as quickly as possible once the rate limit resets.
- **C.** wait_time = min(((2^n) + random_milliseconds), maximum_backoff), where n is the retry attempt number and random_milliseconds adds jitter. — _correct answer_
- **D.** wait_time = n * 1000 milliseconds, where n is the retry attempt number, creating a linear increase between retries.

## Question 37

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new Cloud Run service that needs to connect to an existing Memorystore for Redis instance for caching frequently accessed API responses. The Memorystore instance uses private services access connection mode. You want to configure the connection using the most efficient method with lowest latency. What should you do?

**Correct answer:** B. Configure the Cloud Run service with Direct VPC egress by specifying the VPC network and subnet that has access to the Memorystore instance's authorized network.

**Options:**

- **A.** Deploy a Cloud NAT gateway in the VPC and configure the Cloud Run service to route outbound traffic through the NAT to reach the Memorystore private IP.
- **B.** Configure the Cloud Run service with Direct VPC egress by specifying the VPC network and subnet that has access to the Memorystore instance's authorized network. — _correct answer_
- **C.** Enable public IP access on the Memorystore instance and configure Cloud Run to connect using the public endpoint with AUTH authentication enabled.
- **D.** Create a Serverless VPC Access connector in the same region and attach it to the Cloud Run service to route traffic to the Memorystore instance through the connector.

## Question 38

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your Cloud Run service for a canary test. You want to deploy the new revision without serving any production traffic and test it at a unique URL before gradually rolling it out to users. What should you do?

**Correct answer:** B. Deploy the revision using gcloud run deploy with the --no-traffic and --tag flags to create a tagged revision with 0% traffic, then access the revision using the tag-specific URL.

**Options:**

- **A.** Deploy the revision using gcloud run deploy with the --ingress=internal flag to restrict the new revision to internal traffic only during testing.
- **B.** Deploy the revision using gcloud run deploy with the --no-traffic and --tag flags to create a tagged revision with 0% traffic, then access the revision using the tag-specific URL. — _correct answer_
- **C.** Deploy the revision to a separate staging project, then use VPC peering to route test traffic from production to the staging service.
- **D.** Deploy the revision using gcloud run deploy with the --min-instances=0 flag to prevent the revision from serving any traffic until minimum instances are increased.

## Question 39

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization requires that Cloud Monitoring alerts for production GKE workloads be sent to multiple destinations for redundancy, including email, Slack, and a Pub/Sub topic for automated remediation. How should you configure the notification channels?

**Correct answer:** D. Create three separate notification channels in Cloud Monitoring: one for email, one for Slack, and one for Pub/Sub. When creating the alerting policy, add all three notification channels to ensure alerts are sent to all destinations simultaneously.

**Options:**

- **A.** Create a single Pub/Sub notification channel and deploy Cloud Run functions to forward messages from Pub/Sub to email and Slack. This provides a centralized approach for managing all notification destinations.
- **B.** Create a webhook notification channel that points to your custom endpoint. Deploy an application that receives webhook calls and distributes notifications to email, Slack, and Pub/Sub.
- **C.** Create an email notification channel and configure email forwarding rules at the recipient's mail server to route copies to Slack and Pub/Sub integration endpoints.
- **D.** Create three separate notification channels in Cloud Monitoring: one for email, one for Slack, and one for Pub/Sub. When creating the alerting policy, add all three notification channels to ensure alerts are sent to all destinations simultaneously. — _correct answer_

## Question 40

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company uses a centralized observability project where logs from multiple projects are routed via aggregated sinks. You need to create log-based metrics that analyze the combined logs from all source projects in the centralized bucket. The metrics should be visible to the observability team but not require changes to individual source projects. What should you do?

**Correct answer:** B. Create bucket-scoped log-based metrics in the project that contains the centralized log bucket. Define the metrics to evaluate all log entries routed to that bucket.

**Options:**

- **A.** Create project-scoped log-based metrics in each source project and aggregate them in Cloud Monitoring using metrics scopes.
- **B.** Create bucket-scoped log-based metrics in the project that contains the centralized log bucket. Define the metrics to evaluate all log entries routed to that bucket. — _correct answer_
- **C.** Export the centralized logs to BigQuery using a sink and create custom queries to generate metrics and dashboards for analysis.
- **D.** Create log-based metrics at the organization level that filter logs from all child resources and count entries based on the specified filters.

## Question 41

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are troubleshooting a Cloud Bigtable table that exhibits poor read and write performance. After examining Key Visualizer, you observe bright horizontal bands indicating hotspots on specific row key ranges during peak hours. The row keys use sequentially assigned numeric user IDs (e.g., 1, 2, 3...). What is the most effective solution to resolve this issue?

**Correct answer:** A. Reverse the numeric user IDs in the row key to distribute traffic more evenly across the cluster nodes.

**Options:**

- **A.** Reverse the numeric user IDs in the row key to distribute traffic more evenly across the cluster nodes. — _correct answer_
- **B.** Enable autoscaling to automatically add nodes during peak traffic periods.
- **C.** Increase the number of column families to distribute the data across more tablets.
- **D.** Configure garbage collection policies to automatically delete old user data and reduce table size.

## Question 42

**Domain:** Deploying applications

**Question:** You need to deploy an application to a specific namespace called 'production' in your GKE cluster. The deployment manifest does not include a namespace specification. You want to ensure the deployment is created in the correct namespace without modifying the YAML file. Which approach should you use?

**Correct answer:** B. Run kubectl apply -f deployment.yaml -n production to specify the target namespace at deployment time.

**Options:**

- **A.** Run kubectl apply -f deployment.yaml --context=production to deploy to the production context.
- **B.** Run kubectl apply -f deployment.yaml -n production to specify the target namespace at deployment time. — _correct answer_
- **C.** Run kubectl config set-context --current --namespace=production before applying the manifest to change the cluster's default namespace permanently.
- **D.** Run kubectl create namespace production && kubectl apply -f deployment.yaml to create the namespace and deploy in a single operation.

## Question 43

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying a microservices application on Cloud Run that requires access to API keys stored in Secret Manager. The application is critical and must not experience outages due to problematic secret updates. Following Google-recommended best practices, how should your application reference the secrets?

**Correct answer:** D. Reference secrets by their specific version number and deploy updates to version numbers using your existing release processes.

**Options:**

- **A.** Reference secrets using a custom alias named 'production' and update the alias each time a new secret version is added.
- **B.** Reference secrets using the 'latest' alias to ensure the application always uses the most current secret value without requiring redeployments.
- **C.** Store the secret value in Cloud Storage and reference it at runtime to avoid any dependency on Secret Manager versioning.
- **D.** Reference secrets by their specific version number and deploy updates to version numbers using your existing release processes. — _correct answer_

## Question 44

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is implementing VPC Service Controls and needs to allow developers to access protected BigQuery datasets from their corporate laptops while working remotely. The developers use Chrome browsers with Endpoint Verification installed. You need to configure the perimeter to allow this access pattern while maintaining security. What should you do?

**Correct answer:** C. Create an access level using device attributes from Endpoint Verification and configure an ingress rule that allows access for user identities matching the access level criteria.

**Options:**

- **A.** Configure the service perimeter to allow all traffic from the corporate VPN IP range by adding the IP addresses to the perimeter's allowed networks list.
- **B.** Enable Identity-Aware Proxy for the BigQuery service and configure it to allow access only from verified devices registered in the organization's device inventory.
- **C.** Create an access level using device attributes from Endpoint Verification and configure an ingress rule that allows access for user identities matching the access level criteria. — _correct answer_
- **D.** Grant developers the BigQuery Data Viewer IAM role and configure the perimeter with VPC accessible services set to allow BigQuery from all authenticated users.

## Question 45

**Domain:** Deploying applications

**Question:** Your Cloud Run service requires access to an API key that is frequently rotated. You want to ensure that the service can seamlessly pick up new secret values when they are updated without requiring a service redeployment. How should you configure the secret access method?

**Correct answer:** A. Mount the secret as a volume in Cloud Run and configure your application to read the secret from the mounted file at runtime. Use the 'latest' version alias.

**Options:**

- **A.** Mount the secret as a volume in Cloud Run and configure your application to read the secret from the mounted file at runtime. Use the 'latest' version alias. — _correct answer_
- **B.** Expose the secret as an environment variable in Cloud Run and configure your application to read it using os.getenv(). Use the 'latest' version alias.
- **C.** Use the Secret Manager client library in your application code to fetch the secret directly from the Secret Manager API at startup.
- **D.** Configure Cloud Scheduler to trigger a Cloud Run service revision update whenever a new secret version is created.

## Question 46

**Domain:** Building and testing applications

**Question:** You are developing a containerized Python application using VS Code with Cloud Code. You need to debug your application locally using the Cloud Run emulator and ensure that breakpoints are hit when requests are processed. Your team wants the application to automatically rebuild when source files change. What should you configure?

**Correct answer:** A. Configure a .vscode/launch.json file with type cloudcode.cloudrun, set the watch flag to true, and run the Debug on Cloud Run Emulator command from the command palette.

**Options:**

- **A.** Configure a .vscode/launch.json file with type cloudcode.cloudrun, set the watch flag to true, and run the Debug on Cloud Run Emulator command from the command palette. — _correct answer_
- **B.** Install the ptvsd module in your container, add breakpoint() statements in your code, and run the container with docker run in detached mode while connecting VS Code's debugger manually.
- **C.** Create a skaffold.yaml file with debug profiles, run skaffold debug from the terminal, and configure VS Code's native Python debugger to attach to the container on port 9229.
- **D.** Configure a Dockerfile with EXPOSE directives for debug ports, manually start a Python debugger on port 5005, and run the container using Docker Compose with debug flags.

## Question 47

**Domain:** Building and testing applications

**Question:** You are building a new microservices application that uses Cloud Endpoints with ESPv2. Your services need to propagate trace context to enable distributed tracing across multiple services in Cloud Trace. Which header format should you use for trace context propagation?

**Correct answer:** A. Use the W3C traceparent header, which is supported by most modern tracing frameworks and is automatically extracted and propagated by ESPv2.

**Options:**

- **A.** Use the W3C traceparent header, which is supported by most modern tracing frameworks and is automatically extracted and propagated by ESPv2. — _correct answer_
- **B.** Use the X-Cloud-Trace-Context header, which is the only format supported by Google Cloud services for trace propagation.
- **C.** Use both traceparent and X-Cloud-Trace-Context headers together to ensure backward compatibility across all services.
- **D.** Use the grpc-trace-bin header, which provides the most efficient binary encoding for trace context in HTTP requests.

## Question 48

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to use multiple secrets from Secret Manager. You want to mount a database configuration file secret at '/app/config/db.json'. Which gcloud command correctly configures this secret as a mounted volume?

**Correct answer:** A. gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=/app/config/db.json=db-config-secret:latest

**Options:**

- **A.** gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=/app/config/db.json=db-config-secret:latest — _correct answer_
- **B.** gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=DB_CONFIG=db-config-secret:latest
- **C.** gcloud run deploy my-service --image gcr.io/my-project/my-image --mount-secret=/app/config/db.json:db-config-secret:latest
- **D.** gcloud run deploy my-service --image gcr.io/my-project/my-image --set-env-vars DB_CONFIG=db-config-secret:latest

## Question 49

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a REST API on Cloud Run that processes complex financial calculations. The application is single-threaded and requires 8 GB of memory, which necessitates configuring 4 vCPUs. During load testing, you notice the service is not scaling out properly even when response times increase significantly. You need to ensure the service scales appropriately while minimizing changes to your application code. What should you do?

**Correct answer:** C. Lower the maximum concurrency setting to encourage scaling based on request throughput rather than CPU utilization.

**Options:**

- **A.** Switch to instance-based billing to ensure CPU is always allocated and improve the autoscaler's CPU utilization measurements.
- **B.** Increase the maximum number of instances setting to allow more instances to be created during high load.
- **C.** Lower the maximum concurrency setting to encourage scaling based on request throughput rather than CPU utilization. — _correct answer_
- **D.** Enable startup CPU boost to provide additional CPU resources during instance initialization and improve scaling behavior.

## Question 50

**Domain:** Deploying applications

**Question:** You are developing a secure application on GKE that processes financial transactions. Security requirements mandate that Kubernetes Secrets must be encrypted with customer-managed encryption keys. The encryption keys must be stored and managed in Cloud KMS. You need to configure your GKE cluster to meet these requirements. What should you do?

**Correct answer:** C. Enable application-layer secrets encryption on the GKE cluster and specify a Cloud KMS key for encrypting Secrets at the application layer.

**Options:**

- **A.** Create a custom encryption provider configuration and deploy it as a DaemonSet on all GKE nodes to encrypt Secrets before storing them in etcd.
- **B.** Store all sensitive data in Secret Manager instead of Kubernetes Secrets and access them using the Secret Manager API in your application code.
- **C.** Enable application-layer secrets encryption on the GKE cluster and specify a Cloud KMS key for encrypting Secrets at the application layer. — _correct answer_
- **D.** Enable Workload Identity and configure each Pod to use a service account with Cloud KMS encrypt/decrypt permissions to manually encrypt Secret values before creating them.

## Question 51

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a mobile application that uses Firestore with offline persistence enabled. Users report that sometimes they see stale data after coming back online. You need to implement a way for users to know whether the data they are viewing came from the local cache or the server. What should you do?

**Correct answer:** A. Enable includeMetadataChanges in the snapshot listener options and check the snapshot.metadata.fromCache property to display a visual indicator when data is from the local cache.

**Options:**

- **A.** Enable includeMetadataChanges in the snapshot listener options and check the snapshot.metadata.fromCache property to display a visual indicator when data is from the local cache. — _correct answer_
- **B.** Implement a network connectivity check before each Firestore query and display a warning message when the device is offline to indicate that cached data may be shown.
- **C.** Disable offline persistence by setting persistenceEnabled to false, ensuring that all data is always fetched from the server to avoid showing stale data.
- **D.** Check the hasPendingWrites property on each document snapshot to determine if data was retrieved from the server, displaying a synced indicator when the value is false.

## Question 52

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are migrating an application to Google Cloud that currently stores database passwords in environment variables. The application runs on GKE and you want to implement a secure secrets management strategy using Secret Manager. You also need to ensure that when secrets are updated in Secret Manager, the running pods receive the new values without requiring a manual pod restart. What should you do?

**Correct answer:** D. Enable the Secret Manager add-on for GKE and configure automatic rotation of secrets so that updated secrets are periodically pushed to pods without requiring restarts.

**Options:**

- **A.** Configure your application to call the Secret Manager API on every database connection request to ensure it always uses the latest secret value from Secret Manager.
- **B.** Mount secrets as environment variables in your pod specification and configure a sidecar container to watch for secret changes and restart the main container when updates are detected.
- **C.** Store secrets in Kubernetes Secrets and use the External Secrets Operator to synchronize from Secret Manager, then configure your pods to restart when the Kubernetes Secret changes.
- **D.** Enable the Secret Manager add-on for GKE and configure automatic rotation of secrets so that updated secrets are periodically pushed to pods without requiring restarts. — _correct answer_

## Question 53

**Domain:** Deploying applications

**Question:** You deployed an application on GKE and exposed it using an external Ingress. Health checks are failing with the error message 'all backends are unhealthy'. You verified that your Pods are running and responding to requests within the cluster. What is the most likely cause of this issue?

**Correct answer:** C. Firewall rules are not configured to allow health check traffic from Google Cloud load balancer probe IP ranges (130.211.0.0/22 and 35.191.0.0/16) to your backend Pods.

**Options:**

- **A.** The Service type is incorrectly set to ClusterIP instead of NodePort, preventing the Ingress from routing external traffic to the application.
- **B.** The Ingress resource is misconfigured and using the wrong annotation kubernetes.io/ingress.class which causes it to create an internal load balancer instead of external.
- **C.** Firewall rules are not configured to allow health check traffic from Google Cloud load balancer probe IP ranges (130.211.0.0/22 and 35.191.0.0/16) to your backend Pods. — _correct answer_
- **D.** The Kubernetes readiness probe timeout is set too low, causing the load balancer health checks to fail due to probe parameter mismatch.

## Question 54

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your payment processing Cloud Run service. Your team needs to test the new revision in production without exposing it to any customer traffic. After verification, you plan to gradually shift traffic to the new revision. What is the recommended approach?

**Correct answer:** A. Deploy the new container using 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary' and test the revision using the unique URL generated from the tag before migrating traffic.

**Options:**

- **A.** Deploy the new container using 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary' and test the revision using the unique URL generated from the tag before migrating traffic. — _correct answer_
- **B.** Deploy the new container to a separate staging project, run all tests there, then redeploy the same container to production with 'gcloud run deploy myservice --image IMAGE_URL'.
- **C.** Deploy the new container using 'gcloud run deploy myservice --image IMAGE_URL' then immediately run 'gcloud run services update-traffic myservice --to-revisions LATEST=0'.
- **D.** Create a new Cloud Run service named 'myservice-canary' with the new container, test it, then delete the service and deploy to the original service.

## Question 55

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your e-commerce application uses Cloud Firestore to manage inventory. Multiple instances of your backend service concurrently process orders and update the same inventory documents. Users report occasional errors with the message 'ABORTED: Too much contention on these documents.' What should you do to resolve this issue while maintaining data consistency?

**Correct answer:** B. Reduce the write rate to individual documents by distributing inventory counts across multiple sharded subcounter documents that are periodically aggregated.

**Options:**

- **A.** Switch from server client libraries to mobile SDKs which use optimistic concurrency controls that handle contention more efficiently.
- **B.** Reduce the write rate to individual documents by distributing inventory counts across multiple sharded subcounter documents that are periodically aggregated. — _correct answer_
- **C.** Increase the transaction retry count in your application to allow more attempts before failing when contention is detected.
- **D.** Configure the Firestore database to use OPTIMISTIC concurrency mode instead of the default PESSIMISTIC mode to reduce lock contention.

## Question 56

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks queue is sending HTTP tasks to a Cloud Run service. During peak traffic, your service occasionally returns HTTP 429 (Too Many Requests) responses. You want Cloud Tasks to use a more aggressive backoff strategy when receiving these responses. What behavior should you expect from Cloud Tasks?

**Correct answer:** B. Cloud Tasks will automatically use a higher backoff rate when the worker returns HTTP 429, without requiring any configuration changes.

**Options:**

- **A.** Cloud Tasks will delete the task after receiving an HTTP 429 response since rate limiting errors are considered permanent failures.
- **B.** Cloud Tasks will automatically use a higher backoff rate when the worker returns HTTP 429, without requiring any configuration changes. — _correct answer_
- **C.** Cloud Tasks will immediately retry without any backoff when receiving HTTP 429 responses since they indicate temporary rate limiting.
- **D.** You must configure a custom retry policy with exponential backoff parameters to handle HTTP 429 responses specifically.

## Question 57

**Domain:** Building and testing applications

**Question:** You are developing a Python application locally that uses Cloud Client Libraries to interact with Cloud Storage. You need to configure Application Default Credentials (ADC) to authenticate your application during development. You want to use the simplest and most secure method. What should you do?

**Correct answer:** A. Run 'gcloud auth application-default login' to create a local credential file that ADC will automatically discover.

**Options:**

- **A.** Run 'gcloud auth application-default login' to create a local credential file that ADC will automatically discover. — _correct answer_
- **B.** Install the Cloud SDK and run 'gcloud init' to configure your project and credentials for application use.
- **C.** Create a service account key, download the JSON file, and set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to it.
- **D.** Run 'gcloud auth login' to authenticate the gcloud CLI and use those credentials in your application.

## Question 58

**Domain:** Building and testing applications

**Question:** You have a Cloud Build pipeline that builds container images and pushes them to Artifact Registry. Your team wants to use the same cloudbuild.yaml configuration file across development, staging, and production environments, each with its own Artifact Registry repository. What is the recommended approach to achieve this?

**Correct answer:** C. Use Cloud Build substitution variables in your cloudbuild.yaml file for the repository location and name. Specify the environment-specific values using the --substitutions flag when triggering builds.

**Options:**

- **A.** Use Artifact Registry virtual repositories to create a single endpoint that routes images to the appropriate repository based on image tags that identify the environment.
- **B.** Store the environment configuration in Cloud Storage and add a build step to download and parse the configuration file to determine the target repository dynamically.
- **C.** Use Cloud Build substitution variables in your cloudbuild.yaml file for the repository location and name. Specify the environment-specific values using the --substitutions flag when triggering builds. — _correct answer_
- **D.** Create separate cloudbuild.yaml files for each environment (cloudbuild-dev.yaml, cloudbuild-staging.yaml, cloudbuild-prod.yaml) with hardcoded repository paths specific to each environment.

## Question 59

**Domain:** Deploying applications

**Question:** You need to monitor the health of your GKE workloads including tracking the state of Deployments, Pods, and StatefulSets. You want to view metrics like Pod phase status and replica counts in Cloud Monitoring dashboards without deploying additional components. What should you enable on your GKE cluster?

**Correct answer:** C. Enable kube state metrics collection in the cluster's observability configuration.

**Options:**

- **A.** Create log-based metrics from Kubernetes events to track object states in Cloud Logging.
- **B.** Deploy a custom Prometheus server with kube-state-metrics and configure it to scrape your cluster.
- **C.** Enable kube state metrics collection in the cluster's observability configuration. — _correct answer_
- **D.** Enable system metrics collection and view the default container CPU and memory metrics.

## Question 60

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a banking application on Cloud Run that uses Cloud Firestore. When a user transfers money between accounts, the application must debit one account and credit another atomically. Multiple users may transfer money simultaneously, and some users report occasional transaction failures with error messages about contention. How should you optimize the transaction pattern to reduce contention while ensuring data consistency?

**Correct answer:** A. Use read-write transactions with pessimistic concurrency, minimize the documents read within the transaction, and prepare all data before starting the transaction.

**Options:**

- **A.** Use read-write transactions with pessimistic concurrency, minimize the documents read within the transaction, and prepare all data before starting the transaction. — _correct answer_
- **B.** Use batched writes instead of transactions to update both accounts atomically without locking documents.
- **C.** Use read-only transactions with optimistic concurrency to read both accounts, then perform separate write operations outside the transaction.
- **D.** Increase the transaction timeout to 270 seconds to allow more time for acquiring locks on busy accounts.

## Question 61

**Domain:** Deploying applications

**Question:** Your development team uses Cloud Build to build container images for deployment to GKE. Your security team requires build provenance metadata that meets SLSA level 3 requirements to be generated for all production container images. When reviewing recent builds, you notice that provenance is not being generated. What should you do to ensure provenance is generated for your container images?

**Correct answer:** D. Add the images field to your cloudbuild.yaml file to specify the built images, and ensure images are stored in Artifact Registry.

**Options:**

- **A.** Enable the Cloud Audit Logs API and configure Cloud Build to write provenance data to Cloud Logging.
- **B.** Configure Container Registry to receive the images and enable vulnerability scanning on the registry.
- **C.** Add a docker push step in your cloudbuild.yaml file to manually push images to Artifact Registry without using the images field.
- **D.** Add the images field to your cloudbuild.yaml file to specify the built images, and ensure images are stored in Artifact Registry. — _correct answer_

## Question 62

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an e-commerce application on Cloud Run. The application logs HTTP response times in a JSON format with a field named 'latency_ms'. You need to track the distribution of latency values across different percentiles and create alerting policies when latency exceeds acceptable thresholds. What should you do?

**Correct answer:** B. Create a distribution log-based metric in Cloud Logging with a filter for your application logs. Configure the value extractor to extract the latency_ms field. Create a Cloud Monitoring alerting policy based on the distribution metric.

**Options:**

- **A.** Configure Cloud Trace to capture latency spans for all requests and create alerting policies in Cloud Trace to monitor percentile latency values.
- **B.** Create a distribution log-based metric in Cloud Logging with a filter for your application logs. Configure the value extractor to extract the latency_ms field. Create a Cloud Monitoring alerting policy based on the distribution metric. — _correct answer_
- **C.** Create a counter log-based metric that increments when latency exceeds the threshold. Use the counter metric to create a Cloud Monitoring alerting policy to notify when the count increases.
- **D.** Export logs to BigQuery using a log sink and run scheduled queries to calculate latency percentiles. Configure BigQuery alerts to send notifications when thresholds are exceeded.

## Question 63

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization stores sensitive API keys in Secret Manager. Due to a security incident, your team suspects that a secret version may have been compromised. You need to immediately prevent applications from using this version while preserving the ability to investigate and potentially restore it if the suspicion proves unfounded. What action should you take?

**Correct answer:** B. Disable the suspected secret version in Secret Manager.

**Options:**

- **A.** Delete the entire secret resource from Secret Manager.
- **B.** Disable the suspected secret version in Secret Manager. — _correct answer_
- **C.** Revoke IAM permissions for all service accounts that access the secret.
- **D.** Destroy the suspected secret version in Secret Manager immediately.

## Question 64

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team manages multiple microservices using Cloud Endpoints with the Extensible Service Proxy (ESP). You want to monitor API performance and set up alerting for latency issues. You also need to track request counts per consumer project. What should you do?

**Correct answer:** D. Configure API consumers to include API keys in their requests. Use Cloud Monitoring to access serviceruntime metrics, which include latency, traffic, and errors. Filter by consumer project number to view per-project metrics.

**Options:**

- **A.** Export ESP logs to BigQuery and create scheduled queries to calculate latency percentiles and request counts. Build a Data Studio dashboard for visualization and set up alerts using Cloud Scheduler.
- **B.** Enable Cloud Trace on all microservices and configure ESP to sample 100% of requests. Use the Trace interface to analyze latency percentiles and set up alerting based on trace data.
- **C.** Install the Cloud Monitoring agent on all backend instances and configure custom metrics to capture API latency and request counts per consumer at the application level.
- **D.** Configure API consumers to include API keys in their requests. Use Cloud Monitoring to access serviceruntime metrics, which include latency, traffic, and errors. Filter by consumer project number to view per-project metrics. — _correct answer_

## Question 65

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a banking application on Cloud Firestore that transfers funds between accounts. The operation must read the source account balance, verify sufficient funds, then update both source and destination account balances atomically. Multiple users may initiate transfers from the same account simultaneously. What approach should you use?

**Correct answer:** A. Use a Firestore transaction to read the source account, validate the balance, and update both accounts within a single atomic operation.

**Options:**

- **A.** Use a Firestore transaction to read the source account, validate the balance, and update both accounts within a single atomic operation. — _correct answer_
- **B.** Read the source account balance first, then use individual write operations to update both accounts separately.
- **C.** Use FieldValue.increment() to atomically decrement and increment the account balances without reading current values.
- **D.** Use a batched write to update both account documents simultaneously with the balance changes.

## Question 66

**Domain:** Building and testing applications

**Question:** You are configuring Cloud Code in IntelliJ to debug a Node.js containerized application running on Kubernetes. After starting a debug session, your breakpoints are not being hit even though the code paths should be executed. You need to resolve this issue. What should you do?

**Correct answer:** B. Configure the source mapping in the Debug tab of the Run configuration to map local source paths to remote container paths.

**Options:**

- **A.** Install the Node.js debugging extension separately in IntelliJ and configure it to connect to port 9229 on the container.
- **B.** Configure the source mapping in the Debug tab of the Run configuration to map local source paths to remote container paths. — _correct answer_
- **C.** Add a debugger statement to your Node.js code and rebuild the container to force the debugger to pause execution.
- **D.** Modify your Dockerfile to include the --inspect flag in the Node.js startup command and expose port 9229.

## Question 67

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a collaborative document editing application using Firestore as the backend. When users make local edits, you need to provide instant feedback while distinguishing between changes that have been saved to the server and changes still awaiting synchronization. How should you implement this functionality using Firestore client libraries?

**Correct answer:** C. Use the metadata.hasPendingWrites property on the document snapshot within your snapshot listener callback to determine whether local changes have been written to the backend.

**Options:**

- **A.** Use the metadata.fromCache property exclusively to detect if data originates from a local write operation versus server-confirmed data.
- **B.** Implement a custom synchronization layer that tracks all pending writes separately and compares them against server responses before updating the UI.
- **C.** Use the metadata.hasPendingWrites property on the document snapshot within your snapshot listener callback to determine whether local changes have been written to the backend. — _correct answer_
- **D.** Disable offline persistence and require network connectivity to ensure all changes are immediately confirmed by the server before updating the UI.

## Question 68

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company wants to protect a Cloud Run service with Identity-Aware Proxy (IAP). The service should be accessible only to employees with the required IAM role, and all traffic paths including the default run.app URL must be protected. What is the recommended approach?

**Correct answer:** A. Enable IAP directly on the Cloud Run service using the --iap flag during deployment, and grant the IAP service agent the Cloud Run Invoker role.

**Options:**

- **A.** Enable IAP directly on the Cloud Run service using the --iap flag during deployment, and grant the IAP service agent the Cloud Run Invoker role. — _correct answer_
- **B.** Enable IAP on both the load balancer and directly on the Cloud Run service to ensure comprehensive protection of all traffic paths.
- **C.** Deploy the Cloud Run service with ingress set to 'internal-only' and configure employees to access it through Cloud VPN with their Google identities.
- **D.** Configure a global external HTTP(S) load balancer with the Cloud Run service as the backend, enable IAP on the load balancer, and leave the run.app URL accessible.

## Question 69

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a production application on Cloud Run that retrieves API keys from Secret Manager. Your organization requires a robust deployment strategy that allows for controlled rollouts and rollbacks if a problematic secret value is deployed. What should you do when configuring how your application references secrets?

**Correct answer:** A. Reference secrets by their version number and deploy updates to version numbers using your existing release processes.

**Options:**

- **A.** Reference secrets by their version number and deploy updates to version numbers using your existing release processes. — _correct answer_
- **B.** Configure the application to always use the 'latest' alias to automatically receive updated secrets without redeployment.
- **C.** Create separate secrets for each deployment version and delete older secrets after successful deployment.
- **D.** Store the secret value as a plaintext environment variable in the Cloud Run service configuration for faster access.

## Question 70

**Domain:** Building and testing applications

**Question:** You are using Cloud Code for VS Code to debug a multi-container Kubernetes application. When you select 'Debug on Kubernetes', you want Cloud Code to automatically attach debuggers to all debuggable containers. What does Cloud Code automatically handle during this process?

**Correct answer:** D. Port forwarding the debug port, attaching debuggers to each container whose language is supported, and persisting source mapping definitions.

**Options:**

- **A.** Modifying application source code to include debug symbols, updating container images with debug agents, and configuring network policies.
- **B.** Creating debug-specific Kubernetes manifests, enabling verbose logging on all containers, and suspending pod autoscaling.
- **C.** Generating Dockerfile debug configurations, creating Kubernetes debug namespaces, and managing container restart policies.
- **D.** Port forwarding the debug port, attaching debuggers to each container whose language is supported, and persisting source mapping definitions. — _correct answer_

## Question 71

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your analytics team needs to query time-series data stored in Cloud Bigtable. The data consists of weather measurements recorded every minute from 10,000 sensors. Most queries retrieve all measurements for a specific sensor over a one-week period. You want to optimize read performance and storage efficiency. Which schema design pattern should you use?

**Correct answer:** B. Use a time bucket pattern where each row contains data for one sensor for one week, with the row key format sensorId#weekNumber and measurements stored in columns within the row.

**Options:**

- **A.** Store all measurements for each sensor in a single row regardless of time period, using timestamps as column qualifiers to maximize read efficiency.
- **B.** Use a time bucket pattern where each row contains data for one sensor for one week, with the row key format sensorId#weekNumber and measurements stored in columns within the row. — _correct answer_
- **C.** Use a tall and narrow pattern where each row contains a single measurement with the row key format sensorId#timestamp, creating one row per sensor reading.
- **D.** Use timestamp#sensorId as the row key to enable efficient time-based queries across all sensors simultaneously.

## Question 72

**Domain:** Deploying applications

**Question:** You are deploying a web application to a GKE cluster using kubectl. The application requires 250m CPU and 512Mi of memory to function properly. During peak traffic, the application may need up to 1 CPU core but should never exceed 1Gi of memory to prevent node instability. You want to follow Google Cloud best practices for resource configuration. How should you configure the resources in your Deployment manifest?

**Correct answer:** D. Set CPU request to 250m with no CPU limit, and set both memory request and limit to 512Mi.

**Options:**

- **A.** Set both CPU request and limit to 1000m, and set both memory request and limit to 1Gi to ensure guaranteed QoS class.
- **B.** Set CPU request to 250m with limit of 1000m, and set memory request to 512Mi with limit of 1Gi.
- **C.** Set no resource requests or limits and rely on GKE Autopilot to automatically determine the appropriate resource values.
- **D.** Set CPU request to 250m with no CPU limit, and set both memory request and limit to 512Mi. — _correct answer_

## Question 73

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying a new Cloud Run API service that connects to a Cloud SQL database. The database can handle a maximum of 100 concurrent connections. Each Cloud Run instance opens 5 database connections. You need to configure Cloud Run to prevent exceeding the database connection limit while maintaining high availability. What should you do?

**Correct answer:** B. Set the maximum instances limit to 20 to ensure the total database connections do not exceed 100.

**Options:**

- **A.** Set minimum instances to 20 and disable autoscaling to maintain a fixed number of database connections.
- **B.** Set the maximum instances limit to 20 to ensure the total database connections do not exceed 100. — _correct answer_
- **C.** Set the maximum concurrency to 20 requests per instance to limit the total number of database connections.
- **D.** Configure instance-based billing and set the request timeout to 30 seconds to limit connection duration.

## Question 74

**Domain:** Building and testing applications

**Question:** Your team is developing a Go application using Cloud Build. The current Docker build takes 15 minutes because it downloads dependencies every time the build runs. You want to optimize the build time while ensuring the dependency cache refreshes at least once per day. What should you do?

**Correct answer:** D. Use the Kaniko executor with the --cache=true and --cache-ttl=24h flags in your Cloud Build configuration to cache intermediate layers.

**Options:**

- **A.** Enable Cloud Build's native layer caching by adding the --layer-cache flag in the build config file's options section.
- **B.** Store the Go modules in Cloud Storage and download them in a separate build step before the Docker build to persist dependencies across builds.
- **C.** Configure the --cache-from flag in the docker build command to pull the previous image from Artifact Registry and use it as a cache source.
- **D.** Use the Kaniko executor with the --cache=true and --cache-ttl=24h flags in your Cloud Build configuration to cache intermediate layers. — _correct answer_

## Question 75

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying an internal web application on Compute Engine instances behind a global external HTTP(S) load balancer. You need to restrict access to the application so that only authenticated employees can access it, without requiring a VPN. Users should be able to access the application from any location using their corporate Google accounts. What should you do?

**Correct answer:** A. Enable Identity-Aware Proxy on the load balancer backend service. Grant the IAP-secured Web App User role to employees who require access to the application.

**Options:**

- **A.** Enable Identity-Aware Proxy on the load balancer backend service. Grant the IAP-secured Web App User role to employees who require access to the application. — _correct answer_
- **B.** Enable Identity-Aware Proxy on each Compute Engine instance individually. Configure signed URLs for temporary access to the application endpoints.
- **C.** Configure a Cloud VPN connection and restrict access using firewall rules based on the VPN IP ranges. Allow employees to connect through VPN to access the application.
- **D.** Grant the Compute Viewer IAM role to all employees at the project level. Configure the load balancer to verify IAM permissions on each request before forwarding to the backend.

## Question 76

**Domain:** Integrating applications with Google Cloud services

**Question:** Your mobile application uses Firestore snapshot listeners to display live inventory data to warehouse workers. Workers report that when they briefly lose internet connectivity, the app stops showing any inventory updates. You want the app to continue displaying cached data and automatically resume real-time updates when connectivity is restored. What should you do?

**Correct answer:** C. Enable offline persistence and ensure snapshot listeners are used instead of one-shot get() queries to receive updates from the local cache while offline.

**Options:**

- **A.** Switch from snapshot listeners to one-shot queries with manual caching logic to store the last known state in SharedPreferences.
- **B.** Implement a background service that periodically polls the Firestore REST API and stores results in a local SQLite database for offline access.
- **C.** Enable offline persistence and ensure snapshot listeners are used instead of one-shot get() queries to receive updates from the local cache while offline. — _correct answer_
- **D.** Configure the Firestore client to use aggressive retry logic with a custom backoff algorithm to maintain connectivity during network interruptions.

## Question 77

**Domain:** Deploying applications

**Question:** You need to deploy a Cloud Run service that connects to a Cloud SQL instance with a private IP in your VPC network. You want to implement the most cost-effective networking solution that also provides the best performance. Which approach should you use?

**Correct answer:** C. Configure Direct VPC egress for the Cloud Run service by specifying the VPC network and subnet, then set the egress to private-ranges-only.

**Options:**

- **A.** Use the Cloud SQL Auth Proxy as a sidecar container in the Cloud Run service without any VPC configuration.
- **B.** Create a Serverless VPC Access connector with f1-micro instances and configure the Cloud Run service to use it with private-ranges-only egress.
- **C.** Configure Direct VPC egress for the Cloud Run service by specifying the VPC network and subnet, then set the egress to private-ranges-only. — _correct answer_
- **D.** Configure Direct VPC egress with the --vpc-egress=all-traffic flag to ensure all database connections route through the VPC.

## Question 78

**Domain:** Building and testing applications

**Question:** You are configuring a CI/CD pipeline using Cloud Build for your microservices application. Your integration tests require a database container to be running before they can execute. The test step should only run after the database container is healthy. How should you configure your cloudbuild.yaml file to ensure the integration tests run only after the database is ready?

**Correct answer:** B. Use the waitFor field in the integration test step to specify a dependency on the database container step's id, and include a health check step between the database and test steps.

**Options:**

- **A.** Remove the database container step and configure the integration tests to mock all database interactions instead.
- **B.** Use the waitFor field in the integration test step to specify a dependency on the database container step's id, and include a health check step between the database and test steps. — _correct answer_
- **C.** Configure both steps with waitFor: ['-'] to run them concurrently, and set a longer timeout on the integration test step to account for database startup time.
- **D.** Add a sleep command to the integration test step script to wait for the database container before running tests.

## Question 79

**Domain:** Integrating applications with Google Cloud services

**Question:** Your data analytics application queries Cloud Storage to list objects and retrieve their metadata. Each API response returns the full object resource representation, causing high network bandwidth consumption. You want to optimize bandwidth usage when listing objects. What should you do?

**Correct answer:** B. Add the fields query parameter to your API requests specifying only the required properties such as name and size, receiving a partial response.

**Options:**

- **A.** Use the projection=noAcl parameter to exclude ACL information and reduce response size for all list operations.
- **B.** Add the fields query parameter to your API requests specifying only the required properties such as name and size, receiving a partial response. — _correct answer_
- **C.** Enable gzip compression on your API requests by setting the Accept-Encoding header to reduce the response payload size.
- **D.** Configure Cloud CDN in front of Cloud Storage to cache and compress API responses for repeated queries.

## Question 80

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a social media application that stores user posts in a Cloud Firestore collection named 'posts'. Each post document contains the fields 'authorId', 'timestamp', and 'category'. Your application needs to query posts by a specific author sorted by timestamp in descending order. When you test the query, you receive an error. What should you do to resolve this?

**Correct answer:** B. Create a composite index on the 'posts' collection with fields 'authorId' (ascending) and 'timestamp' (descending).

**Options:**

- **A.** Configure the Firestore database to enable index merging for the 'posts' collection.
- **B.** Create a composite index on the 'posts' collection with fields 'authorId' (ascending) and 'timestamp' (descending). — _correct answer_
- **C.** Add the timestamp field to the document as a nested map to leverage the automatic single-field indexing for subfields.
- **D.** Create a single-field index exemption for the 'authorId' field and enable collection group scope.

## Question 81

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying an application on a GKE Standard cluster that needs to access BigQuery. You have enabled Workload Identity Federation for GKE on the cluster. Your application fails to authenticate during startup with timeout errors when calling Google Cloud APIs. After a few retry attempts, the application works correctly. You want to resolve this issue without modifying application code. What should you do?

**Correct answer:** D. Deploy an initContainer that waits until the GKE metadata server is ready before running the main application container.

**Options:**

- **A.** Create a Kubernetes Secret containing the Google service account key and mount it in your application pod as a fallback authentication method.
- **B.** Disable Workload Identity Federation on the node pool and use the node's service account for authentication instead of pod-level authentication.
- **C.** Increase the CPU and memory resource limits for the gke-metadata-server DaemonSet pods running in the kube-system namespace.
- **D.** Deploy an initContainer that waits until the GKE metadata server is ready before running the main application container. — _correct answer_

## Question 82

**Domain:** Deploying applications

**Question:** You need to configure Cloud Build to push container images to an Artifact Registry repository in a different Google Cloud project. The Cloud Build trigger uses a user-specified service account. What IAM configuration is required for this setup?

**Correct answer:** B. Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the user-specified service account on the repository in the target project.

**Options:**

- **A.** Enable the Cloud Build API in the target project and grant the Cloud Build Service Account role to the user-specified service account.
- **B.** Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the user-specified service account on the repository in the target project. — _correct answer_
- **C.** Grant the Artifact Registry Reader role (roles/artifactregistry.reader) to the user-specified service account, as Cloud Build automatically has elevated privileges for write operations.
- **D.** Grant the Storage Object Admin role (roles/storage.objectAdmin) to the user-specified service account on the Cloud Storage bucket backing the Artifact Registry repository.

## Question 83

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses Secret Manager to store API keys for multiple environments (development, staging, and production). You want to simplify secret access in application code while maintaining environment isolation. You need to allow developers to reference secrets using meaningful names instead of version numbers. What should you do?

**Correct answer:** D. Create version aliases for each secret, mapping aliases like 'dev', 'staging', and 'prod' to the appropriate secret versions for each environment.

**Options:**

- **A.** Configure IAM conditions on the secret to return different values based on the requesting environment's metadata labels.
- **B.** Store all environment values in a single secret version as JSON and parse the appropriate environment value in application code.
- **C.** Create separate secrets with environment-specific names like 'api-key-dev', 'api-key-staging', and 'api-key-prod' and always use version number '1'.
- **D.** Create version aliases for each secret, mapping aliases like 'dev', 'staging', and 'prod' to the appropriate secret versions for each environment. — _correct answer_

## Question 84

**Domain:** Building and testing applications

**Question:** You are developing a microservices application and need to configure Cloud Build to run integration tests that depend on unit tests completing successfully first. You have build steps for compiling code, running unit tests, running integration tests, and building container images. You want the integration tests and the container image build to run in parallel after unit tests pass. What should you configure in your cloudbuild.yaml file?

**Correct answer:** A. Use the 'id' field to name the unit test step and use the 'waitFor' field in both the integration test step and the docker build step to reference the unit test step id.

**Options:**

- **A.** Use the 'id' field to name the unit test step and use the 'waitFor' field in both the integration test step and the docker build step to reference the unit test step id. — _correct answer_
- **B.** Use the 'waitFor' field with value '-' on both the integration test step and the docker build step to run them concurrently from the start.
- **C.** Use the 'timeout' field on the unit test step and set the 'waitFor' field on subsequent steps to reference the timeout value.
- **D.** Place the integration test step and the docker build step after the unit test step in the configuration file without any additional configuration.

## Question 85

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a containerized application on Cloud Run that connects to a Cloud SQL for PostgreSQL instance. During load testing, you observe connection failures and 'too many connections' errors. Your application creates new database connections for each request. You want to optimize database connection management while minimizing changes to your application code. What should you do?

**Correct answer:** A. Implement application-level connection pooling using SQLAlchemy with pool_size and max_overflow parameters configured, and set connection recycling to prevent stale connections.

**Options:**

- **A.** Implement application-level connection pooling using SQLAlchemy with pool_size and max_overflow parameters configured, and set connection recycling to prevent stale connections. — _correct answer_
- **B.** Enable Managed Connection Pooling on the Cloud SQL instance with session pooling mode to maintain dedicated server connections for each client session throughout the connection duration.
- **C.** Deploy the Cloud SQL Auth Proxy as a sidecar container and configure it to automatically manage all database connections without any application-level changes.
- **D.** Increase the max_connections flag on the Cloud SQL instance to allow more simultaneous connections from your application without implementing pooling.

## Question 86

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization wants to perform SQL-based analytics on application logs stored in Cloud Logging without incurring BigQuery storage costs. You also need to join log data with business data stored in an existing BigQuery dataset. What should you do?

**Correct answer:** C. Upgrade the log bucket to use Log Analytics and create a linked BigQuery dataset. Use BigQuery to join the linked dataset with your business data.

**Options:**

- **A.** Create a log sink to route logs to a new BigQuery dataset and write SQL queries to join the routed logs with your business data.
- **B.** Create log-based metrics to extract the needed data from logs and use Cloud Monitoring to chart the metrics alongside your business metrics.
- **C.** Upgrade the log bucket to use Log Analytics and create a linked BigQuery dataset. Use BigQuery to join the linked dataset with your business data. — _correct answer_
- **D.** Use the Log Analytics page to query logs with SQL and export the results to Cloud Storage. Import the exported data into BigQuery for joining with business data.

## Question 87

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are implementing a write-through caching strategy for a user profile service. When a user updates their profile, the data must be persisted to Cloud SQL and available in Memorystore for Redis immediately for subsequent reads. You need to ensure data consistency between the database and cache. What should you do?

**Correct answer:** A. Update the Cloud SQL database first, then immediately update or invalidate the corresponding key in Memorystore within the same application transaction boundary.

**Options:**

- **A.** Update the Cloud SQL database first, then immediately update or invalidate the corresponding key in Memorystore within the same application transaction boundary. — _correct answer_
- **B.** Update Memorystore for Redis first with the new data, then asynchronously write to Cloud SQL using a background job to ensure fastest response times.
- **C.** Configure Memorystore Standard Tier with read replicas to automatically propagate writes from the primary node to Cloud SQL using built-in replication.
- **D.** Publish the profile update to Pub/Sub, then have separate Cloud Run functions update Cloud SQL and Memorystore independently from the message queue.

## Question 88

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization is migrating an order processing system to Cloud Tasks. The Cloud Tasks queue dispatches tasks to a Cloud Run function that updates inventory in Cloud SQL. During testing, you observe that some inventory updates are being processed multiple times, causing data inconsistencies. What is the recommended approach to prevent these issues?

**Correct answer:** C. Design your task handlers to be idempotent by using unique identifiers from task payloads as database keys to ensure repeated executions produce the same result.

**Options:**

- **A.** Configure the queue with max_concurrent_dispatches set to 1 to ensure only one task is processed at a time across the entire queue.
- **B.** Enable automatic deduplication in Cloud Tasks by setting a unique task name for each order to prevent duplicate task creation.
- **C.** Design your task handlers to be idempotent by using unique identifiers from task payloads as database keys to ensure repeated executions produce the same result. — _correct answer_
- **D.** Set max_attempts to 1 in the queue's RetryConfig to prevent any retries and eliminate the possibility of duplicate processing.

## Question 89

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a REST API on Cloud Run that will experience sporadic traffic with long idle periods followed by sudden bursts of requests. Users are reporting high latency during traffic bursts after idle periods. You need to reduce request latency while minimizing costs during idle periods. What should you do?

**Correct answer:** D. Configure minimum instances to keep a small number of container instances warm, and enable startup CPU boost for new instances during scale-up events.

**Options:**

- **A.** Set the maximum instances limit to a high value to ensure Cloud Run can rapidly scale to handle traffic bursts.
- **B.** Increase the maximum concurrency setting to 1000 so each instance can handle more requests and reduce the need for new instance creation.
- **C.** Configure the service with instance-based billing to ensure instances remain active and can respond immediately to incoming requests.
- **D.** Configure minimum instances to keep a small number of container instances warm, and enable startup CPU boost for new instances during scale-up events. — _correct answer_

## Question 90

**Domain:** Deploying applications

**Question:** You are developing a microservices application deployed on GKE. Your team needs to troubleshoot intermittent 500 errors reported by users. The application logs messages to standard output, but you find it difficult to filter and search logs effectively in Cloud Logging. You want to improve log searchability without changing your logging framework. What should you do?

**Correct answer:** B. Update your application to output logs as serialized JSON objects to standard output, including a severity field to define the log level.

**Options:**

- **A.** Create a Cloud Logging sink to export logs to BigQuery, then write SQL queries against the BigQuery dataset to search and filter the exported logs.
- **B.** Update your application to output logs as serialized JSON objects to standard output, including a severity field to define the log level. — _correct answer_
- **C.** Configure a custom Fluentd configuration on each GKE node to parse your application's text logs and convert them to structured format before sending to Cloud Logging.
- **D.** Install the Cloud Logging client library in your application and configure it to write logs directly to the Cloud Logging API instead of standard output.

## Question 91

**Domain:** Integrating applications with Google Cloud services

**Question:** You are implementing an object listing feature in your application using the Cloud Storage JSON API. The API returns a response indicating that more results exist, but the nextPageToken field is not present in the response. You have set maxResults to 100 and confirmed the bucket contains more than 100 objects. What is the most likely cause of this issue?

**Correct answer:** C. You are using the fields parameter in your request but did not include nextPageToken in the list of requested fields.

**Options:**

- **A.** The service account used for authentication lacks the storage.objects.list permission, causing the API to return a partial response without pagination tokens.
- **B.** The Cloud Storage JSON API has changed and now uses a continuationToken response header instead of the nextPageToken field in the response body.
- **C.** You are using the fields parameter in your request but did not include nextPageToken in the list of requested fields. — _correct answer_
- **D.** The bucket has versioning enabled, and the maxResults parameter does not work correctly with versioned objects in the bucket.

## Question 92

**Domain:** Deploying applications

**Question:** You are hosting a public web application on GKE exposed through an external Ingress. You need to configure the load balancer to automatically redirect all HTTP traffic to HTTPS while enforcing a minimum TLS version of 1.2. What resources should you create and configure?

**Correct answer:** B. Create a FrontendConfig with redirectToHttps enabled and reference an SSL policy, then annotate your Ingress with networking.gke.io/v1beta1.FrontendConfig.

**Options:**

- **A.** Create a BackendConfig with redirectToHttps enabled and an SSL policy, then annotate your Service with beta.cloud.google.com/backend-config.
- **B.** Create a FrontendConfig with redirectToHttps enabled and reference an SSL policy, then annotate your Ingress with networking.gke.io/v1beta1.FrontendConfig. — _correct answer_
- **C.** Add the annotations kubernetes.io/ingress.allow-http: 'false' and kubernetes.io/ingress.ssl-policy to your Ingress manifest to disable HTTP and enforce the SSL policy.
- **D.** Configure a Google-managed certificate using ManagedCertificate resource, which automatically enables HTTPS redirects and enforces TLS 1.2 as minimum version.

## Question 93

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are securing a Cloud Run service with Identity-Aware Proxy. After enabling IAP on the service, authenticated users with the IAP-secured Web App User role are receiving 403 Forbidden errors when trying to access the application. You have verified that IAP is enabled and the users have the correct IAM role. What is the most likely cause of this issue?

**Correct answer:** D. The IAP service account does not have the Cloud Run Invoker role on the Cloud Run service.

**Options:**

- **A.** The Cloud Run service is configured with Allow unauthenticated invocations which conflicts with IAP.
- **B.** The Cloud Run service does not have a custom domain configured and is using the default run.app URL.
- **C.** The users have not been added to the OAuth consent screen authorized domains list.
- **D.** The IAP service account does not have the Cloud Run Invoker role on the Cloud Run service. — _correct answer_

## Question 94

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application logs errors with a specific error code in the message field. You need to receive alerts when this error appears more than 10 times per minute across your production environment. The error pattern is 'ERR_PAYMENT_FAILED' in the textPayload. You want the simplest solution using Cloud Logging capabilities. What should you do?

**Correct answer:** A. Create a counter log-based metric with a filter matching textPayload containing 'ERR_PAYMENT_FAILED'. Create an alerting policy in Cloud Monitoring that triggers when the metric exceeds 10 per minute.

**Options:**

- **A.** Create a counter log-based metric with a filter matching textPayload containing 'ERR_PAYMENT_FAILED'. Create an alerting policy in Cloud Monitoring that triggers when the metric exceeds 10 per minute. — _correct answer_
- **B.** Export logs to BigQuery using a log sink. Create a scheduled query that runs every minute to count error occurrences and insert alerts into a Pub/Sub topic connected to an alerting notification channel.
- **C.** Create a log sink to route error logs to a Pub/Sub topic. Deploy a Cloud Function triggered by Pub/Sub that counts the errors and sends alerts using Cloud Monitoring API when the threshold is exceeded.
- **D.** Create a distribution log-based metric with a filter matching the error pattern. Configure the metric to extract the count value and create an alerting policy on the distribution.

## Question 95

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a Cloud Run application that connects to a Cloud SQL for PostgreSQL instance. During load testing, you notice that as the number of Cloud Run instances scales up, database connections are exhausted and new requests fail. You need to resolve this issue while minimizing application code changes. What should you do?

**Correct answer:** C. Configure your application to use a client-side connection pool with appropriate pool_size and max_overflow settings to limit connections per Cloud Run instance.

**Options:**

- **A.** Configure Cloud Run to use a maximum of one instance to prevent connection exhaustion issues.
- **B.** Enable Managed Connection Pooling on the Cloud SQL instance and configure the max_connections flag to increase the connection limit significantly.
- **C.** Configure your application to use a client-side connection pool with appropriate pool_size and max_overflow settings to limit connections per Cloud Run instance. — _correct answer_
- **D.** Create multiple Cloud SQL read replicas and configure the application to distribute connections across all replicas for all database operations.

## Question 96

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have structured your Firestore database with a 'users' collection where each user document has a 'comments' subcollection. You need to query all comments across all users that were created in the last 24 hours. What should you do?

**Correct answer:** C. Use a collection group query on the 'comments' collection and create a composite index with collection group scope for the timestamp field used in your query.

**Options:**

- **A.** Restructure your database to store all comments in a top-level 'all_comments' collection with a reference field to the user document, as Firestore cannot query across subcollections.
- **B.** Query each user document individually and then query each user's comments subcollection, aggregating the results in your application code.
- **C.** Use a collection group query on the 'comments' collection and create a composite index with collection group scope for the timestamp field used in your query. — _correct answer_
- **D.** Use the collectionGroup() method with a WHERE clause on the timestamp field, relying on the automatic single-field index that Firestore creates.

## Question 97

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks handler returns various HTTP status codes based on different error conditions. You need to understand which responses will cause Cloud Tasks to retry the task. Which HTTP response code range indicates successful task completion and prevents retries?

**Correct answer:** D. HTTP 200-299 response codes indicate success, and the task will be removed from the queue without retry.

**Options:**

- **A.** HTTP 200 only indicates success; other 2xx codes such as 201 or 204 are treated as failures and trigger retries.
- **B.** HTTP 200-299 and HTTP 3xx redirect codes indicate success and prevent retries from occurring.
- **C.** HTTP 200-299 and HTTP 404 indicate success because 404 means the task was already processed previously.
- **D.** HTTP 200-299 response codes indicate success, and the task will be removed from the queue without retry. — _correct answer_

## Question 98

**Domain:** Building and testing applications

**Question:** You are developing an application deployed to Cloud Run that receives significant production traffic. You need to deploy a new version of your application and test it in production before serving any user traffic. You want to minimize disruption to your current users. What should you do?

**Correct answer:** A. Deploy the new revision with a tag using the --no-traffic flag, test the revision via its dedicated tagged URL, and then gradually migrate traffic using the update-traffic command.

**Options:**

- **A.** Deploy the new revision with a tag using the --no-traffic flag, test the revision via its dedicated tagged URL, and then gradually migrate traffic using the update-traffic command. — _correct answer_
- **B.** Deploy the new revision to a separate staging Cloud Run service, perform all testing there, then redeploy to production with 100% traffic.
- **C.** Configure session affinity on the Cloud Run service to ensure all users continue to use the stable revision while you test the new revision manually.
- **D.** Deploy the new revision with 50% traffic split immediately to balance testing needs with user availability.

## Question 99

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are architecting a high-throughput IoT application using Cloud Firestore that ingests sensor data with timestamps as document IDs. During load testing, you observe increased latency and contention errors as write rates increase. What should you do to resolve this issue while maintaining query performance on timestamp-based queries?

**Correct answer:** D. Use automatic document IDs generated by Firestore instead of timestamps and store the timestamp as a document field with an appropriate composite index for queries.

**Options:**

- **A.** Create an index exemption for the timestamp field to prevent Firestore from indexing the monotonically increasing values that cause hotspotting.
- **B.** Switch to a multi-region Firestore deployment to distribute write load across multiple geographic regions and reduce contention.
- **C.** Implement client-side write throttling to limit the number of documents written per second and gradually increase the rate over time.
- **D.** Use automatic document IDs generated by Firestore instead of timestamps and store the timestamp as a document field with an appropriate composite index for queries. — _correct answer_

## Question 100

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service is experiencing HTTP 429 errors during sudden traffic spikes. The service has a maximum instances setting of 20 and a maximum concurrency of 80. You need to reduce 429 errors while maintaining the maximum instances limit for cost control. What should you do?

**Correct answer:** A. Reduce the maximum concurrency setting to allow Cloud Run to create more instances earlier based on request throughput.

**Options:**

- **A.** Reduce the maximum concurrency setting to allow Cloud Run to create more instances earlier based on request throughput. — _correct answer_
- **B.** Switch from request-based billing to instance-based billing to improve instance availability during traffic spikes.
- **C.** Increase the request timeout to give instances more time to process requests during traffic spikes.
- **D.** Enable startup CPU boost to reduce cold start time and allow instances to start handling requests faster.

## Question 101

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses Cloud Tasks to dispatch HTTP requests to a Cloud Run service. During a traffic spike, the Cloud Run service begins returning HTTP 429 (Too Many Requests) responses. You notice that the task queue has significantly slowed down its dispatch rate. What is causing this behavior?

**Correct answer:** C. Cloud Tasks automatically applies a higher backoff rate when the worker returns HTTP 429 responses to prevent overwhelming the service.

**Options:**

- **A.** Cloud Tasks marks all tasks as failed and deletes them from the queue when receiving HTTP 429 responses.
- **B.** The maxConcurrentDispatches setting is automatically reduced to zero until all pending tasks are manually cleared from the queue.
- **C.** Cloud Tasks automatically applies a higher backoff rate when the worker returns HTTP 429 responses to prevent overwhelming the service. — _correct answer_
- **D.** The Cloud Tasks queue has paused because HTTP 429 responses indicate a permanent failure that cannot be retried.

## Question 102

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an application on GKE that processes sensitive healthcare data stored in Cloud Storage and BigQuery. Resources inside your VPC Service Controls perimeter need to read container images from Artifact Registry located in a different Google Cloud project outside the perimeter. How should you configure access to allow this while minimizing data exfiltration risk?

**Correct answer:** B. Configure an egress rule in the service perimeter that allows specific service accounts to access the Artifact Registry API and Cloud Storage API for the project containing the images.

**Options:**

- **A.** Configure a VPC peering connection between the GKE cluster VPC and the Artifact Registry project VPC to bypass VPC Service Controls restrictions for container images.
- **B.** Configure an egress rule in the service perimeter that allows specific service accounts to access the Artifact Registry API and Cloud Storage API for the project containing the images. — _correct answer_
- **C.** Create an access level based on IP address ranges and apply it to the service perimeter to allow outbound requests from the GKE cluster to Artifact Registry.
- **D.** Add the Artifact Registry project to the same service perimeter as your GKE cluster and sensitive data resources to enable free communication between all projects.

## Question 103

**Domain:** Deploying applications

**Question:** Your team is deploying a containerized application to GKE that requires database credentials. A security audit reveals that the current Kubernetes Secrets are accessible to anyone who can query the Kubernetes API server. You need to implement an additional layer of protection for the Secrets stored in etcd. What should you do?

**Correct answer:** B. Enable application-layer secrets encryption on the GKE cluster using a Cloud KMS key to encrypt the Secrets at rest.

**Options:**

- **A.** Store the credentials directly in the container image by embedding them in a configuration file during the build process.
- **B.** Enable application-layer secrets encryption on the GKE cluster using a Cloud KMS key to encrypt the Secrets at rest. — _correct answer_
- **C.** Create a ConfigMap to store the database credentials instead of using Kubernetes Secrets for better security.
- **D.** Encode the Secrets with a custom Base64 algorithm before storing them in Kubernetes Secrets.

## Question 104

**Domain:** Deploying applications

**Question:** You want to ensure that all outbound traffic from your Cloud Run service passes through your VPC network to comply with VPC Service Controls requirements. You have configured a Serverless VPC Access connector. What additional configuration is required for the Cloud Run service?

**Correct answer:** B. Set the VPC egress setting to all-traffic so that all outbound requests from the Cloud Run service are routed through the VPC network.

**Options:**

- **A.** Enable Binary Authorization on the Cloud Run service to verify container images before allowing outbound network connections.
- **B.** Set the VPC egress setting to all-traffic so that all outbound requests from the Cloud Run service are routed through the VPC network. — _correct answer_
- **C.** Configure the Cloud Run service ingress setting to internal-only to ensure all traffic stays within the VPC network perimeter.
- **D.** Add network tags to the Cloud Run service that match firewall rules configured to allow traffic only to VPC Service Controls endpoints.

## Question 105

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a payment processing system using Cloud Tasks to dispatch payment requests to a third-party payment gateway. The gateway occasionally times out, causing Cloud Tasks to retry the payment request. You need to ensure that customers are charged exactly once even when retries occur. What should you do?

**Correct answer:** C. Design your task handler to be idempotent by using a unique payment identifier to track and deduplicate payment processing attempts.

**Options:**

- **A.** Return HTTP 503 from your handler to tell Cloud Tasks to delete the task without retrying when a duplicate is detected.
- **B.** Set max_attempts to 1 in the queue's RetryConfig to prevent any retry attempts from occurring.
- **C.** Design your task handler to be idempotent by using a unique payment identifier to track and deduplicate payment processing attempts. — _correct answer_
- **D.** Configure the queue with max_retry_duration set to 0 to limit the retry window and prevent duplicate executions.

## Question 106

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new revision of your Cloud Run API service with a maximum instances limit of 50. During the deployment, you observe that more than 50 instances are running temporarily. What explains this behavior?

**Correct answer:** D. Cloud Run may temporarily create instances beyond the maximum limit to replace existing instances and provide a grace period for inflight requests to complete.

**Options:**

- **A.** The concurrency setting on the new revision is too low, causing Cloud Run to bypass the maximum instances limit temporarily.
- **B.** The maximum instances limit applies only to the new revision, so the old and new revisions combined can exceed the specified limit.
- **C.** Cloud Run ignores maximum instance limits during the first 15 minutes of a new deployment to ensure high availability.
- **D.** Cloud Run may temporarily create instances beyond the maximum limit to replace existing instances and provide a grace period for inflight requests to complete. — _correct answer_

## Question 107

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a data analytics application on Google Cloud. Your company requires that only employees accessing from corporate office networks or managed devices can query BigQuery datasets protected by VPC Service Controls. You need to configure context-aware access that evaluates both network origin and device posture. What should you do?

**Correct answer:** A. Create access levels in Access Context Manager with IP address ranges and device policy conditions. Configure ingress rules on the service perimeter that reference these access levels.

**Options:**

- **A.** Create access levels in Access Context Manager with IP address ranges and device policy conditions. Configure ingress rules on the service perimeter that reference these access levels. — _correct answer_
- **B.** Configure firewall rules on the VPC network to allow traffic only from corporate IP addresses and use IAM conditions for device posture verification.
- **C.** Create a service account for each office location and restrict BigQuery access using IAM policies bound to these accounts.
- **D.** Configure Identity-Aware Proxy in front of BigQuery to enforce device trust policies and network restrictions before requests reach the service.

## Question 108

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a microservices application on Cloud Run that requires database credentials stored in Secret Manager. Your security team mandates that secrets must be rotated every 90 days and that applications must automatically pick up the new credential values without redeployment. How should you configure the secret access for Cloud Run?

**Correct answer:** C. Mount the secret as a volume in Cloud Run and reference the latest version. Configure a rotation schedule on the secret with Pub/Sub notifications to trigger credential updates.

**Options:**

- **A.** Store the database credentials in a ConfigMap and mount it as a volume. Use Cloud Scheduler to periodically update the ConfigMap with new credentials.
- **B.** Pass the secret as an environment variable in Cloud Run and reference the latest version. Configure a rotation schedule on the secret with Pub/Sub notifications to trigger credential updates.
- **C.** Mount the secret as a volume in Cloud Run and reference the latest version. Configure a rotation schedule on the secret with Pub/Sub notifications to trigger credential updates. — _correct answer_
- **D.** Mount the secret as a volume in Cloud Run and reference a specific version number. Configure a rotation schedule and manually update the version reference after each rotation.

## Question 109

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a Cloud Tasks handler that sends email notifications. Cloud Tasks provides at-least-once delivery, which means duplicate task executions are possible. You need to prevent users from receiving duplicate emails. What should you do?

**Correct answer:** D. Store the task ID in Firestore before sending the email and check for its existence on each execution attempt using a transaction.

**Options:**

- **A.** Configure the queue with max_attempts set to 1 to ensure tasks execute only once without retries.
- **B.** Use Cloud Tasks HTTP Target with the same task name for each email to ensure automatic deduplication.
- **C.** Add a unique constraint on the email recipient address in your application database to prevent duplicate entries.
- **D.** Store the task ID in Firestore before sending the email and check for its existence on each execution attempt using a transaction. — _correct answer_

## Question 110

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is implementing a write-through caching strategy for an order management system. When a new order is created, the application writes to Cloud SQL and should immediately cache the order details in Memorystore for Redis. During peak traffic, some order data is not appearing in the cache after writes. You need to improve the reliability of this caching implementation. What should you do?

**Correct answer:** A. Implement retry logic with exponential backoff when writing to Memorystore, and ensure the application handles temporary connection failures gracefully without blocking the primary database transaction.

**Options:**

- **A.** Implement retry logic with exponential backoff when writing to Memorystore, and ensure the application handles temporary connection failures gracefully without blocking the primary database transaction. — _correct answer_
- **B.** Switch from a write-through pattern to a cache-aside pattern where the cache is only populated when data is requested, eliminating the need to write to Redis during order creation.
- **C.** Configure the write operation to use the Memorystore read endpoint instead of the primary endpoint to distribute the write load across all available replicas.
- **D.** Increase the timeout configuration parameter on the Memorystore instance to prevent idle connections from being terminated during periods of low activity.

## Question 111

**Domain:** Deploying applications

**Question:** You are deploying an application to GKE and need to safely roll out updates with the ability to quickly revert if issues occur. You have updated your deployment YAML manifest with a new container image version and applied it to the cluster. After a few minutes, users report errors. You need to revert to the previous stable version immediately. What kubectl command should you use?

**Correct answer:** A. kubectl rollout undo deployment/my-app

**Options:**

- **A.** kubectl rollout undo deployment/my-app — _correct answer_
- **B.** kubectl apply -f deployment-previous.yaml
- **C.** kubectl delete deployment/my-app && kubectl create -f deployment.yaml
- **D.** kubectl scale deployment/my-app --replicas=0

## Question 112

**Domain:** Building and testing applications

**Question:** You are configuring a gradual canary rollout strategy for a critical Cloud Run service. Your service has session affinity enabled to maintain user sessions during checkout flows. How does Cloud Run handle traffic splitting when session affinity is enabled?

**Correct answer:** C. Requests from the same clients are routed to the same revision, and Cloud Run minimizes the number of clients redirected to a new revision when updating traffic splits.

**Options:**

- **A.** Traffic splitting overrides session affinity, causing each request from a user to be routed to different revisions based on the configured traffic weights regardless of session state.
- **B.** Session affinity is automatically disabled when traffic splitting is configured, and requests are distributed randomly across all revisions based on the configured percentages.
- **C.** Requests from the same clients are routed to the same revision, and Cloud Run minimizes the number of clients redirected to a new revision when updating traffic splits. — _correct answer_
- **D.** Session affinity only applies to the revision receiving the highest percentage of traffic, while other revisions receive requests without session affinity.

## Question 113

**Domain:** Integrating applications with Google Cloud services

**Question:** Your development team runs containerized workloads on GKE and wants to monitor custom application metrics that track the number of orders processed per minute. You need to collect these custom metrics and send them to Cloud Monitoring for visualization and alerting. You want to use Google-recommended practices and minimize operational overhead. What should you do?

**Correct answer:** A. Instrument your application with OpenTelemetry to expose Prometheus-style metrics. Enable Google Cloud Managed Service for Prometheus to collect and send the metrics to Cloud Monitoring.

**Options:**

- **A.** Instrument your application with OpenTelemetry to expose Prometheus-style metrics. Enable Google Cloud Managed Service for Prometheus to collect and send the metrics to Cloud Monitoring. — _correct answer_
- **B.** Configure your application to write metrics to STDOUT in JSON format. Use Cloud Logging to ingest the metrics and create log-based metrics.
- **C.** Write metrics directly to Cloud Monitoring using the Monitoring API client library in your application code. Create metric descriptors manually before writing data.
- **D.** Deploy a self-managed Prometheus server in your cluster and configure federation to push metrics to Cloud Monitoring at regular intervals.

## Question 114

**Domain:** Building and testing applications

**Question:** You have a Cloud Run service with traffic split between two revisions: revision-a receiving 70% and revision-b receiving 30%. You want to deploy a new image for testing purposes and ensure it receives no production traffic until you explicitly configure it. What command should you use?

**Correct answer:** B. gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag testing

**Options:**

- **A.** gcloud run deploy myservice --image IMAGE_URL --revision-suffix testing
- **B.** gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag testing — _correct answer_
- **C.** gcloud run services replace service.yaml --image IMAGE_URL --traffic 0
- **D.** gcloud run deploy myservice --image IMAGE_URL && gcloud run services update-traffic myservice --to-revisions LATEST=0

## Question 115

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a real-time gaming leaderboard using Cloud Firestore. Multiple game servers frequently update player scores simultaneously, and you are experiencing ABORTED errors with the message 'Too much contention on these documents'. The application uses transactions to read a player's current score, add points, and write the new score. What should you do to reduce contention while maintaining accurate score tracking?

**Correct answer:** B. Replace transactions with direct updates using FieldValue.increment() to atomically add points without reading the current score first.

**Options:**

- **A.** Increase the maximum retry attempts for transactions to handle the contention errors automatically.
- **B.** Replace transactions with direct updates using FieldValue.increment() to atomically add points without reading the current score first. — _correct answer_
- **C.** Change the database concurrency mode from PESSIMISTIC to OPTIMISTIC to allow more concurrent transactions.
- **D.** Implement a distributed counter pattern by sharding the score across multiple documents to reduce write conflicts.

## Question 116

**Domain:** Deploying applications

**Question:** Your team has deployed a new version of an application to GKE, but users are reporting errors. You need to quickly revert to the previous working version while minimizing user impact. The Deployment history shows multiple revisions. What is the fastest method to accomplish this using kubectl?

**Correct answer:** D. Run kubectl rollout undo deployment/my-app to automatically roll back to the previous revision.

**Options:**

- **A.** Run kubectl delete deployment my-app, then run kubectl apply -f previous-deployment.yaml.
- **B.** Run kubectl rollout history deployment/my-app, then run kubectl set image deployment/my-app container=previous-image:tag.
- **C.** Run kubectl scale deployment/my-app --replicas=0, update the manifest, then scale back up.
- **D.** Run kubectl rollout undo deployment/my-app to automatically roll back to the previous revision. — _correct answer_

## Question 117

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a schema for Cloud Bigtable to store weather sensor data. Each sensor sends readings for temperature, humidity, and pressure every minute. Your primary query pattern retrieves all measurements for a single sensor over a one-week period. You want to optimize read performance while staying within Bigtable size limits. Which schema design pattern should you use?

**Correct answer:** B. Use a time bucket pattern where each row represents one week of data for a sensor, with the row key containing sensor_id and a week identifier, and measurements stored as new cells in columns.

**Options:**

- **A.** Use a serialized data pattern where all measurements are stored as a single JSON blob in one cell, updated with each new reading by reading and rewriting the entire blob.
- **B.** Use a time bucket pattern where each row represents one week of data for a sensor, with the row key containing sensor_id and a week identifier, and measurements stored as new cells in columns. — _correct answer_
- **C.** Use a tall and narrow pattern where each row represents a single minute's measurement, with the row key containing timestamp followed by sensor_id.
- **D.** Store all measurements for each sensor in a single row without any time bucketing, updating the same row continuously as new data arrives.

## Question 118

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a dashboard application that displays real-time status updates from Firestore. Your application needs to track three types of document changes: when new documents are added, when existing documents are modified, and when documents are removed from the result set. How should you implement this functionality?

**Correct answer:** D. Attach a snapshot listener to the query and iterate through the snapshot.docChanges() array, checking each change object's type property for ADDED, MODIFIED, or REMOVED values.

**Options:**

- **A.** Create three separate snapshot listeners on the same collection - one with an onAdd callback, one with an onModify callback, and one with an onRemove callback.
- **B.** Use Firestore triggers in Cloud Functions to detect changes and push notifications to the client via Firebase Cloud Messaging for each change type.
- **C.** Poll the collection periodically using get() calls and compare the current results with the previous results to detect additions, modifications, and removals.
- **D.** Attach a snapshot listener to the query and iterate through the snapshot.docChanges() array, checking each change object's type property for ADDED, MODIFIED, or REMOVED values. — _correct answer_

## Question 119

**Domain:** Building and testing applications

**Question:** Your team is developing a Cloud Run service and wants to test it locally before deploying to Google Cloud. Team members need to iterate quickly and see changes reflected immediately without manual redeployment. Which Cloud Code feature should your team use for local development?

**Correct answer:** C. Use the Run on Cloud Run Emulator command with watch mode enabled to automatically rebuild and redeploy the service when files are saved.

**Options:**

- **A.** Configure a minikube cluster and deploy the service using the Run on Kubernetes command with Cloud Run compatibility mode.
- **B.** Deploy the service to a remote Cloud Run environment and use Cloud Code's live debugging feature to connect to it remotely.
- **C.** Use the Run on Cloud Run Emulator command with watch mode enabled to automatically rebuild and redeploy the service when files are saved. — _correct answer_
- **D.** Use gcloud run deploy with the --local flag to simulate the Cloud Run environment on your development machine.

## Question 120

**Domain:** Deploying applications

**Question:** You are configuring a Serverless VPC Access connector to allow your Cloud Run service to access private resources. You need to specify a subnet for the connector. Which subnet configuration meets the requirements for a Serverless VPC Access connector?

**Correct answer:** D. A dedicated /28 subnet with no other resources deployed and subnet purpose set to PRIVATE.

**Options:**

- **A.** A /26 subnet dedicated to serverless services with purpose set to SERVERLESS_VPC_ACCESS.
- **B.** A /28 subnet configured for Private Service Connect with available addresses.
- **C.** A /24 subnet shared with Compute Engine VMs that has available IP addresses in the CIDR range.
- **D.** A dedicated /28 subnet with no other resources deployed and subnet purpose set to PRIVATE. — _correct answer_

## Question 121

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a containerized Python application for Cloud Run that exposes Prometheus-style metrics. You need to collect these application-specific metrics and send them to Cloud Monitoring so you can create custom dashboards and alerting policies. What is the Google-recommended approach?

**Correct answer:** B. Add the Managed Service for Prometheus sidecar to your Cloud Run service. The sidecar scrapes metrics from your application and writes them to Cloud Monitoring using the prometheus_target resource type.

**Options:**

- **A.** Deploy a standalone Prometheus server in a separate Cloud Run service that pulls metrics from your application and forwards them to Cloud Monitoring using a remote write configuration.
- **B.** Add the Managed Service for Prometheus sidecar to your Cloud Run service. The sidecar scrapes metrics from your application and writes them to Cloud Monitoring using the prometheus_target resource type. — _correct answer_
- **C.** Instrument your application using the Cloud Monitoring client library to write custom metrics directly to the custom.googleapis.com metric namespace via the Monitoring API.
- **D.** Configure Cloud Run to automatically export all application metrics to Cloud Monitoring by enabling the built-in metrics collection feature in the service configuration.

## Question 122

**Domain:** Building and testing applications

**Question:** You are developing a containerized microservices application using Cloud Code for VS Code. Your application consists of multiple services, and you want to speed up your development loop by avoiding full image rebuilds when making changes to static HTML files. You are using Docker as your builder. What should you configure in your skaffold.yaml file to enable this behavior?

**Correct answer:** D. Add a sync section with manual rules specifying source HTML files and their destination paths in the container for the artifact you want to configure.

**Options:**

- **A.** Configure Cloud Build in the profiles section of skaffold.yaml to handle incremental builds of your HTML files.
- **B.** Set the watch field to true in your .vscode/launch.json file to enable automatic file watching and synchronization for all file types.
- **C.** Enable Buildpacks as your builder instead of Docker, which automatically configures hot reloading for HTML files without additional configuration.
- **D.** Add a sync section with manual rules specifying source HTML files and their destination paths in the container for the artifact you want to configure. — _correct answer_

## Question 123

**Domain:** Integrating applications with Google Cloud services

**Question:** You are architecting a real-time analytics application that must display data from Firestore. The application handles both scenarios where users need instant updates and scenarios where data is accessed infrequently but must be current. You want to minimize costs while maintaining responsiveness. When should you use snapshot listeners versus one-shot queries?

**Correct answer:** D. Use snapshot listeners for screens where users actively monitor data for changes, and use one-shot queries for screens where data is viewed briefly and does not need continuous updates.

**Options:**

- **A.** Always use one-shot queries with client-side polling to maintain control over when data is fetched and reduce complexity of handling real-time updates.
- **B.** Use snapshot listeners only for collections with fewer than 100 documents and one-shot queries for larger collections to avoid overwhelming the client.
- **C.** Always use snapshot listeners because Firestore does not charge for maintaining open connections, only for documents returned, making listeners always more cost-effective.
- **D.** Use snapshot listeners for screens where users actively monitor data for changes, and use one-shot queries for screens where data is viewed briefly and does not need continuous updates. — _correct answer_

## Question 124

**Domain:** Building and testing applications

**Question:** Your team is implementing a CI/CD pipeline that deploys to Cloud Run with automated canary releases. You want Cloud Deploy to automatically manage traffic splitting between the current stable revision and new canary revisions at specified percentage increments. How should you configure the Cloud Deploy delivery pipeline for Cloud Run canary deployments?

**Correct answer:** C. Configure the delivery pipeline with strategy.canary, set runtimeConfig.cloudRun.automaticTrafficControl to true, and specify canaryDeployment.percentages as an array of increments such as [10, 25, 50, 75].

**Options:**

- **A.** Configure multiple Cloud Run services (one stable, one canary) and use Cloud Deploy to deploy to each service independently with different traffic percentages via an external load balancer.
- **B.** Configure the delivery pipeline with strategy.standard, and use predeploy hooks to call gcloud run services update-traffic with the desired percentages at each deployment phase.
- **C.** Configure the delivery pipeline with strategy.canary, set runtimeConfig.cloudRun.automaticTrafficControl to true, and specify canaryDeployment.percentages as an array of increments such as [10, 25, 50, 75]. — _correct answer_
- **D.** Configure the Cloud Run service definition YAML with a traffic stanza specifying the percentage splits, and reference it in the skaffold.yaml for each canary phase.

## Question 125

**Domain:** Building and testing applications

**Question:** Your Cloud Run service is performing a canary deployment with traffic split between two revisions: the stable revision receiving 90% and the canary revision receiving 10%. Monitoring reveals increased error rates in the canary revision. You need to immediately route all traffic back to the stable revision to minimize user impact. What is the fastest way to accomplish this?

**Correct answer:** A. gcloud run services update-traffic myservice --to-revisions stable-revision=100

**Options:**

- **A.** gcloud run services update-traffic myservice --to-revisions stable-revision=100 — _correct answer_
- **B.** gcloud run revisions delete canary-revision --region REGION
- **C.** gcloud run services update myservice --rollback-revision stable-revision
- **D.** gcloud run deploy myservice --image STABLE_IMAGE --force-rollback

## Question 126

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company has two separate teams with resources in different VPC Service Controls perimeters. Team A needs to copy data from a Cloud Storage bucket protected by Perimeter A to a BigQuery dataset protected by Perimeter B. You want to enable this data exchange with minimal configuration while maintaining security boundaries. What should you do?

**Correct answer:** B. Configure an egress rule in Perimeter A to allow Cloud Storage access to Perimeter B, and configure an ingress rule in Perimeter B to allow the data from Perimeter A.

**Options:**

- **A.** Configure an access level in Perimeter B that specifies the project from Perimeter A as an allowed source for incoming requests.
- **B.** Configure an egress rule in Perimeter A to allow Cloud Storage access to Perimeter B, and configure an ingress rule in Perimeter B to allow the data from Perimeter A. — _correct answer_
- **C.** Add both projects to a single new perimeter that includes Cloud Storage and BigQuery as restricted services to allow free communication.
- **D.** Create a perimeter bridge between Perimeter A and Perimeter B to enable bidirectional access between the Cloud Storage bucket and BigQuery dataset.

## Question 127

**Domain:** Deploying applications

**Question:** You need to declaratively manage multiple Kubernetes resources stored in YAML manifest files within a directory called 'k8s-manifests'. The manifests include Deployments, Services, and ConfigMaps for your GKE application. You want to create resources that don't exist and update resources that have changed while preserving any manual modifications made to live objects. What kubectl command should you use?

**Correct answer:** A. Run kubectl apply -f k8s-manifests/

**Options:**

- **A.** Run kubectl apply -f k8s-manifests/ — _correct answer_
- **B.** Run kubectl patch -f k8s-manifests/
- **C.** Run kubectl create -f k8s-manifests/
- **D.** Run kubectl replace -f k8s-manifests/

## Question 128

**Domain:** Building and testing applications

**Question:** You are managing container images for a production application in Artifact Registry. Your team pushes new images with version tags (v1.0.0, v1.0.1) and your deployment pipelines reference these tags. A recent incident occurred when a developer accidentally overwrote an existing tag with a different image, causing deployment issues. You need to prevent this from happening in the future while maintaining your current tagging workflow. What should you do?

**Correct answer:** C. Enable the immutable tags setting on the Docker repository in Artifact Registry to prevent changing the image digest that a tag references.

**Options:**

- **A.** Implement a naming convention that appends timestamps to all image tags and document the policy for your team to follow consistently.
- **B.** Configure IAM policies to grant the Artifact Registry Writer role only to the CI/CD service account and remove push permissions from individual developers.
- **C.** Enable the immutable tags setting on the Docker repository in Artifact Registry to prevent changing the image digest that a tag references. — _correct answer_
- **D.** Create a Cloud Build trigger that validates tag uniqueness before pushing images. Fail the build if the tag already exists in the repository.

## Question 129

**Domain:** Integrating applications with Google Cloud services

**Question:** You are troubleshooting why a log sink in your project is not routing application error logs to a BigQuery dataset. The sink was recently created with a filter for severity=ERROR. You check Cloud Monitoring metrics and find that exports/error_count for the sink shows increasing values. What is the most likely cause of this issue?

**Correct answer:** B. The sink's service account does not have the BigQuery Data Editor role on the destination dataset.

**Options:**

- **A.** The BigQuery dataset is in a different region than the project where logs originate.
- **B.** The sink's service account does not have the BigQuery Data Editor role on the destination dataset. — _correct answer_
- **C.** Application logs are not being written with structured JSON format required by BigQuery.
- **D.** The filter syntax 'severity=ERROR' is incorrect and no logs are matching the filter.

## Question 130

**Domain:** Integrating applications with Google Cloud services

**Question:** You manage multiple GKE clusters across different projects and need to set up alerting policies that monitor container restarts across all clusters. The alerting policies must notify your operations team through both email and Slack. What should you configure?

**Correct answer:** C. Configure email and Slack notification channels in Cloud Monitoring. Create an alerting policy monitoring kubernetes.io/container/restart_count metric, and add both notification channels to receive alerts when the condition is met.

**Options:**

- **A.** Create two separate alerting policies for the restart count metric, one configured with email and one with Slack. This ensures that if one channel fails, the other still receives the notification.
- **B.** Configure a Webhook notification channel that points to a serverless function. The function parses the alert and sends notifications to both email and Slack.
- **C.** Configure email and Slack notification channels in Cloud Monitoring. Create an alerting policy monitoring kubernetes.io/container/restart_count metric, and add both notification channels to receive alerts when the condition is met. — _correct answer_
- **D.** Configure Pub/Sub as the only notification channel. Create Cloud Functions to subscribe to the Pub/Sub topic and forward alerts to email and Slack through custom code.

## Question 131

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an API service on Cloud Run. The application handles requests with significant in-memory processing that takes approximately 500ms per request. During load testing, you observe that your service is scaling to more instances than expected, which increases costs. The average CPU utilization of instances remains below 60%, but each instance is only handling a few requests at a time. You want to optimize cost while maintaining acceptable latency. What should you do?

**Correct answer:** A. Increase the maximum concurrency setting for your Cloud Run service to allow more requests to be processed by each instance simultaneously.

**Options:**

- **A.** Increase the maximum concurrency setting for your Cloud Run service to allow more requests to be processed by each instance simultaneously. — _correct answer_
- **B.** Enable startup CPU boost to reduce cold start time and allow instances to process requests faster when they start up.
- **C.** Switch from request-based billing to instance-based billing so that instances remain active between requests and can handle more load.
- **D.** Decrease the maximum instances limit to prevent Cloud Run from creating too many instances and reduce overall cost.

## Question 132

**Domain:** Deploying applications

**Question:** You manage a GKE Autopilot cluster running production workloads. Your team wants to create custom dashboards showing container memory usage per pod and correlate this data with application logs. You want to implement this using the Cloud Monitoring observability features. What should you do?

**Correct answer:** A. Use the GKE Observability tab in the Google Cloud console to view predefined dashboards, then click Customize dashboard to add memory metrics widgets and logs widgets for correlation.

**Options:**

- **A.** Use the GKE Observability tab in the Google Cloud console to view predefined dashboards, then click Customize dashboard to add memory metrics widgets and logs widgets for correlation. — _correct answer_
- **B.** Create a new custom dashboard in Cloud Monitoring, add a chart using the kubernetes.io/container/memory/used_bytes metric filtered by pod_name, and embed a separate Logs Explorer iframe.
- **C.** Deploy Grafana using Google Cloud Managed Service for Prometheus and configure combined metrics and logs panels using the Loki data source.
- **D.** Export metrics to BigQuery using a Cloud Monitoring sink, join with log data exported to the same BigQuery dataset, and create Data Studio dashboards.

## Question 133

**Domain:** Building and testing applications

**Question:** A developer on your team frequently works across multiple Google Cloud projects using Cloud Shell. They want to maintain a consistent gcloud CLI configuration regardless of which project they launch Cloud Shell from. What should they do?

**Correct answer:** B. Add export CLOUDSDK_CONFIG=$HOME/.config/gcloud to their .bashrc file and create a named configuration using gcloud config configurations create.

**Options:**

- **A.** Configure the GOOGLE_CLOUD_PROJECT environment variable in their .bashrc to always point to their preferred default project across all sessions.
- **B.** Add export CLOUDSDK_CONFIG=$HOME/.config/gcloud to their .bashrc file and create a named configuration using gcloud config configurations create. — _correct answer_
- **C.** Store the gcloud configuration in Cloud Storage and add a command to their .bashrc that downloads and applies the configuration on each session start.
- **D.** Install a separate gcloud CLI version in their $HOME directory and configure their PATH to use it instead of the pre-installed version.

## Question 134

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a Cloud Tasks queue with exponential backoff for a payment processing application. The queue has the following retry configuration: min_backoff=5s, max_backoff=300s, max_doublings=4. A task fails its first attempt. What is the expected sequence of retry intervals?

**Correct answer:** A. 5s, 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 5s, 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_
- **B.** 5s, 25s, 125s, 300s, 300s, 300s, 300s
- **C.** 5s, 10s, 20s, 40s, 80s, 80s, 80s, 80s, 80s
- **D.** 5s, 10s, 20s, 40s, 80s, 160s, 300s, 300s, 300s

## Question 135

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your Cloud Run service and want to test it in production before exposing it to live traffic. You need to deploy the new revision without routing any production traffic to it while still being able to test the revision directly. Which gcloud command should you use?

**Correct answer:** A. gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary

**Options:**

- **A.** gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary — _correct answer_
- **B.** gcloud run deploy myservice --image IMAGE_URL --revision-suffix canary --ingress internal
- **C.** gcloud run deploy myservice --image IMAGE_URL --traffic 0
- **D.** gcloud run deploy myservice --image IMAGE_URL --no-allow-unauthenticated

## Question 136

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring alerting policies in Cloud Monitoring for your production GKE application. Your team requires alerts to be sent to both PagerDuty for immediate incident response and email for documentation purposes. You also want to ensure alerts continue to be delivered even if one notification system experiences an outage. What should you do?

**Correct answer:** D. Create an alerting policy with multiple notification channels configured, including both PagerDuty and email channels, to ensure redundant delivery of notifications.

**Options:**

- **A.** Use a Pub/Sub notification channel as the single notification source and create separate Cloud Run functions to forward to PagerDuty and email services.
- **B.** Create two separate alerting policies with identical conditions, one configured with PagerDuty and one with email, to ensure independent notification paths.
- **C.** Configure only PagerDuty as the notification channel and set up a secondary webhook in PagerDuty to forward alerts to email, keeping the Cloud Monitoring configuration simple.
- **D.** Create an alerting policy with multiple notification channels configured, including both PagerDuty and email channels, to ensure redundant delivery of notifications. — _correct answer_

## Question 137

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a web application deployed on a Compute Engine managed instance group behind an HTTPS load balancer. You need to restrict access to the application so that only authenticated employees can access it. The employees do not have VPN access and should authenticate using their corporate Google Workspace accounts. You want to implement the most secure method that follows Google-recommended best practices. What should you do?

**Correct answer:** D. Enable Identity-Aware Proxy on the backend service and grant the IAP-secured Web App User role to the employees. Update your application to verify the x-goog-iap-jwt-assertion header.

**Options:**

- **A.** Enable Identity-Aware Proxy on the backend service and grant the Viewer IAM role to the employees. Configure the OAuth consent screen to require Google Workspace domain authentication.
- **B.** Enable Identity-Aware Proxy on the backend service and grant the IAP-secured Web App User role to the employees. Configure your application to read the x-goog-authenticated-user-email header for user identification.
- **C.** Configure OAuth 2.0 authentication in your application directly and validate credentials against Cloud Identity. Create a firewall rule to allow only Google Workspace authenticated traffic.
- **D.** Enable Identity-Aware Proxy on the backend service and grant the IAP-secured Web App User role to the employees. Update your application to verify the x-goog-iap-jwt-assertion header. — _correct answer_

## Question 138

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service locally using Cloud Code for VS Code. During debugging, you need to verify whether your code is running in the local emulator versus a deployed Cloud Run environment. How should you determine the execution context programmatically?

**Correct answer:** B. Query the K_REVISION environment variable and check if the value is 'local' to confirm the code is running on the Cloud Code emulator

**Options:**

- **A.** Check if the CLOUD_RUN_EMULATOR environment variable exists and is set to 'true'
- **B.** Query the K_REVISION environment variable and check if the value is 'local' to confirm the code is running on the Cloud Code emulator — _correct answer_
- **C.** Check for the presence of the GOOGLE_CLOUD_PROJECT environment variable; if absent, the code is running locally
- **D.** Verify that the PORT environment variable is set to 8080, which indicates a local emulator environment

## Question 139

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has multiple Google Cloud projects across different business units. The security team requires all audit logs from every project to be stored in a centralized location for compliance analysis. You need to configure log routing while minimizing management overhead as new projects are created. What should you do?

**Correct answer:** B. Create an aggregated sink at the organization level with the --include-children option to route audit logs to a centralized log bucket in a dedicated observability project.

**Options:**

- **A.** Create a log sink in each project that routes audit logs to a centralized Cloud Storage bucket. Use Infrastructure as Code to deploy sinks when new projects are created.
- **B.** Create an aggregated sink at the organization level with the --include-children option to route audit logs to a centralized log bucket in a dedicated observability project. — _correct answer_
- **C.** Create a Pub/Sub topic and configure each project to export logs via a sink. Deploy a Cloud Function to aggregate and store logs in a centralized location.
- **D.** Edit the _Default sink in each project to change its destination to a centralized log bucket. Configure default resource settings to apply this change to new projects.

## Question 140

**Domain:** Building and testing applications

**Question:** You are developing a new feature for a Cloud Run service that processes payments. Before exposing the new feature to production traffic, you want to deploy the new revision to production and test it using a specific URL. The existing revision must continue to serve all user traffic during testing. What should you do?

**Correct answer:** B. Deploy the new revision using 'gcloud run deploy' with the '--no-traffic' and '--tag' flags. Test the revision using the tag-specific URL before migrating traffic.

**Options:**

- **A.** Deploy the new revision to a separate Cloud Run service for testing. After testing, delete the test service and deploy to the production service.
- **B.** Deploy the new revision using 'gcloud run deploy' with the '--no-traffic' and '--tag' flags. Test the revision using the tag-specific URL before migrating traffic. — _correct answer_
- **C.** Deploy the new revision using 'gcloud run deploy' and immediately set traffic to 1% using the '--traffic' flag to minimize impact during testing.
- **D.** Deploy the new revision using 'gcloud run deploy' with the '--revision-suffix' flag. Access the revision directly using the revision name in the URL path.

## Question 141

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that lists millions of objects stored in a Cloud Storage bucket using the JSON API. When you make a request to list objects, the response includes a 'nextPageToken' field. Your application needs to process all objects efficiently. What should you do?

**Correct answer:** A. Parse the nextPageToken from the response and pass it as the pageToken parameter in subsequent requests until no nextPageToken is returned, indicating the listing is complete.

**Options:**

- **A.** Parse the nextPageToken from the response and pass it as the pageToken parameter in subsequent requests until no nextPageToken is returned, indicating the listing is complete. — _correct answer_
- **B.** Send multiple parallel requests using different prefix filters to divide the object listing across concurrent threads without using pagination tokens.
- **C.** Store the nextPageToken in a database and create a scheduled job that periodically retrieves the next page of results until all objects are processed.
- **D.** Convert the nextPageToken to a base64-decoded string to extract the object name offset and use it with the startOffset parameter for subsequent requests.

## Question 142

**Domain:** Deploying applications

**Question:** You are setting up a Serverless VPC Access connector for your Cloud Run services. The connector will be used by multiple Cloud Run services to access internal resources. Which subnet configuration requirement must you follow?

**Correct answer:** D. Use a dedicated /28 subnet that is not used by any other resources such as VMs, Private Service Connect, or load balancers.

**Options:**

- **A.** Deploy the connector without specifying a subnet and let Google Cloud automatically assign IPs from any available range.
- **B.** Create the connector using a public IP address range to ensure accessibility from all Cloud Run services.
- **C.** Use a /26 or larger subnet shared between the connector and Compute Engine VMs in the same network.
- **D.** Use a dedicated /28 subnet that is not used by any other resources such as VMs, Private Service Connect, or load balancers. — _correct answer_

## Question 143

**Domain:** Deploying applications

**Question:** Your Cloud Run service fails to start after deployment with an error indicating that it cannot access a Secret Manager secret. The secret exists and contains valid data. The Cloud Run service uses a custom service account. What is the most likely cause of this issue?

**Correct answer:** D. The custom service account is missing the roles/secretmanager.secretAccessor role on the secret.

**Options:**

- **A.** The secret version is set to 'latest' instead of a specific version number.
- **B.** The Cloud Run service is deployed in a different region than the Secret Manager secret.
- **C.** The Secret Manager API is not enabled in the project where the secret is stored.
- **D.** The custom service account is missing the roles/secretmanager.secretAccessor role on the secret. — _correct answer_

## Question 144

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Run API service that receives highly variable traffic, with periods of no traffic followed by sudden bursts of thousands of requests. The application code is not thread-safe and cannot handle concurrent requests. You need to configure Cloud Run to handle traffic bursts efficiently. What should you do?

**Correct answer:** A. Set the maximum concurrency to 1 and configure an appropriate maximum instances limit to handle expected burst traffic.

**Options:**

- **A.** Set the maximum concurrency to 1 and configure an appropriate maximum instances limit to handle expected burst traffic. — _correct answer_
- **B.** Set minimum instances equal to maximum instances to pre-provision all required capacity for traffic bursts.
- **C.** Configure the service to use manual scaling with a fixed number of instances to handle peak traffic.
- **D.** Set maximum concurrency to 80 (the default) and enable instance-based billing to ensure CPU is always available.

## Question 145

**Domain:** Deploying applications

**Question:** Your company has a Cloud Run service that connects to a Cloud SQL instance in a VPC network through a Serverless VPC Access connector. The security team requires that all outbound traffic from the Cloud Run service must go through the VPC network to enforce firewall rules and use Cloud NAT for external API calls. How should you configure the Cloud Run service to meet this requirement?

**Correct answer:** B. Configure the VPC egress setting to 'Route all traffic to the VPC' when deploying the Cloud Run service with the connector.

**Options:**

- **A.** Configure VPC Service Controls to create a service perimeter that includes the Cloud Run service and requires egress rules.
- **B.** Configure the VPC egress setting to 'Route all traffic to the VPC' when deploying the Cloud Run service with the connector. — _correct answer_
- **C.** Configure the VPC egress setting to 'Route only requests to private IPs to the VPC' and add static routes for external APIs.
- **D.** Create a Cloud Armor security policy and attach it to the Cloud Run service to control egress traffic.

## Question 146

**Domain:** Deploying applications

**Question:** Your security team requires that all container images deployed to your GKE cluster have verified build attestations generated by Cloud Build. You are configuring a cloudbuild.yaml file to build and push images to Artifact Registry. What should you do to ensure attestations are generated for your container images?

**Correct answer:** C. Specify the container images in the images field of the cloudbuild.yaml file instead of using an explicit docker push build step.

**Options:**

- **A.** Enable the Container Analysis API and add a containeranalysis build step after the docker push step.
- **B.** Use a docker build step followed by a docker push build step, and configure the Binary Authorization API to scan for attestations.
- **C.** Specify the container images in the images field of the cloudbuild.yaml file instead of using an explicit docker push build step. — _correct answer_
- **D.** Configure the built-by-cloud-build attestor in the same cloudbuild.yaml file that contains the docker push step.

## Question 147

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Run service that connects to a Cloud SQL PostgreSQL database with a maximum connection limit of 100. Your service experiences variable traffic patterns and needs to autoscale efficiently while preventing database connection exhaustion. Each instance maintains a connection pool of 10 connections. What is the recommended approach to configure scaling?

**Correct answer:** A. Set the maximum instances to 10 to ensure total connections do not exceed the database limit.

**Options:**

- **A.** Set the maximum instances to 10 to ensure total connections do not exceed the database limit. — _correct answer_
- **B.** Set the maximum concurrency to 10 to match the connection pool size per instance.
- **C.** Configure minimum instances to 10 to pre-establish all database connections.
- **D.** Use manual scaling with a fixed instance count of 10 instances to guarantee stable connections.

## Question 148

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that requires a database password from Secret Manager. Your security team mandates that secret versions must be explicitly pinned to prevent unexpected changes from affecting production workloads. Which configuration approach should you use?

**Correct answer:** C. Configure the Cloud Run service to reference the secret using a specific version number (e.g., 'DB_PASSWORD=db-password:2') and update the version through your deployment pipeline when rotation occurs.

**Options:**

- **A.** Create an immutable Cloud Run revision that embeds the secret value in the container image to ensure the value never changes.
- **B.** Mount the secret as a read-only volume and configure file system permissions to prevent any process from modifying the mounted secret.
- **C.** Configure the Cloud Run service to reference the secret using a specific version number (e.g., 'DB_PASSWORD=db-password:2') and update the version through your deployment pipeline when rotation occurs. — _correct answer_
- **D.** Configure the Cloud Run service to use the 'latest' alias and implement application-level caching to prevent automatic updates from affecting the running service.

## Question 149

**Domain:** Deploying applications

**Question:** Your organization uses Shared VPC with Cloud Run services deployed in a service project. You need to create a Serverless VPC Access connector to allow a Cloud Run service to connect to resources in the Shared VPC network. The connector will be created in the service project. What must the Shared VPC Admin do before you can create the connector?

**Correct answer:** B. Create a dedicated /28 subnet in the Shared VPC network in the same region as the Cloud Run service for the connector to use.

**Options:**

- **A.** Configure VPC peering between the service project's default network and the Shared VPC network with appropriate firewall rules.
- **B.** Create a dedicated /28 subnet in the Shared VPC network in the same region as the Cloud Run service for the connector to use. — _correct answer_
- **C.** Enable the Serverless VPC Access API in the host project and grant compute.networkUser role to the service project's Cloud Run service account.
- **D.** Deploy a Cloud NAT gateway in the Shared VPC host project to enable outbound connectivity from the serverless connector to internal resources.

## Question 150

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that lists all objects in a Cloud Storage bucket containing over 100,000 files. Users report that the application is slow when retrieving the complete object list. You need to implement pagination to efficiently handle large result sets while maintaining application responsiveness. Which approach should you use when calling the Cloud Storage JSON API?

**Correct answer:** A. Use the maxResults query parameter to limit items per page, then pass the nextPageToken from each response to the pageToken parameter in subsequent requests until no nextPageToken is returned.

**Options:**

- **A.** Use the maxResults query parameter to limit items per page, then pass the nextPageToken from each response to the pageToken parameter in subsequent requests until no nextPageToken is returned. — _correct answer_
- **B.** Use the startAfter query parameter with the name of the last object retrieved to get the next page of results, continuing until the response contains fewer items than requested.
- **C.** Use the cursor query parameter returned in each response header to fetch subsequent pages, stopping when the cursor value is null.
- **D.** Use the offset query parameter to skip items already retrieved, incrementing the offset value by the page size for each subsequent request until no items are returned.

## Question 151

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is implementing a secret lifecycle management policy. When a secret version needs to be retired, you must ensure the version can be recovered if applications still depend on it before permanent deletion. You want to implement this policy while minimizing the risk of outages. What should you do?

**Correct answer:** D. Disable the secret version first, wait a defined period to confirm no applications depend on it, then destroy the version.

**Options:**

- **A.** Create a new secret version with an empty value to indicate deprecation, and configure applications to check for empty values.
- **B.** Destroy the secret version immediately and rely on Cloud Audit Logs to identify any applications that fail to access it.
- **C.** Configure a secret expiration policy so the version is automatically deleted after a specified duration.
- **D.** Disable the secret version first, wait a defined period to confirm no applications depend on it, then destroy the version. — _correct answer_

## Question 152

**Domain:** Building and testing applications

**Question:** You are implementing a Cloud Build CI/CD pipeline that runs integration tests against a deployed application. Some tests are expected to fail intermittently due to external service dependencies. You want these specific tests to continue without failing the entire build while still failing the build for unexpected test failures with other exit codes. How should you configure the test step in your cloudbuild.yaml?

**Correct answer:** C. Use the 'allowExitCodes' field to specify the expected exit codes that should not fail the build while still failing on unexpected exit codes.

**Options:**

- **A.** Configure a separate build step to analyze test results and explicitly fail the build using a script if unexpected failures are detected.
- **B.** Use the 'allowFailure: true' field to ensure the build continues regardless of any test failures and manually review test logs after the build.
- **C.** Use the 'allowExitCodes' field to specify the expected exit codes that should not fail the build while still failing on unexpected exit codes. — _correct answer_
- **D.** Set the step 'timeout' to a very short duration so intermittent failures will cause the step to timeout instead of returning a failure exit code.

## Question 153

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization is deploying a new microservices application on GKE that requires secure connections to multiple Cloud SQL instances. You need to minimize operational overhead while ensuring encrypted connections and automatic credential rotation. You want to follow Google-recommended practices for Kubernetes deployments. What should you do?

**Correct answer:** D. Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod that requires database access, and use Workload Identity to authenticate to Cloud SQL.

**Options:**

- **A.** Install the Cloud SQL Auth Proxy as a single DaemonSet on each GKE node and share connections across all pods.
- **B.** Configure each microservice to connect directly to Cloud SQL public IP addresses with SSL certificates stored in Kubernetes Secrets.
- **C.** Export Cloud SQL service account keys as JSON files and mount them as Kubernetes ConfigMaps in application pods.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod that requires database access, and use Workload Identity to authenticate to Cloud SQL. — _correct answer_

## Question 154

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an IoT data collection application that stores sensor readings from millions of devices. Each reading includes a device ID and timestamp. Your application frequently queries data for specific devices over time ranges. Users report slow read performance when querying recent data. You discover writes are concentrated on a small number of nodes. What should you do to improve performance?

**Correct answer:** B. Use the device ID as the row key prefix followed by a reverse timestamp, such as device_id#reverse_timestamp.

**Options:**

- **A.** Use a timestamp as the row key prefix followed by the device ID, such as timestamp#device_id.
- **B.** Use the device ID as the row key prefix followed by a reverse timestamp, such as device_id#reverse_timestamp. — _correct answer_
- **C.** Store all sensor readings in a single row per device and use cell timestamps to track different readings.
- **D.** Hash the combination of device ID and timestamp to create a random row key distribution.

## Question 155

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company runs a microservices application on GKE. Multiple services connect to the same Cloud SQL for PostgreSQL instance using the Cloud SQL Auth Proxy deployed as a sidecar container. You notice that during high-traffic periods, services are exhausting database connections. You want to implement a solution that reduces connection overhead without modifying application code. What should you do?

**Correct answer:** C. Enable Managed Connection Pooling on the Cloud SQL Enterprise Plus edition instance and configure services to connect via port 6432 for direct connections or port 3307 via Cloud SQL Auth Proxy.

**Options:**

- **A.** Configure each Cloud SQL Auth Proxy sidecar with the --max-connections flag to implement connection pooling at the proxy layer before reaching the database.
- **B.** Deploy a centralized PgBouncer instance as a separate GKE deployment and configure all services to connect through it instead of directly to Cloud SQL.
- **C.** Enable Managed Connection Pooling on the Cloud SQL Enterprise Plus edition instance and configure services to connect via port 6432 for direct connections or port 3307 via Cloud SQL Auth Proxy. — _correct answer_
- **D.** Increase the max_connections database flag on the Cloud SQL instance proportionally to the number of microservices multiplied by their replica count.

## Question 156

**Domain:** Deploying applications

**Question:** You are deploying a web application on GKE and need to configure custom health check parameters for the Cloud Load Balancer created by your Ingress. Your application's health endpoint responds on '/health' instead of the default '/' path, and requires a longer timeout than the default 5 seconds due to initialization complexity. What should you do to configure these custom health check settings?

**Correct answer:** B. Create a BackendConfig resource with the custom health check path and timeout values. Reference the BackendConfig in your Service using the 'cloud.google.com/backend-config' annotation with the BackendConfig name.

**Options:**

- **A.** Create a FrontendConfig resource with the custom health check path and timeout values. Reference the FrontendConfig in your Ingress using the 'networking.gke.io/v1beta1.FrontendConfig' annotation.
- **B.** Create a BackendConfig resource with the custom health check path and timeout values. Reference the BackendConfig in your Service using the 'cloud.google.com/backend-config' annotation with the BackendConfig name. — _correct answer_
- **C.** Configure a readinessProbe in your Pod specification with the '/health' path and increase the timeoutSeconds. The GKE Ingress controller will automatically derive the load balancer health check parameters from the readiness probe definition.
- **D.** Modify the Compute Engine health check directly in the Google Cloud console after the Ingress creates the load balancer. Set the request path to '/health' and adjust the timeout value as needed.

## Question 157

**Domain:** Building and testing applications

**Question:** You have completed local development testing of your application and want to remove the ADC credentials stored on your workstation for security reasons. The credentials were created using gcloud auth application-default login. What should you do?

**Correct answer:** D. Run gcloud auth application-default revoke to remove the local ADC credentials.

**Options:**

- **A.** Run gcloud auth revoke to remove all gcloud CLI and ADC credentials from your workstation.
- **B.** Delete the application_default_credentials.json file from the gcloud configuration directory manually.
- **C.** Run gcloud config unset auth/application_default_credentials to clear the ADC configuration.
- **D.** Run gcloud auth application-default revoke to remove the local ADC credentials. — _correct answer_

## Question 158

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company requires application logs to be stored in Cloud Storage for long-term archival and in BigQuery for real-time analytics. You need to route the same logs to both destinations without duplicating the log entry processing. What should you do?

**Correct answer:** D. Create two log sinks with the same inclusion filter: one with Cloud Storage as the destination and one with BigQuery as the destination.

**Options:**

- **A.** Create a log sink to BigQuery and configure a BigQuery scheduled export to Cloud Storage for archival purposes.
- **B.** Create a single log sink to Pub/Sub, then configure Pub/Sub subscribers to write to both Cloud Storage and BigQuery.
- **C.** Create a log sink to a log bucket, then configure the bucket to export logs to both Cloud Storage and BigQuery.
- **D.** Create two log sinks with the same inclusion filter: one with Cloud Storage as the destination and one with BigQuery as the destination. — _correct answer_

## Question 159

**Domain:** Deploying applications

**Question:** You are configuring Cloud Build to push container images to an Artifact Registry repository in a different project. The build is failing with permission denied errors when attempting to push. Your organization has disabled automatic IAM role grants for default service accounts. What is the minimum IAM role you need to grant to resolve this issue?

**Correct answer:** C. Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the Cloud Build service account on the target Artifact Registry repository.

**Options:**

- **A.** Grant the Artifact Registry Administrator role (roles/artifactregistry.admin) to the Cloud Build service account at the project level.
- **B.** Grant the Cloud Build Service Account role (roles/cloudbuild.builds.builder) to the Artifact Registry service agent.
- **C.** Grant the Artifact Registry Writer role (roles/artifactregistry.writer) to the Cloud Build service account on the target Artifact Registry repository. — _correct answer_
- **D.** Grant the Storage Object Admin role (roles/storage.objectAdmin) to the Cloud Build service account on the storage bucket backing the Artifact Registry.

## Question 160

**Domain:** Deploying applications

**Question:** You have deployed a GKE application exposed through an external Ingress with HTTPS enabled. Your application uses WebSocket connections that frequently time out after 30 seconds. You need to configure the backend service timeout to accommodate longer-lived WebSocket connections. How should you accomplish this?

**Correct answer:** D. Create a BackendConfig resource with a custom timeoutSec value and reference it from your Service using the cloud.google.com/backend-config annotation.

**Options:**

- **A.** Create a FrontendConfig resource with a custom timeout value and reference it from your Ingress using the networking.gke.io/v1beta1.FrontendConfig annotation.
- **B.** Configure the terminationGracePeriodSeconds setting on your Pod specification to extend the WebSocket connection timeout at the application level.
- **C.** Modify the timeout setting directly on the Compute Engine backend service using gcloud compute backend-services update command with the --timeout flag.
- **D.** Create a BackendConfig resource with a custom timeoutSec value and reference it from your Service using the cloud.google.com/backend-config annotation. — _correct answer_

## Question 161

**Domain:** Deploying applications

**Question:** You are deploying applications to GKE that need to access sensitive credentials stored in Secret Manager. You want to follow Google-recommended best practices for authentication and avoid managing service account keys. What should you do?

**Correct answer:** A. Enable Workload Identity Federation for GKE. Create a Kubernetes ServiceAccount and configure an IAM allow policy to grant the ServiceAccount access to the secrets in Secret Manager.

**Options:**

- **A.** Enable Workload Identity Federation for GKE. Create a Kubernetes ServiceAccount and configure an IAM allow policy to grant the ServiceAccount access to the secrets in Secret Manager. — _correct answer_
- **B.** Create a Google service account with Secret Manager access. Download the service account key JSON file and create a Kubernetes Secret containing the key file for your application to use.
- **C.** Enable the Secret Manager add-on and create SecretProviderClass resources. Mount the secrets directly as volumes without any additional IAM configuration.
- **D.** Configure the node pool to use a custom service account with Secret Manager permissions. All pods on those nodes will inherit the permissions automatically.

## Question 162

**Domain:** Deploying applications

**Question:** Your organization requires all egress traffic from Cloud Run services to be routed through the VPC network for security auditing and firewall rule enforcement. The Cloud Run services connect to internal databases and also make calls to external third-party APIs. How should you configure the VPC egress setting for the Cloud Run services?

**Correct answer:** B. Set the VPC egress setting to all-traffic to route all outbound requests through the VPC network.

**Options:**

- **A.** Enable Private Google Access on the subnet and set VPC egress to private-ranges-only for comprehensive traffic routing.
- **B.** Set the VPC egress setting to all-traffic to route all outbound requests through the VPC network. — _correct answer_
- **C.** Set the VPC egress setting to private-ranges-only since this automatically includes external API traffic for auditing.
- **D.** Configure two separate Serverless VPC Access connectors, one for internal traffic and one for external traffic.

## Question 163

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a hotel booking application using Cloud Firestore. Users can search for hotels by filtering on multiple fields: city, star_rating, and price range. Users often sort results by price in ascending order. Your queries that filter by city and star_rating while ordering by price are failing with an error. What should you do to resolve this issue?

**Correct answer:** C. Create a composite index that includes the city, star_rating, and price fields with the appropriate sort direction for each field.

**Options:**

- **A.** Use collection group queries instead of standard collection queries to enable filtering across multiple fields.
- **B.** Denormalize your data by adding a combined_filter field that concatenates city, star_rating, and price into a single string value.
- **C.** Create a composite index that includes the city, star_rating, and price fields with the appropriate sort direction for each field. — _correct answer_
- **D.** Add single-field index exemptions for city, star_rating, and price fields to enable the combined query.

## Question 164

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a caching layer for a high-traffic leaderboard application deployed on GKE. The application requires sub-millisecond read latency and must handle sudden traffic spikes during gaming events. Your Redis workload is primarily read-intensive with occasional writes. You need to select the appropriate Memorystore configuration. What should you do?

**Correct answer:** A. Deploy a Memorystore for Redis Standard Tier instance with read replicas enabled to scale read throughput and provide high availability with automatic failover.

**Options:**

- **A.** Deploy a Memorystore for Redis Standard Tier instance with read replicas enabled to scale read throughput and provide high availability with automatic failover. — _correct answer_
- **B.** Deploy a Memorystore for Redis Basic Tier instance in multiple zones and use client-side load balancing to distribute read traffic across the instances.
- **C.** Deploy a Memorystore for Redis Standard Tier instance and configure Cloud CDN in front of it to cache leaderboard responses and absorb traffic spikes.
- **D.** Deploy a Memorystore for Redis Basic Tier instance with RDB snapshots enabled to provide data durability and fast recovery during traffic spikes.

## Question 165

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your gaming application uses Memorystore for Redis to store real-time leaderboard data. During peak gaming hours, read requests to the cache are significantly higher than write requests, and you are experiencing latency issues. You need to scale the read throughput of your Memorystore instance without affecting write operations. What should you do?

**Correct answer:** A. Enable read replicas on your Standard Tier Memorystore for Redis instance and configure your application to use the read endpoint for read queries.

**Options:**

- **A.** Enable read replicas on your Standard Tier Memorystore for Redis instance and configure your application to use the read endpoint for read queries. — _correct answer_
- **B.** Deploy multiple Basic Tier Memorystore for Redis instances and implement client-side sharding to distribute read requests across instances.
- **C.** Upgrade your Memorystore for Redis instance to Redis version 6.x to enable multi-threaded I/O and double the read performance automatically.
- **D.** Scale up the Memorystore for Redis instance capacity to a larger size to increase overall throughput for both read and write operations.

## Question 166

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a real-time analytics dashboard that runs on Compute Engine and caches frequently accessed query results in Memorystore for Redis. The cache stores results from various queries, but some results should expire faster than others based on data volatility. You want to configure an eviction policy that prioritizes removing the least recently used keys that have TTL expirations set. What configuration should you use?

**Correct answer:** A. Use the default volatile-lru eviction policy and ensure all cached query results have appropriate TTL values set using the EXPIRE command.

**Options:**

- **A.** Use the default volatile-lru eviction policy and ensure all cached query results have appropriate TTL values set using the EXPIRE command. — _correct answer_
- **B.** Enable the volatile-ttl eviction policy to evict keys with the longest remaining TTL to preserve frequently refreshed cache entries.
- **C.** Set the noeviction policy and manually delete expired keys using a scheduled Cloud Function that runs KEYS command periodically.
- **D.** Configure the allkeys-lru eviction policy to ensure all keys are eligible for eviction based on least recent usage regardless of TTL settings.

## Question 167

**Domain:** Building and testing applications

**Question:** Your team is implementing canary deployments for a Cloud Run service using Cloud Deploy. During your first deployment using the canary strategy with 25%, 50%, and 75% phases configured, you notice that Cloud Deploy skipped all canary phases and deployed directly to 100% (stable phase). What is the most likely reason for this behavior?

**Correct answer:** D. The application had not been previously deployed to Cloud Run, so Cloud Deploy skipped the canary phases since there was no existing revision to split traffic with.

**Options:**

- **A.** The Cloud Run service definition file included a traffic stanza that overrode the Cloud Deploy canary configuration.
- **B.** The Cloud Deploy delivery pipeline was missing the runtimeConfig.cloudRun.automaticTrafficControl setting required for canary deployments.
- **C.** The canary deployment configuration in Cloud Deploy was invalid because percentages should include 100 in the list of increments.
- **D.** The application had not been previously deployed to Cloud Run, so Cloud Deploy skipped the canary phases since there was no existing revision to split traffic with. — _correct answer_

## Question 168

**Domain:** Building and testing applications

**Question:** You are configuring Cloud Build to run integration tests as part of your CI/CD pipeline. Some integration tests occasionally produce flaky results with exit code 1, while genuine failures return exit code 2. You want the build to continue when tests are flaky but fail the entire build when genuine test failures occur. What should you configure in your cloudbuild.yaml file?

**Correct answer:** B. Add 'allowExitCodes: [1]' to the integration test build step to allow the build to continue when tests exit with code 1 while failing on code 2.

**Options:**

- **A.** Add 'allowFailure: true' to the integration test build step to allow the build to continue regardless of the exit code returned by the tests.
- **B.** Add 'allowExitCodes: [1]' to the integration test build step to allow the build to continue when tests exit with code 1 while failing on code 2. — _correct answer_
- **C.** Add 'timeout: 60s' to the integration test build step to give flaky tests sufficient time to complete successfully before marking them as failed.
- **D.** Add 'script: set +e' at the beginning of the integration test build step to ignore all errors and continue the build regardless of the test results.

## Question 169

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team has deployed an application using Cloud Bigtable as the backend datastore. Users are reporting intermittent latency spikes, and you suspect hotspots may be affecting specific row key ranges. You need to identify which row keys are causing performance issues to determine if a schema redesign is required. What should you do?

**Correct answer:** D. Use Key Visualizer to generate heatmaps showing access patterns and identify row key ranges with disproportionate read or write traffic.

**Options:**

- **A.** Enable Cloud Monitoring and check the average CPU utilization metric across all nodes in the cluster to identify performance bottlenecks.
- **B.** Add application-level logging to track the row keys accessed by each request and analyze the logs to find frequently accessed rows.
- **C.** Increase the number of nodes in the cluster to reduce CPU pressure and eliminate the latency spikes caused by resource constraints.
- **D.** Use Key Visualizer to generate heatmaps showing access patterns and identify row key ranges with disproportionate read or write traffic. — _correct answer_

## Question 170

**Domain:** Deploying applications

**Question:** You are deploying a new Cloud Run service that needs to access database credentials stored in Secret Manager. The service uses a dedicated service account named 'my-app-sa'. When you attempt to deploy the service, you receive an error stating that the service identity does not have access to the secret. What should you do?

**Correct answer:** D. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the my-app-sa service account on the specific secret.

**Options:**

- **A.** Grant the Secret Manager Viewer role (roles/secretmanager.viewer) to the my-app-sa service account on the specific secret.
- **B.** Add the my-app-sa service account to the default Compute Engine service account's IAM policy as a member.
- **C.** Grant the Secret Manager Admin role (roles/secretmanager.admin) to the my-app-sa service account at the project level.
- **D.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the my-app-sa service account on the specific secret. — _correct answer_
