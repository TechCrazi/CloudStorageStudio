# CloudStorageStudio

CloudStorageStudio is a local web app that:

- Uses Azure service principal client credentials from server environment variables.
- Lists subscriptions and storage accounts via Azure management APIs.
- Lets users select one or multiple subscriptions.
- Pulls storage accounts across all regions in selected subscriptions.
- Caches Azure storage account resource group names and resource tags.
- Pulls container inventory and container sizes per account.
- Pulls and caches storage-account security posture (network rules, lifecycle policy, diagnostics, TLS/public access settings).
- Pulls and caches account metrics for both 24h and 30d windows (used capacity, egress, ingress, transactions).
- Runs a background Azure metrics sync on startup and every configured interval (default 12 hours).
- Syncs Azure retail pricing (Hot storage, egress/ingress, transactions) into SQLite at startup and on a schedule.
- Caches data in SQLite so repeated UI loads do not always re-query Azure.
- Supports AWS S3 multi-account inventory in a dedicated tab using server-side credentials.
- Uses low-cost AWS mode by default (bucket list + CloudWatch storage/object metrics).
- AWS UI now has split sub-views similar to Azure: `Storage + buckets` and `Security view`.
- Supports optional AWS deep scan mode (ListObjectsV2 object walk) when full detail is needed.
- Supports optional AWS S3 bucket security posture pulls (public access block, policy public status, encryption, versioning, lifecycle, logging, object lock, ownership controls).
- Pulls AWS EFS file system inventory/size by configured account + region list.
- Estimates AWS S3 + EFS costs for 24h and 30d windows using configurable pricing assumptions.
- Supports Wasabi bucket inventory in the Wasabi tab using server-side account credentials.
- Supports Kaseya VSAx disk inventory in a dedicated VSAx tab using server-side API credentials.
- Supports VSAx group scoping via `VSAX_GROUPS` (optional). If unset, the app auto-discovers all groups from VSAx and lets you pick selected groups in the UI.
- Pulls/caches VSAx disk allocation and usage at group/device/disk level.
- Supports per-group VSAx CSV export from the group action row.
- Adds a VSAx group picker (Azure-style checklist) to save selected groups for display/sync scope.
- Estimates VSAx storage cost for 24h and 30d using configurable pricing assumptions (default `$120/TB-month`).
- Syncs Wasabi storage pricing from the public pricing page into SQLite cache on startup and schedule.
- Exports cached Azure + AWS + Wasabi datasets to CSV from view-specific buttons.
- Azure Storage + Containers view exports one combined CSV (`azure-storage-containers`) with storage-account rows expanded into container-level details.
- Azure Security view exports one security CSV (`azure-security`) for the current Azure scope.
- AWS top-level export downloads AWS accounts + buckets CSV files; per-account AWS export downloads only that account's bucket CSV.
- Wasabi top-level export downloads Wasabi accounts + buckets CSV files; per-account Wasabi export downloads only that account's bucket CSV.
- IP map panel exports one CSV (`ip-aliases`).
- UI now separates providers into tabs (Unified, Azure, AWS, Wasabi, VSAx active; GCP/Other placeholders for upcoming integrations).
- Browser remembers the active provider tab and active Azure/AWS sub-view across refresh.

## Stack

- Node.js + Express backend
- Static HTML/CSS/JS frontend
- OAuth2 client credentials (server-side token acquisition)
- SQLite (`better-sqlite3`) for cache
- `helmet` for HTTP security headers and disabling `X-Powered-By`

## Prerequisites

- Node 18+
- An Entra app registration (service principal)

Configure the app registration / service principal:

1. Create a client secret for the app registration.
2. Assign RBAC roles to the **service principal** (not the signed-in user):
   - Management plane role to read subscriptions/storage accounts (for example `Reader` at subscription scope, or broader as required).
   - Blob data plane role to calculate container size (`Storage Blob Data Reader` or `Storage Blob Data Contributor`) at required scope.
   - To read diagnostic settings and Azure Monitor metrics, `Monitoring Reader` may be required depending on tenant policy.
3. If ADLS Gen2 (HNS) is enabled, ensure filesystem/path ACLs allow the service principal to list paths.

## Environment

Copy `.env.example` to `.env` and fill values:

- `AZURE_TENANT_ID` = tenant GUID (must not be `common`)
- `AZURE_CLIENT_ID` = app registration client ID
- `AZURE_CLIENT_SECRET` = app registration client secret
- Optional proxy for Azure egress:
  - `HTTPS_PROXY` or `HTTP_PROXY`

Throttle and concurrency controls:

- `AZURE_API_MAX_CONCURRENCY`: max concurrent outbound Azure API calls
- `AZURE_API_MIN_INTERVAL_MS`: minimum delay between outbound calls
- `AZURE_API_MAX_RETRIES`, `AZURE_API_BASE_BACKOFF_MS`, `AZURE_API_MAX_BACKOFF_MS`: retry/backoff behavior for 429/5xx
- `ACCOUNT_SYNC_CONCURRENCY`, `CONTAINER_SYNC_CONCURRENCY`: sync worker counts
- `UI_PULL_ALL_CONCURRENCY`: per-account pull-all worker count from the browser
- `SECURITY_CACHE_TTL_MINUTES`: security profile refresh interval
- `METRICS_CACHE_TTL_MINUTES`: metrics refresh interval for on-demand metric pulls (24h + 30d fields)
- `AZURE_METRICS_SYNC_INTERVAL_HOURS`: background Azure metrics sync interval (default `12`)

Logging controls:

- `LOG_ENABLE_DEBUG`: enable verbose debug logs (`false` by default)
- `LOG_ENABLE_INFO`: enable info logs (`true` by default)
- `LOG_ENABLE_WARN`: enable warning logs (`true` by default)
- `LOG_ENABLE_ERROR`: enable error logs (`true` by default)
- `LOG_HTTP_REQUESTS`: log each `/api/*` request with status/duration (`true` by default)
- `LOG_HTTP_DEBUG`: include debug-level request start details (`false` by default)
- `LOG_JSON`: output structured JSON logs instead of plain text (`false` by default)
- `LOG_INCLUDE_TIMESTAMP`: include ISO timestamps in plain text logs (`true` by default)
- `LOG_MAX_VALUE_LENGTH`: truncate long metadata values in log lines (default `500`)
- Live pricing sync controls:
  - `PRICING_SYNC_INTERVAL_HOURS`: how often live pricing refresh runs (default `24`)
  - `PRICING_ARM_REGION_NAME`: retail API region key (default `eastus`)
  - `PRICING_STORAGE_PRODUCT_NAME`, `PRICING_STORAGE_SKU_NAME`: storage retail meter scope (default `General Block Blob v2` / `Hot LRS`)
  - `PRICING_EGRESS_PRODUCT_NAME`: bandwidth product profile for egress tiers (default `Rtn Preference: MGN`)
- Optional pricing overrides for 24h estimate panel:
  - `PRICING_CURRENCY`, `PRICING_REGION_LABEL`, `PRICING_AS_OF_DATE`, `PRICING_SOURCE_URL`
  - `PRICING_BYTES_PER_GB`, `PRICING_DAYS_IN_MONTH`
  - `PRICING_STORAGE_HOT_LRS_TIER1_GB_MONTH`, `PRICING_STORAGE_HOT_LRS_TIER2_GB_MONTH`, `PRICING_STORAGE_HOT_LRS_TIER3_GB_MONTH`
  - `PRICING_EGRESS_TIER0_GB`, `PRICING_EGRESS_TIER1_GB`, `PRICING_EGRESS_TIER2_GB`, `PRICING_EGRESS_TIER3_GB`, `PRICING_EGRESS_TIER4_GB`, `PRICING_EGRESS_TIER5_GB`
  - `PRICING_INGRESS_GB`, `PRICING_TRANSACTION_UNIT_SIZE`, `PRICING_TRANSACTION_UNIT_PRICE`, `PRICING_TRANSACTION_LABEL`

AWS account configuration (multi-account, avoids using generic `AWS_ACCESS_KEY` env names):

- Preferred multi-account config: `AWS_ACCOUNTS_JSON` (JSON array).
- Optional single-account fallback: `AWS_DEFAULT_ACCESS_KEY_ID`, `AWS_DEFAULT_SECRET_ACCESS_KEY`, `AWS_DEFAULT_SESSION_TOKEN`, `AWS_DEFAULT_ACCOUNT_ID`, `AWS_DEFAULT_ACCOUNT_LABEL`, `AWS_DEFAULT_REGION`, `AWS_DEFAULT_CLOUDWATCH_REGION`, `AWS_DEFAULT_S3_ENDPOINT`.
- EFS region scope:
  - `efsRegions` can be set per account inside `AWS_ACCOUNTS_JSON` (array or comma string).
  - `AWS_DEFAULT_EFS_REGIONS` can be used for single-account fallback.
- Sync/cache + throttling controls:
  - `AWS_SYNC_INTERVAL_HOURS` (default `24`)
  - `AWS_CACHE_TTL_HOURS` (default `24`)
  - `AWS_ACCOUNT_SYNC_CONCURRENCY`, `AWS_BUCKET_SYNC_CONCURRENCY`
  - `AWS_API_MAX_CONCURRENCY`, `AWS_API_MIN_INTERVAL_MS`, `AWS_API_MAX_RETRIES`
- Cost-control mode toggles:
  - `AWS_DEEP_SCAN_DEFAULT` (default `false`) keeps normal sync in low-cost mode.
  - `AWS_REQUEST_METRICS_DEFAULT` (default `false`) attempts request metrics only when enabled.
  - `AWS_SECURITY_SCAN_DEFAULT` (default `false`) controls whether security posture calls run by default on AWS sync.
  - `AWS_DEEP_SCAN_MAX_PAGES_PER_BUCKET` (default `0` = unlimited; set to cap deep-scan page count per bucket).
- AWS pricing assumptions (used for estimated AWS cost rows in UI):
  - `AWS_PRICING_CURRENCY`, `AWS_PRICING_REGION_LABEL`, `AWS_PRICING_SOURCE_URL`, `AWS_PRICING_AS_OF_DATE`
  - `AWS_PRICING_BYTES_PER_GB`, `AWS_PRICING_DAYS_IN_MONTH`
  - `AWS_PRICING_S3_STANDARD_GB_MONTH`, `AWS_PRICING_S3_EGRESS_GB`, `AWS_PRICING_S3_EGRESS_FREE_GB`
  - `AWS_PRICING_S3_REQUEST_UNIT_SIZE`, `AWS_PRICING_S3_REQUEST_UNIT_PRICE`, `AWS_PRICING_S3_REQUEST_LABEL`
  - `AWS_PRICING_EFS_STANDARD_GB_MONTH`

Wasabi account configuration (multi-account, no `AWS_*` env vars):

- Preferred multi-account config: `WASABI_ACCOUNTS_JSON` (JSON array).
- Optional single-account fallback: `WASABI_ACCESS_KEY`, `WASABI_SECRET_KEY`, `WASABI_ACCOUNT_ID`, `WASABI_ACCOUNT_LABEL`, `WASABI_REGION`, `WASABI_S3_ENDPOINT`, `WASABI_STATS_ENDPOINT`.
- Sync/cache controls:
  - `WASABI_SYNC_INTERVAL_HOURS` (default `24`)
  - `WASABI_CACHE_TTL_HOURS` (default `24`)
  - `WASABI_ACCOUNT_SYNC_CONCURRENCY`, `WASABI_BUCKET_SYNC_CONCURRENCY`
  - `WASABI_API_MAX_CONCURRENCY`, `WASABI_API_MIN_INTERVAL_MS`, `WASABI_API_MAX_RETRIES`, `WASABI_API_BASE_BACKOFF_MS`, `WASABI_API_MAX_BACKOFF_MS`
- Wasabi pricing controls:
  - `WASABI_PRICING_SYNC_INTERVAL_HOURS` (default `24`)
  - `WASABI_PRICING_SOURCE_URL` (default `https://wasabi.com/pricing/faq`)
  - Fallbacks/overrides: `WASABI_PRICING_CURRENCY`, `WASABI_PRICING_AS_OF_DATE`, `WASABI_PRICING_BYTES_PER_TB`, `WASABI_PRICING_DAYS_IN_MONTH`, `WASABI_PRICING_STORAGE_TB_MONTH`, `WASABI_PRICING_MIN_BILLABLE_TB`

VSAx configuration:

- Required:
  - `VSAX_BASE_URL` (example: `https://yourcompany.vsax.net`)
  - `VSAX_API_TOKEN_ID`
  - `VSAX_API_TOKEN_SECRET`
- Group filter:
  - `VSAX_GROUPS` (comma-separated or JSON array; optional. Leave empty to auto-discover all groups)
  - Optional API-side filter passthrough: `VSAX_ASSET_FILTER` (OData `$filter` text)
- Pull behavior:
  - `VSAX_INCLUDE` (default `Disks`)
  - `VSAX_DISK_VALUE_UNIT` (default `kb`; used to convert VSAx disk `TotalValue`/`FreeValue`/`UsedValue` into bytes)
  - `VSAX_PAGE_SIZE` (default `100`)
  - `VSAX_MAX_PAGES` (default `500`)
- Sync/cache + throttling:
  - `VSAX_SYNC_INTERVAL_HOURS` (default `24`)
  - `VSAX_CACHE_TTL_HOURS` (default `24`)
  - `VSAX_GROUP_SYNC_CONCURRENCY` (default `1`)
  - `VSAX_API_MAX_CONCURRENCY`, `VSAX_API_MIN_INTERVAL_MS`, `VSAX_API_MAX_RETRIES`
- VSAx pricing assumptions:
  - `VSAX_PRICING_CURRENCY`, `VSAX_PRICING_SOURCE_URL`, `VSAX_PRICING_AS_OF_DATE`
  - `VSAX_PRICING_BYTES_PER_TB`, `VSAX_PRICING_DAYS_IN_MONTH`, `VSAX_PRICING_STORAGE_TB_MONTH` (default `120`)

## Run

```bash
npm install
cp .env.example .env
# set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET in .env
npm start
```

Open `http://localhost:8787`.

For auto-reload during development:

```bash
npm run dev
```

## How cache works

- Subscriptions, storage accounts, containers, last known sizes, security profiles, and Wasabi inventory are stored in SQLite.
- `CACHE_TTL_MINUTES` controls when container size is refreshed.
- `SECURITY_CACHE_TTL_MINUTES` controls when security metadata is refreshed.
- `METRICS_CACHE_TTL_MINUTES` controls on-demand metrics cache freshness for both 24h and 30d metrics.
- `AZURE_METRICS_SYNC_INTERVAL_HOURS` controls the background Azure metrics scheduler (startup + recurring interval).
- `AWS_CACHE_TTL_HOURS` controls when AWS account/bucket metrics are refreshed in cache.
- `AWS_SYNC_INTERVAL_HOURS` controls the background AWS sync scheduler (startup + recurring interval).
- `WASABI_CACHE_TTL_HOURS` controls when Wasabi bucket usage is refreshed.
- `VSAX_CACHE_TTL_HOURS` controls when cached VSAx group disk inventory is refreshed.
- Wasabi tab displays total storage/object counts and estimated storage cost for 24h and 30d based on synced public pricing.
- VSAx tab displays total allocated/used storage and estimated storage-only cost for 24h and 30d.
- AWS tab defaults to low-cost sync (bucket list + CloudWatch storage/object metrics); deep scan is on-demand.
- Pull operations skip recently scanned containers unless forced.

## Important notes

- Container size is computed from blob metadata listing (`comp=list`) and can incur Azure transaction cost.
- No blob content is downloaded.
- If a storage account blocks public network access, size pull may fail unless this app runs from a network that can reach the blob endpoint.
- AWS low-cost mode avoids object-by-object reads and uses bucket list + CloudWatch storage/object metrics where available.
- AWS security posture pulls are separate read-only bucket-configuration API calls and do not read object contents.
- AWS deep scan uses `ListObjectsV2` across bucket contents and can incur additional API request charges.
- AWS ingress/egress/transaction metrics depend on CloudWatch S3 request metrics availability and may be blank (`-`) when not enabled.
- AWS estimates are approximations based on configured/public pricing assumptions, not a billing-system replacement.
- VSAx cost estimates are storage-only approximations from configured pricing assumptions.
- Scope total cost estimates are approximations based on synced public retail rates (or env fallback) and not an official Azure bill calculation.
- Activity logs are shown in a floating right-side drawer.
- Storage account table shows per-account progress state while pull operations are running.
- Pull-all now runs as a server-side background job so browser refresh does not stop an active run.

## Running the Docker Container

You can easily start the application using Docker by passing your `.env` configuration file directly to `docker run`. 

```bash
docker run -d \
  --name cloudstoragestudio \
  --env-file .env \
  -p 8787:8787 \
  -v ./data:/app/data \
  ghcr.io/techcrazi/cloudstoragestudio:latest
```

## Container Scan via Trivy

#### Install Trivy
```bash
brew install trivy
```

#### Scan Image
```bash
trivy image ghcr.io/techcrazi/cloudstoragestudio:latest
```

## Container Scan via Slim

#### Install Slim MAC
```bash
brew install docker-slim
```

#### Install Slim Windows
 - Enable WSL on Windows Desktop
 - Install Docker Desktop
 - Install Ubuntu WSL image

```powershell
wsl --install -d Ubuntu
```
 - Update Docker Desktop Settings
    
  - Open Docker Desktop → Settings
  - Go to:
  - Resources → WSL Integration

  - Turn ON:
	  -  Enable integration with my default WSL distro
	  -  Ubuntu

  - Click Apply & Restart

  - SSH into Ubuntu WSL
  - Install Slim
  ```bash
  curl -sL https://raw.githubusercontent.com/slimtoolkit/slim/master/scripts/install-slim.sh | sudo -E bash -
  ```

##### Scan & Build Image AMD64 (On Intel or AMD Processor)
```bash
slim build \
  --target ghcr.io/techcrazi/cloudstoragestudio:latest \
  --tag ghcr.io/techcrazi/cloudstoragestudio:slim-amd64 \
  --image-build-arch amd64 \
  --publish-port 8787:8787 \
  --include-path '/app' \
  --env AZURE_TENANT_ID="your-tenant-id" \
  --env AZURE_CLIENT_ID="your-client-id" \
  --env AZURE_CLIENT_SECRET="your-client-secret" \
  --env AWS_DEFAULT_ACCESS_KEY_ID="your-aws-access-key" \
  --env AWS_DEFAULT_SECRET_ACCESS_KEY="your-aws-secret-key" \
  --env WASABI_ACCOUNTS_JSON="[{\"accountId\":\"wasabi-1\",\"accessKey\":\"key\",\"secretKey\":\"secret\",\"region\":\"us-east-1\"}]" \
  --env VSAX_BASE_URL="your-vsax-url" \
  --env VSAX_API_TOKEN_ID="your-vsax-token-id" \
  --env VSAX_API_TOKEN_SECRET="your-vsax-token-secret"
```

  - Original Image: 174 MB
  - Slim Image: 55 MB

##### Scan & Build Image ARM64 (On Apple or ARM Processor)
```bash
slim build \
  --target ghcr.io/techcrazi/cloudstoragestudio:latest \
  --tag ghcr.io/techcrazi/cloudstoragestudio:slim-arm64 \
  --image-build-arch arm64 \
  --publish-port 8787:8787 \
  --include-path '/app' \
  --env AZURE_TENANT_ID="your-tenant-id" \
  --env AZURE_CLIENT_ID="your-client-id" \
  --env AZURE_CLIENT_SECRET="your-client-secret" \
  --env AWS_DEFAULT_ACCESS_KEY_ID="your-aws-access-key" \
  --env AWS_DEFAULT_SECRET_ACCESS_KEY="your-aws-secret-key" \
  --env WASABI_ACCOUNTS_JSON="[{\"accountId\":\"wasabi-1\",\"accessKey\":\"key\",\"secretKey\":\"secret\",\"region\":\"us-east-1\"}]" \
  --env VSAX_BASE_URL="your-vsax-url" \
  --env VSAX_API_TOKEN_ID="your-vsax-token-id" \
  --env VSAX_API_TOKEN_SECRET="your-vsax-token-secret"
```
  - Original Image: 165 MB
  - Slim Image: 56 MB

##### Image Testing
```bash
slim build \
  --target ghcr.io/techcrazi/cloudstoragestudio:latest \
  --tag ghcr.io/techcrazi/cloudstoragestudio:slim-arm64 \
  --image-build-arch arm64 \
  --publish-port 8787:8787 \
  --continue-after=enter \
  --include-path '/app' \
  --env AZURE_TENANT_ID="your-tenant-id" \
  --env AZURE_CLIENT_ID="your-client-id" \
  --env AZURE_CLIENT_SECRET="your-client-secret" \
  --env AWS_DEFAULT_ACCESS_KEY_ID="your-aws-access-key" \
  --env AWS_DEFAULT_SECRET_ACCESS_KEY="your-aws-secret-key" \
  --env WASABI_ACCOUNTS_JSON="[{\"accountId\":\"wasabi-1\",\"accessKey\":\"key\",\"secretKey\":\"secret\",\"region\":\"us-east-1\"}]" \
  --env VSAX_BASE_URL="your-vsax-url" \
  --env VSAX_API_TOKEN_ID="your-vsax-token-id" \
  --env VSAX_API_TOKEN_SECRET="your-vsax-token-secret"
```

##### Push Slim Image to GHCR
```bash
docker login
docker push ghcr.io/techcrazi/cloudstoragestudio:slim-amd64
docker push ghcr.io/techcrazi/cloudstoragestudio:slim-arm64

docker manifest create ghcr.io/techcrazi/cloudstoragestudio:slim \
  --amend ghcr.io/techcrazi/cloudstoragestudio:slim-amd64 \
  --amend ghcr.io/techcrazi/cloudstoragestudio:slim-arm64

docker manifest push ghcr.io/techcrazi/cloudstoragestudio:slim
```
