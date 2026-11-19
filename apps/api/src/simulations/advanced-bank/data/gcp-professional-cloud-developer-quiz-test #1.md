# gcp-professional-cloud-developer-quiz-test #1

## Question 1

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is configuring a Cloud Tasks queue to handle order processing with exponential backoff. The queue configuration includes min_backoff=10s, max_backoff=300s, and max_doublings=3. What is the correct sequence of retry intervals for failed tasks?

**Correct answer:** C. 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 10s, 20s, 40s, 80s, 80s, 80s, 80s, 80s
- **B.** 10s, 30s, 90s, 270s, 300s, 300s, 300s
- **C.** 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_
- **D.** 10s, 20s, 40s, 80s, 160s, 300s, 300s, 300s

## Question 2

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is using Cloud Bigtable to store user activity data. After deployment, users report slow response times. You examine Key Visualizer and see bright white horizontal bands concentrated on specific row key ranges. What is the most likely cause and recommended solution?

**Correct answer:** C. The bright bands indicate hotspots where specific row key ranges receive disproportionate traffic. You should redesign the row keys to distribute access more evenly across the keyspace.

**Options:**

- **A.** The bright bands indicate disk I/O errors on specific Bigtable nodes. You should contact Google Cloud Support to replace the affected hardware.
- **B.** The bright bands indicate that compression is working efficiently on frequently accessed data. No action is needed since this shows optimal performance.
- **C.** The bright bands indicate hotspots where specific row key ranges receive disproportionate traffic. You should redesign the row keys to distribute access more evenly across the keyspace. — _correct answer_
- **D.** The bright bands indicate that the cluster has too many nodes. You should reduce the cluster size to consolidate data and improve performance.

## Question 3

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You need to allow a third-party partner organization to write data to a Cloud Storage bucket in your project that is protected by a VPC Service Controls perimeter. The partner will access the bucket from their own VPC network in their Google Cloud organization. You want to implement this with the principle of least privilege. What should you do?

**Correct answer:** A. Create an ingress rule that specifies the partner's project as a source resource, limits identityType to their specific service account, and restricts operations to storage.googleapis.com write methods only.

**Options:**

- **A.** Create an ingress rule that specifies the partner's project as a source resource, limits identityType to their specific service account, and restricts operations to storage.googleapis.com write methods only. — _correct answer_
- **B.** Create a perimeter bridge between your project and the partner's project to enable secure bidirectional communication across the service perimeters of both organizations.
- **C.** Create an access level based on the partner's external IP address range and add this access level to the perimeter, granting storage.objectCreator IAM role to the partner's service account.
- **D.** Configure VPC Network Peering between your VPC and the partner's VPC network, then add an ingress rule that allows all identities from the peered VPC network to access Cloud Storage.

## Question 4

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run application performs multiple read operations from Firestore to generate a report. The operations do not need to modify any data, and the application experiences high latency due to transaction contention with other concurrent write operations. How should you optimize the data retrieval to minimize contention while maintaining consistent reads?

**Correct answer:** A. Use read-only transactions for the report generation, which do not take locks on documents and do not contend with other transactions modifying the same data.

**Options:**

- **A.** Use read-only transactions for the report generation, which do not take locks on documents and do not contend with other transactions modifying the same data. — _correct answer_
- **B.** Use batched writes to combine the read operations into a single atomic operation that reduces the number of round trips to the database.
- **C.** Execute each read operation individually outside of transactions and implement application-level caching to reduce database calls and avoid conflicts.
- **D.** Implement pessimistic concurrency controls by configuring the database to use PESSIMISTIC mode and using read-write transactions for all operations.

## Question 5

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are configuring Cloud SQL Managed Connection Pooling for your PostgreSQL Enterprise Plus edition instance to handle sudden connection spikes from your serverless application. The instance has 4 vCPUs and you want to ensure optimal performance during peak authentication load. How should you configure the max_connections flag when using the default max_pool_size of 50 pools?

**Correct answer:** C. Configure max_connections to reserve at least 15 server connections per CPU for Managed Connection Pooling, ensuring adequate connections are available during peak authentication periods.

**Options:**

- **A.** Set max_connections to the maximum value allowed by the instance memory to maximize throughput, as Managed Connection Pooling will automatically optimize connection usage regardless of this setting.
- **B.** Use the default max_connections value since Managed Connection Pooling handles all connection management automatically and the flag has no impact on pooled connection performance.
- **C.** Configure max_connections to reserve at least 15 server connections per CPU for Managed Connection Pooling, ensuring adequate connections are available during peak authentication periods. — _correct answer_
- **D.** Configure max_connections equal to max_pool_size to ensure a one-to-one mapping between client connections and server connections for optimal connection reuse.

## Question 6

**Domain:** Integrating applications with Google Cloud services

**Question:** You have configured aggregated sinks to centralize logs from multiple projects into a log bucket in a central observability project. You need to create log-based metrics that track error counts across all the centralized logs, regardless of which project originally generated them. What is the recommended approach?

**Correct answer:** A. Create a bucket-scoped log-based metric defined in the project containing the destination log bucket that filters for error logs across all sources.

**Options:**

- **A.** Create a bucket-scoped log-based metric defined in the project containing the destination log bucket that filters for error logs across all sources. — _correct answer_
- **B.** Create a project-scoped log-based metric in the central observability project that filters for error logs.
- **C.** Create project-scoped log-based metrics in each source project and use Cloud Monitoring to aggregate the metrics from multiple projects in a single dashboard.
- **D.** Create an organization-level log-based metric that monitors error logs across all projects in the organization.

## Question 7

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company runs a multi-tenant containerized platform on GKE. Each tenant has workloads deployed in separate namespaces. You need to configure alerting in Cloud Monitoring so that when a container in any tenant namespace experiences memory pressure approaching its limit, a notification is sent that includes the specific namespace and pod name. What should you do?

**Correct answer:** A. Create an alerting policy with a metric threshold condition filtering on container memory limit utilization. Configure the aggregation to group by namespace_name and pod_name labels. Include these labels in the alert notification documentation using template variables.

**Options:**

- **A.** Create an alerting policy with a metric threshold condition filtering on container memory limit utilization. Configure the aggregation to group by namespace_name and pod_name labels. Include these labels in the alert notification documentation using template variables. — _correct answer_
- **B.** Enable automatic application monitoring for the GKE cluster. Configure the Observability tab in the GKE console to show memory metrics. Create a Cloud Run function triggered by Pub/Sub to parse the metrics and send custom email notifications with namespace and pod details.
- **C.** Create individual alerting policies for each tenant namespace using Terraform. Filter each policy to monitor only containers in that specific namespace. Use separate Slack channels as notification channels for each tenant to ensure isolation.
- **D.** Create a PromQL-based alerting policy using the avg() function across all containers. Configure the policy to trigger when average memory utilization across the cluster exceeds 80%. Add a Cloud Monitoring group that contains all namespaces for the alert target.

## Question 8

**Domain:** Building and testing applications

**Question:** You are configuring a gradual rollout for a Cloud Run service where the new revision is tagged as 'green' and the stable revision is tagged as 'blue'. The green revision is currently serving 0% traffic. Your deployment plan requires increasing traffic to the green revision by 10% each day while monitoring for errors. On day 2, you want green to serve 20% of traffic. Which approach should you use?

**Correct answer:** A. Run 'gcloud run services update-traffic myservice --to-tags green=20' to update the traffic allocation to the green revision.

**Options:**

- **A.** Run 'gcloud run services update-traffic myservice --to-tags green=20' to update the traffic allocation to the green revision. — _correct answer_
- **B.** Modify the service YAML to set traffic percentage to 20 for the green revision and apply it using 'gcloud run services replace service.yaml'.
- **C.** Run 'gcloud run services update-traffic myservice --to-tags green=20,blue=80' to explicitly set both revision percentages.
- **D.** Redeploy the green revision with 'gcloud run deploy myservice --image IMAGE_URL --tag green --traffic 20' to allocate 20% traffic.

## Question 9

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You need to allow a specific GKE Pod to access Cloud SQL using Workload Identity Federation for GKE with service account impersonation. The Pod runs in the 'database' namespace with a Kubernetes ServiceAccount named 'sql-client'. You have already created an IAM service account named 'cloudsql-sa' with Cloud SQL Client role. What additional configuration is required to complete the setup?

**Correct answer:** A. Grant the roles/iam.workloadIdentityUser role to the Kubernetes ServiceAccount on the IAM service account, and annotate the Kubernetes ServiceAccount with the IAM service account email.

**Options:**

- **A.** Grant the roles/iam.workloadIdentityUser role to the Kubernetes ServiceAccount on the IAM service account, and annotate the Kubernetes ServiceAccount with the IAM service account email. — _correct answer_
- **B.** Grant the roles/iam.serviceAccountUser role to the Kubernetes ServiceAccount on the IAM service account, then modify the Pod specification to include the service account email as an environment variable.
- **C.** Grant the roles/iam.workloadIdentityUser role directly to the IAM service account 'cloudsql-sa', and update the Kubernetes ServiceAccount with a label indicating the impersonation target.
- **D.** Create a Kubernetes Secret containing the IAM service account key and mount it in the Pod, then configure the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to the mounted key file.

## Question 10

**Domain:** Deploying applications

**Question:** You deployed an application to GKE using kubectl apply -f deployment.yaml. After discovering a bug in the current version, you need to quickly roll back to the previous working version. The deployment history is available, and you want to use kubectl to perform this operation with minimal commands. What should you do?

**Correct answer:** B. Run kubectl rollout undo deployment/your-deployment-name to roll back to the previous revision.

**Options:**

- **A.** Run kubectl delete deployment your-deployment-name followed by kubectl apply -f deployment-previous.yaml with the previous version manifest.
- **B.** Run kubectl rollout undo deployment/your-deployment-name to roll back to the previous revision. — _correct answer_
- **C.** Run kubectl set image deployment/your-deployment-name container-name=previous-image:tag to update the container image to the previous version.
- **D.** Run kubectl rollout restart deployment/your-deployment-name to restart the deployment with the previous configuration.

## Question 11

**Domain:** Building and testing applications

**Question:** You are configuring Cloud Build to run smoke tests after deploying an application to validate the deployment. Some smoke tests check non-critical features and their failure should not fail the overall build. You want these non-critical tests to complete and report results while allowing the build to succeed. What should you configure?

**Correct answer:** D. Add allowFailure: true to the build step that runs the non-critical smoke tests, allowing the step to fail without failing the entire build.

**Options:**

- **A.** Create a separate Cloud Build configuration for non-critical tests and trigger it asynchronously using Pub/Sub after the main build completes.
- **B.** Use allowExitCodes: ['0', '1'] on the smoke test step to accept both success and failure exit codes as valid outcomes.
- **C.** Wrap the smoke test commands in a shell script that always exits with code 0, regardless of test outcomes, and use this script in the build step.
- **D.** Add allowFailure: true to the build step that runs the non-critical smoke tests, allowing the step to fail without failing the entire build. — _correct answer_

## Question 12

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a task management application that uses Firestore to store tasks. Users need to see visual indicators when tasks are added, modified, or removed from their task lists. Your application must efficiently track these specific change types to update the UI appropriately. How should you implement this functionality?

**Correct answer:** D. Attach a snapshot listener to the query and iterate through the snapshot.changes collection, checking the change.type property for ADDED, MODIFIED, or REMOVED values to update the UI accordingly.

**Options:**

- **A.** Store a local copy of all documents and compare each new snapshot against the stored copy to determine which documents have been added, modified, or removed.
- **B.** Configure Firestore triggers using Eventarc to detect document changes and send notifications to the client application through a WebSocket connection.
- **C.** Use multiple separate listeners for each change type by creating three different queries with metadata filters for added, modified, and removed documents.
- **D.** Attach a snapshot listener to the query and iterate through the snapshot.changes collection, checking the change.type property for ADDED, MODIFIED, or REMOVED values to update the UI accordingly. — _correct answer_

## Question 13

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is running a microservices application on a GKE cluster. You need to collect custom Prometheus metrics from your application pods and send them to Cloud Monitoring for analysis and alerting. You want to use Google's recommended approach with minimal operational overhead. What should you do?

**Correct answer:** D. Enable Managed Service for Prometheus on the GKE cluster and create a PodMonitoring custom resource that specifies the metrics endpoint and scrape interval for your application pods.

**Options:**

- **A.** Install the Ops Agent on all GKE nodes and configure it to scrape Prometheus metrics from each pod's endpoint by specifying individual pod IPs in the agent configuration.
- **B.** Create a Cloud Function that periodically queries each pod's metrics endpoint and writes the data to Cloud Monitoring using the custom metrics API with JSON payloads.
- **C.** Deploy and configure a self-managed Prometheus server in the cluster, then use the Prometheus remote write API to export all metrics to Cloud Monitoring every 30 seconds.
- **D.** Enable Managed Service for Prometheus on the GKE cluster and create a PodMonitoring custom resource that specifies the metrics endpoint and scrape interval for your application pods. — _correct answer_

## Question 14

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that lists objects in a Cloud Storage bucket using the JSON API. The bucket contains objects with extensive metadata, but your application only needs each object's name and size. You want to minimize network bandwidth and improve response times. What should you do?

**Correct answer:** D. Add the fields parameter to your request specifying only the required properties, such as fields=items(name,size),nextPageToken.

**Options:**

- **A.** Download the full response and parse only the required fields in your application code to reduce complexity.
- **B.** Set the projection parameter to noAcl to exclude access control list data from the response.
- **C.** Use the matchGlob parameter to filter results and reduce the number of objects returned in the response.
- **D.** Add the fields parameter to your request specifying only the required properties, such as fields=items(name,size),nextPageToken. — _correct answer_

## Question 15

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is deploying a microservices application on Cloud Run that needs to access API keys stored in Secret Manager. The application must always receive the most recent secret value immediately when the secret is updated, without redeploying the service. How should you configure the Cloud Run service to access the secrets?

**Correct answer:** A. Mount the secrets as a volume in the Cloud Run service configuration, specifying the secret version as 'latest'. Configure the application to read the secret from the mounted file path on each request.

**Options:**

- **A.** Mount the secrets as a volume in the Cloud Run service configuration, specifying the secret version as 'latest'. Configure the application to read the secret from the mounted file path on each request. — _correct answer_
- **B.** Configure a Cloud Scheduler job to periodically restart Cloud Run instances. Set the environment variable to reference the 'latest' secret version to pick up new values on restart.
- **C.** Use the Secret Manager client library to programmatically fetch secrets at application startup. Cache the secret value in memory for the duration of the container instance.
- **D.** Expose the secrets as environment variables in the Cloud Run service configuration, specifying the secret version as 'latest'. Access the secrets through the environment variables in the application code.

## Question 16

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses a Shared VPC architecture with a host project and multiple service projects. You need to implement VPC Service Controls to protect Cloud Storage and BigQuery services across all projects. After implementing the perimeter, developers report that their applications in service projects cannot access the restricted services. What is the most likely cause of this issue?

**Correct answer:** B. The host project was not included in the service perimeter along with the service projects, causing network endpoints in service projects to appear outside the perimeter.

**Options:**

- **A.** The VPC accessible services feature was not configured to allow access to Cloud Storage and BigQuery from inside the perimeter.
- **B.** The host project was not included in the service perimeter along with the service projects, causing network endpoints in service projects to appear outside the perimeter. — _correct answer_
- **C.** The developers' service accounts do not have the Access Context Manager Editor role required to access resources inside a VPC Service Controls perimeter.
- **D.** The service perimeter changes have not propagated yet, which can take up to 24 hours for complex configurations across multiple projects.

## Question 17

**Domain:** Deploying applications

**Question:** You need to update the container image of an existing GKE Deployment named 'api-server' from version 1.2.0 to 1.3.0 without modifying the YAML manifest file. The Deployment has a single container named 'api'. You want to use the most direct kubectl command that triggers a rolling update. What should you do?

**Correct answer:** B. Run kubectl set image deployment/api-server api=us-docker.pkg.dev/project/repo/api:1.3.0

**Options:**

- **A.** Run kubectl patch deployment api-server --type='json' -p='[{op: replace, path: /metadata/labels/version, value: 1.3.0}]'
- **B.** Run kubectl set image deployment/api-server api=us-docker.pkg.dev/project/repo/api:1.3.0 — _correct answer_
- **C.** Run kubectl rollout restart deployment/api-server after manually updating the image tag in the container registry.
- **D.** Run kubectl scale deployment api-server --replicas=0 and then kubectl scale deployment api-server --replicas=3 with the new image.

## Question 18

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Cloud Run service that provides a REST API for a real-time dashboard application. The API receives bursty traffic with frequent idle periods where no requests are received. During idle periods, the service scales to zero. Users complain about slow response times when accessing the dashboard after idle periods. Your operations team requires cost-effective scaling while minimizing latency for the first request. What should you do?

**Correct answer:** B. Set minimum instances to 1 to keep one instance warm and ready to receive requests, preventing scale-from-zero latency.

**Options:**

- **A.** Lower the maximum concurrency to 1 to ensure new instances are created quickly when traffic arrives after idle periods.
- **B.** Set minimum instances to 1 to keep one instance warm and ready to receive requests, preventing scale-from-zero latency. — _correct answer_
- **C.** Use Cloud Scheduler to send a health check request every minute to keep at least one instance active.
- **D.** Configure instance-based billing with minimum instances set to 0 to ensure background processing can keep the service responsive.

## Question 19

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a session management system for a web application deployed on Cloud Run. The application uses Memorystore for Redis to store user session data. Users are experiencing intermittent session losses when Redis instances undergo maintenance updates. You need to minimize session disruption while following Google-recommended best practices. What should you do?

**Correct answer:** A. Deploy a Standard Tier Memorystore for Redis instance and implement retry logic with exponential backoff in your application code to handle temporary connection drops during maintenance and failover events.

**Options:**

- **A.** Deploy a Standard Tier Memorystore for Redis instance and implement retry logic with exponential backoff in your application code to handle temporary connection drops during maintenance and failover events. — _correct answer_
- **B.** Deploy a Basic Tier Memorystore for Redis instance with larger capacity to ensure sufficient resources during maintenance periods and store session data with very long TTLs.
- **C.** Configure Cloud Run to replicate session data to multiple independent Basic Tier Memorystore instances in different regions and implement client-side load balancing across all instances.
- **D.** Store session data directly in Cloud Run's local memory instead of Memorystore to avoid external dependencies and enable session affinity in the Cloud Run load balancer.

## Question 20

**Domain:** Building and testing applications

**Question:** You are using Cloud Code for VS Code to develop a containerized application that will run on GKE. You want to test the application locally using minikube before deploying to the cloud. When you run the application, Cloud Code reports that it cannot find the Kubernetes context. What should you do?

**Correct answer:** D. Run the Cloud Code: Control minikube command from the VS Code command palette, select the minikube profile, and click Start to initialize the local cluster before running the application.

**Options:**

- **A.** Create a GKE cluster in Google Cloud, add it to the KubeConfig using Cloud Code's Kubernetes explorer, and use it as a remote development environment instead of local testing.
- **B.** Open the .kube/config file manually and add a minikube context entry, then set the current-context field to point to the newly created minikube configuration.
- **C.** Install minikube separately using Homebrew or a package manager, run minikube start from the terminal, and restart VS Code to refresh the Kubernetes context.
- **D.** Run the Cloud Code: Control minikube command from the VS Code command palette, select the minikube profile, and click Start to initialize the local cluster before running the application. — _correct answer_

## Question 21

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application stores time-series data in Cloud Bigtable for weather monitoring stations. Each station reports temperature, humidity, and pressure readings every minute. You need to design a schema that minimizes storage costs while allowing efficient retrieval of all metrics for a station within a specific time range. What should you do?

**Correct answer:** C. Use a time bucket pattern with row key format station_id#week_number, storing each minute's readings as new cells in columns within a measurements column family.

**Options:**

- **A.** Use a row key format timestamp#station_id to enable efficient time-based queries across all stations.
- **B.** Use a row key format station_id#timestamp with a separate row for each minute's reading and store all metrics as columns in a single column family.
- **C.** Use a time bucket pattern with row key format station_id#week_number, storing each minute's readings as new cells in columns within a measurements column family. — _correct answer_
- **D.** Create separate tables for each metric type to optimize storage and retrieval for individual measurements.

## Question 22

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks queue is configured with max_attempts=10 and max_retry_duration=3600s (1 hour). A task fails on its first attempt at 10:00 AM. Considering both limits, which statement correctly describes when Cloud Tasks will stop retrying the task?

**Correct answer:** A. Cloud Tasks will stop retrying when both conditions are satisfied: the task has been attempted 10 times AND at least 1 hour has passed since the first attempt.

**Options:**

- **A.** Cloud Tasks will stop retrying when both conditions are satisfied: the task has been attempted 10 times AND at least 1 hour has passed since the first attempt. — _correct answer_
- **B.** Cloud Tasks will stop retrying when either condition is met: the task reaches 10 attempts OR 1 hour passes since the first attempt, whichever happens first.
- **C.** Cloud Tasks will retry the task until 11:00 AM regardless of how many attempts have been made, since max_retry_duration takes precedence over max_attempts.
- **D.** Cloud Tasks will ignore max_retry_duration when max_attempts is explicitly set and will stop retrying exactly after the 10th failed attempt regardless of elapsed time.

## Question 23

**Domain:** Building and testing applications

**Question:** You have enabled session affinity on your Cloud Run service and are performing a canary deployment with traffic split 80/20 between the stable and canary revisions. Users are reporting inconsistent behavior during the rollout. What behavior should you expect regarding session affinity and traffic splitting?

**Correct answer:** C. Requests from the same client are routed to the same revision based on the initial assignment, and Cloud Run minimizes client redirections when traffic percentages are updated.

**Options:**

- **A.** All requests from a specific client always go to the stable revision until you manually reassign them to the canary revision.
- **B.** Session affinity is ignored during traffic splits, and requests are distributed purely based on the configured percentages with no client stickiness.
- **C.** Requests from the same client are routed to the same revision based on the initial assignment, and Cloud Run minimizes client redirections when traffic percentages are updated. — _correct answer_
- **D.** Session affinity only works with a single revision and automatically disables when traffic splitting is configured.

## Question 24

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a customer-facing REST API on Cloud Run that requires sub-second response times. The API has unpredictable traffic patterns with long periods of no activity followed by sudden bursts. Initial requests after idle periods are experiencing high latency due to cold starts. You need to reduce cold start latency while optimizing costs. What should you do?

**Correct answer:** D. Configure minimum instances to 1 and enable startup CPU boost to keep an instance warm while reducing container startup time.

**Options:**

- **A.** Deploy the API to multiple regions and use a global load balancer to distribute traffic and reduce latency.
- **B.** Set maximum concurrency to 1000 to maximize the number of requests each instance can handle and reduce the need for new instances.
- **C.** Switch to instance-based billing to ensure CPU is always available for faster request processing after cold starts.
- **D.** Configure minimum instances to 1 and enable startup CPU boost to keep an instance warm while reducing container startup time. — _correct answer_

## Question 25

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a Cloud Tasks queue for a notification service that sends emails through a third-party API. The API occasionally returns HTTP 429 Too Many Requests errors. You want to configure appropriate retry behavior with exponential backoff. The queue has: min_backoff=10s, max_backoff=300s, and max_doublings=3. After the initial attempt fails, what will be the retry intervals for subsequent attempts?

**Correct answer:** D. 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 10s, 30s, 90s, 270s, 300s, 300s, 300s, 300s
- **B.** 10s, 20s, 40s, 80s, 300s, 300s, 300s, 300s
- **C.** 20s, 40s, 80s, 160s, 300s, 300s, 300s, 300s
- **D.** 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_

## Question 26

**Domain:** Deploying applications

**Question:** Your organization requires that all Kubernetes Secrets in your GKE cluster be encrypted using encryption keys that your security team manages. You need to implement this requirement while minimizing operational overhead. What should you do?

**Correct answer:** C. Enable application-layer secrets encryption on the GKE cluster using a Cloud KMS key. Grant the GKE service account the Cloud KMS CryptoKey Encrypter/Decrypter role on the key.

**Options:**

- **A.** Store all sensitive data in Secret Manager instead of Kubernetes Secrets. Access the secrets using the Secret Manager API from your application code with Workload Identity Federation for GKE.
- **B.** Configure each Pod to use an init container that retrieves secrets from Cloud KMS and decrypts them at runtime before the main application starts.
- **C.** Enable application-layer secrets encryption on the GKE cluster using a Cloud KMS key. Grant the GKE service account the Cloud KMS CryptoKey Encrypter/Decrypter role on the key. — _correct answer_
- **D.** Create a custom admission webhook that encrypts Secret data before it is stored in etcd. Deploy the webhook as a service in your GKE cluster.

## Question 27

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a banking application using Cloud Firestore. The application needs to transfer funds between two accounts by debiting one account and crediting another. The transfer must ensure that both accounts are updated based on their current balances and that no funds are lost if a concurrent transaction modifies either account. What is the correct approach to implement this transfer?

**Correct answer:** C. Use a transaction that reads both account documents first, verifies sufficient funds, calculates new balances, and then writes updates to both accounts.

**Options:**

- **A.** Use read-only transactions to fetch current balances, calculate new values in application code, and then use a batched write to update both accounts.
- **B.** Use a batched write to update both account balances simultaneously to ensure atomicity of the transfer operation.
- **C.** Use a transaction that reads both account documents first, verifies sufficient funds, calculates new balances, and then writes updates to both accounts. — _correct answer_
- **D.** Use FieldValue.increment() with a negative value on the source account and positive value on the destination account in separate update operations.

## Question 28

**Domain:** Deploying applications

**Question:** Your organization is deploying an internal application on GKE that should only be accessible within your VPC network. You have created an internal Ingress resource with the kubernetes.io/ingress.class: gce-internal annotation, and a proxy-only subnet is configured in the region. However, users within the VPC cannot access the application. The GKE Ingress controller shows successful synchronization, but traffic is timing out. What is the most likely cause of this issue?

**Correct answer:** A. You have not created a firewall rule that permits traffic from the proxy-only subnet to reach your backend Pods on the appropriate ports.

**Options:**

- **A.** You have not created a firewall rule that permits traffic from the proxy-only subnet to reach your backend Pods on the appropriate ports. — _correct answer_
- **B.** The internal Ingress is using instance group backends instead of Network Endpoint Groups (NEGs), which are required for internal Application Load Balancers.
- **C.** The proxy-only subnet IP range you configured overlaps with the Pod IP range used by your GKE cluster, causing routing conflicts.
- **D.** Your Service is missing the cloud.google.com/neg annotation required to enable container-native load balancing for internal Ingress resources.

## Question 29

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your development team is deploying a new microservices application on GKE that needs to connect to a Cloud SQL for MySQL instance. You need to configure secure connectivity following Google-recommended best practices while minimizing the attack surface. What should you do?

**Correct answer:** C. Deploy the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application. Configure the application to connect via localhost on the proxy's TCP port.

**Options:**

- **A.** Configure your Cloud SQL instance with a public IP and add your GKE cluster's external IP ranges to the authorized networks. Use SSL certificates for encryption.
- **B.** Enable private IP for the Cloud SQL instance and configure direct TCP connections from your pods using the instance's private IP address without any proxy.
- **C.** Deploy the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application. Configure the application to connect via localhost on the proxy's TCP port. — _correct answer_
- **D.** Create a Kubernetes Deployment with the Cloud SQL Auth Proxy running as a shared service. Configure a ClusterIP Service to expose the proxy to all application pods in the namespace.

## Question 30

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your security team requires that Cloud Storage and BigQuery APIs within a VPC Service Controls perimeter can only be accessed by employees using corporate-managed devices from trusted IP ranges. For emergency access, specific service accounts should be able to access these resources from any network location. How should you configure the perimeter?

**Correct answer:** D. Create an ingress rule that allows specific service account identities from any source and a separate ingress rule that allows any identity type from an access level that specifies trusted IP ranges and device requirements.

**Options:**

- **A.** Configure VPC accessible services to allow only BigQuery and Cloud Storage from inside the perimeter, and use Identity-Aware Proxy to enforce device trust for all external access.
- **B.** Create an access level for the trusted IP ranges and device requirements, then grant the service accounts the Access Context Manager Admin role to bypass perimeter restrictions.
- **C.** Configure a single access level that includes both the trusted IP ranges and the service account identities, then attach this access level to the service perimeter.
- **D.** Create an ingress rule that allows specific service account identities from any source and a separate ingress rule that allows any identity type from an access level that specifies trusted IP ranges and device requirements. — _correct answer_

## Question 31

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application stores critical session data in Memorystore for Redis. The application cannot tolerate losing session data during infrastructure failures, and you need to ensure high availability with automatic failover. You also want to scale read operations across multiple replicas. What should you configure?

**Correct answer:** C. Deploy a Standard Tier Memorystore instance with read replicas enabled, and implement retry logic with exponential backoff in your application code.

**Options:**

- **A.** Deploy a Standard Tier Memorystore instance and configure your application to connect directly to the replica nodes for all read and write operations.
- **B.** Deploy a Basic Tier Memorystore instance with RDB snapshots enabled for data persistence and manual recovery procedures.
- **C.** Deploy a Standard Tier Memorystore instance with read replicas enabled, and implement retry logic with exponential backoff in your application code. — _correct answer_
- **D.** Deploy a Basic Tier Memorystore instance in a multi-region configuration for geographic redundancy and automatic failover.

## Question 32

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company is building a mobile field service application using Firestore that allows technicians to update work orders. Technicians often work in areas with unreliable network connectivity. You need the application to continue functioning when offline and synchronize changes when connectivity is restored. You also want to indicate to users whether displayed data is from the cache or server. How should you configure your application?

**Correct answer:** D. Enable offline persistence and check the fromCache property in the snapshot metadata to determine whether data came from the local cache or the server.

**Options:**

- **A.** Configure the application to use only getDocFromCache() when the network is unavailable and switch to get() with server source when online.
- **B.** Store all data locally in SQLite and periodically sync with Firestore using batch writes when the application detects network connectivity.
- **C.** Implement a custom synchronization layer using Cloud Tasks to queue write operations when offline and replay them when connectivity returns.
- **D.** Enable offline persistence and check the fromCache property in the snapshot metadata to determine whether data came from the local cache or the server. — _correct answer_

## Question 33

**Domain:** Integrating applications with Google Cloud services

**Question:** You are designing an application that will perform approximately 8,000 read requests per second to a Cloud Storage bucket. You need to ensure the application operates within Cloud Storage rate limits and avoids throttling. What should you do?

**Correct answer:** D. Implement a gradual ramp-up strategy, starting below 5,000 requests per second and doubling the rate no faster than every 20 minutes to allow Cloud Storage auto-scaling.

**Options:**

- **A.** Create multiple buckets and distribute objects evenly across them, then use round-robin load balancing to spread requests across all buckets.
- **B.** Configure API quota increases through the Google Cloud console to raise the bucket's read rate limit to 10,000 requests per second before deploying.
- **C.** Enable hierarchical namespace on the bucket and distribute objects across multiple prefixes to automatically handle the higher request rate.
- **D.** Implement a gradual ramp-up strategy, starting below 5,000 requests per second and doubling the rate no faster than every 20 minutes to allow Cloud Storage auto-scaling. — _correct answer_

## Question 34

**Domain:** Building and testing applications

**Question:** Your team is implementing a four-day gradual rollout strategy for a Cloud Run service. You want to deploy a new revision on Day 1, route 1% of traffic to it initially, then increase to 10% on Day 2, 50% on Day 3, and 100% on Day 4. You need to deploy the revision and set up the initial traffic routing. Which sequence of commands accomplishes this?

**Correct answer:** A. Run 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag green', then 'gcloud run services update-traffic myservice --to-tags green=1' to start with 1% traffic to the tagged revision.

**Options:**

- **A.** Run 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag green', then 'gcloud run services update-traffic myservice --to-tags green=1' to start with 1% traffic to the tagged revision. — _correct answer_
- **B.** Run 'gcloud run deploy myservice --image IMAGE_URL --canary-percent=1' to automatically configure canary deployment with 1% traffic to the new revision.
- **C.** Run 'gcloud run deploy myservice --image IMAGE_URL', then 'gcloud run services split-traffic myservice --revisions=LATEST=1,PREVIOUS=99' for the initial allocation.
- **D.** Run 'gcloud run deploy myservice --image IMAGE_URL --traffic-split=LATEST:1,CURRENT:99' to deploy with an initial 1% traffic allocation to the new revision.

## Question 35

**Domain:** Deploying applications

**Question:** You manage a GKE cluster with thousands of pods consuming ConfigMaps and Secrets for application configuration. The cluster is experiencing performance issues, and you have identified that kubelet is spending significant resources watching for changes to ConfigMaps and Secrets. Many of these configuration objects rarely change after deployment. You want to improve cluster performance while ensuring configuration stability. What should you do?

**Correct answer:** C. Mark the ConfigMaps and Secrets that do not need updates as immutable by setting the immutable field to true.

**Options:**

- **A.** Increase the kubelet sync frequency interval to reduce the number of API server requests for ConfigMap and Secret updates.
- **B.** Convert all ConfigMaps and Secrets to environment variables instead of volume mounts to eliminate the need for watching files.
- **C.** Mark the ConfigMaps and Secrets that do not need updates as immutable by setting the immutable field to true. — _correct answer_
- **D.** Store configuration in Persistent Volumes instead of ConfigMaps and Secrets to bypass the Kubernetes API for configuration access.

## Question 36

**Domain:** Building and testing applications

**Question:** You are developing an application that calls a client-based Google Cloud API. After running 'gcloud auth application-default login', you receive errors about the API not being enabled or no quota project being available. You have verified that the API is enabled in your project. What should you do?

**Correct answer:** D. Run 'gcloud auth application-default set-quota-project PROJECT_ID' to specify the project for billing and quota.

**Options:**

- **A.** Delete the local ADC file and use the gcloud CLI credentials directly.
- **B.** Set GOOGLE_APPLICATION_CREDENTIALS to point to a service account key file instead.
- **C.** Grant the Service Usage Consumer role (roles/serviceusage.serviceUsageConsumer) to your user account and run 'gcloud auth application-default login' again.
- **D.** Run 'gcloud auth application-default set-quota-project PROJECT_ID' to specify the project for billing and quota. — _correct answer_

## Question 37

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service that needs database credentials stored in Secret Manager. The credentials must be exposed as environment variables for compatibility with an existing application framework. You want to follow Google-recommended best practices for secret versioning. How should you configure the secret reference?

**Correct answer:** B. Reference a specific version number of the secret, such as version 3, when configuring the environment variable.

**Options:**

- **A.** Reference the secret without specifying a version to automatically use the latest enabled version.
- **B.** Reference a specific version number of the secret, such as version 3, when configuring the environment variable. — _correct answer_
- **C.** Reference the 'latest' alias of the secret when configuring the environment variable.
- **D.** Configure the secret as a volume mount instead of an environment variable to use dynamic secret retrieval.

## Question 38

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is developing a microservices application on GKE that uses Memorystore for Redis Cluster for caching. After deployment, users report that the application occasionally becomes unresponsive and the Redis cluster shows very high CPU utilization. You discover that the application makes several reconnection attempts without proper delay when connections are lost. What should you implement to resolve this issue?

**Correct answer:** D. Implement a client connection pool with a finite size and add exponential backoff with jitter when retrying connections after timeouts.

**Options:**

- **A.** Configure the Redis timeout parameter to immediately terminate all idle connections and reduce the total number of connections to the cluster.
- **B.** Increase the number of Redis cluster nodes to handle the increased connection load and distribute traffic more evenly across shards.
- **C.** Enable TLS encryption on the Redis cluster to improve connection stability and prevent connection drops during high traffic periods.
- **D.** Implement a client connection pool with a finite size and add exponential backoff with jitter when retrying connections after timeouts. — _correct answer_

## Question 39

**Domain:** Deploying applications

**Question:** Your team is deploying a microservices application on GKE using an Ingress with an external Application Load Balancer. The load balancer health checks are failing for one of the services even though the Pods are running and responding to traffic. You discover that the service uses a custom health endpoint at /healthz on port 8081 that is different from the application port. What is the most appropriate solution to configure custom health check settings for this service?

**Correct answer:** D. Create a BackendConfig custom resource with the healthCheck settings specifying the port and request path. Reference the BackendConfig in the Service using the cloud.google.com/backend-config annotation.

**Options:**

- **A.** Update the Google Cloud load balancer health check configuration directly using the gcloud compute health-checks update command to specify the correct port and path.
- **B.** Create a FrontendConfig custom resource with the healthCheck settings specifying the port and request path. Reference the FrontendConfig in the Ingress using the networking.gke.io/v1beta1.FrontendConfig annotation.
- **C.** Add a readinessProbe to the Pod spec with httpGet settings for the /healthz endpoint on port 8081. The GKE Ingress controller will automatically derive the health check parameters from the readiness probe.
- **D.** Create a BackendConfig custom resource with the healthCheck settings specifying the port and request path. Reference the BackendConfig in the Service using the cloud.google.com/backend-config annotation. — _correct answer_

## Question 40

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring API Gateway to require API key authentication for your API. You add the securityDefinitions and security sections to your OpenAPI specification. During testing, you notice that requests to /widgets require an API key as expected, but requests to /Widgets are being passed through without validation. You need to fix this security issue. What should you do?

**Correct answer:** A. Ensure that your backend service uses case-sensitive path routing, and verify that all API paths in the OpenAPI specification match exactly with the case used by clients.

**Options:**

- **A.** Ensure that your backend service uses case-sensitive path routing, and verify that all API paths in the OpenAPI specification match exactly with the case used by clients. — _correct answer_
- **B.** Enable automatic path normalization in the API Gateway configuration to convert all incoming paths to lowercase before matching them against the OpenAPI specification.
- **C.** Configure a global security requirement at the API level instead of path-level security to ensure all endpoints require an API key regardless of path case.
- **D.** Set x-google-allow to 'all' in the OpenAPI specification to ensure that all requests, including those with different case variations, are subject to API key validation.

## Question 41

**Domain:** Building and testing applications

**Question:** Your application needs to test Cloud Spanner database operations locally during development. You have configured ADC with your user credentials using 'gcloud auth application-default login'. However, when running your application, you receive an error stating that user credentials are not supported by this API. What should you do to resolve this issue while following security best practices?

**Correct answer:** A. Run 'gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL' using a service account with appropriate Spanner permissions.

**Options:**

- **A.** Run 'gcloud auth application-default login --impersonate-service-account SERVICE_ACCT_EMAIL' using a service account with appropriate Spanner permissions. — _correct answer_
- **B.** Run 'gcloud auth application-default set-quota-project PROJECT_ID' to associate a billing project with your user credentials.
- **C.** Create a service account key, download it as a JSON file, and set GOOGLE_APPLICATION_CREDENTIALS to point to the key file.
- **D.** Add the '--scopes=https://www.googleapis.com/auth/spanner.data' flag when running 'gcloud auth application-default login' to request Spanner-specific scopes.

## Question 42

**Domain:** Building and testing applications

**Question:** Your company runs integration tests that need to access a private Cloud SQL database and a private Artifact Registry repository within your VPC network. The default Cloud Build worker pool cannot access these private resources. You need to configure Cloud Build to run integration tests against these private resources while using a fully managed service. What should you do?

**Correct answer:** B. Create a Cloud Build private pool peered to your VPC network, and configure your build to use the private pool by specifying the pool in the options section of your cloudbuild.yaml file.

**Options:**

- **A.** Deploy a Cloud Build worker on a Compute Engine instance within your VPC network and configure Cloud Build triggers to route builds to this self-managed worker.
- **B.** Create a Cloud Build private pool peered to your VPC network, and configure your build to use the private pool by specifying the pool in the options section of your cloudbuild.yaml file. — _correct answer_
- **C.** Configure VPC Service Controls to allow Cloud Build default workers to access resources inside your VPC perimeter without requiring any network peering.
- **D.** Add public IP addresses to your Cloud SQL database and Artifact Registry, and allow the Cloud Build default worker IP ranges in your firewall rules to enable access.

## Question 43

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application stores time-series data in Cloud Bigtable where certain celebrity user accounts generate significantly more read and write traffic than regular users. The row key format is user_id#timestamp. You are experiencing hotspotting on these high-traffic user rows. How should you modify your schema to resolve this issue while maintaining efficient time-range queries for each user?

**Correct answer:** C. Add a computed salt prefix derived from a hash of the user ID to the row key, creating multiple physical rows per logical user row.

**Options:**

- **A.** Move high-traffic celebrity accounts to a separate Bigtable table with its own cluster.
- **B.** Configure Bigtable to automatically redistribute tablets when hotspots are detected using adaptive load balancing.
- **C.** Add a computed salt prefix derived from a hash of the user ID to the row key, creating multiple physical rows per logical user row. — _correct answer_
- **D.** Replace the user_id prefix with a random UUID for each row to distribute writes evenly across tablets.

## Question 44

**Domain:** Deploying applications

**Question:** Your organization runs a GKE cluster with multiple workloads. Some applications are not writing logs to stdout but are instead writing to files inside the container. You notice these application logs are not appearing in Cloud Logging. You want to collect these logs with minimal changes to the existing applications. What should you do?

**Correct answer:** D. Deploy a sidecar container that reads the application log files from a shared emptyDir volume and writes the content to its stdout stream.

**Options:**

- **A.** Install the Cloud Logging agent in each container and configure it to send logs from the application's log files directly to Cloud Logging.
- **B.** Modify the GKE node pool configuration to mount additional log directories and configure the per-node logging agent to read from these custom paths.
- **C.** Configure the GKE cluster to enable application logging with the --logging flag set to WORKLOAD and specify the custom log file paths in the cluster configuration.
- **D.** Deploy a sidecar container that reads the application log files from a shared emptyDir volume and writes the content to its stdout stream. — _correct answer_

## Question 45

**Domain:** Deploying applications

**Question:** Your company has deployed multiple Cloud Run services that use a Serverless VPC Access connector to access backend databases. You notice that connector costs remain high even when the Cloud Run services have no traffic during off-peak hours. You want to reduce costs while maintaining the ability to connect to your VPC network. What should you do?

**Correct answer:** D. Migrate the Cloud Run services from the Serverless VPC Access connector to Direct VPC egress, which only charges for network egress without compute costs.

**Options:**

- **A.** Configure the VPC connector to automatically scale down to zero instances when no Cloud Run traffic is flowing through it.
- **B.** Schedule the VPC connector to be deleted during off-peak hours and recreated during peak hours using Cloud Scheduler and Cloud Functions.
- **C.** Reduce the minimum instances setting on the VPC connector from 2 to 1 to minimize idle compute costs during off-peak hours.
- **D.** Migrate the Cloud Run services from the Serverless VPC Access connector to Direct VPC egress, which only charges for network egress without compute costs. — _correct answer_

## Question 46

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a task management application with Firestore where users can add, update, and delete tasks. You want your application to differentiate between newly added tasks, modified tasks, and deleted tasks in real-time to display appropriate UI notifications. How should you implement this functionality?

**Correct answer:** C. Use the DocumentChange objects from the snapshot.changes array and check the change.type property for ADDED, MODIFIED, or REMOVED values.

**Options:**

- **A.** Use the hasPendingWrites property from snapshot metadata to determine if changes are from local writes or server updates.
- **B.** Create separate listeners for add, update, and delete operations on the same collection.
- **C.** Use the DocumentChange objects from the snapshot.changes array and check the change.type property for ADDED, MODIFIED, or REMOVED values. — _correct answer_
- **D.** Compare the current snapshot documents with a locally cached version of the previous snapshot to identify differences.

## Question 47

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is creating a new GKE cluster to run production workloads that require access to BigQuery. The security team requires that all pods authenticate to Google Cloud services using their own identities without sharing credentials with the underlying nodes. Which GKE cluster configuration meets these requirements with the least administrative effort?

**Correct answer:** D. Create a GKE Autopilot cluster, which has Workload Identity Federation for GKE enabled by default, and configure IAM policies to grant BigQuery access to specific Kubernetes ServiceAccounts.

**Options:**

- **A.** Create a GKE Standard cluster, then enable Workload Identity Federation on the cluster, create new node pools with the --workload-metadata=GKE_METADATA flag, and migrate workloads to the new node pools.
- **B.** Create a GKE Standard cluster and configure a custom node service account with BigQuery permissions, then rely on all pods inheriting these permissions from the node.
- **C.** Create a GKE Standard cluster and configure metadata concealment on all node pools to prevent pods from accessing node credentials while keeping the default authentication method.
- **D.** Create a GKE Autopilot cluster, which has Workload Identity Federation for GKE enabled by default, and configure IAM policies to grant BigQuery access to specific Kubernetes ServiceAccounts. — _correct answer_

## Question 48

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Node.js application on Cloud Run that uses asynchronous background tasks to update a cache after returning HTTP responses. During testing, you notice that background tasks are not completing properly and caches remain stale. You want to ensure background tasks can run while minimizing costs. What should you do?

**Correct answer:** A. Configure the service to use instance-based billing by deploying with the --no-cpu-throttling flag.

**Options:**

- **A.** Configure the service to use instance-based billing by deploying with the --no-cpu-throttling flag. — _correct answer_
- **B.** Increase the request timeout to give background tasks more time to complete within the request context.
- **C.** Set the maximum concurrency to 1 to ensure each request has dedicated CPU resources.
- **D.** Configure minimum instances to 1 to keep an instance always running with CPU available.

## Question 49

**Domain:** Deploying applications

**Question:** You are configuring a Serverless VPC Access connector for your Cloud Run service and need to decide on subnet configuration. Your VPC already has subnets in use for VMs and load balancers. What are the subnet requirements for the VPC connector?

**Correct answer:** D. The connector requires a dedicated /28 subnet that is not used by any other resources such as VMs, Private Service Connect, or load balancers.

**Options:**

- **A.** The connector requires a /26 or larger subnet to accommodate scaling of connector instances during traffic spikes.
- **B.** The connector can use a subnet with any purpose type including PRIVATE_SERVICE_CONNECT as long as the IP range does not conflict with existing routes.
- **C.** The connector can share any existing subnet that has available IP addresses, as long as there are at least 16 free IPs in the CIDR range.
- **D.** The connector requires a dedicated /28 subnet that is not used by any other resources such as VMs, Private Service Connect, or load balancers. — _correct answer_

## Question 50

**Domain:** Deploying applications

**Question:** Your company uses GKE to run multiple applications with sensitive API keys stored in Kubernetes Secrets. A recent security audit requires that all secrets must be encrypted using encryption keys that your company manages, not Google's default encryption. You need to implement this requirement while following Google Cloud best practices. What should you do?

**Correct answer:** B. Enable application-layer secrets encryption on your GKE cluster using a Cloud KMS key in the same region as your cluster.

**Options:**

- **A.** Migrate all Secrets to Secret Manager and access them using the Secret Manager API from your applications.
- **B.** Enable application-layer secrets encryption on your GKE cluster using a Cloud KMS key in the same region as your cluster. — _correct answer_
- **C.** Create a new GKE cluster and enable customer-managed encryption keys (CMEK) for the cluster boot disks.
- **D.** Configure a Cloud KMS key in the global region and enable application-layer secrets encryption to encrypt secrets across all GKE clusters.

## Question 51

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a VPC Service Controls architecture for a large enterprise with multiple business units and dozens of projects containing sensitive data. You need to minimize management overhead while providing the most effective protection against data exfiltration. According to Google Cloud best practices, what architecture should you implement?

**Correct answer:** A. Create a single unified perimeter containing all projects with sensitive data, and use IAM controls and network security to manage access within the perimeter.

**Options:**

- **A.** Create a single unified perimeter containing all projects with sensitive data, and use IAM controls and network security to manage access within the perimeter. — _correct answer_
- **B.** Create a DMZ perimeter for external-facing services and separate internal perimeters for each data classification level, connected via ingress and egress rules.
- **C.** Create a perimeter for each project to provide maximum isolation and granular control over data movement between projects.
- **D.** Create separate perimeters for each business unit and use perimeter bridges to allow necessary communication between them.

## Question 52

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for a time-series application that collects weather measurements from sensors every minute. You want to optimize read performance for queries that retrieve all measurements for a specific sensor over a one-week period. You also want efficient storage compression. What schema design pattern should you use?

**Correct answer:** B. Use a time bucket pattern with row keys combining sensor ID, location, and week number, storing multiple measurements as columns within each row.

**Options:**

- **A.** Use a single-timestamp pattern with row keys containing sensor_id#timestamp, creating one row per measurement event.
- **B.** Use a time bucket pattern with row keys combining sensor ID, location, and week number, storing multiple measurements as columns within each row. — _correct answer_
- **C.** Store all sensor data in a single row per sensor with columns representing timestamps to minimize row count.
- **D.** Use the timestamp as the primary row key prefix followed by sensor_id to enable efficient time-range queries across all sensors.

## Question 53

**Domain:** Deploying applications

**Question:** You have deployed a Cloud Run service configured to use a Secret Manager secret exposed as an environment variable. After deployment, instances start successfully. However, when you add a new version of the secret and disable the previous version, new instances fail to start. What is the most likely cause of this issue?

**Correct answer:** A. The Cloud Run service is configured to reference a specific secret version that has been disabled, causing the secret retrieval to fail before instance startup.

**Options:**

- **A.** The Cloud Run service is configured to reference a specific secret version that has been disabled, causing the secret retrieval to fail before instance startup. — _correct answer_
- **B.** The Cloud Run service account's Secret Manager Secret Accessor role was automatically revoked when the secret version was disabled.
- **C.** The Cloud Run service needs to be redeployed to acknowledge the new secret version before old versions can be disabled safely.
- **D.** The Secret Manager API automatically blocks all access to a secret when any version is disabled to prevent security incidents.

## Question 54

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company runs multiple microservices on a GKE Autopilot cluster. A developer reports that their application cannot access Cloud Pub/Sub, receiving authentication errors. The developer has created a Kubernetes ServiceAccount and assigned it to the Pod specification. What is the most likely cause of this issue?

**Correct answer:** D. The developer has not created an IAM allow policy that grants the Kubernetes ServiceAccount access to Cloud Pub/Sub.

**Options:**

- **A.** The developer must annotate the Kubernetes ServiceAccount with a service account key JSON file path.
- **B.** The developer needs to install the GKE metadata server DaemonSet on the cluster nodes before Workload Identity can work.
- **C.** The Workload Identity Federation for GKE feature is not enabled on the Autopilot cluster and must be manually enabled.
- **D.** The developer has not created an IAM allow policy that grants the Kubernetes ServiceAccount access to Cloud Pub/Sub. — _correct answer_

## Question 55

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are running a containerized application on a GKE Autopilot cluster. The application needs to read data from a Cloud Storage bucket. When testing, the Pod cannot authenticate to Cloud Storage and returns permission errors. You verified that the IAM service account has the Storage Object Viewer role on the bucket. What is the most likely cause of this issue?

**Correct answer:** C. The IAM allow policy does not include the Kubernetes ServiceAccount principal identifier, so the Pod cannot access the Cloud Storage bucket directly.

**Options:**

- **A.** The GKE Autopilot cluster does not have Workload Identity Federation enabled, and you need to manually enable it using the gcloud container clusters update command.
- **B.** The Storage Object Viewer role must be granted at the project level instead of the bucket level for Workload Identity Federation to function correctly.
- **C.** The IAM allow policy does not include the Kubernetes ServiceAccount principal identifier, so the Pod cannot access the Cloud Storage bucket directly. — _correct answer_
- **D.** The Pod is using the default Kubernetes ServiceAccount, which automatically inherits permissions from the Compute Engine default service account attached to the nodes.

## Question 56

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application development team needs to access Google Cloud Console to manage Cloud Storage buckets that are protected by a VPC Service Controls perimeter. The team members work from various locations using corporate laptops. You need to configure the perimeter to allow console access while maintaining security controls. What should you do?

**Correct answer:** B. Create an access level in Access Context Manager that specifies conditions based on device trust and corporate IP address ranges. Add this access level to the service perimeter to allow context-aware access from authorized users.

**Options:**

- **A.** Add all team members' user accounts to an egress rule that allows access to Cloud Storage APIs. Configure the egress rule to permit read and write operations on the protected buckets.
- **B.** Create an access level in Access Context Manager that specifies conditions based on device trust and corporate IP address ranges. Add this access level to the service perimeter to allow context-aware access from authorized users. — _correct answer_
- **C.** Create a Cloud Workstation instance inside the perimeter and require all team members to access Cloud Storage through the workstation. Configure the workstation with necessary IAM permissions.
- **D.** Configure ingress rules that specify ANY_USER_ACCOUNT as the identity type and allow all Google Cloud Console operations. Add the corporate IP address ranges as source conditions in the ingress rule.

## Question 57

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Memorystore for Redis to cache user session data. The data must be persisted even if a failure occurs, and your application requires high availability with automatic failover. You need to select the appropriate Memorystore tier and configure it for optimal reliability. What should you do?

**Correct answer:** C. Deploy a Standard Tier Memorystore for Redis instance with RDB snapshots enabled for additional data durability beyond automatic replication.

**Options:**

- **A.** Deploy a Standard Tier Memorystore for Redis instance and configure the volatile-ttl eviction policy to prevent session data from being evicted.
- **B.** Deploy a Basic Tier Memorystore for Redis instance with the flushless update feature and configure manual backups to Cloud Storage.
- **C.** Deploy a Standard Tier Memorystore for Redis instance with RDB snapshots enabled for additional data durability beyond automatic replication. — _correct answer_
- **D.** Deploy two Basic Tier Memorystore for Redis instances in different zones and implement application-level replication between them.

## Question 58

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is running a microservices application on GKE Autopilot. You need to configure Cloud Monitoring to alert your on-call team when container CPU utilization exceeds 80% for more than 5 minutes. The alerts should be sent to both email and a Slack channel for redundancy. What should you do?

**Correct answer:** B. Create an alerting policy in Cloud Monitoring with a metric threshold condition on the kubernetes.io/container/cpu/limit_utilization metric. Configure the condition to trigger when the metric exceeds 0.8 for 5 minutes. Add both an email notification channel and a Slack notification channel to the policy.

**Options:**

- **A.** Create an alerting policy with a PromQL condition using the container_cpu_usage_seconds_total metric. Configure the Slack notification channel and set it to forward messages to email using Slack's built-in email forwarding feature.
- **B.** Create an alerting policy in Cloud Monitoring with a metric threshold condition on the kubernetes.io/container/cpu/limit_utilization metric. Configure the condition to trigger when the metric exceeds 0.8 for 5 minutes. Add both an email notification channel and a Slack notification channel to the policy. — _correct answer_
- **C.** Deploy a custom Prometheus exporter as a sidecar container in each pod. Create a PodMonitoring resource to scrape the CPU metrics. Configure an alerting policy using the custom metrics and set up a Pub/Sub notification channel to trigger a Cloud Run function that sends emails and Slack messages.
- **D.** Install the Ops Agent on GKE Autopilot nodes to collect CPU metrics. Create an alerting policy targeting the agent.googleapis.com/cpu/utilization metric. Configure email notification only and create a Cloud Run function to forward alerts to Slack.

## Question 59

**Domain:** Deploying applications

**Question:** Your Cloud Run service uses a Serverless VPC Access connector to access private resources. During peak traffic periods, you notice increased latency. You discover that your connector has scaled from the default 2 instances to the maximum of 10 instances. After peak hours, traffic drops significantly. What should you understand about the connector's behavior and cost implications?

**Correct answer:** C. The connector does not scale back down after reaching the maximum instances, and you will continue to be billed for all 10 instances until you manually adjust the configuration.

**Options:**

- **A.** The connector maintains the maximum instances during business hours and scales down to minimum instances during off-hours based on Cloud Scheduler configuration.
- **B.** The connector automatically scales down to the minimum of 2 instances within one hour after traffic decreases, reducing your costs accordingly.
- **C.** The connector does not scale back down after reaching the maximum instances, and you will continue to be billed for all 10 instances until you manually adjust the configuration. — _correct answer_
- **D.** The connector uses serverless billing and only charges for actual traffic processed, regardless of the number of instances running at any time.

## Question 60

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that references a secret from Secret Manager. During deployment, Cloud Run reports an error indicating the secret cannot be accessed. The secret exists and contains valid data. What is the most likely cause of this deployment failure?

**Correct answer:** C. The Cloud Run service's service account does not have the Secret Manager Secret Accessor role on the secret.

**Options:**

- **A.** The Cloud Run service is deployed in a different region than the Secret Manager secret.
- **B.** The Secret Manager API is not enabled in the project where the Cloud Run service is deployed.
- **C.** The Cloud Run service's service account does not have the Secret Manager Secret Accessor role on the secret. — _correct answer_
- **D.** The secret version specified in the deployment configuration has been destroyed.

## Question 61

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has multiple Google Cloud projects, and you need to centralize all audit logs into a single log bucket in a dedicated observability project. You also want to prevent these logs from being stored redundantly in each source project's default bucket. What should you do?

**Correct answer:** A. Create an aggregated sink at the organization or folder level with the intercept option enabled to route audit logs to the central log bucket.

**Options:**

- **A.** Create an aggregated sink at the organization or folder level with the intercept option enabled to route audit logs to the central log bucket. — _correct answer_
- **B.** Create a non-intercepting aggregated sink at the organization level and manually add exclusion filters to the _Default sink in each source project.
- **C.** Create a Cloud Run function that pulls logs from each project using the Logging API and writes them to the central bucket. Delete logs from source projects after copying.
- **D.** Create individual log sinks in each source project to route audit logs to the central bucket. Add exclusion filters to each project's _Default sink to exclude audit logs.

## Question 62

**Domain:** Deploying applications

**Question:** You have a microservices application running on GKE. You want to enrich your container logs with metadata like request ID and user context to facilitate troubleshooting. You also want to be able to query specific JSON fields in your logs for analysis. What should you do?

**Correct answer:** D. Update your application to output logs in JSON format to stdout, including the necessary metadata fields in the JSON structure.

**Options:**

- **A.** Install Fluent Bit as a DaemonSet on your GKE cluster and configure it to parse and enrich logs before sending them to Cloud Logging.
- **B.** Configure a logging exclusion filter in Cloud Logging to extract metadata fields from your unstructured text logs.
- **C.** Use the Cloud Logging client library to write logs directly to Cloud Logging from your application, bypassing stdout entirely.
- **D.** Update your application to output logs in JSON format to stdout, including the necessary metadata fields in the JSON structure. — _correct answer_

## Question 63

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service connects to a Cloud SQL database that supports a maximum of 100 concurrent connections. Each Cloud Run instance maintains a connection pool of 10 connections. During peak traffic, you observe database connection errors because Cloud Run scales beyond what the database can support. You need to prevent connection exhaustion while ensuring the service can handle peak traffic efficiently. What should you do?

**Correct answer:** A. Set the maximum instances limit to 10 and increase the concurrency setting to allow each instance to handle more concurrent requests.

**Options:**

- **A.** Set the maximum instances limit to 10 and increase the concurrency setting to allow each instance to handle more concurrent requests. — _correct answer_
- **B.** Enable instance-based billing to keep instances running longer and reduce the frequency of new instance creation.
- **C.** Configure minimum instances to 10 to ensure all database connections are pre-established before traffic arrives.
- **D.** Set the concurrency to 1 so that each instance processes one request at a time and uses fewer database connections.

## Question 64

**Domain:** Deploying applications

**Question:** You are developing a web application deployed on a GKE cluster that needs to be exposed to internal clients within your VPC network only. You want to use Ingress to configure Layer 7 load balancing with path-based routing capabilities. Which annotation should you add to your Ingress manifest to deploy an internal Application Load Balancer?

**Correct answer:** A. Add the annotation kubernetes.io/ingress.class: 'gce-internal' to the Ingress manifest.

**Options:**

- **A.** Add the annotation kubernetes.io/ingress.class: 'gce-internal' to the Ingress manifest. — _correct answer_
- **B.** Add the annotation kubernetes.io/ingress.class: 'gce' to the Ingress manifest.
- **C.** Set the spec.ingressClassName field to 'gce-internal' in the Ingress manifest.
- **D.** Add the annotation networking.gke.io/load-balancer-type: 'Internal' to the Ingress manifest.

## Question 65

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application running on GKE is receiving intermittent 'too many connections' errors from Cloud SQL for MySQL. The application uses connection pooling with a pool size of 10 per pod, and you have 50 pods running. Your Cloud SQL instance has max_connections set to 400. You need to resolve this issue while maintaining application availability. What should you do?

**Correct answer:** B. Reduce the connection pool size per pod to 5 and configure max_overflow to 2. Implement exponential backoff retry logic when connection attempts fail.

**Options:**

- **A.** Deploy additional Cloud SQL read replicas and configure the application to distribute read queries across replicas while sending writes to the primary.
- **B.** Reduce the connection pool size per pod to 5 and configure max_overflow to 2. Implement exponential backoff retry logic when connection attempts fail. — _correct answer_
- **C.** Increase the max_connections flag on the Cloud SQL instance to 600 to accommodate all potential connections from the application pods.
- **D.** Remove connection pooling entirely and let each request create its own database connection to better control the number of active connections.

## Question 66

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is building a document processing pipeline using Cloud Tasks. You need to prevent the same document from being processed multiple times if a client accidentally submits duplicate task creation requests. How should you implement task deduplication?

**Correct answer:** B. Explicitly specify a unique task name derived from the document identifier when creating each task.

**Options:**

- **A.** Use the BufferTask API which automatically deduplicates tasks based on payload content.
- **B.** Explicitly specify a unique task name derived from the document identifier when creating each task. — _correct answer_
- **C.** Enable automatic deduplication on the queue configuration settings.
- **D.** Store document hashes in Cloud Storage and check before creating tasks.

## Question 67

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is developing a healthcare application that stores patient records in Cloud Storage. Due to compliance requirements, you must use customer-managed encryption keys (CMEK) with Cloud KMS to encrypt the data. You have created a Cloud KMS key ring in the us-east1 region. When you attempt to configure CMEK encryption for a Cloud Storage bucket located in us-west1, the operation fails. What should you do to resolve this issue?

**Correct answer:** A. Create a new Cloud KMS key ring in the us-west1 region and use a key from this key ring to encrypt the Cloud Storage bucket.

**Options:**

- **A.** Create a new Cloud KMS key ring in the us-west1 region and use a key from this key ring to encrypt the Cloud Storage bucket. — _correct answer_
- **B.** Enable the Cloud KMS global region feature and migrate your existing key to a global key ring to allow encryption across all regions.
- **C.** Copy the existing encryption key from the us-east1 key ring to a new key ring in us-west1 using the Cloud KMS key replication feature.
- **D.** Configure cross-region key access by granting the Cloud Storage service agent additional IAM permissions to access keys in other regions.

## Question 68

**Domain:** Building and testing applications

**Question:** You are developing a Cloud Run service for a production e-commerce application. Your team wants to deploy a new revision and test it before sending any production traffic to it. You need to deploy the new revision, verify it works correctly with real infrastructure connections, and then gradually migrate traffic to it. What should you do?

**Correct answer:** C. Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary'. Test the revision using the tag-specific URL, then use 'gcloud run services update-traffic myservice --to-tags canary=10' to gradually increase traffic.

**Options:**

- **A.** Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL --traffic-percent=0'. Test the revision using Cloud Shell proxy, then use 'gcloud run services set-traffic' to route traffic to it.
- **B.** Deploy the new revision to a staging project using 'gcloud run deploy'. After testing passes, copy the revision to production using 'gcloud run services copy' and configure traffic splitting with Cloud Load Balancing.
- **C.** Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary'. Test the revision using the tag-specific URL, then use 'gcloud run services update-traffic myservice --to-tags canary=10' to gradually increase traffic. — _correct answer_
- **D.** Deploy the new revision using 'gcloud run deploy myservice --image IMAGE_URL'. After deployment, manually test the service, then create a second deployment with the --rollback flag if issues are found.

## Question 69

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to access multiple secrets from Secret Manager. One secret contains an API key and should be available as an environment variable named API_KEY. Another secret contains a TLS certificate that needs to be mounted at /etc/certs/tls.crt. Which gcloud command correctly configures both secrets?

**Correct answer:** A. gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=API_KEY=api-key-secret:latest,/etc/certs/tls.crt=tls-cert-secret:1

**Options:**

- **A.** gcloud run deploy my-service --image gcr.io/my-project/my-image --update-secrets=API_KEY=api-key-secret:latest,/etc/certs/tls.crt=tls-cert-secret:1 — _correct answer_
- **B.** gcloud run deploy my-service --image gcr.io/my-project/my-image --env-secrets=API_KEY=api-key-secret --volume-secrets=/etc/certs/tls.crt=tls-cert-secret
- **C.** gcloud run deploy my-service --image gcr.io/my-project/my-image --set-env-vars=API_KEY=api-key-secret:latest --set-volumes=/etc/certs/tls.crt=tls-cert-secret:1
- **D.** gcloud run deploy my-service --image gcr.io/my-project/my-image --secrets=API_KEY:api-key-secret:latest --mount-secret=/etc/certs/tls.crt:tls-cert-secret:1

## Question 70

**Domain:** Building and testing applications

**Question:** You have finished testing your application locally and no longer need the Application Default Credentials stored on your workstation. The local ADC file contains a refresh token that could be used to obtain access tokens. You want to remove these credentials securely to prevent unauthorized access. What should you do?

**Correct answer:** A. Run 'gcloud auth application-default revoke' to revoke the local ADC credentials.

**Options:**

- **A.** Run 'gcloud auth application-default revoke' to revoke the local ADC credentials. — _correct answer_
- **B.** Unset the GOOGLE_APPLICATION_CREDENTIALS environment variable to prevent applications from finding the credentials.
- **C.** Run 'gcloud auth revoke' to revoke all credentials including the Application Default Credentials.
- **D.** Delete the application_default_credentials.json file from the well-known location on your file system manually using a file manager.

## Question 71

**Domain:** Deploying applications

**Question:** You are troubleshooting a Cloud Run service that fails to connect to a Compute Engine VM with internal IP 10.128.0.5 in your VPC network. The service is configured with a Serverless VPC Access connector. You verified that the connector is in the READY state and in the same region as both the Cloud Run service and the VM. What should you check next to diagnose the connectivity issue?

**Correct answer:** A. Verify that VPC firewall rules allow ingress traffic from the connector's subnet IP range to the Compute Engine VM on the required ports.

**Options:**

- **A.** Verify that VPC firewall rules allow ingress traffic from the connector's subnet IP range to the Compute Engine VM on the required ports. — _correct answer_
- **B.** Check if the Cloud Run service has the compute.networkAdmin IAM role to establish network connections through the connector.
- **C.** Confirm that the Compute Engine VM has an external IP address assigned for the connector to route return traffic.
- **D.** Ensure that Private Google Access is enabled on the subnet where the Compute Engine VM is deployed.

## Question 72

**Domain:** Building and testing applications

**Question:** You are setting up your local development environment to debug a containerized Kubernetes application using Cloud Code in VS Code. When you attempt to debug the application, you receive an authentication error when the application tries to call a Google Cloud API. What should you do to resolve this issue?

**Correct answer:** A. Install the gcloud CLI on your machine and run 'gcloud auth application-default login' to authenticate your credentials for debugging applications locally.

**Options:**

- **A.** Install the gcloud CLI on your machine and run 'gcloud auth application-default login' to authenticate your credentials for debugging applications locally. — _correct answer_
- **B.** Enable Identity-Aware Proxy (IAP) for your local development environment and configure the application to use IAP tokens for API authentication.
- **C.** Configure your VS Code launch.json file with hardcoded API keys for each Google Cloud service your application needs to access during debugging.
- **D.** Create a service account key file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable in your IDE settings to point to the key file.

## Question 73

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an order processing application that uses Cloud Tasks to dispatch tasks to a Cloud Run service. Your operations team reports that tasks are being retried indefinitely and causing resource exhaustion. You need to configure the queue to stop retrying after a maximum of 10 attempts and ensure retries do not continue beyond 1 hour from the first attempt. Which gcloud command should you use?

**Correct answer:** C. gcloud tasks queues update orders-queue --max-attempts=10 --max-retry-duration=3600s --location=us-central1

**Options:**

- **A.** gcloud tasks queues update orders-queue --max-attempts=10 --location=us-central1
- **B.** gcloud tasks queues update orders-queue --max-retry-duration=3600s --location=us-central1
- **C.** gcloud tasks queues update orders-queue --max-attempts=10 --max-retry-duration=3600s --location=us-central1 — _correct answer_
- **D.** gcloud tasks queues update orders-queue --max-doublings=10 --max-backoff=3600s --location=us-central1

## Question 74

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are troubleshooting performance issues in your Cloud Bigtable application that stores financial transaction data. Users report intermittent latency spikes throughout the day. You suspect the issue is related to your schema design but need to confirm and identify the specific problematic row key ranges. What should you do?

**Correct answer:** D. Use Key Visualizer to analyze access patterns and identify hotspots in your table's row key space using heatmaps.

**Options:**

- **A.** Run the ListHotTablets API to get a complete historical analysis of all access patterns since table creation.
- **B.** Add logging to your application to track the latency of each Bigtable request and correlate with row keys.
- **C.** Examine Cloud Monitoring metrics for overall cluster CPU utilization to identify performance bottlenecks.
- **D.** Use Key Visualizer to analyze access patterns and identify hotspots in your table's row key space using heatmaps. — _correct answer_

## Question 75

**Domain:** Integrating applications with Google Cloud services

**Question:** You are instrumenting a GKE application to export custom business metrics to Cloud Monitoring. The application already exposes Prometheus-format metrics. You want to use a Google-managed solution that requires minimal operational overhead. What should you configure?

**Correct answer:** C. Enable Google Cloud Managed Service for Prometheus on your GKE cluster and create PodMonitoring resources to scrape metrics from your application pods.

**Options:**

- **A.** Deploy a self-managed Prometheus server in your cluster with remote write configured to send metrics to Cloud Monitoring.
- **B.** Configure a Cloud Run job to periodically query your application's metrics endpoint and write the data to Cloud Monitoring using the API.
- **C.** Enable Google Cloud Managed Service for Prometheus on your GKE cluster and create PodMonitoring resources to scrape metrics from your application pods. — _correct answer_
- **D.** Modify your application code to use the Cloud Monitoring client library instead of the Prometheus client library to export metrics directly.

## Question 76

**Domain:** Deploying applications

**Question:** You are managing multiple microservices deployed to a GKE cluster. You want to deploy a new microservice to a specific namespace called 'production' using a YAML manifest file. The YAML manifest does not include a namespace specification in the metadata section. What should you do to ensure the resources are created in the 'production' namespace?

**Correct answer:** A. Run 'kubectl apply -f deployment.yaml -n production' to specify the target namespace at deployment time.

**Options:**

- **A.** Run 'kubectl apply -f deployment.yaml -n production' to specify the target namespace at deployment time. — _correct answer_
- **B.** Run 'kubectl apply -f deployment.yaml' and then move the resources to the production namespace using 'kubectl move'.
- **C.** Edit the YAML manifest to add the namespace field before running kubectl apply, since the -n flag cannot override the manifest settings.
- **D.** Set the current context namespace to 'production' using 'kubectl config set-context --current --namespace=production' before running kubectl apply without any flags.

## Question 77

**Domain:** Deploying applications

**Question:** You are creating a Serverless VPC Access connector to allow your Cloud Run services to access private resources in your VPC network. You need to configure the connector with its own dedicated subnet. What is the required subnet size for a Serverless VPC Access connector?

**Correct answer:** B. A /28 subnet that is not shared with any other resources.

**Options:**

- **A.** A /24 subnet that can be shared with other VPC connector instances.
- **B.** A /28 subnet that is not shared with any other resources. — _correct answer_
- **C.** A /30 subnet dedicated to the connector with Private Google Access enabled.
- **D.** A /16 subnet with a secondary IP range configured for the connector.

## Question 78

**Domain:** Deploying applications

**Question:** Your team deployed a new version of a GKE workload that is causing errors in production. You need to immediately revert to the previous working version while the team investigates. The Deployment is named 'payment-service' and you want to use the kubectl command that preserves the rollout history. What should you do?

**Correct answer:** B. Run kubectl rollout undo deployment/payment-service

**Options:**

- **A.** Run kubectl rollout pause deployment/payment-service and manually edit the container image using kubectl edit.
- **B.** Run kubectl rollout undo deployment/payment-service — _correct answer_
- **C.** Run kubectl delete deployment payment-service and re-apply the previous YAML manifest file.
- **D.** Run kubectl scale deployment payment-service --replicas=0 to stop all traffic while investigating.

## Question 79

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Cloud Firestore and requires a feature to transfer loyalty points between user accounts. You must ensure that points are never duplicated or lost during transfers, even if concurrent transfers occur. What approach should you use?

**Correct answer:** D. Use a Firestore transaction that reads both user documents, validates the transfer amount, and writes updated balances to both documents atomically.

**Options:**

- **A.** Use separate write operations to deduct from one account and add to another, with application-level retry logic for failed operations.
- **B.** Use the FieldValue.increment() operation on both documents in sequential write operations to update balances.
- **C.** Use a batched write to update both user documents simultaneously within a single atomic operation.
- **D.** Use a Firestore transaction that reads both user documents, validates the transfer amount, and writes updated balances to both documents atomically. — _correct answer_

## Question 80

**Domain:** Deploying applications

**Question:** You are configuring resource requests and limits for containers in a GKE Standard cluster. Your application requires a guaranteed 500 millicores of CPU and 256 MiB of memory to function correctly, but can burst to use more resources during peak loads. You want to follow Google Cloud best practices for resource configuration. How should you configure the container resources in your deployment manifest?

**Correct answer:** A. Set requests.cpu to 500m, requests.memory to 256Mi, and limits.memory to 256Mi. Do not set limits.cpu to allow CPU bursting.

**Options:**

- **A.** Set requests.cpu to 500m, requests.memory to 256Mi, and limits.memory to 256Mi. Do not set limits.cpu to allow CPU bursting. — _correct answer_
- **B.** Set requests.cpu to 250m, requests.memory to 128Mi to allow more pods per node, and set limits.cpu to 500m, limits.memory to 256Mi for peak usage.
- **C.** Set requests.cpu to 500m, limits.cpu to 1000m, requests.memory to 256Mi, and limits.memory to 512Mi to allow both CPU and memory bursting.
- **D.** Set only limits.cpu to 500m and limits.memory to 256Mi without setting any requests values.

## Question 81

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a REST API on Cloud Run that connects to a Cloud SQL database with a maximum of 100 concurrent connections. You need to ensure your API scales appropriately without exceeding the database connection limit. Each instance maintains 10 database connections. What should you do?

**Correct answer:** D. Configure the Cloud Run service with a maximum of 10 instances to limit total connections to 100.

**Options:**

- **A.** Configure minimum instances to 10 and rely on Cloud Run to not exceed this number during normal operations.
- **B.** Set the concurrency to 1 so each instance handles only one request at a time, reducing database connection usage.
- **C.** Enable instance-based billing to prevent instances from scaling beyond what the database can handle.
- **D.** Configure the Cloud Run service with a maximum of 10 instances to limit total connections to 100. — _correct answer_

## Question 82

**Domain:** Deploying applications

**Question:** You are developing a GKE application that uses ConfigMaps for non-sensitive configuration and Secrets for API keys. Your security team is concerned about unauthorized modifications to these configuration objects. You want to protect the configuration from accidental changes while reducing the load on the kube-apiserver. What should you do?

**Correct answer:** A. Set the immutable field to true in both the ConfigMap and Secret manifests after the configuration has been verified.

**Options:**

- **A.** Set the immutable field to true in both the ConfigMap and Secret manifests after the configuration has been verified. — _correct answer_
- **B.** Store the configuration in a separate namespace and use NetworkPolicies to prevent access from other namespaces.
- **C.** Enable application-layer secrets encryption for Secrets and configure RBAC policies to restrict write access to ConfigMaps and Secrets.
- **D.** Create versioned ConfigMaps and Secrets with unique names for each version, and update pod specifications to reference the new versions.

## Question 83

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a latency-sensitive payment processing API on Cloud Run. The API must respond within 200 milliseconds for optimal user experience. During testing, you observe that first requests after periods of inactivity take over 3 seconds to complete due to container startup time, while subsequent requests meet the latency target. You need to minimize cold start latency while keeping costs as low as possible. What should you do?

**Correct answer:** B. Configure minimum instances to 1 and enable startup CPU boost to reduce the cold start impact while keeping costs low.

**Options:**

- **A.** Set maximum concurrency to 1 to ensure each instance handles only one request, preventing latency spikes from concurrent processing.
- **B.** Configure minimum instances to 1 and enable startup CPU boost to reduce the cold start impact while keeping costs low. — _correct answer_
- **C.** Configure manual scaling with 5 instances to always have enough warm capacity available for payment processing.
- **D.** Configure instance-based billing to ensure CPU is always allocated, reducing the time to process cold start requests.

## Question 84

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You need to diagnose performance problems in a Cloud Bigtable cluster that has multiple tables with different workloads. You suspect that hotspotting is occurring but want to identify specific row key ranges causing the issue and determine which table is responsible. What approach should you take?

**Correct answer:** B. Run the ListHotTablets method to identify tablets with high CPU usage across all tables in the cluster and examine the start and end keys.

**Options:**

- **A.** Monitor only the overall cluster CPU utilization metric in Cloud Monitoring to identify when hotspotting occurs.
- **B.** Run the ListHotTablets method to identify tablets with high CPU usage across all tables in the cluster and examine the start and end keys. — _correct answer_
- **C.** Add application-level logging to track all row keys accessed and analyze the logs for patterns causing hotspots.
- **D.** Use Key Visualizer heatmaps to examine access patterns for all tables simultaneously in the cluster.

## Question 85

**Domain:** Building and testing applications

**Question:** Your development team uses Cloud Code to develop containerized applications. A new team member needs to set up their local development environment for Kubernetes development with Cloud Code in VS Code. Which combination of tools must be installed before the developer can run and debug applications on a local Kubernetes cluster?

**Correct answer:** D. Visual Studio Code, Git, and Docker client. Cloud Code can manage Skaffold, minikube, and kubectl dependencies automatically or use existing installations.

**Options:**

- **A.** Visual Studio Code and the gcloud CLI. Cloud Code uses Cloud Build remotely for all container builds, eliminating the need for local Docker installation.
- **B.** Visual Studio Code, Docker Desktop, kubectl, Skaffold, and minikube, all configured and added to the system PATH before installing Cloud Code.
- **C.** Visual Studio Code, Cloud SDK, and a Google Cloud project with billing enabled. Cloud Code retrieves all other dependencies from Cloud Shell.
- **D.** Visual Studio Code, Git, and Docker client. Cloud Code can manage Skaffold, minikube, and kubectl dependencies automatically or use existing installations. — _correct answer_

## Question 86

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are configuring VPC Service Controls for a healthcare application that processes Protected Health Information (PHI). VMs inside the perimeter must only communicate with Google Cloud services that are protected by VPC Service Controls to prevent data exfiltration through unsupported services. Which configuration should you implement?

**Correct answer:** D. Enable VPC accessible services for the perimeter and set the allowed services to 'RESTRICTED-SERVICES' to limit access from network endpoints inside the perimeter to only the restricted services.

**Options:**

- **A.** Configure Private Google Access on all subnets and use the private.googleapis.com VIP to ensure traffic stays within Google's network and is automatically protected.
- **B.** Configure organization policies to restrict the creation of resources that use unsupported Google Cloud services within projects inside the perimeter.
- **C.** Create egress rules that explicitly deny access to all services not in the perimeter's restricted services list by specifying each unsupported service individually.
- **D.** Enable VPC accessible services for the perimeter and set the allowed services to 'RESTRICTED-SERVICES' to limit access from network endpoints inside the perimeter to only the restricted services. — _correct answer_

## Question 87

**Domain:** Building and testing applications

**Question:** You are building container images using Cloud Build and storing them in Artifact Registry. Your security team requires that all images be scanned for vulnerabilities before deployment, and images with critical vulnerabilities must be blocked from deployment to GKE. What should you do?

**Correct answer:** C. Enable the Container Scanning API to automatically scan images pushed to Artifact Registry, and configure Binary Authorization with a policy that requires attestations based on vulnerability scan results.

**Options:**

- **A.** Add a Cloud Build step using the On-Demand Scanning API to scan images after they are built, and manually review the results before approving deployments.
- **B.** Enable Security Command Center and create an alert policy that notifies your team when critical vulnerabilities are detected in container images stored in Artifact Registry.
- **C.** Enable the Container Scanning API to automatically scan images pushed to Artifact Registry, and configure Binary Authorization with a policy that requires attestations based on vulnerability scan results. — _correct answer_
- **D.** Configure Cloud Build to run a third-party vulnerability scanner and fail the build if critical vulnerabilities are detected, preventing the image from being pushed to Artifact Registry.

## Question 88

**Domain:** Integrating applications with Google Cloud services

**Question:** You are designing a Cloud Tasks queue to process order fulfillment requests. Your backend service occasionally experiences transient failures. You want to configure exponential backoff with the following behavior: initial retry after 5 seconds, doubling the interval 4 times, then continuing retries at a maximum interval of 5 minutes. Which gcloud command correctly configures this retry behavior?

**Correct answer:** A. gcloud tasks queues update orders-queue --min-backoff=5s --max-backoff=300s --max-doublings=4

**Options:**

- **A.** gcloud tasks queues update orders-queue --min-backoff=5s --max-backoff=300s --max-doublings=4 — _correct answer_
- **B.** gcloud tasks queues update orders-queue --min-backoff=5s --max-backoff=300s --max-doublings=8
- **C.** gcloud tasks queues update orders-queue --backoff-initial=5s --backoff-max=300s --backoff-doublings=4
- **D.** gcloud tasks queues update orders-queue --initial-delay=5s --max-delay=300s --doublings=4

## Question 89

**Domain:** Integrating applications with Google Cloud services

**Question:** You are troubleshooting a Cloud Tasks queue where tasks are being deleted before completion. Your queue is configured with max_attempts set to 5 and max_retry_duration set to 600 seconds. The tasks consistently fail with HTTP 500 errors. You need to understand when Cloud Tasks will stop retrying and delete a failed task. Which statement correctly describes when Cloud Tasks stops retrying?

**Correct answer:** C. Cloud Tasks stops retrying when both max_attempts is reached AND max_retry_duration has passed, then deletes the task.

**Options:**

- **A.** Cloud Tasks stops retrying when max_retry_duration has passed, regardless of the remaining retry attempts.
- **B.** Cloud Tasks stops retrying when max_attempts is reached, regardless of the max_retry_duration setting.
- **C.** Cloud Tasks stops retrying when both max_attempts is reached AND max_retry_duration has passed, then deletes the task. — _correct answer_
- **D.** Cloud Tasks stops retrying when either max_attempts is reached OR max_retry_duration has passed, whichever occurs first.

## Question 90

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company is developing a mobile chat application using Firestore. Users report that the application feels slow when loading chat messages, especially when switching between chat rooms. Currently, the app uses one-shot queries with get() to fetch messages each time a chat room is opened. You need to optimize the application for better responsiveness while minimizing read costs. What should you do?

**Correct answer:** C. Replace one-shot queries with long-lived snapshot listeners using onSnapshot() to receive real-time updates for active chat rooms.

**Options:**

- **A.** Configure Firestore to use server-side caching and increase the query timeout settings to reduce latency.
- **B.** Switch from Firestore to Realtime Database because it provides better real-time synchronization for chat applications.
- **C.** Replace one-shot queries with long-lived snapshot listeners using onSnapshot() to receive real-time updates for active chat rooms. — _correct answer_
- **D.** Implement periodic polling with one-shot queries every 5 seconds to refresh the chat messages in each active chat room.

## Question 91

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline that builds a container image and stores it in Artifact Registry. Your security team requires that you generate SLSA Level 3 compliant build provenance that can be verified for deployments. What should you configure in your Cloud Build setup?

**Correct answer:** B. Use a Cloud Build trigger to invoke builds from repository events and set requestedVerifyOption to VERIFIED in the build config options.

**Options:**

- **A.** Enable the Container Analysis API and add --attest type=provenance flag to the docker build command in your build step.
- **B.** Use a Cloud Build trigger to invoke builds from repository events and set requestedVerifyOption to VERIFIED in the build config options. — _correct answer_
- **C.** Configure Binary Authorization policies and set the provenance attestor in Cloud Build service account settings.
- **D.** Submit builds manually using gcloud builds submit and enable provenance generation in the project settings.

## Question 92

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are migrating a legacy application to Cloud Run. The application reads database credentials from a configuration file at /app/config/db.conf. You want to use Secret Manager to securely provide these credentials without modifying the application code. How should you configure the Cloud Run service?

**Correct answer:** C. Mount the secret as a volume at /app/config with the filename db.conf, specifying the secret version to use.

**Options:**

- **A.** Create a startup script that uses the gcloud CLI to fetch the secret and write it to /app/config/db.conf before the application starts.
- **B.** Expose the secret as an environment variable named DB_CONF and modify the application to read from environment variables instead of the file.
- **C.** Mount the secret as a volume at /app/config with the filename db.conf, specifying the secret version to use. — _correct answer_
- **D.** Store the credentials in Cloud Storage and configure Cloud Run to download the file at startup using an init container.

## Question 93

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company operates two separate Google Cloud projects in different VPC Service Controls perimeters. Project A in Perimeter 1 needs to read data from a BigQuery dataset in Project B that is protected by Perimeter 2. You need to enable this cross-perimeter access while maintaining security. What should you do?

**Correct answer:** D. Configure an egress rule in Perimeter 1 to allow Project A to access BigQuery resources in Project B. Configure an ingress rule in Perimeter 2 to allow requests from Project A.

**Options:**

- **A.** Add Project A to Perimeter 2 as an additional project member. This will allow Project A full access to all resources within Perimeter 2.
- **B.** Create an access level that allows requests from Project A. Apply this access level to Perimeter 2 to grant Project A access to the BigQuery dataset.
- **C.** Create a perimeter bridge between Perimeter 1 and Perimeter 2. Add both projects to the bridge to enable bidirectional communication.
- **D.** Configure an egress rule in Perimeter 1 to allow Project A to access BigQuery resources in Project B. Configure an ingress rule in Perimeter 2 to allow requests from Project A. — _correct answer_

## Question 94

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Storage application is experiencing intermittent failures with some requests returning 429 rateLimitExceeded errors while others succeed. The application reads thousands of objects per second from multiple buckets in the same project and region. You need to resolve this issue while maintaining application performance. What should you do?

**Correct answer:** B. Ramp up request rates gradually, distribute objects across buckets with randomized naming prefixes, and implement exponential backoff for failed requests.

**Options:**

- **A.** Move all objects into a single bucket with hierarchical namespace enabled to consolidate operations and reduce the number of API calls across multiple buckets.
- **B.** Ramp up request rates gradually, distribute objects across buckets with randomized naming prefixes, and implement exponential backoff for failed requests. — _correct answer_
- **C.** Submit a quota increase request through the Google Cloud console to increase the rate limits for your project, and wait for approval before continuing development.
- **D.** Configure Cloud Monitoring alerts to detect 429 errors and automatically pause the application for 60 seconds whenever rate limiting is detected.

## Question 95

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your production Cloud Run service and want to test it thoroughly before exposing it to any live traffic. You need to deploy the new revision, verify its functionality at a dedicated test URL, and then gradually increase traffic to it. What gcloud command should you use to deploy the new revision initially?

**Correct answer:** C. gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary

**Options:**

- **A.** gcloud run deploy myservice --image IMAGE_URL --traffic 0 --revision-suffix canary
- **B.** gcloud run deploy myservice --image IMAGE_URL --min-instances 0 --tag canary
- **C.** gcloud run deploy myservice --image IMAGE_URL --no-traffic --tag canary — _correct answer_
- **D.** gcloud run deploy myservice --image IMAGE_URL --staging --endpoint canary

## Question 96

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization has multiple GKE clusters in the same Google Cloud project. You want to grant all pods within the 'payments' namespace across all clusters read access to a specific Cloud Storage bucket. The configuration should minimize administrative overhead when adding new clusters. What should you do?

**Correct answer:** A. Use the principalSet notation in the IAM policy to grant access to all workloads in the 'payments' namespace across all clusters that share the same workload identity pool.

**Options:**

- **A.** Use the principalSet notation in the IAM policy to grant access to all workloads in the 'payments' namespace across all clusters that share the same workload identity pool. — _correct answer_
- **B.** Create a separate IAM service account for each cluster and configure service account impersonation from each cluster's Kubernetes ServiceAccount in the 'payments' namespace.
- **C.** Create a Kubernetes ServiceAccount named 'payments-access' in each cluster and manually add IAM bindings for each ServiceAccount principal identifier.
- **D.** Configure a fleet with all clusters and use fleet Workload Identity Federation to create a unified identity across all member clusters.

## Question 97

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for a financial services application that stores transaction data. Transactions have different data retention requirements: some fields must be retained for 7 years for compliance, while others can be deleted after 30 days. You want to minimize storage costs while meeting compliance requirements. What should you do?

**Correct answer:** B. Store columns with different retention requirements in separate column families and configure different garbage collection policies for each family.

**Options:**

- **A.** Store all transaction data in a single column family and implement application-level deletion logic for short-term data.
- **B.** Store columns with different retention requirements in separate column families and configure different garbage collection policies for each family. — _correct answer_
- **C.** Create separate tables for short-term and long-term data with different garbage collection policies.
- **D.** Configure row-level TTL settings to automatically delete entire transactions after 30 days.

## Question 98

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an e-commerce application using Cloud Firestore. Your application needs to perform bulk updates to thousands of product documents to apply a price adjustment. You do not need to read document values before updating. You want to minimize write failures while maintaining atomicity for groups of related updates. What should you do?

**Correct answer:** A. Use batched writes to group related updates into atomic batches, ensuring each batch stays within document limits to avoid exceeding transaction size limits.

**Options:**

- **A.** Use batched writes to group related updates into atomic batches, ensuring each batch stays within document limits to avoid exceeding transaction size limits. — _correct answer_
- **B.** Use a single transaction containing all thousands of product document updates to ensure complete atomicity across the entire price adjustment operation.
- **C.** Use individual document update operations with parallelized writes from a server client library to achieve maximum throughput on the bulk operation.
- **D.** Use transactions to update all product documents, reading each document first to ensure consistency before applying price changes atomically.

## Question 99

**Domain:** Deploying applications

**Question:** Your Cloud Run service requires access to an API key that is rotated frequently by your security team. You need to ensure that the service always uses the current version of the secret without requiring redeployment. You want to follow Google-recommended practices. How should you configure the secret access?

**Correct answer:** C. Mount the secret as a volume and reference the 'latest' version. Read the secret from the mounted file path at runtime when the API key is needed.

**Options:**

- **A.** Expose the secret as an environment variable and reference the 'latest' version. Access the environment variable in your application code.
- **B.** Expose the secret as an environment variable with a specific version number and use Cloud Scheduler to redeploy the service daily after secret rotation.
- **C.** Mount the secret as a volume and reference the 'latest' version. Read the secret from the mounted file path at runtime when the API key is needed. — _correct answer_
- **D.** Use the Secret Manager client library in your application code to fetch the secret programmatically with the 'latest' version alias at application startup.

## Question 100

**Domain:** Deploying applications

**Question:** You are deploying an application on GKE that reads configuration from mounted ConfigMaps and Secrets. The security team requires that configuration changes are reflected in running pods without requiring restarts, while credentials should be refreshed automatically. How should you configure your pods to consume this configuration?

**Correct answer:** B. Mount both ConfigMaps and Secrets as volumes rather than exposing them as environment variables.

**Options:**

- **A.** Expose both ConfigMaps and Secrets as environment variables and use Kubernetes deployment annotations to trigger rolling updates.
- **B.** Mount both ConfigMaps and Secrets as volumes rather than exposing them as environment variables. — _correct answer_
- **C.** Mount ConfigMaps as volumes and expose Secrets as environment variables to balance security with update flexibility.
- **D.** Configure a CronJob to periodically restart pods so they pick up the latest ConfigMap and Secret data from environment variables.

## Question 101

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have deployed a Cloud Run service that handles 1,000 concurrent requests during peak hours. The service uses request-based billing and has a maximum concurrency of 80. Users report occasional HTTP 503 errors during rapid traffic increases. Monitoring shows the service is scaling but new instances are not starting quickly enough. You need to improve the service's ability to handle traffic surges. What should you do?

**Correct answer:** A. Increase the maximum concurrency setting to allow each instance to handle more simultaneous requests while new instances start.

**Options:**

- **A.** Increase the maximum concurrency setting to allow each instance to handle more simultaneous requests while new instances start. — _correct answer_
- **B.** Switch to instance-based billing to ensure instances respond faster to incoming requests during scaling events.
- **C.** Set maximum concurrency to 1 to force Cloud Run to start more instances proactively in response to incoming traffic.
- **D.** Configure minimum instances equal to the expected peak traffic divided by the current concurrency setting.

## Question 102

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has 50 Google Cloud projects across multiple teams. The security team requires that all audit logs from all projects be centrally stored in a dedicated observability project for compliance analysis. You need to configure log routing while allowing individual teams to retain their logs locally for troubleshooting. What should you do?

**Correct answer:** C. Create a non-intercepting aggregated sink at the organization level that routes audit logs to the central observability project's log bucket.

**Options:**

- **A.** Configure each project's _Default sink to route audit logs to the central observability project and disable local log storage.
- **B.** Create an intercepting aggregated sink at the organization level that routes audit logs to a Cloud Storage bucket in the observability project.
- **C.** Create a non-intercepting aggregated sink at the organization level that routes audit logs to the central observability project's log bucket. — _correct answer_
- **D.** Create log-based metrics at the organization level to capture audit log events and store the metrics data in Cloud Monitoring.

## Question 103

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a collaborative note-taking application where multiple users can edit the same note simultaneously. Users report that their changes appear instantly in their own view but take a few seconds to appear for other collaborators. You need to help users understand when their changes have been confirmed by the server versus showing locally only. What should you do?

**Correct answer:** D. Check the metadata.hasPendingWrites property on document snapshots to distinguish between local writes that have not yet been confirmed and server-confirmed data.

**Options:**

- **A.** Disable offline persistence to ensure all writes are sent directly to the server before being reflected in the local UI.
- **B.** Implement a custom timestamp field that is updated only by Cloud Functions after server-side validation to track when changes are server-confirmed.
- **C.** Add a completion callback to the write operation and only update the UI after the callback confirms the write succeeded on the server.
- **D.** Check the metadata.hasPendingWrites property on document snapshots to distinguish between local writes that have not yet been confirmed and server-confirmed data. — _correct answer_

## Question 104

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an IoT platform that stores sensor readings from millions of devices. Each device sends temperature readings every minute. You need to design a Cloud Bigtable schema that allows efficient querying of readings for a specific device over a time range while avoiding hotspots. Which row key design should you use?

**Correct answer:** C. Use a composite row key of device_id#timestamp, where device_id is a high-cardinality identifier for each IoT device.

**Options:**

- **A.** Use only the timestamp as the row key to enable efficient time-range queries across all devices.
- **B.** Use a composite row key of timestamp#device_id to enable efficient time-based queries across all devices.
- **C.** Use a composite row key of device_id#timestamp, where device_id is a high-cardinality identifier for each IoT device. — _correct answer_
- **D.** Use a sequential numeric ID assigned to each reading as the row key for simplicity.

## Question 105

**Domain:** Building and testing applications

**Question:** Your company uses Cloud Build to build container images that are pushed to Artifact Registry. The security team reports that old and unused images are consuming significant storage and increasing costs. You need to implement an automated solution to delete images older than 90 days while keeping the 5 most recent versions of each image regardless of age. What should you do?

**Correct answer:** C. Configure an Artifact Registry cleanup policy on the repository with a delete policy for images older than 90 days and a keep most recent versions policy set to retain 5 versions.

**Options:**

- **A.** Add a final step to your Cloud Build pipeline that deletes the oldest image version whenever a new image is pushed, maintaining a maximum of 5 versions at all times.
- **B.** Configure Cloud Storage lifecycle rules on the underlying storage bucket for Artifact Registry to delete objects older than 90 days automatically.
- **C.** Configure an Artifact Registry cleanup policy on the repository with a delete policy for images older than 90 days and a keep most recent versions policy set to retain 5 versions. — _correct answer_
- **D.** Create a Cloud Scheduler job that triggers a Cloud Run function daily to query Artifact Registry for old images and delete them using the gcloud CLI, while checking to keep the 5 most recent.

## Question 106

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a mobile application using Firestore to track real-time inventory updates. Your application creates multiple snapshot listeners across different screens. Users report that their devices experience increased battery drain and slower performance. You need to optimize resource usage while maintaining real-time functionality where needed. What should you do?

**Correct answer:** B. Call the unsubscribe function returned by onSnapshot when users navigate away from screens that no longer need real-time updates, and detach listeners in component cleanup handlers.

**Options:**

- **A.** Configure all Firestore queries to use source: 'cache' option to prevent network calls and serve all data from the local cache.
- **B.** Call the unsubscribe function returned by onSnapshot when users navigate away from screens that no longer need real-time updates, and detach listeners in component cleanup handlers. — _correct answer_
- **C.** Increase the cache size threshold using setCacheSizeBytes to CACHE_SIZE_UNLIMITED so the device can store more data locally and reduce network calls.
- **D.** Replace all snapshot listeners with one-shot get() queries that execute when users manually refresh the screen to reduce continuous data streaming.

## Question 107

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is developing a multi-tenant application using Cloud Firestore where each tenant has a 'reviews' subcollection under their document. You need to query all reviews across all tenants where the rating equals 5 stars. What must you configure before executing this query?

**Correct answer:** C. Create a single-field or composite index with collection group scope for the 'reviews' collection on the rating field.

**Options:**

- **A.** Create a root-level 'all_reviews' collection and duplicate all review documents there for cross-tenant queries.
- **B.** Enable the collection group query feature in the Firestore database settings and configure security rules.
- **C.** Create a single-field or composite index with collection group scope for the 'reviews' collection on the rating field. — _correct answer_
- **D.** Configure a single-field ascending index for each tenant's reviews subcollection individually.

## Question 108

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a latency-sensitive API to Cloud Run that processes payment transactions. The API must respond within 200 milliseconds, but users report occasional slow responses taking over 3 seconds. After investigation, you determine that cold starts occur during traffic spikes when new instances need to be started. You want to minimize cold start impact while controlling costs. Which combination of configurations should you apply?

**Correct answer:** D. Configure minimum instances greater than zero and enable startup CPU boost to reduce cold start latency.

**Options:**

- **A.** Configure minimum instances to zero and set a higher request timeout to allow more time for cold starts to complete.
- **B.** Set the maximum concurrency to 1 to ensure each instance handles one request at a time for faster response times.
- **C.** Set maximum instances to a high value and configure instance-based billing to improve scaling responsiveness.
- **D.** Configure minimum instances greater than zero and enable startup CPU boost to reduce cold start latency. — _correct answer_

## Question 109

**Domain:** Building and testing applications

**Question:** Your development team is setting up Cloud Code for VS Code to develop a Kubernetes application. The team wants to debug containerized applications running on a local minikube cluster. What configuration files does Cloud Code require to enable the 'Debug on Kubernetes' functionality?

**Correct answer:** D. A skaffold.yaml configuration file and a cloudcode.kubernetes launch configuration in launch.json.

**Options:**

- **A.** A cloudbuild.yaml file and a deployment.yaml Kubernetes manifest file with debug annotations.
- **B.** A docker-compose.yaml file and environment variables defined in a .env file.
- **C.** A Dockerfile and a kubernetes.yaml manifest file placed in the project root directory.
- **D.** A skaffold.yaml configuration file and a cloudcode.kubernetes launch configuration in launch.json. — _correct answer_

## Question 110

**Domain:** Deploying applications

**Question:** Your company operates a large GKE cluster with thousands of Pods that consume configuration data from ConfigMaps. You notice increased latency in API server responses during peak hours. You need to reduce the load on kube-apiserver while ensuring configuration stability for your applications. What should you do?

**Correct answer:** D. Mark the ConfigMaps as immutable by setting the immutable field to true in the ConfigMap specifications.

**Options:**

- **A.** Convert all ConfigMaps to environment variables instead of volume mounts to reduce the number of file watches in the cluster.
- **B.** Increase the number of kube-apiserver replicas to handle the additional watch requests from Pods consuming ConfigMaps.
- **C.** Configure a caching proxy in front of the kube-apiserver to cache ConfigMap responses and reduce direct API calls.
- **D.** Mark the ConfigMaps as immutable by setting the immutable field to true in the ConfigMap specifications. — _correct answer_

## Question 111

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Build trigger for continuous deployment to Cloud Run. Your team wants to tag Docker images with the Git commit SHA to enable traceability between deployed images and source code versions. Which substitution variable should you use in your cloudbuild.yaml to accomplish this?

**Correct answer:** A. Use $COMMIT_SHA in your image tag, which Cloud Build automatically populates with the commit SHA when a build is triggered from a Git repository.

**Options:**

- **A.** Use $COMMIT_SHA in your image tag, which Cloud Build automatically populates with the commit SHA when a build is triggered from a Git repository. — _correct answer_
- **B.** Use $_GIT_SHA as a user-defined substitution variable that you must manually configure in each build trigger.
- **C.** Use $BUILD_ID in your image tag, which represents the unique identifier of the build and maps directly to the Git commit.
- **D.** Use $REVISION_ID only when building from Cloud Source Repositories, and create a separate workflow for GitHub repositories that extracts the commit SHA.

## Question 112

**Domain:** Building and testing applications

**Question:** Your team uses Cloud Build to run automated integration tests against a deployed Cloud Run service. Sometimes the tests start before the service is fully healthy and ready to accept traffic, causing false failures. You need to configure the Cloud Build pipeline to validate that the deployment is healthy before running tests while minimizing pipeline complexity. What should you do?

**Correct answer:** B. Add a build step after deployment that uses the gcloud run services describe command in a script with a retry loop to check the service status before proceeding to the test step.

**Options:**

- **A.** Set waitFor: ['-'] on the test step to make it start immediately and rely on Cloud Build's automatic retry mechanism to handle transient deployment readiness issues.
- **B.** Add a build step after deployment that uses the gcloud run services describe command in a script with a retry loop to check the service status before proceeding to the test step. — _correct answer_
- **C.** Add a static sleep command of 300 seconds between the deployment step and test step using a bash script to provide sufficient time for the deployment to be healthy.
- **D.** Configure the test step with allowExitCodes: [1] so that if tests fail due to service unavailability, the step is marked as successful and the build can proceed without issues.

## Question 113

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your security team requires that secret versions cannot be permanently destroyed without a recovery period to protect against accidental deletion. You need to configure Secret Manager to allow recovery of secret versions for at least 7 days after a destroy request. What should you do?

**Correct answer:** A. Enable the delay secret version destroy feature on the secret and set the destruction delay duration to 7 days or more.

**Options:**

- **A.** Enable the delay secret version destroy feature on the secret and set the destruction delay duration to 7 days or more. — _correct answer_
- **B.** Set an expiration time of 7 days on all secret versions to prevent them from being destroyed before the expiration period ends.
- **C.** Disable secret versions before destroying them, and create a Cloud Scheduler job to permanently destroy disabled versions after 7 days.
- **D.** Configure a Pub/Sub notification for SECRET_VERSION_DESTROYED events and create a Cloud Run function that restores the secret from a backup within 7 days.

## Question 114

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an IoT analytics platform that stores sensor readings from thousands of industrial machines. Each reading includes a machine identifier and timestamp. Your application needs to efficiently query readings for a specific machine within a time range, and also retrieve the most recent readings first. You want to design your Cloud Bigtable row key to optimize for these access patterns while preventing hotspots. What row key design should you use?

**Correct answer:** A. Use a row key format of machine_id#reverse_timestamp, where the reverse timestamp is calculated as Long.MAX_VALUE minus the actual timestamp.

**Options:**

- **A.** Use a row key format of machine_id#reverse_timestamp, where the reverse timestamp is calculated as Long.MAX_VALUE minus the actual timestamp. — _correct answer_
- **B.** Use a random UUID as the row key prefix followed by machine_id and timestamp to maximize write distribution.
- **C.** Use a row key format of timestamp#machine_id to enable range scans across all machines for a given time period.
- **D.** Use a row key format of reverse_timestamp#machine_id to retrieve the most recent readings first across all machines.

## Question 115

**Domain:** Deploying applications

**Question:** You are configuring a cloudbuild.yaml file to build a Docker image and deploy it to Cloud Run. You want to tag each container image with the Git commit SHA to enable traceability between deployments and source code. You also need the configuration to work across different projects without modification. Which cloudbuild.yaml configuration should you use?

**Correct answer:** D. steps: - name: 'gcr.io/cloud-builders/docker' args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA', '.'] - name: 'gcr.io/cloud-builders/docker' args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA'] - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk' entrypoint: gcloud args: ['run', 'deploy', 'my-service', '--image', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA', '--region', 'us-central1'] images: ['us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA']

**Options:**

- **A.** steps: - name: 'gcr.io/cloud-builders/docker' args: ['build', '-t', 'us-central1-docker.pkg.dev/my-project/my-repo/my-app:latest', '.'] - name: 'gcr.io/cloud-builders/docker' args: ['push', 'us-central1-docker.pkg.dev/my-project/my-repo/my-app:latest'] - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk' entrypoint: gcloud args: ['run', 'deploy', 'my-service', '--image', 'us-central1-docker.pkg.dev/my-project/my-repo/my-app:latest', '--region', 'us-central1'] images: ['us-central1-docker.pkg.dev/my-project/my-repo/my-app:latest']
- **B.** steps: - name: 'gcr.io/cloud-builders/docker' args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$BUILD_ID', '.'] - name: 'gcr.io/cloud-builders/docker' args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$BUILD_ID'] - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk' entrypoint: gcloud args: ['run', 'deploy', 'my-service', '--image', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$BUILD_ID', '--region', 'us-central1'] images: ['us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$BUILD_ID']
- **C.** steps: - name: 'gcr.io/cloud-builders/docker' args: ['build', '-t', 'us-central1-docker.pkg.dev/${GCP_PROJECT}/my-repo/my-app:${GIT_SHA}', '.'] - name: 'gcr.io/cloud-builders/docker' args: ['push', 'us-central1-docker.pkg.dev/${GCP_PROJECT}/my-repo/my-app:${GIT_SHA}'] - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk' entrypoint: gcloud args: ['run', 'deploy', 'my-service', '--image', 'us-central1-docker.pkg.dev/${GCP_PROJECT}/my-repo/my-app:${GIT_SHA}', '--region', 'us-central1'] images: ['us-central1-docker.pkg.dev/${GCP_PROJECT}/my-repo/my-app:${GIT_SHA}']
- **D.** steps: - name: 'gcr.io/cloud-builders/docker' args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA', '.'] - name: 'gcr.io/cloud-builders/docker' args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA'] - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk' entrypoint: gcloud args: ['run', 'deploy', 'my-service', '--image', 'us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA', '--region', 'us-central1'] images: ['us-central1-docker.pkg.dev/$PROJECT_ID/my-repo/my-app:$COMMIT_SHA'] — _correct answer_

## Question 116

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is implementing VPC Service Controls to protect sensitive data stored in BigQuery and Cloud Storage. The security team wants to test the perimeter configuration without disrupting existing workloads. After testing is complete, they need to analyze any violations that would have occurred before enforcing the perimeter. What should you do?

**Correct answer:** B. Create a service perimeter in dry run mode with the projects and restricted services. Monitor Cloud Audit Logs for VPC Service Controls violation entries. After validating the configuration, switch the perimeter to enforced mode.

**Options:**

- **A.** Create an enforced service perimeter with only the most critical services. Use Cloud Monitoring alerts to detect application errors. Add additional services gradually based on error patterns.
- **B.** Create a service perimeter in dry run mode with the projects and restricted services. Monitor Cloud Audit Logs for VPC Service Controls violation entries. After validating the configuration, switch the perimeter to enforced mode. — _correct answer_
- **C.** Create an enforced service perimeter with all services restricted. Add broad access levels to temporarily allow all traffic. Gradually remove access levels while monitoring for application failures.
- **D.** Create a service perimeter in enforced mode in a staging environment with production data replicated. Test all workloads in staging before creating the perimeter in production.

## Question 117

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a user session management system for a web application deployed on GKE. Sessions must persist across application restarts and should be available with sub-millisecond latency. The application cannot tolerate full cache data loss during infrastructure failures. You need to select the appropriate Memorystore for Redis configuration. What should you do?

**Correct answer:** C. Deploy a Standard Tier Memorystore for Redis instance with read replicas enabled. Configure your application to implement retry logic with exponential backoff for connection handling.

**Options:**

- **A.** Deploy a Basic Tier Memorystore for Redis instance with RDB snapshots enabled. Configure the application to restore from snapshots when the instance restarts.
- **B.** Deploy multiple Basic Tier Memorystore for Redis instances and implement client-side sharding using a Redis proxy like Twemproxy to distribute session data.
- **C.** Deploy a Standard Tier Memorystore for Redis instance with read replicas enabled. Configure your application to implement retry logic with exponential backoff for connection handling. — _correct answer_
- **D.** Deploy a Standard Tier Memorystore for Redis instance and configure your GKE pods to use local in-memory caching as a fallback when Redis is unavailable.

## Question 118

**Domain:** Integrating applications with Google Cloud services

**Question:** You are deploying a containerized application to GKE that requires connectivity to a Cloud SQL for MySQL instance. The application handles sensitive customer data, and your security team requires that database connections be encrypted and authenticated using IAM. You need to implement the recommended approach for connecting your GKE workloads to Cloud SQL. What should you do?

**Correct answer:** B. Run the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application, configure Workload Identity for the Kubernetes service account, and connect to the proxy via localhost.

**Options:**

- **A.** Install the Cloud SQL Proxy Operator in your cluster and create a shared proxy deployment that all applications in the namespace connect to via a service endpoint.
- **B.** Run the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application, configure Workload Identity for the Kubernetes service account, and connect to the proxy via localhost. — _correct answer_
- **C.** Configure authorized networks on the Cloud SQL instance to allow connections from your GKE cluster's IP range, and connect directly to the Cloud SQL private IP address.
- **D.** Deploy the Cloud SQL Auth Proxy as a separate Kubernetes Deployment with a ClusterIP Service, and configure all application pods to connect to the proxy service endpoint.

## Question 119

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company runs a multi-threaded API on Cloud Run that processes compute-intensive data transformations. Users report inconsistent response times during traffic spikes, especially when new instances are created. The application uses 4 vCPUs per instance due to high memory requirements. You notice that the autoscaler is not scaling quickly enough despite high per-request latency. You need to optimize the Cloud Run configuration for better responsiveness. What should you do?

**Correct answer:** C. Lower the maximum concurrency setting to force Cloud Run to scale based on request throughput rather than average CPU utilization across all vCPUs.

**Options:**

- **A.** Enable manual scaling and set a fixed number of instances that can handle peak traffic load throughout the day.
- **B.** Increase the maximum instances limit to allow the autoscaler to create more instances when CPU utilization thresholds are met.
- **C.** Lower the maximum concurrency setting to force Cloud Run to scale based on request throughput rather than average CPU utilization across all vCPUs. — _correct answer_
- **D.** Increase the request timeout setting to allow more time for requests to complete during traffic spikes when instances are under heavy load.

## Question 120

**Domain:** Deploying applications

**Question:** You have a Cloud Run service that connects to resources in your VPC network using a Serverless VPC Access connector. The service needs to access external APIs on the internet, but your security team requires all egress traffic to be routed through a Cloud NAT gateway configured in your VPC for logging and inspection. How should you configure the Cloud Run service to meet this requirement?

**Correct answer:** A. Configure the VPC egress setting to 'Route all traffic to the VPC' so all outbound traffic goes through the VPC connector.

**Options:**

- **A.** Configure the VPC egress setting to 'Route all traffic to the VPC' so all outbound traffic goes through the VPC connector. — _correct answer_
- **B.** Create a separate VPC connector for internet-bound traffic and configure it with a public IP address.
- **C.** Enable Cloud NAT directly on the Cloud Run service without using a VPC connector.
- **D.** Configure the VPC egress setting to 'Route only requests to private IPs to the VPC' and add a custom route for external traffic.

## Question 121

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company's security team requires that BigQuery datasets in a production project be accessible only from corporate office IP ranges and specific service accounts used by your data pipeline. You need to configure VPC Service Controls to implement this context-aware access policy. What should you do?

**Correct answer:** B. Create an access level in Access Context Manager with the corporate IP CIDR ranges. Configure an ingress rule specifying the service account identities and attach both to the service perimeter.

**Options:**

- **A.** Configure VPC Service Controls with an egress rule specifying the corporate IP ranges and service account identities to allow data access from the BigQuery datasets.
- **B.** Create an access level in Access Context Manager with the corporate IP CIDR ranges. Configure an ingress rule specifying the service account identities and attach both to the service perimeter. — _correct answer_
- **C.** Create a perimeter bridge between the production project and a separate project containing the approved service accounts and configure the bridge with IP-based restrictions.
- **D.** Create a VPC Network firewall rule to allow traffic from corporate IP ranges. Add the service accounts to an IAM policy with BigQuery Data Viewer role on the dataset.

## Question 122

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying a web application on Cloud Run and wants to use Identity-Aware Proxy (IAP) to authenticate users. The application runs in a single region and must prevent any access that bypasses IAP authentication. What is the recommended approach?

**Correct answer:** D. Enable IAP directly on the Cloud Run service using the --iap flag and grant the IAP service agent the Cloud Run Invoker role to authenticate to the Cloud Run service.

**Options:**

- **A.** Enable IAP on the Cloud Run service and also enable IAP on the load balancer backend service to provide dual-layer authentication and maximum security protection.
- **B.** Configure an external HTTPS load balancer with Cloud Run as a backend, enable IAP on the backend service, and disable the default run.app URL for the Cloud Run service.
- **C.** Configure Cloud Run to require authentication with Cloud IAM, grant the allUsers principal the Cloud Run Invoker role, and rely on IAP to filter unauthorized users.
- **D.** Enable IAP directly on the Cloud Run service using the --iap flag and grant the IAP service agent the Cloud Run Invoker role to authenticate to the Cloud Run service. — _correct answer_

## Question 123

**Domain:** Building and testing applications

**Question:** You are implementing a canary deployment strategy for a Cloud Run service. You deploy your first release using Cloud Deploy with a canary configuration specifying percentages of 10%, 50%, and 100%. However, you notice that the canary phase is skipped and the rollout proceeds directly to the stable phase at 100%. What is the most likely cause of this behavior?

**Correct answer:** B. This is the first deployment to the Cloud Run service, so there is no existing revision to split traffic with for the canary percentages.

**Options:**

- **A.** The automaticTrafficControl setting is set to false in the delivery pipeline's runtimeConfig section for Cloud Run.
- **B.** This is the first deployment to the Cloud Run service, so there is no existing revision to split traffic with for the canary percentages. — _correct answer_
- **C.** The Cloud Run service definition includes a traffic stanza that conflicts with Cloud Deploy's automatic traffic management.
- **D.** The canary percentages configuration in the delivery pipeline is invalid because it doesn't include an explicit 0% starting phase.

## Question 124

**Domain:** Deploying applications

**Question:** You are deploying a containerized application to GKE that processes financial transactions. During testing, you notice that logs appear with incorrect severity levels in Cloud Logging. You want logs written to standard output to include appropriate severity levels and be searchable by custom fields without modifying your logging library. What should you do?

**Correct answer:** D. Update your application to output logs as single-line JSON objects with a severity field, and ensure all JSON logs are written to standard output.

**Options:**

- **A.** Create a Cloud Logging sink to export all logs to BigQuery, and use BigQuery queries to assign severity levels based on log content patterns.
- **B.** Install the Cloud Logging client library and configure it to directly send logs to Cloud Logging using the Logging API with appropriate severity levels.
- **C.** Configure the GKE logging agent to parse severity from your plain-text log messages by editing the Fluentbit DaemonSet configuration.
- **D.** Update your application to output logs as single-line JSON objects with a severity field, and ensure all JSON logs are written to standard output. — _correct answer_

## Question 125

**Domain:** Building and testing applications

**Question:** You are developing a CI/CD pipeline using Cloud Build for a microservices application. Your pipeline requires integration tests to run against a test database that is provisioned in a previous build step. The integration tests must only start after the database is fully ready. How should you configure your cloudbuild.yaml file to ensure proper sequencing of these build steps?

**Correct answer:** C. Add an id field to the database provisioning step and reference that id in the waitFor field of the integration test step.

**Options:**

- **A.** Remove all waitFor fields from the build configuration to allow Cloud Build to automatically detect step dependencies.
- **B.** Configure the integration test step with timeout: 300s to allow sufficient time for the database to become available.
- **C.** Add an id field to the database provisioning step and reference that id in the waitFor field of the integration test step. — _correct answer_
- **D.** Add waitFor: ['-'] to both the database provisioning step and the integration test step to run them concurrently.

## Question 126

**Domain:** Building and testing applications

**Question:** Your team is building a Go application using Cloud Build. The application's production container image currently includes the Go SDK, build tools, and intermediate compilation artifacts, resulting in a 1.2 GB image. You need to reduce the container image size while maintaining build reproducibility. What should you do?

**Correct answer:** A. Use a multi-stage Dockerfile that compiles the Go binary in a builder stage and copies only the compiled binary to a minimal runtime image like scratch or distroless in the final stage.

**Options:**

- **A.** Use a multi-stage Dockerfile that compiles the Go binary in a builder stage and copies only the compiled binary to a minimal runtime image like scratch or distroless in the final stage. — _correct answer_
- **B.** Configure Cloud Build to use a higher machine type with more vCPUs to compress the image more efficiently during the build process.
- **C.** Create a .gcloudignore file to exclude the Go SDK and build tools from being uploaded to Cloud Build, then build the image using a standard single-stage Dockerfile.
- **D.** Modify the cloudbuild.yaml to add a final step that runs 'docker image prune' to remove unused layers and intermediate build artifacts from the container image.

## Question 127

**Domain:** Building and testing applications

**Question:** You are deploying a new version of your Cloud Run service to production. Before allowing production traffic to reach the new revision, you want to test it using its unique URL while the existing revision continues to serve all user traffic. What should you do?

**Correct answer:** B. Deploy the new revision using gcloud run deploy with the --no-traffic and --tag flags to create a tagged revision accessible via a unique URL while the existing revision serves 100% of traffic.

**Options:**

- **A.** Deploy two separate Cloud Run services with different names, one for production and one for testing, then use Cloud Load Balancing to switch between them when testing is complete.
- **B.** Deploy the new revision using gcloud run deploy with the --no-traffic and --tag flags to create a tagged revision accessible via a unique URL while the existing revision serves 100% of traffic. — _correct answer_
- **C.** Delete the existing revision first, then deploy the new revision to ensure only one revision exists at a time for cleaner testing.
- **D.** Deploy the new revision and immediately update traffic to split 50-50 between the old and new revisions to test with live traffic.

## Question 128

**Domain:** Building and testing applications

**Question:** You are developing an application locally that uses Cloud Client Libraries to access Cloud Storage. Your application works correctly on your colleague's workstation but fails with authentication errors on yours. Both workstations use the same codebase with no explicit credential configuration in the application. You have already signed in to the gcloud CLI using 'gcloud auth login' with your user account. What should you do to resolve the authentication error?

**Correct answer:** A. Run 'gcloud auth application-default login' to create a local ADC credentials file for the Cloud Client Libraries.

**Options:**

- **A.** Run 'gcloud auth application-default login' to create a local ADC credentials file for the Cloud Client Libraries. — _correct answer_
- **B.** Reinstall the Google Cloud CLI and re-run 'gcloud auth login' to refresh your gcloud authentication session.
- **C.** Export your gcloud credentials by running 'gcloud auth print-access-token' and pass the token as a parameter to the Cloud Storage client constructor.
- **D.** Set the GOOGLE_CLOUD_PROJECT environment variable to your project ID before running the application.

## Question 129

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for a financial application that needs to store transaction records with the following query requirements: retrieve all transactions for a specific account, and most frequently retrieve the most recent transactions first. The table receives millions of writes per day. Which row key design best supports these requirements while avoiding hotspots?

**Correct answer:** B. Use 'account_id#reverse_timestamp' as the row key, where reverse_timestamp is calculated as (Long.MAX_VALUE - timestamp), so the most recent transactions appear first in range scans.

**Options:**

- **A.** Use 'account_id' alone as the row key and store transaction timestamps in column qualifiers to retrieve multiple transactions in a single row read.
- **B.** Use 'account_id#reverse_timestamp' as the row key, where reverse_timestamp is calculated as (Long.MAX_VALUE - timestamp), so the most recent transactions appear first in range scans. — _correct answer_
- **C.** Use a hash of 'account_id#timestamp' as the row key to ensure even distribution of writes across all tablets in the cluster.
- **D.** Use 'timestamp#account_id' as the row key to enable time-range queries and let Bigtable automatically sort transactions chronologically.

## Question 130

**Domain:** Integrating applications with Google Cloud services

**Question:** You have configured an alerting policy in Cloud Monitoring for your GKE containers that triggers when CPU utilization exceeds 80%. You need to ensure that your operations team receives notifications through multiple channels for redundancy. According to Google Cloud best practices, which combination of notification channels should you configure?

**Correct answer:** A. Configure Pub/Sub as one notification channel and email as another notification channel. Create subscriptions to process Pub/Sub messages for automated incident response.

**Options:**

- **A.** Configure Pub/Sub as one notification channel and email as another notification channel. Create subscriptions to process Pub/Sub messages for automated incident response. — _correct answer_
- **B.** Configure Slack and Webhooks as notification channels since both are widely used and integrate with incident management tools.
- **C.** Configure multiple email notification channels to different email addresses within the same email distribution list for maximum coverage.
- **D.** Configure only a Webhook notification channel pointing to your internal incident management system to centralize all alerts.

## Question 131

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application backend running on Cloud Run needs to generate reports by reading a large number of documents from Cloud Firestore without modifying any data. The reports must reflect a consistent point-in-time snapshot of the data. You want to optimize for performance and avoid impacting concurrent write operations. What approach should you use?

**Correct answer:** D. Use a read-only transaction to read all required documents, ensuring a consistent snapshot without acquiring locks that block writers.

**Options:**

- **A.** Use a batched write with only get operations to read documents atomically from the database.
- **B.** Use a read-write transaction to read all required documents to ensure the strongest consistency guarantees for the report.
- **C.** Execute multiple individual document reads in parallel using the Firestore client library without any transaction.
- **D.** Use a read-only transaction to read all required documents, ensuring a consistent snapshot without acquiring locks that block writers. — _correct answer_

## Question 132

**Domain:** Building and testing applications

**Question:** You have configured a traffic split on your Cloud Run service with revision-v1 at 70% and revision-v2 at 30%. You now deploy a new revision without specifying any traffic flags. What happens to the traffic distribution?

**Correct answer:** B. The traffic split pattern is preserved, and the new revision receives 0% traffic because you previously configured manual traffic splitting.

**Options:**

- **A.** Cloud Run automatically routes 100% of traffic to the new revision, overriding the existing traffic split configuration.
- **B.** The traffic split pattern is preserved, and the new revision receives 0% traffic because you previously configured manual traffic splitting. — _correct answer_
- **C.** The deployment fails because you cannot deploy a new revision while a traffic split is active on the service.
- **D.** The new revision replaces revision-v2 in the traffic split and automatically receives 30% of traffic.

## Question 133

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a task handler for Cloud Tasks that processes payment transactions. Cloud Tasks provides at-least-once delivery, which means duplicate executions can occur. You need to ensure that payments are not processed multiple times. What should you do?

**Correct answer:** B. Design your handler to be idempotent by using a unique transaction identifier to check if the payment was already processed before executing it.

**Options:**

- **A.** Configure the queue to use synchronous dispatch mode, which waits for handler acknowledgment before marking complete.
- **B.** Design your handler to be idempotent by using a unique transaction identifier to check if the payment was already processed before executing it. — _correct answer_
- **C.** Enable exactly-once delivery mode on the Cloud Tasks queue to guarantee single execution.
- **D.** Set max_attempts to 1 in the queue retry configuration to prevent any retries from occurring.

## Question 134

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team manages an e-commerce application that uses Cloud SQL for PostgreSQL as its primary database. The application experiences heavy read traffic from analytics dashboards that are impacting the performance of transactional operations. You need to offload the analytics workload without modifying the existing application architecture significantly. What should you do?

**Correct answer:** A. Create a Cloud SQL read replica in the same region, and configure the analytics dashboards to connect to the read replica's connection endpoint for all read queries.

**Options:**

- **A.** Create a Cloud SQL read replica in the same region, and configure the analytics dashboards to connect to the read replica's connection endpoint for all read queries. — _correct answer_
- **B.** Increase the CPU and memory of the primary Cloud SQL instance to handle both transactional and analytics workloads on the same database.
- **C.** Export the data to BigQuery on a schedule using a Cloud Function, and have the analytics dashboards query BigQuery instead of Cloud SQL.
- **D.** Enable Cloud SQL Insights on the primary instance to identify and optimize slow queries affecting transactional operations instead of creating separate infrastructure.

## Question 135

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are managing secrets for a multi-tier application where different microservices need varying levels of access to Secret Manager. The payment service requires read access to payment gateway credentials. The admin service requires the ability to create new secrets and manage versions. The monitoring service only needs to verify that secrets exist without reading their values. Which IAM roles should you assign following the principle of least privilege?

**Correct answer:** B. Payment service: roles/secretmanager.secretAccessor; Admin service: roles/secretmanager.admin; Monitoring service: roles/secretmanager.viewer

**Options:**

- **A.** Payment service: roles/secretmanager.secretVersionManager; Admin service: roles/secretmanager.admin; Monitoring service: roles/secretmanager.secretAccessor
- **B.** Payment service: roles/secretmanager.secretAccessor; Admin service: roles/secretmanager.admin; Monitoring service: roles/secretmanager.viewer — _correct answer_
- **C.** Payment service: roles/viewer; Admin service: roles/editor; Monitoring service: roles/viewer
- **D.** Payment service: roles/secretmanager.admin; Admin service: roles/secretmanager.admin; Monitoring service: roles/secretmanager.admin

## Question 136

**Domain:** Building and testing applications

**Question:** Your organization uses Cloud Build to run automated tests before deploying containers to GKE. You need to ensure that only images built by Cloud Build can be deployed to production clusters. How should you configure deployment validation?

**Correct answer:** D. Enable Binary Authorization and configure a policy requiring attestations from the built-by-cloud-build attestor before allowing image deployment.

**Options:**

- **A.** Configure Cloud Build to push images only to a private Artifact Registry and restrict GKE to pull images only from that registry.
- **B.** Configure Cloud Build to add a custom label to all container images and create a GKE admission controller that checks for this label during deployment.
- **C.** Enable Artifact Analysis vulnerability scanning and configure GKE to reject images with critical vulnerabilities.
- **D.** Enable Binary Authorization and configure a policy requiring attestations from the built-by-cloud-build attestor before allowing image deployment. — _correct answer_

## Question 137

**Domain:** Building and testing applications

**Question:** You are configuring a CI/CD pipeline using Cloud Build that needs to authenticate to Google Cloud services during the build process. The build runs on Google Cloud infrastructure. You want to follow Google-recommended security practices for authentication. What should you do?

**Correct answer:** A. Configure Cloud Build to use an attached service account and grant that service account the required IAM roles with least privilege.

**Options:**

- **A.** Configure Cloud Build to use an attached service account and grant that service account the required IAM roles with least privilege. — _correct answer_
- **B.** Run 'gcloud auth application-default login' as the first step in the build to create ADC credentials from user authentication.
- **C.** Store the service account key JSON file in the source repository and configure GOOGLE_APPLICATION_CREDENTIALS to reference it during builds.
- **D.** Create a service account key, store it in Secret Manager, and set GOOGLE_APPLICATION_CREDENTIALS to the secret path during the build.

## Question 138

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Run application is generating high log volumes resulting in significant Cloud Logging costs. After analysis, you determine that most DEBUG and INFO severity log entries provide little value for production troubleshooting but may be needed for future debugging. You want to reduce costs while preserving the ability to access these logs when needed. What should you do?

**Correct answer:** A. Add an exclusion filter to the _Default sink to exclude DEBUG and INFO logs. Create a separate sink to route these excluded logs to a Cloud Storage bucket for long-term archival.

**Options:**

- **A.** Add an exclusion filter to the _Default sink to exclude DEBUG and INFO logs. Create a separate sink to route these excluded logs to a Cloud Storage bucket for long-term archival. — _correct answer_
- **B.** Configure a retention policy on the _Default log bucket to delete DEBUG and INFO logs after 1 day while retaining higher severity logs for longer.
- **C.** Modify your application code to reduce the logging level in production and only emit WARNING and higher severity logs to reduce volume at the source.
- **D.** Create counter log-based metrics for DEBUG and INFO logs to track their occurrence, then delete these log entries from the _Default bucket after metrics are recorded.

## Question 139

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Memorystore for Redis with the default eviction policy to cache data from a primary database. Users report that some cached data is not being evicted even when the instance approaches memory limits, while other data expires correctly. You need to ensure consistent eviction behavior when memory pressure occurs. What is the most likely cause and solution?

**Correct answer:** A. Some cached keys do not have TTL values set. Change your application code to set TTL expirations using the EXPIRE command on all keys, or change the eviction policy to allkeys-lru.

**Options:**

- **A.** Some cached keys do not have TTL values set. Change your application code to set TTL expirations using the EXPIRE command on all keys, or change the eviction policy to allkeys-lru. — _correct answer_
- **B.** The instance capacity is too small. Scale up the Memorystore instance to a higher capacity tier to accommodate all cached data without triggering eviction.
- **C.** Memory fragmentation is preventing key eviction. Enable activedefrag on the instance to consolidate memory and allow proper eviction to occur.
- **D.** The maxmemory-gb configuration is set too high. Lower the maxmemory-gb limit to 80% of instance capacity to provide overhead for eviction operations.

## Question 140

**Domain:** Building and testing applications

**Question:** You are optimizing your CI/CD pipeline using Cloud Build to reduce container image sizes for your production applications. Your current Dockerfile includes build tools and dependencies that are not needed at runtime. You want to implement a solution following Google-recommended best practices. What should you do?

**Correct answer:** A. Use multi-stage builds in your Dockerfile to separate the build environment from the runtime environment, copying only the compiled artifacts to a smaller final image.

**Options:**

- **A.** Use multi-stage builds in your Dockerfile to separate the build environment from the runtime environment, copying only the compiled artifacts to a smaller final image. — _correct answer_
- **B.** Configure Cloud Build to automatically strip unused dependencies from the final container image using the optimization flag.
- **C.** Create separate Cloud Build configuration files for build and runtime stages, storing intermediate artifacts in Cloud Storage between builds.
- **D.** Manually remove build dependencies using RUN commands at the end of your Dockerfile before the final layer.

## Question 141

**Domain:** Deploying applications

**Question:** You need to deploy a stateless application to GKE and want to follow Google Cloud recommended practices for managing Kubernetes objects. The application will be updated frequently as part of a CI/CD pipeline, and you need to track configuration changes over time. Which approach should you use to create and update the Deployment?

**Correct answer:** B. Use kubectl apply -f deployment.yaml to create and update the Deployment declaratively, storing the manifest file in version control to track changes over time.

**Options:**

- **A.** Use kubectl create -f deployment.yaml for initial creation, then kubectl edit deployment my-app to make changes directly in the cluster, as this provides the most flexibility for rapid iteration.
- **B.** Use kubectl apply -f deployment.yaml to create and update the Deployment declaratively, storing the manifest file in version control to track changes over time. — _correct answer_
- **C.** Use kubectl create deployment my-app --image=my-image:v1 to create the Deployment imperatively, then use kubectl set image for updates as this is the fastest approach for CI/CD pipelines.
- **D.** Use kubectl replace -f deployment.yaml to ensure the live object always matches the configuration file exactly, preventing any configuration drift from manual changes.

## Question 142

**Domain:** Building and testing applications

**Question:** Your Cloud Run service currently runs revision v1 serving 100% of traffic. You deployed a new revision tagged 'v2' with 0% traffic and tested it successfully. You want to perform a canary deployment by gradually increasing traffic to v2 over several days without redeploying. What command should you use to route 10% of traffic to the new revision?

**Correct answer:** C. gcloud run services update-traffic myservice --to-tags v2=10

**Options:**

- **A.** gcloud run services update-traffic myservice --to-revisions v2=10,v1=90
- **B.** gcloud run revisions update v2 --traffic-percent 10
- **C.** gcloud run services update-traffic myservice --to-tags v2=10 — _correct answer_
- **D.** gcloud run deploy myservice --image IMAGE_URL --tag v2 --traffic 10

## Question 143

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema to store e-commerce order data. Each order belongs to a customer and contains multiple items. Your application frequently queries all orders for a specific customer within a date range. The system handles millions of customers with varying order frequencies. What is the optimal row key design following Google Cloud best practices?

**Correct answer:** C. Use customer_id#order_date#order_id as the row key to keep each customer's orders in contiguous rows sorted by date, enabling efficient range scans.

**Options:**

- **A.** Create separate tables for each customer to isolate their order data and enable independent scaling.
- **B.** Store all items for an order in a single row using order_id as the row key, and create a separate index table for customer lookups.
- **C.** Use customer_id#order_date#order_id as the row key to keep each customer's orders in contiguous rows sorted by date, enabling efficient range scans. — _correct answer_
- **D.** Use order_date#customer_id#order_id as the row key to optimize for date-range queries across all customers.

## Question 144

**Domain:** Deploying applications

**Question:** You have deployed a Cloud Run service with a Serverless VPC Access connector to access a Memorystore for Redis instance. The application works correctly during testing but starts experiencing connection timeouts during peak traffic. Monitoring shows the VPC connector throughput is consistently at maximum capacity. What should you do to resolve this issue?

**Correct answer:** A. Change the VPC connector machine type from f1-micro to e2-standard-4 to increase throughput capacity.

**Options:**

- **A.** Change the VPC connector machine type from f1-micro to e2-standard-4 to increase throughput capacity. — _correct answer_
- **B.** Configure the Cloud Run service to use connection pooling at the application layer and keep the current connector.
- **C.** Create a second VPC connector and configure half of the Cloud Run revisions to use each connector.
- **D.** Decrease the minimum number of connector instances to allow the connector to scale more dynamically.

## Question 145

**Domain:** Building and testing applications

**Question:** You are debugging a locally running Cloud Run service using Cloud Code for VS Code. Your application makes calls to Google Cloud APIs during execution. When you attempt to run the debug session, you receive authentication errors for API calls. What should you do to resolve this issue?

**Correct answer:** D. Run 'gcloud auth application-default login' to create local Application Default Credentials, which Cloud Code will use to authenticate API calls during local debugging sessions.

**Options:**

- **A.** Configure Cloud Code to use the Cloud Run service's runtime identity by passing the --service-account flag in the debug configuration settings.
- **B.** Modify your application code to explicitly initialize credentials using a hardcoded API key for all Google Cloud service calls during local development.
- **C.** Create a new service account key JSON file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable in the Cloud Code launch configuration to point to this file.
- **D.** Run 'gcloud auth application-default login' to create local Application Default Credentials, which Cloud Code will use to authenticate API calls during local debugging sessions. — _correct answer_

## Question 146

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are troubleshooting a GKE application that fails to authenticate to Cloud Storage immediately after pod startup. The application uses Workload Identity Federation for GKE and reports 'metadata server unavailable' errors during the first few seconds. After about 10 seconds, authentication succeeds. You need to ensure reliable authentication during pod initialization while minimizing code changes. What should you do?

**Correct answer:** D. Deploy an initContainer in your pod specification that waits until the GKE metadata server is ready before the main container starts.

**Options:**

- **A.** Store a service account key as a Kubernetes Secret and mount it to the pod for immediate authentication without waiting for the metadata server.
- **B.** Configure the pod with hostNetwork: true to bypass the GKE metadata server and authenticate directly using the node identity.
- **C.** Disable Workload Identity Federation for GKE on the node pool and use the node service account instead for faster authentication.
- **D.** Deploy an initContainer in your pod specification that waits until the GKE metadata server is ready before the main container starts. — _correct answer_

## Question 147

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a Cloud Monitoring alerting policy for your GKE workload that monitors container memory utilization. You want the alerting policy to create an incident only when memory utilization exceeds 85% for a sustained period, avoiding alerts from brief spikes. What configuration should you apply?

**Correct answer:** D. Set the alignment period to aggregate memory utilization over a consistent time interval. Configure a retest window duration that requires the threshold to be exceeded for multiple consecutive evaluation periods.

**Options:**

- **A.** Set the condition combiner to 'All conditions are met' and create a second condition that checks if memory utilization has been above 85% for a minimum of 5 minutes.
- **B.** Configure the alerting policy with the Missing data option set to 'Missing data treated as values that violate the policy condition' to ensure all memory spikes are captured.
- **C.** Configure the Rolling window function to 'percent change' so that the alerting policy only triggers when memory utilization changes by more than 85% relative to the baseline.
- **D.** Set the alignment period to aggregate memory utilization over a consistent time interval. Configure a retest window duration that requires the threshold to be exceeded for multiple consecutive evaluation periods. — _correct answer_

## Question 148

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization runs containerized workloads across multiple GKE clusters in different projects. You want to centralize monitoring and create alerting policies that span all clusters from a single location. You need to configure the appropriate Cloud Monitoring setup. What should you do?

**Correct answer:** D. Configure a metrics scope in a central project and add all GKE cluster projects as monitored projects. Create alerting policies in the scoping project to monitor metrics across all added projects.

**Options:**

- **A.** Deploy the Ops Agent in each GKE cluster to forward all metrics to a central BigQuery dataset. Create scheduled queries in BigQuery to detect anomalies and send alerts via Pub/Sub.
- **B.** Export metrics from each GKE cluster project to Cloud Storage using the Monitoring API. Create a Cloud Function that reads the exported files and sends alerts using a custom notification service.
- **C.** Create identical alerting policies in each GKE cluster project and configure all policies to send notifications to the same central notification channels.
- **D.** Configure a metrics scope in a central project and add all GKE cluster projects as monitored projects. Create alerting policies in the scoping project to monitor metrics across all added projects. — _correct answer_

## Question 149

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application requires high read throughput from Memorystore for Redis and can tolerate some stale reads. The application currently uses a Standard Tier instance running Redis version 6. You need to scale the read capacity while maintaining high availability. What should you do?

**Correct answer:** B. Enable read replicas on the Standard Tier instance and configure your application to use the read endpoint for read queries.

**Options:**

- **A.** Increase the instance capacity tier to leverage Redis 6 multi-threaded I/O for higher throughput.
- **B.** Enable read replicas on the Standard Tier instance and configure your application to use the read endpoint for read queries. — _correct answer_
- **C.** Create multiple Basic Tier instances and implement client-side sharding for read operations.
- **D.** Migrate to a Memorystore for Redis Cluster instance to automatically shard data across multiple nodes.

## Question 150

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization uses Shared VPC with a host project and multiple service projects. You need to implement VPC Service Controls to protect Cloud Storage buckets in all service projects. During testing, some applications in the service projects cannot access the protected buckets. What is the most likely cause of this issue?

**Correct answer:** A. The host project was not included in the same service perimeter as the service projects. With Shared VPC, the host project must be in the perimeter along with any service projects.

**Options:**

- **A.** The host project was not included in the same service perimeter as the service projects. With Shared VPC, the host project must be in the perimeter along with any service projects. — _correct answer_
- **B.** The VPC accessible services feature is enabled and Cloud Storage is not in the list of allowed services, preventing access from network endpoints inside the perimeter.
- **C.** The service accounts running the applications do not have the VPC Service Controls Admin role required to access resources within a protected perimeter.
- **D.** The Cloud Storage API is not supported by VPC Service Controls, causing the protection policy to fail when applied to Cloud Storage buckets.

## Question 151

**Domain:** Integrating applications with Google Cloud services

**Question:** You are managing a GKE cluster that generates a high volume of container logs. Your team wants to reduce Cloud Logging costs by excluding DEBUG and INFO severity logs from the _Default sink while still maintaining logs in case of debugging needs. What should you do?

**Correct answer:** A. Add an exclusion filter to the _Default sink that filters out logs with severity DEFAULT, DEBUG, INFO, and NOTICE. Create a separate sink to route these excluded logs to Cloud Storage for long-term archival.

**Options:**

- **A.** Add an exclusion filter to the _Default sink that filters out logs with severity DEFAULT, DEBUG, INFO, and NOTICE. Create a separate sink to route these excluded logs to Cloud Storage for long-term archival. — _correct answer_
- **B.** Create a user-defined counter log-based metric that counts DEBUG and INFO logs, then use that metric data to identify which containers produce the most logs.
- **C.** Configure the GKE cluster to use a custom Fluentd configuration that filters out low-severity logs before they are sent to Cloud Logging.
- **D.** Disable the _Default sink completely and create a new sink that only includes logs with severity WARNING or higher. Configure GKE to stop generating DEBUG logs at the application level.

## Question 152

**Domain:** Deploying applications

**Question:** Your company runs a GKE cluster and wants to expose an internal API to other services within the same VPC network using HTTP/HTTPS routing. You need to create a load balancer that is accessible only within the VPC and not from the internet. What should you configure?

**Correct answer:** A. Create an Ingress resource with the annotation kubernetes.io/ingress.class: 'gce-internal' and ensure NEGs are used as backends for your Services.

**Options:**

- **A.** Create an Ingress resource with the annotation kubernetes.io/ingress.class: 'gce-internal' and ensure NEGs are used as backends for your Services. — _correct answer_
- **B.** Create an Ingress resource with the annotation kubernetes.io/ingress.class: 'gce' and add the annotation kubernetes.io/ingress.allow-http: 'false' to restrict external access.
- **C.** Create a Service of type LoadBalancer with the annotation networking.gke.io/load-balancer-type: 'Internal' and configure routing rules using Kubernetes Network Policies.
- **D.** Create an Ingress resource with the annotation networking.gke.io/internal-load-balancer: 'true' and configure Cloud Armor policies to block external traffic.

## Question 153

**Domain:** Deploying applications

**Question:** You need to deploy a Cloud Run service that accesses a TLS certificate stored in Secret Manager. The application expects to read the certificate from a file path at /etc/certs/tls.crt. What is the correct approach to configure this in Cloud Run?

**Correct answer:** C. Mount the secret as a volume with the mount path set to /etc/certs and the filename set to tls.crt.

**Options:**

- **A.** Store the certificate in Cloud Storage and mount the bucket as a volume at /etc/certs.
- **B.** Mount the secret as a volume at /proc/certs/tls.crt since this is a system certificate.
- **C.** Mount the secret as a volume with the mount path set to /etc/certs and the filename set to tls.crt. — _correct answer_
- **D.** Expose the secret as an environment variable named TLS_CERT and modify the application to read from the environment variable.

## Question 154

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing time-series data in Cloud Bigtable for a financial trading application. The data includes stock prices recorded every second for thousands of stock symbols. You frequently need to retrieve the most recent price data for a given stock. Your current row key is 'symbol#timestamp' where timestamp is in ascending order. You need to optimize for queries that retrieve the most recent data first. What should you do?

**Correct answer:** D. Modify the row key to use 'symbol#reverse_timestamp' where reverse_timestamp is calculated as MAX_TIMESTAMP minus the actual timestamp.

**Options:**

- **A.** Use a secondary index on the timestamp column to enable efficient queries for the most recent data.
- **B.** Enable the reverse scan feature in your read queries to scan rows in descending order by timestamp efficiently.
- **C.** Store the most recent data in a separate column family with higher read priority configuration to improve query performance.
- **D.** Modify the row key to use 'symbol#reverse_timestamp' where reverse_timestamp is calculated as MAX_TIMESTAMP minus the actual timestamp. — _correct answer_

## Question 155

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Cloud Run service that requires access to an API key stored in Secret Manager. Your development team needs a simple deployment process, and your security team wants to ensure that secrets are not exposed in container images or environment variable logs. You want to follow Google-recommended practices for integrating Secret Manager with Cloud Run. How should you provide the secret to your application?

**Correct answer:** D. Configure Cloud Run to mount the secret as a volume, and update your application code to read the API key from the mounted file path at runtime.

**Options:**

- **A.** Build the container image with the API key baked in as a build argument, then store the image in Artifact Registry with vulnerability scanning enabled.
- **B.** Configure the secret as an environment variable in Cloud Run using the Secret Manager integration, specifying the secret resource name.
- **C.** Create a startup script that calls the Secret Manager API using gcloud to fetch the secret and export it as an environment variable before the main application starts.
- **D.** Configure Cloud Run to mount the secret as a volume, and update your application code to read the API key from the mounted file path at runtime. — _correct answer_

## Question 156

**Domain:** Integrating applications with Google Cloud services

**Question:** You are optimizing your application that retrieves object metadata from Cloud Storage using the JSON API. Your application only needs the object name and size for display purposes, but API responses are returning full object metadata including ACLs and custom metadata. You want to reduce response payload size and improve performance. What should you do?

**Correct answer:** A. Add the fields query parameter to your requests specifying only the required properties, such as fields=items(name,size),nextPageToken for list operations.

**Options:**

- **A.** Add the fields query parameter to your requests specifying only the required properties, such as fields=items(name,size),nextPageToken for list operations. — _correct answer_
- **B.** Use the projection=noAcl parameter to exclude ACL data from the response, as this is the only way to limit response data in the JSON API.
- **C.** Download each object and parse its metadata locally using application code to extract only the name and size attributes.
- **D.** Create a Cloud Storage notification to Pub/Sub that extracts only the name and size when objects are created, and query the notification data instead of the API.

## Question 157

**Domain:** Deploying applications

**Question:** Your development team is building a microservices application on GKE. The application requires database connection strings that can change based on the environment (development, staging, production). The connection strings are not considered sensitive as they use internal VPC networking. You need to provide this configuration to your containerized application. What should you do?

**Correct answer:** D. Create a ConfigMap containing the connection strings and mount it as a volume in your Pod specification.

**Options:**

- **A.** Store the connection strings in a Cloud Storage bucket and use an init container to download the configuration at startup.
- **B.** Create a ConfigMap containing the connection strings and pass it using environment variables, then configure a sidecar to watch for changes.
- **C.** Create a Kubernetes Secret containing the connection strings and expose it as environment variables in your Pod specification.
- **D.** Create a ConfigMap containing the connection strings and mount it as a volume in your Pod specification. — _correct answer_

## Question 158

**Domain:** Building and testing applications

**Question:** You are developing a Python application locally that needs to access Cloud Storage. You have already authenticated to the gcloud CLI using your Google Account. When you run your application, it fails with an error indicating that Application Default Credentials cannot be found. What should you do to configure ADC for your local development environment?

**Correct answer:** B. Run gcloud auth application-default login to create a local ADC file with your user credentials.

**Options:**

- **A.** Export your gcloud CLI credentials to a JSON file and configure your application to read from that file directly.
- **B.** Run gcloud auth application-default login to create a local ADC file with your user credentials. — _correct answer_
- **C.** Set the GCLOUD_AUTH_CREDENTIALS environment variable to point to your gcloud configuration directory.
- **D.** Run gcloud auth login to re-authenticate your user account with the gcloud CLI.

## Question 159

**Domain:** Building and testing applications

**Question:** You are setting up a CI/CD pipeline in Cloud Build that needs to access resources in a different project. The pipeline needs to authenticate as a specific service account in the target project. The Cloud Build service account already has the Service Account Token Creator role on the target service account. How should you configure authentication in your Cloud Build steps?

**Correct answer:** B. Use the --impersonate-service-account flag with gcloud commands, or configure the Cloud Client Libraries to use impersonation with the target service account email.

**Options:**

- **A.** Export the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to the Cloud Build service account metadata endpoint.
- **B.** Use the --impersonate-service-account flag with gcloud commands, or configure the Cloud Client Libraries to use impersonation with the target service account email. — _correct answer_
- **C.** Create a service account key for the target service account and store it in Secret Manager. Download the key during the build and set GOOGLE_APPLICATION_CREDENTIALS.
- **D.** Grant the Cloud Build service account direct IAM roles in the target project instead of using impersonation.

## Question 160

**Domain:** Integrating applications with Google Cloud services

**Question:** Your development team is experiencing high Cloud Logging costs due to verbose DEBUG-level application logs from your GKE workloads. You want to stop ingesting DEBUG logs into Cloud Logging while preserving the ability to export all logs including DEBUG to BigQuery for occasional deep analysis. What should you do?

**Correct answer:** A. Add an exclusion filter to the _Default log sink to exclude DEBUG severity logs. Create a new log sink with no exclusion filters that routes all logs including DEBUG to a BigQuery dataset.

**Options:**

- **A.** Add an exclusion filter to the _Default log sink to exclude DEBUG severity logs. Create a new log sink with no exclusion filters that routes all logs including DEBUG to a BigQuery dataset. — _correct answer_
- **B.** Create a new log bucket with a shorter retention period for DEBUG logs only. Create a separate log sink to route DEBUG logs to this bucket instead of the _Default bucket.
- **C.** Modify your GKE application configuration to stop emitting DEBUG logs to STDOUT. Create a new log sink that routes all application logs including DEBUG to BigQuery.
- **D.** Delete all existing log sinks and create a single new sink that routes only ERROR and higher severity logs to both Cloud Logging and BigQuery to minimize costs across both services.

## Question 161

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an inventory management application using Cloud Firestore. The application needs to query products by both price range (greater than $50) and stock level range (less than 100 units) from a 'products' collection. When you run the query, you receive an error message with a link. What is the most likely cause of this error, and what should you do to resolve it?

**Correct answer:** B. You need to create a composite index with the price and stock fields because Firestore requires an index for every query with range or inequality filters on multiple fields.

**Options:**

- **A.** You need to restructure your data model to use subcollections because Firestore does not support multiple inequality filters in a single query.
- **B.** You need to create a composite index with the price and stock fields because Firestore requires an index for every query with range or inequality filters on multiple fields. — _correct answer_
- **C.** You need to enable the Firestore API's advanced query feature in the Google Cloud console because multiple inequality filters are disabled by default.
- **D.** You need to split the query into two separate queries and merge the results client-side because Firestore cannot process compound range queries efficiently.

## Question 162

**Domain:** Building and testing applications

**Question:** Your company uses Cloud Run with session affinity enabled for their web application. You are planning a canary deployment where you will split traffic between the current revision and a new revision. What should you consider about session affinity when implementing this traffic split?

**Correct answer:** A. Session affinity affects how traffic splitting works because returning users with existing session cookies may be directed to their original revision even after traffic percentages change.

**Options:**

- **A.** Session affinity affects how traffic splitting works because returning users with existing session cookies may be directed to their original revision even after traffic percentages change. — _correct answer_
- **B.** Session affinity only works when all traffic goes to a single revision, so you must disable session affinity before implementing traffic splitting.
- **C.** Traffic splitting overrides session affinity settings, ensuring requests are distributed according to configured percentages regardless of session cookies.
- **D.** Session affinity is automatically disabled when traffic splitting is configured, so no special considerations are needed.

## Question 163

**Domain:** Integrating applications with Google Cloud services

**Question:** You are setting up a disaster recovery strategy for your Cloud SQL for MySQL database. You want to create a read replica in a different region that can be promoted to a standalone primary instance if the primary region becomes unavailable. Before you can create the read replica, which prerequisites must be met on the primary instance?

**Correct answer:** A. Enable automated backups, enable binary logging by enabling point-in-time recovery, and ensure at least one backup has been created after binary logging was enabled.

**Options:**

- **A.** Enable automated backups, enable binary logging by enabling point-in-time recovery, and ensure at least one backup has been created after binary logging was enabled. — _correct answer_
- **B.** Upgrade the primary instance to Cloud SQL Enterprise Plus edition, as cross-region read replicas are only supported on Enterprise Plus instances.
- **C.** Configure the primary instance with a static IP address and add the read replica's IP range to the authorized networks before creating the replica.
- **D.** Enable high availability configuration on the primary instance to ensure it has a failover replica that can support replication to read replicas.

## Question 164

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application running on Cloud Run experiences connection spikes that occasionally exceed your Cloud SQL for PostgreSQL instance's connection limits. You are using Cloud SQL Enterprise Plus edition. You want to absorb sudden connection spikes without modifying your application code. What should you do?

**Correct answer:** C. Enable Managed Connection Pooling on the Cloud SQL instance with transaction pooling mode to absorb connection spikes by reusing server connections.

**Options:**

- **A.** Create multiple read replicas and distribute application connections across them using a load balancer.
- **B.** Scale up the Cloud SQL instance to a larger machine type with more memory to increase the max_connections limit.
- **C.** Enable Managed Connection Pooling on the Cloud SQL instance with transaction pooling mode to absorb connection spikes by reusing server connections. — _correct answer_
- **D.** Configure the Cloud SQL instance with session pooling mode and set max_pool_size to match the expected peak connections.

## Question 165

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application is making frequent Cloud Storage JSON API calls to list and retrieve objects. During peak usage, your application begins receiving HTTP 429 rateLimitExceeded errors. You need to implement a robust retry strategy following Google-recommended best practices. What should you do?

**Correct answer:** B. Implement exponential backoff with jitter, starting with a short initial delay and exponentially increasing wait times between retries up to a maximum backoff time.

**Options:**

- **A.** Immediately retry failed requests without any delay to maximize throughput and reduce latency for users.
- **B.** Implement exponential backoff with jitter, starting with a short initial delay and exponentially increasing wait times between retries up to a maximum backoff time. — _correct answer_
- **C.** Implement a fixed retry interval of 5 seconds between each retry attempt until the request succeeds or reaches a maximum retry count.
- **D.** Cache all object listings locally and only make API calls once per day to avoid hitting rate limits entirely.

## Question 166

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application using Firestore. Users need to see real-time updates when other users add, edit, or delete content. You want to implement efficient change tracking that only processes documents that have actually changed rather than receiving the entire result set each time. What should you do?

**Correct answer:** C. Use the docChanges() method on the query snapshot to iterate through document changes and check the change type (ADDED, MODIFIED, REMOVED) for each changed document.

**Options:**

- **A.** Implement a separate Cloud Function triggered by Firestore events that stores change logs in a separate collection for the client to read.
- **B.** Use the get() method with a timestamp filter to periodically poll the database and compare document versions between requests.
- **C.** Use the docChanges() method on the query snapshot to iterate through document changes and check the change type (ADDED, MODIFIED, REMOVED) for each changed document. — _correct answer_
- **D.** Store a lastModified timestamp field in each document and use a where clause to filter documents modified after the client's last known timestamp.

## Question 167

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an ecommerce application that stores product data in Cloud Firestore. Your application needs to query products by category and sort by price in descending order. When you run the query in your test environment, you receive an error indicating that no index exists for this query. What should you do to resolve this error?

**Correct answer:** D. Click the link provided in the error message to create the required composite index in the Firebase console, then wait for the index to finish building before retrying the query.

**Options:**

- **A.** Create single-field indexes for both the category and price fields manually in the Google Cloud console, then retry the query after both indexes are built.
- **B.** Add an index exemption for the price field to allow descending sort queries without creating a composite index.
- **C.** Restructure your data model to embed the category directly in the document ID so that filtering can be performed without requiring an index.
- **D.** Click the link provided in the error message to create the required composite index in the Firebase console, then wait for the index to finish building before retrying the query. — _correct answer_

## Question 168

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team operates a microservices application across multiple Google Cloud projects and needs to create log-based metrics that count errors across all services in a centralized manner. The logs from all projects are already being routed to a central log bucket using aggregated sinks. How should you configure the log-based metrics?

**Correct answer:** B. Create bucket-scoped log-based metrics in the project containing the central log bucket. Configure filters to match error logs from all source projects routed to the bucket.

**Options:**

- **A.** Create project-scoped log-based metrics in the central project with filters that specify the source projects using the logName field.
- **B.** Create bucket-scoped log-based metrics in the project containing the central log bucket. Configure filters to match error logs from all source projects routed to the bucket. — _correct answer_
- **C.** Create organization-level log-based metrics with filters matching error logs from all projects to get a unified view across the organization.
- **D.** Create project-scoped log-based metrics in each source project and aggregate the metrics in Cloud Monitoring using cross-project metrics scopes.

## Question 169

**Domain:** Deploying applications

**Question:** You are configuring a production Cloud Run service that uses database credentials stored in Secret Manager. You want to ensure that deployments are reproducible and can be rolled back if a bad secret version is published. According to Google-recommended best practices, how should you reference the secret in your Cloud Run configuration?

**Correct answer:** A. Reference the secret by its specific version number, such as 'my-secret:2', and update the version number through your CI/CD pipeline when rotating credentials.

**Options:**

- **A.** Reference the secret by its specific version number, such as 'my-secret:2', and update the version number through your CI/CD pipeline when rotating credentials. — _correct answer_
- **B.** Reference the secret using the 'latest' alias, such as 'my-secret:latest', so the application automatically uses the most recent secret version.
- **C.** Enable automatic secret rotation in Secret Manager and always use the 'latest' alias to ensure the application uses the most current credentials.
- **D.** Store the secret version number as an environment variable and have your application fetch the secret using the Secret Manager API at runtime.

## Question 170

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run service experiences slow response times during cold starts. You want to reduce startup latency while minimizing costs for a production API that receives consistent but moderate traffic throughout the day. What configuration should you apply?

**Correct answer:** D. Set minimum instances to 1 and enable startup CPU boost to keep instances warm and accelerate container initialization.

**Options:**

- **A.** Switch to manual scaling with 5 instances to eliminate autoscaling-related cold starts entirely.
- **B.** Configure maximum concurrency to 1000 and enable startup CPU boost to maximize throughput and reduce startup time.
- **C.** Set minimum instances to 10 and configure instance-based billing to ensure CPU is always available for rapid response.
- **D.** Set minimum instances to 1 and enable startup CPU boost to keep instances warm and accelerate container initialization. — _correct answer_
