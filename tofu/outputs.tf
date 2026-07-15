# Outputs for Terraform configuration
# Environment: dev

output "app_service_plan_id" {
  description = "App Service Plan ID"
  value       = module.shared_plan.id
}

output "calculator-api_id" {
  description = "Resource ID of calculator-api"
  value       = module.calculator_api_app.id
}

output "calculator-api_url" {
  description = "URL of calculator-api"
  value       = module.calculator_api_app.default_hostname
}

output "frontend-web-app_url" {
  description = "URL of frontend-web-app"
  value       = module.frontend_app.default_host_name
}

output "log_analytics_workspace_id" {
  description = "Log Analytics Workspace ID"
  value       = module.log_analytics.id
}

output "resource_group_id" {
  description = "Resource group ID"
  value       = module.main_rg.id
}

output "resource_group_name" {
  description = "Resource group name"
  value       = module.main_rg.name
}
