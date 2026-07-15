# Terraform configuration generated from Resource Plan
# Environment: dev
# Generated from deterministic resource plan (Phase 2)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.116.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.5.0"
    }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {}
}

# Merge var.environment into tags so every resource carries the environment label.
# This ensures var.environment is consumed and not dead code.
locals {
  common_tags = merge(var.tags, { environment = var.environment })
}

# ========================================
# Phase: 1 Foundation
# ========================================

# Module: main_rg (azurerm_resource_group)
module "main_rg" {
  source = "./modules/azure-resource-group"

  location = var.location
  name     = "Test04-dev-rg"
  tags     = local.common_tags
}

# Module: log_analytics (azurerm_log_analytics_workspace)
module "log_analytics" {
  source = "./modules/azure-log-analytics-workspace"

  location            = var.location
  name                = "test04-dev-log"
  resource_group_name = module.main_rg.name
  retention_in_days   = 30
  sku                 = "PerGB2018"
  tags                = local.common_tags
}

# ========================================
# Phase: 2 Shared Infrastructure
# ========================================

# Module: shared_plan (azurerm_service_plan)
module "shared_plan" {
  source = "./modules/azure-app-service-plan"

  kind                = "Linux"
  location            = var.location
  name                = "Test04-dev-plan"
  resource_group_name = module.main_rg.name
  sku = {
    tier     = "Basic"
    size     = "B1"
    capacity = 1
  }
  tags = local.common_tags
}

# ========================================
# Phase: 4 Compute
# ========================================

# Module: frontend_app (azurerm_static_site)
module "frontend_app" {
  source = "./modules/azure-static-site"

  app_settings = {
    BACKEND_API_URL = "https://${module.calculator_api_app.default_hostname}"
  }
  location            = var.location
  name                = "test04-dev-frontend"
  resource_group_name = module.main_rg.name
  sku_size            = "Free"
  sku_tier            = "Free"
  tags                = local.common_tags
}

# Module: calculator_api_app (azurerm_linux_web_app)
module "calculator_api_app" {
  source = "./modules/azure-linux-web-app"

  app_settings = {
  }
  enable_system_identity = true
  https_only             = true
  location               = var.location
  name                   = "test04-dev-backend"
  resource_group_name    = module.main_rg.name
  runtime_stack = {
    language = "node"
    version  = var.calculator_api_node_version
  }
  service_plan_id = module.shared_plan.id
  tags            = local.common_tags
}
