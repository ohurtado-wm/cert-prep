# gcp-professional-cloud-developer-quiz-test #4

## Question 1

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your security team requires that a VPC Service Controls perimeter allows access to BigQuery datasets only from devices that meet specific security criteria, including approved operating systems and corporate management. Users must be able to access the data from their laptops over the internet. How should you configure this context-aware access?

**Correct answer:** D. Create an access level in Access Context Manager with device policy conditions specifying required operating systems and management status, then attach the access level to the service perimeter.

**Options:**

- **A.** Configure an ingress rule on the perimeter specifying the allowed device types and operating systems in the identityType attribute to enforce device-based restrictions.
- **B.** Enable Binary Authorization on the perimeter to validate device attestation before allowing access to the protected BigQuery datasets from user laptops.
- **C.** Configure the perimeter's VPC accessible services to include only BigQuery, then use Identity-Aware Proxy to enforce device security policies before granting access.
- **D.** Create an access level in Access Context Manager with device policy conditions specifying required operating systems and management status, then attach the access level to the service perimeter. — _correct answer_

## Question 2

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that needs to retrieve only the name and size of objects in a Cloud Storage bucket using the JSON API. The bucket contains thousands of large objects with extensive metadata. You want to minimize response payload size and improve performance. What should you do?

**Correct answer:** A. Use the fields query parameter to specify items(name,size) to request a partial response containing only the required fields.

**Options:**

- **A.** Use the fields query parameter to specify items(name,size) to request a partial response containing only the required fields. — _correct answer_
- **B.** Configure the Content-Encoding header to gzip and enable compression at the client to reduce the size of full metadata responses.
- **C.** Set the projection query parameter to noAcl to exclude ACL information and reduce the response size.
- **D.** Create a Cloud Function that queries the full metadata and extracts only name and size fields before returning results to your application.

## Question 3

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a web application with Firestore that needs to display data to users even when they have intermittent network connectivity. The application uses snapshot listeners to receive real-time updates. You need to notify users whether the displayed data came from the server or the local cache. What should you do?

**Correct answer:** C. Enable offline persistence with enablePersistence() and use the includeMetadataChanges option with your listener to check the snapshot.metadata.fromCache property.

**Options:**

- **A.** Store timestamps with each document and compare the local timestamp with server timestamp to determine data freshness.
- **B.** Create a network connectivity listener and assume data is from cache when the device is offline and from server when online.
- **C.** Enable offline persistence with enablePersistence() and use the includeMetadataChanges option with your listener to check the snapshot.metadata.fromCache property. — _correct answer_
- **D.** Use the getDocFromCache() method instead of snapshot listeners to explicitly request cached data and display appropriate indicators.

## Question 4

**Domain:** Building and testing applications

**Question:** You finished developing an application on your local workstation and created ADC credentials using 'gcloud auth application-default login'. The local ADC file contains your refresh token. Before sharing your workstation with another developer, you need to remove these credentials. What should you do?

**Correct answer:** A. Run 'gcloud auth application-default revoke' to revoke the local ADC credentials.

**Options:**

- **A.** Run 'gcloud auth application-default revoke' to revoke the local ADC credentials. — _correct answer_
- **B.** Delete the file at $HOME/.config/gcloud/credentials.db to remove all stored credentials.
- **C.** Run 'gcloud config unset auth/impersonate_service_account' to clear the impersonation settings and reset ADC.
- **D.** Run 'gcloud auth revoke' to revoke all credentials stored by gcloud CLI including ADC.

## Question 5

**Domain:** Building and testing applications

**Question:** You are implementing a canary deployment strategy for a Cloud Run service. After deploying a new revision with the '--no-traffic' flag and validating it using the tag URL, you want to gradually shift traffic from 5% to 100% over several days. You need to monitor the revision's health at each stage before proceeding. What should you do?

**Correct answer:** D. Use 'gcloud run services update-traffic' with '--to-tags' to incrementally increase the traffic percentage. Monitor Cloud Logging and Error Reporting between increments.

**Options:**

- **A.** Deploy the same image multiple times with different traffic percentages configured in the deployment command each time.
- **B.** Create a Cloud Deploy pipeline with canary strategy configuration to automatically manage traffic percentages and verification at each stage.
- **C.** Configure Cloud Monitoring alerts to automatically adjust traffic percentages based on error rate thresholds.
- **D.** Use 'gcloud run services update-traffic' with '--to-tags' to incrementally increase the traffic percentage. Monitor Cloud Logging and Error Reporting between increments. — _correct answer_

## Question 6

**Domain:** Deploying applications

**Question:** You have a GKE cluster in project-a that needs to pull container images from an Artifact Registry Docker repository in project-b. The GKE cluster uses the Compute Engine default service account for its nodes. You want to configure access following Google-recommended security practices. What should you do?

**Correct answer:** A. Grant the Artifact Registry Reader role on the Artifact Registry repository in project-b to the Compute Engine default service account from project-a.

**Options:**

- **A.** Grant the Artifact Registry Reader role on the Artifact Registry repository in project-b to the Compute Engine default service account from project-a. — _correct answer_
- **B.** Create a new service account in project-b with Artifact Registry Reader role, export its key, and configure imagePullSecrets in GKE with the key file.
- **C.** Enable cross-project access on the Artifact Registry repository and configure an imagePullSecret in the GKE namespace referencing the repository credentials.
- **D.** Grant the Storage Object Viewer role on project-b to the Compute Engine default service account from project-a.

## Question 7

**Domain:** Deploying applications

**Question:** You are operating a production application on GKE and want to be notified when containers experience excessive restarts, which might indicate application instability. You want to use Google Cloud's native tools to set up this monitoring. What should you do?

**Correct answer:** C. Create an alerting policy in Cloud Monitoring using the kubernetes.io/container/restart_count metric with a threshold condition.

**Options:**

- **A.** Install Prometheus on your GKE cluster and configure Alertmanager to monitor container restarts and send notifications.
- **B.** Configure kubectl to monitor pod events and write a custom script to send notifications when restart events occur.
- **C.** Create an alerting policy in Cloud Monitoring using the kubernetes.io/container/restart_count metric with a threshold condition. — _correct answer_
- **D.** Create a user-defined log-based metric that counts log entries containing the phrase 'container restarted' and configure an alert on this metric.

## Question 8

**Domain:** Integrating applications with Google Cloud services

**Question:** Your GKE cluster is experiencing intermittent performance issues. You want to enable additional observability metrics to monitor the health of Kubernetes objects such as Deployments, Nodes, and Pods, as well as container-level metrics from kubelet. Which metrics packages should you enable on your GKE cluster?

**Correct answer:** D. Enable both kube state metrics and cAdvisor/Kubelet metrics packages. Kube state metrics provide Kubernetes object health, while cAdvisor/Kubelet metrics provide container-level statistics.

**Options:**

- **A.** Install the Ops Agent on all GKE nodes to collect container and Kubernetes metrics. Configure the agent to send data to Cloud Monitoring.
- **B.** Enable only the control plane metrics package. This collects all metrics from the API server, scheduler, and controller manager, which includes Kubernetes object state.
- **C.** Enable only the system metrics package. All container and Kubernetes object metrics are included in system metrics by default without requiring additional configuration.
- **D.** Enable both kube state metrics and cAdvisor/Kubelet metrics packages. Kube state metrics provide Kubernetes object health, while cAdvisor/Kubelet metrics provide container-level statistics. — _correct answer_

## Question 9

**Domain:** Deploying applications

**Question:** You are troubleshooting a Pod in your GKE cluster that is repeatedly restarting with a CrashLoopBackOff status. You need to examine the logs from the container that crashed before the current instance started. What should you do?

**Correct answer:** B. Run 'kubectl logs POD_NAME --previous' to retrieve logs from the prior terminated container instance.

**Options:**

- **A.** Access the GKE node via SSH and examine /var/log/containers for the Pod's log files which persist across container restarts.
- **B.** Run 'kubectl logs POD_NAME --previous' to retrieve logs from the prior terminated container instance. — _correct answer_
- **C.** Query Cloud Logging using the resource type k8s_container with a filter for severity=ERROR to find all errors from the crashing container.
- **D.** Use kubectl exec to connect to the running container and examine the /var/log directory for application log files from previous runs.

## Question 10

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring alerting policies for your GKE cluster running critical production workloads. You need to ensure your team receives timely notifications when alerts fire, and you want to minimize the risk of missing alerts due to delivery system failures. Which notification channel configuration follows Google-recommended best practices?

**Correct answer:** B. Configure multiple notification channel types for the alerting policy, such as email and Pub/Sub, to provide redundancy if one delivery system experiences issues.

**Options:**

- **A.** Configure a webhook notification channel that forwards alerts to your ticketing system, which then sends emails to on-call engineers.
- **B.** Configure multiple notification channel types for the alerting policy, such as email and Pub/Sub, to provide redundancy if one delivery system experiences issues. — _correct answer_
- **C.** Configure a single Slack notification channel with retry settings enabled to ensure message delivery to your operations team.
- **D.** Configure SMS notifications as the primary channel since they have the highest delivery rate for urgent alerts.

## Question 11

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a web application running on Cloud Run that requires user authentication. You want to use Identity-Aware Proxy (IAP) to authenticate users from outside your organization who do not have Google Accounts. You also need to support multiple identity providers. What should you do?

**Correct answer:** B. Configure IAP to use external identities through Identity Platform, add the required identity providers in Identity Platform, and create an authentication app that handles the sign-in flow.

**Options:**

- **A.** Enable Workforce Identity Federation in your project, configure the external identity providers as workforce pools, and grant the IAP-secured Web App User role to the workforce pool principals.
- **B.** Configure IAP to use external identities through Identity Platform, add the required identity providers in Identity Platform, and create an authentication app that handles the sign-in flow. — _correct answer_
- **C.** Configure IAP with the Google-managed OAuth client and add each external user's email to a Google Group that has the IAP-secured Web App User role on your Cloud Run service.
- **D.** Create a custom OAuth client in your project, configure it as an 'External' user type, add the required identity providers to the OAuth consent screen, and enable IAP using this custom OAuth client.

## Question 12

**Domain:** Building and testing applications

**Question:** You recently completed testing a Google Cloud application on your local workstation and need to remove the Application Default Credentials from your system to prevent unauthorized access. The credentials were created using the gcloud auth application-default login command. What should you do?

**Correct answer:** C. Run 'gcloud auth application-default revoke' to remove the local ADC credentials.

**Options:**

- **A.** Run 'gcloud auth logout' to remove the local ADC file and revoke access tokens.
- **B.** Delete the GOOGLE_APPLICATION_CREDENTIALS environment variable from your shell configuration.
- **C.** Run 'gcloud auth application-default revoke' to remove the local ADC credentials. — _correct answer_
- **D.** Run 'gcloud auth revoke' to remove all credentials from the local system.

## Question 13

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses the Cloud Storage JSON API to manage objects across multiple buckets. You are approaching your project's quota limits and need to implement strategies to stay within rate limits while maintaining application functionality. Which approach should you implement?

**Correct answer:** B. Implement client-side rate limiting to throttle requests before they are sent, and use exponential backoff for any requests that receive 429 errors.

**Options:**

- **A.** Distribute requests randomly across multiple service accounts to bypass the per-project quota limits applied to Cloud Storage API calls.
- **B.** Implement client-side rate limiting to throttle requests before they are sent, and use exponential backoff for any requests that receive 429 errors. — _correct answer_
- **C.** Immediately retry all failed requests with the same parameters to overcome temporary rate limiting without any modifications to your request pattern.
- **D.** Switch from the JSON API to the XML API since it has different quota limits that may accommodate your application's request volume.

## Question 14

**Domain:** Deploying applications

**Question:** You need to configure automatic horizontal scaling for a Deployment in GKE that serves variable traffic loads. The application should scale based on CPU utilization, maintaining between 3 and 15 Pod replicas, with scaling triggered when average CPU exceeds 60%. Which kubectl command creates the correct HorizontalPodAutoscaler?

**Correct answer:** B. kubectl autoscale deployment my-app --cpu-percent=60 --min=3 --max=15

**Options:**

- **A.** kubectl scale deployment my-app --replicas=3 --max-replicas=15 --cpu-threshold=60
- **B.** kubectl autoscale deployment my-app --cpu-percent=60 --min=3 --max=15 — _correct answer_
- **C.** kubectl set autoscale deployment my-app --cpu=60% --min-pods=3 --max-pods=15
- **D.** kubectl autoscale deployment my-app --target-cpu=60 --replicas=3-15

## Question 15

**Domain:** Deploying applications

**Question:** Your development team uses Cloud Build to build container images that are stored in Artifact Registry and deployed to GKE. You want to ensure that Binary Authorization can verify that only images built by Cloud Build are deployed to your GKE cluster. You need to configure Cloud Build to automatically generate attestations for your built images. What should you do?

**Correct answer:** D. Use the images field in your Cloud Build configuration file to specify the container image to be pushed to Artifact Registry.

**Options:**

- **A.** Add an explicit docker push step in your Cloud Build configuration file to push the image to Artifact Registry after building it.
- **B.** Configure the Container Analysis API to scan images and generate attestations automatically when images are pushed to the repository.
- **C.** Create a Binary Authorization attestor manually and configure it to sign each image after Cloud Build completes the build process.
- **D.** Use the images field in your Cloud Build configuration file to specify the container image to be pushed to Artifact Registry. — _correct answer_

## Question 16

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building an e-commerce application that frequently queries product catalog data from Cloud SQL. The application experiences high read latency during peak traffic. You need to implement a caching strategy using Memorystore for Redis that minimizes cache staleness while avoiding unnecessary cache population with data that may never be accessed. What should you do?

**Correct answer:** C. Implement the cache-aside pattern where the application first checks the cache for data, reads from Cloud SQL on a cache miss, and then populates the cache with the retrieved data and a TTL.

**Options:**

- **A.** Configure Cloud SQL to automatically replicate all database changes to Memorystore for Redis using Change Data Capture triggers configured in Cloud Functions.
- **B.** Implement a write-through pattern exclusively where every database write immediately updates both Cloud SQL and Memorystore for Redis without any cache reads.
- **C.** Implement the cache-aside pattern where the application first checks the cache for data, reads from Cloud SQL on a cache miss, and then populates the cache with the retrieved data and a TTL. — _correct answer_
- **D.** Pre-populate the entire product catalog into Memorystore for Redis during application startup and configure the noeviction policy to ensure data persists.

## Question 17

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are running a Node.js application on Cloud Run that uses asynchronous background tasks to send telemetry data to an external monitoring system. Users report that some telemetry data is missing intermittently. After investigation, you find that background tasks are not completing when instances become idle. What should you do to ensure reliable telemetry delivery?

**Correct answer:** C. Update the service to use instance-based billing by deploying with the --no-cpu-throttling flag to allocate CPU even outside of request processing.

**Options:**

- **A.** Increase the request timeout to 60 minutes to give background tasks more time to complete before the request finishes.
- **B.** Enable startup CPU boost to provide additional CPU resources for the background telemetry processing.
- **C.** Update the service to use instance-based billing by deploying with the --no-cpu-throttling flag to allocate CPU even outside of request processing. — _correct answer_
- **D.** Configure a minimum instances setting of 1 to ensure at least one instance is always running to complete background tasks.

## Question 18

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is building a data processing pipeline that lists millions of objects in Cloud Storage. Some developers prefer using the Cloud Storage client library while others want to use the JSON API directly. The team lead asks you to explain the key difference in pagination behavior between these approaches. Which statement correctly describes this difference?

**Correct answer:** D. Client libraries perform pagination automatically and return iterators that handle page tokens internally, while the JSON API requires manually tracking and passing the nextPageToken in subsequent requests.

**Options:**

- **A.** The JSON API automatically paginates all results into a single response stream, while client libraries require explicit configuration of page sizes and manual iteration.
- **B.** Both client libraries and the JSON API require manual pagination implementation, but client libraries provide helper functions to generate the page token automatically.
- **C.** Client libraries have a maximum limit of 1000 objects per query and require multiple separate queries, while the JSON API can return unlimited objects in a single paginated response.
- **D.** Client libraries perform pagination automatically and return iterators that handle page tokens internally, while the JSON API requires manually tracking and passing the nextPageToken in subsequent requests. — _correct answer_

## Question 19

**Domain:** Deploying applications

**Question:** Your team manages Kubernetes deployments using YAML manifest files stored in a Git repository. You need to deploy updates to your GKE cluster in a way that supports declarative configuration management, allows tracking of configuration drift, and enables easy rollbacks. What is the recommended kubectl approach?

**Correct answer:** A. Use kubectl apply -f deployment.yaml to create or update resources declaratively from the manifest file.

**Options:**

- **A.** Use kubectl apply -f deployment.yaml to create or update resources declaratively from the manifest file. — _correct answer_
- **B.** Use kubectl create deployment commands imperatively to generate resources directly in the cluster.
- **C.** Use kubectl create -f deployment.yaml to initially create resources, then kubectl replace -f deployment.yaml for updates.
- **D.** Use kubectl patch -f deployment.yaml to update specific fields in existing resources from the manifest file.

## Question 20

**Domain:** Deploying applications

**Question:** Your GKE cluster is in a different Google Cloud project than your Artifact Registry Docker repository. When deploying workloads, pods fail with ImagePullBackOff errors. The GKE cluster uses the default Compute Engine service account as its node identity. What should you do to resolve this issue?

**Correct answer:** B. Grant the Artifact Registry Reader role to the GKE node service account in the project containing the Artifact Registry repository.

**Options:**

- **A.** Create a VPC peering connection between the two projects to allow network access from GKE nodes to Artifact Registry endpoints.
- **B.** Grant the Artifact Registry Reader role to the GKE node service account in the project containing the Artifact Registry repository. — _correct answer_
- **C.** Enable the Artifact Registry API in the GKE project to establish connectivity between the cluster and the repository.
- **D.** Configure imagePullSecrets in your Kubernetes deployment manifests using a service account key stored as a Kubernetes secret.

## Question 21

**Domain:** Deploying applications

**Question:** Your company is deploying a Cloud Run service that connects to a Cloud SQL database. The database credentials must be stored securely and automatically refresh when rotated without requiring application code changes or new deployments. You want to implement this while following Google-recommended best practices. What should you do?

**Correct answer:** A. Mount the Secret Manager secret as a volume, configure the secret with the 'latest' version, and read the credentials from the mounted file path at runtime when needed.

**Options:**

- **A.** Mount the Secret Manager secret as a volume, configure the secret with the 'latest' version, and read the credentials from the mounted file path at runtime when needed. — _correct answer_
- **B.** Use the Secret Manager client library to programmatically access the secret at application startup, and cache the credentials in memory for the lifetime of the instance.
- **C.** Expose the Secret Manager secret as an environment variable with the 'latest' version alias, and read the credentials from the environment variable at application startup.
- **D.** Store the database credentials in Cloud Run environment variables and use Cloud Scheduler to trigger service redeployments after each credential rotation.

## Question 22

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that tracks API request latencies. You want to extract latency values from structured JSON log entries and create metrics that show the distribution of response times over histogram buckets for SLI monitoring. What type of log-based metric should you create?

**Correct answer:** D. Create a distribution log-based metric with a filter to select relevant log entries and a value extractor to parse the latency value from the JSON payload.

**Options:**

- **A.** Create multiple counter log-based metrics with different filters for each latency bucket range and manually aggregate them to form a distribution.
- **B.** Create a counter log-based metric with labels that extract the latency value as a label dimension from the JSON payload.
- **C.** Create a system log-based metric using the built-in latency tracking available in Cloud Logging for all API requests.
- **D.** Create a distribution log-based metric with a filter to select relevant log entries and a value extractor to parse the latency value from the JSON payload. — _correct answer_

## Question 23

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that writes logs to Cloud Logging. Your team wants to track the number of times a specific error message 'DatabaseConnectionFailed' appears in the logs and create an alert when this error occurs more than 5 times within a 10-minute window. You need to implement this with minimal development effort. What should you do?

**Correct answer:** A. Create a counter-type log-based metric with a filter that matches log entries containing 'DatabaseConnectionFailed'. Configure an alerting policy in Cloud Monitoring to monitor the metric and trigger when the count exceeds 5 within a 10-minute alignment period.

**Options:**

- **A.** Create a counter-type log-based metric with a filter that matches log entries containing 'DatabaseConnectionFailed'. Configure an alerting policy in Cloud Monitoring to monitor the metric and trigger when the count exceeds 5 within a 10-minute alignment period. — _correct answer_
- **B.** Create a log sink to route logs containing 'DatabaseConnectionFailed' to a Pub/Sub topic. Deploy a Cloud Run function to consume messages and maintain a counter in Memorystore, triggering an alert when the threshold is exceeded.
- **C.** Instrument the application code to emit a custom metric using the Cloud Monitoring API each time the database connection fails. Create an alerting policy to monitor the custom metric.
- **D.** Configure a log-based alert directly in Cloud Logging to notify when 'DatabaseConnectionFailed' appears in the logs, setting the alert threshold to 5 occurrences.

## Question 24

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company stores sensitive financial data in Cloud Storage and BigQuery. You are implementing VPC Service Controls to protect against data exfiltration. Before enforcing the perimeter in production, you need to verify the configuration without disrupting existing workloads. You want to identify any access patterns that would be blocked by the new perimeter. What should you do?

**Correct answer:** C. Configure the service perimeter in dry run mode, then analyze VPC Service Controls violation logs in Cloud Logging to identify requests that would be blocked.

**Options:**

- **A.** Deploy the VPC Service Controls configuration in a development environment first, then replicate the exact configuration in production.
- **B.** Create an enforced service perimeter during a maintenance window and monitor Cloud Monitoring for API error rates to identify blocked requests.
- **C.** Configure the service perimeter in dry run mode, then analyze VPC Service Controls violation logs in Cloud Logging to identify requests that would be blocked. — _correct answer_
- **D.** Enable VPC Service Controls audit logging and analyze the logs for 30 days before creating any perimeter to understand baseline access patterns.

## Question 25

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your GKE application uses Memorystore for Redis to cache session data. Users report that their sessions are being unexpectedly terminated even though the session TTL has not expired. You discover that the Memorystore instance memory is reaching capacity. The application sets TTLs on all session keys, but non-session keys stored by a background job do not have TTLs configured. What should you do to resolve this issue while minimizing application changes?

**Correct answer:** D. Change the eviction policy from volatile-lru to allkeys-lru so that Redis can evict any key, including those without TTLs, when memory pressure occurs.

**Options:**

- **A.** Scale up the Memorystore instance to a larger capacity tier and enable the noeviction policy to prevent any key from being automatically removed.
- **B.** Configure activedefrag on the Memorystore instance and set the maxmemory-gb limit to 50% of the instance capacity to ensure sufficient memory overhead for session keys.
- **C.** Implement a separate Memorystore instance for the background job data and configure VPC peering between the two instances to enable cross-instance key migration.
- **D.** Change the eviction policy from volatile-lru to allkeys-lru so that Redis can evict any key, including those without TTLs, when memory pressure occurs. — _correct answer_

## Question 26

**Domain:** Integrating applications with Google Cloud services

**Question:** You are troubleshooting a Cloud Tasks queue where tasks are being retried with much longer intervals than your configured backoff settings. Your queue configuration shows min-backoff of 1s and max-backoff of 60s, but you observe retry intervals of several minutes. What is the most likely cause of this behavior?

**Correct answer:** C. The task handler is returning HTTP 429 Too Many Requests or HTTP 503 errors, causing Cloud Tasks to use a higher system-level backoff rate.

**Options:**

- **A.** The task payload size exceeds the recommended limit, causing Cloud Tasks to implement additional processing delays.
- **B.** The max-retry-duration setting has been reached, causing Cloud Tasks to extend intervals to fit within the remaining time window.
- **C.** The task handler is returning HTTP 429 Too Many Requests or HTTP 503 errors, causing Cloud Tasks to use a higher system-level backoff rate. — _correct answer_
- **D.** The queue has been paused and resumed, which resets the backoff parameters to default values.

## Question 27

**Domain:** Integrating applications with Google Cloud services

**Question:** You want to configure your GKE Horizontal Pod Autoscaler (HPA) to scale based on a custom application metric that your workload exports to Cloud Monitoring. What must you do to enable the HPA to read custom metrics from Cloud Monitoring?

**Correct answer:** C. Install the Custom Metrics Stackdriver Adapter in your GKE cluster. Grant the adapter's service account the roles/monitoring.viewer IAM role to read metrics from Cloud Monitoring.

**Options:**

- **A.** Update the HPA manifest to use the External metric type and specify the full Cloud Monitoring metric path. The GKE control plane has built-in access to read metrics.
- **B.** Configure your GKE cluster to use Google Cloud Managed Service for Prometheus. The HPA automatically reads Prometheus metrics from the cluster without additional configuration.
- **C.** Install the Custom Metrics Stackdriver Adapter in your GKE cluster. Grant the adapter's service account the roles/monitoring.viewer IAM role to read metrics from Cloud Monitoring. — _correct answer_
- **D.** Enable the Cloud Monitoring API in your project and annotate your Deployment with prometheus.io/scrape: true. The HPA automatically discovers and uses annotated metrics.

## Question 28

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization routes logs from multiple projects to a centralized log bucket in an observability project using aggregated sinks. You need to create a log-based metric that counts error messages across all projects whose logs are stored in this centralized bucket. Team members from different projects need visibility into the error counts for their respective projects. What should you do?

**Correct answer:** A. Create a bucket-scoped log-based metric in the observability project. Define a label using the source_resource_container field to identify the originating project for each log entry.

**Options:**

- **A.** Create a bucket-scoped log-based metric in the observability project. Define a label using the source_resource_container field to identify the originating project for each log entry. — _correct answer_
- **B.** Create a project-scoped log-based metric in the observability project. Configure the filter to include all logs from the centralized bucket using the bucket identifier.
- **C.** Create separate project-scoped log-based metrics in each source project. Configure a multi-project metrics scope in the observability project to aggregate the metrics from all projects.
- **D.** Create an organization-level log-based metric that counts errors across all projects. Grant team members the Monitoring Viewer role at the organization level to view error counts.

## Question 29

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a containerized application to GKE that needs to connect to a Cloud SQL for MySQL instance. The application handles sensitive financial data and must use secure, authenticated connections. You want to follow Google Cloud best practices for connecting GKE workloads to Cloud SQL. How should you configure the connection?

**Correct answer:** D. Deploy the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application and connect to the database through localhost.

**Options:**

- **A.** Configure authorized networks on the Cloud SQL instance to allow connections from the GKE cluster's IP range and use direct TCP connections.
- **B.** Export the Cloud SQL SSL certificate and configure each application container to use SSL connections directly to the Cloud SQL public IP.
- **C.** Deploy the Cloud SQL Auth Proxy as a centralized Kubernetes service and configure all application pods to connect to this service endpoint.
- **D.** Deploy the Cloud SQL Auth Proxy as a sidecar container in the same pod as your application and connect to the database through localhost. — _correct answer_

## Question 30

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a monitoring dashboard that needs to display the most recent metrics first. You are using Cloud Bigtable to store metric data with row keys containing identifiers and timestamps. What row key design pattern enables efficient retrieval of the most recent data first?

**Correct answer:** A. Use a reversed timestamp by subtracting the actual timestamp from the maximum long integer value, placing it after a high-cardinality identifier in the row key.

**Options:**

- **A.** Use a reversed timestamp by subtracting the actual timestamp from the maximum long integer value, placing it after a high-cardinality identifier in the row key. — _correct answer_
- **B.** Start the row key with the standard Unix timestamp so newer data appears at the end of the table for efficient tail reads.
- **C.** Store all metrics in a single row and use Bigtable's built-in cell timestamps to automatically sort by recency within each column.
- **D.** Use a random prefix before the timestamp to distribute writes evenly and rely on client-side sorting for chronological display.

## Question 31

**Domain:** Deploying applications

**Question:** Your development team is setting up a CI/CD pipeline using Cloud Build to build container images and push them to Artifact Registry. You want Cloud Build to generate SLSA build provenance metadata for the container images. Which configuration approach should you use in your cloudbuild.yaml file?

**Correct answer:** C. Use the images field at the root level of the build config file to specify the container images to be pushed to Artifact Registry.

**Options:**

- **A.** Enable the Container Analysis API and add --provenance=true flag to the docker build command in your build step.
- **B.** Configure a post-build Cloud Run function trigger to push images and generate provenance after each successful build completion.
- **C.** Use the images field at the root level of the build config file to specify the container images to be pushed to Artifact Registry. — _correct answer_
- **D.** Add a Docker push build step using gcr.io/cloud-builders/docker with args including 'push' to manually push images after the build step completes.

## Question 32

**Domain:** Deploying applications

**Question:** Your Cloud Run service uses a Secret Manager secret exposed as an environment variable. You are concerned about potential service outages when the secret is rotated. What is Google's recommended approach for referencing secret versions in production Cloud Run deployments?

**Correct answer:** B. Pin the secret to a specific version number and update the version through your release process when rotating secrets.

**Options:**

- **A.** Set up a Pub/Sub trigger to automatically restart Cloud Run instances when secrets are updated.
- **B.** Pin the secret to a specific version number and update the version through your release process when rotating secrets. — _correct answer_
- **C.** Use the 'latest' alias to automatically retrieve the most recent secret version without deployment changes.
- **D.** Configure the Cloud Run service to poll Secret Manager every 60 seconds for secret changes.

## Question 33

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Cloud Run application that requires database credentials stored in Secret Manager. The credentials need to be rotated regularly without requiring application redeployment. How should you configure your Cloud Run service to access the secret?

**Correct answer:** A. Mount the secret as a volume and configure Cloud Run to reference the 'latest' version of the secret.

**Options:**

- **A.** Mount the secret as a volume and configure Cloud Run to reference the 'latest' version of the secret. — _correct answer_
- **B.** Store the credentials in Cloud Storage and have the application read them at runtime using a Cloud Storage client library.
- **C.** Configure the Cloud Run service to poll Secret Manager every minute using the Secret Manager API to check for credential updates.
- **D.** Pass the secret as an environment variable and configure Cloud Run to reference the 'latest' version of the secret.

## Question 34

**Domain:** Building and testing applications

**Question:** You are developing a Python application locally that needs to access Cloud Storage and Firestore. You want to use your Google user credentials for development while ensuring the application code will work unchanged in production where it will run on Cloud Run with an attached service account. What should you do?

**Correct answer:** C. Run gcloud auth application-default login to create a local ADC file with your user credentials. Use Cloud Client Libraries in your application code to authenticate automatically.

**Options:**

- **A.** Create a service account key file and distribute it with your application code. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to the key file in all environments.
- **B.** Run gcloud auth login to authenticate your Google account. Use Cloud Client Libraries in your application code to authenticate automatically.
- **C.** Run gcloud auth application-default login to create a local ADC file with your user credentials. Use Cloud Client Libraries in your application code to authenticate automatically. — _correct answer_
- **D.** Embed the service account key JSON directly in your application code and initialize Cloud Client Libraries with explicit credentials in the constructor.

## Question 35

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that references a Secret Manager secret as an environment variable. During testing, the secret version was set to 'latest'. Before promoting to production, you want to ensure reliable deployments following Google-recommended best practices. What change should you make to the secret configuration?

**Correct answer:** B. Pin the secret reference to a specific version number instead of using the 'latest' alias, and update the version number through your release process when the secret rotates.

**Options:**

- **A.** Configure the Cloud Run service with minimum instances set to 1 to ensure the 'latest' secret version is always resolved to a running instance.
- **B.** Pin the secret reference to a specific version number instead of using the 'latest' alias, and update the version number through your release process when the secret rotates. — _correct answer_
- **C.** Enable Secret Manager notifications to Pub/Sub and configure automatic Cloud Run redeployments when secrets are updated.
- **D.** Change from environment variable to volume mount configuration while keeping the 'latest' version alias for automatic secret updates.

## Question 36

**Domain:** Building and testing applications

**Question:** Your team runs automated integration tests in Cloud Build that occasionally produce flaky results. You want to configure your build to allow specific test steps to fail without failing the entire build, but only when the failure produces a specific exit code (exit code 3) that indicates a known flaky condition. How should you configure this in your cloudbuild.yaml?

**Correct answer:** A. Add the allowExitCodes field to the test step and specify [3] as the allowed exit code value.

**Options:**

- **A.** Add the allowExitCodes field to the test step and specify [3] as the allowed exit code value. — _correct answer_
- **B.** Configure a Cloud Build notifier to filter builds that fail with exit code 3 and automatically retry them.
- **C.** Wrap the test command in a shell script that catches exit code 3 and converts it to exit code 0 before returning.
- **D.** Set allowFailure: true on the test step to allow the step to fail without affecting the overall build status.

## Question 37

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing an API on Cloud Run that must handle WebSocket connections from up to 5,000 concurrent users. The application requires maintaining session state for each connected user. How should you configure concurrency and scaling?

**Correct answer:** C. Set maximum concurrency to 1000 per instance and configure a minimum of 5 instances to handle all expected concurrent WebSocket connections.

**Options:**

- **A.** Set maximum concurrency to 5000 to allow a single instance to handle all WebSocket connections and minimize costs.
- **B.** Use the default concurrency of 80 and let Cloud Run automatically scale to handle the WebSocket connections.
- **C.** Set maximum concurrency to 1000 per instance and configure a minimum of 5 instances to handle all expected concurrent WebSocket connections. — _correct answer_
- **D.** Set concurrency to 1 and maximum instances to 5000 to ensure each WebSocket connection gets dedicated resources.

## Question 38

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You need to enable secure SSH access to virtual machines in your Google Cloud project that do not have external IP addresses. You want to use Identity-Aware Proxy (IAP) TCP forwarding to provide auditable, identity-based access control without using a VPN. Which configuration steps are required?

**Correct answer:** D. Create a firewall rule allowing TCP ingress from 35.235.240.0/20 to the target VMs, and grant users the IAP-Secured Tunnel User role on the project or specific VM instances.

**Options:**

- **A.** Create a bastion host with an external IP address in the same VPC and configure IAP to route SSH traffic through the bastion to internal VMs.
- **B.** Enable the IAP API and grant users the IAP-secured Web App User role on the project to allow SSH connections through the Cloud console.
- **C.** Configure Cloud NAT for the subnet containing the VMs and grant users the Compute Instance Admin role to enable outbound SSH connections.
- **D.** Create a firewall rule allowing TCP ingress from 35.235.240.0/20 to the target VMs, and grant users the IAP-Secured Tunnel User role on the project or specific VM instances. — _correct answer_

## Question 39

**Domain:** Building and testing applications

**Question:** You are using Cloud Code in IntelliJ to develop a Java containerized application. When debugging your application locally, you notice that the debugger does not attach properly to your running container. You want Cloud Code to automatically configure the debugging environment. What does Cloud Code automatically do to enable Java debugging in containers?

**Correct answer:** D. Cloud Code automatically adds the JAVA_TOOL_OPTIONS environment variable with the appropriate JDWP configuration to enable debugging.

**Options:**

- **A.** Cloud Code creates a separate debug container as a sidecar that connects to the main application container on port 8000.
- **B.** Cloud Code installs a Java debugging agent inside the container and updates the pod's security context to allow debugging.
- **C.** Cloud Code modifies the container's Dockerfile to include debug symbols and expose port 5005 for remote debugging.
- **D.** Cloud Code automatically adds the JAVA_TOOL_OPTIONS environment variable with the appropriate JDWP configuration to enable debugging. — _correct answer_

## Question 40

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an IoT application that records sensor data from thousands of devices every second. The data needs to be stored in Cloud Bigtable. Your primary access pattern is retrieving all readings for a specific device within a time range. Which row key design should you use to optimize for this access pattern and avoid hotspots?

**Correct answer:** A. Use a composite row key in the format device_id#timestamp, where device_id is a unique identifier for each device.

**Options:**

- **A.** Use a composite row key in the format device_id#timestamp, where device_id is a unique identifier for each device. — _correct answer_
- **B.** Use a sequential numeric ID auto-incremented for each sensor reading as the row key for simplicity.
- **C.** Use a row key in the format timestamp#device_id to enable chronological ordering of all sensor data across devices.
- **D.** Use only the timestamp as the row key to enable efficient time-range queries across all devices.

## Question 41

**Domain:** Building and testing applications

**Question:** You are a developer at a software company building a Java application. Your container images are larger than expected, and you want to optimize the build process using Cloud Build and Artifact Registry. The final production image should only contain the runtime dependencies and the compiled JAR file, not the build tools. What should you do?

**Correct answer:** C. Create a Dockerfile with a multi-stage build that uses a JDK image for compilation and a JRE image for the runtime stage. Configure Cloud Build to build and push the final image to Artifact Registry.

**Options:**

- **A.** Build the application locally with Maven, then create a Dockerfile that only contains the COPY instruction for the JAR file. Submit the build to Cloud Build with the pre-compiled JAR included in the source.
- **B.** Install both JDK and JRE in a single Docker image layer and use environment variables to switch between build and runtime modes when the container starts.
- **C.** Create a Dockerfile with a multi-stage build that uses a JDK image for compilation and a JRE image for the runtime stage. Configure Cloud Build to build and push the final image to Artifact Registry. — _correct answer_
- **D.** Create two separate Dockerfiles: one for building the JAR file and one for the runtime image. Use Cloud Build to run both sequentially and upload the intermediate artifacts to Cloud Storage between builds.

## Question 42

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is developing a microservices application on Cloud Run that requires API keys stored in Secret Manager. You want to ensure that a problematic secret value can be quickly identified and that your applications can be rolled back to a known-good configuration without service disruption. What should you do?

**Correct answer:** A. Reference secrets by their version number in your Cloud Run deployment configuration, and use your existing release processes to deploy version updates.

**Options:**

- **A.** Reference secrets by their version number in your Cloud Run deployment configuration, and use your existing release processes to deploy version updates. — _correct answer_
- **B.** Create separate secrets for each version with naming conventions like 'api-key-v1' and 'api-key-v2', and update application code to reference the appropriate secret name.
- **C.** Reference secrets using the 'latest' alias in your Cloud Run deployment configuration to ensure applications always use the most current secret value automatically.
- **D.** Store secrets in environment variables at build time and redeploy the application whenever secret values change to maintain version control.

## Question 43

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing a Cloud Firestore query for a human resources application. Users frequently search for employees by filtering on country (equality), salary (range greater than), and experience (range greater than). The salary filter is more selective than the experience filter. You want to minimize the number of index entries scanned and reduce query costs. How should you configure the composite index?

**Correct answer:** A. Create a composite index with fields ordered as country, salary, experience to place equality constraints first followed by the most selective range field.

**Options:**

- **A.** Create a composite index with fields ordered as country, salary, experience to place equality constraints first followed by the most selective range field. — _correct answer_
- **B.** Create a composite index with fields ordered as experience, salary, country to match the order fields appear in the application query code.
- **C.** Create a composite index with fields ordered as salary, experience, country to prioritize the range filters that reduce the result set most significantly.
- **D.** Create separate single-field indexes for country, salary, and experience and rely on Firestore's index merging feature to combine results.

## Question 44

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are optimizing queries in a Cloud Firestore application that retrieves products with filters on multiple fields: category equals 'electronics', price greater than 100, and results sorted by rating in descending order. The query is slow and you want to improve its performance. How should you configure the composite index?

**Correct answer:** D. Create a composite index with fields in this order: category (ascending), price (ascending), rating (descending).

**Options:**

- **A.** Create a composite index with fields in this order: price (ascending), category (ascending), rating (descending).
- **B.** Create separate single-field indexes for category, price, and rating, and let Firestore merge them at query time.
- **C.** Create a composite index with fields in this order: rating (descending), category (ascending), price (ascending).
- **D.** Create a composite index with fields in this order: category (ascending), price (ascending), rating (descending). — _correct answer_

## Question 45

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application Pod running on GKE is experiencing intermittent authentication failures when starting. The failures occur only during the first few seconds after the Pod is created, and subsequent retries succeed. The Pod uses Workload Identity Federation for GKE to authenticate to BigQuery. You need to fix this issue with minimal code changes. What should you do?

**Correct answer:** D. Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container.

**Options:**

- **A.** Configure the Pod to use hostNetwork mode so it can directly access the Compute Engine metadata server without going through the GKE metadata server.
- **B.** Disable Workload Identity Federation for the node pool and configure the Pod to use the node's Compute Engine service account instead for faster authentication.
- **C.** Store an IAM service account key as a Kubernetes Secret and mount it in the Pod to bypass the GKE metadata server authentication delay.
- **D.** Deploy an initContainer that waits until the GKE metadata server is ready before running the Pod's main container. — _correct answer_

## Question 46

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company's ecommerce application runs on Cloud Run and connects to a Cloud SQL for PostgreSQL Enterprise Plus edition instance. The application experiences sudden traffic spikes during flash sales, causing connection errors because the database reaches its maximum connection limit. You need to implement a solution that allows the application to handle these traffic spikes while minimizing changes to the application code. What should you do?

**Correct answer:** A. Enable Managed Connection Pooling on the Cloud SQL instance with transaction pooling mode, and configure your application to connect through the pooler port.

**Options:**

- **A.** Enable Managed Connection Pooling on the Cloud SQL instance with transaction pooling mode, and configure your application to connect through the pooler port. — _correct answer_
- **B.** Deploy a PgBouncer instance on a Compute Engine VM and configure all Cloud Run instances to connect through it instead of directly to Cloud SQL.
- **C.** Enable session pooling mode on the Cloud SQL Managed Connection Pooling and configure Cloud Run to limit instances to 5.
- **D.** Increase the max_connections flag on the Cloud SQL instance to 10,000 and increase the instance machine type to accommodate more memory.

## Question 47

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company runs a social media platform storing user activity data in Cloud Bigtable. You notice that a few celebrity accounts with millions of followers are causing hotspots because their row keys receive disproportionately high read and write traffic compared to regular users. You need to distribute this traffic more evenly without losing the ability to query a user's complete activity. What should you do?

**Correct answer:** C. Implement key salting by prepending a calculated salt value (such as 01- or 02-) to the row key to distribute a single user's data across multiple physical rows.

**Options:**

- **A.** Move celebrity accounts to a separate Bigtable instance to isolate their traffic from regular users and prevent interference.
- **B.** Partition the data for celebrity accounts into separate tables based on time periods to reduce the amount of data accessed per request.
- **C.** Implement key salting by prepending a calculated salt value (such as 01- or 02-) to the row key to distribute a single user's data across multiple physical rows. — _correct answer_
- **D.** Add more nodes to the Bigtable cluster to horizontally scale and distribute the load from celebrity accounts across additional capacity.

## Question 48

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application stores user session data in Memorystore for Redis using the default volatile-lru eviction policy. Users report being unexpectedly logged out even though their sessions have not expired. You notice that the System Memory Usage Ratio metric is consistently above 95%. You need to resolve this issue while ensuring that active sessions are preserved. What should you do?

**Correct answer:** A. Ensure all session keys have TTLs set using the EXPIRE command, and scale up your Memorystore instance to provide more memory capacity for the session data.

**Options:**

- **A.** Ensure all session keys have TTLs set using the EXPIRE command, and scale up your Memorystore instance to provide more memory capacity for the session data. — _correct answer_
- **B.** Reduce the maxmemory-gb configuration to 50% of instance capacity to leave more overhead for Redis operations during high memory pressure.
- **C.** Change the eviction policy to noeviction to prevent any session keys from being automatically removed from the cache.
- **D.** Enable the activedefrag configuration parameter to automatically consolidate fragmented memory and free up space for session storage.

## Question 49

**Domain:** Deploying applications

**Question:** Your team is running a critical application on GKE. You want to receive notifications when error messages containing a specific pattern appear in your application logs. You need to set up alerting with minimal operational overhead. What should you do?

**Correct answer:** A. Create a log-based alerting policy in Cloud Logging that matches the specific error pattern and configure a notification channel.

**Options:**

- **A.** Create a log-based alerting policy in Cloud Logging that matches the specific error pattern and configure a notification channel. — _correct answer_
- **B.** Deploy a custom monitoring application as a DaemonSet that tails container logs and sends alerts through a third-party alerting service.
- **C.** Create a user-defined log-based metric that counts occurrences of the error pattern, then create an alerting policy in Cloud Monitoring based on the metric threshold.
- **D.** Export logs to BigQuery using a log sink, create a scheduled query to detect the error pattern, and configure Cloud Scheduler to check results and send notifications.

## Question 50

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company uses Splunk as their SIEM solution for security monitoring. You need to configure Cloud Logging to export security-relevant logs from your Google Cloud environment to Splunk in near real-time. What is the correct sink destination and IAM role configuration?

**Correct answer:** B. Create a log sink with a Pub/Sub topic as the destination and grant the sink's service account the Pub/Sub Publisher role (roles/pubsub.publisher) on the topic.

**Options:**

- **A.** Create a log sink with a log bucket as the destination in a separate project and configure Splunk to read directly from the Cloud Logging API.
- **B.** Create a log sink with a Pub/Sub topic as the destination and grant the sink's service account the Pub/Sub Publisher role (roles/pubsub.publisher) on the topic. — _correct answer_
- **C.** Create a log sink with a Cloud Storage bucket as the destination and grant the sink's service account the Storage Object Creator role (roles/storage.objectCreator) on the bucket.
- **D.** Create a log sink with a BigQuery dataset as the destination and grant the sink's service account the BigQuery Data Editor role (roles/bigquery.dataEditor) on the dataset.

## Question 51

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a collaborative document editing application using Firestore. Users frequently open and close documents throughout the day. Your application uses real-time listeners to synchronize document changes across devices. You notice your Firestore read costs are higher than expected. What should you do to reduce costs while maintaining real-time synchronization?

**Correct answer:** D. Keep snapshot listeners alive for as long as possible rather than frequently creating and detaching them for the same data.

**Options:**

- **A.** Disable offline persistence to prevent duplicate reads from both cache and server.
- **B.** Increase the frequency of one-shot queries instead of using real-time listeners to reduce network overhead.
- **C.** Configure listeners to fetch only from the local cache and manually trigger server synchronization every few minutes.
- **D.** Keep snapshot listeners alive for as long as possible rather than frequently creating and detaching them for the same data. — _correct answer_

## Question 52

**Domain:** Building and testing applications

**Question:** You are a developer setting up your local environment to develop and debug Kubernetes applications using Cloud Code in VS Code. Your application calls Google Cloud APIs and needs to authenticate during local development. What should you do to enable authentication for your local debugging sessions?

**Correct answer:** B. Sign in to Google Cloud through the Cloud Code status bar in VS Code, which updates your Application Default Credentials when you authenticate to the gcloud CLI.

**Options:**

- **A.** Create a service account key JSON file, store it in your project directory, and set the GOOGLE_APPLICATION_CREDENTIALS environment variable in your VS Code settings.
- **B.** Sign in to Google Cloud through the Cloud Code status bar in VS Code, which updates your Application Default Credentials when you authenticate to the gcloud CLI. — _correct answer_
- **C.** Configure OAuth 2.0 client credentials in your application code and pass the client ID and secret as environment variables to the container.
- **D.** Manually run 'gcloud auth application-default login' in a separate terminal before each debugging session starts in Cloud Code.

## Question 53

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a reporting dashboard that reads multiple related documents from Cloud Firestore to display consistent data to users. The reads do not modify any data. Your server-side application occasionally experiences contention errors when running these read operations. How should you modify your approach to reduce contention while ensuring data consistency?

**Correct answer:** A. Use a read-only transaction to read all documents at a consistent snapshot in time.

**Options:**

- **A.** Use a read-only transaction to read all documents at a consistent snapshot in time. — _correct answer_
- **B.** Use a read-write transaction to ensure all reads are performed atomically.
- **C.** Use batched writes with get operations to read all documents within a single batch.
- **D.** Use individual document reads with eventually consistent read options to avoid contention.

## Question 54

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a Cloud Tasks queue for an order processing system. You need to configure exponential backoff so that the initial retry delay is 10 seconds with a maximum delay of 300 seconds. The interval should double 3 times before increasing linearly. What is the sequence of retry intervals?

**Correct answer:** C. 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s

**Options:**

- **A.** 10s, 20s, 40s, 80s, 300s, 300s, 300s, 300s
- **B.** 10s, 20s, 30s, 40s, 50s, 60s, 300s, 300s
- **C.** 10s, 20s, 40s, 80s, 160s, 240s, 300s, 300s — _correct answer_
- **D.** 10s, 30s, 90s, 270s, 300s, 300s, 300s, 300s

## Question 55

**Domain:** Deploying applications

**Question:** Your company uses Cloud Build to build container images that are deployed to GKE clusters in multiple projects. The Artifact Registry repositories are located in a central project. Cloud Build runs in individual application projects. Builds are failing with permission denied errors when pushing images. What should you do?

**Correct answer:** D. Grant the Artifact Registry Writer role to each Cloud Build service account on the repositories in the central Artifact Registry project.

**Options:**

- **A.** Enable the Artifact Registry API in the central project, which will automatically grant access to all Cloud Build service accounts in the organization.
- **B.** Grant the Storage Object Admin role to each Cloud Build service account at the organization level.
- **C.** Create a service account key for the central project's service account and store it in Secret Manager for Cloud Build to use.
- **D.** Grant the Artifact Registry Writer role to each Cloud Build service account on the repositories in the central Artifact Registry project. — _correct answer_

## Question 56

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You manage a Cloud Run API that experiences significant cold start latency due to a heavy Java framework initialization. You want to reduce startup latency without increasing costs during periods of no traffic. What is the recommended approach?

**Correct answer:** D. Enable startup CPU boost to temporarily increase CPU allocation during instance startup, reducing initialization time.

**Options:**

- **A.** Set minimum instances to 1 with request-based billing to keep a warm instance ready while minimizing idle costs.
- **B.** Switch to instance-based billing to ensure CPU is always available during container initialization.
- **C.** Increase the vCPU allocation from 1 to 4 vCPUs to speed up the initialization process.
- **D.** Enable startup CPU boost to temporarily increase CPU allocation during instance startup, reducing initialization time. — _correct answer_

## Question 57

**Domain:** Building and testing applications

**Question:** Your team uses Cloud Build to run integration tests against different environments (development, staging, production). The same cloudbuild.yaml file should be reused across environments by changing target database endpoints and API URLs. You want to minimize code duplication and allow environment-specific values to be provided at build time. What should you do?

**Correct answer:** A. Define user-defined substitution variables with underscore prefixes (e.g., $_DATABASE_URL) in the build config and provide values using the --substitutions flag when triggering builds or configure them in build triggers.

**Options:**

- **A.** Define user-defined substitution variables with underscore prefixes (e.g., $_DATABASE_URL) in the build config and provide values using the --substitutions flag when triggering builds or configure them in build triggers. — _correct answer_
- **B.** Create separate Cloud Build triggers for each environment and use the default substitution variable $BRANCH_NAME to determine which environment configuration to use during the build.
- **C.** Use environment variables directly in your build steps by defining them with the 'env' field and hardcode different values in separate cloudbuild.yaml files for each environment.
- **D.** Store environment-specific configuration in Secret Manager and access all values directly without any substitution variables since Secret Manager handles environment separation automatically.

## Question 58

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is deploying a new application on Compute Engine with Identity-Aware Proxy (IAP) enabled. Some users report that they have the Project Owner role but cannot access the application and receive a 403 Forbidden error. You need to help them access the application while following the principle of least privilege. What should you do?

**Correct answer:** C. Grant the users the IAP-secured Web App User role on the IAP-protected resource using the IAP admin page in the Google Cloud console.

**Options:**

- **A.** Add the users' accounts to the OAuth consent screen's authorized users list and ensure they have accepted the consent screen.
- **B.** Disable IAP on the application temporarily and grant the users direct network access through VPC firewall rules for their IP addresses.
- **C.** Grant the users the IAP-secured Web App User role on the IAP-protected resource using the IAP admin page in the Google Cloud console. — _correct answer_
- **D.** Grant the users the IAP Policy Admin role which allows full access to IAP resources including the ability to access protected applications.

## Question 59

**Domain:** Deploying applications

**Question:** You deployed a new version of your application to a GKE cluster using a Deployment. Users report that the new version has a critical bug that corrupts data. You need to quickly return to the previous working version with minimal disruption. What should you do?

**Correct answer:** C. Run kubectl rollout undo deployment/my-app to roll back to the previous revision.

**Options:**

- **A.** Run kubectl scale deployment/my-app --replicas=0 and then manually deploy the previous container image.
- **B.** Run kubectl rollout restart deployment/my-app to restart all Pods with the previous configuration.
- **C.** Run kubectl rollout undo deployment/my-app to roll back to the previous revision. — _correct answer_
- **D.** Delete the Deployment and recreate it using kubectl apply -f with the previous YAML manifest file.

## Question 60

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company operates a latency-sensitive e-commerce API on Cloud Run that experiences predictable traffic patterns. The API connects to Cloud SQL and your database administrator reports that connection pool limits are frequently being reached during peak traffic. Currently, your Cloud Run service has maximum instances set to the default value. You need to prevent the service from overwhelming the database while maintaining the ability to handle peak traffic. What should you do?

**Correct answer:** B. Calculate the maximum connections per instance based on your connection pool size, then set the Cloud Run maximum instances to ensure total connections do not exceed the database limit.

**Options:**

- **A.** Configure Cloud SQL Auth Proxy with a higher connection limit to handle the increased concurrent connections from Cloud Run instances.
- **B.** Calculate the maximum connections per instance based on your connection pool size, then set the Cloud Run maximum instances to ensure total connections do not exceed the database limit. — _correct answer_
- **C.** Increase the concurrency setting to the maximum of 1000 so that each instance handles more requests, naturally reducing the number of instances needed.
- **D.** Enable session affinity in the load balancer to route users to the same instance, reducing the number of database connections needed across instances.

## Question 61

**Domain:** Integrating applications with Google Cloud services

**Question:** You need to implement a disaster recovery strategy for your Cloud SQL for MySQL instance that allows for regional failover. The application must be able to resume operations with minimal data loss if the primary region becomes unavailable. What should you do?

**Correct answer:** C. Create a cross-region read replica, monitor replication lag, and promote the replica to a standalone instance when the primary region fails.

**Options:**

- **A.** Configure the Cloud SQL instance with high availability (regional) configuration to automatically failover to another zone within the same region.
- **B.** Enable automated backups and binary logging, then restore from the latest backup to a new instance in a different region during a failure.
- **C.** Create a cross-region read replica, monitor replication lag, and promote the replica to a standalone instance when the primary region fails. — _correct answer_
- **D.** Create a cascading replica from the primary's read replica in a third region to ensure data is available across multiple geographic locations.

## Question 62

**Domain:** Deploying applications

**Question:** Your organization wants to reduce costs for Cloud Run services that access Memorystore for Redis through a VPC network. Currently, you are using Serverless VPC Access connectors. You want to maintain the same functionality while reducing infrastructure costs. What should you do?

**Correct answer:** C. Migrate the Cloud Run services from using Serverless VPC Access connectors to using Direct VPC egress.

**Options:**

- **A.** Configure the Cloud Run services to connect to Redis over the public internet to avoid VPC connector costs.
- **B.** Reduce the number of minimum instances configured for the VPC connector from the default to one instance.
- **C.** Migrate the Cloud Run services from using Serverless VPC Access connectors to using Direct VPC egress. — _correct answer_
- **D.** Create a single shared VPC connector in the host project and share it across all Cloud Run services in multiple service projects.

## Question 63

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are building a financial application using Cloud Firestore where users can transfer funds between accounts. The transfer operation must read the current balance of both accounts and update them atomically. Multiple users may attempt transfers on the same accounts simultaneously. How should you implement this to ensure data consistency while minimizing contention errors?

**Correct answer:** B. Use a read-write transaction to read both account balances, verify sufficient funds, then update both accounts within the same transaction.

**Options:**

- **A.** Use Cloud Functions triggered by document changes to propagate updates between the two account documents.
- **B.** Use a read-write transaction to read both account balances, verify sufficient funds, then update both accounts within the same transaction. — _correct answer_
- **C.** Use a read-only transaction to read both account balances, then perform individual document updates outside the transaction.
- **D.** Use a batched write to update both account balances atomically after reading the balances with separate get operations.

## Question 64

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline that runs unit tests, builds a container image, and then runs integration tests against a deployed staging environment. The integration tests can only run after the container is successfully pushed to Artifact Registry. You want to optimize build time by running unit tests while the container is being built. What should you do?

**Correct answer:** B. Use the waitFor field with the value '-' on the unit test step to start it immediately. Add an id field to the docker push step and reference it in the waitFor field of the integration test step.

**Options:**

- **A.** Set the machineType to a larger instance in the options field and let Cloud Build automatically parallelize all build steps for faster execution.
- **B.** Use the waitFor field with the value '-' on the unit test step to start it immediately. Add an id field to the docker push step and reference it in the waitFor field of the integration test step. — _correct answer_
- **C.** Create two separate Cloud Build triggers - one for unit tests and one for the build and integration test pipeline. Use Pub/Sub notifications to coordinate between the triggers.
- **D.** Configure the unit test step with allowFailure: true and place it after the docker build step. Add a timeout to ensure the unit tests complete before integration tests begin.

## Question 65

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are configuring VPC Service Controls for a GKE cluster that runs workloads accessing Cloud Storage and BigQuery. The cluster is in a project protected by a service perimeter. You want VMs in the cluster's VPC network to access only the services explicitly protected by the perimeter, preventing access to unsupported or unprotected services. What should you do?

**Correct answer:** C. Enable VPC accessible services on the perimeter and set the allowed services list to RESTRICTED-SERVICES to limit access to only the services protected by the perimeter.

**Options:**

- **A.** Add egress rules to the perimeter that explicitly deny access to all services except Cloud Storage and BigQuery APIs.
- **B.** Create an organization policy that restricts resource service usage to only Cloud Storage and BigQuery across all projects in the perimeter.
- **C.** Enable VPC accessible services on the perimeter and set the allowed services list to RESTRICTED-SERVICES to limit access to only the services protected by the perimeter. — _correct answer_
- **D.** Configure the restricted VIP (restricted.googleapis.com) as the only endpoint for Google APIs by updating DNS records in the VPC network.

## Question 66

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a real-time order tracking system using Firestore for a logistics company. Your application needs to differentiate between new orders, updated order statuses, and canceled orders within a collection query listener. You want to implement a solution that efficiently processes each type of change. How should you implement the snapshot listener callback?

**Correct answer:** D. Use the getDocumentChanges() method in the snapshot callback and check the change type property (ADDED, MODIFIED, REMOVED) to handle each type of document change appropriately.

**Options:**

- **A.** Query the entire collection on each snapshot event using get() and compare with previously cached documents to determine which documents were added, modified, or removed.
- **B.** Create three separate snapshot listeners on the same collection, each filtering for a specific order status field to track different change types independently.
- **C.** Store a timestamp field in each document and use an orderBy clause with the listener to only process documents modified after the last known timestamp.
- **D.** Use the getDocumentChanges() method in the snapshot callback and check the change type property (ADDED, MODIFIED, REMOVED) to handle each type of document change appropriately. — _correct answer_

## Question 67

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a collaborative document editing application using Firestore. Your application needs to display different indicators in the UI for documents that have been created, modified, or deleted by other users. You want to efficiently handle these different change types in your snapshot listener. What should you do?

**Correct answer:** C. Use the docChanges() method on the query snapshot to iterate through changes and check each change's type property for added, modified, or removed values.

**Options:**

- **A.** Enable the includeMetadataChanges option and use the metadata.isFromCache property to identify which documents were changed by remote versus local operations.
- **B.** Store the previous snapshot's document IDs in memory and compare with the current snapshot to manually determine which documents were added, modified, or removed.
- **C.** Use the docChanges() method on the query snapshot to iterate through changes and check each change's type property for added, modified, or removed values. — _correct answer_
- **D.** Create three separate snapshot listeners on the same collection, each configured with a filter to receive only one type of change event.

## Question 68

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for a financial trading application that stores transaction records. You need to support three query patterns: all transactions for a specific account, all transactions on a specific date, and all transactions for a specific stock symbol. Your primary query is by account. You want to minimize full table scans while following Google-recommended practices. What should you do?

**Correct answer:** C. Create a single table with account_id as the row key prefix. Create a continuous materialized view with stock_symbol as the row key prefix for secondary lookups.

**Options:**

- **A.** Store all data with a random UUID as the row key and use filters to search for the required fields during reads.
- **B.** Create a composite row key combining all three fields (account_id#date#stock_symbol) to support all query patterns efficiently.
- **C.** Create a single table with account_id as the row key prefix. Create a continuous materialized view with stock_symbol as the row key prefix for secondary lookups. — _correct answer_
- **D.** Create separate tables for each query pattern, each with the appropriate field as the row key prefix, and maintain data consistency across all tables using application logic.

## Question 69

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline to build and store Docker images in Artifact Registry. The Cloud Build default service account is being used, and both services are in the same Google Cloud project. After running your first build, you receive a permission denied error when Cloud Build attempts to push the image to Artifact Registry. What is the most likely cause of this issue?

**Correct answer:** B. The automatic granting of IAM roles to the default Cloud Build service account has been disabled in your organization, and the Artifact Registry Writer role has not been granted manually.

**Options:**

- **A.** The images field in the cloudbuild.yaml file was not specified, preventing Cloud Build from pushing images after the build step completes.
- **B.** The automatic granting of IAM roles to the default Cloud Build service account has been disabled in your organization, and the Artifact Registry Writer role has not been granted manually. — _correct answer_
- **C.** The Artifact Registry API has not been enabled in the project, preventing any push operations to repositories even with correct permissions.
- **D.** The Artifact Registry repository was created in a different region than where the Cloud Build job is executing, causing cross-region permission failures.

## Question 70

**Domain:** Deploying applications

**Question:** You are exposing a gRPC-based microservice on GKE using an external Ingress with container-native load balancing. The application requires custom health check settings that differ from the default readiness probe. You need to configure a health check that uses HTTP/2 protocol on a specific path. What should you do?

**Correct answer:** A. Create a BackendConfig resource with a healthCheck section specifying type: HTTP2, the custom port, and request path. Reference the BackendConfig in the Service using the cloud.google.com/backend-config annotation.

**Options:**

- **A.** Create a BackendConfig resource with a healthCheck section specifying type: HTTP2, the custom port, and request path. Reference the BackendConfig in the Service using the cloud.google.com/backend-config annotation. — _correct answer_
- **B.** Create a FrontendConfig resource with a healthCheck section specifying type: GRPC, the custom port, and request path. Reference the FrontendConfig in the Ingress using the networking.gke.io/v1beta1.FrontendConfig annotation.
- **C.** Create a HealthCheckPolicy resource specifying the http2 protocol configuration. Attach it to the Service resource using the gateway.networking.k8s.io/parent annotation.
- **D.** Configure the readiness probe in the Pod spec with httpGet using the HTTP/2 scheme, and the GKE Ingress controller will automatically derive the health check parameters from it.

## Question 71

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses Cloud Tasks to send HTTP requests to a third-party API. The API returns HTTP 429 Too Many Requests with a Retry-After header set to 60 seconds when rate limited. You want Cloud Tasks to respect this header value. What should you do?

**Correct answer:** B. No additional configuration is required. Cloud Tasks automatically considers the Retry-After HTTP response header when scheduling task retries.

**Options:**

- **A.** Enable the 'respect-retry-after' flag on the queue configuration to allow Cloud Tasks to read the Retry-After header from API responses.
- **B.** No additional configuration is required. Cloud Tasks automatically considers the Retry-After HTTP response header when scheduling task retries. — _correct answer_
- **C.** Configure the queue's min_backoff to 60 seconds to match the Retry-After value returned by the third-party API.
- **D.** Implement custom logic in your task handler to parse the Retry-After header and create a new task scheduled 60 seconds in the future.

## Question 72

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team deploys containerized applications to GKE that connect to Cloud SQL for MySQL. You need to establish secure, authenticated connections between your application pods and Cloud SQL without managing SSL certificates or configuring authorized networks. You also want to prevent a single point of failure and ensure each application has independent access. What is the recommended approach?

**Correct answer:** B. Run the Cloud SQL Auth Proxy as a sidecar container in each pod sharing the same pod with your application, enabling the application to connect via localhost for increased security and resilience.

**Options:**

- **A.** Configure authorized networks on your Cloud SQL instance using the GKE cluster's node IP addresses, and have applications connect directly to Cloud SQL using SSL certificates stored as Kubernetes secrets.
- **B.** Run the Cloud SQL Auth Proxy as a sidecar container in each pod sharing the same pod with your application, enabling the application to connect via localhost for increased security and resilience. — _correct answer_
- **C.** Install the Cloud SQL Auth Proxy as a DaemonSet on each node in your GKE cluster, allowing all pods on that node to share the same proxy instance for connection efficiency.
- **D.** Deploy the Cloud SQL Auth Proxy as a separate Kubernetes Service in your cluster that all application pods connect to, centralizing connection management for easier maintenance.

## Question 73

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a backend automation service that needs to programmatically access a web application protected by Identity-Aware Proxy (IAP). The service runs on a Compute Engine VM with an attached service account. You want to follow Google-recommended security practices for authenticating to the IAP-protected resource. What should you do?

**Correct answer:** D. Grant the service account the roles/iap.httpsResourceAccessor role. Generate a signed JWT with the IAP client ID as the audience and include it in the Authorization header when making requests.

**Options:**

- **A.** Create an API key for the service and include it as a query parameter in requests to the IAP-protected application.
- **B.** Configure the IAP settings to allowlist the VM's external IP address so that requests from the service bypass authentication completely.
- **C.** Export the service account key file and store it on the VM. Use the key file to impersonate a user account that has IAP access, then make requests with the user's OAuth token.
- **D.** Grant the service account the roles/iap.httpsResourceAccessor role. Generate a signed JWT with the IAP client ID as the audience and include it in the Authorization header when making requests. — _correct answer_

## Question 74

**Domain:** Building and testing applications

**Question:** Your team is performing a canary deployment on Cloud Run and has deployed a new revision tagged 'canary' that is currently receiving 10% of production traffic. Users are reporting errors related to the new revision. You need to immediately roll back all traffic to the stable revision tagged 'stable'. What is the fastest way to accomplish this?

**Correct answer:** B. Run gcloud run services update-traffic SERVICE_NAME --to-tags stable=100 to redirect all traffic to the stable revision.

**Options:**

- **A.** Run gcloud run deploy SERVICE_NAME with the --image flag pointing to the stable container image and omit the --no-traffic flag to serve all traffic.
- **B.** Run gcloud run services update-traffic SERVICE_NAME --to-tags stable=100 to redirect all traffic to the stable revision. — _correct answer_
- **C.** Delete the canary revision using gcloud run revisions delete, which will automatically redirect all traffic to the remaining stable revision.
- **D.** Update the Cloud Run service YAML configuration file to set the canary revision traffic percentage to 0 and apply it using gcloud run services replace.

## Question 75

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a GKE architecture where multiple applications in the same namespace need to access Cloud Storage with identical permissions. You want to simplify IAM management by granting access to all workloads in the namespace with a single IAM policy binding. What should you do?

**Correct answer:** C. Use the principalSet notation in your IAM policy binding to reference all Kubernetes ServiceAccounts in the namespace. Grant the required Cloud Storage role to the principalSet using the namespace attribute.

**Options:**

- **A.** Grant the Cloud Storage role to the node pool's service account. Ensure all pods in the namespace are scheduled on that node pool using nodeSelector labels to inherit the permissions.
- **B.** Create a single IAM service account with Cloud Storage permissions. Configure each Kubernetes ServiceAccount in the namespace to impersonate this IAM service account using the Workload Identity User role.
- **C.** Use the principalSet notation in your IAM policy binding to reference all Kubernetes ServiceAccounts in the namespace. Grant the required Cloud Storage role to the principalSet using the namespace attribute. — _correct answer_
- **D.** Create a single Kubernetes ServiceAccount in the namespace and configure all application deployments to use it. Grant the required Cloud Storage role to this ServiceAccount using the principal identifier format.

## Question 76

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a social media application using Cloud Firestore where each user document contains a subcollection of posts. You need to implement a feature that displays all posts across all users filtered by a specific tag and ordered by creation date. What should you do to enable this query efficiently?

**Correct answer:** B. Use a collection group query on the posts subcollection and create a composite index with collection group scope on the tag and createdAt fields.

**Options:**

- **A.** Restructure the data model to store all posts in a single top-level collection with a userId reference field instead of using subcollections under user documents.
- **B.** Use a collection group query on the posts subcollection and create a composite index with collection group scope on the tag and createdAt fields. — _correct answer_
- **C.** Query each user document individually, retrieve the posts subcollection, filter and sort results in application code, then aggregate the results.
- **D.** Enable the collection group query feature in the Firestore settings and use the default single-field indexes to run the filtered query across subcollections.

## Question 77

**Domain:** Deploying applications

**Question:** You are creating a Serverless VPC Access connector to enable your Cloud Run service to access private resources in a VPC network. When you attempt to create the connector, you receive an error indicating the subnet configuration is invalid. Which subnet configuration would be valid for creating the connector?

**Correct answer:** D. Use a dedicated /28 subnet that contains no other resources and has a purpose of PRIVATE.

**Options:**

- **A.** Use a /16 subnet in the connector configuration to allow for future scaling.
- **B.** Use a /28 subnet with purpose set to SERVERLESS to indicate connector usage.
- **C.** Use an existing /24 subnet that hosts your Compute Engine VMs to share resources efficiently.
- **D.** Use a dedicated /28 subnet that contains no other resources and has a purpose of PRIVATE. — _correct answer_

## Question 78

**Domain:** Building and testing applications

**Question:** You are setting up automated integration testing in Cloud Build for a microservices application. Your test suite generates JUnit XML test reports that need to be preserved for analysis regardless of whether the tests pass or fail. The reports should be accessible after the build completes. What should you configure in your build config file?

**Correct answer:** D. Add an 'artifacts' section with 'objects' specifying the Cloud Storage location and paths to the test report XML files generated during the test step.

**Options:**

- **A.** Add a final build step that uses gsutil to copy the test reports to Cloud Storage, and set 'allowFailure: true' on this step to ensure it runs even if tests fail.
- **B.** Configure the test step to stream logs directly to Cloud Logging by setting 'logStreamingOption: STREAM_ON' in the build options, which automatically captures test reports.
- **C.** Configure the 'images' field in the build config to push the test reports as a container image layer to Artifact Registry for persistent storage.
- **D.** Add an 'artifacts' section with 'objects' specifying the Cloud Storage location and paths to the test report XML files generated during the test step. — _correct answer_

## Question 79

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application on GKE and need to analyze trends in your application logs using SQL queries. Your log bucket stores logs from multiple namespaces. You want to use Log Analytics to run SQL queries that identify patterns in error rates by namespace over the past week. What should you do first?

**Correct answer:** D. Upgrade the log bucket to use Log Analytics and query using the Log Analytics page with SQL against the log view.

**Options:**

- **A.** Export logs to Cloud Storage using a sink and use Dataflow to process the JSON log files for pattern analysis.
- **B.** Create a linked BigQuery dataset for the log bucket and run SQL queries directly in BigQuery Studio.
- **C.** Create log-based distribution metrics for each namespace and chart the metrics in Cloud Monitoring.
- **D.** Upgrade the log bucket to use Log Analytics and query using the Log Analytics page with SQL against the log view. — _correct answer_

## Question 80

**Domain:** Building and testing applications

**Question:** You need to determine programmatically within your application code whether it is running inside Cloud Shell or in another environment. This check will enable specific debugging features only when running in Cloud Shell. What is the most reliable method to detect the Cloud Shell environment?

**Correct answer:** A. Check if the CLOUD_SHELL environment variable is set to true in your application code.

**Options:**

- **A.** Check if the CLOUD_SHELL environment variable is set to true in your application code. — _correct answer_
- **B.** Check if the hostname contains devshell in its name to identify Cloud Shell instances.
- **C.** Check if the GOOGLE_CLOUD_PROJECT environment variable is set and contains a valid project ID.
- **D.** Parse the output of the gcloud config list command to identify Cloud Shell-specific configurations.

## Question 81

**Domain:** Deploying applications

**Question:** Your company's production Cloud Run services are experiencing intermittent failures after a secret rotation. Investigation reveals that a new secret version was added with an invalid value. You need to prevent similar production incidents while still supporting secret updates. What should you do?

**Correct answer:** D. Pin secrets to specific version numbers in your Cloud Run deployment configuration, and update version numbers through your standard release process.

**Options:**

- **A.** Mount all secrets as volumes instead of environment variables to automatically receive secret updates without redeployment.
- **B.** Always use the 'latest' alias for secrets and implement application-level error handling to fall back to cached values when secrets fail.
- **C.** Configure Secret Manager delayed destruction on secrets so invalid versions can be restored before impacting services.
- **D.** Pin secrets to specific version numbers in your Cloud Run deployment configuration, and update version numbers through your standard release process. — _correct answer_

## Question 82

**Domain:** Building and testing applications

**Question:** You are developing a Python application locally that needs to access Cloud Storage buckets. Your application uses the Google Cloud Client Libraries and relies on Application Default Credentials (ADC) for authentication. You have set the GOOGLE_APPLICATION_CREDENTIALS environment variable to point to a service account key file. However, you previously ran 'gcloud auth application-default login' with your user account. Which credentials will ADC use when your application runs?

**Correct answer:** A. ADC will use the credentials from the service account key file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable.

**Options:**

- **A.** ADC will use the credentials from the service account key file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable. — _correct answer_
- **B.** ADC will combine permissions from both the service account key and user credentials to provide maximum access to Cloud Storage.
- **C.** ADC will prompt the user to select which credentials to use since both are configured in the environment.
- **D.** ADC will use the user credentials from the local ADC file created by 'gcloud auth application-default login' since it was configured more recently.

## Question 83

**Domain:** Deploying applications

**Question:** You are deploying a web application on GKE that requires users to maintain their session state during interactions. The application is exposed via an external Ingress. You need to configure the load balancer to route requests from the same client to the same backend Pod when possible. What should you do?

**Correct answer:** D. Create a BackendConfig resource with session affinity configuration, and reference it in your Service using the beta.cloud.google.com/backend-config annotation.

**Options:**

- **A.** Modify your Ingress manifest to add the kubernetes.io/ingress.session-affinity annotation with the value 'CLIENT_IP' to enable client IP-based session affinity.
- **B.** Add the sessionAffinity: ClientIP field to your Service specification and set externalTrafficPolicy to Local to ensure client IP preservation for session affinity.
- **C.** Create a FrontendConfig resource with session affinity configuration, and reference it in your Ingress using the networking.gke.io/v1beta1.FrontendConfig annotation.
- **D.** Create a BackendConfig resource with session affinity configuration, and reference it in your Service using the beta.cloud.google.com/backend-config annotation. — _correct answer_

## Question 84

**Domain:** Integrating applications with Google Cloud services

**Question:** You have a read-heavy application running on Google Cloud that uses Cloud SQL for MySQL as its database. You want to improve read performance by creating read replicas to distribute the read workload. Before creating the first read replica, which configuration must be enabled on the primary instance?

**Correct answer:** D. Enable automated backups and binary logging on the primary instance.

**Options:**

- **A.** Enable high availability configuration on the primary instance.
- **B.** Enable Private Service Connect on the primary instance.
- **C.** Configure the primary instance to use the Cloud SQL Enterprise Plus edition.
- **D.** Enable automated backups and binary logging on the primary instance. — _correct answer_

## Question 85

**Domain:** Building and testing applications

**Question:** You are building a production Java application using Cloud Build and storing images in Artifact Registry. Your Dockerfile uses a multi-stage build with a Maven builder stage and a minimal runtime stage. After building the image, you notice it is not displayed in the Cloud Build results page even though it was pushed successfully. What should you do to ensure the image appears in build results?

**Correct answer:** C. Add the images field to your build config file listing the final image path in Artifact Registry after the docker push build step.

**Options:**

- **A.** Enable the artifact metadata logging option in Cloud Build project settings to automatically track pushed images.
- **B.** Configure the Artifact Registry repository to send Pub/Sub notifications and create a Cloud Function to update build results.
- **C.** Add the images field to your build config file listing the final image path in Artifact Registry after the docker push build step. — _correct answer_
- **D.** Replace the docker push command with the docker build command and remove the manual push step from your configuration.

## Question 86

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization is using Cloud SQL for PostgreSQL Enterprise Plus edition with Managed Connection Pooling enabled. You are experiencing performance issues with an application that uses prepared statements extensively. Which configuration should you apply to resolve this issue?

**Correct answer:** B. Set the pool_mode to session pooling instead of the default transaction pooling mode to maintain session state required for prepared statements across multiple queries.

**Options:**

- **A.** Connect directly to port 5432 to bypass Managed Connection Pooling entirely while keeping the feature enabled for other applications.
- **B.** Set the pool_mode to session pooling instead of the default transaction pooling mode to maintain session state required for prepared statements across multiple queries. — _correct answer_
- **C.** Increase the max_pool_size parameter to allocate more connections in the pool, allowing prepared statements to be distributed across more available connections.
- **D.** Disable Managed Connection Pooling and configure application-level connection pooling with PgBouncer deployed as a sidecar container.

## Question 87

**Domain:** Deploying applications

**Question:** You are developing a microservices application on GKE. Your team needs to add metadata to application logs to enable more effective searching and filtering in Cloud Logging. You want to implement logging using Google-recommended best practices with minimal code changes. What should you do?

**Correct answer:** C. Update your application to write logs to stdout in JSON format with the necessary metadata fields such as severity and message.

**Options:**

- **A.** Update your application to write logs to a file on a persistent volume, and configure the GKE logging agent to read from that file path.
- **B.** Configure a custom Fluentd sidecar container in each Pod to collect logs from a shared volume and forward them to Cloud Logging.
- **C.** Update your application to write logs to stdout in JSON format with the necessary metadata fields such as severity and message. — _correct answer_
- **D.** Install the Cloud Logging client library in your application and configure it to call the Cloud Logging API directly to write structured logs.

## Question 88

**Domain:** Deploying applications

**Question:** Your team is building container images using Cloud Build and needs to push them to an Artifact Registry repository located in a different Google Cloud project. Builds are failing with permission denied errors. What should you do to enable Cloud Build to push images to the Artifact Registry repository in the other project?

**Correct answer:** A. Grant the Artifact Registry Writer role to the Cloud Build service account on the target project containing the Artifact Registry repository.

**Options:**

- **A.** Grant the Artifact Registry Writer role to the Cloud Build service account on the target project containing the Artifact Registry repository. — _correct answer_
- **B.** Create a VPC Service Controls perimeter that includes both projects to allow secure communication between Cloud Build and Artifact Registry.
- **C.** Configure a Pub/Sub topic in the target project to trigger an image copy when Cloud Build completes successfully in the source project.
- **D.** Enable the Artifact Registry API in the Cloud Build project and re-run the build to automatically provision cross-project permissions.

## Question 89

**Domain:** Integrating applications with Google Cloud services

**Question:** You have deployed an API using API Gateway with an OpenAPI 3.x specification. Your specification includes parameter definitions with required fields and data type validations. API consumers report that requests with invalid parameter types are still reaching your backend. What is the reason for this behavior?

**Correct answer:** D. API Gateway accepts OpenAPI documents with parameter and type definitions but does not enforce them at runtime. It forwards incoming requests to your API regardless of these definitions.

**Options:**

- **A.** Parameter validation is disabled by default in API Gateway and must be enabled by adding the x-google-validate-parameters extension to your specification.
- **B.** The API config was not redeployed after updating the OpenAPI specification with parameter validations, so the gateway is using an older configuration.
- **C.** The OpenAPI 3.x specification you deployed contains syntax errors that prevent parameter validation from being activated.
- **D.** API Gateway accepts OpenAPI documents with parameter and type definitions but does not enforce them at runtime. It forwards incoming requests to your API regardless of these definitions. — _correct answer_

## Question 90

**Domain:** Deploying applications

**Question:** Your development team is building a CI/CD pipeline using Cloud Build to deploy container images to a GKE cluster in a different Google Cloud project. Cloud Build and GKE are in separate projects. The GKE cluster uses the Compute Engine default service account to pull images from Artifact Registry. What should you do to allow GKE to pull images from Artifact Registry?

**Correct answer:** D. Grant the Artifact Registry Reader role to the Compute Engine default service account of the GKE project on the Artifact Registry repository in the build project.

**Options:**

- **A.** Configure VPC Network Peering between the two projects to enable private connectivity to Artifact Registry repositories.
- **B.** Grant the Storage Object Viewer role to the GKE service account on the Cloud Storage bucket backing the Artifact Registry repository.
- **C.** Create an imagePullSecret in the GKE cluster using a service account key from the build project and configure all Pod specifications to reference the secret.
- **D.** Grant the Artifact Registry Reader role to the Compute Engine default service account of the GKE project on the Artifact Registry repository in the build project. — _correct answer_

## Question 91

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing an API on Cloud Run for a payment processing application that requires minimal cold start latency. The application uses Spring Boot and must execute background tasks to report transaction telemetry after returning responses. You want to optimize startup performance while ensuring background tasks complete successfully. What should you do?

**Correct answer:** C. Configure the service with instance-based billing by using the --no-cpu-throttling flag, set minimum instances to at least 1, and enable startup CPU boost.

**Options:**

- **A.** Configure the service with instance-based billing, set minimum instances to 0 to minimize costs, and enable startup CPU boost.
- **B.** Configure the service with request-based billing, set minimum instances to at least 1, and enable startup CPU boost.
- **C.** Configure the service with instance-based billing by using the --no-cpu-throttling flag, set minimum instances to at least 1, and enable startup CPU boost. — _correct answer_
- **D.** Configure the service with request-based billing, set maximum instances to limit scaling, and disable startup CPU boost to reduce costs.

## Question 92

**Domain:** Deploying applications

**Question:** You are developing a microservices application running on GKE. Your application currently outputs plain text logs to stdout. You need to enhance your logging to enable efficient searching by specific fields like request_id and user_id in Cloud Logging. You want to implement this with the least code changes possible. What should you do?

**Correct answer:** D. Update your application to output logs in JSON format to stdout, including request_id and user_id as JSON fields.

**Options:**

- **A.** Install and configure the Cloud Logging client library to directly send logs to the Cloud Logging API instead of using stdout.
- **B.** Create a custom Fluentd configuration and deploy it as a DaemonSet to parse your text logs into structured fields.
- **C.** Configure a log sink to export logs to BigQuery and create views that parse the text fields into columns.
- **D.** Update your application to output logs in JSON format to stdout, including request_id and user_id as JSON fields. — _correct answer_

## Question 93

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that references a secret from Secret Manager. During deployment, you want to ensure the service fails fast if the secret configuration is invalid. You also want to prevent instances from starting if the secret value cannot be retrieved. How should you configure the secret?

**Correct answer:** B. Expose the secret as an environment variable by specifying the secret name and version in the --update-secrets flag with the ENV_VAR_NAME=SECRET_NAME:VERSION format.

**Options:**

- **A.** Mount the secret as a volume by specifying a file path starting with a leading slash in the --update-secrets flag with the PATH=SECRET_NAME:VERSION format.
- **B.** Expose the secret as an environment variable by specifying the secret name and version in the --update-secrets flag with the ENV_VAR_NAME=SECRET_NAME:VERSION format. — _correct answer_
- **C.** Configure the secret in the Cloud Build configuration file and pass it to Cloud Run during the build process as a build argument.
- **D.** Store the secret value directly in the container image environment and reference it using Dockerfile ENV instructions.

## Question 94

**Domain:** Integrating applications with Google Cloud services

**Question:** You are operating a microservices application on GKE. You need to create an alerting policy that notifies your on-call team when container memory utilization exceeds 85% for more than 5 minutes. You also want to ensure that notifications are delivered reliably even if one delivery channel experiences issues. What should you do?

**Correct answer:** B. Create a metric-based alerting policy with a threshold condition on the kubernetes.io/container/memory/used_bytes metric. Configure a 5-minute retest window. Add multiple notification channels of different types, such as email and Slack.

**Options:**

- **A.** Create an SLO-based alerting policy that monitors container memory as a service-level indicator. Configure an error budget burn rate alert. Add an SMS notification channel.
- **B.** Create a metric-based alerting policy with a threshold condition on the kubernetes.io/container/memory/used_bytes metric. Configure a 5-minute retest window. Add multiple notification channels of different types, such as email and Slack. — _correct answer_
- **C.** Create a log-based alerting policy that searches for memory warning messages in container logs. Set the notification cooldown period to 5 minutes. Configure a single PagerDuty notification channel.
- **D.** Create a metric-based alerting policy with a metric-absence condition for memory metrics. Configure a 5-minute alignment period. Add a Pub/Sub notification channel that triggers a Cloud Function.

## Question 95

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have a Cloud Run application that uses Memorystore for Redis with the default volatile-lru eviction policy. Recently, your application has been experiencing cache misses even though the data was written to the cache. Upon investigation, you notice that when the instance reaches the maxmemory-gb limit, no keys are being evicted. What is the most likely cause of this issue?

**Correct answer:** D. Your application is not setting TTL values on keys, and volatile-lru only evicts keys that have a TTL set.

**Options:**

- **A.** The volatile-lru policy was deprecated and replaced with allkeys-lru in recent Memorystore versions.
- **B.** The Cloud Run service is in a different region than the Memorystore instance, causing connection timeouts.
- **C.** The Memorystore instance size is too small, and you need to scale up the instance immediately.
- **D.** Your application is not setting TTL values on keys, and volatile-lru only evicts keys that have a TTL set. — _correct answer_

## Question 96

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an internal application hosted on Compute Engine behind an HTTPS load balancer with Identity-Aware Proxy (IAP) enabled. Your application needs to securely retrieve the authenticated user's identity. A security audit has raised concerns that if IAP were accidentally disabled or bypassed, the application could accept forged identity headers. How should you securely obtain the user's identity in your application?

**Correct answer:** A. Retrieve and verify the X-Goog-IAP-JWT-Assertion header using IAP's public keys, and extract the user identity from the validated JWT claims.

**Options:**

- **A.** Retrieve and verify the X-Goog-IAP-JWT-Assertion header using IAP's public keys, and extract the user identity from the validated JWT claims. — _correct answer_
- **B.** Store the IAP OAuth 2.0 client secret in your application and validate incoming requests against it to confirm user authentication.
- **C.** Configure your load balancer to reject requests that do not contain the X-Goog-Authenticated-User-ID header, then read the user identity from this header.
- **D.** Read the user's email from the X-Goog-Authenticated-User-Email header and use it directly to identify the user throughout the application.

## Question 97

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company has multiple projects organized into separate VPC Service Controls perimeters for regulatory compliance. A new data processing pipeline requires a project in the data-collection perimeter to write processed results to a Cloud Storage bucket in the analytics perimeter. You want to implement the most granular access control while following Google-recommended best practices. What should you do?

**Correct answer:** C. Configure an egress rule on the data-collection perimeter and an ingress rule on the analytics perimeter, specifying the service account and the Cloud Storage API method.

**Options:**

- **A.** Add both projects to the same service perimeter to allow free communication between the data-collection and analytics resources.
- **B.** Create a perimeter bridge between the data-collection and analytics perimeters to allow bidirectional communication between the projects.
- **C.** Configure an egress rule on the data-collection perimeter and an ingress rule on the analytics perimeter, specifying the service account and the Cloud Storage API method. — _correct answer_
- **D.** Create an access level that grants the service account access to both perimeters and apply it to both service perimeters.

## Question 98

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing an internal web application deployed on GKE that is secured by Identity-Aware Proxy (IAP). Your security team requires that your application validate the authenticated user's identity to prevent potential attacks from users who might bypass the load balancer. What should you do to securely retrieve the user's identity?

**Correct answer:** D. Verify the cryptographically signed JWT in the X-Goog-Iap-Jwt-Assertion header, then extract the user's email and ID from the validated token.

**Options:**

- **A.** Store the OAuth 2.0 access token from IAP in session storage and use it to authenticate subsequent API requests to your backend services.
- **B.** Read the user's email address from the X-Goog-Authenticated-User-Email header without additional validation since IAP has already authenticated the user.
- **C.** Configure your GKE cluster to only accept traffic from the IAP IP range using firewall rules, eliminating the need for additional identity verification.
- **D.** Verify the cryptographically signed JWT in the X-Goog-Iap-Jwt-Assertion header, then extract the user's email and ID from the validated token. — _correct answer_

## Question 99

**Domain:** Building and testing applications

**Question:** Your development team uses VS Code with Cloud Code to develop Kubernetes applications. The application calls Google Cloud APIs during local development, and developers are receiving authentication errors when debugging. You want developers to authenticate their local environment to access Google Cloud services without embedding service account keys in the code. What should each developer do?

**Correct answer:** D. Run gcloud auth application-default login to configure Application Default Credentials, which Cloud Code uses automatically when debugging applications that call Google Cloud APIs.

**Options:**

- **A.** Configure the Cloud Code extension settings to store Google Cloud project credentials and enable automatic token refresh in the VS Code settings.json file.
- **B.** Install the gcloud CLI and run gcloud auth login, then set the active project using gcloud config set project to enable Cloud Code debugging authentication.
- **C.** Create a service account key JSON file and set the GOOGLE_APPLICATION_CREDENTIALS environment variable in the VS Code terminal before each debugging session.
- **D.** Run gcloud auth application-default login to configure Application Default Credentials, which Cloud Code uses automatically when debugging applications that call Google Cloud APIs. — _correct answer_

## Question 100

**Domain:** Building and testing applications

**Question:** You have deployed a new Cloud Run revision using a tag named 'canary' with the --no-traffic flag. After testing at the tagged URL, you want to gradually increase traffic from 5% to 25% to 100% over several days while monitoring for errors. What is the correct sequence of commands to accomplish this gradual rollout?

**Correct answer:** C. Run gcloud run services update-traffic SERVICE --to-tags canary=5, then canary=25, then canary=100, monitoring between each step.

**Options:**

- **A.** Run gcloud run deploy with different --traffic percentages for each step, redeploying the same image each time.
- **B.** Run gcloud run services update-traffic SERVICE --to-revisions LATEST=5, then LATEST=25, then LATEST=100.
- **C.** Run gcloud run services update-traffic SERVICE --to-tags canary=5, then canary=25, then canary=100, monitoring between each step. — _correct answer_
- **D.** Delete the old revision after each traffic percentage increase to force traffic to the new revision.

## Question 101

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your mobile application uses Cloud Firestore with documents that contain a timestamp field updated on every edit. You are experiencing high write latency and elevated storage costs. Investigation reveals that the timestamp field has monotonically increasing values and is not used in any queries. What should you do to address these issues?

**Correct answer:** D. Create a single-field index exemption for the timestamp field to remove it from automatic indexing.

**Options:**

- **A.** Convert the timestamp to a string format to change how Firestore indexes the value.
- **B.** Delete the timestamp field from all documents to eliminate the index entries.
- **C.** Create a composite index that includes the timestamp field with other frequently queried fields.
- **D.** Create a single-field index exemption for the timestamp field to remove it from automatic indexing. — _correct answer_

## Question 102

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Java Spring Boot API to Cloud Run. Users report experiencing occasional slow response times, particularly for the first request after periods of inactivity. You need to minimize cold start latency while keeping operational costs reasonable. The service experiences unpredictable traffic patterns with long idle periods. What combination of settings should you apply?

**Correct answer:** A. Enable startup CPU boost and configure minimum instances to 1 with request-based billing.

**Options:**

- **A.** Enable startup CPU boost and configure minimum instances to 1 with request-based billing. — _correct answer_
- **B.** Configure instance-based billing with maximum instances set to 1 to dedicate resources to a single instance.
- **C.** Set maximum concurrency to 1000 to ensure a single instance handles all requests without requiring additional cold starts.
- **D.** Disable startup CPU boost and configure minimum instances to 10 with instance-based billing.

## Question 103

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a REST API on Cloud Run that processes image transformations. Your application code is single-threaded and uses 4 vCPUs to meet memory requirements. During load testing, you notice that the service is not scaling properly despite high request latency. The Cloud Monitoring dashboard shows low average CPU utilization even under heavy load. What should you do to improve the autoscaling behavior?

**Correct answer:** A. Lower the maximum concurrency setting to force Cloud Run to scale based on request throughput rather than CPU utilization.

**Options:**

- **A.** Lower the maximum concurrency setting to force Cloud Run to scale based on request throughput rather than CPU utilization. — _correct answer_
- **B.** Reduce the CPU allocation from 4 vCPUs to 1 vCPU to better match the single-threaded nature of the application and improve scaling metrics.
- **C.** Enable instance-based billing to ensure CPU is always available and autoscaling responds to actual load.
- **D.** Increase the maximum concurrency setting to 1000 to allow more requests per instance and improve throughput.

## Question 104

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company has deployed an internal web application on Google Kubernetes Engine behind an HTTPS load balancer. You have enabled Identity-Aware Proxy (IAP) to control access. A security audit reveals that an attacker who bypasses the load balancer could potentially forge identity headers. You need to ensure your application verifies user identities securely. What should you do?

**Correct answer:** B. Verify the x-goog-iap-jwt-assertion header in your application code by validating the JWT signature using Google's public keys and checking the audience claim.

**Options:**

- **A.** Read the x-goog-authenticated-user-email header directly in your application to retrieve the authenticated user's email address for authorization decisions.
- **B.** Verify the x-goog-iap-jwt-assertion header in your application code by validating the JWT signature using Google's public keys and checking the audience claim. — _correct answer_
- **C.** Grant the IAP-secured Web App User role only to specific users and rely on IAP's authentication to validate all requests.
- **D.** Configure VPC firewall rules to block all traffic that does not originate from the load balancer's IP address range.

## Question 105

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that processes Cloud Storage object listings. Your JSON API list request includes pagination and returns a response with nextPageToken. When you make the subsequent request with the pageToken parameter, you receive an HTTP 400 Bad Request error. What is the most likely cause of this error?

**Correct answer:** C. The pageToken value was modified or truncated when passed to the subsequent request, making it invalid for use with the API.

**Options:**

- **A.** The maxResults parameter in the subsequent request was set to a different value than the original request that generated the token.
- **B.** The time between the initial request and the subsequent request exceeded the token expiration period of 60 seconds.
- **C.** The pageToken value was modified or truncated when passed to the subsequent request, making it invalid for use with the API. — _correct answer_
- **D.** The bucket name in the subsequent request was different from the bucket specified in the original request that generated the token.

## Question 106

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a news feed application using Firestore that displays articles to millions of concurrent users. Each article document is updated frequently with view counts and comments. Users report slow load times and inconsistent data during peak traffic. You need to optimize your real-time queries for better performance at scale. What should you do?

**Correct answer:** D. Separate frequently updated fields like view counts into a subcollection and use separate listeners, reducing the frequency of updates to the main article documents.

**Options:**

- **A.** Enable Firestore indexes on all article fields to improve query performance and reduce latency during high-traffic periods.
- **B.** Increase the number of Firestore instances by enabling multi-region replication to distribute the read load across more geographic regions.
- **C.** Configure all snapshot listeners to use source: cache to reduce server load and periodically call getDocsFromServer() to refresh the cache manually.
- **D.** Separate frequently updated fields like view counts into a subcollection and use separate listeners, reducing the frequency of updates to the main article documents. — _correct answer_

## Question 107

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring JWT-based authentication for your API Gateway. Users authenticate through your custom identity provider which issues JWTs. You need to configure API Gateway to validate these tokens. Which elements must be configured in your OpenAPI specification for JWT validation to work correctly?

**Correct answer:** D. Configure securityDefinitions with type 'oauth2', x-google-issuer with your identity provider's issuer URL, and x-google-jwks_uri with the URL to your identity provider's public keys.

**Options:**

- **A.** Configure securityDefinitions with the JWT signing secret in x-google-jwt-secret and set x-google-issuer to match the token's issuer claim.
- **B.** Configure securityDefinitions with type 'apiKey' and add a custom x-google-jwt-validation extension that references your identity provider's configuration endpoint.
- **C.** Add the JWT validation logic in the x-google-backend extension using the jwt_audience field to specify accepted audience values for token validation.
- **D.** Configure securityDefinitions with type 'oauth2', x-google-issuer with your identity provider's issuer URL, and x-google-jwks_uri with the URL to your identity provider's public keys. — _correct answer_

## Question 108

**Domain:** Building and testing applications

**Question:** You are using Cloud Code for VS Code to develop a multi-service Kubernetes application. You want to improve your local development workflow by only building and deploying the frontend service you are actively working on, while still maintaining dependencies with the backend services. How should you configure your project?

**Correct answer:** A. Define Skaffold modules in your skaffold.yaml file by naming each configuration with the metadata.name field, then select specific modules to build in the Cloud Code run configuration.

**Options:**

- **A.** Define Skaffold modules in your skaffold.yaml file by naming each configuration with the metadata.name field, then select specific modules to build in the Cloud Code run configuration. — _correct answer_
- **B.** Configure multiple .vscode/launch.json configurations with different container image names and manually switch between configurations when working on different services.
- **C.** Create separate VS Code workspaces for each service and use VS Code's multi-root workspace feature to switch between frontend and backend development contexts.
- **D.** Set the SKAFFOLD_BUILD_ONLY environment variable to the frontend service name before starting your debug session to limit the build scope.

## Question 109

**Domain:** Deploying applications

**Question:** You are configuring continuous deployment to Cloud Run using Cloud Build. Your application source code is stored in a GitHub repository, and you want Cloud Build to automatically build a Docker image and deploy it whenever changes are pushed. You need to ensure the Docker repository exists before pushing images. What must you do before configuring the Cloud Build pipeline to push images to Artifact Registry?

**Correct answer:** A. Create an Artifact Registry Docker repository in the target region, as repositories must exist before pushing images.

**Options:**

- **A.** Create an Artifact Registry Docker repository in the target region, as repositories must exist before pushing images. — _correct answer_
- **B.** Configure the cloudbuild.yaml with a repository-create step that runs before the docker build step.
- **C.** Grant the Artifact Registry Administrator role to the Cloud Build service account to allow automatic repository creation.
- **D.** Enable the Container Registry API, which automatically creates the required repository when the first image is pushed.

## Question 110

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your team is deploying a Java Spring Boot API on Cloud Run that has a container startup time of approximately 30 seconds due to dependency initialization. Users are reporting slow response times when the service scales from zero. You need to reduce cold start latency while maintaining cost efficiency. What combination of settings should you configure?

**Correct answer:** A. Enable startup CPU boost and set minimum instances to 1 with request-based billing.

**Options:**

- **A.** Enable startup CPU boost and set minimum instances to 1 with request-based billing. — _correct answer_
- **B.** Configure instance-based billing with minimum instances set to 0 to allow scaling to zero with faster startups.
- **C.** Enable startup CPU boost and set maximum instances to a high value to ensure rapid scaling.
- **D.** Set maximum concurrency to 1000 and enable startup CPU boost to handle more requests during scaling.

## Question 111

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization stores sensitive healthcare data in Cloud Storage and BigQuery. You need to implement VPC Service Controls to prevent data exfiltration while ensuring developers can still test perimeter configurations without blocking legitimate traffic. You want to minimize disruption to existing workloads during the implementation. What should you do?

**Correct answer:** A. Create a service perimeter in dry run mode with the required projects and restricted services. Review the audit logs for policy violations, then switch to enforced mode after validation.

**Options:**

- **A.** Create a service perimeter in dry run mode with the required projects and restricted services. Review the audit logs for policy violations, then switch to enforced mode after validation. — _correct answer_
- **B.** Create two identical service perimeters, one for production and one for testing. Test all configurations in the testing perimeter before applying them to the production perimeter.
- **C.** Create a service perimeter in enforced mode with the required projects and restricted services. Configure ingress rules to allow all traffic during the testing phase to avoid blocking requests.
- **D.** Deploy a new VPC network with Private Google Access enabled and migrate all services before creating the perimeter. This ensures no disruption occurs during perimeter creation.

## Question 112

**Domain:** Integrating applications with Google Cloud services

**Question:** Your company uses API Gateway to expose APIs to external clients. The security team requires that API keys be used to track usage and enforce quotas, and the keys must be restricted so they can only be used with your specific API. How should you configure API key restrictions?

**Correct answer:** A. Create API keys in the Google Cloud console, then add API restrictions to each key by selecting your API's title from the list of available APIs on the API key detail page.

**Options:**

- **A.** Create API keys in the Google Cloud console, then add API restrictions to each key by selecting your API's title from the list of available APIs on the API key detail page. — _correct answer_
- **B.** Set the 'in' property to 'header' and the 'name' property to a custom header name in your securityDefinitions to automatically restrict keys to your API.
- **C.** Configure the x-google-api-key-restrictions field in your OpenAPI specification to list the allowed API key IDs for your API.
- **D.** Deploy the API with a unique service name and configure IAM policies to restrict which service accounts can use API keys with that service.

## Question 113

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building an inventory management system where the UI must reflect added, modified, and removed items in real-time. You need to implement efficient UI updates by processing only the specific changes rather than reloading the entire dataset. How should you implement this?

**Correct answer:** A. Use the snapshot.docChanges() method in your onSnapshot() callback and handle each change based on its type property (added, modified, or removed).

**Options:**

- **A.** Use the snapshot.docChanges() method in your onSnapshot() callback and handle each change based on its type property (added, modified, or removed). — _correct answer_
- **B.** Attach separate listeners for create, update, and delete operations on the collection to track changes independently.
- **C.** Use Firestore Triggers with Cloud Functions to maintain a separate changelog collection and listen to that collection for updates.
- **D.** Maintain a local hash of document IDs and compare the full snapshot against it on each callback to determine which documents changed.

## Question 114

**Domain:** Deploying applications

**Question:** You are deploying a microservices application to GKE that requires database credentials and API keys. Your security team mandates that sensitive data must be encrypted at rest and access must be controlled through IAM policies. You also need to audit when secrets are accessed. What should you do?

**Correct answer:** D. Store the secrets in Secret Manager and use Workload Identity Federation for GKE to authenticate your application to access them via the Secret Manager API.

**Options:**

- **A.** Create Kubernetes Secrets with the data encoded in base64 and enable application-layer secrets encryption with Cloud KMS on your GKE cluster.
- **B.** Store the secrets as environment variables directly in your Deployment manifests and encrypt the manifests using Cloud KMS before storing them in your Git repository.
- **C.** Store the credentials in ConfigMaps and restrict access using Kubernetes RBAC policies on the namespace.
- **D.** Store the secrets in Secret Manager and use Workload Identity Federation for GKE to authenticate your application to access them via the Secret Manager API. — _correct answer_

## Question 115

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are designing a Cloud Bigtable schema for an IoT application that stores sensor readings from 10,000 devices. Each device sends temperature data every second with a timestamp. Your application primarily queries all readings for a specific device within a time range. You notice severe performance degradation. What is the most likely cause and solution?

**Correct answer:** A. The row key starts with a timestamp, causing hotspots. Redesign the row key to use the device ID as the prefix followed by the timestamp.

**Options:**

- **A.** The row key starts with a timestamp, causing hotspots. Redesign the row key to use the device ID as the prefix followed by the timestamp. — _correct answer_
- **B.** The table is too large. Split the data into multiple tables based on device ID to improve query performance.
- **C.** The instance has too few nodes. Add more nodes to the cluster to distribute the workload across additional servers.
- **D.** The column families are incorrectly configured. Create separate column families for each device to improve query performance.

## Question 116

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an application that lists objects in a Cloud Storage bucket and only needs the object names and sizes to generate a report. Each API response is taking too long due to the large amount of metadata returned for each object. You need to optimize the API calls to reduce response time and data transfer while using the JSON API. What should you do?

**Correct answer:** D. Use the fields parameter to request a partial response containing only the items(name,size) and nextPageToken fields.

**Options:**

- **A.** Decrease the maxResults parameter to return fewer objects per request, reducing the response size of each API call.
- **B.** Use the prefix parameter with a filter pattern to limit the objects returned to only those matching specific naming criteria.
- **C.** Set the projection parameter to noAcl to exclude access control metadata from the response objects.
- **D.** Use the fields parameter to request a partial response containing only the items(name,size) and nextPageToken fields. — _correct answer_

## Question 117

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a product catalog application using Cloud Firestore. Your application needs to query products by category and filter by price range while sorting by rating in descending order. When you execute this query, you receive an error. What is the most likely cause of this error and how should you resolve it?

**Correct answer:** C. Create a composite index with fields for category (ascending), price (ascending), and rating (descending). Use the link provided in the error message to create the index in the Firebase console.

**Options:**

- **A.** Increase the Firestore read quota to handle the multi-field query. Submit a quota increase request through the Google Cloud console and retry the query after approval.
- **B.** Enable single-field index exemptions for the category, price, and rating fields to allow the query to execute without composite indexes.
- **C.** Create a composite index with fields for category (ascending), price (ascending), and rating (descending). Use the link provided in the error message to create the index in the Firebase console. — _correct answer_
- **D.** Modify the query to use separate collection queries for each filter condition, then merge the results in application code to work around index limitations.

## Question 118

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is building an IoT platform that stores sensor readings from millions of devices in Cloud Bigtable. Each reading contains a device ID, timestamp, and multiple sensor metrics. You need to design a row key schema that supports efficient queries by device ID over time ranges while avoiding hotspots. Which row key design should you use?

**Correct answer:** C. Use deviceId#timestamp as the row key, with deviceId as a high-cardinality prefix followed by the timestamp.

**Options:**

- **A.** Use timestamp#deviceId as the row key, with the timestamp as the prefix for chronological ordering.
- **B.** Hash the deviceId to create a random prefix followed by the timestamp for maximum distribution.
- **C.** Use deviceId#timestamp as the row key, with deviceId as a high-cardinality prefix followed by the timestamp. — _correct answer_
- **D.** Use only the timestamp as the row key and store deviceId as a column value for flexible filtering.

## Question 119

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You have a GKE application that needs to access a Google Cloud API with limitations when using federated identities directly. You must use service account impersonation to access this API. You have already created a Google Cloud service account with the necessary API permissions. What additional configuration is required to allow your Kubernetes ServiceAccount to impersonate this IAM service account?

**Correct answer:** D. Grant the Workload Identity User role (roles/iam.workloadIdentityUser) on the IAM service account to the Kubernetes ServiceAccount principal identifier.

**Options:**

- **A.** Create a Kubernetes Secret containing the IAM service account key and mount it into the Pod. Configure Application Default Credentials to use this key file.
- **B.** Grant the Service Account User role (roles/iam.serviceAccountUser) to the Google Cloud service account on the GKE cluster resource.
- **C.** Add an annotation to the Kubernetes ServiceAccount with the IAM service account email and grant the Service Account Token Creator role to the cluster's service agent.
- **D.** Grant the Workload Identity User role (roles/iam.workloadIdentityUser) on the IAM service account to the Kubernetes ServiceAccount principal identifier. — _correct answer_

## Question 120

**Domain:** Building and testing applications

**Question:** A development team is building a microservices application for GKE and wants to enable individual developers to work on specific microservices without having to build and deploy the entire application. The team uses Cloud Code in IntelliJ. What should they configure to support this workflow?

**Correct answer:** C. Configure Skaffold modules by giving each microservice a name using the .metadata.name field in skaffold.yaml, then select specific modules to build and deploy in the Cloud Code Run configuration.

**Options:**

- **A.** Create separate Google Cloud projects for each microservice and configure Cloud Code to switch between projects when developers need to work on different services.
- **B.** Configure separate GKE clusters for each microservice and use Cloud Code's cluster selector to deploy to the appropriate cluster for each developer.
- **C.** Configure Skaffold modules by giving each microservice a name using the .metadata.name field in skaffold.yaml, then select specific modules to build and deploy in the Cloud Code Run configuration. — _correct answer_
- **D.** Create individual VS Code workspaces for each microservice with separate skaffold.yaml files that cannot reference each other or define dependencies.

## Question 121

**Domain:** Integrating applications with Google Cloud services

**Question:** You are building a chat application using Firestore real-time listeners. Users report that their messages sometimes appear twice briefly before consolidating into a single message. You need to update your listener to distinguish between locally written data and server-confirmed data. What should you do?

**Correct answer:** C. Check the metadata.hasPendingWrites property on each document to determine if the data has local changes not yet written to the backend.

**Options:**

- **A.** Implement a debounce function in your UI layer that waits 500ms after receiving a document change before rendering the message to allow duplicates to resolve.
- **B.** Use the fromCache property on the snapshot metadata to filter out cached writes and only display messages that have been confirmed by the server.
- **C.** Check the metadata.hasPendingWrites property on each document to determine if the data has local changes not yet written to the backend. — _correct answer_
- **D.** Configure the listener with includeMetadataChanges set to false to prevent receiving events for locally written data before server confirmation.

## Question 122

**Domain:** Building and testing applications

**Question:** Your Cloud Run service is running a stable revision. You deployed a new revision tagged 'canary' that is currently receiving 10% of production traffic. After monitoring Cloud Logging and Error Reporting, you confirm the new revision is performing well. You want to increase traffic to the canary revision to 50%. What is the correct gcloud command to accomplish this?

**Correct answer:** C. gcloud run services update-traffic my-service --to-tags canary=50

**Options:**

- **A.** gcloud run services update-traffic my-service --to-revisions canary=50
- **B.** gcloud run deploy my-service --image IMAGE --traffic canary=50
- **C.** gcloud run services update-traffic my-service --to-tags canary=50 — _correct answer_
- **D.** gcloud run services update my-service --set-traffic canary=50

## Question 123

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Bigtable table is experiencing performance issues with high P99 latencies. You suspect there may be hotspots in your schema design but need to confirm the issue and identify the affected row key ranges. You want to use Google Cloud's recommended diagnostic approach. What should you do?

**Correct answer:** A. Use Key Visualizer to generate heatmaps showing access patterns across the row key space and identify bright regions indicating hotspots on specific row key ranges.

**Options:**

- **A.** Use Key Visualizer to generate heatmaps showing access patterns across the row key space and identify bright regions indicating hotspots on specific row key ranges. — _correct answer_
- **B.** Create a custom Cloud Monitoring dashboard with per-row-key metrics to visualize which specific rows are receiving the most traffic.
- **C.** Enable Cloud Trace instrumentation in your application code and analyze trace spans to determine which row keys have the highest latency.
- **D.** Export all Bigtable metrics to BigQuery and run SQL queries to aggregate read and write counts by row key prefix to identify patterns.

## Question 124

**Domain:** Building and testing applications

**Question:** Your organization requires build provenance information for all container images to verify the integrity of your software supply chain. You are using Cloud Build with triggers connected to your GitHub repository. You need to generate SLSA v1.0 provenance for images pushed to Artifact Registry. What should you do?

**Correct answer:** B. Use Cloud Build triggers to initiate builds from repository events such as pushes or pull requests. Add the 'requestedVerifyOption: VERIFIED' option to your cloudbuild.yaml file to enable provenance generation and verification.

**Options:**

- **A.** Configure Artifact Registry to automatically generate provenance metadata when images are pushed by enabling the 'generate-provenance' setting on the Docker repository.
- **B.** Use Cloud Build triggers to initiate builds from repository events such as pushes or pull requests. Add the 'requestedVerifyOption: VERIFIED' option to your cloudbuild.yaml file to enable provenance generation and verification. — _correct answer_
- **C.** Enable the Container Analysis API and configure vulnerability scanning, which automatically generates SLSA provenance as part of the image analysis process.
- **D.** Run builds manually using gcloud builds submit with the --provenance flag to generate SLSA v1.0 provenance for each build and store the provenance alongside images in Artifact Registry.

## Question 125

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a content management system using Cloud Firestore with a server-side application running on Cloud Run. Your application needs to perform multiple write operations that must be applied atomically, but does not need to read documents before writing. You want to choose the most efficient approach. What should you do?

**Correct answer:** C. Use a batched write to group all write operations into a single atomic commit.

**Options:**

- **A.** Use BulkWriter to execute the writes in parallel and handle errors asynchronously.
- **B.** Use a transaction to group all write operations, performing an empty read operation first.
- **C.** Use a batched write to group all write operations into a single atomic commit. — _correct answer_
- **D.** Execute each write operation individually with error handling and manual rollback logic.

## Question 126

**Domain:** Building and testing applications

**Question:** You are configuring a Cloud Build pipeline for a Python application. Your integration tests generate JUnit XML test reports that your team needs to analyze after builds complete. You want to persist these test results outside of the build environment following Google-recommended best practices. What should you do?

**Correct answer:** C. Configure the Cloud Build 'artifacts' section with an 'objects' block specifying a Cloud Storage bucket location and the paths to the test report XML files.

**Options:**

- **A.** Configure a custom volume in the build step and mount it to persist test results across build steps and after the build completes.
- **B.** Use Cloud Logging to write the test results by configuring the test framework to output results to STDOUT during the build step.
- **C.** Configure the Cloud Build 'artifacts' section with an 'objects' block specifying a Cloud Storage bucket location and the paths to the test report XML files. — _correct answer_
- **D.** Write the test results to /workspace/test_results and configure the build to automatically persist all files in /workspace to Cloud Storage.

## Question 127

**Domain:** Building and testing applications

**Question:** You are optimizing a Cloud Build pipeline that builds Docker images for a Node.js application. The builds are currently slow because Docker rebuilds all layers each time, even when only the application code changes. The Dockerfile has not changed in months, and most build time is spent downloading npm dependencies. You want to speed up subsequent builds while keeping the pipeline configuration simple. What should you do?

**Correct answer:** A. Configure the cloudbuild.yaml to pull a previously built image from Artifact Registry and use the --cache-from argument with docker build to reuse unchanged layers from the cached image.

**Options:**

- **A.** Configure the cloudbuild.yaml to pull a previously built image from Artifact Registry and use the --cache-from argument with docker build to reuse unchanged layers from the cached image. — _correct answer_
- **B.** Store the node_modules directory in a Cloud Storage bucket and copy it into the build context at the start of each build using a gcloud storage cp step.
- **C.** Configure a persistent disk attached to Cloud Build workers to store the Docker build cache across multiple build executions.
- **D.** Increase the Cloud Build machine type to E2_HIGHCPU_32 to download and install npm dependencies faster during each build execution.

## Question 128

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your application uses Cloud Firestore to track account balances. A banking feature requires transferring funds between accounts, which involves reading the balance from the source account, verifying sufficient funds, deducting the amount, and adding it to the destination account. Multiple users may initiate transfers simultaneously. What is the most appropriate approach to implement this feature?

**Correct answer:** B. Use a Firestore transaction that reads both account documents first, validates the source balance, then writes the updated balances to both accounts.

**Options:**

- **A.** Use a batched write operation to update both account documents simultaneously in a single atomic operation.
- **B.** Use a Firestore transaction that reads both account documents first, validates the source balance, then writes the updated balances to both accounts. — _correct answer_
- **C.** Read both account balances using separate get() calls, validate in application code, then use individual update() operations to modify balances.
- **D.** Use FieldValue.increment() operations on both documents to update balances without needing to read the current values.

## Question 129

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring a log sink to route application logs from your Cloud Run service to a BigQuery dataset in a different project. After creating the sink, you notice that no logs are being written to BigQuery. What is the most likely cause of this issue?

**Correct answer:** C. The sink's writer identity service account has not been granted the BigQuery Data Editor role on the destination dataset.

**Options:**

- **A.** The log sink filter is using an invalid syntax that prevents matching any log entries.
- **B.** The BigQuery dataset is using a linked dataset from a log bucket instead of a write-enabled dataset.
- **C.** The sink's writer identity service account has not been granted the BigQuery Data Editor role on the destination dataset. — _correct answer_
- **D.** The BigQuery dataset's schema is incompatible with the log entry format being routed.

## Question 130

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that uses a database password stored in Secret Manager. The secret is exposed as an environment variable. You want to follow Google-recommended best practices to ensure application stability and enable controlled rollouts of secret changes. How should you configure the secret reference?

**Correct answer:** B. Reference the secret using a specific version number instead of the latest alias, and update the version through your release process.

**Options:**

- **A.** Store the secret directly in a Cloud Run environment variable to avoid dependency on Secret Manager during startup.
- **B.** Reference the secret using a specific version number instead of the latest alias, and update the version through your release process. — _correct answer_
- **C.** Reference the secret using the latest alias to automatically pick up rotated credentials without redeployment.
- **D.** Configure the Secret Manager client library in your code to fetch the latest version at runtime instead of using Cloud Run integration.

## Question 131

**Domain:** Building and testing applications

**Question:** You are designing a Cloud Build pipeline that executes unit tests, integration tests, and end-to-end tests. Unit tests and integration tests can run concurrently, but end-to-end tests should only run after both complete successfully. How should you configure the build step ordering in your cloudbuild.yaml file?

**Correct answer:** A. Set waitFor: ['-'] on both unit and integration test steps to run them immediately, then set waitFor with both step ids on the end-to-end test step.

**Options:**

- **A.** Set waitFor: ['-'] on both unit and integration test steps to run them immediately, then set waitFor with both step ids on the end-to-end test step. — _correct answer_
- **B.** Set waitFor: [] on the unit and integration test steps, and set waitFor: ['*'] on the end-to-end test step to wait for all previous steps.
- **C.** Configure separate Cloud Build triggers for each test type and use Pub/Sub to coordinate execution order between the triggered builds.
- **D.** Remove all waitFor fields to allow Cloud Build to automatically parallelize independent steps and serialize dependent steps.

## Question 132

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a Cloud Run service that will serve an internal application. The application should only be accessible to employees who have been granted access, and you want to use Identity-Aware Proxy (IAP) to manage authentication. Users do not have Google accounts but use your company's external identity provider (IdP). How should you configure authentication for this application?

**Correct answer:** A. Configure IAP with Workforce Identity Federation to use your external IdP. Grant the roles/iap.httpsResourceAccessor role to workforce pool members who need access to the application.

**Options:**

- **A.** Configure IAP with Workforce Identity Federation to use your external IdP. Grant the roles/iap.httpsResourceAccessor role to workforce pool members who need access to the application. — _correct answer_
- **B.** Enable IAP on the Cloud Run service and configure Identity Platform to federate with your external IdP. Grant allAuthenticatedUsers the roles/iap.httpsResourceAccessor role.
- **C.** Configure the Cloud Run service to use Cloud Endpoints with an API key, and implement custom authentication logic in your application code that validates tokens from your IdP.
- **D.** Create Google accounts for all employees using Google Cloud Directory Sync with your LDAP server, then enable IAP and grant the IAP-secured Web App User role to the synchronized accounts.

## Question 133

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that connects to a Cloud SQL database using a private IP address through a Serverless VPC Access connector. You also need the service to make API calls to external third-party services on the public internet. You want to optimize cost by minimizing traffic routed through the VPC connector. How should you configure the egress settings?

**Correct answer:** D. Configure the Cloud Run service with the vpc-egress setting set to private-ranges-only.

**Options:**

- **A.** Configure the Cloud Run service with two separate connectors: one for Cloud SQL traffic and one for public internet traffic.
- **B.** Configure the Cloud Run service without any VPC connector and use the Cloud SQL Auth Proxy for database connections.
- **C.** Configure the Cloud Run service with the vpc-egress setting set to all-traffic.
- **D.** Configure the Cloud Run service with the vpc-egress setting set to private-ranges-only. — _correct answer_

## Question 134

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is planning to implement VPC Service Controls to protect sensitive data stored in BigQuery and Cloud Storage. Before enforcing the service perimeter in production, you want to understand the impact on existing applications without disrupting business operations. What should you do?

**Correct answer:** A. Create a service perimeter in dry run mode to log policy violations without blocking access, then analyze the VPC Service Controls audit logs to identify and resolve potential issues before switching to enforced mode.

**Options:**

- **A.** Create a service perimeter in dry run mode to log policy violations without blocking access, then analyze the VPC Service Controls audit logs to identify and resolve potential issues before switching to enforced mode. — _correct answer_
- **B.** Deploy the service perimeter in enforced mode during a maintenance window and monitor Cloud Logging for errors, then quickly rollback if issues occur.
- **C.** Create the service perimeter in enforced mode in a development environment that mirrors production, test all applications, and then deploy the same configuration to production.
- **D.** Configure Cloud Monitoring alerts to notify your team when service requests are blocked, then immediately modify the perimeter configuration when alerts trigger.

## Question 135

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your organization is planning to implement VPC Service Controls to protect sensitive BigQuery and Cloud Storage data. Before enforcing the perimeter, you need to understand the impact on existing applications and identify potential access violations without disrupting production workloads. What should you do?

**Correct answer:** C. Create a service perimeter in dry run mode to log policy violations without blocking access, then analyze the VPC Service Controls logs for violations before enforcing the perimeter.

**Options:**

- **A.** Create a service perimeter in enforced mode during off-peak hours, and configure alerts to notify the team when access is blocked so violations can be addressed quickly.
- **B.** Create a duplicate production environment in a separate project without VPC Service Controls, and compare application behavior between the two environments.
- **C.** Create a service perimeter in dry run mode to log policy violations without blocking access, then analyze the VPC Service Controls logs for violations before enforcing the perimeter. — _correct answer_
- **D.** Enable Cloud Audit Logs on all protected services first, analyze the logs for 30 days, then create the service perimeter based on the observed access patterns.

## Question 136

**Domain:** Building and testing applications

**Question:** You have successfully deployed a new Cloud Run revision using traffic tags and completed your initial testing. You now want to gradually migrate production traffic from the current stable revision tagged 'blue' to the new revision tagged 'green'. After observing satisfactory metrics at 5% traffic, you want to increase traffic to the new revision. What command should you use to route 25% of production traffic to the new revision while keeping the rest on the stable revision?

**Correct answer:** D. gcloud run services update-traffic myservice --to-tags green=25,blue=75

**Options:**

- **A.** gcloud run deploy myservice --image gcr.io/project/myimage:green --traffic-percent 25
- **B.** gcloud run services update myservice --set-env-vars TRAFFIC_SPLIT=25
- **C.** gcloud run services update-traffic myservice --to-revisions green=25
- **D.** gcloud run services update-traffic myservice --to-tags green=25,blue=75 — _correct answer_

## Question 137

**Domain:** Building and testing applications

**Question:** You are performing a canary deployment on Cloud Run and have just changed the traffic split from 90%/10% to 50%/50% between your stable and canary revisions. Some users report they are still seeing responses from both revisions during the transition. What explains this behavior?

**Correct answer:** D. Traffic routing adjustments are not instantaneous; in-flight requests continue to completion and may be directed to either revision during the transition period.

**Options:**

- **A.** DNS propagation delays cause temporary routing inconsistencies when traffic splits are modified between Cloud Run revisions.
- **B.** The Cloud Run load balancer caches routing decisions for approximately 60 seconds, causing temporary routing inconsistencies between revisions.
- **C.** You must redeploy the service after modifying traffic splits for the changes to take effect across all running instances.
- **D.** Traffic routing adjustments are not instantaneous; in-flight requests continue to completion and may be directed to either revision during the transition period. — _correct answer_

## Question 138

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are storing time-series metrics from weather stations in Cloud Bigtable. Each station sends 100 measurements per minute, and you primarily query to retrieve all measurements for a specific station during a one-hour window. You need to design a schema that balances write efficiency and read performance. Your rows should not exceed the recommended size limit. What schema design pattern should you use?

**Correct answer:** B. Use a time bucket pattern with row key station_id#hour_timestamp, storing each minute's measurements in separate columns within the same row.

**Options:**

- **A.** Use a tall table pattern with row key station_id#minute_timestamp, storing one row per minute with all measurements as columns.
- **B.** Use a time bucket pattern with row key station_id#hour_timestamp, storing each minute's measurements in separate columns within the same row. — _correct answer_
- **C.** Store each individual measurement as a separate row with row key station_id#timestamp#measurement_type.
- **D.** Use a row key of timestamp#station_id to enable efficient time-based queries across all stations.

## Question 139

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are deploying a new application to Cloud Run that needs to access Cloud Storage buckets protected by a VPC Service Controls perimeter. Your Cloud Run service is in a project inside the same perimeter. After deployment, the application receives 'Request is prohibited by organization's policy' errors when trying to read from Cloud Storage. What is the most likely cause of this issue?

**Correct answer:** D. The Cloud Run service ingress setting is configured to allow traffic from all sources, which disables VPC Service Controls enforcement for the service.

**Options:**

- **A.** The VPC Service Controls perimeter was recently updated and changes have not yet propagated across all Google Cloud regions.
- **B.** The Cloud Run service is missing the required IAM permissions to access the Cloud Storage bucket within the perimeter.
- **C.** The Cloud Storage bucket is configured with uniform bucket-level access, which conflicts with VPC Service Controls perimeter restrictions.
- **D.** The Cloud Run service ingress setting is configured to allow traffic from all sources, which disables VPC Service Controls enforcement for the service. — _correct answer_

## Question 140

**Domain:** Building and testing applications

**Question:** You are implementing a canary deployment strategy for a Cloud Run service that currently uses session affinity. You plan to split traffic between the stable revision at 90% and the canary revision at 10%. What should you consider about how session affinity affects the traffic split?

**Correct answer:** D. Session affinity routes returning users to the same revision they initially accessed, which may cause the actual traffic distribution to differ from the configured percentages.

**Options:**

- **A.** Session affinity cannot be configured on a Cloud Run service that has traffic split between multiple revisions due to routing conflicts.
- **B.** Session affinity only applies within a single revision, so traffic splitting percentages remain accurate across all requests regardless of session cookies.
- **C.** Session affinity is automatically disabled when traffic splitting is configured, so the 90/10 split will be exact for all requests.
- **D.** Session affinity routes returning users to the same revision they initially accessed, which may cause the actual traffic distribution to differ from the configured percentages. — _correct answer_

## Question 141

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks queue is configured with min_backoff=10s, max_backoff=300s, and max_doublings=3. A task fails repeatedly. At which attempt interval does the retry transition from exponential growth to linear increase?

**Correct answer:** D. After the fourth retry attempt, when the interval reaches 80s, subsequent intervals increase linearly until reaching 300s.

**Options:**

- **A.** After the third retry attempt, when the interval reaches 40s, subsequent intervals remain constant at max_backoff.
- **B.** After the second retry attempt, when the interval reaches 20s, subsequent intervals increase by adding min_backoff.
- **C.** After the fifth retry attempt, when the interval reaches 160s, subsequent intervals double until reaching max_backoff.
- **D.** After the fourth retry attempt, when the interval reaches 80s, subsequent intervals increase linearly until reaching 300s. — _correct answer_

## Question 142

**Domain:** Deploying applications

**Question:** You are developing a Cloud Run service that needs to access API keys stored in Secret Manager. The API keys are rotated regularly, and you want the running application to use updated secrets without requiring a new deployment. What is the recommended approach?

**Correct answer:** D. Mount the secret as a volume and read the secret value from the file at runtime. Cloud Run fetches the latest secret value when reading the mounted volume.

**Options:**

- **A.** Expose the secret as an environment variable with the latest alias. Environment variables automatically refresh when secrets are rotated.
- **B.** Store the secret in Memorystore for Redis and poll for changes from your application code periodically.
- **C.** Configure a Cloud Scheduler job to trigger redeployment of the Cloud Run service whenever the secret is rotated.
- **D.** Mount the secret as a volume and read the secret value from the file at runtime. Cloud Run fetches the latest secret value when reading the mounted volume. — _correct answer_

## Question 143

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing an order processing application that uses Cloud Tasks to dispatch tasks to a Cloud Run service. During testing, you notice some tasks are being retried unexpectedly. You need to understand which HTTP response codes from your Cloud Run handler will cause Cloud Tasks to consider a task successful and remove it from the queue. Which HTTP response codes indicate task success?

**Correct answer:** A. HTTP response codes in the range 200-299 indicate task success, and the task will be removed from the queue.

**Options:**

- **A.** HTTP response codes in the range 200-299 indicate task success, and the task will be removed from the queue. — _correct answer_
- **B.** HTTP response codes 200-299 and 429 indicate task success, as 429 is handled specially.
- **C.** HTTP response codes in the range 200-499 indicate task success, as only 5xx errors trigger retries.
- **D.** HTTP 200 is the only response code that indicates task success; all other codes trigger retries.

## Question 144

**Domain:** Integrating applications with Google Cloud services

**Question:** Your Cloud Tasks queue dispatches tasks to a Cloud Run service. During peak load, your service is returning HTTP 503 Service Unavailable responses. You notice tasks are being retried much slower than your configured retry settings. What is causing this behavior?

**Correct answer:** A. Cloud Tasks automatically applies a higher backoff rate when workers return HTTP 503 to prevent overloading the service.

**Options:**

- **A.** Cloud Tasks automatically applies a higher backoff rate when workers return HTTP 503 to prevent overloading the service. — _correct answer_
- **B.** The HTTP 503 responses cause Cloud Tasks to pause the queue entirely until manual intervention.
- **C.** The Cloud Run service automatically buffers requests causing delays in task execution.
- **D.** Your retry configuration is being ignored because HTTP 503 errors are treated as permanent failures.

## Question 145

**Domain:** Integrating applications with Google Cloud services

**Question:** You are configuring alerting policies for your GKE workloads in Cloud Monitoring. Your team wants to be notified when Pod restarts increase significantly, indicating potential stability issues with your deployments. You also want the flexibility to create ratio-based alerts that compare error rates to total request counts. Which approach should you use?

**Correct answer:** D. Enable kube-state-metrics for your cluster and create PromQL-based alerting policies. Use PromQL expressions to monitor kube_pod_container_status_restarts_total for restart detection and compute error rate ratios.

**Options:**

- **A.** Create metric-threshold alerting policies using Monitoring filters for both scenarios. Use the MetricThreshold condition type with the denominatorFilter field to compute ratios.
- **B.** Use the GKE recommended alerting policies package which automatically includes Pod restart and error rate alerts. Customize the thresholds through the Google Cloud console.
- **C.** Configure Monitoring Query Language (MQL) alerting policies to query both restart counts and compute error rate ratios using fetch and join operations.
- **D.** Enable kube-state-metrics for your cluster and create PromQL-based alerting policies. Use PromQL expressions to monitor kube_pod_container_status_restarts_total for restart detection and compute error rate ratios. — _correct answer_

## Question 146

**Domain:** Integrating applications with Google Cloud services

**Question:** Your application uses the Cloud Storage JSON API to manage objects across multiple buckets. You are approaching the API quota limits and need to optimize your usage while maintaining functionality. You currently make separate requests to list objects, then fetch metadata for objects of interest. How should you optimize your API usage?

**Correct answer:** C. Use the fields parameter in your objects.list requests to include all needed metadata fields, eliminating the need for separate metadata requests.

**Options:**

- **A.** Switch from the JSON API to the XML API which has higher quota limits for listing operations.
- **B.** Implement client-side caching of all object metadata with a 24-hour TTL to reduce repeat API requests for the same objects.
- **C.** Use the fields parameter in your objects.list requests to include all needed metadata fields, eliminating the need for separate metadata requests. — _correct answer_
- **D.** Increase your API quota through the Google Cloud console and continue with the current request pattern for simplicity.

## Question 147

**Domain:** Building and testing applications

**Question:** You are managing a Cloud Run service with traffic split between two revisions: version-1 receiving 70% and version-2 receiving 30%. After monitoring metrics for several hours, you discover that version-2 has a memory leak causing elevated error rates. You need to quickly rollback all traffic to version-1. What is the fastest way to accomplish this?

**Correct answer:** A. Run: gcloud run services update-traffic myservice --to-revisions=version-1=100

**Options:**

- **A.** Run: gcloud run services update-traffic myservice --to-revisions=version-1=100 — _correct answer_
- **B.** Use the Google Cloud console to edit version-2's configuration and set its minimum instances to 0 to stop it from serving traffic.
- **C.** Redeploy the version-1 container image with gcloud run deploy using the --revision-suffix=rollback flag to create a new stable revision.
- **D.** Delete version-2 revision using gcloud run revisions delete, which automatically shifts traffic back to version-1.

## Question 148

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API is configured with the default maximum concurrency of 80 and is experiencing HTTP 503 errors during peak traffic. Cloud Monitoring shows instances are at 100% CPU utilization. You need to improve service availability. What is the most effective approach?

**Correct answer:** A. Lower the maximum concurrency setting to reduce CPU contention and trigger earlier scaling.

**Options:**

- **A.** Lower the maximum concurrency setting to reduce CPU contention and trigger earlier scaling. — _correct answer_
- **B.** Enable instance-based billing to provide consistent CPU allocation throughout instance lifecycle.
- **C.** Increase the maximum concurrency setting to 1000 to allow instances to handle more requests.
- **D.** Increase the maximum instances limit to allow more instances to be created during peak traffic.

## Question 149

**Domain:** Deploying applications

**Question:** Your team has deployed a Cloud Run service configured with a Serverless VPC Access connector. The service needs to make API calls to external third-party services on the internet while also connecting to a Cloud SQL instance with a private IP address in your VPC. You want to minimize costs while maintaining connectivity to both destinations. How should you configure the VPC egress setting for your Cloud Run service?

**Correct answer:** A. Set the VPC egress setting to 'Route only requests to private IPs to the VPC' to send only internal traffic through the connector.

**Options:**

- **A.** Set the VPC egress setting to 'Route only requests to private IPs to the VPC' to send only internal traffic through the connector. — _correct answer_
- **B.** Create two separate VPC connectors - one for internal traffic and one for external traffic - to optimize routing.
- **C.** Disable the VPC connector and use Cloud SQL Auth Proxy with a public IP address instead to reduce connector costs.
- **D.** Set the VPC egress setting to 'Route all traffic to the VPC' to ensure all connections are secured through the VPC.

## Question 150

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a banking application using Cloud Firestore where you need to transfer funds between two accounts. The operation must read both account balances, verify sufficient funds, and update both accounts atomically. Users report occasional 'ABORTED: Too much contention on these documents' errors. What is causing this issue and how should you address it?

**Correct answer:** B. Multiple transactions are competing to modify the same account documents concurrently, causing data contention. Reduce transaction scope and retry with exponential backoff.

**Options:**

- **A.** The Firestore database is using optimistic concurrency mode, which causes more contention errors. Switch to pessimistic concurrency mode in database settings.
- **B.** Multiple transactions are competing to modify the same account documents concurrently, causing data contention. Reduce transaction scope and retry with exponential backoff. — _correct answer_
- **C.** The transaction exceeds the maximum request size limit of 10 MiB due to large account documents. Reduce document sizes to prevent transaction failures.
- **D.** The transaction is reading documents after performing writes, violating Firestore's transaction ordering requirements. Restructure code to perform all reads before writes.

## Question 151

**Domain:** Integrating applications with Google Cloud services

**Question:** You are developing a collaborative document editing application on Google Cloud. Multiple users need to see updates in real-time as others make changes to shared documents stored in Firestore. Your application must efficiently receive updates when document data changes. According to Google-recommended best practices, what is the most efficient approach to implement this functionality?

**Correct answer:** B. Implement snapshot listeners using the onSnapshot method to receive real-time updates whenever documents change in the collection.

**Options:**

- **A.** Create a Cloud Pub/Sub topic to publish messages on every document change and have clients subscribe to receive updates.
- **B.** Implement snapshot listeners using the onSnapshot method to receive real-time updates whenever documents change in the collection. — _correct answer_
- **C.** Configure Cloud Functions triggered by Firestore document events to send push notifications to all connected clients.
- **D.** Use polling with scheduled Cloud Scheduler jobs to query Firestore every 5 seconds and compare results with the previous query.

## Question 152

**Domain:** Deploying applications

**Question:** You are deploying a Cloud Run service that requires multiple secrets mounted as files. You attempt to mount two different secrets to the path /etc/config/db-password and /etc/config/api-key respectively. The deployment fails. What is the cause and how should you resolve it?

**Correct answer:** D. Cloud Run doesn't allow mounting multiple secrets at the same base path. Mount each secret to a unique directory path such as /etc/secrets/db/password and /etc/secrets/api/key.

**Options:**

- **A.** The Secret Manager API quota has been exceeded for the project. Request a quota increase and retry the deployment after quota is available.
- **B.** Cloud Run requires all secrets to be exposed as environment variables, not file mounts. Change the configuration to use environment variables instead.
- **C.** The secrets must be in the same Secret Manager project as the Cloud Run service. Move both secrets to the service's project and retry.
- **D.** Cloud Run doesn't allow mounting multiple secrets at the same base path. Mount each secret to a unique directory path such as /etc/secrets/db/password and /etc/secrets/api/key. — _correct answer_

## Question 153

**Domain:** Integrating applications with Google Cloud services

**Question:** You are running a containerized application on Cloud Run. Your operations team wants to be alerted when the request latency for your service exceeds 500 milliseconds for more than 5 consecutive minutes. You need to create an alerting policy in Cloud Monitoring. What should you configure?

**Correct answer:** B. Create a metric-threshold alerting policy that monitors the run.googleapis.com/request_latencies metric, set the threshold to 500ms, configure the rolling window function, and set the retest window to 5 minutes.

**Options:**

- **A.** Create a log-based alerting policy that filters Cloud Run request logs where the latency field exceeds 500 milliseconds, then configure it to aggregate results over 5 minutes.
- **B.** Create a metric-threshold alerting policy that monitors the run.googleapis.com/request_latencies metric, set the threshold to 500ms, configure the rolling window function, and set the retest window to 5 minutes. — _correct answer_
- **C.** Create a metric-absence alerting policy that triggers when the Cloud Run request count drops below expected levels due to slow processing, setting the trigger absence time to 5 minutes.
- **D.** Create an uptime check that sends HTTP requests to your Cloud Run service and monitors the response time, configuring the check to fail if latency exceeds 500ms for 5 minutes.

## Question 154

**Domain:** Integrating applications with Google Cloud services

**Question:** Your organization has multiple Google Cloud projects generating application logs. The security team requires centralized log analysis using SQL queries while maintaining logs in their original projects for operational access. You need to enable this capability with minimal additional storage costs. What should you do?

**Correct answer:** A. Create aggregated sinks at the folder level to route logs to a centralized log bucket in a dedicated project. Upgrade the bucket to use Log Analytics and create a linked BigQuery dataset.

**Options:**

- **A.** Create aggregated sinks at the folder level to route logs to a centralized log bucket in a dedicated project. Upgrade the bucket to use Log Analytics and create a linked BigQuery dataset. — _correct answer_
- **B.** Create log sinks in each project to export logs to Cloud Storage in a central project and use BigQuery external tables to query the Cloud Storage data with SQL.
- **C.** Configure each project to upgrade their _Default bucket to use Log Analytics and grant the security team access to run queries across all project log buckets.
- **D.** Create log sinks in each project to route logs to a central BigQuery dataset and use BigQuery SQL to analyze the aggregated logs directly.

## Question 155

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company runs a social media analytics platform using Cloud Bigtable to store user activity data. You notice that certain celebrity accounts generate significantly more activity than regular users, causing hotspots when these rows are accessed frequently. The current row key format is 'user_id#activity_type#timestamp'. You need to optimize the schema to distribute load for high-activity users while maintaining efficient range scans for individual users. What should you do?

**Correct answer:** D. Implement key salting by prepending a computed hash prefix derived from the user_id to distribute high-activity user rows across multiple tablets.

**Options:**

- **A.** Add the celebrity flag as a prefix to the row key so Bigtable can automatically distribute celebrity data across nodes.
- **B.** Configure a read replica cluster in a different region specifically for serving queries about high-activity celebrity accounts.
- **C.** Store celebrity user data in a separate Bigtable instance with more nodes dedicated to handling high-traffic accounts.
- **D.** Implement key salting by prepending a computed hash prefix derived from the user_id to distribute high-activity user rows across multiple tablets. — _correct answer_

## Question 156

**Domain:** Integrating applications with Google Cloud services

**Question:** You manage a GKE cluster running multiple microservices. You need to create an alerting policy that triggers only when both CPU utilization exceeds 90% AND memory utilization exceeds 85% for the same container. This will help reduce alert noise from transient spikes in a single resource. How should you configure the alerting policy?

**Correct answer:** B. Create an alerting policy with two conditions using the AND_WITH_MATCHING_RESOURCE combiner, with each condition monitoring a different metric type and grouping by container-specific labels.

**Options:**

- **A.** Create an alerting policy with two conditions using the OR combiner, with filters to match the same container for both CPU and memory metrics.
- **B.** Create an alerting policy with two conditions using the AND_WITH_MATCHING_RESOURCE combiner, with each condition monitoring a different metric type and grouping by container-specific labels. — _correct answer_
- **C.** Create a single alerting policy with one condition that uses a PromQL query to divide CPU by memory utilization and alert when the ratio exceeds a threshold.
- **D.** Create two separate alerting policies, one for CPU and one for memory, then use Cloud Functions to correlate incidents and create a combined alert.

## Question 157

**Domain:** Deploying applications

**Question:** You are deploying a microservices application on GKE that requires configuration data to be updated without restarting the pods. The application reads configuration values from files at regular intervals. You need to ensure that configuration changes are automatically reflected in running pods. How should you configure the application to consume the ConfigMap data?

**Correct answer:** A. Mount the ConfigMap as a volume in the pod specification. Configure the application to periodically read the configuration files from the mounted volume path.

**Options:**

- **A.** Mount the ConfigMap as a volume in the pod specification. Configure the application to periodically read the configuration files from the mounted volume path. — _correct answer_
- **B.** Use the envFrom field in the pod specification to import all keys from the ConfigMap as environment variables. Configure the application to reload environment variables dynamically.
- **C.** Reference the ConfigMap data as environment variables in the pod specification. Configure the application to read the environment variables at runtime.
- **D.** Create a sidecar container that watches the ConfigMap for changes and signals the main application container to restart when changes are detected.

## Question 158

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your Cloud Run API service is experiencing HTTP 429 errors during sudden traffic spikes. The service has a maximum instances limit of 50 and a maximum concurrency of 80 per instance. You observe that instances are not reaching maximum concurrency before new instances are created. You need to understand why scaling is not happening as expected and resolve the issue. What is the most likely cause?

**Correct answer:** B. Cloud Run targets 60% of maximum concurrency when making scaling decisions, which causes new instances to be created before existing instances reach their maximum.

**Options:**

- **A.** The startup CPU boost feature is not enabled, causing slow instance initialization that cannot keep pace with the traffic spike.
- **B.** Cloud Run targets 60% of maximum concurrency when making scaling decisions, which causes new instances to be created before existing instances reach their maximum. — _correct answer_
- **C.** Request-based billing is causing CPU throttling between requests, preventing instances from handling additional concurrent requests efficiently.
- **D.** The maximum instances limit of 50 is too low, and Cloud Run cannot create enough instances to handle the incoming traffic spike.

## Question 159

**Domain:** Deploying applications

**Question:** You have a Cloud Run service in Project A that needs to access a secret stored in Secret Manager in Project B. The Cloud Run service uses a dedicated service account. How should you configure access to enable cross-project secret retrieval?

**Correct answer:** A. Grant the Secret Manager Secret Accessor role to the Cloud Run service account from Project A on the specific secret in Project B.

**Options:**

- **A.** Grant the Secret Manager Secret Accessor role to the Cloud Run service account from Project A on the specific secret in Project B. — _correct answer_
- **B.** Export the service account key from Project A and store it as a secret in Project B to enable authentication.
- **C.** Create a copy of the secret in Project A and configure Secret Manager to synchronize versions between projects automatically.
- **D.** Enable VPC Service Controls between Project A and Project B, then reference the secret using its name only.

## Question 160

**Domain:** Building and testing applications

**Question:** You are developing a containerized Java application using Cloud Code for IntelliJ. When you start a debug session using 'Develop on Kubernetes', Cloud Code needs to attach the debugger to your running container. What configuration does Cloud Code automatically handle for Java debugging?

**Correct answer:** B. Cloud Code automatically adds an environment variable JAVA_TOOL_OPTIONS with the appropriate JDWP configuration to enable the debugging agent to listen for socket connections on port 5005.

**Options:**

- **A.** Cloud Code connects to an existing remote debugger running on port 8080 that must be pre-configured in your application's main class before compilation.
- **B.** Cloud Code automatically adds an environment variable JAVA_TOOL_OPTIONS with the appropriate JDWP configuration to enable the debugging agent to listen for socket connections on port 5005. — _correct answer_
- **C.** Cloud Code generates a debug configuration file that must be committed to your repository and requires manual updates for each container rebuild.
- **D.** Cloud Code requires you to manually edit the Dockerfile to expose port 5005 and add the JDWP agent configuration as a JAVA_OPTS environment variable before starting the debug session.

## Question 161

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** Your company is implementing a new VPC Service Controls perimeter to protect sensitive BigQuery and Cloud Storage data. Before enforcing the perimeter, you need to identify any workloads that might be disrupted without blocking current access. What should you do?

**Correct answer:** B. Configure the service perimeter in dry run mode. Analyze the VPC Service Controls audit logs to identify potential violations before enforcing the perimeter.

**Options:**

- **A.** Configure the service perimeter in enforced mode with all projects added. Monitor Error Reporting to identify disrupted workloads and quickly add exceptions.
- **B.** Configure the service perimeter in dry run mode. Analyze the VPC Service Controls audit logs to identify potential violations before enforcing the perimeter. — _correct answer_
- **C.** Configure Cloud Monitoring alerts based on IAM audit logs. Deploy the perimeter in enforced mode and use the alerts to identify issues with the perimeter configuration.
- **D.** Create a duplicate production environment and deploy the perimeter in enforced mode. Validate all workloads function correctly in the duplicate environment before applying to production.

## Question 162

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a Cloud Run application that needs to protect container images and runtime data using customer-managed encryption keys. You have created a Cloud KMS key in the us-central1 region. When deploying your Cloud Run service in the us-east1 region with CMEK protection, the deployment fails. What is the most likely cause of this failure?

**Correct answer:** B. The Cloud KMS key ring location must match the location where the Cloud Run service is deployed. You need to create a new key in us-east1.

**Options:**

- **A.** The Cloud Run service agent does not have the required IAM permissions on the Cloud KMS key. You need to grant the CryptoKey Encrypter/Decrypter role.
- **B.** The Cloud KMS key ring location must match the location where the Cloud Run service is deployed. You need to create a new key in us-east1. — _correct answer_
- **C.** The Cloud KMS key must use HSM protection level for Cloud Run services. You need to create a new Cloud HSM key in us-central1.
- **D.** Cloud Run does not support CMEK protection. You need to use a different compute service that supports customer-managed encryption keys.

## Question 163

**Domain:** Integrating applications with Google Cloud services

**Question:** Your team is developing a high-traffic web application that uses Cloud SQL Enterprise Plus edition for PostgreSQL. The application experiences frequent connection spikes during peak hours, and creating new database connections is causing latency issues. You want to use managed services to improve connection performance without modifying your application code significantly. What should you do?

**Correct answer:** B. Enable Managed Connection Pooling on the Cloud SQL instance and configure your application to connect to port 6432 for direct pooled connections, using transaction pooling mode for short-lived connections.

**Options:**

- **A.** Deploy a self-managed PgBouncer instance on Compute Engine between your application and Cloud SQL, configuring session pooling mode for all connections.
- **B.** Enable Managed Connection Pooling on the Cloud SQL instance and configure your application to connect to port 6432 for direct pooled connections, using transaction pooling mode for short-lived connections. — _correct answer_
- **C.** Increase the Cloud SQL instance max_connections parameter to the maximum allowed value and configure your application with a large connection pool to pre-establish connections during startup.
- **D.** Enable Cloud SQL high availability configuration and distribute connections across the primary and standby instances to handle connection spikes during peak hours.

## Question 164

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are creating a new GKE cluster for a production application that will access BigQuery and Cloud Storage. You want the cluster to support secure workload authentication with minimal operational overhead. Which cluster configuration should you choose?

**Correct answer:** B. Create a GKE Autopilot cluster, as Workload Identity Federation for GKE is always enabled and the GKE metadata server is automatically configured on all nodes.

**Options:**

- **A.** Create a GKE Standard cluster and configure each pod to use the node's Compute Engine default service account for authentication.
- **B.** Create a GKE Autopilot cluster, as Workload Identity Federation for GKE is always enabled and the GKE metadata server is automatically configured on all nodes. — _correct answer_
- **C.** Create a GKE Standard cluster with metadata concealment enabled to protect workloads from accessing sensitive instance metadata.
- **D.** Create a GKE Standard cluster and manually enable Workload Identity Federation on the cluster and each node pool using the --workload-metadata=GKE_METADATA flag.

## Question 165

**Domain:** Building and testing applications

**Question:** You have configured Cloud Build to build a container image and want the image to be automatically pushed to Artifact Registry after the build completes. You also need the image to appear in the build results displayed in the Google Cloud console. How should you configure the cloudbuild.yaml file?

**Correct answer:** D. Include the images field at the root level of the cloudbuild.yaml with the full Artifact Registry image path, and ensure the docker build step tags the image with the same path.

**Options:**

- **A.** Set the artifactRegistry.push option to true in the build options section of cloudbuild.yaml to enable automatic image pushing and result tracking.
- **B.** Add a docker push step in cloudbuild.yaml to push the image to Artifact Registry, which will automatically display the pushed image in the Cloud Build console results.
- **C.** Configure an Artifact Registry Pub/Sub notification that triggers when images are pushed, which will update the Cloud Build history with the image information.
- **D.** Include the images field at the root level of the cloudbuild.yaml with the full Artifact Registry image path, and ensure the docker build step tags the image with the same path. — _correct answer_

## Question 166

**Domain:** Designing highly scalable, available, and reliable cloud-nat

**Question:** You are developing a content management system using Cloud Firestore. Your 'articles' collection has documents with a 'description' field that contains large text blobs that are never used in queries. You notice that write operations are becoming slower as the collection grows. What should you do to improve write performance?

**Correct answer:** D. Create a single-field index exemption for the 'description' field to exclude it from automatic indexing.

**Options:**

- **A.** Enable Firestore write-through caching to batch multiple index updates together before committing.
- **B.** Move the 'description' field to a separate subcollection document to reduce the main document size.
- **C.** Delete and recreate all composite indexes that include the 'description' field to optimize index storage.
- **D.** Create a single-field index exemption for the 'description' field to exclude it from automatic indexing. — _correct answer_

## Question 167

**Domain:** Deploying applications

**Question:** Your team is deploying a Cloud Run service that needs to access a Memorystore for Redis instance in your VPC network. You are configuring a Serverless VPC Access connector to enable this connectivity. What are the requirements you must meet when creating the connector?

**Correct answer:** D. The connector must be created in the same region as your Cloud Run service and must use an unused /28 subnet that is not shared with other resources.

**Options:**

- **A.** The connector must be created in the same project as Memorystore and must use a shared subnet that contains your Redis instance.
- **B.** The connector can be created in any region within the same multi-region and must use a minimum of a /24 subnet for adequate capacity.
- **C.** The connector should be created in a different region than your Cloud Run service and must use a public subnet with a NAT gateway configured.
- **D.** The connector must be created in the same region as your Cloud Run service and must use an unused /28 subnet that is not shared with other resources. — _correct answer_

## Question 168

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Run service to access multiple secrets from Secret Manager. One secret contains a database password that your application reads at startup, and another contains a TLS certificate that your application dynamically reloads during runtime. How should you configure access to these secrets?

**Correct answer:** A. Configure the database password as an environment variable and mount the TLS certificate as a volume.

**Options:**

- **A.** Configure the database password as an environment variable and mount the TLS certificate as a volume. — _correct answer_
- **B.** Use the Secret Manager API directly in your application code to fetch both secrets, avoiding the need for Cloud Run configuration.
- **C.** Configure both secrets as environment variables to minimize configuration complexity and ensure consistent access.
- **D.** Mount both secrets as volumes to ensure consistent access patterns across all secrets in the application.

## Question 169

**Domain:** Deploying applications

**Question:** You are configuring a Cloud Build pipeline to build a container image and push it to Artifact Registry. You want the build to fail if the image is not successfully pushed to the registry. Which Cloud Build configuration approach should you use?

**Correct answer:** C. Include the image path in both the build step and the images field in your cloudbuild.yaml file.

**Options:**

- **A.** Add requestedVerifyOption: VERIFIED to the options section and omit the images field from the configuration.
- **B.** Configure a Cloud Build trigger with the push notification option enabled to monitor the Artifact Registry repository.
- **C.** Include the image path in both the build step and the images field in your cloudbuild.yaml file. — _correct answer_
- **D.** Add a separate docker push step after the docker build step and remove the images field from the configuration.

## Question 170

**Domain:** Building and testing applications

**Question:** Your organization requires that all production deployments pass integration tests before they are deployed. You are using Cloud Build with a build trigger that is configured to require approval before running. A team member needs to be able to approve builds that pass all test stages. What IAM role should be granted to enable this team member to approve pending builds?

**Correct answer:** A. Grant the Cloud Build Approver role (roles/cloudbuild.builds.approver) to the team member.

**Options:**

- **A.** Grant the Cloud Build Approver role (roles/cloudbuild.builds.approver) to the team member. — _correct answer_
- **B.** Grant the Project Viewer role (roles/viewer) to the team member.
- **C.** Grant the Cloud Build Service Agent role (roles/cloudbuild.serviceAgent) to the team member.
- **D.** Grant the Cloud Build Editor role (roles/cloudbuild.builds.editor) to the team member.
