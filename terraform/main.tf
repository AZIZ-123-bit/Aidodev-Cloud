# Artifact Registry Repository
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "${var.app_name}-repo"
  description   = "Docker repository for ${var.app_name}"
  format        = "DOCKER"
}

# Cloud Storage Bucket
resource "google_storage_bucket" "bucket" {
  name                        = "${var.project_id}-${var.app_name}-assets"
  location                    = var.region
  force_destroy               = true
  uniform_bucket_level_access = true
}

# ── Backend Cloud Run Service ──
resource "google_cloud_run_service" "backend" {
  name     = "${var.app_name}-backend"
  location = var.region

  template {
    spec {
      containers {
        image = var.backend_image
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# ── Frontend Cloud Run Service ──
resource "google_cloud_run_service" "frontend" {
  name     = "${var.app_name}-frontend"
  location = var.region

  template {
    spec {
      containers {
        image = var.frontend_image
        env {
          # Pass the deployed backend URL so server-side Next.js code can reach it.
          # For client-side fetches, rebuild the frontend image with the correct
          # NEXT_PUBLIC_API_URL build arg (Next.js embeds it at build time).
          name  = "NEXT_PUBLIC_API_URL"
          value = google_cloud_run_service.backend.status[0].url
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_cloud_run_service.backend]
}

# ── IAM: allow unauthenticated access to both services ──
data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_service_iam_policy" "backend_noauth" {
  location    = google_cloud_run_service.backend.location
  project     = google_cloud_run_service.backend.project
  service     = google_cloud_run_service.backend.name
  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_service_iam_policy" "frontend_noauth" {
  location    = google_cloud_run_service.frontend.location
  project     = google_cloud_run_service.frontend.project
  service     = google_cloud_run_service.frontend.name
  policy_data = data.google_iam_policy.noauth.policy_data
}
