# gcp-professional-cloud-developer-quiz-test #2

## Question 1

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a high-throughput application using Cloud Firestore that creates thousands of event documents per second. You notice increased write latency and hotspotting errors. Each document includes a timestamp field that is automatically indexed. You do not need to query events by their timestamp. What should you do?

**Correct answer:** A. Create a single-field index exemption for the timestamp field to exclude it from automatic indexing.

**Options:**

- **A.** Create a single-field index exemption for the timestamp field to exclude it from automatic indexing. — _correct answer_
- **B.** Increase the Firestore database quotas by contacting Google Cloud support to handle higher write throughput.
- **C.** Use monotonically increasing document IDs to distribute writes more evenly across the key range.
- **D.** Shard your events collection into multiple subcollections based on the event timestamp's hour value.

## Question 2

**Domain:** Building and testing applications

**Question:** You are setting up Cloud Code in VS Code to debug a containerized Java application running on a local minikube cluster. When you start a debugging session using Debug on Kubernetes, Cloud Code fails to attach the debugger. What is the most likely configuration issue?

**Correct answer:** D. The cloudcode.kubernetes launch configuration does not exist in the .vscode/launch.json file, preventing Cloud Code from properly setting up the debug session.

**Options:**

- **A.** The JAVA_TOOL_OPTIONS environment variable is not set in the container, which is required for Java debugging with Cloud Code.
- **B.** The port forwarding for the JDWP debug port must be manually configured in the Kubernetes service manifest before debugging can work.
- **C.** The minikube cluster is running without Docker driver support, which is required for Cloud Code debugging integration.
- **D.** The cloudcode.kubernetes launch configuration does not exist in the .vscode/launch.json file, preventing Cloud Code from properly setting up the debug session. — _correct answer_

## Question 3

**Domain:** Building and testing applications

**Question:** You are developing a CI/CD pipeline using Cloud Build for your microservices application. Your pipeline needs to run unit tests and security scans in parallel to reduce build time, then run integration tests only after both parallel steps complete successfully. How should you configure your cloudbuild.yaml file to achieve this build step order?

**Correct answer:** B. Use the id field to identify the unit test and security scan steps, add waitFor: ['-'] to both steps to run them in parallel from build start, and configure the integration test step to waitFor both step IDs.

**Options:**

- **A.** Remove the waitFor field from all steps since Cloud Build automatically parallelizes steps when possible and runs integration tests last based on step definition order.
- **B.** Use the id field to identify the unit test and security scan steps, add waitFor: ['-'] to both steps to run them in parallel from build start, and configure the integration test step to waitFor both step IDs. — _correct answer_
- **C.** Create separate Cloud Build configuration files for each test type and chain them using Cloud Build triggers with Pub/Sub notifications between builds.
- **D.** Configure two separate triggers to run concurrently and use a third trigger with a filter to run integration tests when both complete.

## Question 4

**Domain:** Deploying applications

**Question:** You are developing a Cloud Run service that needs to access database credentials stored in Secret Manager. The service uses a custom service account for its identity. When you deploy the service with the secret referenced as an environment variable, the deployment fails. What should you do to resolve this issue?

**Correct answer:** C. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service identity on the secret.

**Options:**

- **A.** Enable the Secret Manager API in the project and redeploy the Cloud Run service using the same configuration.
- **B.** Add the Secret Manager API (secretmanager.googleapis.com) to the Cloud Run service's VPC connector configuration.
- **C.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) to the Cloud Run service identity on the secret. — _correct answer_
- **D.** Grant the Secret Manager Admin role (roles/secretmanager.admin) to the Cloud Run default service account at the project level.

## Question 5

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is building an IoT platform that collects sensor data from thousands of devices. Each sensor reports temperature readings every second. You need to design a Cloud Bigtable schema that allows efficient retrieval of time-series data for specific devices while avoiding performance bottlenecks. Which row key design should you use?

**Correct answer:** B. Use a row key format of deviceId#timestamp, where deviceId is a unique identifier and timestamp records when the reading occurred.

**Options:**

- **A.** Use a row key format of timestamp#deviceId, with the timestamp representing when the reading occurred followed by the device identifier.
- **B.** Use a row key format of deviceId#timestamp, where deviceId is a unique identifier and timestamp records when the reading occurred. — _correct answer_
- **C.** Use a row key format of reversedTimestamp#deviceId, where the timestamp is reversed to enable retrieval of most recent data first.
- **D.** Use a row key format of randomHash#timestamp#deviceId to ensure maximum distribution of writes across the cluster.

## Question 6

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service using Cloud Code in VS Code. You want to iterate quickly on your application by testing changes locally before deploying to Cloud Run. The service should automatically rebuild and redeploy whenever you save changes to your code. What should you do?

**Correct answer:** D. Run the 'Run on Cloud Run Emulator' command from the VS Code Command Palette and ensure the watch mode option is enabled in the launch configuration.

**Options:**

- **A.** Install the Cloud Run emulator CLI separately and run 'gcloud beta emulators run' command with the --hot-reload flag to enable automatic redeployment.
- **B.** Deploy your service to Cloud Run with the --source flag and configure Cloud Build triggers to automatically rebuild on every commit you push.
- **C.** Configure a Docker Compose file to run the Cloud Run container locally and use VS Code's built-in file watcher to trigger docker-compose up on file changes.
- **D.** Run the 'Run on Cloud Run Emulator' command from the VS Code Command Palette and ensure the watch mode option is enabled in the launch configuration. — _correct answer_

## Question 7

**Domain:** Deploying applications

**Question:** Your team operates a multi-service application on GKE. You need to be notified whenever a specific error pattern appears in your container logs. The error pattern includes the text 'connection timeout' and you want to receive notifications within minutes of the error occurring. What should you do?

**Correct answer:** C. Create a log-based alerting policy in Cloud Logging with a filter that matches log entries containing the error pattern.

**Options:**

- **A.** Create a user-defined counter log-based metric in Cloud Logging to count matching log entries, then create a metric-based alerting policy in Cloud Monitoring.
- **B.** Export all container logs to BigQuery using a logging sink, then create a scheduled query to detect the error pattern and send alerts.
- **C.** Create a log-based alerting policy in Cloud Logging with a filter that matches log entries containing the error pattern. — _correct answer_
- **D.** Configure a Cloud Logging sink to export logs to Pub/Sub, then create a Cloud Run function to parse logs and send email notifications.

## Question 8

**Domain:** Deploying applications

**Question:** Your team is experiencing increased traffic to a Cloud Run application that uses a Serverless VPC Access connector to communicate with backend services in a VPC. The connector has scaled up from 2 instances to 8 instances during peak hours. After traffic decreases, what happens to the connector instances?

**Correct answer:** D. The connector remains at 8 instances because Serverless VPC Access connectors do not scale back down after scaling up.

**Options:**

- **A.** The connector immediately scales down to 2 instances when traffic decreases below a threshold.
- **B.** The connector gradually scales down to the minimum instances over 24 hours to prevent disruption.
- **C.** The connector scales down to the minimum configured instances based on a cooldown period.
- **D.** The connector remains at 8 instances because Serverless VPC Access connectors do not scale back down after scaling up. — _correct answer_

## Question 9

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on Cloud Run uses Memorystore for Redis to cache session data. Users report receiving HTTP 500 errors when accessing your application. Investigation shows that the Cloud Run service cannot connect to the Memorystore instance. The Memorystore instance and Cloud Run service are both configured correctly with valid IP addresses and ports. What is the most likely cause of this connectivity issue?

**Correct answer:** A. The Serverless VPC Access connector was created in a different region than the Cloud Run service, preventing network connectivity to Memorystore.

**Options:**

- **A.** The Serverless VPC Access connector was created in a different region than the Cloud Run service, preventing network connectivity to Memorystore. — _correct answer_
- **B.** The Memorystore instance was deployed using Basic Tier, which does not support connections from Cloud Run services.
- **C.** The Cloud Run service was deployed with the default network egress setting, which prevents any outbound connections to internal IP addresses.
- **D.** The Memorystore instance requires in-transit encryption to be enabled before Cloud Run services can establish a connection to it.

## Question 10

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization has multiple GKE clusters in the same Google Cloud project. You want to grant all Pods in a specific Kubernetes namespace across all clusters read access to a Cloud Storage bucket. You want to minimize configuration complexity while following security best practices. What should you do?

**Correct answer:** B. Create an IAM allow policy using the principalSet notation to reference all workloads in the namespace across the project's workload identity pool, and grant the Storage Object Viewer role on the Cloud Storage bucket.

**Options:**

- **A.** Create a single IAM service account with Storage Object Viewer role. In each cluster, create a Kubernetes ServiceAccount with the same name in the target namespace and link it to the IAM service account using Workload Identity annotations.
- **B.** Create an IAM allow policy using the principalSet notation to reference all workloads in the namespace across the project's workload identity pool, and grant the Storage Object Viewer role on the Cloud Storage bucket. — _correct answer_
- **C.** Export a service account key and store it as a Secret in the target namespace of each cluster. Configure all Pods in the namespace to mount this Secret.
- **D.** Create a custom IAM role with storage.objects.get permission. Grant this role at the project level to the Compute Engine default service account used by all GKE nodes.

## Question 11

**Domain:** Deploying applications

**Question:** Your organization has a central Artifact Registry Docker repository in a shared services project. You need to configure a GKE cluster in a separate application project to pull container images from this central repository. The GKE cluster uses the Compute Engine default service account. What is the minimum configuration required?

**Correct answer:** C. Grant the Artifact Registry Reader role (roles/artifactregistry.reader) to the GKE node service account on the Artifact Registry repository in the shared services project.

**Options:**

- **A.** Enable the Artifact Registry API in the application project and configure VPC peering between the two projects to allow image pulls.
- **B.** Create a mirror of the central repository in the application project and configure Cloud Build triggers to synchronize images automatically.
- **C.** Grant the Artifact Registry Reader role (roles/artifactregistry.reader) to the GKE node service account on the Artifact Registry repository in the shared services project. — _correct answer_
- **D.** Configure imagePullSecrets in your Kubernetes deployment manifests with service account credentials that have Storage Object Viewer permissions on the shared services project.

## Question 12

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an application with Cloud Firestore that needs to update 200 product documents with new pricing information. You do not need to read any documents or make decisions based on current values. You want to minimize latency and avoid transaction contention. What should you do?

**Correct answer:** C. Use a batched write to group the update operations and commit them atomically without reading documents.

**Options:**

- **A.** Use the bulk writer with the 500/50/5 rule to gradually ramp up parallel writes for large batch operations.
- **B.** Execute 200 individual update operations in parallel using Promise.all() to maximize throughput.
- **C.** Use a batched write to group the update operations and commit them atomically without reading documents. — _correct answer_
- **D.** Use a Firestore transaction to read all 200 documents first, then write the updated prices to ensure consistency.

## Question 13

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks queue dispatches tasks to a Cloud Run service. During peak traffic, your service occasionally returns HTTP 429 Too Many Requests and HTTP 503 Service Unavailable errors. You notice that Cloud Tasks is slowing down task dispatches beyond your configured rate limits. What causes this behavior?

**Correct answer:** C. Cloud Tasks uses a higher backoff rate when workers return 429 or 503 errors to prevent overloading the target service through system throttling.

**Options:**

- **A.** Cloud Tasks permanently reduces the dispatch rate after receiving 5xx errors until the queue is manually reset.
- **B.** The queue has been automatically paused due to exceeding the maximum error threshold configured in the retry settings.
- **C.** Cloud Tasks uses a higher backoff rate when workers return 429 or 503 errors to prevent overloading the target service through system throttling. — _correct answer_
- **D.** The Retry-After header from your service is being ignored, and Cloud Tasks is applying its own internal rate limiting algorithm.

## Question 14

**Domain:** Deploying applications

**Question:** You are building a containerized application with Cloud Build and need to push the resulting image to Artifact Registry for deployment to GKE. You want to use Cloud Build substitutions to make your cloudbuild.yaml reusable across different environments. Which image path format correctly uses Cloud Build substitutions?

**Correct answer:** A. ${_LOCATION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}

**Options:**

- **A.** ${_LOCATION}-docker.pkg.dev/$PROJECT_ID/${_REPOSITORY}/${_IMAGE} — _correct answer_
- **B.** ${REGION}-docker.pkg.dev/$PROJECT_ID/${REPO_NAME}/${IMAGE_NAME}
- **C.** $LOCATION-docker.pkg.dev/${PROJECT_ID}/$REPOSITORY/$IMAGE
- **D.** gcr.io/$PROJECT_ID/${_REPOSITORY}/${_IMAGE}

## Question 15

**Domain:** Deploying applications

**Question:** Your team runs a production application on GKE and needs to be notified when error-level log entries occur containing specific text patterns. You want to receive notifications within minutes of these errors appearing in your logs, without writing custom code. Which approach should you use?

**Correct answer:** C. Create a log-based alerting policy in Cloud Logging with a filter that matches your specific error patterns and configure notification channels.

**Options:**

- **A.** Export your logs to BigQuery using a logging sink, then create a scheduled query that runs every minute to detect error patterns and sends emails.
- **B.** Create a user-defined log-based metric that counts log entries matching your error pattern, then create a Cloud Monitoring alerting policy that triggers when the count exceeds zero.
- **C.** Create a log-based alerting policy in Cloud Logging with a filter that matches your specific error patterns and configure notification channels. — _correct answer_
- **D.** Configure a Pub/Sub subscription for your GKE logs and deploy a Cloud Run function to parse messages and send alerts when errors are detected.

## Question 16

**Domain:** Deploying applications

**Question:** You are setting up a CI/CD pipeline where Cloud Build in your development project needs to push container images to Artifact Registry, and GKE clusters in a separate production project need to pull those images. You want to follow the principle of least privilege. What permissions should you grant?

**Correct answer:** B. Grant Artifact Registry Writer role to the Cloud Build service account, and grant Artifact Registry Reader role to the GKE node service account in the Artifact Registry project.

**Options:**

- **A.** Grant Artifact Registry Writer role to both the Cloud Build service account and the GKE node service account in the Artifact Registry project.
- **B.** Grant Artifact Registry Writer role to the Cloud Build service account, and grant Artifact Registry Reader role to the GKE node service account in the Artifact Registry project. — _correct answer_
- **C.** Grant Artifact Registry Administrator role to both the Cloud Build service account and the GKE node service account in the Artifact Registry project.
- **D.** Grant Storage Object Admin role to the Cloud Build service account and Storage Object Viewer role to the GKE node service account at the project level.

## Question 17

**Domain:** Deploying applications

**Question:** You are developing a CI/CD pipeline using Cloud Build to build container images and deploy them to a GKE cluster. Your Cloud Build pipeline is in project-A, and your Artifact Registry Docker repository is in project-B. When running the build, you receive a permission denied error when pushing the image. What should you do to resolve this issue?

**Correct answer:** A. Grant the Artifact Registry Writer role to the Cloud Build service account from project-A on the Artifact Registry repository in project-B.

**Options:**

- **A.** Grant the Artifact Registry Writer role to the Cloud Build service account from project-A on the Artifact Registry repository in project-B. — _correct answer_
- **B.** Enable the Artifact Registry API in project-A and configure automatic replication between the two projects.
- **C.** Create a new Cloud Build service account in project-B and configure the build trigger to use it for pushing images to Artifact Registry.
- **D.** Add the Cloud Build service account from project-A to the Editor basic role in project-B.

## Question 18

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a dashboard application that displays real-time data from a Firestore collection containing thousands of documents. Users report slow initial load times when opening the dashboard. You need to determine whether data is being served from the local cache or the server to help diagnose the performance issue. How should you implement this check?

**Correct answer:** C. Check the fromCache property on the SnapshotMetadata object and enable the includeMetadataChanges listen option.

**Options:**

- **A.** Use the hasPendingWrites property to verify if the data has been confirmed by the server.
- **B.** Monitor the network/active_connections metric in Cloud Monitoring to verify server communication.
- **C.** Check the fromCache property on the SnapshotMetadata object and enable the includeMetadataChanges listen option. — _correct answer_
- **D.** Compare the document update timestamps with the current time to determine data freshness.

## Question 19

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are troubleshooting authentication issues in a GKE Standard cluster with Workload Identity Federation for GKE enabled. Your application Pods are receiving 'metadata server unavailable' errors. You notice that the gke-metadata-server Pods in the kube-system namespace are in CrashLoopBackOff status. You need to identify and resolve the issue. What is the most likely cause of this problem?

**Correct answer:** A. The cluster has more than 3000 Kubernetes service accounts, causing the gke-metadata-server Pods to exceed their memory limits and crash.

**Options:**

- **A.** The cluster has more than 3000 Kubernetes service accounts, causing the gke-metadata-server Pods to exceed their memory limits and crash. — _correct answer_
- **B.** The Kubernetes ServiceAccounts used by workloads are missing the iam.gke.io/gcp-service-account annotation required for Workload Identity.
- **C.** The IAM Service Account Credentials API is not enabled in the project, preventing the metadata server from generating access tokens.
- **D.** The node pool was created without the --workload-metadata=GKE_METADATA flag, so Workload Identity is not properly configured.

## Question 20

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has 50 Google Cloud projects across multiple folders. Security policy requires that all audit logs from every project be centralized in a single log bucket for compliance analysis. The central security team should be able to create log-based metrics on the aggregated audit logs. You need to configure log routing with minimal ongoing maintenance. What should you do?

**Correct answer:** D. Create an organization-level aggregated sink that routes audit logs to a log bucket in a central observability project. Create bucket-scoped log-based metrics in the project containing the destination log bucket.

**Options:**

- **A.** Create a Pub/Sub topic and configure each project to publish audit logs to it. Create a Dataflow pipeline to process the messages and write custom metrics to Cloud Monitoring.
- **B.** Create an organization-level aggregated sink that routes audit logs to a BigQuery dataset. Use BigQuery BI Engine to create dashboards and export custom metrics to Cloud Monitoring.
- **C.** Create a log sink in each of the 50 projects to route audit logs to a central BigQuery dataset. Create a Cloud Function to periodically run queries and generate metrics from the BigQuery data.
- **D.** Create an organization-level aggregated sink that routes audit logs to a log bucket in a central observability project. Create bucket-scoped log-based metrics in the project containing the destination log bucket. — _correct answer_

## Question 21

**Domain:** Building and testing applications

**Question:** You are building a CI/CD pipeline for a microservices application using Cloud Build. The build process includes unit tests, integration tests, and deployment steps. Integration tests require the Docker image to be built first. You need to configure the build steps to ensure the integration tests run only after the Docker image is built, while unit tests should run in parallel with the Docker build step. What should you do?

**Correct answer:** A. Use the waitFor field with value ['-'] on the unit test and Docker build steps to run them concurrently. Use the id field on the Docker build step and reference it in the waitFor field of the integration test step.

**Options:**

- **A.** Use the waitFor field with value ['-'] on the unit test and Docker build steps to run them concurrently. Use the id field on the Docker build step and reference it in the waitFor field of the integration test step. — _correct answer_
- **B.** Use the timeout field on each step to ensure the unit tests complete before the integration tests start, setting a longer timeout on the Docker build step.
- **C.** Configure a separate Cloud Build trigger for integration tests and use Pub/Sub to trigger it after the main build completes.
- **D.** Place the unit test step after the integration test step in the cloudbuild.yaml file and do not specify any waitFor fields, allowing Cloud Build to automatically determine the optimal execution order.

## Question 22

**Domain:** Deploying applications

**Question:** Your security team requires that all Cloud Run services comply with VPC Service Controls to prevent data exfiltration. You need to configure your Cloud Run service to meet these requirements. Which combination of settings must you configure?

**Correct answer:** A. Configure the service to use a VPC connector or Direct VPC egress with the egress setting set to 'all-traffic', and set the ingress setting to 'internal' or 'internal-and-cloud-load-balancing'.

**Options:**

- **A.** Configure the service to use a VPC connector or Direct VPC egress with the egress setting set to 'all-traffic', and set the ingress setting to 'internal' or 'internal-and-cloud-load-balancing'. — _correct answer_
- **B.** Configure the service without VPC connectivity and set the ingress setting to 'internal' to restrict all incoming traffic to VPC sources only.
- **C.** Configure the service to use a VPC connector with the egress setting set to 'private-ranges-only', and set the ingress setting to 'all'.
- **D.** Configure the service to use Direct VPC egress with the egress setting set to 'private-ranges-only', and enable Binary Authorization for secure deployments.

## Question 23

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are running a single-threaded Python API on Cloud Run with 4 vCPUs to meet the high memory requirements of your application. During load testing, you observe that the service is not scaling out despite increasing request latency. Cloud Monitoring shows average CPU utilization across your instances remains at 25%. What should you do?

**Correct answer:** D. Lower the maximum concurrency setting to drive scaling based on request throughput instead of CPU utilization.

**Options:**

- **A.** Increase the maximum instances limit to allow Cloud Run to scale to more instances during traffic spikes.
- **B.** Switch from request-based billing to instance-based billing to ensure CPU is always available for request processing.
- **C.** Increase the CPU limit to 8 vCPUs to provide more processing capacity for incoming requests.
- **D.** Lower the maximum concurrency setting to drive scaling based on request throughput instead of CPU utilization. — _correct answer_

## Question 24

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a reporting dashboard application that performs complex read queries against a Cloud SQL for MySQL production database. The application runs on GKE and the heavy read operations are impacting the performance of the primary database instance, which also handles write operations from other applications. You need to improve the read performance of the dashboard without affecting write operations. What should you do?

**Correct answer:** D. Create a read replica of the Cloud SQL instance and configure the dashboard application to connect to the read replica for all read queries.

**Options:**

- **A.** Configure the dashboard application to use a connection pool with session affinity to the primary instance and increase the pool size.
- **B.** Create a failover replica of the Cloud SQL instance and direct all read traffic to the failover replica using a load balancer.
- **C.** Enable Managed Connection Pooling with session pooling mode on the primary instance to improve read query performance.
- **D.** Create a read replica of the Cloud SQL instance and configure the dashboard application to connect to the read replica for all read queries. — _correct answer_

## Question 25

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a microservices application running on GKE. Your operations team needs to be notified when containers are crashing frequently, which could indicate application instability. You need to create an alerting policy in Cloud Monitoring that triggers when any container restarts more than five times in a 10-minute window. What should you do?

**Correct answer:** B. Create an alerting policy with a condition that monitors the kubernetes.io/container/restart_count metric. Configure the policy to trigger when the value exceeds 5 within a 10-minute rolling window, and add notification channels for email and Slack.

**Options:**

- **A.** Create a custom metric by instrumenting your application to report restart events using OpenTelemetry. Configure an alerting policy to monitor this custom metric for threshold violations.
- **B.** Create an alerting policy with a condition that monitors the kubernetes.io/container/restart_count metric. Configure the policy to trigger when the value exceeds 5 within a 10-minute rolling window, and add notification channels for email and Slack. — _correct answer_
- **C.** Deploy a Prometheus exporter sidecar to each Pod that monitors kubelet metrics. Use Managed Service for Prometheus to scrape these metrics and create a PromQL-based alert for restart counts.
- **D.** Create an alerting policy that monitors Cloud Logging for container restart events. Configure a log-based alert to trigger when the string 'container restarted' appears more than 5 times in 10 minutes.

## Question 26

**Domain:** Deploying applications

**Question:** You have deployed an application update to your GKE cluster, but users are reporting issues with the new version. You need to quickly roll back the Deployment named 'api-service' to the previous working version while investigating the problem. Which kubectl command should you run?

**Correct answer:** C. kubectl rollout undo deployment/api-service

**Options:**

- **A.** kubectl delete deployment api-service followed by kubectl apply with the previous manifest version
- **B.** kubectl rollout restart deployment/api-service
- **C.** kubectl rollout undo deployment/api-service — _correct answer_
- **D.** kubectl scale deployment api-service --replicas=0 followed by editing the Deployment to use the previous image tag

## Question 27

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is building a REST API using Cloud Run that must process asynchronous background tasks after returning HTTP responses to clients. The API uses Node.js async operations to send telemetry data to external systems. Users report that telemetry data is occasionally missing. What should you do to ensure reliable background task execution?

**Correct answer:** B. Configure the Cloud Run service to use instance-based billing so CPU remains allocated outside of request processing.

**Options:**

- **A.** Enable startup CPU boost to provide additional CPU resources for processing both requests and background operations.
- **B.** Configure the Cloud Run service to use instance-based billing so CPU remains allocated outside of request processing. — _correct answer_
- **C.** Set a minimum instances value of 1 and keep the default request-based billing to ensure an instance is always available.
- **D.** Increase the maximum concurrency setting to 1000 to allow more parallel processing of background tasks across instances.

## Question 28

**Domain:** Deploying applications

**Question:** You are deploying a microservice on GKE that requires 30 seconds to initialize its database connections before it can accept traffic. During this initialization period, the application cannot serve requests. However, the application's main process starts successfully within 2 seconds. You want to ensure that traffic is not routed to the Pod until it is ready to accept requests. What should you configure in your Deployment YAML manifest?

**Correct answer:** A. Configure a readinessProbe with an initialDelaySeconds value of 30 and an httpGet action that checks the application's health endpoint.

**Options:**

- **A.** Configure a readinessProbe with an initialDelaySeconds value of 30 and an httpGet action that checks the application's health endpoint. — _correct answer_
- **B.** Configure a livenessProbe with an initialDelaySeconds value of 30 and an httpGet action that checks the application's health endpoint.
- **C.** Configure a startupProbe with a timeoutSeconds value of 30 and an httpGet action that checks the application's health endpoint.
- **D.** Configure the container with a preStop lifecycle hook that runs a sleep command for 30 seconds before the container starts accepting traffic.

## Question 29

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a microservices application on Google Cloud. One of your services needs to programmatically access another internal service that is protected by Identity-Aware Proxy (IAP). The calling service runs with a dedicated service account. You need to authenticate requests to the IAP-protected service following Google-recommended practices. What should you do?

**Correct answer:** C. Generate an OIDC token with the IAP OAuth 2.0 client ID as the audience and include it in the Authorization header of requests to the IAP-protected service.

**Options:**

- **A.** Create a service account key file and include the private key in a custom x-goog-iap-key header when making requests to the IAP-protected service.
- **B.** Generate a self-signed JWT with the service's URL as the audience and include it in the Proxy-Authorization header of requests to the IAP-protected service.
- **C.** Generate an OIDC token with the IAP OAuth 2.0 client ID as the audience and include it in the Authorization header of requests to the IAP-protected service. — _correct answer_
- **D.** Configure the calling service to send requests without authentication and grant the service account the IAP Policy Admin role to bypass IAP authentication.

## Question 30

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service using VS Code with the Cloud Code extension. You want to test your containerized application locally before deploying to production to ensure it behaves correctly in a Cloud Run-like environment. You need to debug the application by setting breakpoints in your code. What should you do?

**Correct answer:** A. Use the Cloud Code command palette to run the Debug on Cloud Run Emulator command, which builds your container and runs it locally with an attached debugger for setting breakpoints.

**Options:**

- **A.** Use the Cloud Code command palette to run the Debug on Cloud Run Emulator command, which builds your container and runs it locally with an attached debugger for setting breakpoints. — _correct answer_
- **B.** Build the container image manually using docker build, run it with docker run, and connect a standalone debugger to the container's debug port after manually configuring port forwarding.
- **C.** Create a docker-compose.yaml file that replicates the Cloud Run environment, then use the Docker extension in VS Code to run and debug the container with custom debugging configurations.
- **D.** Deploy your application to Cloud Run with the --allow-unauthenticated flag and use VS Code's Remote SSH extension to attach a debugger to the running container in the cloud.

## Question 31

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization runs containerized applications across multiple GKE clusters in different Google Cloud projects. You need to create a centralized monitoring dashboard and alerting policies that can view metrics from all clusters. You want to follow Google Cloud best practices for multi-project monitoring. What should you do?

**Correct answer:** D. Create a dedicated scoping project and add all project IDs containing GKE clusters to its metrics scope. Create dashboards and alerting policies in the scoping project.

**Options:**

- **A.** Create separate alerting policies in each project and configure them to send notifications to a central Pub/Sub topic. Use a Cloud Function to aggregate alerts.
- **B.** Install the Ops Agent on all GKE nodes and configure it to send metrics to a single central project using project-level routing rules.
- **C.** Export all metrics to BigQuery from each project and create dashboards using Looker Studio connected to BigQuery.
- **D.** Create a dedicated scoping project and add all project IDs containing GKE clusters to its metrics scope. Create dashboards and alerting policies in the scoping project. — _correct answer_

## Question 32

**Domain:** Deploying applications

**Question:** You have a Cloud Run service configured with a Serverless VPC Access connector to access resources in your VPC network. Your security team requires that all outbound traffic from Cloud Run services in your organization be routed through the VPC network for firewall inspection. How should you enforce this requirement?

**Correct answer:** C. Set the run.allowedVPCEgress organization policy constraint to allow only the 'all-traffic' value for all Cloud Run resources.

**Options:**

- **A.** Modify the VPC connector's machine type to the largest available option to ensure all traffic can be inspected by the connector.
- **B.** Configure VPC Service Controls with a service perimeter around the Cloud Run services and enable restricted Google APIs access.
- **C.** Set the run.allowedVPCEgress organization policy constraint to allow only the 'all-traffic' value for all Cloud Run resources. — _correct answer_
- **D.** Create a Cloud Armor security policy attached to a load balancer in front of the Cloud Run services with deny rules for external traffic.

## Question 33

**Domain:** Building and testing applications

**Question:** You are implementing a CI/CD pipeline with Cloud Build that performs canary deployments to Cloud Run. Your pipeline needs to deploy a new revision without serving traffic, run automated integration tests against it, and then gradually migrate traffic if tests pass. Which sequence correctly implements this workflow?

**Correct answer:** A. Deploy with --no-traffic and --tag flags, test using the tag URL, then use update-traffic to incrementally increase traffic percentages.

**Options:**

- **A.** Deploy with --no-traffic and --tag flags, test using the tag URL, then use update-traffic to incrementally increase traffic percentages. — _correct answer_
- **B.** Deploy with 5% traffic, run tests against the main service URL, then use update-traffic to increase traffic if error rates are acceptable.
- **C.** Use Cloud Deploy with canaryDeployment percentages of [100] to test the full deployment in production before release.
- **D.** Deploy to a separate service for testing, delete the test service, then deploy to the production service with 100% traffic.

## Question 34

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Firestore and needs to update the inventory count for a product when users make purchases. Multiple users may attempt to purchase the same product simultaneously. You need to ensure inventory counts remain accurate. What should you do?

**Correct answer:** B. Use a Firestore transaction to read the current inventory count and then write the updated count. Firestore will automatically retry the transaction if another client modifies the document concurrently.

**Options:**

- **A.** Read the inventory count using a standard get() operation, calculate the new value in your application code, and then write the update using set() with merge:true.
- **B.** Use a Firestore transaction to read the current inventory count and then write the updated count. Firestore will automatically retry the transaction if another client modifies the document concurrently. — _correct answer_
- **C.** Use FieldValue.increment() within a batched write to atomically increment the inventory count without reading the current value first.
- **D.** Use a batched write to update the inventory count, as batched writes provide atomic operations across multiple documents.

## Question 35

**Domain:** Building and testing applications

**Question:** You are developing a Python application locally that uses Cloud Client Libraries to access Google Cloud services. You want to authenticate without creating a service account key. Your user account has the necessary IAM roles. What should you do?

**Correct answer:** D. Run 'gcloud auth application-default login' to create a local ADC file with your user credentials.

**Options:**

- **A.** Run 'gcloud auth login' to authenticate your user account for the gcloud CLI.
- **B.** Create an OAuth Client ID file and set GOOGLE_APPLICATION_CREDENTIALS to point to it.
- **C.** Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to your user credentials file.
- **D.** Run 'gcloud auth application-default login' to create a local ADC file with your user credentials. — _correct answer_

## Question 36

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on GKE experiences intermittent connection failures to Memorystore for Redis during instance scaling and maintenance operations. You need to implement a resilient connection strategy that minimizes application disruptions. What should you do?

**Correct answer:** C. Implement retry logic with exponential backoff in your application code to handle temporary connection failures, and configure a connection pool to efficiently manage Redis connections.

**Options:**

- **A.** Enable Memorystore AUTH and in-transit encryption to establish persistent connections that survive instance maintenance events without requiring reconnection logic.
- **B.** Configure the GKE cluster to use a Memorystore read replica as the primary endpoint, and failover to the primary node only when the replica is unavailable.
- **C.** Implement retry logic with exponential backoff in your application code to handle temporary connection failures, and configure a connection pool to efficiently manage Redis connections. — _correct answer_
- **D.** Deploy multiple Basic Tier Memorystore instances and implement client-side sharding to distribute load, reducing the impact when any single instance undergoes maintenance.

## Question 37

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company runs a single-threaded Python API on Cloud Run with 4 vCPUs configured to meet memory requirements of 8 GiB. Users report high latency during peak traffic, but Cloud Monitoring shows the average CPU utilization across instances is only 25%. Cloud Run is not scaling out additional instances to handle the load. What should you do?

**Correct answer:** B. Lower the maximum concurrency setting to encourage Cloud Run to scale based on request throughput rather than CPU utilization.

**Options:**

- **A.** Enable startup CPU boost to provide more CPU resources during the instance startup phase.
- **B.** Lower the maximum concurrency setting to encourage Cloud Run to scale based on request throughput rather than CPU utilization. — _correct answer_
- **C.** Switch to instance-based billing to ensure CPU remains allocated continuously and allows better utilization metrics collection.
- **D.** Increase the maximum instances limit to allow Cloud Run to scale to more instances when demand increases.

## Question 38

**Domain:** Building and testing applications

**Question:** You are developing an application on your local workstation that accesses Google Cloud services. You want to use the simplest and most secure method to authenticate for local development while following Google-recommended best practices. How should you configure authentication?

**Correct answer:** A. Run 'gcloud auth application-default login' to create local ADC credentials using your user account.

**Options:**

- **A.** Run 'gcloud auth application-default login' to create local ADC credentials using your user account. — _correct answer_
- **B.** Create a service account, download its JSON key file, and set GOOGLE_APPLICATION_CREDENTIALS to the key file path.
- **C.** Embed service account credentials directly in your application source code for testing.
- **D.** Install the Cloud SDK and run 'gcloud auth login' to authenticate your development environment.

## Question 39

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application makes frequent requests to the Cloud Storage JSON API to list and retrieve objects. During high-traffic periods, you receive HTTP 429 Too Many Requests errors. According to Google Cloud best practices, how should you handle these rate limiting errors?

**Correct answer:** D. Implement exponential backoff with jitter, retrying requests with increasing delays between attempts while respecting the maximum backoff time.

**Options:**

- **A.** Immediately retry the failed request up to 10 times with a fixed 1-second delay between attempts to ensure quick recovery.
- **B.** Queue all failed requests and batch them together, then send them all at once after a 60-second cooling period to reduce API calls.
- **C.** Switch to using the XML API endpoint instead of the JSON API, as it has higher rate limits and is not subject to throttling.
- **D.** Implement exponential backoff with jitter, retrying requests with increasing delays between attempts while respecting the maximum backoff time. — _correct answer_

## Question 40

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an e-commerce application using Cloud Firestore. Your application needs to update inventory counts for multiple products when a customer completes an order. The inventory update does not depend on reading the current inventory values. You want to minimize write latency while ensuring all updates succeed or fail together. What should you do?

**Correct answer:** A. Use a batched write to update all inventory documents atomically without requiring read operations first.

**Options:**

- **A.** Use a batched write to update all inventory documents atomically without requiring read operations first. — _correct answer_
- **B.** Use a transaction to read each inventory document, calculate the new value, and then write the updated value to ensure consistency.
- **C.** Use FieldValue.increment() within a transaction to ensure atomic updates and handle concurrent modifications automatically.
- **D.** Use individual set() operations for each inventory document with retry logic implemented in the application code.

## Question 41

**Domain:** Deploying applications

**Question:** You are deploying containerized applications to GKE from Artifact Registry. Your GKE cluster and Artifact Registry repository are in the same project. When pods start, they fail with ImagePullBackOff errors indicating permission denied. The GKE cluster uses the Compute Engine default service account. What should you do?

**Correct answer:** B. Grant the Artifact Registry Reader role to the Compute Engine default service account on the repository.

**Options:**

- **A.** Create an imagePullSecret containing a service account key and reference it in the pod specification.
- **B.** Grant the Artifact Registry Reader role to the Compute Engine default service account on the repository. — _correct answer_
- **C.** Configure the GKE cluster with Workload Identity and create a Kubernetes service account linked to a Google service account with Storage Object Viewer role.
- **D.** Make the Artifact Registry repository public so that authentication is not required for pulling images.

## Question 42

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is migrating a data analytics application to Google Cloud. The application runs on GKE and needs to access BigQuery datasets protected by a VPC Service Controls perimeter. Developers need to deploy and manage the application from their corporate workstations. You want to enable secure developer access based on their device security posture and corporate network. What should you configure?

**Correct answer:** D. Create an access level in Access Context Manager with conditions for corporate IP subnetworks and device attributes. Add the access level to the service perimeter to allow context-aware access from developer workstations.

**Options:**

- **A.** Grant developers the Access Context Manager Admin role and allow them to temporarily disable the perimeter when deploying application updates to GKE clusters.
- **B.** Configure an ingress rule that allows access from any identity when the source is the corporate VPC network, and require developers to connect through a VPN to the corporate network.
- **C.** Add all developer workstation IP addresses to a firewall allowlist and configure Cloud IAM to grant BigQuery access only from those IP addresses using IAM conditions.
- **D.** Create an access level in Access Context Manager with conditions for corporate IP subnetworks and device attributes. Add the access level to the service perimeter to allow context-aware access from developer workstations. — _correct answer_

## Question 43

**Domain:** Integrating applications with Google Cloud services

**Question:** You have configured a log sink to route application logs from your Cloud Run services to a BigQuery dataset for analysis. After several days, you notice that some logs are not appearing in BigQuery. You need to diagnose why logs might be missing from the sink destination. Which system log-based metrics should you check first?

**Correct answer:** B. Check exports/error_count and exports/log_entry_count metrics filtered by the sink name to determine if the sink is routing logs and if routing errors are occurring.

**Options:**

- **A.** Check billing/bytes_ingested metric to see the total volume of logs being written to Cloud Logging to verify logs are being generated.
- **B.** Check exports/error_count and exports/log_entry_count metrics filtered by the sink name to determine if the sink is routing logs and if routing errors are occurring. — _correct answer_
- **C.** Create a custom log-based counter metric that counts log entries matching the sink's filter to compare with BigQuery row counts.
- **D.** Check exports/byte_count metric without any filters to see the total export volume across all sinks in the project.

## Question 44

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has multiple Google Cloud projects generating application logs. You created exclusion filters on the _Default sinks to reduce Cloud Logging costs by excluding DEBUG and INFO level logs. However, you notice that the user-defined log-based metric you created to count specific error messages is still counting entries from excluded logs. What explains this behavior?

**Correct answer:** A. User-defined log-based metrics are calculated from all log entries received by the Logging API, regardless of any exclusion filters applied to sinks.

**Options:**

- **A.** User-defined log-based metrics are calculated from all log entries received by the Logging API, regardless of any exclusion filters applied to sinks. — _correct answer_
- **B.** The log-based metric filter needs to be updated to include the same exclusion filter as the _Default sink to exclude DEBUG and INFO logs.
- **C.** The metric data is cached and will update to reflect the exclusion filters after the next billing cycle when Cloud Logging refreshes metrics.
- **D.** The exclusion filters are configured incorrectly and are not actually filtering out the DEBUG and INFO logs from the log sink.

## Question 45

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are configuring Identity-Aware Proxy for a Cloud Run service behind an external HTTPS load balancer. After enabling IAP, you notice that the Cloud Run service is still accessible directly via its run.app URL without authentication. How should you secure the Cloud Run service to ensure all access goes through IAP?

**Correct answer:** B. Disable the default run.app URL for the Cloud Run service to ensure all ingress comes through the load balancer where IAP authentication is enforced.

**Options:**

- **A.** Configure VPC Service Controls to create a perimeter around the Cloud Run service that blocks direct access from the internet.
- **B.** Disable the default run.app URL for the Cloud Run service to ensure all ingress comes through the load balancer where IAP authentication is enforced. — _correct answer_
- **C.** Grant the IAP service account the Cloud Run Invoker role on the service and configure IAM to deny allUsers access to the run.app URL.
- **D.** Create a Cloud Armor security policy that blocks all requests not originating from the load balancer IP addresses and attach it to the Cloud Run service.

## Question 46

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is preparing to deploy VPC Service Controls to protect sensitive data stored in BigQuery and Cloud Storage. Before enforcing the perimeter, you need to understand the impact on existing applications without disrupting production workloads. What should you do?

**Correct answer:** B. Create a service perimeter in dry run mode to log violations without blocking access, analyze the logs to identify potential issues, then enforce the perimeter after resolving configuration issues.

**Options:**

- **A.** Create a service perimeter in enforced mode in a development project, test the applications thoroughly, then delete the perimeter and recreate it in production.
- **B.** Create a service perimeter in dry run mode to log violations without blocking access, analyze the logs to identify potential issues, then enforce the perimeter after resolving configuration issues. — _correct answer_
- **C.** Deploy all services in a separate project outside the perimeter, use IAM policies to restrict access, then migrate services into the perimeter one at a time.
- **D.** Create an access level that allows all identities and IP addresses, add it to the enforced perimeter, then gradually remove permissions from the access level.

## Question 47

**Domain:** Deploying applications

**Question:** Your Cloud Run service uses a secret exposed as an environment variable. After updating the secret to a new version in Secret Manager, you notice that existing Cloud Run instances are still using the old secret value. New instances that start after the update correctly use the new value. What explains this behavior?

**Correct answer:** A. When secrets are exposed as environment variables, Cloud Run retrieves the secret value prior to starting the instance, and the value remains fixed for the lifetime of that instance.

**Options:**

- **A.** When secrets are exposed as environment variables, Cloud Run retrieves the secret value prior to starting the instance, and the value remains fixed for the lifetime of that instance. — _correct answer_
- **B.** The Cloud Run service account lost permission to access the updated secret version, causing instances to fall back to the cached old value.
- **C.** The secret was configured to use a specific version number, which prevents instances from seeing updates until the service configuration is changed.
- **D.** When secrets are exposed as environment variables, Cloud Run caches secret values at the project level and only refreshes the cache every 24 hours.

## Question 48

**Domain:** Integrating applications with Google Cloud services

**Question:** You are deploying a containerized application to GKE that connects to Cloud SQL for PostgreSQL. You need to ensure secure connections to the database using IAM authentication and want to minimize configuration complexity. The application uses the Go programming language. What is the Google-recommended approach?

**Correct answer:** A. Use the Cloud SQL Go Language Connector library in your application code to handle connections with automatic IAM authentication and encryption.

**Options:**

- **A.** Use the Cloud SQL Go Language Connector library in your application code to handle connections with automatic IAM authentication and encryption. — _correct answer_
- **B.** Install the Cloud SQL Proxy Operator on your GKE cluster and create an AuthProxyWorkload custom resource for each deployment.
- **C.** Configure direct TCP connections to Cloud SQL's private IP address with SSL certificates managed by Secret Manager.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod and configure your application to connect through the proxy using Unix sockets.

## Question 49

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for a financial application that needs to retrieve the most recent transactions for each account. Users typically query the latest 10-20 transactions when viewing their account dashboard. You need to optimize for this common query pattern while avoiding hotspots during write operations. What row key design should you implement?

**Correct answer:** C. Use account_id#reverse_timestamp as the row key, where reverse_timestamp is calculated by subtracting the actual timestamp from a large constant value.

**Options:**

- **A.** Use account_id#timestamp as the row key and retrieve recent transactions using reverse scans with a small row limit.
- **B.** Use a hash of account_id as the row key prefix followed by timestamp to ensure even data distribution.
- **C.** Use account_id#reverse_timestamp as the row key, where reverse_timestamp is calculated by subtracting the actual timestamp from a large constant value. — _correct answer_
- **D.** Use timestamp#account_id as the row key to group all transactions by time for efficient temporal queries across accounts.

## Question 50

**Domain:** Building and testing applications

**Question:** Your Cloud Build pipeline builds and pushes container images to an Artifact Registry repository in a different Google Cloud project. Builds are failing with permission denied errors when pushing images. The Cloud Build service account has the Cloud Build Editor role in the build project. What should you do to resolve this issue?

**Correct answer:** A. Grant the Artifact Registry Writer role to the Cloud Build service account on the Artifact Registry repository in the target project.

**Options:**

- **A.** Grant the Artifact Registry Writer role to the Cloud Build service account on the Artifact Registry repository in the target project. — _correct answer_
- **B.** Create a new service account with Owner permissions on both projects and configure Cloud Build to use this service account for all builds.
- **C.** Configure VPC Service Controls to allow traffic between the two projects, which will automatically enable Cloud Build to push images to the remote Artifact Registry.
- **D.** Enable the Artifact Registry API in the build project and the default service account will automatically have permission to push to any Artifact Registry in the organization.

## Question 51

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an analytics application that lists Cloud Storage objects using the JSON API. Each list request returns full object metadata, but your application only needs the object name and size. The bucket contains millions of objects and network latency is a concern. How should you optimize your API requests?

**Correct answer:** A. Use the fields parameter in your request to specify only the required properties, such as fields=items(name,size),nextPageToken, to receive a partial response.

**Options:**

- **A.** Use the fields parameter in your request to specify only the required properties, such as fields=items(name,size),nextPageToken, to receive a partial response. — _correct answer_
- **B.** Enable response compression by setting the Accept-Encoding header to gzip, which reduces data transfer without changing the response structure.
- **C.** Set the projection parameter to 'noAcl' to exclude ACL information and reduce the response size for each object listing request.
- **D.** Download the full object listing response and filter the required fields client-side using JSON parsing to extract only the name and size properties.

## Question 52

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a chat application using Firestore real-time listeners. During testing, you notice that when users navigate away from the chat screen and return multiple times, the application's memory usage increases significantly. What is the most likely cause and how should you fix it?

**Correct answer:** B. Listeners are not being unsubscribed when users navigate away. Call the unsubscribe function returned by the onSnapshot() method when the component unmounts.

**Options:**

- **A.** The query is returning too many documents. Add pagination using limit() and cursors to reduce the result set size.
- **B.** Listeners are not being unsubscribed when users navigate away. Call the unsubscribe function returned by the onSnapshot() method when the component unmounts. — _correct answer_
- **C.** The Firestore SDK is caching too much data locally. Disable offline persistence to reduce memory consumption.
- **D.** Firestore is creating duplicate connections for the same query. Use a singleton pattern to ensure only one listener exists per query.

## Question 53

**Domain:** Deploying applications

**Question:** Your organization uses Shared VPC, and you need to configure a Cloud Run service in a service project to connect to resources in the Shared VPC network. You plan to create a Serverless VPC Access connector in the service project. What must be done before you can create the connector?

**Correct answer:** A. A Shared VPC network administrator must create a /28 subnet in the Shared VPC network for the connector to use.

**Options:**

- **A.** A Shared VPC network administrator must create a /28 subnet in the Shared VPC network for the connector to use. — _correct answer_
- **B.** You must configure the connector to automatically create a hidden subnet using a custom IP range in the Shared VPC network.
- **C.** The Cloud Run service must be migrated to the Shared VPC host project before the connector can be created.
- **D.** You must disable all existing firewall rules in the Shared VPC network to allow connector traffic.

## Question 54

**Domain:** Building and testing applications

**Question:** Your team manages a Cloud Run service that has session affinity enabled for user experience consistency. You are planning a canary deployment to test a new revision with 20% of traffic. A developer expresses concern about how session affinity will interact with traffic splitting. What happens when session affinity is enabled during traffic splitting between multiple revisions?

**Correct answer:** B. Requests from the same client are routed to the same revision, and Cloud Run minimizes client redirections when updating traffic configuration.

**Options:**

- **A.** Session affinity is automatically disabled when traffic splitting is configured between multiple revisions.
- **B.** Requests from the same client are routed to the same revision, and Cloud Run minimizes client redirections when updating traffic configuration. — _correct answer_
- **C.** Traffic splitting overrides session affinity, causing all clients to be redistributed randomly according to the configured percentages on every request.
- **D.** Each request is independently routed based on traffic percentages, ignoring session affinity settings until full rollout is complete.

## Question 55

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You manage a healthcare application with strict data residency requirements. The application uses BigQuery for analytics and Cloud Storage for data archiving. You have configured a VPC Service Controls perimeter to protect these resources. A partner organization needs read-only access to specific BigQuery datasets within your perimeter. You want to provide secure access to the partner while maintaining audit trails. What should you do?

**Correct answer:** A. Create an ingress rule that specifies the partner's project as a source and limits access to BigQuery with specific method selectors for read operations only.

**Options:**

- **A.** Create an ingress rule that specifies the partner's project as a source and limits access to BigQuery with specific method selectors for read operations only. — _correct answer_
- **B.** Create an access level based on the partner's Google Cloud project ID and attach it to your service perimeter to allow their queries.
- **C.** Create a perimeter bridge between your perimeter and the partner's perimeter to enable data sharing with full bidirectional access.
- **D.** Export the required BigQuery data to a Cloud Storage bucket outside the perimeter and share that bucket with the partner organization.

## Question 56

**Domain:** Integrating applications with Google Cloud services

**Question:** You have set up an alerting policy in Cloud Monitoring for your GKE application that monitors CPU utilization. The policy should trigger when CPU utilization exceeds 80% across any of your pods. After deployment, you notice that during brief spikes the alert fires too frequently, causing alert fatigue. How should you modify the alerting policy to reduce false positives while still detecting sustained high CPU usage?

**Correct answer:** C. Increase the retest window (duration) in the alerting condition to require the threshold to be violated for a longer continuous period before triggering an alert.

**Options:**

- **A.** Create a snooze to temporarily suppress all alerts from this alerting policy during peak usage hours.
- **B.** Change the alerting policy from a metric-threshold condition to a metric-absence condition to only alert when CPU metrics stop being reported.
- **C.** Increase the retest window (duration) in the alerting condition to require the threshold to be violated for a longer continuous period before triggering an alert. — _correct answer_
- **D.** Add a Monitoring filter to exclude pods that frequently experience CPU spikes from the alerting policy condition.

## Question 57

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Cloud Run service that handles real-time data processing. The service is configured with 2 vCPUs and maximum concurrency of 100. You notice that during traffic spikes, new instances are being created earlier than expected, even when existing instances appear to have capacity. What explains this autoscaling behavior?

**Correct answer:** D. Cloud Run targets keeping instance concurrency at 60% of the maximum concurrency setting, triggering scale-out at 60 concurrent requests per instance.

**Options:**

- **A.** Cloud Run automatically scales when any instance reaches 80% of its maximum concurrency, which equals 80 concurrent requests.
- **B.** The maximum concurrency setting of 100 exceeds the recommended limit, causing premature scaling behavior as a safety mechanism.
- **C.** Cloud Run instances request scale-out when their memory usage approaches the configured limit, regardless of concurrency settings.
- **D.** Cloud Run targets keeping instance concurrency at 60% of the maximum concurrency setting, triggering scale-out at 60 concurrent requests per instance. — _correct answer_

## Question 58

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Cloud Run service that executes background tasks using Go goroutines after returning HTTP responses to clients. During testing, you notice that background tasks are not completing consistently. The application works correctly in local testing but fails intermittently in Cloud Run. You need to configure the service so that background processing completes reliably while maintaining cost efficiency. What should you do?

**Correct answer:** C. Configure the Cloud Run service to use instance-based billing by setting the --no-cpu-throttling flag, which allocates CPU throughout the instance lifecycle.

**Options:**

- **A.** Deploy the application to Cloud Run jobs instead of Cloud Run services since jobs are better suited for background processing workloads.
- **B.** Set the minimum instances to 1 to ensure there is always an instance available to process background work when requests are not being processed.
- **C.** Configure the Cloud Run service to use instance-based billing by setting the --no-cpu-throttling flag, which allocates CPU throughout the instance lifecycle. — _correct answer_
- **D.** Increase the request timeout to the maximum value of 3600 seconds to allow more time for background tasks to complete during request processing.

## Question 59

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a microservices application on GKE that connects to Cloud SQL for MySQL. Multiple pods need to access the database, and you want to optimize connection management across all pods while ensuring secure authentication. You need to follow Google-recommended practices. What should you do?

**Correct answer:** A. Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod, configure Workload Identity for authentication, and implement connection pooling within each application using a library like HikariCP.

**Options:**

- **A.** Deploy the Cloud SQL Auth Proxy as a sidecar container in each pod, configure Workload Identity for authentication, and implement connection pooling within each application using a library like HikariCP. — _correct answer_
- **B.** Enable Managed Connection Pooling on the Cloud SQL instance, deploy pods without the Cloud SQL Auth Proxy, and configure direct private IP connections from the GKE cluster.
- **C.** Create a single Cloud SQL Auth Proxy deployment with a Kubernetes Service, configure all pods to connect through this centralized proxy, and let the proxy handle all connection pooling.
- **D.** Configure each pod with a service account key file mounted as a Kubernetes Secret and connect directly to Cloud SQL's public IP using SSL certificates.

## Question 60

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You manage a Cloud Bigtable instance storing user activity data. Users report intermittent high latency. After checking cluster metrics, you confirm CPU utilization is below recommended limits. You suspect hotspots caused by certain highly active users. How should you identify the specific row keys causing the performance issue?

**Correct answer:** A. Use Key Visualizer to view heatmaps of access patterns, then run ListHotTablets to identify specific row key ranges causing the hotspots.

**Options:**

- **A.** Use Key Visualizer to view heatmaps of access patterns, then run ListHotTablets to identify specific row key ranges causing the hotspots. — _correct answer_
- **B.** Enable Cloud Monitoring and create a dashboard to track the latency percentiles per table to identify slow operations.
- **C.** Add additional nodes to the cluster and enable autoscaling to automatically distribute load when hotspots occur.
- **D.** Export all access logs to BigQuery and run analytical queries to determine which row keys have the highest read and write frequencies.

## Question 61

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company is deploying a microservices application on Cloud Run that connects to a Cloud SQL for PostgreSQL database. During load testing, you observe that as your Cloud Run service scales to handle traffic spikes, the Cloud SQL instance reaches its maximum connection limit and new requests begin failing. You need to implement a solution that prevents connection exhaustion while maintaining application performance. What should you do?

**Correct answer:** A. Implement application-level connection pooling in each Cloud Run instance and configure the pool size to limit the maximum number of connections per container instance.

**Options:**

- **A.** Implement application-level connection pooling in each Cloud Run instance and configure the pool size to limit the maximum number of connections per container instance. — _correct answer_
- **B.** Configure Memorystore for Redis as a caching layer in front of Cloud SQL to reduce the number of direct database connections required by the application.
- **C.** Increase the Cloud SQL instance machine type to get more available memory, which automatically increases the maximum connections limit for the database.
- **D.** Deploy a separate Cloud Run service dedicated to managing database connections and have your microservices communicate with it via HTTP for all database operations.

## Question 62

**Domain:** Deploying applications

**Question:** Your company requires that all outbound traffic from Cloud Run services must flow through a VPC network for security auditing via Cloud NAT and firewall logging. You need to configure a Cloud Run service to meet this requirement while minimizing compute costs. What should you do?

**Correct answer:** C. Configure the Cloud Run service with Direct VPC egress using the --vpc-egress=all-traffic flag to route all outbound traffic through the VPC network.

**Options:**

- **A.** Configure the Cloud Run service with Direct VPC egress using the default --vpc-egress=private-ranges-only setting.
- **B.** Deploy the Cloud Run service with internal ingress only, which automatically routes all egress through your VPC network.
- **C.** Configure the Cloud Run service with Direct VPC egress using the --vpc-egress=all-traffic flag to route all outbound traffic through the VPC network. — _correct answer_
- **D.** Create a Serverless VPC Access connector with e2-micro machine type and configure the Cloud Run service with --vpc-egress=all-traffic.

## Question 63

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are troubleshooting a VPC Service Controls violation where a Cloud Run service is receiving HTTP 403 errors with the message 'Request is prohibited by organization policy' when trying to write data to a Cloud Storage bucket inside a service perimeter. The Cloud Run service is deployed in a project inside the same perimeter. What is the most likely cause of this issue?

**Correct answer:** A. The Cloud Run service is configured with ingress settings that allow traffic from outside the perimeter, causing VPC Service Controls to treat requests as external even though the project is inside the perimeter.

**Options:**

- **A.** The Cloud Run service is configured with ingress settings that allow traffic from outside the perimeter, causing VPC Service Controls to treat requests as external even though the project is inside the perimeter. — _correct answer_
- **B.** The service perimeter was recently updated and changes have not yet propagated, as perimeter updates can take up to 30 minutes to take effect across all Google Cloud services.
- **C.** The Cloud Storage API was not added to the restricted services list in the service perimeter, causing VPC Service Controls to block write operations from Cloud Run services.
- **D.** The Cloud Run service account does not have the VPC Service Controls Troubleshooter Viewer IAM role required for accessing resources inside the perimeter.

## Question 64

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Cloud Run service that needs to access an API key stored in Secret Manager. The service uses a dedicated service account, and you need to follow the principle of least privilege when granting access. Which IAM role should you grant to the service account?

**Correct answer:** D. Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secret resource.

**Options:**

- **A.** Grant the Secret Manager Viewer role (roles/secretmanager.viewer) on the project to view secrets without modification capabilities.
- **B.** Grant the Owner role (roles/owner) on the specific secret to provide complete access to the secret resource.
- **C.** Grant the Secret Manager Admin role (roles/secretmanager.admin) on the project to allow comprehensive secret management capabilities.
- **D.** Grant the Secret Manager Secret Accessor role (roles/secretmanager.secretAccessor) on the specific secret resource. — _correct answer_

## Question 65

**Domain:** Deploying applications

**Question:** You are setting up a new CI/CD pipeline with Cloud Build and Artifact Registry. When attempting to push your first container image to Artifact Registry, the build fails even though the Cloud Build service account has the Artifact Registry Writer role. What is the most likely cause of this failure?

**Correct answer:** A. The Artifact Registry Docker repository has not been created before the push attempt.

**Options:**

- **A.** The Artifact Registry Docker repository has not been created before the push attempt. — _correct answer_
- **B.** The Docker credential helper has not been configured for the Artifact Registry hostname.
- **C.** The image tag contains special characters that are not allowed.
- **D.** The Container Registry API is not enabled in the project.

## Question 66

**Domain:** Building and testing applications

**Question:** You are deploying a new version of a Cloud Run service and want to test it in production without impacting users. You need to deploy the new revision so that it does not receive any production traffic, but you can still test it directly using a dedicated URL. What should you do?

**Correct answer:** C. Deploy the new revision using gcloud run deploy SERVICE --image IMAGE_URL --no-traffic --tag canary, and test the revision at the tag-specific URL.

**Options:**

- **A.** Deploy the new revision to a separate Cloud Run service for testing, and manually merge configurations after validation.
- **B.** Deploy the new revision using gcloud run deploy SERVICE --image IMAGE_URL --min-instances=0, and test by scaling up manually.
- **C.** Deploy the new revision using gcloud run deploy SERVICE --image IMAGE_URL --no-traffic --tag canary, and test the revision at the tag-specific URL. — _correct answer_
- **D.** Deploy the new revision using gcloud run deploy SERVICE --image IMAGE_URL, and immediately use gcloud run services update-traffic to set traffic to 0%.

## Question 67

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization has enforced VPC Service Controls on a production project. After deployment, users report receiving 403 errors when accessing Cloud Storage buckets from the Google Cloud console. You need to diagnose and resolve the issue efficiently. What should you do?

**Correct answer:** A. Retrieve the unique ID from the error message and use the VPC Service Controls violation analyzer to diagnose the access denial. Review the evaluation report and update ingress rules based on the findings.

**Options:**

- **A.** Retrieve the unique ID from the error message and use the VPC Service Controls violation analyzer to diagnose the access denial. Review the evaluation report and update ingress rules based on the findings. — _correct answer_
- **B.** Check the IAM permissions for the affected users and grant them the Storage Admin role. VPC Service Controls denials are typically caused by insufficient IAM permissions.
- **C.** Add an access level that allows access from any IP address to immediately restore access. Refine the access level configuration later based on security requirements.
- **D.** Disable the service perimeter temporarily to restore user access. Review Cloud Audit Logs manually to identify the access patterns, then re-enable the perimeter with updated configuration.

## Question 68

**Domain:** Integrating applications with Google Cloud services

**Question:** You are operating a containerized application on GKE that exposes Prometheus-format metrics. Your team wants to use these custom metrics in Cloud Monitoring alerting policies. You need to minimize operational overhead while ensuring metrics are available for alerting. What should you do?

**Correct answer:** C. Enable Google Cloud Managed Service for Prometheus on your GKE cluster. Deploy a PodMonitoring custom resource that specifies the scrape configuration for your application pods. Create alerting policies using PromQL queries against the collected metrics.

**Options:**

- **A.** Export your application metrics to Cloud Logging using structured JSON format. Create a log-based metric in Cloud Monitoring based on the logged values. Configure an alerting policy to monitor the log-based metric.
- **B.** Enable GKE system metrics collection by passing the SYSTEM flag to the --monitoring parameter during cluster creation. Create a custom dashboard in Cloud Monitoring to visualize the application metrics and configure email notifications when values appear unusual.
- **C.** Enable Google Cloud Managed Service for Prometheus on your GKE cluster. Deploy a PodMonitoring custom resource that specifies the scrape configuration for your application pods. Create alerting policies using PromQL queries against the collected metrics. — _correct answer_
- **D.** Install a self-managed Prometheus server on your GKE cluster. Configure the server to scrape your application metrics. Set up Alertmanager to handle alerting and configure it to send notifications via email using the prometheus-alertmanager configuration file.

## Question 69

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that frequently lists objects in a Cloud Storage bucket. After deployment to production, you observe that your request rate is approaching 5000 read requests per second. You want to ensure continued reliable operation while the bucket scales. What should you do?

**Correct answer:** D. Ramp up your request rate gradually, no faster than doubling every 20 minutes, and implement retry logic with exponential backoff for 408 and 429 errors.

**Options:**

- **A.** Enable hierarchical namespace on the bucket to bypass the initial QPS limits and allow unlimited read requests immediately.
- **B.** Distribute objects across multiple buckets using consistent hashing to spread the read load and avoid hitting per-bucket rate limits.
- **C.** Request a quota increase through the Google Cloud Console to immediately raise the read request limit beyond 5000 requests per second.
- **D.** Ramp up your request rate gradually, no faster than doubling every 20 minutes, and implement retry logic with exponential backoff for 408 and 429 errors. — _correct answer_

## Question 70

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema to store IoT sensor readings from thousands of devices. Each sensor sends data every second, and you need to query all readings for a specific device over various time ranges. You want to optimize for read performance while preventing hotspotting. How should you design the row key?

**Correct answer:** A. Use a composite row key with the device ID as the prefix followed by a timestamp, such as device_id#timestamp.

**Options:**

- **A.** Use a composite row key with the device ID as the prefix followed by a timestamp, such as device_id#timestamp. — _correct answer_
- **B.** Use a random hash of the timestamp as the row key for even distribution across nodes.
- **C.** Use the timestamp as the row key prefix followed by the device ID, such as timestamp#device_id.
- **D.** Use only the device ID as the row key and store all timestamps in separate columns within that row.

## Question 71

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a web application deployed on GKE that connects to a Cloud SQL for PostgreSQL instance. The application experiences connection issues during peak load due to the database reaching its maximum connection limit. You need to optimize database connection management while minimizing application code changes. What should you do?

**Correct answer:** C. Implement application-level connection pooling using a library such as HikariCP, configuring the pool size based on the number of concurrent requests expected per pod.

**Options:**

- **A.** Enable Managed Connection Pooling on your Cloud SQL instance and modify your application to use IAM database authentication exclusively.
- **B.** Create multiple Cloud SQL read replicas and configure your application to distribute all database operations across them evenly.
- **C.** Implement application-level connection pooling using a library such as HikariCP, configuring the pool size based on the number of concurrent requests expected per pod. — _correct answer_
- **D.** Increase the max_connections flag on the Cloud SQL instance to the maximum allowed value and configure each pod to use its own dedicated connection.

## Question 72

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a single-page web application that displays real-time stock prices using Firestore. Users navigate between different stock symbols throughout the day. You notice memory usage increases continuously the longer users stay on the page. You need to fix this issue following Google-recommended best practices. What should you do?

**Correct answer:** B. Store the unsubscribe function returned by onSnapshot() and call it before setting up a new listener when the user navigates to a different stock.

**Options:**

- **A.** Configure the Firestore client to set cacheSizeBytes to a limited value to automatically clean up old listeners when memory threshold is exceeded.
- **B.** Store the unsubscribe function returned by onSnapshot() and call it before setting up a new listener when the user navigates to a different stock. — _correct answer_
- **C.** Configure the snapshot listener to use includeMetadataChanges: false to reduce the number of callbacks and memory usage during navigation.
- **D.** Implement a single global listener on the entire stocks collection and filter results client-side when the user selects different stock symbols.

## Question 73

**Domain:** Building and testing applications

**Question:** Your team is developing a microservices application locally. Different services need to authenticate to various Google Cloud APIs. You need to understand how ADC searches for credentials. In what order does Application Default Credentials check for credentials on a local development workstation?

**Correct answer:** C. First the GOOGLE_APPLICATION_CREDENTIALS environment variable, then the well-known location for local ADC credentials, and finally the metadata server.

**Options:**

- **A.** First the metadata server, then the GOOGLE_APPLICATION_CREDENTIALS environment variable, and finally the well-known location for local ADC credentials.
- **B.** First the well-known location for local ADC credentials, then the GOOGLE_APPLICATION_CREDENTIALS environment variable, and finally the metadata server.
- **C.** First the GOOGLE_APPLICATION_CREDENTIALS environment variable, then the well-known location for local ADC credentials, and finally the metadata server. — _correct answer_
- **D.** First the gcloud CLI credentials, then the GOOGLE_APPLICATION_CREDENTIALS environment variable, and finally the well-known location for local ADC credentials.

## Question 74

**Domain:** Building and testing applications

**Question:** You are setting up a local development environment using the Cloud Code extension for VS Code to develop containerized Kubernetes applications. Your development machine is a Windows workstation. You need to ensure all prerequisites are met before you can build and run applications locally on a minikube cluster. Which combination of tools must be installed on your machine?

**Correct answer:** C. Docker client, Git, and a Kubernetes cluster (minikube) with the Docker client added to the PATH environment variable.

**Options:**

- **A.** Docker client and kubectl only, as Cloud Code provides an embedded Kubernetes cluster for local development without additional configuration.
- **B.** Visual Studio Code and the Cloud Code extension only, as all container tools are bundled within the extension package.
- **C.** Docker client, Git, and a Kubernetes cluster (minikube) with the Docker client added to the PATH environment variable. — _correct answer_
- **D.** Cloud SDK (gcloud CLI) only, as Cloud Code automatically provisions all other dependencies including Docker and Kubernetes clusters.

## Question 75

**Domain:** Building and testing applications

**Question:** Your development team is using Cloud Code for VS Code to develop containerized applications. When you run and debug your application locally, you need to make calls to Google Cloud APIs from your container. You receive authentication errors when your application attempts to access Cloud Storage. What should you do to enable your local application to authenticate to Google Cloud services?

**Correct answer:** D. Sign in to the gcloud CLI using the Cloud Code status bar, which updates your Application Default Credentials for local debugging.

**Options:**

- **A.** Configure the Cloud Code extension settings to pass your API key as an environment variable to all containers.
- **B.** Create a service account key file and mount it as a volume in your container's Kubernetes deployment manifest.
- **C.** Add the google-auth library to your application and hardcode your Google account credentials in the source code.
- **D.** Sign in to the gcloud CLI using the Cloud Code status bar, which updates your Application Default Credentials for local debugging. — _correct answer_

## Question 76

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying an application to a GKE Autopilot cluster. The application needs to read secrets from Secret Manager. A team member suggests adding a nodeSelector with iam.gke.io/gke-metadata-server-enabled: true to the pod specification. What is the correct approach for configuring Workload Identity Federation for GKE on Autopilot clusters?

**Correct answer:** D. Remove the nodeSelector from the pod specification because Autopilot clusters always have Workload Identity Federation for GKE enabled and will reject pods with this nodeSelector.

**Options:**

- **A.** Convert the Autopilot cluster to a Standard cluster because Workload Identity Federation for GKE configuration requires manual node pool management that is not available in Autopilot.
- **B.** Keep the nodeSelector in the pod specification to ensure the pod is scheduled on nodes with the GKE metadata server enabled.
- **C.** Add an annotation to the pod specification to explicitly enable Workload Identity Federation for GKE because Autopilot requires explicit opt-in for each workload.
- **D.** Remove the nodeSelector from the pod specification because Autopilot clusters always have Workload Identity Federation for GKE enabled and will reject pods with this nodeSelector. — _correct answer_

## Question 77

**Domain:** Building and testing applications

**Question:** You need to perform canary testing of a new Cloud Run revision before routing any production traffic to it. The revision has been deployed with a traffic tag 'test' and 0% traffic allocation. You want to verify the new revision functions correctly using its dedicated URL. Which URL format provides direct access to test this specific tagged revision?

**Correct answer:** D. https://test---myservice-abcdef.a.run.app

**Options:**

- **A.** https://myservice-abcdef.a.run.app/test
- **B.** https://myservice-test-abcdef.a.run.app
- **C.** https://test.myservice-abcdef.a.run.app
- **D.** https://test---myservice-abcdef.a.run.app — _correct answer_

## Question 78

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses Cloud Tasks to dispatch HTTP requests to a Cloud Run service. During a traffic spike, your worker service starts returning HTTP 429 Too Many Requests and HTTP 503 Service Unavailable responses. You need to understand how Cloud Tasks handles these different error codes. Which statement accurately describes Cloud Tasks behavior for these HTTP response codes?

**Correct answer:** B. Cloud Tasks uses a higher backoff rate when the worker returns HTTP 429 or HTTP 503, and considers the Retry-After HTTP response header for retry timing.

**Options:**

- **A.** Cloud Tasks treats HTTP 429 and HTTP 503 identically to other error codes, applying the same backoff rate configured in the queue RetryConfig settings.
- **B.** Cloud Tasks uses a higher backoff rate when the worker returns HTTP 429 or HTTP 503, and considers the Retry-After HTTP response header for retry timing. — _correct answer_
- **C.** Cloud Tasks immediately retries tasks that receive HTTP 429 responses without applying any backoff, while HTTP 503 responses trigger standard exponential backoff based on queue configuration.
- **D.** Cloud Tasks removes tasks from the queue permanently when HTTP 429 is returned, but retries tasks with HTTP 503 using standard backoff intervals.

## Question 79

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Cloud Run API service that receives sporadic traffic with occasional bursts. The service uses the default request-based billing model and handles 80 concurrent requests per instance. Users report high latency during traffic bursts. Cloud Monitoring shows that Cloud Run is targeting 60% concurrency utilization before scaling. You want to reduce latency during bursts without significantly increasing costs. What should you do?

**Correct answer:** C. Lower the maximum concurrency setting to trigger scaling at a lower request volume, reducing per-instance queuing.

**Options:**

- **A.** Increase the maximum concurrency to 1000 to allow each instance to handle more requests simultaneously.
- **B.** Switch to instance-based billing to ensure CPU is always available for processing requests during bursts.
- **C.** Lower the maximum concurrency setting to trigger scaling at a lower request volume, reducing per-instance queuing. — _correct answer_
- **D.** Set minimum instances to match expected peak traffic to eliminate scaling delays during bursts.

## Question 80

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application needs to list objects in a Cloud Storage bucket that experiences high write traffic with thousands of objects written per second. You are receiving frequent 429 errors during listing operations. According to Google's best practices, what should you do to improve reliability?

**Correct answer:** B. Ramp up your request rate gradually, starting below the initial rate limits, and use exponential backoff with retries when 429 errors occur.

**Options:**

- **A.** Request a quota increase from Google Cloud support to raise the API rate limits for your project before scaling up traffic.
- **B.** Ramp up your request rate gradually, starting below the initial rate limits, and use exponential backoff with retries when 429 errors occur. — _correct answer_
- **C.** Configure multiple Cloud Storage buckets in different regions and distribute your objects across them to increase overall throughput limits.
- **D.** Use sequential object naming with timestamps to ensure consistent performance during high-traffic operations on the bucket.

## Question 81

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an e-commerce application that needs to update multiple product documents atomically when processing an order. The updates do not depend on reading current document values. You want to minimize the chance of failures due to contention. Which approach should you use?

**Correct answer:** C. Use a batched write to execute all product document updates as a single atomic operation.

**Options:**

- **A.** Use individual write operations for each product document wrapped in a try-catch block for error handling.
- **B.** Use the BulkWriter with parallelized writes to update all documents with automatic throttling.
- **C.** Use a batched write to execute all product document updates as a single atomic operation. — _correct answer_
- **D.** Use a transaction to read each product document first, then apply all updates together.

## Question 82

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your security team requires that Cloud Run services deployed within a VPC Service Controls perimeter can only access Google Cloud APIs within the same perimeter and cannot reach any external endpoints. You need to configure the perimeter to enforce this requirement. What should you do?

**Correct answer:** C. Enable VPC accessible services on the perimeter and set it to 'All restricted services' to limit outbound API access to only the services protected by the perimeter.

**Options:**

- **A.** Configure an egress rule that denies all outbound traffic from Cloud Run services to any destination outside the perimeter boundary.
- **B.** Create a firewall rule in the VPC network that blocks all outbound traffic except to the restricted.googleapis.com VIP addresses within the service perimeter.
- **C.** Enable VPC accessible services on the perimeter and set it to 'All restricted services' to limit outbound API access to only the services protected by the perimeter. — _correct answer_
- **D.** Add all Google Cloud APIs to the restricted services list in the perimeter configuration to ensure comprehensive coverage of all service access.

## Question 83

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is planning to implement VPC Service Controls to protect sensitive data in BigQuery and Cloud Storage. Before enforcing the perimeter, you need to understand the impact on existing workloads without disrupting production. You want to identify any access patterns that would be blocked by the perimeter. What should you do?

**Correct answer:** D. Create a service perimeter in dry run mode. Analyze the logs in Cloud Logging using the filter for dry run violations to identify requests that would be denied.

**Options:**

- **A.** Create a service perimeter in enforced mode during a scheduled maintenance window. Quickly review the violation logs and modify the configuration to resolve any issues.
- **B.** Create a service perimeter and add an access level that allows all traffic. Gradually remove permissions from the access level to identify blocked patterns.
- **C.** Create multiple small service perimeters, each containing a single project. Enable each perimeter one at a time to observe the impact on individual workloads.
- **D.** Create a service perimeter in dry run mode. Analyze the logs in Cloud Logging using the filter for dry run violations to identify requests that would be denied. — _correct answer_

## Question 84

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing website analytics data in Cloud Bigtable with row keys containing domain names. Your queries frequently retrieve all data for a specific domain and its subdomains (for example, all pages under example.com). How should you structure the domain names in the row key to optimize query performance?

**Correct answer:** A. Use reversed domain names such as com.example.www to group related domains together in contiguous rows.

**Options:**

- **A.** Use reversed domain names such as com.example.www to group related domains together in contiguous rows. — _correct answer_
- **B.** Store each subdomain in a separate Bigtable table to isolate query patterns for different domains.
- **C.** Use the standard domain format such as www.example.com to maintain human readability of the row keys.
- **D.** Hash the domain name to distribute data evenly and prevent hotspotting on popular domains.

## Question 85

**Domain:** Building and testing applications

**Question:** Your team is developing a microservices application and needs to run integration tests in Cloud Build before deploying to production. The integration tests must connect to a Cloud SQL database running in a private VPC network with no public IP address. You need to configure Cloud Build to run these integration tests securely. What should you do?

**Correct answer:** D. Create a Cloud Build private pool with VPC peering configured to your VPC network. Update your cloudbuild.yaml to specify the private pool in the options section and run integration tests in a build step.

**Options:**

- **A.** Create a Cloud NAT gateway in your VPC network. Configure the default Cloud Build pool to use the NAT gateway for outbound connections to reach the Cloud SQL instance.
- **B.** Configure firewall rules to allow ingress from Cloud Build's IP ranges to your Cloud SQL instance. Update cloudbuild.yaml to connect directly to the database's internal IP.
- **C.** Add a step in cloudbuild.yaml to start the Cloud SQL Auth Proxy with a public IP address. Connect to the proxy from subsequent build steps to run integration tests.
- **D.** Create a Cloud Build private pool with VPC peering configured to your VPC network. Update your cloudbuild.yaml to specify the private pool in the options section and run integration tests in a build step. — _correct answer_

## Question 86

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have a Firestore database with a hierarchical structure where user documents contain subcollections of orders. You need to query all orders across all users where the status equals 'pending' and the order total is greater than $100. The query currently returns an error. What should you do?

**Correct answer:** B. Create a composite index with collection group scope on the orders collection, including the status and total fields.

**Options:**

- **A.** Enable automatic indexing for the orders subcollection to support the compound query.
- **B.** Create a composite index with collection group scope on the orders collection, including the status and total fields. — _correct answer_
- **C.** Create two separate single-field indexes with collection group scope on the status and total fields.
- **D.** Restructure your data model to store all orders in a root-level collection instead of subcollections.

## Question 87

**Domain:** Building and testing applications

**Question:** Your team has multiple Artifact Registry Docker repositories storing container images from frequent CI/CD builds. Storage costs are increasing due to accumulation of old, unused images. You need to automatically delete images older than 90 days while retaining all images tagged with version prefixes 'v1' and 'v2' regardless of age. What should you do?

**Correct answer:** A. Create a cleanup policy JSON file with a delete policy specifying 'olderThan: 90d' and a conditional keep policy with 'versionPrefixes: [v1, v2]'. Apply the policy using gcloud artifacts repositories set-cleanup-policies.

**Options:**

- **A.** Create a cleanup policy JSON file with a delete policy specifying 'olderThan: 90d' and a conditional keep policy with 'versionPrefixes: [v1, v2]'. Apply the policy using gcloud artifacts repositories set-cleanup-policies. — _correct answer_
- **B.** Set a retention period of 90 days at the Artifact Registry repository level using the 'retention-days' repository setting, then add tags starting with 'v1' and 'v2' to a protected tags list.
- **C.** Configure Cloud Build post-build steps to delete previous images from the repository whenever a new image is pushed, keeping only the most recent version of each image.
- **D.** Create a Cloud Scheduler job that runs daily and executes a Cloud Run function to query Artifact Registry and delete images older than 90 days using the gcloud artifacts docker images delete command with tag filtering.

## Question 88

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a website analytics platform using Cloud Bigtable to store page view events. Each event contains a domain name and timestamp. Your most frequent query retrieves all page views for a given domain over a time range. You want to design a schema that groups related data efficiently and enables compression. How should you structure your row keys?

**Correct answer:** B. Use reversed domain names followed by timestamp, such as com.example#1704067200, to group related domains together in contiguous rows.

**Options:**

- **A.** Use timestamp followed by domain name, such as 1704067200#example.com, to enable efficient time-range queries across all domains.
- **B.** Use reversed domain names followed by timestamp, such as com.example#1704067200, to group related domains together in contiguous rows. — _correct answer_
- **C.** Use standard domain names followed by timestamp, such as example.com#1704067200, to maintain human-readable row keys.
- **D.** Use a hash of the domain name followed by timestamp, such as a3b2c1#1704067200, to ensure even distribution of writes.

## Question 89

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You need to update 500 documents in a Cloud Firestore collection as part of a data migration. The updates are independent and do not require reading document values before writing. You want to optimize for throughput and minimize latency. What should you do?

**Correct answer:** B. Use a BulkWriter from the server client library to perform parallelized individual writes. BulkWriter automatically handles throttling using the 500/50/5 rule.

**Options:**

- **A.** Create batched writes with all 500 documents in a single batch and commit the batch atomically to ensure all updates succeed together.
- **B.** Use a BulkWriter from the server client library to perform parallelized individual writes. BulkWriter automatically handles throttling using the 500/50/5 rule. — _correct answer_
- **C.** Execute individual document updates sequentially in a loop and implement your own retry logic with exponential backoff.
- **D.** Use a single transaction to read all documents and update them atomically to guarantee consistency across the migration.

## Question 90

**Domain:** Building and testing applications

**Question:** You are developing a Python application on your local workstation that uses Cloud Client Libraries to access Google Cloud services. When you run the application, it fails with an authentication error. You have the Google Cloud CLI installed and have previously logged in using 'gcloud auth login'. You want to authenticate your application using the recommended approach for local development without creating service account keys. What should you do?

**Correct answer:** B. Run 'gcloud auth application-default login' to create a local ADC file with your user credentials.

**Options:**

- **A.** Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to your gcloud CLI configuration directory.
- **B.** Run 'gcloud auth application-default login' to create a local ADC file with your user credentials. — _correct answer_
- **C.** Run 'gcloud auth login --enable-adc' to enable Application Default Credentials for the current session.
- **D.** Create a service account key JSON file, download it, and set the GOOGLE_APPLICATION_CREDENTIALS environment variable to its path.

## Question 91

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an IoT application that stores sensor data from thousands of devices in Cloud Bigtable. Each sensor sends readings every second with a timestamp. You want to design a row key that allows efficient retrieval of all readings for a specific device over a time period while avoiding hotspots. How should you design your row key?

**Correct answer:** A. Use the format device_id#timestamp where device_id is the unique identifier for each sensor, followed by the timestamp of the reading.

**Options:**

- **A.** Use the format device_id#timestamp where device_id is the unique identifier for each sensor, followed by the timestamp of the reading. — _correct answer_
- **B.** Use the format timestamp#device_id to enable efficient scanning across all devices for a specific time range.
- **C.** Use a sequential numeric ID that auto-increments for each sensor reading to ensure unique row keys across all devices.
- **D.** Use the format hash(device_id)#hash(timestamp) to randomize data distribution and maximize performance across all nodes.

## Question 92

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an automated incident response system for your GKE application. When Cloud Monitoring detects an anomaly and creates an incident, you need to automatically trigger a Cloud Run function that scales up your deployment and notifies on-call engineers. Which notification channel configuration should you use?

**Correct answer:** A. Create a Pub/Sub notification channel and subscribe the Cloud Run function to the Pub/Sub topic. Add the Pub/Sub channel to your alerting policy along with other channels for engineer notifications.

**Options:**

- **A.** Create a Pub/Sub notification channel and subscribe the Cloud Run function to the Pub/Sub topic. Add the Pub/Sub channel to your alerting policy along with other channels for engineer notifications. — _correct answer_
- **B.** Configure an SMS notification channel to send alert details to a phone number monitored by your automation system that parses SMS messages.
- **C.** Create a log-based alerting policy that writes incidents to Cloud Logging. Configure a logs export sink to trigger the Cloud Run function.
- **D.** Configure a webhook notification channel pointing directly to your Cloud Run function endpoint. Set up separate Slack and email channels for engineer notifications.

## Question 93

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team has deployed a new application on GKE with Workload Identity Federation for GKE enabled. Users report that the application intermittently fails to authenticate to Cloud Pub/Sub within the first few seconds after Pod startup, but works correctly after retrying. You need to resolve this issue with minimal code changes. What should you do?

**Correct answer:** C. Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container.

**Options:**

- **A.** Create a Kubernetes Secret with a service account key and mount it in the Pod as a fallback authentication method when the metadata server is unavailable.
- **B.** Disable Workload Identity Federation for GKE on the node pool and configure the Pods to use the node's service account directly for authentication.
- **C.** Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container. — _correct answer_
- **D.** Increase the cluster's node pool size to reduce metadata server load and improve response times for token requests.

## Question 94

**Domain:** Building and testing applications

**Question:** Your organization uses Cloud Build to build container images and Artifact Registry to store them. You must ensure that once a container image version is tagged and pushed to production, the tag cannot be reassigned to a different image digest. How should you configure your Artifact Registry repository?

**Correct answer:** C. Enable the Immutable image tags setting on the Artifact Registry repository to prevent tag reassignment after an image is pushed.

**Options:**

- **A.** Configure Binary Authorization to require attestations before allowing images to be overwritten in the repository.
- **B.** Configure the Cloud Build service account with read-only permissions after the initial push to prevent subsequent writes.
- **C.** Enable the Immutable image tags setting on the Artifact Registry repository to prevent tag reassignment after an image is pushed. — _correct answer_
- **D.** Create a cleanup policy that prevents deletion of tagged images from the repository to ensure tags remain stable.

## Question 95

**Domain:** Integrating applications with Google Cloud services

**Question:** You are architecting a web application on GKE that uses Cloud SQL for MySQL as its primary database. The application experiences heavy read traffic during business hours but requires write operations for transaction processing. You want to optimize database performance by distributing the load appropriately while minimizing application complexity. What should you do?

**Correct answer:** B. Create read replicas for the Cloud SQL instance and configure the application to direct write operations to the primary instance and read-only queries to the read replicas.

**Options:**

- **A.** Enable Managed Connection Pooling with session pooling mode on the primary instance to automatically distribute both read and write queries across multiple database threads.
- **B.** Create read replicas for the Cloud SQL instance and configure the application to direct write operations to the primary instance and read-only queries to the read replicas. — _correct answer_
- **C.** Create read replicas with cascading replication and configure the Cloud SQL Auth Proxy to automatically route read and write traffic using transaction-based load balancing.
- **D.** Configure the primary Cloud SQL instance with Regional availability type and enable automatic read scaling to distribute read queries across availability zones.

## Question 96

**Domain:** Building and testing applications

**Question:** Your team has deployed a Cloud Run service that is currently serving production traffic. After deploying a new revision and gradually increasing traffic from 5% to 25%, you notice increased error rates in the new revision. You need to immediately roll back all traffic to the previous stable revision. What is the most efficient command to accomplish this?

**Correct answer:** A. gcloud run services update-traffic myservice --to-revisions=PREVIOUS_REVISION=100

**Options:**

- **A.** gcloud run services update-traffic myservice --to-revisions=PREVIOUS_REVISION=100 — _correct answer_
- **B.** gcloud run deploy myservice --image PREVIOUS_IMAGE_URL --revision-suffix stable
- **C.** gcloud run services update myservice --rollback --target-revision=PREVIOUS_REVISION
- **D.** gcloud run services delete-revision myservice --revision=FAILING_REVISION

## Question 97

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a Cloud Tasks queue to process payment transactions for your e-commerce application. The target Cloud Run service occasionally returns HTTP 503 Service Unavailable errors during high traffic periods. You need to understand how Cloud Tasks handles these errors and ensure your system remains reliable. What happens when the Cloud Run service returns an HTTP 503 error?

**Correct answer:** A. Cloud Tasks will retry the task according to retry configuration and temporarily throttle the queue's dispatches to prevent overloading the target.

**Options:**

- **A.** Cloud Tasks will retry the task according to retry configuration and temporarily throttle the queue's dispatches to prevent overloading the target. — _correct answer_
- **B.** Cloud Tasks will move the task to a dead-letter queue after the first failed attempt for later processing.
- **C.** Cloud Tasks will pause the entire queue until you manually resume it using the Cloud Console or gcloud CLI.
- **D.** Cloud Tasks will immediately delete the task from the queue and log the error to Cloud Logging for manual investigation.

## Question 98

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team deploys a latency-sensitive API on Cloud Run that experiences cold start delays during traffic spikes. The Java-based API has an initialization time of approximately 8 seconds. You need to minimize cold start impact while controlling costs. What combination of configurations should you implement?

**Correct answer:** A. Configure minimum instances greater than 0 and enable startup CPU boost.

**Options:**

- **A.** Configure minimum instances greater than 0 and enable startup CPU boost. — _correct answer_
- **B.** Set concurrency to 1 and enable startup CPU boost.
- **C.** Switch to instance-based billing and increase maximum instances.
- **D.** Configure maximum instances to match expected peak traffic and use lazy initialization.

## Question 99

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Cloud Firestore transactions to implement an inventory management system. Within a transaction, you first read a product document, then update the quantity field, and immediately read the same document again to verify the update. However, the second read operation returns the original quantity value before your update. What explains this behavior?

**Correct answer:** A. Queries and reads inside a transaction do not see the results of previous writes inside that transaction due to transaction isolation in Firestore.

**Options:**

- **A.** Queries and reads inside a transaction do not see the results of previous writes inside that transaction due to transaction isolation in Firestore. — _correct answer_
- **B.** The transaction has exceeded the lock deadline of 20 seconds, causing it to release locks and revert to a stale snapshot.
- **C.** The product document was modified by another concurrent transaction between your write and second read operations.
- **D.** Firestore uses eventual consistency for read operations by default, requiring a slight delay before updated values are visible.

## Question 100

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an application that uses the Cloud Storage JSON API to list objects in a bucket. The bucket contains thousands of objects, and your application needs only the object names and sizes for display in a user interface. You want to minimize network bandwidth and response processing time. What should you do?

**Correct answer:** A. Add the fields query parameter to the objects.list request specifying fields=items(name,size),nextPageToken to return only the required fields.

**Options:**

- **A.** Add the fields query parameter to the objects.list request specifying fields=items(name,size),nextPageToken to return only the required fields. — _correct answer_
- **B.** Download the complete object metadata for each page and filter the response client-side to extract only the name and size properties.
- **C.** Use the projection=noAcl parameter to exclude ACL data and create a custom filter in your application to parse only names and sizes.
- **D.** Set maxResults to a low value such as 10 to reduce the response size and make more frequent API calls to retrieve all objects.

## Question 101

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing an API on Cloud Run that connects to a Cloud SQL database with a connection pool. The database allows a maximum of 100 concurrent connections. Each Cloud Run instance maintains 10 connections in its pool. During peak traffic, some requests fail with 429 errors, and you notice connection limit errors in the database logs. You want to prevent both the 429 errors and database connection failures while maximizing API throughput. What should you do?

**Correct answer:** B. Set the maximum instances to 10 and increase the maximum concurrency per instance to handle more requests per connection pool.

**Options:**

- **A.** Set the minimum instances to 10 to ensure enough capacity is always available to handle requests without 429 errors.
- **B.** Set the maximum instances to 10 and increase the maximum concurrency per instance to handle more requests per connection pool. — _correct answer_
- **C.** Set the maximum instances to 100 and configure each instance with a single database connection to distribute connections evenly.
- **D.** Enable manual scaling with 10 instances to maintain a fixed number of database connections and eliminate 429 errors.

## Question 102

**Domain:** Deploying applications

**Question:** You manage multiple GKE clusters for development, staging, and production environments. Each environment uses the same application but requires different ConfigMaps with environment-specific values. Your security team wants to prevent accidental modifications to production ConfigMaps after deployment. How should you configure the production ConfigMaps?

**Correct answer:** A. Set the immutable field to true in the ConfigMap specification when deploying to production.

**Options:**

- **A.** Set the immutable field to true in the ConfigMap specification when deploying to production. — _correct answer_
- **B.** Apply a Kubernetes ResourceQuota to the production namespace limiting ConfigMap updates to zero.
- **C.** Deploy production ConfigMaps to a separate locked namespace with restricted RBAC permissions for all users.
- **D.** Store production ConfigMap data in Secret Manager and sync changes using a sidecar container in each pod.

## Question 103

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is deploying a new cloud-native application that uses Cloud Storage and BigQuery. You need to implement VPC Service Controls to prevent data exfiltration. Before enforcing the perimeter, you want to test the configuration to ensure it does not disrupt existing workloads. What should you do?

**Correct answer:** B. Create a service perimeter in dry run mode. Monitor the policy violation logs in Cloud Logging to identify potential access disruptions before enforcement.

**Options:**

- **A.** Create a perimeter bridge between test and production perimeters. Test changes in the connected perimeter before applying to production.
- **B.** Create a service perimeter in dry run mode. Monitor the policy violation logs in Cloud Logging to identify potential access disruptions before enforcement. — _correct answer_
- **C.** Create access levels that allow all existing IP addresses. Gradually remove access levels to test the impact of restrictions.
- **D.** Create a service perimeter in enforced mode on a test project. Copy the configuration to production after successful testing.

## Question 104

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your ecommerce application on Cloud Run. You want to test the new revision in production without sending any live user traffic to it. After testing through a dedicated URL, you will gradually migrate traffic to the new revision if testing is successful. What should you do?

**Correct answer:** B. Deploy the new revision using gcloud run deploy with the --no-traffic flag and a --tag parameter. Test the revision using its tag-specific URL, then use gcloud run services update-traffic to gradually migrate traffic.

**Options:**

- **A.** Deploy the new revision using gcloud run deploy and immediately use gcloud run services update-traffic to set the new revision to 0% traffic. Test using the service's default URL.
- **B.** Deploy the new revision using gcloud run deploy with the --no-traffic flag and a --tag parameter. Test the revision using its tag-specific URL, then use gcloud run services update-traffic to gradually migrate traffic. — _correct answer_
- **C.** Deploy the new revision to a staging Cloud Run service first. After testing, delete the staging service and redeploy the same container to the production service with 100% traffic allocation.
- **D.** Deploy the new revision using gcloud run deploy with the --min-instances=0 flag. Test the revision when no instances are running, then increase minimum instances to serve live traffic.

## Question 105

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are operating a Memorystore for Redis instance for your production application. Cloud Monitoring alerts indicate that the system memory usage ratio has exceeded 80%. You need to take immediate action to prevent an out-of-memory condition while maintaining application performance. What should you do?

**Correct answer:** B. Enable activedefrag for the Redis instance and set appropriate TTLs on volatile keys to allow the eviction policy to manage memory effectively.

**Options:**

- **A.** Immediately delete all keys from the Redis instance using the FLUSHALL command to free memory and allow the cache to rebuild naturally.
- **B.** Enable activedefrag for the Redis instance and set appropriate TTLs on volatile keys to allow the eviction policy to manage memory effectively. — _correct answer_
- **C.** Change the eviction policy to noeviction to prevent any automatic key removal and protect critical cached data from being lost.
- **D.** Restart the Memorystore instance to reset memory usage and clear any memory fragmentation issues that have accumulated over time.

## Question 106

**Domain:** Building and testing applications

**Question:** During a canary deployment of your Cloud Run service, you notice increased error rates after routing 10% of traffic to the new revision. You need to immediately route all traffic back to the stable revision to protect users from the faulty code. What is the most efficient way to perform this rollback?

**Correct answer:** D. Run 'gcloud run services update-traffic myservice --to-revisions STABLE_REVISION=100' where STABLE_REVISION is the name of the last known working revision.

**Options:**

- **A.** Run 'gcloud run services update myservice --min-instances=0 --revision CANARY_REVISION' to scale down the canary revision to zero instances.
- **B.** Run 'gcloud run revisions delete CANARY_REVISION --region REGION' to remove the faulty revision and restore traffic to the previous revision.
- **C.** Run 'gcloud run deploy myservice --image gcr.io/project/stable-image:v1' to redeploy the stable version and automatically receive 100% of traffic.
- **D.** Run 'gcloud run services update-traffic myservice --to-revisions STABLE_REVISION=100' where STABLE_REVISION is the name of the last known working revision. — _correct answer_

## Question 107

**Domain:** Deploying applications

**Question:** Your Cloud Run application needs to access an API key stored in Secret Manager. The API key value may be rotated periodically without notice, and you want the application to automatically use the updated value without requiring redeployment. How should you configure the secret reference?

**Correct answer:** D. Mount the secret as a volume in Cloud Run and specify the 'latest' version alias in the configuration.

**Options:**

- **A.** Configure the secret as an environment variable with a specific pinned version number for stability.
- **B.** Expose the secret as an environment variable and specify the 'latest' version alias in the configuration.
- **C.** Use the Secret Manager client library to fetch the secret value at application startup and cache it in memory.
- **D.** Mount the secret as a volume in Cloud Run and specify the 'latest' version alias in the configuration. — _correct answer_

## Question 108

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a web application that displays a real-time feed of user activities stored in Firestore. You need to distinguish between activities that are newly added, updated, or removed from the collection. Which approach correctly identifies the different types of document changes within a snapshot listener callback?

**Correct answer:** B. Access the docChanges array from the query snapshot and check each change object's type property for ADDED, MODIFIED, or REMOVED values.

**Options:**

- **A.** Compare the document IDs in the current snapshot with a locally cached list from the previous snapshot to determine changes.
- **B.** Access the docChanges array from the query snapshot and check each change object's type property for ADDED, MODIFIED, or REMOVED values. — _correct answer_
- **C.** Query the Firestore audit logs using Cloud Logging API to retrieve operation types performed on documents in the collection.
- **D.** Create separate snapshot listeners with different filters for new, updated, and deleted documents in three distinct queries.

## Question 109

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a financial application using Cloud Firestore that requires atomically updating account balances based on their current values during fund transfers. The application runs on a backend service with a server client library. You need to ensure data consistency when multiple concurrent transfer requests target the same accounts. What should you do?

**Correct answer:** C. Use Firestore transactions with reads before writes to get current balances and update documents atomically, allowing the client library to handle retries for data contention.

**Options:**

- **A.** Use Cloud Functions triggers to listen for balance update events and process transfers sequentially to avoid any concurrent modifications to account documents.
- **B.** Use batched writes to update multiple account balances in a single atomic operation and validate balance constraints in your application before committing.
- **C.** Use Firestore transactions with reads before writes to get current balances and update documents atomically, allowing the client library to handle retries for data contention. — _correct answer_
- **D.** Use individual document updates with application-level locking by storing a lock field in each account document to prevent concurrent modifications.

## Question 110

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is building a Cloud Run API service that executes background tasks after returning HTTP responses to clients. The application uses Go's goroutines to process data asynchronously. During testing, you observe that background tasks are not completing as expected after responses are sent. What should you configure to resolve this issue?

**Correct answer:** C. Set the billing setting to instance-based billing using the --no-cpu-throttling flag during deployment.

**Options:**

- **A.** Enable startup CPU boost to allocate more CPU resources during and after container initialization.
- **B.** Configure minimum instances to 1 to ensure an instance is always available to process background work.
- **C.** Set the billing setting to instance-based billing using the --no-cpu-throttling flag during deployment. — _correct answer_
- **D.** Increase the request timeout to allow more time for background tasks to complete before the response is finalized.

## Question 111

**Domain:** Building and testing applications

**Question:** You are developing a Python application using Cloud Code in VS Code and want to build container images without writing a Dockerfile. You need to create secure, production-ready images. What should you configure in your development environment?

**Correct answer:** B. Configure Cloud Code to use Google Cloud buildpacks, which auto-detect the language and create container images from source code.

**Options:**

- **A.** Enable the Cloud Build extension in VS Code which automatically containerizes applications using AI-based detection.
- **B.** Configure Cloud Code to use Google Cloud buildpacks, which auto-detect the language and create container images from source code. — _correct answer_
- **C.** Write a custom shell script that invokes 'docker build' with auto-generated Dockerfile contents based on file extensions.
- **D.** Configure Cloud Code to use Kaniko builder which automatically generates Dockerfile from source analysis.

## Question 112

**Domain:** Deploying applications

**Question:** Your company is deploying a Cloud Run service that connects to a Cloud SQL database. The database password is stored in Secret Manager. You need to configure the Cloud Run service to access this secret while ensuring that password rotation can occur without redeploying the service. What should you do?

**Correct answer:** A. Configure the secret as a mounted volume in Cloud Run, referencing the latest version of the secret.

**Options:**

- **A.** Configure the secret as a mounted volume in Cloud Run, referencing the latest version of the secret. — _correct answer_
- **B.** Configure the secret as an environment variable in Cloud Run, referencing the latest version of the secret.
- **C.** Use the Secret Manager client library in your application code to fetch the secret on each request.
- **D.** Configure the secret as an environment variable in Cloud Run, pinning to a specific version number.

## Question 113

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application stores product catalog data in Cloud Firestore. Users frequently search for products by filtering on price range and sorting by rating. You notice that these queries are returning errors about missing indexes. You want to optimize query performance and minimize index management overhead. What should you do?

**Correct answer:** B. Follow the direct link in the error message to create the missing composite index in the Firebase console, which will be pre-populated with the correct field configuration.

**Options:**

- **A.** Disable automatic indexing for all fields and manually create only the specific composite indexes needed by your application.
- **B.** Follow the direct link in the error message to create the missing composite index in the Firebase console, which will be pre-populated with the correct field configuration. — _correct answer_
- **C.** Modify your queries to filter and sort on the same field to avoid the need for composite indexes.
- **D.** Create separate single-field indexes for the price and rating fields with both ascending and descending modes to cover all query variations.

## Question 114

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying a production application on GKE that accesses API keys from Secret Manager. The security team requires that applications always use validated and tested secret versions rather than automatically picking up new versions that might contain errors. How should you configure your application to follow Google-recommended best practices?

**Correct answer:** C. Reference secrets by their specific version number in your deployment configuration and update version numbers through your existing release processes.

**Options:**

- **A.** Store secrets locally in your GKE cluster as Kubernetes Secrets and manually sync them from Secret Manager periodically to maintain control over version updates.
- **B.** Create a custom version alias called 'production' and have your application always access this alias to simplify secret management.
- **C.** Reference secrets by their specific version number in your deployment configuration and update version numbers through your existing release processes. — _correct answer_
- **D.** Configure your application to always use the latest alias when accessing secrets to ensure it automatically receives the most recent credentials.

## Question 115

**Domain:** Deploying applications

**Question:** Your team is deploying a containerized application to GKE that requires database connection strings and API endpoint URLs. These configuration values vary between development, staging, and production environments. You want to update configuration values without restarting pods when possible. What should you do?

**Correct answer:** A. Create ConfigMaps for each environment and mount them as volumes in your pods. Configure your application to watch the mounted files for changes.

**Options:**

- **A.** Create ConfigMaps for each environment and mount them as volumes in your pods. Configure your application to watch the mounted files for changes. — _correct answer_
- **B.** Store the configuration in a Cloud SQL database and query it from your application at runtime. Use the Cloud SQL Auth Proxy for secure connections.
- **C.** Create ConfigMaps for each environment and inject them as environment variables. Configure rolling restarts when ConfigMaps are updated.
- **D.** Create Kubernetes Secrets for each environment and reference them in pod specifications. Enable automatic secret rotation in the cluster.

## Question 116

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Run application reports custom OTLP metrics using the Google-Built OpenTelemetry Collector as a sidecar. The metrics are successfully appearing in Cloud Monitoring, but you notice authorization errors in the sidecar logs. You need to grant the minimum permissions required for the sidecar to write metrics. What should you do?

**Correct answer:** B. Grant the Monitoring Metric Writer role (roles/monitoring.metricWriter) to the Cloud Run service identity.

**Options:**

- **A.** Grant the Monitoring Editor role (roles/monitoring.editor) to the Cloud Run service identity.
- **B.** Grant the Monitoring Metric Writer role (roles/monitoring.metricWriter) to the Cloud Run service identity. — _correct answer_
- **C.** Grant the Monitoring Admin role (roles/monitoring.admin) to the Cloud Run service identity.
- **D.** Grant the Monitoring Viewer role (roles/monitoring.viewer) to the Cloud Run service identity.

## Question 117

**Domain:** Deploying applications

**Question:** A development team is deploying Cloud Run services that access secrets stored in a centralized secrets project different from the application project. The service uses a dedicated service account. What configuration is required for the Cloud Run service to access secrets from the other project?

**Correct answer:** B. Grant the Cloud Run service account the Secret Manager Secret Accessor role on the specific secret in the centralized secrets project.

**Options:**

- **A.** Enable cross-project API access in the centralized secrets project and reference secrets using the project ID prefix.
- **B.** Grant the Cloud Run service account the Secret Manager Secret Accessor role on the specific secret in the centralized secrets project. — _correct answer_
- **C.** Copy the secrets to the application project and configure separate IAM permissions for each project's copy.
- **D.** Create a VPC peering connection between the two projects to allow secret access across project boundaries.

## Question 118

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a data analytics application protected by VPC Service Controls. Data analysts need to access BigQuery tables within the perimeter from corporate office networks with known public IP ranges. They also need access when working remotely from company-managed devices with Chrome Enterprise Premium. You want to implement context-aware access following Google-recommended practices. What should you do?

**Correct answer:** A. Create two access levels in Access Context Manager: one for corporate IP ranges and one for device trust with Chrome Enterprise Premium. Configure an ingress rule that references both access levels using OR conditions.

**Options:**

- **A.** Create two access levels in Access Context Manager: one for corporate IP ranges and one for device trust with Chrome Enterprise Premium. Configure an ingress rule that references both access levels using OR conditions. — _correct answer_
- **B.** Configure firewall rules in the VPC network to allow traffic only from corporate IP ranges. Use Identity-Aware Proxy to enforce device trust for remote users accessing BigQuery.
- **C.** Create a single access level combining corporate IP ranges and device trust attributes. Attach this access level directly to the service perimeter configuration.
- **D.** Create separate service perimeters for corporate and remote access scenarios. Configure perimeter bridges to allow data flow between perimeters based on the user's location.

## Question 119

**Domain:** Deploying applications

**Question:** You are troubleshooting a Cloud Run service that is failing to connect to a PostgreSQL database running on Cloud SQL with a private IP address. The VPC connector is configured correctly and is in the same region as the Cloud Run service. Firewall rules allow traffic from the connector's subnet to the database. What additional configuration should you verify to ensure connectivity?

**Correct answer:** B. Verify that the Cloud Run service has the VPC connector attached and the egress setting includes routing to private IPs.

**Options:**

- **A.** Verify that SSL certificates are configured for encrypted connections to Cloud SQL.
- **B.** Verify that the Cloud Run service has the VPC connector attached and the egress setting includes routing to private IPs. — _correct answer_
- **C.** Verify that the Cloud SQL instance has authorized the VPC connector's external IP address.
- **D.** Verify that the Cloud SQL Admin API is enabled and the service account has the Cloud SQL Client role.

## Question 120

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a new application on Google Cloud that processes sensitive healthcare data. Before enforcing VPC Service Controls in production, you need to understand the impact on existing workloads without blocking any legitimate traffic. You want to identify potential violations that would occur when the perimeter is enforced. What should you do?

**Correct answer:** B. Create a VPC Service Controls perimeter in dry run mode. Execute your workloads and analyze the violation logs in Cloud Audit Logs to identify any issues before switching to enforced mode.

**Options:**

- **A.** Create a VPC Service Controls perimeter in enforced mode and add all services to the restricted services list. Roll back immediately if applications report errors.
- **B.** Create a VPC Service Controls perimeter in dry run mode. Execute your workloads and analyze the violation logs in Cloud Audit Logs to identify any issues before switching to enforced mode. — _correct answer_
- **C.** Create separate VPC Service Controls perimeters for each application and test them individually in enforced mode using a staging environment.
- **D.** Use Cloud Monitoring to track API calls across your projects and manually identify any requests that would violate perimeter policies.

## Question 121

**Domain:** Building and testing applications

**Question:** Your team uses Cloud Code for VS Code to develop containerized applications. During debugging sessions, you notice that source code changes require a manual rebuild and restart to take effect, which slows down your development workflow. You want changes to be automatically detected and the application to be redeployed when you save files. What configuration change should you make?

**Correct answer:** C. Ensure the watch flag is set to true in your project's .vscode/launch.json file for the Cloud Code run configuration.

**Options:**

- **A.** Enable hot module replacement (HMR) in your application's webpack configuration to handle automatic code reloading.
- **B.** Configure a file system watcher using VS Code's built-in tasks.json to trigger manual builds when files change.
- **C.** Ensure the watch flag is set to true in your project's .vscode/launch.json file for the Cloud Code run configuration. — _correct answer_
- **D.** Install the Skaffold CLI separately and run skaffold dev from the terminal to enable file watching independently of Cloud Code.

## Question 122

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing time-series data for industrial sensors in Cloud Bigtable. Sensors report 100 measurements every second, and your primary query pattern retrieves all measurements for a specific sensor within a one-hour window. You want to optimize for read performance and storage efficiency. Which time-series schema pattern should you use?

**Correct answer:** B. Use a time bucket pattern with row keys like sensorId#hourBucket, storing each measurement as a separate column within the row for that hour.

**Options:**

- **A.** Store all measurements for each sensor in a single row with sensorId as the row key, using cell timestamps for versioning.
- **B.** Use a time bucket pattern with row keys like sensorId#hourBucket, storing each measurement as a separate column within the row for that hour. — _correct answer_
- **C.** Use row keys formatted as timestamp#sensorId to enable efficient chronological scans across all sensors.
- **D.** Use a single-timestamp pattern with row keys like sensorId#timestamp, creating one row per measurement.

## Question 123

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a Cloud Bigtable table to store user profile data and user activity metrics. Profile data changes infrequently and should be retained indefinitely, while activity metrics are updated frequently and only the last 30 days of data is needed. How should you design your schema to optimize storage costs while maintaining performance?

**Correct answer:** C. Store profile data and activity metrics in separate column families within the same table, with different garbage collection policies for each column family.

**Options:**

- **A.** Store profile data and activity metrics in separate Bigtable tables with different garbage collection configurations at the table level.
- **B.** Store all data in a single column family and use application logic to periodically delete activity metrics older than 30 days.
- **C.** Store profile data and activity metrics in separate column families within the same table, with different garbage collection policies for each column family. — _correct answer_
- **D.** Store profile data in Cloud SQL for persistent storage and use Bigtable only for the activity metrics that require high write throughput.

## Question 124

**Domain:** Integrating applications with Google Cloud services

**Question:** You are deploying a Cloud Run service that needs to emit custom application metrics, such as request queue depth and business transaction counts, to Cloud Monitoring. You want to use Google-recommended practices with minimal operational overhead. What should you do?

**Correct answer:** D. Add the Managed Service for Prometheus sidecar or the Google-Built OpenTelemetry Collector as a sidecar to your Cloud Run service. Instrument your application to emit metrics in Prometheus or OTLP format.

**Options:**

- **A.** Configure Cloud Run to automatically collect all application metrics by enabling the system metrics package in the Cloud Run service configuration.
- **B.** Use the Cloud Monitoring API client library directly in your application code to write custom metrics to Cloud Monitoring without any additional containers.
- **C.** Deploy a standalone Prometheus server on Compute Engine that scrapes your Cloud Run service endpoint. Configure Prometheus to remote-write metrics to Cloud Monitoring.
- **D.** Add the Managed Service for Prometheus sidecar or the Google-Built OpenTelemetry Collector as a sidecar to your Cloud Run service. Instrument your application to emit metrics in Prometheus or OTLP format. — _correct answer_

## Question 125

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service that connects to a Cloud SQL database. The database password is stored in Secret Manager and must be available to your application. You need to ensure the application always gets the latest secret value when the password is rotated, even without redeploying the service. How should you configure the secret?

**Correct answer:** B. Mount the secret as a volume and configure the application to read the secret from the mounted file path at runtime.

**Options:**

- **A.** Expose the secret as an environment variable using the 'latest' version alias.
- **B.** Mount the secret as a volume and configure the application to read the secret from the mounted file path at runtime. — _correct answer_
- **C.** Store the password directly in a plain text environment variable and update it manually when rotating.
- **D.** Use the Secret Manager client library to fetch the secret in your application code at service startup.

## Question 126

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a mobile banking application using Firestore with offline persistence enabled. Your application uses snapshot listeners to display account transactions. Users need to know whether the transaction data they are viewing is from the local cache or has been synchronized with the server. How should you implement this feature?

**Correct answer:** D. Check the fromCache property in the SnapshotMetadata of each snapshot event to determine if data came from the cache or the server.

**Options:**

- **A.** Compare the document read time with the current time to estimate if the data is potentially stale based on a configurable threshold.
- **B.** Monitor network connectivity status and assume all data is from the cache when the device reports being offline to users.
- **C.** Implement a timestamp field in each document and compare it with the last known server time to detect data freshness.
- **D.** Check the fromCache property in the SnapshotMetadata of each snapshot event to determine if data came from the cache or the server. — _correct answer_

## Question 127

**Domain:** Building and testing applications

**Question:** You are implementing a canary deployment strategy for a Cloud Run service. During testing, you discover that Cloud Run traffic changes are not instantaneous. A team member asks what happens to in-flight requests when traffic percentages are updated. What is the correct behavior?

**Correct answer:** B. In-flight requests continue to completion on their original revision, and new requests follow the updated traffic split.

**Options:**

- **A.** In-flight requests are queued and held until the traffic update completes, then distributed based on the new configuration.
- **B.** In-flight requests continue to completion on their original revision, and new requests follow the updated traffic split. — _correct answer_
- **C.** In-flight requests are immediately terminated and restarted according to the new traffic split configuration.
- **D.** In-flight requests fail with a 503 error during the traffic transition period until the new configuration takes effect.

## Question 128

**Domain:** Building and testing applications

**Question:** Your organization requires all container images deployed to GKE to have SLSA Level 3 compliant build provenance for supply chain security. You are setting up a new CI/CD pipeline using Cloud Build and Artifact Registry. You need to ensure provenance metadata is generated and verified for each build. What should you do?

**Correct answer:** A. Create a Cloud Build trigger connected to your source repository to initiate builds and add the requestedVerifyOption: VERIFIED setting in the options field of your cloudbuild.yaml file.

**Options:**

- **A.** Create a Cloud Build trigger connected to your source repository to initiate builds and add the requestedVerifyOption: VERIFIED setting in the options field of your cloudbuild.yaml file. — _correct answer_
- **B.** Enable the Container Analysis API and configure a Cloud Function to generate provenance metadata after each image is pushed to Artifact Registry.
- **C.** Manually run gcloud builds submit commands with the --provenance flag enabled and store the generated attestation files in a separate Cloud Storage bucket.
- **D.** Configure Binary Authorization to generate build provenance automatically when images are pushed to Artifact Registry from any source.

## Question 129

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a Cloud Run service that lists objects from Cloud Storage buckets and processes the results. The service frequently encounters 429 errors during peak hours when multiple instances run simultaneously. You need to implement proper error handling that follows Google Cloud best practices. Which code pattern should you implement?

**Correct answer:** D. Catch 429 errors and retry using truncated exponential backoff with jitter, starting at 1 second and increasing up to a maximum of 60 seconds between retries.

**Options:**

- **A.** Catch 429 errors and switch from JSON API to using the Cloud Storage client library, which automatically handles rate limiting without requiring retry logic.
- **B.** Catch 429 errors and reduce the maxResults parameter by half for each retry, eventually processing smaller pages to stay within rate limits.
- **C.** Catch 429 errors and immediately redirect the request to a different regional Cloud Storage endpoint to bypass the rate limit.
- **D.** Catch 429 errors and retry using truncated exponential backoff with jitter, starting at 1 second and increasing up to a maximum of 60 seconds between retries. — _correct answer_

## Question 130

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your ecommerce application uses Cloud Firestore to manage inventory across multiple warehouses. Each warehouse has a 'products' subcollection containing inventory documents. You need to query all products with low stock across all warehouses efficiently. What should you do?

**Correct answer:** B. Use a collection group query on the 'products' subcollection and create a composite index with collection group scope for the query filter fields.

**Options:**

- **A.** Create a Cloud Function triggered on inventory changes to aggregate low-stock products into a summary document that your application reads.
- **B.** Use a collection group query on the 'products' subcollection and create a composite index with collection group scope for the query filter fields. — _correct answer_
- **C.** Query each warehouse's 'products' subcollection individually in parallel from the client and merge the results in application code.
- **D.** Denormalize the data by duplicating all product inventory documents into a single top-level 'all-products' collection.

## Question 131

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Cloud Run application that requires database credentials stored in Secret Manager. Your team is deploying multiple application revisions per day as part of a CI/CD pipeline. You want to follow Google-recommended best practices to prevent service outages when accessing secrets. What should you do?

**Correct answer:** C. Reference secrets by their specific version number rather than using the 'latest' alias, and deploy version updates through your existing release processes.

**Options:**

- **A.** Store secrets as environment variables in Cloud Run instead of using Secret Manager to avoid version management complexity.
- **B.** Configure the Cloud Run service to use the 'latest' alias for all secrets to ensure the application always retrieves the most recent secret values automatically.
- **C.** Reference secrets by their specific version number rather than using the 'latest' alias, and deploy version updates through your existing release processes. — _correct answer_
- **D.** Create a custom Cloud Function that monitors Secret Manager for changes and automatically restarts the Cloud Run service when secrets are updated.

## Question 132

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have deployed an application on a GKE Autopilot cluster that uses Workload Identity Federation for GKE. Users report that the application sometimes fails to authenticate to Google Cloud APIs immediately after Pod startup. The application does not implement retry logic. What is the most efficient way to resolve this issue?

**Correct answer:** D. Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container by polling the metadata server endpoint with retries.

**Options:**

- **A.** Add the annotation 'traffic.sidecar.istio.io/excludeOutboundIPRanges=169.254.169.254/32' to all Pods that use Workload Identity to bypass the service mesh proxy for metadata requests.
- **B.** Configure a nodeSelector with 'iam.gke.io/gke-metadata-server-enabled: true' in your Pod specification to ensure Pods are scheduled on nodes with Workload Identity enabled.
- **C.** Increase the Pod's resource requests and limits to ensure the metadata server has sufficient resources to start faster on Pod creation.
- **D.** Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container by polling the metadata server endpoint with retries. — _correct answer_

## Question 133

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company's analytics team frequently runs complex reporting queries against your production Cloud SQL for PostgreSQL database, causing performance degradation for user-facing transactions. You need to isolate the analytics workload without affecting production traffic. What should you do?

**Correct answer:** B. Create a read replica in the same region as the primary instance and configure the analytics application to direct all read queries to the replica's connection string.

**Options:**

- **A.** Increase the max_connections flag and machine type on the primary instance to handle both analytics and production workloads simultaneously.
- **B.** Create a read replica in the same region as the primary instance and configure the analytics application to direct all read queries to the replica's connection string. — _correct answer_
- **C.** Create a scheduled export of the database to BigQuery and configure the analytics team to query BigQuery instead of the Cloud SQL instance.
- **D.** Enable Managed Connection Pooling with session pooling mode on the primary instance to prioritize transactional workloads over analytics queries.

## Question 134

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a Cloud Run service that exposes Prometheus-format custom metrics for business logic monitoring. You need to collect these metrics and create alerting policies in Cloud Monitoring. What should you do?

**Correct answer:** A. Deploy the Managed Service for Prometheus sidecar container alongside your application container in the Cloud Run service. Create alerting policies using PromQL conditions in Cloud Monitoring.

**Options:**

- **A.** Deploy the Managed Service for Prometheus sidecar container alongside your application container in the Cloud Run service. Create alerting policies using PromQL conditions in Cloud Monitoring. — _correct answer_
- **B.** Create a separate Cloud Run service that periodically polls your application's metrics endpoint and uses the Cloud Monitoring API to write custom metrics.
- **C.** Install the Ops Agent in your Cloud Run container image to collect and forward Prometheus metrics to Cloud Monitoring for alerting.
- **D.** Configure Cloud Run to automatically scrape the /metrics endpoint and send data to Cloud Monitoring using native integration without any additional configuration.

## Question 135

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring API Gateway to route requests to multiple Cloud Run services based on the API path. You need to set up the x-google-backend extension to route /orders requests to an orders service and /inventory requests to an inventory service. What is the correct approach?

**Correct answer:** D. Define the x-google-backend extension at the operation level for each path, specifying the address of the corresponding backend service for each operation.

**Options:**

- **A.** Define multiple x-google-backend extensions at the top level of the specification with different path patterns to route requests to different backends.
- **B.** Use the x-google-allow extension set to 'all' and implement path-based routing logic in a reverse proxy between API Gateway and your backend services.
- **C.** Configure a single x-google-backend at the top level with path_translation set to APPEND_PATH_TO_ADDRESS, which will automatically route based on the request path.
- **D.** Define the x-google-backend extension at the operation level for each path, specifying the address of the corresponding backend service for each operation. — _correct answer_

## Question 136

**Domain:** Building and testing applications

**Question:** Your Cloud Run service is undergoing a gradual canary rollout. The new revision is receiving 25% of traffic. You want to monitor the health of the new revision compared to the existing stable revision to decide whether to proceed with the rollout. Which approach provides the most effective way to compare revision performance?

**Correct answer:** B. Use Cloud Monitoring and Cloud Logging with revision-based filters to compare error rates, latency distributions, and request counts between the two revisions serving traffic.

**Options:**

- **A.** Deploy both revisions as separate Cloud Run services with distinct service URLs, then use an external load balancer to split traffic and collect metrics.
- **B.** Use Cloud Monitoring and Cloud Logging with revision-based filters to compare error rates, latency distributions, and request counts between the two revisions serving traffic. — _correct answer_
- **C.** Configure session affinity on the new revision so specific test users are always routed to it, then gather feedback directly from those users about their experience.
- **D.** Add custom health check endpoints to each revision that report their version, then poll these endpoints periodically to verify both revisions are responding.

## Question 137

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on GKE uses Workload Identity Federation for GKE to authenticate to Google Cloud APIs. After deploying new Pods, you observe intermittent authentication failures occurring within the first few seconds of Pod startup. The errors indicate that the metadata server could not be reached. What should you do to prevent these authentication failures while minimizing application code changes?

**Correct answer:** B. Add an initContainer to your Pod specification that waits until the GKE metadata server is ready before the main application container starts.

**Options:**

- **A.** Increase the memory and CPU limits for the gke-metadata-server DaemonSet Pods to reduce authentication latency during Pod startup.
- **B.** Add an initContainer to your Pod specification that waits until the GKE metadata server is ready before the main application container starts. — _correct answer_
- **C.** Configure your network policies to prioritize traffic from Pods to the metadata server IP address 169.254.169.254 to reduce connection establishment time.
- **D.** Disable Workload Identity Federation for GKE on the node pool and configure your Pods to use the Compute Engine metadata server directly with the node's service account.

## Question 138

**Domain:** Deploying applications

**Question:** Your company is deploying a web application on GKE that needs to be accessible only from within your organization's VPC network. The application requires HTTP(S) load balancing with URL-based routing to multiple backend services. You need to configure the Ingress resource to deploy the appropriate load balancer type. What should you do?

**Correct answer:** D. Add the annotation kubernetes.io/ingress.class: 'gce-internal' to the Ingress manifest to deploy an internal Application Load Balancer.

**Options:**

- **A.** Add the annotation kubernetes.io/ingress.class: 'gce' to the Ingress manifest to deploy an external Application Load Balancer with firewall rules limiting access to internal IPs.
- **B.** Create a Service of type LoadBalancer with the annotation networking.gke.io/load-balancer-type: 'Internal' to expose the application internally.
- **C.** Use spec.ingressClassName: 'gce-internal' in the Ingress manifest instead of annotations to deploy an internal Application Load Balancer.
- **D.** Add the annotation kubernetes.io/ingress.class: 'gce-internal' to the Ingress manifest to deploy an internal Application Load Balancer. — _correct answer_

## Question 139

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You manage a data analytics platform on Google Cloud protected by VPC Service Controls. A partner organization needs read-only access to specific BigQuery datasets within your perimeter using their own service accounts from their VPC network. You want to allow this access while minimizing the risk of data exfiltration. What should you configure?

**Correct answer:** B. Create an ingress rule that specifies the partner's project as a source, restricts identities to their specific service accounts, and limits operations to BigQuery read methods such as bigquery.datasets.get and bigquery.tables.getData.

**Options:**

- **A.** Add the partner's project to your service perimeter and configure VPC accessible services to restrict their access to BigQuery only. Use IAM conditions to limit their service accounts to read-only operations.
- **B.** Create an ingress rule that specifies the partner's project as a source, restricts identities to their specific service accounts, and limits operations to BigQuery read methods such as bigquery.datasets.get and bigquery.tables.getData. — _correct answer_
- **C.** Create an access level that allows access from the partner's corporate IP ranges. Apply this access level to your service perimeter and grant the partner's service accounts IAM permissions on the BigQuery datasets.
- **D.** Create a perimeter bridge between your perimeter and a new perimeter containing the partner's project. Configure IAM permissions to grant read-only access to the BigQuery datasets.

## Question 140

**Domain:** Deploying applications

**Question:** Your team is setting up a CI/CD pipeline using Cloud Build to build container images and push them to Artifact Registry for deployment to GKE. Your security team requires that all container images have SLSA build provenance metadata for supply chain verification. You need to configure Cloud Build to generate this provenance information. What should you do?

**Correct answer:** B. Use the images field in your cloudbuild.yaml to specify images to push to Artifact Registry after the build completes, rather than using a docker push build step.

**Options:**

- **A.** Enable the Container Analysis API and add the --provenance flag to your docker build command in the cloudbuild.yaml file.
- **B.** Use the images field in your cloudbuild.yaml to specify images to push to Artifact Registry after the build completes, rather than using a docker push build step. — _correct answer_
- **C.** Add a docker push step to your cloudbuild.yaml after the docker build step to push images to Artifact Registry, which automatically generates provenance metadata.
- **D.** Configure Binary Authorization policies in your GKE cluster to require SLSA provenance, which triggers Cloud Build to generate it automatically during any push operation.

## Question 141

**Domain:** Building and testing applications

**Question:** Your team has deployed a new revision of a Cloud Run service and started a gradual canary rollout. The canary revision is currently receiving 25% of traffic. After monitoring the service, you observe increased error rates. You need to quickly roll back all traffic to the stable revision. What is the most efficient approach?

**Correct answer:** B. Run gcloud run services update-traffic SERVICE --to-revisions STABLE_REVISION=100 to route all traffic to the stable revision.

**Options:**

- **A.** Delete the canary revision using gcloud run revisions delete and redeploy the stable revision to restore service.
- **B.** Run gcloud run services update-traffic SERVICE --to-revisions STABLE_REVISION=100 to route all traffic to the stable revision. — _correct answer_
- **C.** Modify the Cloud Run service YAML to remove the canary revision from the traffic section, then run gcloud run services replace service.yaml.
- **D.** Set the canary revision's minimum instances to 0 to stop processing requests, then redeploy the stable revision with 100% traffic.

## Question 142

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that requires database credentials stored in Secret Manager. The deployment fails with a permission denied error when trying to access the secret. The service uses a custom service account. What IAM role must be granted to the Cloud Run service identity to resolve this issue?

**Correct answer:** A. Grant the Secret Manager Secret Accessor (roles/secretmanager.secretAccessor) role to the Cloud Run service account on the secret.

**Options:**

- **A.** Grant the Secret Manager Secret Accessor (roles/secretmanager.secretAccessor) role to the Cloud Run service account on the secret. — _correct answer_
- **B.** Grant the Editor (roles/editor) role to the Cloud Run service account on the project.
- **C.** Grant the Secret Manager Admin (roles/secretmanager.admin) role to the Cloud Run service account on the project.
- **D.** Grant the Viewer (roles/viewer) role to the Cloud Run service account on the secret.

## Question 143

**Domain:** Building and testing applications

**Question:** You are deploying a new version of an e-commerce application running on Cloud Run. You need to test the new revision in production without exposing it to end users before gradually rolling it out. You want to follow Google-recommended practices for canary deployments. What should you do?

**Correct answer:** B. Deploy the new revision using gcloud run deploy with the --no-traffic and --tag flags. Test the new revision at its dedicated tag URL before using gcloud run services update-traffic to gradually shift traffic.

**Options:**

- **A.** Deploy the new revision using gcloud run deploy, then immediately update Cloud Monitoring alerts to detect errors in the new revision before shifting traffic using the console.
- **B.** Deploy the new revision using gcloud run deploy with the --no-traffic and --tag flags. Test the new revision at its dedicated tag URL before using gcloud run services update-traffic to gradually shift traffic. — _correct answer_
- **C.** Create a new Cloud Run service for the canary version and configure Cloud Load Balancing to split traffic between the two services using weighted backends.
- **D.** Deploy the new revision to a staging project, run integration tests, then redeploy the same container to the production project with 100% traffic.

## Question 144

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a new data analytics platform on Google Cloud with BigQuery and Cloud Storage containing sensitive financial data. Before enforcing VPC Service Controls to prevent data exfiltration, you need to understand the impact on existing applications without disrupting production workloads. What should you do?

**Correct answer:** C. Create a service perimeter in dry run mode to log policy violations without blocking access, then analyze the logs to identify and remediate potential issues before switching to enforced mode.

**Options:**

- **A.** Deploy a duplicate set of BigQuery and Cloud Storage resources in a separate project, configure the perimeter around the duplicate resources, and have developers test their applications against it.
- **B.** Create the service perimeter in enforced mode and configure broad egress rules to allow all outbound traffic initially, then gradually remove rules over time to identify issues.
- **C.** Create a service perimeter in dry run mode to log policy violations without blocking access, then analyze the logs to identify and remediate potential issues before switching to enforced mode. — _correct answer_
- **D.** Create access levels that allow all traffic from your corporate network and apply them to the perimeter, then monitor Cloud Audit Logs for unauthorized access attempts.

## Question 145

**Domain:** Integrating applications with Google Cloud services

**Question:** You manage a GKE Autopilot cluster running critical production workloads. You notice that some pods are frequently restarting, impacting application availability. You need to configure alerting to notify your team when the container restart count exceeds a threshold within a specific time period. You want to minimize configuration effort. What should you do?

**Correct answer:** D. Navigate to the GKE Observability tab in the Google Cloud console, select your cluster, and enable the recommended alerting policy for container restarts. Configure the notification channels for your team.

**Options:**

- **A.** Deploy a custom monitoring agent as a DaemonSet in the cluster to track container restarts and send notifications through a third-party messaging service.
- **B.** Write a Kubernetes CronJob that runs kubectl commands to check pod restart counts and sends alerts using a custom notification script.
- **C.** Create a custom dashboard in Cloud Monitoring with a chart showing container restart counts. Add a manual process for team members to check the dashboard periodically.
- **D.** Navigate to the GKE Observability tab in the Google Cloud console, select your cluster, and enable the recommended alerting policy for container restarts. Configure the notification channels for your team. — _correct answer_

## Question 146

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an application that stores large amounts of sensitive customer data in Cloud Storage. Your company's security policy requires using customer-managed encryption keys (CMEK) for all data at rest. You need to implement envelope encryption following Google-recommended best practices. What is the correct approach?

**Correct answer:** D. Generate data encryption keys (DEKs) locally to encrypt the data, then use your Cloud KMS key to wrap the DEK, and store the encrypted data alongside the wrapped DEK.

**Options:**

- **A.** Create a symmetric encryption key in Cloud KMS, download the key material to your application, and use it to encrypt data before storing it in Cloud Storage.
- **B.** Send all customer data directly to Cloud KMS for encryption using the Encrypt API, then store the encrypted data in Cloud Storage with references to the key version used.
- **C.** Configure Cloud Storage to automatically generate and manage DEKs, and set your Cloud KMS key as the default bucket encryption key without any application code changes.
- **D.** Generate data encryption keys (DEKs) locally to encrypt the data, then use your Cloud KMS key to wrap the DEK, and store the encrypted data alongside the wrapped DEK. — _correct answer_

## Question 147

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company aggregates logs from 20 projects into a central log bucket for security analysis. You need to create a log-based metric that counts authentication failures across all aggregated logs. The metric must be visible to the security team's Cloud Monitoring dashboard in a separate project. What should you do?

**Correct answer:** A. Create a bucket-scoped log-based metric in the project containing the central log bucket. Add the bucket's project to the security project's metrics scope.

**Options:**

- **A.** Create a bucket-scoped log-based metric in the project containing the central log bucket. Add the bucket's project to the security project's metrics scope. — _correct answer_
- **B.** Create an organization-level log-based metric using the gcloud CLI with the --organization flag.
- **C.** Export the central log bucket to BigQuery and create a scheduled query to write custom metrics using the Cloud Monitoring API.
- **D.** Create a project-scoped log-based metric in each of the 20 source projects and aggregate the results using Cloud Monitoring MQL queries.

## Question 148

**Domain:** Deploying applications

**Question:** Your company has a Cloud Run service that needs to connect to a self-managed database running on a Compute Engine VM within a VPC network. You are creating a Serverless VPC Access connector using the gcloud CLI. Which subnet configuration is required for the VPC connector?

**Correct answer:** B. A dedicated /28 subnet that is not used by any other resources.

**Options:**

- **A.** A /24 subnet with automatic IP address allocation from Google Cloud.
- **B.** A dedicated /28 subnet that is not used by any other resources. — _correct answer_
- **C.** Any existing subnet in the VPC network with available IP addresses.
- **D.** A /26 or larger subnet that can be shared with other VPC resources.

## Question 149

**Domain:** Deploying applications

**Question:** You are deploying a production web application on GKE using Ingress. The application requires a permanent IP address that persists across Ingress deletions and recreations for DNS configuration purposes. You are creating an external Application Load Balancer. What is the correct approach to configure a static IP address for your Ingress?

**Correct answer:** A. Reserve a global static external IP address using 'gcloud compute addresses create'. Add the 'kubernetes.io/ingress.global-static-ip-name' annotation to your Ingress manifest, referencing the IP address resource name.

**Options:**

- **A.** Reserve a global static external IP address using 'gcloud compute addresses create'. Add the 'kubernetes.io/ingress.global-static-ip-name' annotation to your Ingress manifest, referencing the IP address resource name. — _correct answer_
- **B.** Add the 'spec.loadBalancerIP' field directly in your Ingress manifest and specify the desired static IP address value. The GKE Ingress controller will automatically reserve and assign this IP address to your load balancer.
- **C.** Reserve a regional static external IP address using 'gcloud compute addresses create'. Add the 'kubernetes.io/ingress.regional-static-ip-name' annotation to your Ingress manifest with the IP address resource name.
- **D.** Create the Ingress first, then note the ephemeral IP address assigned. Use 'gcloud compute addresses create' to promote the ephemeral IP to a static IP address after the load balancer is provisioned.

## Question 150

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a dashboard application that lists Cloud Storage objects and only needs to display the object names and sizes. The bucket contains hundreds of thousands of objects. You want to optimize API performance and reduce bandwidth consumption when using the Cloud Storage JSON API. What should you do?

**Correct answer:** D. Use the fields query parameter to request only the items(name,size) and nextPageToken fields in the response, and use maxResults to limit objects per page.

**Options:**

- **A.** Configure the application to download the complete object listing once daily and cache the results in Memorystore for Redis to serve dashboard requests throughout the day.
- **B.** Use the projection parameter set to 'noAcl' to exclude access control information and limit each page to 100 results using maxResults.
- **C.** Enable Cloud CDN in front of the Cloud Storage bucket and configure the CDN to cache the object listing responses for reduced latency.
- **D.** Use the fields query parameter to request only the items(name,size) and nextPageToken fields in the response, and use maxResults to limit objects per page. — _correct answer_

## Question 151

**Domain:** Deploying applications

**Question:** You are creating a Serverless VPC Access connector for your Cloud Run services in a standalone VPC network. You want to specify a custom IP range for the connector. What subnet configuration requirement must you meet?

**Correct answer:** C. Provide an unused /28 CIDR range that does not conflict with any existing routes in the VPC network. Google Cloud will create a hidden subnet automatically.

**Options:**

- **A.** Provide an unused /24 CIDR range that will be subdivided by Google Cloud to accommodate connector scaling across multiple availability zones.
- **B.** Create any size subnet with at least 16 available IP addresses and ensure no other resources are using the subnet before creating the connector.
- **C.** Provide an unused /28 CIDR range that does not conflict with any existing routes in the VPC network. Google Cloud will create a hidden subnet automatically. — _correct answer_
- **D.** Create a /26 subnet in the VPC network and specify it when creating the connector. The connector will use IP addresses from this range.

## Question 152

**Domain:** Deploying applications

**Question:** You have deployed a containerized application to your GKE cluster using a Deployment. A critical bug has been discovered in the latest version, and you need to immediately roll back to the previous version with minimal downtime. You do not have the previous YAML manifest readily available. What should you do?

**Correct answer:** C. Run 'kubectl rollout undo deployment/<deployment-name>' to roll back to the previous revision.

**Options:**

- **A.** Run 'kubectl delete deployment/<deployment-name>' and then recreate it with the previous image version specified manually.
- **B.** Run 'kubectl rollout restart deployment/<deployment-name>' to restart all Pods with the previous container image.
- **C.** Run 'kubectl rollout undo deployment/<deployment-name>' to roll back to the previous revision. — _correct answer_
- **D.** Run 'kubectl set image deployment/<deployment-name> --previous' to revert the container image to the prior version.

## Question 153

**Domain:** Building and testing applications

**Question:** Your team deployed a new Cloud Run revision tagged as 'canary' that is currently receiving 10% of production traffic. After monitoring Cloud Logging and Error Reporting, you discover the new revision is generating errors. You need to immediately stop the canary revision from receiving traffic while maintaining service availability. What is the most efficient approach?

**Correct answer:** C. Run 'gcloud run services update-traffic SERVICE --to-revisions STABLE_REVISION=100' to route all traffic to the previous stable revision.

**Options:**

- **A.** Delete the canary revision using 'gcloud run revisions delete' to prevent it from receiving any more traffic.
- **B.** Scale the canary revision to zero instances using 'gcloud run services update' with '--min-instances=0' to stop processing requests.
- **C.** Run 'gcloud run services update-traffic SERVICE --to-revisions STABLE_REVISION=100' to route all traffic to the previous stable revision. — _correct answer_
- **D.** Deploy the previous container image as a new revision with the '--traffic' flag set to 100 to override the current traffic split.

## Question 154

**Domain:** Integrating applications with Google Cloud services

**Question:** Your GKE-based application reports custom health metrics using Prometheus format. You want to be notified when a critical service stops reporting its health metric for more than 15 minutes, indicating a potential outage. You need to configure the appropriate alerting policy. What should you do?

**Correct answer:** B. Create a metric-absence alerting policy that monitors the custom health metric, set the trigger absence time to 15 minutes, and ensure the policy has at least one successful metric data point after creation.

**Options:**

- **A.** Create a log-based alerting policy that monitors application logs for error messages, configure a filter that matches 'health check failed' messages within a 15-minute window.
- **B.** Create a metric-absence alerting policy that monitors the custom health metric, set the trigger absence time to 15 minutes, and ensure the policy has at least one successful metric data point after creation. — _correct answer_
- **C.** Create a metric-threshold alerting policy that monitors the custom health metric, set the threshold to zero, and configure the retest window to 15 minutes.
- **D.** Create a forecasted metric-value alerting policy that predicts when the health metric will drop to zero based on historical trends over a 15-minute forecast window.

## Question 155

**Domain:** Building and testing applications

**Question:** Your team uses Cloud Build to build container images and push them to Artifact Registry. A new security policy requires that the build service account has the minimum permissions necessary to push images. The Cloud Build service account and the Artifact Registry repository are in the same Google Cloud project. You need to verify the service account has appropriate access. Which IAM role should the Cloud Build service account have on the Artifact Registry repository?

**Correct answer:** D. Artifact Registry Writer (roles/artifactregistry.writer), which allows tagging and pushing images to the repository.

**Options:**

- **A.** Artifact Registry Administrator (roles/artifactregistry.admin), which provides full control over Artifact Registry resources including push operations.
- **B.** Artifact Registry Reader (roles/artifactregistry.reader), which allows pulling and pushing images to repositories.
- **C.** Storage Object Admin (roles/storage.objectAdmin), which provides full control over Cloud Storage objects used by Artifact Registry.
- **D.** Artifact Registry Writer (roles/artifactregistry.writer), which allows tagging and pushing images to the repository. — _correct answer_

## Question 156

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a social media application using Cloud Firestore. Your application stores millions of user posts, and each post document contains a 'lastModified' timestamp field that is updated whenever the post is edited. You notice that write latency is increasing and Key Visualizer shows hotspotting on index keys. You need to resolve the write performance issue. What should you do?

**Correct answer:** C. Add a single-field index exemption for the 'lastModified' field to prevent automatic indexing of the monotonically increasing timestamp values.

**Options:**

- **A.** Create a composite index that places 'lastModified' as the second field after a high-cardinality field to distribute index writes.
- **B.** Configure Firestore to use eventual consistency for writes to the 'lastModified' field to reduce write contention on index entries.
- **C.** Add a single-field index exemption for the 'lastModified' field to prevent automatic indexing of the monotonically increasing timestamp values. — _correct answer_
- **D.** Batch all post updates together and write them in a single batched write operation to reduce the frequency of index updates.

## Question 157

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Build pipeline to build container images and push them to Artifact Registry. You want the built images to appear in the build results page in the Google Cloud console so that you can track which images were produced by each build. Which approach should you use in your cloudbuild.yaml file?

**Correct answer:** D. Use both a docker push build step to push the image during the build and include the images field listing the same image paths to display them in build results.

**Options:**

- **A.** Use only the images field in the build config file, which automatically pushes and displays images in the build results.
- **B.** Use only the docker push command in a build step, as Cloud Build automatically indexes all pushed images for the results page.
- **C.** Configure Artifact Registry to automatically publish image metadata to Cloud Build via Pub/Sub to link pushed images to build results.
- **D.** Use both a docker push build step to push the image during the build and include the images field listing the same image paths to display them in build results. — _correct answer_

## Question 158

**Domain:** Building and testing applications

**Question:** You are optimizing a Cloud Build pipeline that uses a multi-stage Dockerfile with a builder stage and a runtime stage. The build frequently times out because the builder stage downloads large dependencies. You want to reduce build time by leveraging Docker build caching. Which approach correctly implements --cache-from with Cloud Build?

**Correct answer:** C. Add a build step to pull the existing image with bash entrypoint and exit 0 on failure, then use --cache-from in the docker build args to reference that image.

**Options:**

- **A.** Configure --cache-from in the Cloud Build trigger settings under advanced build options to automatically cache all Docker layers.
- **B.** Specify --cache-from in the docker build args pointing directly to the Artifact Registry image path without a separate pull step.
- **C.** Add a build step to pull the existing image with bash entrypoint and exit 0 on failure, then use --cache-from in the docker build args to reference that image. — _correct answer_
- **D.** Enable --cache-from by setting the builds/docker_cache property to true in the gcloud configuration before submitting the build.

## Question 159

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a single-threaded API application on Cloud Run that requires 4GB of memory per container instance. During load testing, you notice the service is not scaling out even when experiencing high latency under load. Cloud Monitoring shows average CPU utilization is only at 25%. You need to ensure the service scales appropriately to handle the incoming traffic. What should you do?

**Correct answer:** B. Lower the maximum concurrency setting to encourage scaling based on request throughput instead of CPU utilization.

**Options:**

- **A.** Enable startup CPU boost to temporarily increase CPU allocation and reduce cold start latency during scaling events.
- **B.** Lower the maximum concurrency setting to encourage scaling based on request throughput instead of CPU utilization. — _correct answer_
- **C.** Configure the service with instance-based billing to ensure CPU is always allocated and available for scaling decisions.
- **D.** Increase the CPU allocation to 8 vCPUs to provide more processing capacity and reduce the average utilization percentage.

## Question 160

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that uses Secret Manager secrets exposed as environment variables. Following Google-recommended best practices, how should you reference the secret versions in your deployment configuration?

**Correct answer:** B. Reference secrets by specific version numbers and update them through your existing release processes.

**Options:**

- **A.** Reference secrets without specifying a version to use the default system behavior.
- **B.** Reference secrets by specific version numbers and update them through your existing release processes. — _correct answer_
- **C.** Create a separate secret for each environment and reference them using the 'latest' alias for easier management.
- **D.** Reference secrets using the 'latest' alias to always get the most recent version automatically.

## Question 161

**Domain:** Deploying applications

**Question:** You have deployed a new version of your application to a GKE cluster, but users are reporting errors. You need to quickly revert to the previous working version while you investigate the issue. What kubectl command should you use to roll back the Deployment?

**Correct answer:** D. kubectl rollout undo deployment/my-app

**Options:**

- **A.** kubectl scale deployment/my-app --replicas=0 && kubectl set image deployment/my-app container=previous-image:tag
- **B.** kubectl delete deployment/my-app && kubectl apply -f deployment-previous.yaml
- **C.** kubectl rollout restart deployment/my-app
- **D.** kubectl rollout undo deployment/my-app — _correct answer_

## Question 162

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses the Cloud Storage JSON API to list objects in a bucket containing over 100,000 items. During execution, you notice the initial list request only returns a subset of objects with a nextPageToken in the response. You need to retrieve all objects in the bucket while following Google-recommended best practices. What should you do?

**Correct answer:** A. Pass the nextPageToken value to the pageToken parameter in subsequent requests, continuing until no nextPageToken is returned in the response.

**Options:**

- **A.** Pass the nextPageToken value to the pageToken parameter in subsequent requests, continuing until no nextPageToken is returned in the response. — _correct answer_
- **B.** Make parallel API requests for different object prefixes and combine the results to retrieve all objects faster.
- **C.** Increase the maxResults parameter to 100,000 in your initial request to retrieve all objects in a single API call.
- **D.** Store the nextPageToken value in a database and create a scheduled job to continue listing objects at fixed intervals until complete.

## Question 163

**Domain:** Integrating applications with Google Cloud services

**Question:** You are calling the Cloud Storage JSON API to list buckets in a project using a GET request to https://storage.googleapis.com/storage/v1/b. The project has hundreds of buckets and you need to process them in manageable batches. How should you control the number of buckets returned per API call?

**Correct answer:** B. Include the maxResults query parameter in your request to specify the maximum number of buckets to return per page, then use pageToken for subsequent pages.

**Options:**

- **A.** Use the range header to specify a byte range of the response, which Cloud Storage uses to determine how many bucket entries to include.
- **B.** Include the maxResults query parameter in your request to specify the maximum number of buckets to return per page, then use pageToken for subsequent pages. — _correct answer_
- **C.** Configure a project-level quota in the Google Cloud console to limit the number of items returned per API response across all list operations.
- **D.** Set the limit header in the HTTP request to specify the maximum number of buckets to return in a single API response.

## Question 164

**Domain:** Deploying applications

**Question:** You are configuring a CI/CD pipeline where Cloud Build builds container images and stores them in an Artifact Registry repository located in a different Google Cloud project. The builds are failing with permission denied errors when pushing images. The Cloud Build project uses the default Cloud Build service account. What should you do to resolve this issue?

**Correct answer:** B. Grant the Artifact Registry Writer role to the Cloud Build service account on the Artifact Registry repository in the other project.

**Options:**

- **A.** Create a service account key for the Cloud Build service account and store it as a Secret Manager secret referenced in the build configuration.
- **B.** Grant the Artifact Registry Writer role to the Cloud Build service account on the Artifact Registry repository in the other project. — _correct answer_
- **C.** Configure Docker authentication in the cloudbuild.yaml file using gcloud auth configure-docker before pushing images to the repository.
- **D.** Enable the Artifact Registry API in the Cloud Build project and grant the Storage Object Admin role to the Cloud Build service account.

## Question 165

**Domain:** Deploying applications

**Question:** You are configuring an Ingress resource on GKE to expose multiple services externally. Your cluster is VPC-native, and you want to take advantage of container-native load balancing for optimal traffic distribution. Which Service type should you use for the backend Services referenced by the Ingress?

**Correct answer:** A. Use type: ClusterIP for the backend Services when container-native load balancing is enabled.

**Options:**

- **A.** Use type: ClusterIP for the backend Services when container-native load balancing is enabled. — _correct answer_
- **B.** Use type: ExternalName for the backend Services to map directly to external DNS names for improved routing performance.
- **C.** Use type: NodePort for the backend Services, as this is always required for Ingress regardless of container-native load balancing settings.
- **D.** Use type: LoadBalancer for the backend Services to ensure each service has its own external IP address for the Ingress to reference.

## Question 166

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a mobile application with Firestore that allows users to edit documents offline. Users need immediate visual feedback when they make changes, but they also need to know whether their changes have been synchronized with the server. You want to implement a UI indicator that shows the synchronization status. What should you do?

**Correct answer:** C. Check the metadata.hasPendingWrites property on the document snapshot to determine if local changes have not yet been written to the backend.

**Options:**

- **A.** Use the Promise returned from the write operation and update the UI only after the Promise resolves to indicate successful synchronization.
- **B.** Implement a custom synchronization queue that tracks all write operations and removes them after receiving server confirmation callbacks.
- **C.** Check the metadata.hasPendingWrites property on the document snapshot to determine if local changes have not yet been written to the backend. — _correct answer_
- **D.** Store a local flag in SharedPreferences or UserDefaults after each write and clear it when the app detects network connectivity.

## Question 167

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses the Cloud Storage JSON API to list objects from a bucket containing over 100,000 objects. During peak load, the application occasionally receives HTTP 429 errors. You need to efficiently retrieve all objects while handling rate limiting appropriately. What should you do?

**Correct answer:** B. Use the maxResults parameter to limit the response size, pass the nextPageToken from each response to subsequent requests, and implement exponential backoff with jitter when receiving 429 errors.

**Options:**

- **A.** Use the maxResults parameter to retrieve all objects in a single request by setting it to 100000, and retry immediately when receiving 429 errors.
- **B.** Use the maxResults parameter to limit the response size, pass the nextPageToken from each response to subsequent requests, and implement exponential backoff with jitter when receiving 429 errors. — _correct answer_
- **C.** Cache the pageToken values and make parallel requests to multiple pages simultaneously to speed up retrieval, retrying failed requests with a fixed 1-second delay.
- **D.** Set up a Cloud Tasks queue to distribute object listing requests over time and use linear backoff when receiving 429 errors.

## Question 168

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team has deployed a Python API on Cloud Run with 4 vCPUs to meet high memory requirements. However, the application is single-threaded and CPU-bound. During load testing, you observe that autoscaling is not triggering even though individual requests experience high latency. What is the most likely cause of this issue, and how should you address it?

**Correct answer:** D. The single-threaded application only utilizes one vCPU, causing low average CPU utilization across all vCPUs. Lower the maximum concurrency setting to force scaling based on request throughput instead.

**Options:**

- **A.** The default minimum instances of 0 causes cold start delays that prevent autoscaling. Set minimum instances to match the expected baseline load.
- **B.** The 4 vCPU configuration exceeds the supported limit for Cloud Run services. Reduce CPU allocation to 2 vCPUs and enable startup CPU boost to compensate.
- **C.** The default request timeout is too short, causing requests to fail before autoscaling can respond. Increase the request timeout to allow more time for processing.
- **D.** The single-threaded application only utilizes one vCPU, causing low average CPU utilization across all vCPUs. Lower the maximum concurrency setting to force scaling based on request throughput instead. — _correct answer_

## Question 169

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application makes frequent calls to the Cloud Storage JSON API to list and retrieve objects. Users report intermittent HTTP 429 errors during peak usage periods. You need to implement a solution that handles these errors gracefully while following Google-recommended best practices. What should you do?

**Correct answer:** D. Implement exponential backoff with jitter when receiving 429 response codes, progressively increasing wait times between retry attempts.

**Options:**

- **A.** Cache all API responses permanently to eliminate the need for subsequent API calls and avoid rate limiting entirely.
- **B.** Immediately retry failed requests without any delay, relying on the Cloud Storage service to queue requests until capacity is available.
- **C.** Configure a fixed 5-second delay between all API requests to prevent hitting rate limits, regardless of error responses.
- **D.** Implement exponential backoff with jitter when receiving 429 response codes, progressively increasing wait times between retry attempts. — _correct answer_

## Question 170

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Java-based API on Cloud Run that experiences slow cold starts, causing user requests to time out during traffic spikes. Users report latencies of 8-10 seconds when the service scales from zero. You need to reduce cold start latency while minimizing ongoing costs. What should you do?

**Correct answer:** D. Enable startup CPU boost to temporarily increase CPU allocation during instance startup.

**Options:**

- **A.** Set minimum instances to 10 to ensure warm instances are always available to handle traffic.
- **B.** Increase the vCPU limit to 8 vCPUs to speed up container initialization.
- **C.** Configure instance-based billing to allocate CPU throughout the instance lifecycle.
- **D.** Enable startup CPU boost to temporarily increase CPU allocation during instance startup. — _correct answer_
