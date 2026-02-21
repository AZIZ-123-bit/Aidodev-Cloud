output "artifact_registry_url" {
  description = "The URL of the Artifact Registry repository"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.repo.name}"
}

output "backend_url" {
  description = "The URL of the backend Cloud Run service"
  value       = google_cloud_run_service.backend.status[0].url
}

output "frontend_url" {
  description = "The URL of the frontend Cloud Run service"
  value       = google_cloud_run_service.frontend.status[0].url
}

output "bucket_name" {
  description = "The name of the created Cloud Storage bucket"
  value       = google_storage_bucket.bucket.name
}
